import { NextRequest, NextResponse } from 'next/server';
import { getPayouts, updatePayoutStatus } from '@backend/lib/db';
import { PayoutStatus } from '@/types';

export async function GET() {
  try {
    const payouts = await getPayouts();
    return NextResponse.json({ success: true, data: payouts });
  } catch (error) {
    console.error('Admin get payouts error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const payout = await updatePayoutStatus(String(body.id || ''), body.status as PayoutStatus, body.note);
    if (!payout) {
      return NextResponse.json({ success: false, error: 'Payout not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: payout, message: 'Payout updated' });
  } catch (error) {
    console.error('Admin update payout error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
