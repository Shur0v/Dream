import { NextRequest, NextResponse } from 'next/server';
import { getSiteThemeSettings, saveSiteThemeSettings } from '@backend/lib/db';
import { getThemePresetById, SITE_THEME_PRESETS, SiteThemeId } from '@/lib/themePresets';

export async function GET() {
  try {
    const current = await getSiteThemeSettings();
    const preset = getThemePresetById(current.id);
    return NextResponse.json({
      success: true,
      data: {
        current,
        preset,
        presets: SITE_THEME_PRESETS,
      },
    });
  } catch (error) {
    console.error('Get site theme settings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theme settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const requestedId = body?.id as SiteThemeId | undefined;
    if (!requestedId) {
      return NextResponse.json({ success: false, error: 'Theme id is required' }, { status: 400 });
    }
    const isValid = SITE_THEME_PRESETS.some((preset) => preset.id === requestedId);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid theme id' }, { status: 400 });
    }

    const saved = await saveSiteThemeSettings(requestedId);
    const preset = getThemePresetById(saved.id);
    return NextResponse.json({
      success: true,
      data: { current: saved, preset },
      message: 'Theme updated successfully',
    });
  } catch (error) {
    console.error('Update site theme settings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update theme settings' }, { status: 500 });
  }
}
