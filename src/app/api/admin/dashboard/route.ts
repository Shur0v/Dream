/**
 * @fileoverview Admin Dashboard API route
 * Handles dashboard statistics and data for admin panel
 * 
 * @description This file provides:
 * - GET /api/admin/dashboard - Get dashboard statistics (revenue, products, orders, filters)
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getOrders } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { DashboardStats } from '@/types';

/**
 * Get admin dashboard statistics
 * 
 * @description Returns comprehensive dashboard data including:
 * - Total revenue
 * - Total products count
 * - Total orders count
 * - Pending orders count
 * - Recent orders
 * - Revenue by period (optional)
 * 
 * @param request - NextRequest with optional query parameters for filters
 * @returns NextResponse with dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(600); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || user.role !== 'super-admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, today, week, month, year
    const status = searchParams.get('status'); // Filter orders by status

    // Get all data from database
    const allOrders = await getOrders();
    const allProducts = await getProducts();

    // Calculate total revenue from delivered/paid orders
    const revenueOrders = allOrders.filter(order => 
      order.paymentStatus === 'paid' && 
      (order.status === 'delivered' || order.status === 'shipped' || order.status === 'confirmed')
    );

    // Apply period filter
    let filteredOrders = revenueOrders;
    if (period !== 'all') {
      const now = new Date();
      const periodStart = new Date();
      
      switch (period) {
        case 'today':
          periodStart.setHours(0, 0, 0, 0);
          break;
        case 'week':
          periodStart.setDate(now.getDate() - 7);
          break;
        case 'month':
          periodStart.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          periodStart.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredOrders = revenueOrders.filter(order => 
        new Date(order.createdAt) >= periodStart
      );
    }

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalProducts = allProducts.filter(p => p.isActive).length;
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;

    // Get recent orders (last 10, sorted by creation date)
    const recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .filter(order => !status || order.status === status);

    // Calculate revenue by period for chart data
    const revenueByPeriod = calculateRevenueByPeriod(filteredOrders, period);

    const dashboardStats: DashboardStats = {
      totalRevenue,
      totalProducts,
      totalOrders,
      pendingOrders,
      recentOrders,
      revenueByPeriod,
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats,
      message: 'Dashboard statistics retrieved successfully',
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate revenue by period for chart visualization
 */
function calculateRevenueByPeriod(orders: any[], period: string) {
  const revenueByPeriod: { period: string; revenue: number }[] = [];
  
  if (period === 'month' || period === 'year') {
    // Group by month
    const monthlyRevenue: Record<string, number> = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + order.totalAmount;
    });
    
    Object.entries(monthlyRevenue).forEach(([period, revenue]) => {
      revenueByPeriod.push({ period, revenue });
    });
  } else if (period === 'week') {
    // Group by day
    const dailyRevenue: Record<string, number> = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const dayKey = date.toISOString().split('T')[0];
      dailyRevenue[dayKey] = (dailyRevenue[dayKey] || 0) + order.totalAmount;
    });
    
    Object.entries(dailyRevenue).forEach(([period, revenue]) => {
      revenueByPeriod.push({ period, revenue });
    });
  }
  
  return revenueByPeriod.sort((a, b) => a.period.localeCompare(b.period));
}

