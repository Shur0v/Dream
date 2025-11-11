'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AddColorForm from '../components/color/AddColorForm';
import { useRouter } from 'next/navigation';

export default function AddColorPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <AddColorForm
        onCancel={() => router.back()}
        onConfirm={(d) => console.log('Color saved', d)}
        onDelete={(id) => console.log('Color deleted', id)}
      />
    </DashboardLayout>
  );
}

