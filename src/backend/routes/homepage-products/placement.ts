/**
 * Backend handler for assigning a product to one homepage section.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHomepageProductSection, setHomepageProductSection } from '@backend/lib/db';
import { HomepageProductSection } from '@/types';

const validSections: HomepageProductSection[] = ['none', 'featured', 'trendy', 'for-you'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }

    const section = await getHomepageProductSection(productId);
    return NextResponse.json({ success: true, data: { productId, section } });
  } catch (error) {
    console.error('Error fetching homepage product placement:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch homepage product placement',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = typeof body.productId === 'string' ? body.productId : '';
    const section = body.section as HomepageProductSection;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }

    if (!validSections.includes(section)) {
      return NextResponse.json(
        { success: false, error: 'section must be one of none, featured, trendy, for-you' },
        { status: 400 }
      );
    }

    const savedSection = await setHomepageProductSection(productId, section);
    return NextResponse.json({
      success: true,
      data: { productId, section: savedSection },
      message: 'Homepage placement updated',
    });
  } catch (error) {
    console.error('Error updating homepage product placement:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update homepage product placement',
      },
      { status: 500 }
    );
  }
}
