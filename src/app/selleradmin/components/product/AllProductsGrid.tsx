'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Edit, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import EditProductModal from './EditProductModal';

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DisplayProduct | null>(null);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=1000');
      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert API products to display format
        const displayProducts: DisplayProduct[] = result.data.map((p: Product) => ({
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
        }));
        
        setProducts(displayProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId !== null) {
      try {
        // Call API to delete product
        const response = await fetch(`/api/products/${deleteTargetId}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          setDeletedIds((prev) => {
            const next = new Set(prev);
            next.add(deleteTargetId);
            return next;
          });
          onDelete?.(deleteTargetId);
          // Refresh products list
          await fetchProducts();
        } else {
          alert(`Error: ${result.error || 'Failed to delete product'}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product');
      } finally {
        setDeleteTargetId(null);
        setDeleteTargetName('');
        setDeleteModalOpen(false);
      }
    }
  };

  const handleEdit = async (product: DisplayProduct) => {
    try {
      // Fetch full product data with all images
      const response = await fetch(`/api/products/${product.id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert API product to display format with all images
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
        // Store full product data including all images
        setEditingProduct({ ...fullProduct, images: result.data.images || [] } as any);
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
      // Prepare update data - ensure images array is included
      const updateData: any = {
        ...data,
        images: (data as any).images || [],
      };
      
      // Call API to update product
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh products list
        await fetchProducts();
        setEditModalOpen(false);
        setEditingProduct(null);
      } else {
        alert(`Error: ${result.error || 'Failed to update product'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product');
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
                {product.image && product.image.startsWith('data:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={product.image || '/placeholder-image.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                )}
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
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
          setDeleteTargetName('');
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={deleteTargetName}
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

