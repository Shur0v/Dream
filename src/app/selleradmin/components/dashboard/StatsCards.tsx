'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Package } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { cn } from '@/lib/utils';
import { Order as ApiOrder } from '@/types';

interface StatsCardsProps {
  className?: string;
}

/**
 * Stats Cards Container Component (Layer 3)
 * 
 * @description Container for multiple statistics cards
 * Calculates total amount and total products from orders data
 */
export const StatsCards: React.FC<StatsCardsProps> = ({ className }) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all orders from admin API (same endpoint as orders page)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/admin/orders?limit=1000&sortBy=createdAt&sortOrder=desc`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data)) {
          // Calculate total amount from all orders
          const amount = result.data.reduce((sum: number, order: ApiOrder) => {
            return sum + (order.totalAmount || 0);
          }, 0);

          // Calculate total products (sum of all items in all orders)
          const products = result.data.reduce((sum: number, order: ApiOrder) => {
            const itemsCount = order.items?.reduce((itemSum: number, item: any) => {
              return itemSum + (item.quantity || 1);
            }, 0) || 0;
            return sum + itemsCount;
          }, 0);

          setTotalAmount(amount);
          setTotalProducts(products);
        }
      } catch (error) {
        console.error('Error fetching orders for stats:', error);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
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

