/**
 * Backend handler for /api/featured-products/[id] route.
 * Provides DELETE endpoint to remove a featured product.
 */

import { NextRequest, NextResponse } from 'next/server';
import { removeFeaturedProductById, removeFeaturedProduct } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300);

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Featured product ID is required',
        },
        { status: 400 }
      );
    }

    // Try to remove by featured product ID first
    let removed = await removeFeaturedProductById(id);
    
    // If not found by featured product ID, try as productId
    if (!removed) {
      removed = await removeFeaturedProduct(id);
    }

    if (!removed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Featured product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: removed,
      message: 'Product removed from featured products',
    });
  } catch (error) {
    console.error('Error removing featured product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove featured product',
      },
      { status: 500 }
    );
  }
}

