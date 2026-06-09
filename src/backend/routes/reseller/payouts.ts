import { NextRequest, NextResponse } from 'next/server';
import { getPayouts, requestPayout } from '@backend/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resellerId = searchParams.get('resellerId') || undefined;
    const payouts = await getPayouts(resellerId);
    return NextResponse.json({ success: true, data: payouts });
  } catch (error) {
    console.error('Get payouts error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payout = await requestPayout({
      resellerId: String(body.resellerId || ''),
      amount: Number(body.amount || 0),
      method: body.method || 'bkash',
      number: String(body.number || ''),
    });
    return NextResponse.json({ success: true, data: payout, message: 'Payout request submitted' }, { status: 201 });
  } catch (error) {
    console.error('Request payout error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 400 }
    );
  }
}
