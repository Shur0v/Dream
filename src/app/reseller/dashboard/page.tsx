'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Copy, Link as LinkIcon, ShoppingBag, TrendingUp, Wallet, WalletCards } from 'lucide-react';
import toast from 'react-hot-toast';

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

const formatMoney = (value: number) => `BDT ${Number(value || 0).toLocaleString('en-US')}`;

export default function ResellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNumber, setPayoutNumber] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
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

      setData(result?.data?.reseller ? result.data : null);
    } catch (error) {
      console.error('Reseller dashboard load error:', error);
      toast.error('Failed to load reseller dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const referralUrl = useMemo(() => {
    if (!data?.reseller?.referralCode) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dreamshopltd.com';
    return `${origin}/?ref=${data.reseller.referralCode}`;
  }, [data?.reseller?.referralCode]);

  const requestPayout = async () => {
    if (!data?.reseller) return;
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0 || !payoutNumber.trim()) {
      toast.error('Enter payout amount and number');
      return;
    }

    const response = await fetch('/api/reseller/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resellerId: data.reseller.id,
        amount,
        method: 'bkash',
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
    await loadDashboard();
  };

  if (loading) {
    return <div className="p-8 text-slate-600">Loading reseller dashboard...</div>;
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
    { label: 'Total Earnings', value: formatMoney(data.reseller.totalEarnings), icon: Wallet, tone: 'text-emerald-500 bg-emerald-50' },
    { label: 'Available Balance', value: formatMoney(data.reseller.availableBalance), icon: WalletCards, tone: 'text-fuchsia-500 bg-fuchsia-50' },
    { label: 'Pending Balance', value: formatMoney(data.reseller.pendingBalance), icon: TrendingUp, tone: 'text-amber-500 bg-amber-50' },
    { label: 'Tracked Orders', value: data.stats.totalOrders.toString(), icon: ShoppingBag, tone: 'text-sky-500 bg-sky-50' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-fuchsia-500 uppercase tracking-[0.2em]">Reseller dashboard</p>
          <h1 className="text-3xl font-bold text-slate-950 mt-2">
            {data.reseller.shopName || data.reseller.name}
          </h1>
          <p className="text-slate-500 mt-1">Status: <span className="font-semibold text-slate-700">{data.reseller.status}</span></p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm min-w-[300px]">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <LinkIcon className="w-4 h-4 text-fuchsia-500" />
            Referral link
          </div>
          <div className="mt-3 flex gap-2">
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" readOnly value={referralUrl} />
            <button
              className="rounded-xl bg-fuchsia-500 px-4 text-white hover:bg-fuchsia-600"
              onClick={() => {
                navigator.clipboard.writeText(referralUrl);
                toast.success('Referral link copied');
              }}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-3 text-2xl font-bold text-slate-950">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.tone}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Commission History</h2>
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
                {data.commissions.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-4 font-semibold text-slate-800">{item.orderId}</td>
                    <td>{formatMoney(item.amount)}</td>
                    <td><span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-600">{item.status}</span></td>
                    <td className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
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
          <h2 className="text-xl font-bold text-slate-950">Withdraw Balance</h2>
          <p className="mt-2 text-sm text-slate-500">Submit a bKash payout request for admin approval.</p>
          <div className="mt-5 space-y-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              type="number"
              placeholder="Amount"
              value={payoutAmount}
              onChange={(event) => setPayoutAmount(event.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              placeholder="bKash number"
              value={payoutNumber}
              onChange={(event) => setPayoutNumber(event.target.value)}
            />
            <button onClick={requestPayout} className="w-full rounded-xl bg-fuchsia-500 py-3 font-semibold text-white hover:bg-fuchsia-600">
              Request Payout
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {data.payouts.slice(0, 4).map((payout) => (
              <div key={payout.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="font-semibold">{formatMoney(payout.amount)}</span>
                <span className="text-xs uppercase text-slate-500">{payout.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
