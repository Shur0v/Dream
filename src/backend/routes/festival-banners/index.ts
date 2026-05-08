import { NextRequest, NextResponse } from 'next/server';
import { getFestivalBanners, saveFestivalBanner } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { FestivalBanner } from '@/types';
import { validateImageField } from '@backend/lib/imageValidation';

type FestivalPayload = Partial<FestivalBanner> & {
  coupons?: Array<{ code?: string; amount?: string }>;
};

const normalizeCoupons = (coupons?: FestivalPayload['coupons']) => {
  if (!Array.isArray(coupons)) return [];
  return coupons
    .map(coupon => ({
      code: String(coupon?.code ?? '').trim(),
      amount: String(coupon?.amount ?? '').trim(),
    }))
    .filter(coupon => coupon.code && coupon.amount);
};

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(300);
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    const banners = await getFestivalBanners({
      includeInactive,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: banners,
      message: 'Festival banners retrieved successfully',
    });
  } catch (error) {
    console.error('Get festival banners error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load festival banners',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(300);
    const body = (await request.json()) as FestivalPayload;
    const { id, title, subtitle, discount, emi, image, coupons, order, isActive } = body;

    if (!title || !discount || !emi || !image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, discount, EMI, and image are required',
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

    const normalizedCoupons = normalizeCoupons(coupons);
    if (normalizedCoupons.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one coupon is required',
        },
        { status: 400 }
      );
    }

    const saved = await saveFestivalBanner({
      id,
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : '',
      discount: String(discount).trim(),
      emi: String(emi).trim(),
      image: imageValidation.value,
      coupons: normalizedCoupons,
      order: Number.isFinite(order) ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    } as FestivalBanner);

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Festival banner saved successfully',
    });
  } catch (error) {
    console.error('Save festival banner error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save festival banner',
      },
      { status: 500 }
    );
  }
}

