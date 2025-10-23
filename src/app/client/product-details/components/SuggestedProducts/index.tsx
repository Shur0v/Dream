"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface SuggestedProductsProps {
  currentSlug: string;
}

const MOCK_SUGGESTED = [
  { slug: "mock-1", name: "Wireless Earbuds", price: 39.99, image: "/common/cart/image6.png" },
  { slug: "mock-2", name: "Compact Speaker", price: 59.99, image: "/common/cart/image7.jpg" },
  { slug: "mock-3", name: "Phone Case", price: 14.99, image: "/common/cart/image8.png" },
];

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({ currentSlug }) => {
  return (
    <section className="father w-full py-20 bg-white" role="region" aria-labelledby="suggested-heading" data-layer="father">
      {/* father = full width suggested products section */}
      
      <div className="daughter w-full max-w-[1320px] mx-auto" data-layer="daughter">
        {/* daughter = design holder for entire suggested products section */}
        
        <div className="layer-1 w-full" data-layer="1">
          {/* layer-1 = main content container */}
          
          <div className="layer-2" data-layer="2">
            {/* layer-2 = header container */}
            
            <div className="layer-3" data-layer="3">
              {/* layer-3 = header content wrapper */}
              
              <div className="layer-4" data-layer="4">
                {/* layer-4 = heading */}
                <h3 className="text-lg font-semibold text-slate-900 mb-4" id="suggested-heading">You may also like</h3>
              </div>
            </div>
          </div>
          
          <div className="layer-2" data-layer="2">
            {/* layer-2 = products grid container */}
            
            <div className="layer-3 grid grid-cols-1 gap-4" data-layer="3">
              {/* layer-3 = products grid wrapper */}
              
              {MOCK_SUGGESTED.filter((p) => p.slug !== currentSlug).map((p) => (
                <Link key={p.slug} href={`/client/product-details/${p.slug}`} className="layer-4 group" data-layer="4">
                  {/* layer-4 = individual product link */}
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition">
                    <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-100">
                      <Image src={p.image} alt={p.name} width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 group-hover:underline">{p.name}</div>
                      <div className="text-sm text-gray-700">৳ {p.price.toFixed(2)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuggestedProducts;
