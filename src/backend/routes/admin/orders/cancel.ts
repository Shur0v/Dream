import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder, settleCommissionForOrder } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { OrderStatus } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(800);

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'refunded') {
      return NextResponse.json(
        { success: false, error: `Order cannot be cancelled. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    const updatedOrder = {
      ...order,
      status: 'cancelled' as OrderStatus,
      notes: reason ? `Cancelled: ${reason}` : order.notes,
      updatedAt: new Date().toISOString(),
    };

    await saveOrder(updatedOrder);
    await settleCommissionForOrder(updatedOrder.id, 'cancelled');

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

