'use client';

import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import OrdersTable from '../components/orders/OrdersTable';

/**
 * Orders Page Component
 * Displays all orders with product details, customer info, and order management
 */
export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="w-full p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>
        <OrdersTable />
      </div>
    </DashboardLayout>
  );
}

