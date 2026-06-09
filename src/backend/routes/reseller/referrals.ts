import { NextRequest, NextResponse } from 'next/server';
import { getReferrals, trackReferralClick } from '@backend/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resellerId = searchParams.get('resellerId') || undefined;
    const referrals = await getReferrals(resellerId);
    return NextResponse.json({ success: true, data: referrals });
  } catch (error) {
    console.error('Get referrals error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const referralCode = String(body.referralCode || '').trim();
    if (!referralCode) {
      return NextResponse.json({ success: false, error: 'Referral code is required' }, { status: 400 });
    }

    const clickedIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      undefined;
    const referral = await trackReferralClick({
      referralCode,
      clickedIp,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success: true, data: referral });
  } catch (error) {
    console.error('Track referral error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
