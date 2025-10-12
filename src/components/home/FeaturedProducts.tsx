'use client';

import React from 'react';
import ProductCard from '../product/ProductCard';
import { sampleProducts } from '@/lib/dummyData';

/**
 * Featured Products Component
 * Displays a grid of featured products
 */
export default function FeaturedProducts() {
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
    <section className="w-full py-12 bg-gray-50">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Product</h2>
          <div className="flex gap-4">
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">New</button>
            <button className="text-sm text-gray-600 hover:text-purple-600 font-medium">Featured</button>
            <button className="text-sm text-gray-600 hover:text-purple-600 font-medium">Top Sellers</button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.slice(0, 4).map((product) => (
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

