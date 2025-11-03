'use client';

import React from 'react';
import { WelcomeSection } from './WelcomeSection';
import { StatsCards } from './StatsCards';
import { RecentCustomerInfoTable } from './RecentCustomerInfoTable';

export default function DashboardHome() {
  return (
    <div className="w-full max-w-full inline-flex flex-col justify-start items-start gap-10">
      <WelcomeSection />
      <StatsCards />
      <RecentCustomerInfoTable />
    </div>
  );
}


