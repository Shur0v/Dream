import { NextRequest, NextResponse } from 'next/server';
import { deletePromoBanner, getPromoBannerById, savePromoBanner } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { PromoBannerVariant } from '@/types';
import { validateImageField } from '@backend/lib/imageValidation';

const isVariant = (value: unknown): value is PromoBannerVariant =>
  value === 'slider' || value === 'card';

const parseInitialTime = (value: any) => ({
  days: Number.isFinite(Number(value?.days)) ? Math.max(0, Number(value.days)) : 0,
  hours: Number.isFinite(Number(value?.hours)) ? Math.min(Math.max(0, Number(value.hours)), 23) : 0,
  minutes: Number.isFinite(Number(value?.minutes)) ? Math.min(Math.max(0, Number(value.minutes)), 59) : 0,
  seconds: Number.isFinite(Number(value?.seconds)) ? Math.min(Math.max(0, Number(value.seconds)), 59) : 0,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(200);
    const { id } = await params;

    const banner = await getPromoBannerById(id);
    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Promo banner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Promo banner retrieved successfully',
    });
  } catch (error) {
    console.error('Get promo banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load promo banner',
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
    await mockApiDelay(200);
    const { id } = await params;
    const existing = await getPromoBannerById(id);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Promo banner not found',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    if (body.image !== undefined) {
      const imageValidation = validateImageField(body.image, { fieldName: 'image' });
      if (!imageValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: imageValidation.error,
          },
          { status: 400 }
        );
      }
      body.image = imageValidation.value;
    }
    if (body.backgroundImage !== undefined && body.backgroundImage !== null && String(body.backgroundImage).trim() !== '') {
      const backgroundValidation = validateImageField(body.backgroundImage, { fieldName: 'backgroundImage' });
      if (!backgroundValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: backgroundValidation.error,
          },
          { status: 400 }
        );
      }
      body.backgroundImage = backgroundValidation.value;
    }
    const updated = await savePromoBanner({
      ...existing,
      ...(body.title && { title: String(body.title).trim() }),
      ...(body.subtitle !== undefined && { subtitle: String(body.subtitle).trim() }),
      ...(body.description !== undefined && { description: body.description ? String(body.description).trim() : undefined }),
      ...(body.startingBidLabel !== undefined && { startingBidLabel: body.startingBidLabel ? String(body.startingBidLabel).trim() : undefined }),
      ...(body.priceText !== undefined && { priceText: body.priceText ? String(body.priceText).trim() : undefined }),
      ...(body.image && { image: String(body.image).trim() }),
      ...(body.backgroundImage !== undefined && { backgroundImage: body.backgroundImage ? String(body.backgroundImage).trim() : undefined }),
      ...(body.ctaLabel !== undefined && { ctaLabel: body.ctaLabel ? String(body.ctaLabel).trim() : undefined }),
      ...(body.ctaLink !== undefined && { ctaLink: body.ctaLink ? String(body.ctaLink).trim() : undefined }),
      ...(body.initialTime && { initialTime: parseInitialTime(body.initialTime) }),
      ...(body.variant && isVariant(body.variant) && { variant: body.variant }),
      ...(body.order !== undefined && { order: Number(body.order) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Promo banner updated successfully',
    });
  } catch (error) {
    console.error('Update promo banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update promo banner',
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
    await mockApiDelay(200);
    const { id } = await params;

    const deleted = await deletePromoBanner(id);
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Promo banner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deleted,
      message: 'Promo banner deleted successfully',
    });
  } catch (error) {
    console.error('Delete promo banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete promo banner',
      },
      { status: 500 }
    );
  }
}


