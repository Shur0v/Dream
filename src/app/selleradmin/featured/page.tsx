'use client';

import React from 'react';
import { DashboardLayout } from '../components/dashboard';
import ProductTable from '../components/product/ProductTable';

export default function FeaturedPage() {
  return (
    <DashboardLayout>
      <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins'] mb-6">Featured Products</h2>
      <ProductTable mode="featured" />
    </DashboardLayout>
  );
}


