import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@backend/lib/db';
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

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return NextResponse.json(
        { success: false, error: `Order cannot be rejected. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    const updatedOrder = {
      ...order,
      status: 'rejected' as OrderStatus,
      notes: reason ? `Rejected: ${reason}` : order.notes,
      updatedAt: new Date().toISOString(),
    };

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

