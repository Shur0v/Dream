import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder } from '@backend/lib/db';
import { OrderStatus } from '@/types';

const shortDelay = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
};

export async function GET(request: NextRequest) {
  try {
    await shortDelay();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    let orders = await getOrders();

    if (userId) {
      orders = orders.filter((order) => order.userId === userId);
    }
    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    return NextResponse.json({
      success: true,
      data: orders,
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await shortDelay();
    const body = await request.json();
    const { userId, items, shippingAddress, billingAddress, paymentMethod, notes } = body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'User ID and items are required' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const newOrder = {
      id: `order-${Date.now()}`,
      userId: String(userId),
      items: items.map((item: any, index: number) => ({
        id: `order-item-${Date.now()}-${index}`,
        productId: item.productId,
        product: item.product,
        quantity: item.quantity || 1,
        price: item.price || 0,
        color: item.color,
        size: item.size,
      })),
      status: 'pending' as OrderStatus,
      totalAmount,
      shippingAddress: shippingAddress || {},
      billingAddress: billingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'pending' as 'pending' | 'paid' | 'failed' | 'refunded',
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    const savedOrder = await saveOrder(newOrder as any);
    return NextResponse.json(
      {
        success: true,
        data: savedOrder,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

