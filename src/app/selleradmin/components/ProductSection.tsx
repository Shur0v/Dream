'use client';

import React from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/productData';

interface ProductSectionProps {
  title: string;
  products: Product[];
  onAddClick: () => void;
}

export default function ProductSection({ title, products, onAddClick }: ProductSectionProps) {
  return (
    <section className="w-full py-12 bg-white flex flex-col justify-start items-center gap-8">
      <div className="w-full max-w-[1320px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-slate-950 text-4xl md:text-5xl font-medium leading-[1.2]">
            {title}
          </div>
          <button onClick={onAddClick} className="h-11 px-4 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600">
            Add New Product
          </button>
        </div>

        <div className="self-stretch min-h-[200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
          {products.map((product) => (
            <div key={product.id} className="w-full p-4 bg-sky-50 rounded-xl border border-black/10 inline-flex flex-col justify-start items-start group hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-in-out">
              <div className="self-stretch inline-flex justify-between items-center mb-2">
                <div className="flex justify-start items-center gap-2">
                  <div className="w-6 h-6 relative transform group-hover:scale-110 transition-transform duration-300">
                    <Image src="/card/icon/tick.svg" alt="Verified seller" width={24} height={24} loading="lazy" />
                  </div>
                  <div className="text-neutral-600 text-sm font-semibold leading-relaxed">Verified Seller</div>
                </div>
                <div className="transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Image src="/card/icon/butterfly.svg" alt="Wishlist" width={24} height={24} loading="lazy" />
                </div>
              </div>
              <div className="self-stretch h-72 relative mb-4 overflow-hidden rounded-lg">
                {product.image.startsWith('blob:') || product.image.startsWith('data:') ? (
                  <img src={product.image} alt={`${product.name} product image`} className="w-full h-full object-cover" />
                ) : (
                  <Image src={product.image} alt={`${product.name} product image`} fill className="object-cover" />
                )}
              </div>
              <div className="self-stretch flex flex-col gap-2">
                <div className="text-slate-950 text-lg font-semibold leading-loose truncate" title={product.name}>{product.name}</div>
                <div className="inline-flex items-center gap-2">
                  <div className="text-black text-2xl font-semibold">{product.currency}{product.price}</div>
                  <div className="text-red-500 text-base">
                    (<span className="line-through">${product.originalPrice}</span>)
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <div className="flex items-center" role="img" aria-label={`${product.rating} out of 5 stars`}>
                    {[...Array(product.rating)].map((_, i) => (
                      <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-neutral-400 text-sm">( {product.reviews} Reviews )</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


