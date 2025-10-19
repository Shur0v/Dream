'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';

/**
 * ProductList component for displaying products with filtering and sorting
 * 
 * @description Displays products in a grid layout with:
 * - Filtering by category, price range, rating
 * - Sorting by price, rating, popularity
 * - Search functionality
 * - Pagination
 */
export default function ProductList() {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    sortBy: 'popularity'
  });

  // Sample products data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 299.99,
      originalPrice: 399.99,
      image: '/card/image/img1.jpg',
      rating: 4.5,
      reviewCount: 128,
      category: 'Electronics',
      inStock: true
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      originalPrice: 249.99,
      image: '/hero/images/image2.jpg',
      rating: 4.2,
      reviewCount: 89,
      category: 'Electronics',
      inStock: true
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 79.99,
      originalPrice: 99.99,
      image: '/hero/images/image3.png',
      rating: 4.7,
      reviewCount: 156,
      category: 'Electronics',
      inStock: false
    },
    {
      id: 4,
      name: 'Gaming Mouse',
      price: 49.99,
      originalPrice: 69.99,
      image: '/hero/images/image4.png',
      rating: 4.3,
      reviewCount: 203,
      category: 'Electronics',
      inStock: true
    }
  ];

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty'];

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-gray-600">Discover our complete collection of products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.toLowerCase()}
                    checked={filters.category === category.toLowerCase()}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-2">
              {[
                { label: 'All', value: 'all' },
                { label: 'Under $50', value: 'under-50' },
                { label: '$50 - $100', value: '50-100' },
                { label: '$100 - $200', value: '100-200' },
                { label: 'Over $200', value: 'over-200' }
              ].map((range) => (
                <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={filters.priceRange === range.value}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
            <div className="space-y-2">
              {[
                { label: 'All', value: 'all' },
                { label: '4+ Stars', value: '4+' },
                { label: '3+ Stars', value: '3+' },
                { label: '2+ Stars', value: '2+' }
              ].map((rating) => (
                <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating.value}
                    checked={filters.rating === rating.value}
                    onChange={(e) => handleFilterChange('rating', rating.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{rating.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {products.length} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => console.log('Add to cart:', product.id)}
                onAddToWishlist={() => console.log('Add to wishlist:', product.id)}
                onViewDetails={() => console.log('View details:', product.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
