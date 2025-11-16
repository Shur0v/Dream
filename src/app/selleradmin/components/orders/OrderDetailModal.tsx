'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { Order } from './OrdersTable';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onAcceptOrder: (orderId: string) => void;
}

/**
 * Order Detail Modal Component
 * Shows full order details including customer info, product details, and checkout data
 */
export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onAcceptOrder
}: OrderDetailModalProps) {
  if (!isOpen) return null;

  const handleAccept = () => {
    onAcceptOrder(order.id);
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  <p className="text-base text-gray-900 mt-1">{order.customerInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-base text-gray-900 mt-1">{order.customerInfo.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-base text-gray-900 mt-1">{order.customerInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">District</label>
                  <p className="text-base text-gray-900 mt-1">{order.customerInfo.district}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Upazila</label>
                  <p className="text-base text-gray-900 mt-1">{order.customerInfo.upazila}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Thana</label>
                  <p className="text-base text-gray-900 mt-1">{order.customerInfo.thana}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Post Office</label>
                  <p className="text-base text-gray-900 mt-1">{order.customerInfo.postOffice}</p>
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
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Accept Order
                </button>
              </div>
            )}

            {order.status !== 'pending' && (
              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-fuchsia-500 text-white rounded-lg font-medium hover:bg-fuchsia-600 transition-colors"
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

