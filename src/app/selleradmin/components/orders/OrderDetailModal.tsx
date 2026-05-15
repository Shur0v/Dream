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
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-500 mt-1">Order ID: {order.orderId}</p>
            </div>
            <button
              onClick={onClose}
              disabled={isAccepting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.phoneNumber} onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">District</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.district} onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Upazila</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.upazila} onChange={(e) => setForm((prev) => ({ ...prev, upazila: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Thana</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.thana} onChange={(e) => setForm((prev) => ({ ...prev, thana: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Post Office</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={form.postOffice} onChange={(e) => setForm((prev) => ({ ...prev, postOffice: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-2 font-medium text-gray-900">৳{item.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-medium text-gray-900">{item.quantity}x</span>
                        </div>
                        {item.color && (
                          <div>
                            <span className="text-gray-500">Color:</span>
                            <span className="ml-2 font-medium text-gray-900">{item.color}</span>
                          </div>
                        )}
                        {item.size && (
                          <div>
                            <span className="text-gray-500">Size:</span>
                            <span className="ml-2 font-medium text-gray-900">{item.size}</span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="ml-2 font-semibold text-gray-900">
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
            <div className="bg-fuchsia-50 rounded-lg p-5 border border-fuchsia-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-fuchsia-600">
                  ৳{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {order.status === 'pending' && (
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={saveEdits}
                  disabled={isAccepting || isSaving}
                  className="px-6 py-3 border border-blue-300 rounded-lg text-blue-700 font-medium hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={onClose}
                  disabled={isAccepting || isSaving}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close
                </button>
                <button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAccepting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  Accept Order
                </button>
              </div>
            )}

            {order.status !== 'pending' && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={saveEdits}
                  disabled={isSaving}
                  className="px-6 py-3 border border-blue-300 rounded-lg text-blue-700 font-medium hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-fuchsia-500 text-white rounded-lg font-medium hover:bg-fuchsia-600 transition-colors cursor-pointer"
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

