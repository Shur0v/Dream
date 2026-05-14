import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder } from '@backend/lib/db';
import { OrderStatus } from '@/types';
import { buildSteadfastRecipientAddress, createSteadfastOrder, isSteadfastEnabled } from '@backend/lib/steadfast';

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

    let savedOrder = await saveOrder(newOrder as any);

    let steadfast: any = null;
    if (isSteadfastEnabled()) {
      let recipientName = 'Customer';
      let recipientPhone = '';
      let noteText = '';
      try {
        const parsedNotes = typeof notes === 'string' ? JSON.parse(notes) : notes;
        recipientName = parsedNotes?.customerName || parsedNotes?.name || recipientName;
        recipientPhone = parsedNotes?.phoneNumber || parsedNotes?.mobile || parsedNotes?.phone || recipientPhone;
        noteText = parsedNotes?.note || parsedNotes?.remarks || '';
      } catch {
        // Ignore parse errors
      }

      const steadFastResult = await createSteadfastOrder({
        invoice: savedOrder.id,
        recipient_name: recipientName,
        recipient_phone: recipientPhone || '8801000000000',
        recipient_address: buildSteadfastRecipientAddress(shippingAddress || {}),
        cod_amount: Number(totalAmount) || 0,
        note: noteText || `Order ${savedOrder.id}`,
      });

      steadfast = steadFastResult;

      if (steadFastResult.success) {
        const enrichedOrder = {
          ...savedOrder,
          trackingNumber: steadFastResult.trackingCode || savedOrder.trackingNumber,
          notes: JSON.stringify({
            ...(typeof notes === 'string' ? (() => { try { return JSON.parse(notes); } catch { return {}; } })() : (notes || {})),
            steadfast: {
              consignmentId: steadFastResult.consignmentId,
              trackingCode: steadFastResult.trackingCode,
              paymentUrl: steadFastResult.paymentUrl,
              statusCode: steadFastResult.statusCode,
            },
          }),
        };
        savedOrder = await saveOrder(enrichedOrder as any);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: savedOrder,
        steadfast,
        paymentUrl: steadfast?.paymentUrl,
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
