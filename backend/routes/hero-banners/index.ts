/**
 * Backend handler for /api/hero-banners route.
 * Provides GET (get active) and POST (create/update) endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHeroBanner, saveHeroBanner, getAllHeroBanners } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { HeroBanner } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(300);

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    if (all) {
      // Get all hero banners (including inactive)
      const banners = await getAllHeroBanners();
      return NextResponse.json({
        success: true,
        data: banners,
      });
    } else {
      // Get active hero banner only
      const banner = await getHeroBanner();
      return NextResponse.json({
        success: true,
        data: banner,
      });
    }
  } catch (error) {
    console.error('Error fetching hero banner:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch hero banner',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(300);

    const body = await request.json();
    const { sliderImages, rightBanners, isActive = true } = body;

    if (!Array.isArray(sliderImages)) {
      return NextResponse.json(
        {
          success: false,
          error: 'sliderImages is required and must be an array',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(rightBanners)) {
      return NextResponse.json(
        {
          success: false,
          error: 'rightBanners is required and must be an array',
        },
        { status: 400 }
      );
    }

    // Limit rightBanners to 3 (1 header + 2 bottom)
    // Preserve positions: [0] = header, [1] = first bottom, [2] = second bottom
    // Always ensure we have 3 positions, using empty strings for missing ones
    const limitedRightBanners: string[] = [];
    for (let i = 0; i < 3; i++) {
      limitedRightBanners.push((rightBanners[i] || '').trim());
    }
    // Keep empty strings to preserve positions - filter them out only when displaying

    // Create or update hero banner
    const heroBanner: HeroBanner = {
      id: body.id || `hero-${Date.now()}`,
      sliderImages,
      rightBanners: limitedRightBanners,
      isActive,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedBanner = await saveHeroBanner(heroBanner);

    return NextResponse.json({
      success: true,
      data: savedBanner,
      message: 'Hero banner saved successfully',
    });
  } catch (error) {
    console.error('Error saving hero banner:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save hero banner',
      },
      { status: 500 }
    );
  }
}

