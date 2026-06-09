'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import toast from 'react-hot-toast';

type Payout = {
  id: string;
  resellerId: string;
  amount: number;
  method: string;
  number: string;
  status: string;
  createdAt: string;
};

export default function SellerAdminPayoutsPage() {
  const [items, setItems] = useState<Payout[]>([]);

  const load = async () => {
    const response = await fetch('/api/admin/resellers/payouts', { cache: 'no-store' });
    const result = await response.json();
    setItems(Array.isArray(result?.data) ? result.data : []);
  };

  useEffect(() => {
    void load();
  }, []);

  const update = async (id: string, status: string) => {
    const response = await fetch('/api/admin/resellers/payouts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      toast.error(result.error || 'Failed to update payout');
      return;
    }
    toast.success(`Payout ${status}`);
    await load();
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">Payout Requests</h1>
          <p className="text-slate-500 mt-1">Approve, mark paid, or reject reseller withdrawal requests.</p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-4">Reseller</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-mono text-xs">{item.resellerId}</td>
                    <td className="px-5 py-4 font-semibold">BDT {Number(item.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">{item.method} - {item.number}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-600">{item.status}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => update(item.id, 'approved')} className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white">Approve</button>
                        <button onClick={() => update(item.id, 'paid')} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white">Paid</button>
                        <button onClick={() => update(item.id, 'rejected')} className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-slate-400">No payout requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
