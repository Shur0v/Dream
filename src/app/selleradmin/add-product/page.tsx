'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddProductForm from '../components/product/AddProductForm';
import { useRouter } from 'next/navigation';

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  sizes: string[];
  colors: string[];
  tags: string[];
  specifications: Record<string, string>;
  sellerId?: string;
  seller?: string;
  images: string[];
};

export default function AddProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: ProductFormData) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      // Fetch colors to map color names to color IDs
      const colorsResponse = await fetch('/api/colors');
      if (!colorsResponse.ok) {
        throw new Error('Failed to fetch colors');
      }
      const colorsData = await colorsResponse.json();
      const colors = colorsData.data || [];

      // Map color names to color IDs
      const colorIds = (data.colors || []).map((colorName: string) => {
        const color = colors.find((c: any) => 
          c.name.toLowerCase() === colorName.toLowerCase()
        );
        return color ? color.id : null;
      }).filter(Boolean);

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
        colors: colorIds.length > 0 ? colorIds : undefined,
        size: data.sizes || [],
        tags: data.tags || [],
        specifications: data.specifications || {},
        sellerId: data.sellerId || 'seller-1',
      };

      // Save product via API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
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


