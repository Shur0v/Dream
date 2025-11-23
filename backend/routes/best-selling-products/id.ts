/**
 * Backend handler for /api/best-selling-products/[id] route.
 * Provides DELETE endpoint to remove a best selling product.
 */

import { NextRequest, NextResponse } from 'next/server';
import { removeBestSellingProductById, removeBestSellingProduct } from '@backend/lib/db';
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
          error: 'Best selling product ID is required',
        },
        { status: 400 }
      );
    }

    // Try to remove by best selling product ID first
    let removed = await removeBestSellingProductById(id);
    
    // If not found by best selling product ID, try as productId
    if (!removed) {
      removed = await removeBestSellingProduct(id);
    }

    if (!removed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Best selling product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: removed,
      message: 'Product removed from best selling products',
    });
  } catch (error) {
    console.error('Error removing best selling product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove best selling product',
      },
      { status: 500 }
    );
  }
}

