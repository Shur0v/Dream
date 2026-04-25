'use client';

import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent } from '../../../components/ui/Card';
import { Package, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';

export default function ResellerDashboard() {
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
        console.error('Reseller dashboard load error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const wholesaleProducts = useMemo(() => products.slice(0, 8), [products]);
  const totalPurchase = useMemo(() => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [orders]);

  return (
    <MainLayout user={null} cartCount={0} wishlistCount={0}>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reseller Dashboard</h1>
          <p className="text-gray-600">Wholesale products and bulk order insights from live API data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center"><CardContent className="pt-6"><DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2"/><h3 className="text-2xl font-bold">?{loading ? '...' : totalPurchase.toFixed(2)}</h3><p className="text-sm text-gray-600">Total Purchases</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><ShoppingCart className="h-8 w-8 text-blue-500 mx-auto mb-2"/><h3 className="text-2xl font-bold">{loading ? '...' : orders.length}</h3><p className="text-sm text-gray-600">Bulk Orders</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><Package className="h-8 w-8 text-purple-500 mx-auto mb-2"/><h3 className="text-2xl font-bold">{loading ? '...' : products.length}</h3><p className="text-sm text-gray-600">Available Products</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2"/><h3 className="text-2xl font-bold">30%</h3><p className="text-sm text-gray-600">Wholesale Discount</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Wholesale Products</h2>
            <div className="space-y-3">
              {wholesaleProducts.map((product) => (
                <div key={product.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">Retail ?{Number(product.price || 0).toFixed(2)} · Wholesale ?{(Number(product.price || 0) * 0.7).toFixed(2)}</p>
                  </div>
                  <span className="text-xs text-gray-600">Stock {product.stock ?? 0}</span>
                </div>
              ))}
              {!loading && wholesaleProducts.length === 0 && <p className="text-sm text-gray-500">No products available.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

