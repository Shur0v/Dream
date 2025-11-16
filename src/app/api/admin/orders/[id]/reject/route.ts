/**
 * @fileoverview Reject Order API route
 * Handles order rejection for admin panel
 * 
 * @description This file provides:
 * - POST /api/admin/orders/[id]/reject - Reject a pending order
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { OrderStatus } from '@/types';

/**
 * Reject an order
 * 
 * @description Rejects a pending order, changing its status to 'rejected'
 * Optionally accepts a rejection reason
 * 
 * @param request - NextRequest containing optional rejection reason
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
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    // Find order
    const order = await getOrderById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate order can be rejected
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return NextResponse.json(
        { success: false, error: `Order cannot be rejected. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = {
      ...order,
      status: 'rejected' as OrderStatus,
      notes: reason ? `Rejected: ${reason}` : order.notes,
      updatedAt: new Date().toISOString(),
    };

    // Update in database
    await saveOrder(updatedOrder);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order rejected successfully',
    });

  } catch (error) {
    console.error('Reject order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

