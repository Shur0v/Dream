/**
 * Backend handler for /api/hero-banners/[id] route.
 * Provides GET, PUT, and DELETE endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHeroBannerById, saveHeroBanner, deleteHeroBanner } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { HeroBanner } from '@/types';
import { validateImageField, validateImageList } from '@backend/lib/imageValidation';

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

    let sanitizedSliderImages = existingBanner.sliderImages;
    if (sliderImages !== undefined) {
      const sliderValidation = validateImageList(sliderImages, 'sliderImages');
      if (!sliderValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: sliderValidation.error,
          },
          { status: 400 }
        );
      }
      sanitizedSliderImages = sliderValidation.value;
    }

    let sanitizedRightBanners = existingBanner.rightBanners;
    if (rightBanners !== undefined) {
      if (!Array.isArray(rightBanners)) {
        return NextResponse.json(
          {
            success: false,
            error: 'rightBanners must be an array',
          },
          { status: 400 }
        );
      }
      const normalized: string[] = [];
      for (let i = 0; i < 3; i++) {
        const value = String(rightBanners[i] || '').trim();
        if (!value) {
          normalized.push('');
          continue;
        }
        const imageValidation = validateImageField(value, {
          fieldName: `rightBanners[${i}]`,
          allowEmpty: true,
        });
        if (!imageValidation.valid) {
          return NextResponse.json(
            {
              success: false,
              error: imageValidation.error,
            },
            { status: 400 }
          );
        }
        normalized.push(imageValidation.value);
      }
      sanitizedRightBanners = normalized;
    }

    // Update banner
    const updatedBanner: HeroBanner = {
      ...existingBanner,
      sliderImages: sanitizedSliderImages,
      rightBanners: sanitizedRightBanners,
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

