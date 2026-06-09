'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Copy,
  Link as LinkIcon,
  PackageCheck,
  RefreshCw,
  Send,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Wallet,
  WalletCards,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiUrl } from '@/lib/apiConfig';
import type { Product } from '@/types';

type DashboardData = {
  reseller: {
    id: string;
    name: string;
    shopName?: string;
    referralCode: string;
    status: string;
    totalEarnings: number;
    availableBalance: number;
    pendingBalance: number;
  };
  orders: any[];
  commissions: any[];
  referrals: any[];
  payouts: any[];
  stats: {
    totalOrders: number;
    pendingCommissions: number;
    approvedCommissions: number;
    clicks: number;
  };
};

const formatMoney = (value: number) => `৳${Number(value || 0).toLocaleString('en-US')}`;
const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-');

export default function ResellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNumber, setPayoutNumber] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');

  const loadDashboard = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || 'null');
      const query = userData?.id ? `?userId=${encodeURIComponent(userData.id)}` : '';
      let response = await fetch(`/api/reseller${query}`, { cache: 'no-store' });
      let result = await response.json();

      if (!result?.data?.reseller) {
        response = await fetch('/api/reseller', { cache: 'no-store' });
        result = await response.json();
        const first = Array.isArray(result?.data) ? result.data[0] : null;
        if (first?.id) {
          response = await fetch(`/api/reseller?resellerId=${encodeURIComponent(first.id)}`, { cache: 'no-store' });
          result = await response.json();
        }
      }

      const [productsRes, messageRes] = await Promise.all([
        fetch(getApiUrl('products?limit=100'), { cache: 'no-store' }),
        fetch('/api/platform-message', { cache: 'no-store' }),
      ]);
      const productsJson = await productsRes.json();
      const messageJson = await messageRes.json();

      setProducts(Array.isArray(productsJson?.data) ? productsJson.data : []);
      setAnnouncement(messageJson?.data?.message || '');
      setData(result?.data?.reseller ? result.data : null);
      if (silent) toast.success('Dashboard refreshed');
    } catch (error) {
      console.error('Reseller dashboard load error:', error);
      toast.error('Failed to load reseller dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId),
    [products, selectedProductId]
  );

  const baseReferralUrl = useMemo(() => {
    if (!data?.reseller?.referralCode) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dreamshopltd.com';
    return `${origin}/?ref=${data.reseller.referralCode}`;
  }, [data?.reseller?.referralCode]);

  const productReferralUrl = useMemo(() => {
    if (!data?.reseller?.referralCode || !selectedProduct) return baseReferralUrl;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dreamshopltd.com';
    const slug = selectedProduct.slug || selectedProduct.sku || selectedProduct.id;
    return `${origin}/client/product-details/${slug}?ref=${data.reseller.referralCode}`;
  }, [baseReferralUrl, data?.reseller?.referralCode, selectedProduct]);

  const copyText = async (value: string, label: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  const requestPayout = async () => {
    if (!data?.reseller) return;
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0 || !payoutNumber.trim()) {
      toast.error('Enter payout amount and payout number');
      return;
    }

    const response = await fetch('/api/reseller/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resellerId: data.reseller.id,
        amount,
        method: payoutMethod,
        number: payoutNumber,
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      toast.error(result.error || 'Payout request failed');
      return;
    }

    toast.success('Payout request submitted');
    setPayoutAmount('');
    setPayoutNumber('');
    await loadDashboard(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">Loading reseller dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-950">No reseller profile found</h1>
          <p className="mt-2 text-slate-500">Create a reseller signup first, then approve it from seller admin.</p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Earnings', value: formatMoney(data.reseller.totalEarnings), helper: 'Approved commission', icon: Wallet, tone: 'text-emerald-500 bg-emerald-50' },
    { label: 'Available Balance', value: formatMoney(data.reseller.availableBalance), helper: 'Ready to withdraw', icon: WalletCards, tone: 'text-fuchsia-500 bg-fuchsia-50' },
    { label: 'Pending Balance', value: formatMoney(data.reseller.pendingBalance), helper: 'Waiting for approval', icon: TrendingUp, tone: 'text-amber-500 bg-amber-50' },
    { label: 'Tracked Orders', value: data.stats.totalOrders.toString(), helper: `${data.stats.clicks} referral visits`, icon: ShoppingBag, tone: 'text-sky-500 bg-sky-50' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-7">
      <div className="rounded-[32px] bg-gradient-to-br from-[#1c0d48] via-[#5b21b6] to-[#e13df3] p-7 text-white shadow-xl shadow-purple-950/20 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 left-1/2 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-purple-100 uppercase tracking-[0.24em]">Reseller command center</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-black">{data.reseller.shopName || data.reseller.name}</h1>
            <p className="mt-2 text-purple-100">Status: <span className="font-bold text-white">{data.reseller.status}</span></p>
          </div>
          <button
            onClick={() => loadDashboard(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-[#5b21b6] shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
        {announcement && (
          <div className="relative z-10 mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-purple-100" />
              <p className="text-sm leading-6 text-purple-50">{announcement}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-3 text-2xl font-black text-slate-950">{card.value}</p>
                <p className="mt-1 text-xs text-slate-400">{card.helper}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.tone}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Referral Link Generator</h2>
              <p className="text-sm text-slate-500">Copy your homepage link or create a product-specific referral link.</p>
            </div>
            <LinkIcon className="h-6 w-6 text-fuchsia-500" />
          </div>
          <div className="mt-5 grid gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm" readOnly value={baseReferralUrl} />
              <button className="rounded-2xl bg-fuchsia-500 px-5 font-bold text-white hover:bg-fuchsia-600" onClick={() => copyText(baseReferralUrl, 'Homepage referral link')}>
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <select
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-400"
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
            >
              <option value="">Select product for product referral link</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name} - {formatMoney(product.price)}</option>
              ))}
            </select>
            <div className="flex flex-col md:flex-row gap-3">
              <input className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm" readOnly value={productReferralUrl} />
              <button className="rounded-2xl bg-slate-950 px-5 font-bold text-white hover:bg-slate-800" onClick={() => copyText(productReferralUrl, 'Product referral link')}>
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Withdraw Balance</h2>
          <p className="mt-2 text-sm text-slate-500">Submit a payout request for admin approval.</p>
          <div className="mt-5 grid gap-3">
            <select className="rounded-xl border border-slate-200 px-4 py-3" value={payoutMethod} onChange={(event) => setPayoutMethod(event.target.value as any)}>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
              <option value="bank">Bank</option>
            </select>
            <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" placeholder="Amount" value={payoutAmount} onChange={(event) => setPayoutAmount(event.target.value)} />
            <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Account / number" value={payoutNumber} onChange={(event) => setPayoutNumber(event.target.value)} />
            <button onClick={requestPayout} className="inline-flex items-center justify-center gap-2 rounded-xl bg-fuchsia-500 py-3 font-bold text-white hover:bg-fuchsia-600">
              <Send className="h-4 w-4" />
              Request Payout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">Commission History</h2>
            <PackageCheck className="h-5 w-5 text-fuchsia-500" />
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="py-3">Order</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.commissions.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-4 font-semibold text-slate-800">{item.orderId}</td>
                    <td className="font-bold">{formatMoney(item.amount)}</td>
                    <td><span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-600">{item.status}</span></td>
                    <td className="text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
                {data.commissions.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-slate-400">No commission yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">Recent Referral Orders</h2>
            <ArrowUpRight className="h-5 w-5 text-fuchsia-500" />
          </div>
          <div className="mt-5 space-y-3">
            {data.orders.slice(0, 7).map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="font-bold text-slate-900">{order.id}</p>
                  <p className="text-xs text-slate-500">{formatDate(order.createdAt)} - {order.status}</p>
                </div>
                <p className="font-black text-slate-950">{formatMoney(order.totalAmount)}</p>
              </div>
            ))}
            {data.orders.length === 0 && <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-400">No referral orders yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
