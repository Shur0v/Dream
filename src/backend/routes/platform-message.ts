import { NextResponse } from 'next/server';
import { getResellerAnnouncementSettings } from '@backend/lib/db';

export async function GET() {
  try {
    const data = await getResellerAnnouncementSettings();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Get reseller announcement error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load reseller announcement' }, { status: 500 });
  }
}
