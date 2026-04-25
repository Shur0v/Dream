import { NextRequest, NextResponse } from 'next/server';
import { deleteFestivalBanner, getFestivalBannerById, saveFestivalBanner } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { FestivalBanner } from '@/types';
import { validateImageField } from '@backend/lib/imageValidation';

type FestivalPayload = Partial<FestivalBanner> & {
  coupons?: Array<{ code?: string; amount?: string }>;
};

const normalizeCoupons = (coupons?: FestivalPayload['coupons']) => {
  if (!Array.isArray(coupons)) return undefined;
  const normalized = coupons
    .map(coupon => ({
      code: String(coupon?.code ?? '').trim(),
      amount: String(coupon?.amount ?? '').trim(),
    }))
    .filter(coupon => coupon.code && coupon.amount);
  return normalized;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(200);
    const { id } = await params;

    const banner = await getFestivalBannerById(id);
    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Festival banner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Festival banner retrieved successfully',
    });
  } catch (error) {
    console.error('Get festival banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load festival banner',
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
    const existing = await getFestivalBannerById(id);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Festival banner not found',
        },
        { status: 404 }
      );
    }

    const body = (await request.json()) as FestivalPayload;
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
    const couponUpdate = normalizeCoupons(body.coupons);

    const updated = await saveFestivalBanner({
      ...existing,
      ...(body.title && { title: String(body.title).trim() }),
      ...(body.subtitle !== undefined && { subtitle: String(body.subtitle).trim() }),
      ...(body.discount && { discount: String(body.discount).trim() }),
      ...(body.emi && { emi: String(body.emi).trim() }),
      ...(body.image && { image: String(body.image).trim() }),
      ...(couponUpdate !== undefined && { coupons: couponUpdate }),
      ...(body.order !== undefined && { order: Number(body.order) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Festival banner updated successfully',
    });
  } catch (error) {
    console.error('Update festival banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update festival banner',
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

    const deleted = await deleteFestivalBanner(id);
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Festival banner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deleted,
      message: 'Festival banner deleted successfully',
    });
  } catch (error) {
    console.error('Delete festival banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete festival banner',
      },
      { status: 500 }
    );
  }
}

