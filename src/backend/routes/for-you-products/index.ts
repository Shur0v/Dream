/**
 * Backend handler for /api/for-you-products route.
 * Provides GET (list) and POST (add) endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { addForYouProduct, getColors, getForYouProducts } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { ForYouProduct } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(300);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    let forYouProducts = await getForYouProducts();

    const colors = await getColors();
    forYouProducts = forYouProducts.map((item) => {
      if (item.colors && item.colors.length > 0) {
        const colorOptions = colors.filter((color) => item.colors?.includes(color.id));
        return { ...item, colorOptions };
      }
      return item;
    });

    forYouProducts.sort(
      (a, b) => new Date(b.forYouAt).getTime() - new Date(a.forYouAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: forYouProducts.slice(0, limit),
      total: forYouProducts.length,
    });
  } catch (error) {
    console.error('Error fetching for you products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch for you products',
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

    const forYouProduct = await addForYouProduct(productId);

    return NextResponse.json({
      success: true,
      data: forYouProduct,
      message: 'Product added to for you products',
    });
  } catch (error) {
    console.error('Error adding for you product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add for you product',
      },
      { status: 500 }
    );
  }
}
