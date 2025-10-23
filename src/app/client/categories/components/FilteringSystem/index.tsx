'use client';

import React, { useState } from 'react';

/**
 * Complete Filtering System Component
 * Displays sidebar with search, category, brand, and size filters
 */
export default function FilteringSystem() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandingOpen, setIsBrandingOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);

  const categories = [
    { name: 'Hoodies', count: 20 },
    { name: 'Jackets', count: 20 },
    { name: 'Joggers', count: 20 },
    { name: 'Pants', count: 20 },
    { name: 'Shoes', count: 20 },
  ];

  const brands = [
    'Viede',
    'Chanel', 
    'Hermes',
    'Gucci'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL'];

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-3 top-2.5">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
              >
                Category
                <svg 
                  className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryOpen && (
                <div className="mt-2 space-y-2">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-gray-500 text-sm">({category.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Branding Filter */}
            <div className="mb-6">
              <button
                onClick={() => setIsBrandingOpen(!isBrandingOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
              >
                Branding
                <svg 
                  className={`w-5 h-5 transition-transform ${isBrandingOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isBrandingOpen && (
                <div className="mt-2 space-y-2">
                  {brands.map((brand, index) => (
                    <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <button
                onClick={() => setIsSizeOpen(!isSizeOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
              >
                Size
                <svg 
                  className={`w-5 h-5 transition-transform ${isSizeOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSizeOpen && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-500 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Product Display */}
        <div className="lg:col-span-3">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Now</h1>
            <nav className="text-sm text-gray-600">
              <span>Home</span>
              <span className="mx-2">&gt;</span>
              <span>Product</span>
            </nav>
          </div>

          {/* Results and Sorting */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Showing 1-12 of 100 results</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by Price:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Low to High</option>
                <option>High to Low</option>
                <option>Newest</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Product Cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-lg transition-shadow">
                <div className="relative mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified Seller
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                    <img 
                      src="/categories/image/smartphone.png" 
                      alt="MacBook Pro" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">MacBook Pro 16-inch M3 Max</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">৳ 809.99</span>
                    <span className="text-sm text-gray-500 line-through">($1000)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(7 Reviews)</span>
                  </div>

                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
