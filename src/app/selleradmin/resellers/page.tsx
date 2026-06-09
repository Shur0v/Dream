'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import toast from 'react-hot-toast';

type Reseller = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  shopName?: string;
  referralCode: string;
  status: string;
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
};

export default function SellerAdminResellersPage() {
  const [items, setItems] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/resellers', { cache: 'no-store' });
      const result = await response.json();
      setItems(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.error('Load resellers error:', error);
      toast.error('Failed to load resellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/admin/resellers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      toast.error(result.error || 'Failed to update reseller');
      return;
    }
    toast.success(`Reseller ${status}`);
    await load();
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">Resellers</h1>
          <p className="text-slate-500 mt-1">Approve, ban, and monitor reseller wallet balances.</p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-4">Reseller</th>
                  <th className="px-5 py-4">Referral</th>
                  <th className="px-5 py-4">Wallet</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-950">{item.shopName || item.name}</div>
                      <div className="text-slate-500">{item.phone} {item.email ? `- ${item.email}` : ''}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-fuchsia-600">{item.referralCode}</td>
                    <td className="px-5 py-4">
                      <div>Available: BDT {Number(item.availableBalance || 0).toLocaleString()}</div>
                      <div className="text-slate-500">Pending: BDT {Number(item.pendingBalance || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-600">{item.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(item.id, 'active')} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white">Approve</button>
                        <button onClick={() => updateStatus(item.id, 'banned')} className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white">Ban</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400">No resellers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
