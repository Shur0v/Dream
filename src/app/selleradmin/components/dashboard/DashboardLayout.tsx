'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
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
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

