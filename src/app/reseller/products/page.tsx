'use client';

import React from 'react';

/**
 * Reseller Products page
 * 
 * @description Displays:
 * - Available products for reselling
 * - Wholesale pricing
 * - Product catalog management
 * - Bulk order options
 */
export default function ResellerProducts() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Catalog</h1>
        <p className="text-gray-600">Browse and manage products available for reselling</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Products</h2>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Bulk Order
            </button>
          </div>
        </div>

        {/* Products Grid Placeholder */}
        <div className="text-center py-12 text-gray-500">
          <p>Available products for reselling will be displayed here</p>
          <p className="text-sm mt-2">Browse wholesale products and manage your catalog</p>
        </div>
      </div>
    </div>
  );
}
