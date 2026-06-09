'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Edit, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HomepageProductSection, Product } from '@/types';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import EditProductModal from './EditProductModal';
import { getApiUrl } from '@/lib/apiConfig';

interface AllProductsGridProps {
  onDelete?: (id: string) => void;
}

// Convert API Product to display format
type DisplayProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  createdAt?: string;
  updatedAt?: string;
  sku?: string;
  stock?: number;
  resellerCommissionType?: 'percentage' | 'fixed';
  commissionValue?: number;
  homepagePlacement?: HomepageProductSection;
};

export default function AllProductsGrid({ onDelete }: AllProductsGridProps) {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const perPage = 30;
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DisplayProduct | null>(null);

  // Store raw products data
  const [rawProducts, setRawProducts] = useState<Product[]>([]);

  // Memoize products transformation
  const displayProducts = useMemo(() => {
    return rawProducts.map((p: Product) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      currency: '৳',
      image: p.images && p.images.length > 0 ? p.images[0] : '/placeholder-image.png',
      images: p.images,
      category: p.category,
      brand: p.brand,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      sku: p.sku,
      stock: p.stock,
      resellerCommissionType: p.resellerCommissionType,
      commissionValue: p.commissionValue,
    }));
  }, [rawProducts]);

  // Fetch products from API without localStorage caching (to avoid quota issues)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Remove old cache to free up space
      try {
        localStorage.removeItem('products_cache');
        localStorage.removeItem('products_cache_timestamp');
      } catch (e) {
        // Ignore errors when clearing cache
      }
      
      const response = await fetch(getApiUrl('products?limit=40'));
      const result = await response.json();
      
      if (result.success && result.data) {
        // Log first product to see what ID format we're getting
        if (result.data.length > 0) {
          console.log('[AllProductsGrid] Sample product ID from API:', {
            id: result.data[0].id,
            name: result.data[0].name,
            idType: typeof result.data[0].id,
            isObjectId: /^[0-9a-fA-F]{24}$/.test(result.data[0].id || ''),
            idLength: result.data[0].id?.length
          });
        }
        setRawProducts(result.data);
        // Don't cache to localStorage to avoid quota issues
        // Products will be fetched fresh each time
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update products when displayProducts changes
  useEffect(() => {
    setProducts(displayProducts);
  }, [displayProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Refresh when URL has refresh parameter (e.g., when navigating back from add product)
  useEffect(() => {
    const refresh = searchParams?.get('refresh');
    if (refresh) {
      fetchProducts();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  // Refresh when page becomes visible (e.g., when navigating back from add product)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchProducts]);

  // Sort products: newest first (by createdAt)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [products]);

  // Filter out deleted products
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((p) => !deletedIds.has(p.id));
  }, [sortedProducts, deletedIds]);

  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  const pageData = filteredProducts.slice(start, end);

  const handleDeleteClick = (id: string, name: string) => {
    console.log('[AllProductsGrid] Delete clicked for product:', { id, name, idType: typeof id });
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId !== null && !isDeleting) {
      setIsDeleting(true);
      try {
        // Use the product ID as-is (could be MongoDB ObjectId or custom id format)
        const productId = deleteTargetId;
        
        console.log(`[AllProductsGrid] Attempting to delete product with ID: ${productId}`);
        console.log(`[AllProductsGrid] ID details:`, {
          id: productId,
          type: typeof productId,
          length: productId.length,
          isObjectId: /^[0-9a-fA-F]{24}$/.test(productId),
          startsWithProduct: productId.startsWith('product-')
        });
        
        // Call API to delete product - use centralized API config
        const { getApiUrl } = await import('@/lib/apiConfig');
        const deleteUrl = getApiUrl(`products/${encodeURIComponent(productId)}`);
        console.log(`[AllProductsGrid] Delete URL: ${deleteUrl}`);
        
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText || 'Failed to delete product' };
          }
          const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
          console.error(`[AllProductsGrid] Delete failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
        
        const result = await response.json();
        
        if (result.success) {
          console.log(`[AllProductsGrid] Product deleted successfully: ${productId}`);
          setDeletedIds((prev) => {
            const next = new Set(prev);
            next.add(deleteTargetId);
            return next;
          });
          onDelete?.(deleteTargetId);
          
          // Clear cache to force fresh data
          localStorage.removeItem('products_cache');
          localStorage.removeItem('products_cache_timestamp');
          
          // Invalidate client-side IndexedDB cache
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
          
          // Refresh products list
          await fetchProducts();
          
          // Close modal after successful delete
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
          setDeleteTargetName('');
        } else {
          throw new Error(result.error || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting the product';
        alert(`Error: ${errorMessage}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = async (product: DisplayProduct) => {
    try {
      // Fetch full product data with all images from Express backend
      const { getApiUrl } = await import('@/lib/apiConfig');
      const response = await fetch(getApiUrl(`products/${product.id}`));
      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert API product to display format with all images and colors
        const fullProduct: DisplayProduct = {
          id: result.data.id,
          name: result.data.name,
          price: result.data.price,
          originalPrice: result.data.originalPrice,
          currency: '৳',
          image: result.data.images && result.data.images.length > 0 ? result.data.images[0] : '/placeholder-image.png',
          images: result.data.images || [],
          category: result.data.category,
          brand: result.data.brand,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
          sku: result.data.sku,
          stock: result.data.stock,
        };
        // Store full product data including all images, colors, and other fields
        setEditingProduct({ 
          ...fullProduct, 
          images: result.data.images || [],
          colors: result.data.colors || [],
          sizes: result.data.size || [],
          description: result.data.description || '',
          subcategory: result.data.subcategory || '',
          tags: result.data.tags || [],
          specifications: result.data.specifications || {},
          isActive: result.data.isActive !== undefined ? result.data.isActive : true,
        } as any);
        setEditModalOpen(true);
      } else {
        // Fallback to display product if API fails
        setEditingProduct(product);
        setEditModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Fallback to display product if API fails
      setEditingProduct(product);
      setEditModalOpen(true);
    }
  };

  const handleEditSave = async (data: Partial<DisplayProduct>) => {
    if (!editingProduct) return;
    
    try {
      // Prepare update data - ensure all required fields are included and match backend format
      const updateData: any = {
        name: data.name || editingProduct.name,
        description: (data as any).description || '',
        price: data.price !== undefined ? data.price : editingProduct.price,
        originalPrice: data.originalPrice !== undefined ? data.originalPrice : editingProduct.originalPrice,
        images: (data as any).images && Array.isArray((data as any).images) ? (data as any).images : (editingProduct.images || []),
        category: data.category || editingProduct.category,
        subcategory: (data as any).subcategory || '',
        brand: (data as any).brand || editingProduct.brand || '',
        sku: (data as any).sku || editingProduct.sku || '',
        stock: data.stock !== undefined ? data.stock : editingProduct.stock,
        resellerCommissionType: (data as any).resellerCommissionType || editingProduct.resellerCommissionType || 'percentage',
        commissionValue: (data as any).commissionValue !== undefined ? (data as any).commissionValue : editingProduct.commissionValue ?? 10,
        colors: (data as any).colors && Array.isArray((data as any).colors) ? (data as any).colors : [],
        size: (data as any).sizes && Array.isArray((data as any).sizes) ? (data as any).sizes : [], // Backend expects 'size' not 'sizes'
        tags: (data as any).tags && Array.isArray((data as any).tags) ? (data as any).tags : [],
        specifications: (data as any).specifications || {},
        isActive: (data as any).isActive !== undefined ? (data as any).isActive : true,
      };
      
      // Remove undefined values to avoid sending them
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      console.log('[AllProductsGrid] Updating product:', editingProduct.id, updateData);
      
      // Call Express backend API to update product
      const { getApiUrl } = await import('@/lib/apiConfig');
      const response = await fetch(getApiUrl(`products/${editingProduct.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const homepagePlacement = (data as any).homepagePlacement as HomepageProductSection | undefined;
        if (homepagePlacement) {
          const placementResponse = await fetch('/api/homepage-products/placement', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: editingProduct.id,
              section: homepagePlacement,
            }),
          });

          const placementResult = await placementResponse.json();
          if (!placementResponse.ok || !placementResult.success) {
            throw new Error(placementResult.error || 'Product updated, but homepage placement failed');
          }
        }

        console.log('[AllProductsGrid] Product updated successfully:', result.data);
        // Invalidate cache
        localStorage.removeItem('products_cache');
        localStorage.removeItem('products_cache_timestamp');
        
        // Invalidate client-side IndexedDB cache
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
        
        // Refresh products list
        await fetchProducts();
        setEditModalOpen(false);
        setEditingProduct(null);
        // Show success message
        alert('Product updated successfully!');
      } else {
        console.error('[AllProductsGrid] Update failed:', result);
        alert(`Error: ${result.error || 'Failed to update product'}`);
      }
    } catch (error) {
      console.error('[AllProductsGrid] Error updating product:', error);
      alert(`An error occurred while updating the product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-slate-950 text-2xl font-bold font-['Poppins']">All Products</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
            aria-label="Refresh products"
          >
            <RefreshCw className={cn('w-5 h-5 text-zinc-700', loading && 'animate-spin')} />
          </button>
          <div className="text-zinc-500 text-sm font-normal font-['Poppins']">
            {loading ? 'Loading...' : total === 0 ? 'No products' : `Showing ${start + 1} to ${end} out of ${total} products`}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="w-full py-12 text-center text-zinc-500 text-base font-normal font-['Poppins']">
          Loading products...
        </div>
      ) : pageData.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {pageData.map((product) => (
            <div
              key={product.id}
              className="w-full bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="w-full aspect-square relative bg-neutral-50">
                <Image
                  src={product.image || '/placeholder-image.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={85}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col gap-3">
                {/* Product Name */}
                <h3 className="text-slate-950 text-sm font-semibold font-['Poppins'] line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* SKU */}
                {product.sku && (
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-xs font-normal font-['Poppins']">SKU:</span>
                    <span className="text-zinc-700 text-xs font-medium font-['Poppins']">{product.sku}</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-950 text-base font-bold font-['Poppins']">
                    {product.currency || '৳'}{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-zinc-400 text-sm font-normal font-['Poppins'] line-through">
                      {product.currency || '৳'}{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Category & Brand */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-zinc-500 font-normal font-['Poppins']">{product.category}</span>
                  {product.brand && (
                    <>
                      <span className="text-zinc-300">•</span>
                      <span className="text-zinc-500 font-normal font-['Poppins']">{product.brand}</span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 h-9 px-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-sm font-medium font-['Poppins'] transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product.id, product.name)}
                    className="h-9 w-9 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 flex items-center justify-center"
                    aria-label="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-12 text-center text-zinc-500 text-base font-normal font-['Poppins']">
          No products found
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full flex items-center justify-center gap-3">
          <button
            className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-700" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              const active = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium font-["Poppins"] border transition-colors',
                    active
                      ? 'bg-fuchsia-500 text-white border-fuchsia-500'
                      : 'bg-white text-zinc-900 border-neutral-200 hover:bg-neutral-50'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 text-zinc-700" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={deleteTargetName}
        isLoading={isDeleting}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleEditSave}
        onImagesUpdate={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
}

