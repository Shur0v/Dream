/**
 * @fileoverview Cancel Order API route
 * Handles order cancellation for admin panel
 * 
 * @description This file provides:
 * - POST /api/admin/orders/[id]/cancel - Cancel an order
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { OrderStatus } from '@/types';

/**
 * Cancel an order
 * 
 * @description Cancels an order, changing its status to 'cancelled'
 * Optionally accepts a cancellation reason
 * 
 * @param request - NextRequest containing optional cancellation reason
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

    // Validate order can be cancelled
    if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'refunded') {
      return NextResponse.json(
        { success: false, error: `Order cannot be cancelled. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = {
      ...order,
      status: 'cancelled' as OrderStatus,
      notes: reason ? `Cancelled: ${reason}` : order.notes,
      updatedAt: new Date().toISOString(),
    };

    // Update in database
    await saveOrder(updatedOrder);

    // TODO: Handle refund if payment was made
    // if (order.paymentStatus === 'paid') {
    //   await processRefund(order.id, order.totalAmount);
    // }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order cancelled successfully',
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

