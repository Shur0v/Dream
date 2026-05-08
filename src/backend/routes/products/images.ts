import { NextRequest, NextResponse } from 'next/server';
import { getProductById, removeProductImage } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(400);

    const { id } = await params;
    const body = await request.json().catch(() => null);

    const index = body?.index;

    if (typeof index !== 'number' || Number.isNaN(index) || index < 0) {
      return NextResponse.json(
        { success: false, error: 'A valid image index is required' },
        { status: 400 }
      );
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = await removeProductImage(id, index);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Unable to remove image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Image removed successfully',
    });
  } catch (error) {
    console.error('Delete product image error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

