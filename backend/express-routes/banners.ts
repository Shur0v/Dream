/**
 * Banners Express Routes
 * Handles hero banners, promo banners, and festival banners
 */

import { Router, Request, Response } from 'express';
import {
  getHeroBanner,
  getAllHeroBanners,
  getPromoBanners,
  getFestivalBanners,
} from '../lib/db';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/hero-banners
 * Get hero banner(s)
 */
router.get('/hero-banners', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const all = req.query.all === 'true';

    if (all) {
      // Get all hero banners (including inactive)
      const banners = await getAllHeroBanners();
      return res.json({
        success: true,
        data: banners,
      });
    } else {
      // Get active hero banner only
      const banner = await getHeroBanner();
      return res.json({
        success: true,
        data: banner,
      });
    }
  } catch (error) {
    console.error('Error fetching hero banner:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch hero banner',
    });
  }
});

/**
 * GET /api/promo-banners
 * Get promo banners with filtering
 */
router.get('/promo-banners', async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const limitParam = req.query.limit;
    const variantParam = req.query.variant;

    const limit = limitParam ? parseInt(limitParam as string, 10) : undefined;
    const variant = variantParam === 'slider' || variantParam === 'card' ? variantParam : undefined;

    const banners = await getPromoBanners({
      includeInactive,
      variant,
      limit,
    });

    res.json({
      success: true,
      data: banners,
      message: 'Promo banners retrieved successfully',
    });
  } catch (error) {
    console.error('Get promo banners error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load promo banners',
    });
  }
});

/**
 * GET /api/festival-banners
 * Get festival banners
 */
router.get('/festival-banners', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const includeInactive = req.query.includeInactive === 'true';
    const limitParam = req.query.limit;
    const limit = limitParam ? parseInt(limitParam as string, 10) : undefined;

    const banners = await getFestivalBanners({
      includeInactive,
      limit,
    });

    res.json({
      success: true,
      data: banners,
      message: 'Festival banners retrieved successfully',
    });
  } catch (error) {
    console.error('Get festival banners error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load festival banners',
    });
  }
});

export default router;
