'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Truck, MapPin, Phone, Mail, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '@/services/api';
import { Order } from '@/types';
import Link from 'next/link';

export default function DeliveryPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setLoading(true);
      
      // Get last order ID from session storage
      const lastOrderId = sessionStorage.getItem('lastOrderId');
      
      if (lastOrderId) {
        const response = await apiService.getOrder(lastOrderId);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          // Try to get from orders list
          const ordersResponse = await apiService.getOrders();
          if (ordersResponse.success && ordersResponse.data && ordersResponse.data.length > 0) {
            // Get the most recent order
            const recentOrder = ordersResponse.data.sort(
              (a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];
            setOrder(recentOrder);
          } else {
            setError('Order not found');
          }
        }
      } else {
        // Try to get from orders list
        const ordersResponse = await apiService.getOrders();
        if (ordersResponse.success && ordersResponse.data && ordersResponse.data.length > 0) {
          const recentOrder = ordersResponse.data.sort(
            (a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          setOrder(recentOrder as Order);
        } else {
          setError('No orders found');
        }
      }
    } catch (err: any) {
      console.error('Error loading order:', err);
      setError(err.message || 'Failed to load order information');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order information...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order information'}</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/client/dashboard"
              className="px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-6 h-6 text-fuchsia-500" />
              Delivery Tracking
            </h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="text-gray-600">
            <p className="font-medium">Order ID: <span className="text-gray-900">{order.id}</span></p>
            {order.trackingNumber && (
              <p className="font-medium mt-1">
                Tracking Number: <span className="text-gray-900">{order.trackingNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-fuchsia-500" />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {item.product?.images && item.product.images.length > 0 && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name || 'Product'}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-fuchsia-600">৳{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-fuchsia-500" />
            Delivery Address
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 font-medium">{order.shippingAddress.street}</p>
            <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="text-gray-600">Postal Code: {order.shippingAddress.zipCode}</p>
            <p className="text-gray-600">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-fuchsia-500" />
            Need Help?
          </h2>
          <div className="space-y-3">
            <a
              href="tel:01846437119"
              className="flex items-center gap-3 text-gray-700 hover:text-fuchsia-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>01846-437119</span>
            </a>
            <a
              href="https://wa.me/8801576609601"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-fuchsia-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>WhatsApp: 01576-609601</span>
            </a>
            <a
              href="mailto:support@dreamshopltd.com"
              className="flex items-center gap-3 text-gray-700 hover:text-fuchsia-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>support@dreamshopltd.com</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/client/dashboard"
            className="flex-1 px-6 py-3 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors text-center font-medium"
          >
            View All Orders
          </Link>
          <Link
            href="/client/categories"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

