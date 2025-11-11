'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddBannerForm from '../components/banner/AddBannerForm';
import { useRouter } from 'next/navigation';

export default function AddBannerPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <AddBannerForm
        onBack={() => router.back()}
        onSave={(data) => {
          console.log('Banners saved', data);
          // TODO: integrate with API/redux later
        }}
      />
    </DashboardLayout>
  );
}

