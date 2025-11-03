'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MoreVertical, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products as allProducts, getBestSellingProducts, getFeaturedProducts } from '@/lib/productData';
import SimpleSelect from '../ui/SimpleSelect';

export type TableMode = 'all' | 'featured' | 'best-selling';

interface ProductTableProps {
  mode?: TableMode;
}

export default function ProductTable({ mode = 'all' }: ProductTableProps) {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const [featuredIds, setFeaturedIds] = useState<Set<number>>(
    () => new Set(getFeaturedProducts().map((p) => p.id))
  );
  const [bestIds, setBestIds] = useState<Set<number>>(
    () => new Set(getBestSellingProducts().map((p) => p.id))
  );

  // Filters
  const categories = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | ''>('');

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (deletedIds.has(p.id)) return false;
      const nameOk = p.name.toLowerCase().includes(query.trim().toLowerCase());
      const catOk = category ? p.category === category : true;
      return nameOk && catOk;
    });
  }, [query, category, deletedIds]);

  const data = filtered;
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  const pageData = data.slice(start, end);

  const toggleFeatured = (id: number) => {
    setFeaturedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleBest = (id: number) => {
    setBestIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteProduct = (id: number) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setOpenMenuId(null);
  };

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
                <Image src={p.image} alt={p.name} width={40} height={40} className="w-10 h-10 rounded-[10px] border object-cover" />
              </div>
              <div className="flex-1 text-neutral-950 truncate">{p.name}</div>
              <div className="flex-1 text-center text-neutral-950">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</div>
              <div className="flex-1 text-center text-neutral-950">{p.colors?.[0] ?? '-'}</div>
              <div className="flex-1 text-center text-neutral-950">{p.category}</div>
              <div className="flex-1 text-center text-neutral-900">{p.currency || '$'}{p.price.toFixed(2)}</div>
              <div className="flex-1 text-center text-neutral-900">{p.inStock ? 'Active' : 'Inactive'}</div>
              <div className="flex-1 grid place-items-center">
                <div className="relative inline-flex items-center">
                  {(mode === 'all' || mode === 'featured') && (
                    <button
                      title="Toggle Featured"
                      className={cn('p-2 rounded-md outline outline-1 outline-gray-200 hover:bg-neutral-50 mr-2', featuredIds.has(p.id) && 'bg-yellow-50')}
                      onClick={() => toggleFeatured(p.id)}
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
                        onClick={() => deleteProduct(p.id)}
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
    </div>
  );
}


