'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import AllProductsGrid from '../components/product/AllProductsGrid';
import { useRouter } from 'next/navigation';

export default function AllProductsPage() {
  const router = useRouter();
  
  return (
    <DashboardLayout>
      <AllProductsGrid
        onDelete={(id) => {
          console.log('Product deleted', id);
        }}
      />
    </DashboardLayout>
  );
}

