'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MoreVertical, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimpleSelect from '../ui/SimpleSelect';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import { Product, FeaturedProduct } from '@/types';

export type TableMode = 'all' | 'featured' | 'best-selling';

interface ProductTableProps {
  mode?: TableMode;
}

export default function ProductTable({ mode = 'all' }: ProductTableProps) {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set());
  const [bestIds, setBestIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | ''>('');

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?limit=100`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured products from API
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/featured-products`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setFeaturedProducts(result.data);
        setFeaturedIds(new Set(result.data.map((fp: FeaturedProduct) => fp.productId)));
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
  }, [fetchProducts, fetchFeaturedProducts]);

  // Categories filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (deletedIds.has(p.id)) return false;
      if (!p.isActive) return false;
      const nameOk = p.name.toLowerCase().includes(query.trim().toLowerCase());
      const catOk = category ? p.category === category : true;
      return nameOk && catOk;
    });
  }, [query, category, deletedIds, products]);

  const data = filtered;
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  const pageData = data.slice(start, end);

  const toggleFeatured = async (productId: string) => {
    console.log('Toggle featured clicked for product:', productId);
    const isFeatured = featuredIds.has(productId);
    console.log('Is currently featured:', isFeatured);
    
    try {
      if (isFeatured) {
        // Remove from featured
        const featuredProduct = featuredProducts.find(fp => fp.productId === productId);
        console.log('Featured product to remove:', featuredProduct);
        if (featuredProduct) {
          const response = await fetch(`/api/featured-products/${featuredProduct.id}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          console.log('Delete response:', result);
          
          if (result.success) {
            setFeaturedIds((prev) => {
              const next = new Set(prev);
              next.delete(productId);
              return next;
            });
            await fetchFeaturedProducts(); // Refresh list
          } else {
            console.error('Failed to remove featured product:', result.error);
            alert(result.error || 'Failed to remove featured product');
          }
        } else {
          console.warn('Featured product not found in list');
        }
      } else {
        // Add to featured
        console.log('Adding product to featured:', productId);
        const response = await fetch(`/api/featured-products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
        const result = await response.json();
        console.log('Add response:', result);
        
        if (result.success) {
          setFeaturedIds((prev) => {
            const next = new Set(prev);
            next.add(productId);
            return next;
          });
          await fetchFeaturedProducts(); // Refresh list
        } else {
          console.error('Failed to add featured product:', result.error);
          alert(result.error || 'Failed to add featured product');
        }
      }
    } catch (error) {
      console.error('Error toggling featured product:', error);
      alert('An error occurred. Please check the console for details.');
    }
  };

  const toggleBest = (id: string) => {
    setBestIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId !== null) {
      setDeletedIds((prev) => {
        const next = new Set(prev);
        next.add(deleteTargetId);
        return next;
      });
      setDeleteTargetId(null);
      setDeleteTargetName('');
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-neutral-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Filters + Summary */}
      <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="h-11 w-full md:w-64 px-4 rounded-lg border border-gray-200 bg-white text-sm outline-none text-zinc-900 placeholder:text-zinc-500"
          />
          <SimpleSelect
            value={(category as any) || ''}
            onChange={(v) => setCategory(v)}
            options={["", ...categories] as readonly string[]}
            placeholder="All categories"
            controlClassName="h-11 px-4 rounded-lg border border-gray-200"
          />
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-sm">Showing</span>
            <div className="w-16 h-11 bg-white rounded-lg border border-gray-200 grid place-items-center">
              <span className="text-zinc-950 text-sm">{perPage}</span>
            </div>
          </div>
          <div className="text-zinc-400 text-sm">
            {total === 0 ? 'No records' : `Showing ${start + 1} to ${end} out of ${total} records`}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 bg-neutral-100 text-zinc-600 text-sm font-semibold">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">Product Image</div>
            <div className="flex-1">Product Name</div>
            <div className="flex-1 text-center">Date</div>
            <div className="flex-1 text-center">Color</div>
            <div className="flex-1 text-center">Category</div>
            <div className="flex-1 text-center">Amount</div>
            <div className="flex-1 text-center">Status</div>
            <div className="flex-1 text-center">Action</div>
          </div>
        </div>

        {/* Rows */}
        {pageData.map((p) => (
          <div key={p.id} className="px-6 py-4 border-t border-neutral-200 text-sm hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex-1 grid place-items-center">
                <Image 
                  src={p.images && p.images.length > 0 ? p.images[0] : '/placeholder-product.png'} 
                  alt={p.name} 
                  width={40} 
                  height={40} 
                  className="w-10 h-10 rounded-[10px] border object-cover" 
                />
              </div>
              <div className="flex-1 text-neutral-950 truncate">{p.name}</div>
              <div className="flex-1 text-center text-neutral-950">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</div>
              <div className="flex-1 text-center text-neutral-950">{p.colors && p.colors.length > 0 ? p.colors[0] : '-'}</div>
              <div className="flex-1 text-center text-neutral-950">{p.category}</div>
              <div className="flex-1 text-center text-neutral-900">${p.price.toFixed(2)}</div>
              <div className="flex-1 text-center text-neutral-900">{p.isActive ? 'Active' : 'Inactive'}</div>
              <div className="flex-1 grid place-items-center">
                <div className="relative inline-flex items-center">
                  {(mode === 'all' || mode === 'featured') && (
                    <button
                      type="button"
                      title="Toggle Featured"
                      className={cn('p-2 rounded-md outline outline-1 outline-gray-200 hover:bg-neutral-50 mr-2', featuredIds.has(p.id) && 'bg-yellow-50')}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFeatured(p.id);
                      }}
                    >
                      <Star className={cn('w-5 h-5', featuredIds.has(p.id) ? 'text-yellow-500' : 'text-neutral-800')} />
                    </button>
                  )}
                  {(mode === 'all' || mode === 'best-selling') && (
                    <button
                      title="Toggle Best Selling"
                      className={cn('p-2 rounded-md outline outline-1 outline-gray-200 hover:bg-neutral-50', bestIds.has(p.id) && 'bg-green-50')}
                      onClick={() => toggleBest(p.id)}
                    >
                      <TrendingUp className={cn('w-5 h-5', bestIds.has(p.id) ? 'text-green-600' : 'text-neutral-800')} />
                    </button>
                  )}
                  <button
                    className="p-2 rounded-md outline outline-1 outline-gray-200 hover:bg-neutral-50 ml-2"
                    aria-label="More"
                    onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                  >
                    <MoreVertical className="w-5 h-5 text-neutral-800" />
                  </button>

                  {openMenuId === p.id && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg rounded-md p-2 z-50 min-w-[140px]">
                      <button
                        onClick={() => handleDeleteClick(p.id, p.name)}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {pageData.length === 0 && (
          <div className="px-6 py-12 text-center text-neutral-500">No products found</div>
        )}
      </div>

      {/* Bottom Pagination */}
      <div className="w-full flex items-center justify-center gap-3 mt-2">
        <button
          className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).slice(0, 4).map((_, i) => {
            const num = i + 1;
            const active = num === page;
            return (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={cn('px-4 py-2.5 rounded-lg text-sm border', active ? 'bg-fuchsia-500 text-white border-fuchsia-500' : 'bg-white text-zinc-900 border-neutral-200 hover:bg-neutral-50')}
              >
                {num}
              </button>
            );
          })}
        </div>
        <button
          className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

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
    </div>
  );
}


