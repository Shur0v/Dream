import { NextRequest, NextResponse } from 'next/server';
import { getResellerById, saveReseller } from '@backend/lib/db';
import { ResellerStatus } from '@/types';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const reseller = await getResellerById(id);
    if (!reseller) {
      return NextResponse.json({ success: false, error: 'Reseller not found' }, { status: 404 });
    }

    const status = body.status as ResellerStatus | undefined;
    const updated = await saveReseller({
      ...reseller,
      status: status || reseller.status,
      shopName: body.shopName ?? reseller.shopName,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updated, message: 'Reseller updated' });
  } catch (error) {
    console.error('Admin update reseller error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
