'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddFestivalOfferForm from '../components/festival/AddFestivalOfferForm';
import { useRouter } from 'next/navigation';

export default function FestivalOfferPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <AddFestivalOfferForm
        onBack={() => router.back()}
        onSave={(data) => {
          console.log('Festival offer banners saved', data);
          // TODO: integrate with API/redux later
        }}
        onDelete={(id) => console.log('Festival offer banner deleted', id)}
      />
    </DashboardLayout>
  );
}

