'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products as allProducts, Product } from '@/lib/productData';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

interface AllProductsGridProps {
  onDelete?: (id: number) => void;
}

export default function AllProductsGrid({ onDelete }: AllProductsGridProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const perPage = 30;
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');

  // Sort products: newest first (by id descending, or createdAt if available)
  const sortedProducts = useMemo(() => {
    return [...allProducts].sort((a, b) => {
      // If createdAt exists, use it; otherwise use id (higher id = newer)
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.id - a.id;
    });
  }, []);

  // Filter out deleted products
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((p) => !deletedIds.has(p.id));
  }, [sortedProducts, deletedIds]);

  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  const pageData = filteredProducts.slice(start, end);

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId !== null) {
      setDeletedIds((prev) => {
        const next = new Set(prev);
        next.add(deleteTargetId);
        return next;
      });
      onDelete?.(deleteTargetId);
      setDeleteTargetId(null);
      setDeleteTargetName('');
    }
  };

  const handleEdit = (productId: number) => {
    router.push(`/selleradmin/add-product?id=${productId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-slate-950 text-2xl font-bold font-['Poppins']">All Products</h1>
        <div className="text-zinc-500 text-sm font-normal font-['Poppins']">
          {total === 0 ? 'No products' : `Showing ${start + 1} to ${end} out of ${total} products`}
        </div>
      </div>

      {/* Products Grid */}
      {pageData.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {pageData.map((product) => (
            <div
              key={product.id}
              className="w-full bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="w-full aspect-square relative bg-neutral-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col gap-3">
                {/* Product Name */}
                <h3 className="text-slate-950 text-sm font-semibold font-['Poppins'] line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Product ID */}
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-xs font-normal font-['Poppins']">ID:</span>
                  <span className="text-zinc-700 text-xs font-medium font-['Poppins']">{product.id}</span>
                </div>

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
                    onClick={() => handleEdit(product.id)}
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
    </div>
  );
}

