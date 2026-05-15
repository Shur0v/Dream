'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { getAdminOrders } from '@/lib/indexeddb/adminCache';
import { RecentCustomerInfoTable } from './RecentCustomerInfoTable';

type AdminOrder = {
  id: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  items?: Array<{ quantity?: number }>;
};

const isAccepted = (status?: string) =>
  ['approved', 'confirmed', 'shipped', 'delivered'].includes(String(status || '').toLowerCase());

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <div className="rounded-xl bg-fuchsia-100 p-2.5 text-fuchsia-600">{icon}</div>
    </div>
    <p className="text-3xl font-semibold text-zinc-900">{value}</p>
  </div>
);

export default function DashboardHome() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getAdminOrders({ page: 1, limit: 1000, sortBy: 'createdAt', sortOrder: 'desc' });
        if (result.success && Array.isArray(result.data)) {
          setOrders(result.data as AdminOrder[]);
        } else {
          setOrders([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const acceptedOrders = useMemo(() => orders.filter((o) => isAccepted(o.status)), [orders]);

  const stats = useMemo(() => {
    const totalSales = acceptedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const totalOrders = acceptedOrders.length;
    const totalProducts = acceptedOrders.reduce(
      (sum, o) => sum + (o.items?.reduce((s, it) => s + Number(it.quantity || 1), 0) || 0),
      0
    );
    const uniqueDays = new Set(
      acceptedOrders
        .map((o) => (o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : ''))
        .filter(Boolean)
    ).size;
    return { totalSales, totalOrders, totalProducts, uniqueDays };
  }, [acceptedOrders]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    acceptedOrders.forEach((o) => {
      if (!o.createdAt) return;
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      map.set(key, (map.get(key) || 0) + Number(o.totalAmount || 0));
    });
    const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-8);
    return entries.map(([date, value]) => ({
      label: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      value,
    }));
  }, [acceptedOrders]);

  const maxY = Math.max(...chartData.map((d) => d.value), 1);
  const points = chartData
    .map((d, i) => {
      const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 100 : 50;
      const y = 100 - (d.value / maxY) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Accepted Sales" value={`৳${stats.totalSales.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Accepted Orders" value={stats.totalOrders.toLocaleString()} icon={<ShoppingCart className="h-5 w-5" />} />
        <StatCard title="Sold Products" value={stats.totalProducts.toLocaleString()} icon={<Package className="h-5 w-5" />} />
        <StatCard title="Active Sale Days" value={stats.uniqueDays.toLocaleString()} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-3xl font-semibold text-zinc-900">Revenue Analytics</h3>
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm text-zinc-600">Last 8 days</span>
          </div>
          <div className="h-56 w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-zinc-500">Loading analytics...</div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-zinc-500">No accepted order data yet.</div>
            ) : (
              <div className="h-full w-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                  <polyline fill="none" stroke="#d946ef" strokeWidth="2" points={points} />
                </svg>
                <div className="mt-2 flex justify-between text-xs text-zinc-500">
                  {chartData.map((d) => (
                    <span key={d.label}>{d.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-3xl font-semibold text-zinc-900">Monthly Target</h3>
          <div className="flex flex-col items-center gap-3">
            {(() => {
              const target = 600000;
              const percent = Math.min(100, Math.round((stats.totalSales / target) * 100));
              return (
                <>
                  <div className="relative h-40 w-40 rounded-full border-[14px] border-zinc-200">
                    <div
                      className="absolute inset-0 rounded-full border-[14px] border-fuchsia-500"
                      style={{ clipPath: `inset(${100 - percent}% 0 0 0)` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-zinc-900">
                      {percent}%
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Target: <span className="font-semibold text-zinc-900">৳{target.toLocaleString()}</span>
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <RecentCustomerInfoTable />
    </div>
  );
}

