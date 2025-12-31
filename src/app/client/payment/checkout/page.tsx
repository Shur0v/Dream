'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckoutModal } from '@/components/cart/CheckoutModal';
import { stateFirstPaymentService } from '@/services/payment';
import { apiService } from '@/services/api';

export default function PaymentCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const orderId = searchParams?.get('orderId');
    if (orderId) {
      const stored = sessionStorage.getItem(`order_${orderId}`);
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    }
  }, [searchParams]);

  const handleCheckoutSubmit = async (formData: {
    name: string;
    phoneNumber: string;
    email: string;
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
  }) => {
    setIsSubmitting(true);
    
    try {
      const orderId = searchParams?.get('orderId') || `order-${Date.now()}`;
      const type = searchParams?.get('type') || 'product';
      const price = parseFloat(searchParams?.get('price') || '0');
      const productId = searchParams?.get('productId') || undefined;
      const quantity = parseInt(searchParams?.get('quantity') || '1');
      const productName = searchParams?.get('productName') || 'Product';

      // Prepare payment data for State First
      const paymentData = {
        amount: price,
        currency: 'BDT',
        orderId: orderId,
        customerName: formData.name,
        customerPhone: formData.phoneNumber,
        customerEmail: formData.email,
        customerAddress: {
          district: formData.district,
          upazila: formData.upazila,
          thana: formData.thana,
          postOffice: formData.postOffice,
        },
        items: [{
          productId: productId || orderId,
          productName: productName,
          quantity: quantity,
          price: price / quantity,
        }],
        returnUrl: `${window.location.origin}/client/payment/success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/client/payment/cancel?orderId=${orderId}`,
      };

      // Store order data for later use
      const tempUserId = `user-${Date.now()}`;
      const orderPayload = {
        userId: tempUserId,
        items: [{
          id: `item-${Date.now()}`,
          productId: productId || orderId,
          product: {
            id: productId || orderId,
            name: productName,
            price: price / quantity,
            category: 'General',
            sellerId: 'dreamshop',
            images: ['/placeholder-image.png'],
          },
          quantity: quantity,
          price: price / quantity,
        }],
        shippingAddress: {
          street: `${formData.thana}, ${formData.upazila}`,
          city: formData.district,
          state: formData.district,
          zipCode: formData.postOffice,
          country: 'Bangladesh',
        },
        paymentMethod: 'State First Payment',
        notes: JSON.stringify({
          customerName: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          district: formData.district,
          upazila: formData.upazila,
          thana: formData.thana,
          postOffice: formData.postOffice,
        }),
      };

      sessionStorage.setItem(`order_${orderId}`, JSON.stringify({
        orderData: orderPayload,
        paymentData: paymentData,
        customerInfo: formData,
      }));

      // Create payment session with State First
      const paymentResponse = await stateFirstPaymentService.createPaymentSession(paymentData);
      
      if (paymentResponse.success && paymentResponse.paymentUrl) {
        // Redirect to State First payment page
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error(paymentResponse.error || 'Failed to create payment session');
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again. Error: ' + (error.message || 'Unknown error'));
      setIsCheckoutOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => router.push('/')}
        onSubmit={handleCheckoutSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

