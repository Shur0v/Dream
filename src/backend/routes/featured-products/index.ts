/**
 * Backend handler for /api/featured-products route.
 * Provides GET (list) and POST (add) endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedProducts, addFeaturedProduct, getColors } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { FeaturedProduct } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(300);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    let featuredProducts = await getFeaturedProducts();

    // Enrich with color options if needed
    const colors = await getColors();
    featuredProducts = featuredProducts.map(fp => {
      if (fp.colors && fp.colors.length > 0) {
        const colorOptions = colors.filter(c => fp.colors?.includes(c.id));
        return { ...fp, colorOptions };
      }
      return fp;
    });

    // Sort by featuredAt (most recent first)
    featuredProducts.sort((a, b) => 
      new Date(b.featuredAt).getTime() - new Date(a.featuredAt).getTime()
    );

    // Limit results
    const limited = featuredProducts.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limited,
      total: featuredProducts.length,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch featured products',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(300);

    const body = await request.json();
    const { productId } = body;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'productId is required and must be a string',
        },
        { status: 400 }
      );
    }

    const featuredProduct = await addFeaturedProduct(productId);

    return NextResponse.json({
      success: true,
      data: featuredProduct,
      message: 'Product added to featured products',
    });
  } catch (error) {
    console.error('Error adding featured product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add featured product',
      },
      { status: 500 }
    );
  }
}

