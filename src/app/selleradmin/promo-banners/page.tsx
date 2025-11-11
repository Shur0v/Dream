'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddPromoBannerForm from '../components/promo/AddPromoBannerForm';
import { useRouter } from 'next/navigation';

export default function PromoBannersPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <AddPromoBannerForm
        onBack={() => router.back()}
        onSave={(data) => {
          console.log('Promo banners saved', data);
          // TODO: integrate with API/redux later
        }}
        onDelete={(id) => console.log('Promo banner deleted', id)}
      />
    </DashboardLayout>
  );
}

