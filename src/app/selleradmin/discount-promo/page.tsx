'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddDiscountPromoForm from '../components/discount/AddDiscountPromoForm';
import { useRouter } from 'next/navigation';

export default function DiscountPromoPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <AddDiscountPromoForm
        onBack={() => router.back()}
        onSave={(data) => {
          console.log('Discount promo banners saved', data);
          // TODO: integrate with API/redux later
        }}
        onDelete={(id) => console.log('Discount promo banner deleted', id)}
      />
    </DashboardLayout>
  );
}

