'use client';

import React from 'react';
import ProductCard from '../product/ProductCard';
import { sampleProducts } from '@/lib/dummyData';

/**
 * Best Selling Component
 * Displays best selling products
 */
export default function BestSelling() {
  const handleAddToCart = (product: any) => {
    console.log('Add to cart:', product);
  };

  const handleAddToWishlist = (product: any) => {
    console.log('Add to wishlist:', product);
  };

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
  };

  return (
    <section className="w-full py-12 bg-white">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Best Selling</h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.slice(4, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


