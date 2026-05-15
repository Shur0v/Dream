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
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [targetInput, setTargetInput] = useState('0');
  const [targetSaving, setTargetSaving] = useState(false);

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

  useEffect(() => {
    const loadTarget = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const result = await response.json();
        const amount = Number(result?.monthlyTarget?.amount);
        if (response.ok && Number.isFinite(amount) && amount > 0) {
          setMonthlyTarget(amount);
          setTargetInput(String(amount));
        }
      } catch (error) {
        console.error('Failed to load monthly target:', error);
      }
    };
    loadTarget();
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

  const currentMonthSales = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return acceptedOrders.reduce((sum, order) => {
      if (!order.createdAt) return sum;
      const date = new Date(order.createdAt);
      if (date.getMonth() === month && date.getFullYear() === year) {
        return sum + Number(order.totalAmount || 0);
      }
      return sum;
    }, 0);
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

  const targetPercent =
    monthlyTarget <= 0 ? 0 : Math.min(100, Math.round((currentMonthSales / monthlyTarget) * 100));
  const expectedSales = monthlyTarget <= 0 ? 0 : Math.round(monthlyTarget * 1.1);

  const handleSaveTarget = async () => {
    const amount = Number(targetInput);
    if (!Number.isFinite(amount) || amount < 0) return;
    try {
      setTargetSaving(true);
      const response = await fetch('/api/admin/dashboard', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const result = await response.json();
      if (response.ok && result?.success) {
        const savedAmount = Number(result.data?.amount);
        if (Number.isFinite(savedAmount) && savedAmount > 0) {
          setMonthlyTarget(savedAmount);
          setTargetInput(String(savedAmount));
        }
      }
    } catch (error) {
      console.error('Failed to save monthly target:', error);
    } finally {
      setTargetSaving(false);
    }
  };

  const handleResetTarget = async () => {
    try {
      setTargetSaving(true);
      const response = await fetch('/api/admin/dashboard', { method: 'DELETE' });
      const result = await response.json();
      if (response.ok && result?.success) {
        const resetAmount = Number(result.data?.amount ?? 0);
        setMonthlyTarget(resetAmount);
        setTargetInput(String(resetAmount));
      }
    } catch (error) {
      console.error('Failed to reset monthly target:', error);
    } finally {
      setTargetSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Expected Sales (+10%)" value={`৳${expectedSales.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
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
            <div className="relative h-40 w-40 rounded-full border-[14px] border-zinc-200">
              <div
                className="absolute inset-0 rounded-full border-[14px] border-fuchsia-500"
                style={{ clipPath: `inset(${100 - targetPercent}% 0 0 0)` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-zinc-900">
                {targetPercent}%
              </div>
            </div>
            <p className="text-sm text-zinc-500">
              Target: <span className="font-semibold text-zinc-900">৳{monthlyTarget.toLocaleString()}</span>
            </p>
            <p className="text-sm text-zinc-500">
              Expected Sales ( +10% ): <span className="font-semibold text-zinc-900">৳{expectedSales.toLocaleString()}</span>
            </p>
            <p className="text-xs text-zinc-500">
              Current month accepted sales: <span className="font-semibold text-zinc-900">৳{currentMonthSales.toLocaleString()}</span>
            </p>
            <div className="mt-2 flex w-full items-center gap-2">
              <input
                type="number"
                min="0"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="h-10 flex-1 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:border-fuchsia-400"
                placeholder="Set monthly target"
              />
              <button
                type="button"
                onClick={handleSaveTarget}
                disabled={targetSaving}
                className="h-10 rounded-lg bg-fuchsia-500 px-3 text-sm font-medium text-white disabled:opacity-60"
              >
                Set Target
              </button>
              <button
                type="button"
                onClick={handleResetTarget}
                disabled={targetSaving}
                className="h-10 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 disabled:opacity-60"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <RecentCustomerInfoTable />
    </div>
  );
}
