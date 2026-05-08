import { NextRequest, NextResponse } from 'next/server';
import { deleteReview, getReviewById, saveReview } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';

const parseRating = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return undefined;
  if (numeric < 1) return 1;
  if (numeric > 5) return 5;
  return numeric;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(150);
    const { id } = await params;
    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review retrieved successfully',
    });
  } catch (error) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to load review' },
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
    const existing = await getReviewById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const rating = parseRating(body.rating);

    const updated = await saveReview({
      ...existing,
      productId: body.productId ? String(body.productId) : existing.productId,
      productName: body.productName ?? existing.productName,
      author: body.author !== undefined ? String(body.author).trim() : existing.author,
      comment: body.comment !== undefined ? String(body.comment).trim() : existing.comment,
      rating: rating ?? existing.rating,
      verified: body.verified !== undefined ? Boolean(body.verified) : existing.verified,
      date: body.date ? new Date(body.date).toISOString() : existing.date,
      source: body.source && ['admin', 'user', 'imported'].includes(body.source)
        ? body.source
        : existing.source,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(150);
    const { id } = await params;
    const deleted = await deleteReview(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deleted,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete review' },
      { status: 500 }
    );
  }
}

