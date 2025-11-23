/**
 * Featured Products Express Routes
 * Handles featured products management
 */

import { Router, Request, Response } from 'express';
import {
  getFeaturedProducts,
  addFeaturedProduct,
  removeFeaturedProduct,
  getProductById,
} from '../lib/db';

const router = Router();

/**
 * GET /api/featured
 * Get all featured products
 */
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const featuredProducts = await getFeaturedProducts();
    
    res.json({
      success: true,
      data: featuredProducts,
      message: 'Featured products retrieved successfully',
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Failed to retrieve featured products',
    });
  }
});

/**
 * POST /api/admin/feature
 * Add a product to featured products (idempotent)
 * Payload: { productId }
 */
router.post('/admin/feature', async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    // Validation
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Invalid productId',
        message: 'productId is required and must be a non-empty string',
      });
    }

    // Optional: Verify product exists in products database
    const product = await getProductById(productId.trim());
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with id ${productId} does not exist`,
      });
    }

    // Add or update featured product (idempotent)
    const featuredProduct = await addFeaturedProduct(productId.trim());

    res.json({
      success: true,
      data: featuredProduct,
      message: 'Product added to featured products successfully',
    });
  } catch (error) {
    console.error('Add featured product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Failed to add featured product',
    });
  }
});

/**
 * DELETE /api/admin/feature/:productId
 * Remove a product from featured products
 */
router.delete('/admin/feature/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId || productId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Invalid productId',
        message: 'productId is required',
      });
    }

    const removed = await removeFeaturedProduct(productId.trim());

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: 'Product not found in featured products',
        message: `Product with id ${productId} is not in featured products`,
      });
    }

    res.json({
      success: true,
      message: 'Product removed from featured products successfully',
    });
  } catch (error) {
    console.error('Remove featured product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Failed to remove featured product',
    });
  }
});

export default router;

