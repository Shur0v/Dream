/**
 * @fileoverview Admin Orders API route
 * Handles order management for admin panel
 * 
 * @description This file provides:
 * - GET /api/admin/orders - List all orders with filtering and pagination
 * - POST /api/admin/orders/[id]/approve - Approve an order
 * - POST /api/admin/orders/[id]/reject - Reject an order
 * - POST /api/admin/orders/[id]/cancel - Cancel an order
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Order } from '@/types';

/**
 * Get all orders with filtering and pagination
 * 
 * @description Returns paginated list of orders with filtering options
 * Supports status filtering, date range, and pagination
 * 
 * @param request - NextRequest with query parameters
 * @returns NextResponse with orders list
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(800); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || user.role !== 'super-admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const allOrders = await getOrders();
    let filteredOrders = [...allOrders];

    // Apply status filter
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Apply search filter (search in order ID, user ID, or product names)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.userId.toLowerCase().includes(searchLower) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate);
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) >= start
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) <= end
      );
    }

    // Apply sorting
    filteredOrders.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: 'Orders retrieved successfully',
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

