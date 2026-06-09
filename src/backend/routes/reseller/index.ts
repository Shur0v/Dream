import { NextRequest, NextResponse } from 'next/server';
import { createResellerSignup, getResellerByUserId, getResellerDashboardData, getResellers } from '@backend/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resellerId = searchParams.get('resellerId');
    const userId = searchParams.get('userId');

    const resolvedResellerId = resellerId || (userId ? (await getResellerByUserId(userId))?.id : undefined);
    if (resolvedResellerId) {
      const dashboard = await getResellerDashboardData(resolvedResellerId);
      if (!dashboard) {
        return NextResponse.json({ success: false, error: 'Reseller not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: dashboard });
    }

    const resellers = await getResellers(true);
    return NextResponse.json({ success: true, data: resellers });
  } catch (error) {
    console.error('Get reseller data error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || body.shopName || '').trim();
    const phone = String(body.phone || body.contactNumber || body.resellerIdOrNumber || '').trim();

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Name and phone are required' }, { status: 400 });
    }

    const reseller = await createResellerSignup({
      name,
      phone,
      email: body.email,
      password: body.password,
      shopName: body.shopName,
      status: body.autoApprove ? 'active' : 'pending',
    });

    return NextResponse.json({ success: true, data: reseller, message: 'Reseller signup submitted' }, { status: 201 });
  } catch (error) {
    console.error('Create reseller error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
