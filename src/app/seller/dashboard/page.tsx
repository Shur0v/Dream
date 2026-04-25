'use client';

import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent } from '../../../components/ui/Card';
import { Package, DollarSign, Users, ShoppingBag } from 'lucide-react';

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products?limit=200', { cache: 'no-store' }),
          fetch('/api/orders', { cache: 'no-store' }),
        ]);
        const productsJson = await productsRes.json();
        const ordersJson = await ordersRes.json();
        if (!mounted) return;
        setProducts(Array.isArray(productsJson?.data) ? productsJson.data : []);
        setOrders(Array.isArray(ordersJson?.data) ? ordersJson.data : []);
      } catch (error) {
        console.error('Seller dashboard load error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    [orders]
  );

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    [orders]
  );

  const myProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <MainLayout user={null} cartCount={0} wishlistCount={0}>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Real-time orders, revenue and products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center"><CardContent className="pt-6"><DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" /><h3 className="text-2xl font-bold">?{loading ? '...' : revenue.toFixed(2)}</h3><p className="text-sm text-gray-600">Revenue</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><ShoppingBag className="h-8 w-8 text-blue-500 mx-auto mb-2" /><h3 className="text-2xl font-bold">{loading ? '...' : orders.length}</h3><p className="text-sm text-gray-600">Orders</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><Package className="h-8 w-8 text-purple-500 mx-auto mb-2" /><h3 className="text-2xl font-bold">{loading ? '...' : products.length}</h3><p className="text-sm text-gray-600">Products</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><Users className="h-8 w-8 text-orange-500 mx-auto mb-2" /><h3 className="text-2xl font-bold">{loading ? '...' : new Set(orders.map(o => o.userId)).size}</h3><p className="text-sm text-gray-600">Customers</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-700">{order.id}</span>
                    <span className="text-sm font-medium">?{(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                ))}
                {!loading && recentOrders.length === 0 && <p className="text-sm text-gray-500">No orders found.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <div className="space-y-3">
                {myProducts.map((product) => (
                  <div key={product.id} className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-700 truncate max-w-[70%]">{product.name}</span>
                    <span className="text-sm font-medium">Stock {product.stock ?? 0}</span>
                  </div>
                ))}
                {!loading && myProducts.length === 0 && <p className="text-sm text-gray-500">No products found.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

