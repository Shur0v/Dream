import { NextRequest, NextResponse } from 'next/server';
import {
  getProducts,
  getOrders,
  getMonthlyTargetSettings,
  saveMonthlyTargetSettings,
  resetMonthlyTargetSettings,
} from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { DashboardStats } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(600);

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';
    const status = searchParams.get('status');

    const allOrders = await getOrders();
    const allProducts = await getProducts();

    const revenueOrders = allOrders.filter(order =>
      order.paymentStatus === 'paid' &&
      (order.status === 'delivered' || order.status === 'shipped' || order.status === 'confirmed')
    );

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

    const recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .filter(order => !status || order.status === status);

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
      monthlyTarget: await getMonthlyTargetSettings(),
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = Number(body?.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid target amount is required (0 or more)' },
        { status: 400 }
      );
    }

    const monthlyTarget = await saveMonthlyTargetSettings(amount);
    return NextResponse.json({
      success: true,
      data: monthlyTarget,
      message: 'Monthly target updated successfully',
    });
  } catch (error) {
    console.error('Update monthly target error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const monthlyTarget = await resetMonthlyTargetSettings();
    return NextResponse.json({
      success: true,
      data: monthlyTarget,
      message: 'Monthly target reset successfully',
    });
  } catch (error) {
    console.error('Reset monthly target error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateRevenueByPeriod(orders: any[], period: string) {
  const revenueByPeriod: { period: string; revenue: number }[] = [];

  if (period === 'month' || period === 'year') {
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

