'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Database,
  Package,
  RefreshCw,
  Send,
  ShoppingCart,
  Users,
  WalletCards,
} from 'lucide-react';
import toast from 'react-hot-toast';

type ScanState = {
  dashboard: any;
  users: any[];
  products: any[];
  orders: any[];
  resellers: any[];
  payouts: any[];
  message: string;
};

const initialScan: ScanState = {
  dashboard: null,
  users: [],
  products: [],
  orders: [],
  resellers: [],
  payouts: [],
  message: '',
};

const formatMoney = (value: number) => `৳${Number(value || 0).toLocaleString('en-US')}`;
const formatDate = (value?: string) => (value ? new Date(value).toLocaleString() : '-');

async function readJson(url: string) {
  const response = await fetch(url, { cache: 'no-store' });
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.success === false) {
    throw new Error(body?.error || `Failed: ${url}`);
  }
  return body;
}

export default function AdminDashboard() {
  const [scan, setScan] = useState<ScanState>(initialScan);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageDraft, setMessageDraft] = useState('');
  const [savingMessage, setSavingMessage] = useState(false);

  const loadScan = async (silent = false) => {
    setLoading(!silent);
    const nextErrors: string[] = [];
    const safe = async (label: string, url: string, fallback: any) => {
      try {
        return await readJson(url);
      } catch (error) {
        nextErrors.push(`${label}: ${error instanceof Error ? error.message : 'failed'}`);
        return fallback;
      }
    };

    const [dashboard, users, products, orders, resellers, payouts, message] = await Promise.all([
      safe('Dashboard', '/api/admin/dashboard', { data: null }),
      safe('Users', '/api/users', { data: [] }),
      safe('Products', '/api/products?limit=1000', { data: [] }),
      safe('Orders', '/api/admin/orders?limit=1000&sortBy=createdAt&sortOrder=desc', { data: [] }),
      safe('Resellers', '/api/admin/resellers', { data: [] }),
      safe('Payouts', '/api/admin/resellers/payouts', { data: [] }),
      safe('Reseller message', '/api/admin/platform-message', { data: { message: '' } }),
    ]);

    const nextScan = {
      dashboard: dashboard?.data || null,
      users: Array.isArray(users?.data) ? users.data : [],
      products: Array.isArray(products?.data) ? products.data : [],
      orders: Array.isArray(orders?.data) ? orders.data : [],
      resellers: Array.isArray(resellers?.data) ? resellers.data : [],
      payouts: Array.isArray(payouts?.data) ? payouts.data : [],
      message: message?.data?.message || '',
    };

    setScan(nextScan);
    setMessageDraft(nextScan.message);
    setErrors(nextErrors);
    setLoading(false);
    if (silent) {
      if (nextErrors.length) toast.error('Scan completed with warnings');
      else toast.success('Platform scan refreshed');
    }
  };

  useEffect(() => {
    void loadScan();
  }, []);

  const acceptedOrders = useMemo(
    () => scan.orders.filter((order) => order.status === 'accepted' || order.status === 'confirmed' || order.status === 'delivered'),
    [scan.orders]
  );

  const revenue = useMemo(
    () => acceptedOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [acceptedOrders]
  );

  const systemCards = [
    { label: 'Users', value: scan.users.length, helper: 'All customer records', icon: Users, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Products', value: scan.products.length, helper: 'Catalog scan', icon: Package, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Orders', value: scan.orders.length, helper: `${acceptedOrders.length} accepted`, icon: ShoppingCart, tone: 'bg-fuchsia-50 text-fuchsia-600' },
    { label: 'Revenue', value: formatMoney(revenue), helper: 'Accepted orders only', icon: Activity, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Resellers', value: scan.resellers.length, helper: `${scan.resellers.filter((r) => r.status === 'active').length} active`, icon: Database, tone: 'bg-purple-50 text-purple-600' },
    { label: 'Payouts', value: scan.payouts.length, helper: `${scan.payouts.filter((p) => p.status === 'requested').length} requested`, icon: WalletCards, tone: 'bg-rose-50 text-rose-600' },
  ];

  const saveAnnouncement = async () => {
    setSavingMessage(true);
    try {
      const response = await fetch('/api/admin/platform-message', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageDraft }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.error || 'Failed to save message');
        return;
      }
      toast.success('Reseller message updated');
      await loadScan(true);
    } catch (error) {
      console.error('Save announcement error:', error);
      toast.error('Failed to save reseller message');
    } finally {
      setSavingMessage(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="rounded-[32px] bg-gradient-to-br from-[#1c0d48] via-[#5b21b6] to-[#e13df3] p-7 text-white shadow-xl shadow-purple-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-100">Real-time platform audit</p>
            <h1 className="mt-3 text-4xl font-black">Scan every core system</h1>
            <p className="mt-2 text-purple-100">Products, orders, users, resellers, payouts, and admin settings are checked from live APIs.</p>
          </div>
          <button
            onClick={() => loadScan(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-[#5b21b6] shadow-lg transition hover:scale-[1.02]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Run Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {systemCards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-black text-slate-950">{loading ? '...' : card.value}</p>
                <p className="mt-1 text-xs text-slate-400">{card.helper}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-950">System Health</h2>
            {errors.length ? <AlertCircle className="h-6 w-6 text-amber-500" /> : <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
          </div>
          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            {errors.length ? (
              <div className="space-y-2">
                {errors.map((error) => (
                  <p key={error} className="text-sm font-semibold text-amber-700">{error}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-emerald-700">All scanned APIs responded successfully.</p>
            )}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="py-3">Recent Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scan.orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="py-4 font-bold text-slate-900">{order.id}</td>
                    <td>{order.shippingAddress?.name || order.userId || 'Guest'}</td>
                    <td><span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-600">{order.status}</span></td>
                    <td className="font-bold">{formatMoney(order.totalAmount)}</td>
                    <td className="text-slate-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Reseller Sidebar Message</h2>
          <p className="mt-2 text-sm text-slate-500">This message appears at the bottom of every reseller dashboard sidebar.</p>
          <textarea
            value={messageDraft}
            onChange={(event) => setMessageDraft(event.target.value)}
            maxLength={240}
            className="mt-5 h-36 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100"
            placeholder="Write a short message for all resellers..."
          />
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{messageDraft.length}/240 characters</span>
            <span>Visible immediately after refresh</span>
          </div>
          <button
            onClick={saveAnnouncement}
            disabled={savingMessage || !messageDraft.trim()}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-fuchsia-500 px-5 py-3 font-bold text-white transition hover:bg-fuchsia-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {savingMessage ? 'Saving...' : 'Send Message to Resellers'}
          </button>
        </div>
      </div>
    </div>
  );
}
