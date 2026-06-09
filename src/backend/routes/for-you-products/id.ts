/**
 * Backend handler for /api/for-you-products/[id] route.
 * Provides DELETE endpoint to remove a for you product.
 */

import { NextRequest, NextResponse } from 'next/server';
import { removeForYouProduct, removeForYouProductById } from '@backend/lib/db';
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
          error: 'For you product ID is required',
        },
        { status: 400 }
      );
    }

    let removed = await removeForYouProductById(id);

    if (!removed) {
      removed = await removeForYouProduct(id);
    }

    if (!removed) {
      return NextResponse.json(
        {
          success: false,
          error: 'For you product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: removed,
      message: 'Product removed from for you products',
    });
  } catch (error) {
    console.error('Error removing for you product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove for you product',
      },
      { status: 500 }
    );
  }
}
