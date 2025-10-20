'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Layout for admin pages
 * Wraps admin pages with admin-specific layout and navigation
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide sidebar for auth pages
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/forgot-password');
  
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
            <h2 className="text-xl font-bold text-gray-900 mb-8">Admin Dashboard</h2>
            <nav className="space-y-2">
              <a href="/admin/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
                Dashboard
              </a>
              <a href="/admin/users" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
                Users
              </a>
              <a href="/admin/sellers" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
                Sellers
              </a>
              <a href="/admin/resellers" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
                Resellers
              </a>
              <a href="/admin/analytics" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
                Analytics
              </a>
              <a href="/admin/settings" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
                Settings
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
