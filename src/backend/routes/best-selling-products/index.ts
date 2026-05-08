/**
 * Backend handler for /api/best-selling-products route.
 * Provides GET (list) and POST (add) endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBestSellingProducts, addBestSellingProduct, getColors } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { BestSellingProduct } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(300);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    let bestSellingProducts = await getBestSellingProducts();

    // Enrich with color options if needed
    const colors = await getColors();
    bestSellingProducts = bestSellingProducts.map(bs => {
      if (bs.colors && bs.colors.length > 0) {
        const colorOptions = colors.filter(c => bs.colors?.includes(c.id));
        return { ...bs, colorOptions };
      }
      return bs;
    });

    // Sort by bestSellingAt (most recent first)
    bestSellingProducts.sort((a, b) => 
      new Date(b.bestSellingAt).getTime() - new Date(a.bestSellingAt).getTime()
    );

    // Limit results
    const limited = bestSellingProducts.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limited,
      total: bestSellingProducts.length,
    });
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch best selling products',
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

    const bestSellingProduct = await addBestSellingProduct(productId);

    return NextResponse.json({
      success: true,
      data: bestSellingProduct,
      message: 'Product added to best selling products',
    });
  } catch (error) {
    console.error('Error adding best selling product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add best selling product',
      },
      { status: 500 }
    );
  }
}

