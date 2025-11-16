'use client';

import React, { Suspense } from 'react';
import { DashboardLayout } from '../components/dashboard';
import AllProductsGrid from '../components/product/AllProductsGrid';
import { useRouter } from 'next/navigation';

function AllProductsGridWrapper() {
  return (
    <AllProductsGrid
      onDelete={(id) => {
        console.log('Product deleted', id);
      }}
    />
  );
}

export default function AllProductsPage() {
  const router = useRouter();
  
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="w-full py-12 text-center text-zinc-500">Loading products...</div>}>
        <AllProductsGridWrapper />
      </Suspense>
    </DashboardLayout>
  );
}

