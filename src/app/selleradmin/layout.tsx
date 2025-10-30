'use client';

import React from 'react';
import SellerAdminHeader from './components/layout/SellerAdminHeader';

export default function SellerAdminLayout({ children }: { children: React.ReactNode; }) {
  return (
    <>
      <SellerAdminHeader />
      {children}
    </>
  );
}


