/**
 * @fileoverview Recent Orders API route
 * Handles recent orders for admin dashboard
 * 
 * @description This file provides:
 * - GET /api/admin/orders/recent - Get recent orders with approve/cancel options
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';

/**
 * Get recent orders
 * 
 * @description Returns recent orders sorted by creation date
 * Typically used for dashboard display
 * 
 * @param request - NextRequest with optional query parameters
 * @returns NextResponse with recent orders
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(500); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || user.role !== 'super-admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // Filter by status

    // Get recent orders, sorted by creation date (newest first)
    const allOrders = await getOrders();
    let recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    // Apply status filter if provided
    if (status) {
      recentOrders = recentOrders.filter(order => order.status === status);
    }

    return NextResponse.json({
      success: true,
      data: recentOrders,
      message: 'Recent orders retrieved successfully',
    });

  } catch (error) {
    console.error('Get recent orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

