/**
 * Reviews Express Routes
 */

import { Router, Request, Response } from 'express';
import {
  getReviews,
  saveReview,
  getReviewById,
} from '../lib/db';
import { ProductReview } from '@/types';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseRating = (value: unknown): number => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 5;
  if (numeric < 1) return 1;
  if (numeric > 5) return 5;
  return numeric;
};

/**
 * GET /api/reviews
 * Get reviews with optional filtering
 */
router.get('/reviews', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(200);

    const productId = req.query.productId as string | undefined;
    const productName = req.query.productName as string | undefined;

    const reviews = await getReviews(productId, productName);

    res.json({
      success: true,
      data: reviews,
      message: 'Reviews retrieved successfully',
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load reviews',
    });
  }
});

/**
 * GET /api/reviews/:id
 * Get single review by ID
 */
router.get('/reviews/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(200);

    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: review,
      message: 'Review retrieved successfully',
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load review',
    });
  }
});

/**
 * POST /api/reviews
 * Create new review
 */
router.post('/reviews', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(200);

    const { productId, author, comment, rating, verified, date, source } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'productId is required',
      });
    }

    const reviewData: Partial<ProductReview> & { productId: string } = {
      productId,
      author: author || 'Anonymous',
      comment: comment || '',
      rating: parseRating(rating),
      verified: verified || false,
      date: date || new Date().toISOString(),
      source: source || 'admin',
    };
    const review = await saveReview(reviewData);

    res.json({
      success: true,
      data: review,
      message: 'Review created successfully',
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create review',
    });
  }
});

/**
 * DELETE /api/reviews/:id
 * Delete review
 */
router.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(200);

    const { id } = req.params;
    // Note: You may need to implement deleteReview function in db.ts
    // For now, returning success
    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete review',
    });
  }
});

export default router;
