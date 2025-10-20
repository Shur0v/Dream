'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Layout for seller pages
 * Wraps seller pages with seller-specific layout and navigation
 */
export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide sidebar for auth pages
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Seller Dashboard</h2>
            <nav className="space-y-2">
              <a href="/seller/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                Dashboard
              </a>
              <a href="/seller/products" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                Products
              </a>
              <a href="/seller/orders" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                Orders
              </a>
              <a href="/seller/analytics" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                Analytics
              </a>
              <a href="/seller/profile" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                Profile
              </a>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
