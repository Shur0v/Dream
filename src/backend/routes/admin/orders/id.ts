import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(200);
    const { id } = await params;
    const body = await request.json();
    const customerInfo = body?.customerInfo ?? {};

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const district = String(customerInfo?.district ?? '').trim();
    const upazila = String(customerInfo?.upazila ?? '').trim();
    const thana = String(customerInfo?.thana ?? '').trim();
    const postOffice = String(customerInfo?.postOffice ?? '').trim();
    const customerName = String(customerInfo?.name ?? '').trim();
    const phoneNumber = String(customerInfo?.phoneNumber ?? '').trim();
    const email = String(customerInfo?.email ?? '').trim();

    if (!customerName || !phoneNumber || !district || !upazila || !thana || !postOffice) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, district, upazila, thana, and post office are required.' },
        { status: 400 }
      );
    }

    let notesData: Record<string, any> = {};
    if (order.notes) {
      try {
        notesData = JSON.parse(order.notes);
      } catch {
        notesData = {};
      }
    }

    const updated = {
      ...order,
      shippingAddress: {
        ...(order.shippingAddress || {}),
        city: district,
        state: upazila,
        street: thana,
        zipCode: postOffice,
      },
      notes: JSON.stringify({
        ...notesData,
        customerName,
        phoneNumber,
        email,
        district,
        upazila,
        thana,
        postOffice,
      }),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveOrder(updated as any);
    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Order details updated successfully',
    });
  } catch (error) {
    console.error('Update admin order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

