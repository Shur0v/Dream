import { NextRequest, NextResponse } from 'next/server';
import { getResellerAnnouncementSettings, saveResellerAnnouncementSettings } from '@backend/lib/db';

export async function GET() {
  try {
    const data = await getResellerAnnouncementSettings();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Admin get reseller announcement error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load reseller announcement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const message = String(body?.message || '').trim();
    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const data = await saveResellerAnnouncementSettings(message);
    return NextResponse.json({ success: true, data, message: 'Reseller message updated successfully' });
  } catch (error) {
    console.error('Admin update reseller announcement error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update reseller announcement' }, { status: 500 });
  }
}
