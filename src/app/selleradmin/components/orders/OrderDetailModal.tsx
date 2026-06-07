'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check, Loader2 } from 'lucide-react';
import { Order } from './OrdersTable';
import { getApiUrl } from '@/lib/apiConfig';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onAcceptOrder: (orderId: string) => void;
  isAccepting?: boolean;
  onOrderUpdated?: () => Promise<void> | void;
}

/**
 * Order Detail Modal Component
 * Shows full order details including customer info, product details, and checkout data
 */
export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onAcceptOrder,
  isAccepting = false,
  onOrderUpdated,
}: OrderDetailModalProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [form, setForm] = React.useState(order.customerInfo);

  React.useEffect(() => {
    setForm(order.customerInfo);
  }, [order]);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (!isAccepting) {
      onAcceptOrder(order.id);
    }
  };

  const saveEdits = async () => {
    if (!form.name || !form.phoneNumber || !form.district || !form.upazila || !form.thana || !form.postOffice) {
      alert('Please fill required fields before saving.');
      return;
    }
    try {
      setIsSaving(true);
      const response = await fetch(getApiUrl(`admin/orders/${order.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerInfo: form }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Failed to update order.');
      }
      if (onOrderUpdated) {
        await onOrderUpdated();
      }
      onClose();
    } catch (error: any) {
      alert(error?.message || 'Failed to update order.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-zinc-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-5 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 font-['Poppins']">Order Details</h2>
              <div className="text-xs text-zinc-450 font-semibold font-['Poppins'] mt-1">
                Order ID: <span className="text-purple-650 font-mono font-bold bg-purple-50/60 px-2 py-0.5 rounded-md border border-purple-100/50 inline-block"><code>{order.orderId}</code></span>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isAccepting}
              className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 border border-transparent hover:border-zinc-200/50 transition-all inline-flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-zinc-55/30 border border-zinc-150/70 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-extrabold text-zinc-450 font-['Poppins'] uppercase tracking-wider mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Name</label>
                  <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Phone Number</label>
                  <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={form.phoneNumber} onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Email</label>
                  <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">District</label>
                  <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={form.district} onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Upazila</label>
                  <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={form.upazila} onChange={(e) => setForm((prev) => ({ ...prev, upazila: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Thana</label>
                  <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={form.thana} onChange={(e) => setForm((prev) => ({ ...prev, thana: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Post Office</label>
                  <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']" value={form.postOffice} onChange={(e) => setForm((prev) => ({ ...prev, postOffice: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-zinc-450 font-['Poppins'] uppercase tracking-wider">Product Details</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-zinc-150 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-zinc-850 font-['Poppins'] truncate">{item.name}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs font-['Poppins']">
                        <div>
                          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Price:</span>
                          <span className="ml-2 font-semibold text-zinc-700">৳{item.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Qty:</span>
                          <span className="ml-2 font-semibold text-zinc-700">{item.quantity}x</span>
                        </div>
                        {item.color && (
                          <div>
                            <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Color:</span>
                            <span className="ml-2 font-semibold text-zinc-700">{item.color}</span>
                          </div>
                        )}
                        {item.size && (
                          <div>
                            <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Size:</span>
                            <span className="ml-2 font-semibold text-zinc-700">{item.size}</span>
                          </div>
                        )}
                        <div className="col-span-2 pt-1.5 border-t border-zinc-100">
                          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Subtotal:</span>
                          <span className="ml-2 font-extrabold text-purple-600">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-purple-50/50 border border-purple-100/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-700 font-['Poppins']">Total Amount:</span>
                <span className="text-xl font-black text-purple-650 font-['Poppins']">
                  ৳{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {order.status === 'pending' && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={saveEdits}
                  disabled={isAccepting || isSaving}
                  className="px-5 py-2.5 border border-purple-200 hover:bg-purple-50 text-purple-650 text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-['Poppins']"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isAccepting || isSaving}
                  className="px-5 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-['Poppins']"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed font-['Poppins']"
                >
                  {isAccepting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Check className="w-4 h-4 text-white" />
                  )}
                  Accept Order
                </button>
              </div>
            )}

            {order.status !== 'pending' && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={saveEdits}
                  disabled={isSaving}
                  className="px-5 py-2.5 border border-purple-200 hover:bg-purple-50 text-purple-650 text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer disabled:opacity-50 font-['Poppins']"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer font-['Poppins']"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
