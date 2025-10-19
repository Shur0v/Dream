'use client';

import React from 'react';

/**
 * CategoryList component
 * 
 * @description Displays all available product categories in a grid layout
 * with category images, names, and navigation links
 */
export default function CategoryList() {
  const categories = [
    { id: 1, name: 'Electronics', image: '/categories/image/smartphone.png', count: 150 },
    { id: 2, name: 'Fashion', image: '/categories/image/woman.png', count: 200 },
    { id: 3, name: 'Home & Garden', image: '/categories/image/lighting.png', count: 75 },
    { id: 4, name: 'Sports', image: '/categories/image/man.png', count: 100 },
    { id: 5, name: 'Beauty', image: '/categories/image/beauty.png', count: 80 },
    { id: 6, name: 'Toys', image: '/categories/image/toys.png', count: 60 },
    { id: 7, name: 'Baby Care', image: '/categories/image/babycare.png', count: 45 },
    { id: 8, name: 'Grocery', image: '/categories/image/grocery.png', count: 120 },
    { id: 9, name: 'Gifts', image: '/categories/image/gift.png', count: 30 },
    { id: 10, name: 'Global Find', image: '/categories/image/globalfind.png', count: 500 },
  ];

  return (
    <section className="w-full py-8 bg-white">
      <div className="w-full max-w-[1320px] mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-gray-600">Discover products across all categories</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.count} items
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
