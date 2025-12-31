'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { apiService } from '@/services/api';
import { stateFirstPaymentService } from '@/services/payment';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderIdParam = searchParams?.get('orderId');
    const transactionId = searchParams?.get('transaction_id') || searchParams?.get('transactionId');
    
    if (orderIdParam) {
      setOrderId(orderIdParam);
      processOrder(orderIdParam, transactionId || undefined);
    } else {
      setError('Order ID not found');
      setIsProcessing(false);
    }
  }, [searchParams]);

  const processOrder = async (orderId: string, transactionId?: string) => {
    try {
      // Get stored order data
      const stored = sessionStorage.getItem(`order_${orderId}`);
      if (!stored) {
        throw new Error('Order data not found');
      }

      const orderInfo = JSON.parse(stored);
      setOrderData(orderInfo);

      // Verify payment if transaction ID is available
      if (transactionId) {
        const verifyResponse = await stateFirstPaymentService.verifyPayment(transactionId);
        if (!verifyResponse.success) {
          console.warn('Payment verification failed:', verifyResponse.error);
        }
      }

      // Create order in database
      if (orderInfo.orderData) {
        const orderResponse = await apiService.createOrder(orderInfo.orderData);
        
        if (orderResponse.success) {
          // Clear session storage
          sessionStorage.removeItem(`order_${orderId}`);
          
          // Store order ID for delivery page
          sessionStorage.setItem('lastOrderId', orderResponse.data.id);
          
          setIsProcessing(false);
        } else {
          throw new Error(orderResponse.error || 'Failed to create order');
        }
      } else {
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Error processing order:', error);
      setError(error.message || 'Failed to process order');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Processing Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => router.push('/client/dashboard')}
              className="px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
        </div>

        {/* Order Details */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">{orderId}</span>
              </div>
              {orderData?.paymentData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-gray-900">
                      ৳{orderData.paymentData.amount.toFixed(2)}
                    </span>
                  </div>
                  {orderData.customerInfo && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium text-gray-900">{orderData.customerInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">{orderData.customerInfo.phoneNumber}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            What's Next?
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">1.</span>
              <span>You will receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">2.</span>
              <span>Your order will be processed and shipped within 2-3 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">3.</span>
              <span>You can track your order from your dashboard</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/client/delivery"
            className="flex-1 px-6 py-3 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors text-center font-medium flex items-center justify-center gap-2"
          >
            <Truck className="w-5 h-5" />
            Track Delivery
          </Link>
          <Link
            href="/client/dashboard"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

