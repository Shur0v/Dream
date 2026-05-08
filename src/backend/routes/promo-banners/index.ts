import { NextRequest, NextResponse } from 'next/server';
import { getPromoBanners, savePromoBanner } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { PromoBanner, PromoBannerVariant } from '@/types';
import { validateImageField } from '@backend/lib/imageValidation';

const parseInitialTime = (value: Partial<PromoBanner['initialTime']> = {}): PromoBanner['initialTime'] => ({
  days: Number.isFinite(Number(value.days)) ? Math.max(0, Number(value.days)) : 0,
  hours: Number.isFinite(Number(value.hours)) ? Math.min(Math.max(0, Number(value.hours)), 23) : 0,
  minutes: Number.isFinite(Number(value.minutes)) ? Math.min(Math.max(0, Number(value.minutes)), 59) : 0,
  seconds: Number.isFinite(Number(value.seconds)) ? Math.min(Math.max(0, Number(value.seconds)), 59) : 0,
});

const isVariant = (value: unknown): value is PromoBannerVariant =>
  value === 'slider' || value === 'card';

export async function GET(request: NextRequest) {
  try {
    // Removed mockApiDelay for faster loading

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const limitParam = searchParams.get('limit');
    const variantParam = searchParams.get('variant');

    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
    const variant = isVariant(variantParam) ? variantParam : undefined;

    const banners = await getPromoBanners({
      includeInactive,
      variant,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: banners,
      message: 'Promo banners retrieved successfully',
    });
  } catch (error) {
    console.error('Get promo banners error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load promo banners',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Removed mockApiDelay for faster loading

    const body = await request.json();
    const {
      id,
      title,
      subtitle,
      description,
      startingBidLabel,
      priceText,
      image,
      backgroundImage,
      ctaLabel,
      ctaLink,
      initialTime,
      variant = 'slider',
      order,
      isActive = true,
    } = body;

    if (!title || !image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and image are required',
        },
        { status: 400 }
      );
    }
    const imageValidation = validateImageField(image, { fieldName: 'image' });
    if (!imageValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: imageValidation.error,
        },
        { status: 400 }
      );
    }
    let normalizedBackgroundImage: string | undefined;
    if (backgroundImage !== undefined && backgroundImage !== null && String(backgroundImage).trim() !== '') {
      const backgroundValidation = validateImageField(backgroundImage, { fieldName: 'backgroundImage' });
      if (!backgroundValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: backgroundValidation.error,
          },
          { status: 400 }
        );
      }
      normalizedBackgroundImage = backgroundValidation.value;
    }

    const saved = await savePromoBanner({
      id,
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : '',
      description: description ? String(description).trim() : undefined,
      startingBidLabel: startingBidLabel ? String(startingBidLabel).trim() : undefined,
      priceText: priceText ? String(priceText).trim() : undefined,
      image: imageValidation.value,
      backgroundImage: normalizedBackgroundImage,
      ctaLabel: ctaLabel ? String(ctaLabel).trim() : undefined,
      ctaLink: ctaLink ? String(ctaLink).trim() : undefined,
      initialTime: parseInitialTime(initialTime),
      variant: isVariant(variant) ? variant : 'slider',
      order: Number.isFinite(order) ? Number(order) : 0,
      isActive: Boolean(isActive),
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    });

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Promo banner saved successfully',
    });
  } catch (error) {
    console.error('Save promo banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save promo banner',
      },
      { status: 500 }
    );
  }
}


