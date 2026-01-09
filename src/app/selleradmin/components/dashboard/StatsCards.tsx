'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Package } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { cn } from '@/lib/utils';
import { getDashboardStats } from '@/lib/indexeddb/adminCache';

interface StatsCardsProps {
  className?: string;
}

/**
 * Stats Cards Container Component (Layer 3)
 * 
 * @description Container for multiple statistics cards
 * Calculates total amount and total products from orders data
 * Uses IndexedDB cache for instant loading
 */
export const StatsCards: React.FC<StatsCardsProps> = ({ className }) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        
        // Get stats from cache (instant) or API
        // Cache will be checked first, then API if needed
        const stats = await getDashboardStats();
        
        setTotalAmount(stats.totalAmount);
        setTotalProducts(stats.totalProducts);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Format amount with currency
  const formatAmount = (amount: number): string => {
    return `৳${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format product count
  const formatProductCount = (count: number): string => {
    return count.toLocaleString('en-US');
  };

  return (
    <div className={cn('self-stretch inline-flex justify-start items-start gap-10', className)}>
      <StatsCard
        title="Total amount"
        value={isLoading ? 'Loading...' : formatAmount(totalAmount)}
        iconBg="bg-fuchsia-100"
        icon={<DollarSign className="w-20 h-20 text-fuchsia-600" />}
      />
      <StatsCard
        title="Total Product"
        value={isLoading ? 'Loading...' : formatProductCount(totalProducts)}
        iconBg="bg-fuchsia-100"
        icon={<Package className="w-20 h-20 text-fuchsia-600" />}
      />
    </div>
  );
};

export default StatsCards;

