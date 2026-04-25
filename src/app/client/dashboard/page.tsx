'use client';

import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { apiService } from '../../../services/api';
import { ShoppingBag, Heart, Package, Bell } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  trackingNumber?: string;
}

export default function ClientDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          apiService.getOrders(),
          fetch('/api/products?limit=4', { cache: 'no-store' }).then((r) => r.json()),
        ]);

        if (!mounted) return;

        setOrders(Array.isArray(ordersRes?.data) ? (ordersRes.data as Order[]) : []);
        setProducts(Array.isArray(productsRes?.data) ? productsRes.data : []);
      } catch (error) {
        console.error('Client dashboard load error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const activeOrders = useMemo(() => orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length, [orders]);

  return (
    <MainLayout user={null} cartCount={0} wishlistCount={0}>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Dashboard</h1>
          <p className="text-gray-600">Your live order updates and recommendations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center"><CardContent className="pt-6"><Package className="h-8 w-8 text-purple-600 mx-auto mb-2" /><h3 className="text-lg font-semibold">{loading ? '...' : activeOrders}</h3><p className="text-sm text-gray-600">Active Orders</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><Heart className="h-8 w-8 text-red-500 mx-auto mb-2" /><h3 className="text-lg font-semibold">0</h3><p className="text-sm text-gray-600">Wishlist Items</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><ShoppingBag className="h-8 w-8 text-green-500 mx-auto mb-2" /><h3 className="text-lg font-semibold">{loading ? '...' : orders.length}</h3><p className="text-sm text-gray-600">Total Orders</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" /><h3 className="text-lg font-semibold">{loading ? '...' : products.length}</h3><p className="text-sm text-gray-600">New Products</p></CardContent></Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/client/delivery"><Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">View All Orders</Button></Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No orders yet.</p>
              <Link href="/client/categories"><Button className="bg-purple-600 text-white hover:bg-purple-700">Start Shopping</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.slice(0, 4).map((order) => (
                <Link key={order.id} href={`/client/delivery?orderId=${order.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-600">Total: ?{order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

