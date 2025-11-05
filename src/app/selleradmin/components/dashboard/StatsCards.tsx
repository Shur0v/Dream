'use client';

import React from 'react';
import { DollarSign, Package } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  className?: string;
}

/**
 * Stats Cards Container Component (Lay 3)
 * 
 * @description Container for multiple statistics cards
 */
export const StatsCards: React.FC<StatsCardsProps> = ({ className }) => {
  return (
    <div className={cn('self-stretch inline-flex justify-start items-start gap-10', className)}>
      <StatsCard
        title="Total amount"
        value="$7,000.00"
        iconBg="bg-fuchsia-100"
        icon={<DollarSign className="w-20 h-20 text-fuchsia-600" />}
      />
      <StatsCard
        title="Total Product"
        value="$7,000.00"
        iconBg="bg-fuchsia-100"
        icon={<Package className="w-20 h-20 text-fuchsia-600" />}
      />
    </div>
  );
};

export default StatsCards;

