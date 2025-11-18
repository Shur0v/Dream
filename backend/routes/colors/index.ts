import { NextRequest, NextResponse } from 'next/server';
import { getColors, saveColor } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Color } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(300);

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const allColors = await getColors();
    const filteredColors = includeInactive
      ? allColors
      : allColors.filter(color => color.isActive);

    filteredColors.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      data: filteredColors,
      message: 'Colors retrieved successfully',
    });

  } catch (error) {
    console.error('Get colors error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(600);

    const body = await request.json();
    const { name, hexCode } = body;

    if (!name || !hexCode) {
      return NextResponse.json(
        { success: false, error: 'Name and hexCode are required' },
        { status: 400 }
      );
    }

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hex code format. Use #RRGGBB or #RGB' },
        { status: 400 }
      );
    }

    const allColors = await getColors();
    const nameExists = allColors.some(color =>
      color.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      return NextResponse.json(
        { success: false, error: 'Color with this name already exists' },
        { status: 400 }
      );
    }

    const newColor: Color = {
      id: `color-${Date.now()}`,
      name,
      hexCode: hexCode.toUpperCase(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveColor(newColor);

    return NextResponse.json({
      success: true,
      data: newColor,
      message: 'Color created successfully',
    });

  } catch (error) {
    console.error('Create color error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

