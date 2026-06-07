'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight } from 'lucide-react';
import { getAdminOrders } from '@/lib/indexeddb/adminCache';
import { RecentCustomerInfoTable } from './RecentCustomerInfoTable';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type AdminOrder = {
  id: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  items?: Array<{ quantity?: number }>;
};

const isAccepted = (status?: string) =>
  ['approved', 'confirmed', 'shipped', 'delivered'].includes(String(status || '').toLowerCase());

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trendText: string;
  waveColor: string;
}

const StatCard = ({ title, value, icon, iconBg, trendText, waveColor }: StatCardProps) => {
  let wavePath = "M 0 32 Q 25 10, 50 32 T 100 20 L 100 50 L 0 50 Z"; // default wave
  if (waveColor.includes("ec4899")) {
    wavePath = "M 0 25 Q 30 45, 60 15 T 100 30 L 100 50 L 0 50 Z";
  } else if (waveColor.includes("3b82f6")) {
    wavePath = "M 0 38 Q 20 12, 50 28 T 100 18 L 100 50 L 0 50 Z";
  } else if (waveColor.includes("6366f1")) {
    wavePath = "M 0 20 Q 25 35, 60 12 T 100 25 L 100 50 L 0 50 Z";
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-150/70 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[150px]">
      <div className="flex items-start gap-4 z-10">
        <div className={cn("w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm", iconBg)}>
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[11px] font-bold text-zinc-400 font-['Poppins'] tracking-wider uppercase">{title}</p>
          <p className="text-2xl font-black text-zinc-950 mt-0.5 tracking-tight font-['Poppins'] leading-normal">{value}</p>
          <div className="flex items-center gap-1 mt-1 text-emerald-600 font-semibold text-xs select-none bg-emerald-50 px-2 py-0.5 rounded-full w-max">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{trendText}</span>
          </div>
        </div>
      </div>
      
      {/* Dynamic bottom SVG wave */}
      <div className="absolute bottom-0 left-0 right-0 h-10 w-full overflow-hidden opacity-25 select-none pointer-events-none">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={`gradient-${waveColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={waveColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={waveColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={wavePath} fill={`url(#gradient-${waveColor.replace('#', '')})`} />
          <path 
            d={wavePath.split(" L ")[0]} 
            fill="none" 
            stroke={waveColor} 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default function DashboardHome() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [targetInput, setTargetInput] = useState('0');
  const [targetSaving, setTargetSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const formattedChartData = useMemo(() => {
    return chartData.map(d => ({
      name: d.label,
      value: d.value
    }));
  }, [chartData]);

  const targetPercent =
    monthlyTarget <= 0 ? 0 : Math.min(100, Math.round((currentMonthSales / monthlyTarget) * 100));
  const expectedSales = monthlyTarget <= 0 ? 0 : Math.round(monthlyTarget * 1.1);

  // Radial progress calculations
  const radius = 52;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~326.72
  const strokeDashoffset = circumference - (targetPercent / 100) * circumference;

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
    <div className="w-full space-y-8">
      {/* 4 Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Expected Sales (+10%)" 
          value={`৳${expectedSales.toLocaleString()}`} 
          icon={<DollarSign className="h-5 w-5" />} 
          iconBg="bg-purple-50 text-purple-600 border border-purple-100"
          trendText="18.5% this week"
          waveColor="#8b5cf6"
        />
        <StatCard 
          title="Accepted Orders" 
          value={stats.totalOrders.toLocaleString()} 
          icon={<ShoppingCart className="h-5 w-5" />} 
          iconBg="bg-pink-50 text-pink-600 border border-pink-100"
          trendText="12.3% this week"
          waveColor="#ec4899"
        />
        <StatCard 
          title="Sold Products" 
          value={stats.totalProducts.toLocaleString()} 
          icon={<Package className="h-5 w-5" />} 
          iconBg="bg-blue-50 text-blue-600 border border-blue-100"
          trendText="15.7% this week"
          waveColor="#3b82f6"
        />
        <StatCard 
          title="Active Sale Days" 
          value={stats.uniqueDays.toLocaleString()} 
          icon={<Users className="h-5 w-5" />} 
          iconBg="bg-indigo-50 text-indigo-600 border border-indigo-100"
          trendText="10.2% this week"
          waveColor="#6366f1"
        />
      </div>

      {/* Analytics and Monthly Target Cards */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Revenue Analytics Recharts Line Chart */}
        <div className="rounded-2xl border border-zinc-150/70 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-800 font-['Poppins']">Revenue Analytics</h3>
            <span className="rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">Last 8 days</span>
          </div>
          <div className="h-60 w-full relative">
            {loading || !mounted ? (
              <div className="flex h-full items-center justify-center text-zinc-400 font-medium">Loading analytics...</div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-zinc-400 font-medium">No accepted order data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: 700, fontFamily: 'Poppins' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: 700, fontFamily: 'Poppins' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '12px', 
                      border: '1px solid #E4E4E7', 
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      fontFamily: 'Poppins',
                      fontSize: '12px',
                      fontWeight: '600'
                    }} 
                    formatter={(value: any) => [`৳${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Target Dial Progress Card */}
        <div className="rounded-2xl border border-zinc-150/70 bg-white p-6 shadow-sm flex flex-col justify-between">
          <h3 className="mb-4 text-lg font-bold text-zinc-800 font-['Poppins']">Monthly Target</h3>
          
          <div className="flex flex-col items-center gap-6 py-2">
            {/* SVG Radial Gauge */}
            <div className="relative h-36 w-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="radialProgressGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {/* Radial Track */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-zinc-100 fill-none"
                  strokeWidth={strokeWidth}
                />
                {/* Radial Progress Line */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-[url(#radialProgressGradient)] fill-none transition-all duration-500 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                <span className="text-3xl font-black text-zinc-800 leading-none">{targetPercent}%</span>
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase mt-1">Progress</span>
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <p className="text-xs font-semibold text-zinc-400 font-['Poppins']">
                Target: <span className="font-bold text-zinc-800">৳{monthlyTarget.toLocaleString()}</span>
              </p>
              <p className="text-xs font-semibold text-zinc-400 font-['Poppins']">
                Expected Sales ( +10% ): <span className="font-bold text-zinc-800">৳{expectedSales.toLocaleString()}</span>
              </p>
            </div>
            
            {/* Control Form inputs */}
            <div className="mt-1 flex w-full flex-col gap-2.5">
              <input
                type="number"
                min="0"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-xs font-semibold text-zinc-850 outline-none focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all font-['Poppins'] placeholder:text-zinc-400"
                placeholder="Set monthly target"
              />
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={handleSaveTarget}
                  disabled={targetSaving}
                  className="h-10 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-xs font-bold text-white shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer"
                >
                  Set Target
                </button>
                <button
                  type="button"
                  onClick={handleResetTarget}
                  disabled={targetSaving}
                  className="h-10 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Table */}
      <RecentCustomerInfoTable />
    </div>
  );
}
