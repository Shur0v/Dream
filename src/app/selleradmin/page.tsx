'use client';

import React from 'react';
import { DashboardLayout } from './components/dashboard';
import DashboardHome from './components/dashboard/DashboardHome';

/**
 * Seller Admin Dashboard Page
 * 
 * @description Main dashboard page for seller admin with sidebar navigation,
 * header, welcome section, statistics cards, and recent customer info table
 */
export default function SellerAdminLandingFull() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}


