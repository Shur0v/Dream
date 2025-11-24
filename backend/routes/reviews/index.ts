import { NextRequest, NextResponse } from 'next/server';
import { getReviews, saveReview, getReviewById } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { ProductReview } from '@/types';

const parseRating = (value: unknown): number => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 5;
  if (numeric < 1) return 1;
  if (numeric > 5) return 5;
  return numeric;
};

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(200);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;

    const reviews = await getReviews(productId || undefined);

    return NextResponse.json({
      success: true,
      data: reviews,
      message: 'Reviews retrieved successfully',
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load reviews',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(200);
    const body = await request.json();
    const { productId, author, comment, rating, verified, date, source } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }

    if (!author || !author.trim()) {
      return NextResponse.json(
        { success: false, error: 'author is required' },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, error: 'comment is required' },
        { status: 400 }
      );
    }

    const newReview: ProductReview = {
      id: '',
      productId: String(productId),
      author: String(author).trim(),
      comment: String(comment).trim(),
      rating: parseRating(rating),
      verified: Boolean(verified),
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      source: source && ['admin', 'user', 'imported'].includes(source)
        ? source
        : 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveReview(newReview);

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Review saved successfully',
    });
  } catch (error) {
    console.error('Save review error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save review',
      },
      { status: 500 }
    );
  }
}

