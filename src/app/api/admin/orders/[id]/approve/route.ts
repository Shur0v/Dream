/**
 * @fileoverview Approve Order API route
 * Handles order approval for admin panel
 * 
 * @description This file provides:
 * - POST /api/admin/orders/[id]/approve - Approve a pending order
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { OrderStatus } from '@/types';

/**
 * Approve an order
 * 
 * @description Approves a pending order, changing its status to 'approved'
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing order ID
 * @returns NextResponse with updated order
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Find order
    const order = await getOrderById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate order can be approved
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return NextResponse.json(
        { success: false, error: `Order cannot be approved. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = {
      ...order,
      status: 'approved' as OrderStatus,
      updatedAt: new Date().toISOString(),
    };

    // Update in database
    await saveOrder(updatedOrder);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order approved successfully',
    });

  } catch (error) {
    console.error('Approve order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

