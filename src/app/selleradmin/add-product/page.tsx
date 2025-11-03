'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddProductForm from '../components/product/AddProductForm';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <AddProductForm
        onBack={() => router.back()}
        onSave={(data) => {
          // TODO: integrate with redux/api later
          // For now, just log
          console.log('Product saved', data);
        }}
      />
    </DashboardLayout>
  );
}


