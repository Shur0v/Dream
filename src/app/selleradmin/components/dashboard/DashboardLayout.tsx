'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { WelcomeSection } from './WelcomeSection';
import { StatsCards } from './StatsCards';
import { RecentCustomerInfoTable } from './RecentCustomerInfoTable';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Dashboard Layout Component (Layer 1 - Parent)
 * 
 * @description Main layout wrapper for seller admin dashboard
 * Provides sidebar, header, and content area structure
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('w-full min-h-screen relative bg-white overflow-hidden flex', className)}>
      {/* Sidebar (Layer 2) */}
      <Sidebar className="flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 ml-80">
        {/* Header (Layer 2) */}
        <DashboardHeader />

        {/* Content Section (Layer 2) */}
        <div className="flex-1 p-10 bg-white overflow-auto">
          <div className="w-full max-w-full inline-flex flex-col justify-start items-start gap-10">
            {/* Welcome Section (Layer 3) */}
            <WelcomeSection />

            {/* Stats Cards (Layer 3) */}
            <StatsCards />

            {/* Recent Customer Info Table (Layer 3) */}
            <RecentCustomerInfoTable />

            {/* Optional children content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

