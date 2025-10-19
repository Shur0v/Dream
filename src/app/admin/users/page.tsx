'use client';

import React from 'react';

/**
 * Admin Users page
 * 
 * @description Displays:
 * - User management
 * - User roles and permissions
 * - User activity monitoring
 * - Account status management
 */
export default function AdminUsers() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Management</h1>
        <p className="text-gray-600">Manage all users, roles, and permissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>All Roles</option>
              <option>Customers</option>
              <option>Sellers</option>
              <option>Resellers</option>
              <option>Admins</option>
            </select>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Add User
            </button>
          </div>
        </div>

        {/* Users Table Placeholder */}
        <div className="text-center py-12 text-gray-500">
          <p>User management table will be displayed here</p>
          <p className="text-sm mt-2">Manage user accounts, roles, and permissions</p>
        </div>
      </div>
    </div>
  );
}
