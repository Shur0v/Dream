'use client';

import React from 'react';

/**
 * Seller Analytics page
 * 
 * @description Displays:
 * - Sales analytics and metrics
 * - Revenue charts
 * - Product performance
 * - Customer insights
 */
export default function SellerAnalytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h1>
        <p className="text-gray-600">Track your sales performance and insights</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900">$12,345</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Orders</h3>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-sm text-green-600">+8% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Products</h3>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-600">Active listings</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
          <p className="text-2xl font-bold text-gray-900">4.8</p>
          <p className="text-sm text-gray-600">Average rating</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales Overview</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Sales charts and analytics will be displayed here</p>
          <p className="text-sm mt-2">Revenue trends, product performance, and customer insights</p>
        </div>
      </div>
    </div>
  );
}
