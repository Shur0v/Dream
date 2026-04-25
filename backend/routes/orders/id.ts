import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@backend/lib/db';

const shortDelay = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await shortDelay();
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order retrieved successfully',
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await shortDelay();
    const { id } = await params;
    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const payload = await request.json();
    const updatedOrder = {
      ...existingOrder,
      ...payload,
      id,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveOrder(updatedOrder as any);

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

