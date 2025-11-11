'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddFakeReviewForm from '../components/review/AddFakeReviewForm';
import { useRouter } from 'next/navigation';

export default function FakeReviewPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <AddFakeReviewForm
        onBack={() => router.back()}
        onSave={(data) => {
          console.log('Fake review saved', data);
          // TODO: integrate with API/redux later
        }}
        onDelete={(id) => console.log('Fake review deleted', id)}
      />
    </DashboardLayout>
  );
}

