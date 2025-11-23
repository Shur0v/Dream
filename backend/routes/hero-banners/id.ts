/**
 * Backend handler for /api/hero-banners/[id] route.
 * Provides GET, PUT, and DELETE endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHeroBannerById, saveHeroBanner, deleteHeroBanner } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { HeroBanner } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300);

    const { id } = await params;
    const banner = await getHeroBannerById(id);

    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hero banner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300);

    const { id } = await params;
    const body = await request.json();
    const { sliderImages, rightBanners, isActive } = body;

    const existingBanner = await getHeroBannerById(id);
    if (!existingBanner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hero banner not found',
        },
        { status: 404 }
      );
    }

    // Update banner
    const updatedBanner: HeroBanner = {
      ...existingBanner,
      sliderImages: sliderImages !== undefined ? sliderImages : existingBanner.sliderImages,
      rightBanners: rightBanners !== undefined ? rightBanners.slice(0, 2) : existingBanner.rightBanners,
      isActive: isActive !== undefined ? isActive : existingBanner.isActive,
      updatedAt: new Date().toISOString(),
    };

    const savedBanner = await saveHeroBanner(updatedBanner);

    return NextResponse.json({
      success: true,
      data: savedBanner,
      message: 'Hero banner updated successfully',
    });
  } catch (error) {
    console.error('Error updating hero banner:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update hero banner',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300);

    const { id } = await params;
    const deleted = await deleteHeroBanner(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hero banner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deleted,
      message: 'Hero banner deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero banner:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete hero banner',
      },
      { status: 500 }
    );
  }
}

