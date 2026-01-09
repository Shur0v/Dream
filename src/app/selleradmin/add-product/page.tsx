'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddProductForm, { ProductFormData } from '../components/product/AddProductForm';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/apiConfig';

export default function AddProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: ProductFormData) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      console.log('[AddProductPage] Received form data:', data);
      console.log('[AddProductPage] Colors from form:', data.colors);
      console.log('[AddProductPage] Colors type:', typeof data.colors, Array.isArray(data.colors));
      
      // data.colors already contains color IDs from SearchableMultiSelect
      // So we can use them directly, but let's validate them first
      let colorIds: string[] = [];
      
      if (data.colors && Array.isArray(data.colors) && data.colors.length > 0) {
        console.log('[AddProductPage] Processing colors array:', data.colors);
        
        // Fetch colors to validate the IDs
        const colorsResponse = await fetch(getApiUrl('colors'));
        if (colorsResponse.ok) {
          const colorsData = await colorsResponse.json();
          const colors = colorsData.data || [];
          console.log('[AddProductPage] Available colors from API:', colors);
          
          // Check if data.colors are already color IDs (like "color-1", "color-2")
          // or if they are color names that need to be mapped
          colorIds = (data.colors || []).map((colorValue: string) => {
            console.log('[AddProductPage] Processing color value:', colorValue);
            
            // If it's already a color ID (starts with "color-"), use it directly
            if (colorValue && colorValue.startsWith('color-')) {
              // Validate that this color ID exists
              const color = colors.find((c: any) => c.id === colorValue);
              console.log('[AddProductPage] Found color by ID:', color);
              return color ? color.id : null;
            }
            // Otherwise, treat it as a color name and find the ID
            const color = colors.find((c: any) => 
              c.name.toLowerCase() === colorValue.toLowerCase() || c.id === colorValue
            );
            console.log('[AddProductPage] Found color by name:', color);
            return color ? color.id : null;
          }).filter((id): id is string => id !== null && id !== undefined);
          
          console.log('[AddProductPage] Final color IDs after processing:', colorIds);
        } else {
          // If colors API fails, use the colors as-is (they should be IDs)
          console.warn('[AddProductPage] Colors API failed, using colors as-is');
          colorIds = (data.colors || []).filter((c): c is string => 
            typeof c === 'string' && c.startsWith('color-')
          );
        }
      } else {
        console.log('[AddProductPage] No colors in form data or empty array');
      }

      // Prepare product data for API
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        images: data.images || [],
        category: data.category,
        subcategory: data.subcategory,
        brand: data.brand,
        sku: data.sku,
        stock: data.stock,
        colors: colorIds.length > 0 ? colorIds : [], // Always send array, never undefined
        size: data.sizes || [],
        tags: data.tags || [],
        specifications: data.specifications || {},
        sellerId: data.sellerId || 'seller-1',
      };
      
      console.log('[AddProductPage] Final product data to send:', productData);
      console.log('[AddProductPage] Colors in product data:', productData.colors);

      // Save product via API
      const response = await fetch(getApiUrl('products'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        // Invalidate admin cache so stats refresh
        try {
          const { invalidateAdminOrdersCache } = await import('@/lib/indexeddb/adminCache');
          await invalidateAdminOrdersCache();
        } catch (e) {
          // Silent fail
        }
        
        // Invalidate client-side cache
        try {
          const { clearClientAPICache } = await import('@/lib/indexeddb/apiCache');
          await clearClientAPICache();
          // Dispatch event to notify client-side components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('dashboard:invalidate-cache'));
          }
        } catch (e) {
          // Silent fail
        }
        
        alert('Product saved successfully!');
        // Add a timestamp to force refresh
        router.push(`/selleradmin/all-products?refresh=${Date.now()}`);
        router.refresh();
      } else {
        alert(`Error: ${result.error || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`An error occurred while saving the product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <AddProductForm
        onBack={() => router.back()}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </DashboardLayout>
  );
}


