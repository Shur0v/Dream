'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddCategoryForm from '../components/category/AddCategoryForm';
import { useRouter } from 'next/navigation';

export default function AddCategoryPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <AddCategoryForm onCancel={() => router.back()} onConfirm={(d) => console.log('Category saved', d)} />
    </DashboardLayout>
  );
}


