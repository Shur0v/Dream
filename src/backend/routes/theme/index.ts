import { NextResponse } from 'next/server';
import { getSiteThemeSettings } from '@backend/lib/db';
import { getThemePresetById } from '@/lib/themePresets';

export async function GET() {
  try {
    const current = await getSiteThemeSettings();
    const preset = getThemePresetById(current.id);
    return NextResponse.json({
      success: true,
      data: { current, preset },
    });
  } catch (error) {
    console.error('Get public theme error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theme' }, { status: 500 });
  }
}
