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
  saveHeroBanner,
  savePromoBanner,
  saveFestivalBanner,
} from '../lib/db';
import { HeroBanner, PromoBanner, PromoBannerVariant, FestivalBanner } from '../../src/types';

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

/**
 * POST /api/hero-banners
 * Create or update hero banner
 */
router.post('/hero-banners', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const body = req.body;
    const { sliderImages, rightBanners, isActive = true } = body;

    if (!Array.isArray(sliderImages)) {
      return res.status(400).json({
        success: false,
        error: 'sliderImages is required and must be an array',
      });
    }

    if (!Array.isArray(rightBanners)) {
      return res.status(400).json({
        success: false,
        error: 'rightBanners is required and must be an array',
      });
    }

    // Limit rightBanners to 3 (1 header + 2 bottom)
    // Preserve positions: [0] = header, [1] = first bottom, [2] = second bottom
    const limitedRightBanners: string[] = [];
    for (let i = 0; i < 3; i++) {
      limitedRightBanners.push((rightBanners[i] || '').trim());
    }

    // Create or update hero banner
    const heroBanner: HeroBanner = {
      id: body.id || `hero-${Date.now()}`,
      sliderImages,
      rightBanners: limitedRightBanners,
      isActive,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedBanner = await saveHeroBanner(heroBanner);

    res.json({
      success: true,
      data: savedBanner,
      message: 'Hero banner saved successfully',
    });
  } catch (error) {
    console.error('Error saving hero banner:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save hero banner',
    });
  }
});

/**
 * POST /api/promo-banners
 * Create or update promo banner
 */
router.post('/promo-banners', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const {
      id,
      title,
      subtitle,
      description,
      startingBidLabel,
      priceText,
      image,
      backgroundImage,
      ctaLabel,
      ctaLink,
      initialTime,
      variant = 'slider',
      order,
      isActive = true,
    } = body;

    if (!title || !image) {
      return res.status(400).json({
        success: false,
        error: 'Title and image are required',
      });
    }

    const parseInitialTime = (value: any = {}): PromoBanner['initialTime'] => ({
      days: Number.isFinite(Number(value.days)) ? Math.max(0, Number(value.days)) : 0,
      hours: Number.isFinite(Number(value.hours)) ? Math.min(Math.max(0, Number(value.hours)), 23) : 0,
      minutes: Number.isFinite(Number(value.minutes)) ? Math.min(Math.max(0, Number(value.minutes)), 59) : 0,
      seconds: Number.isFinite(Number(value.seconds)) ? Math.min(Math.max(0, Number(value.seconds)), 59) : 0,
    });

    const isVariant = (value: unknown): value is PromoBannerVariant =>
      value === 'slider' || value === 'card';

    const saved = await savePromoBanner({
      id,
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : '',
      description: description ? String(description).trim() : undefined,
      startingBidLabel: startingBidLabel ? String(startingBidLabel).trim() : undefined,
      priceText: priceText ? String(priceText).trim() : undefined,
      image: String(image).trim(),
      backgroundImage: backgroundImage ? String(backgroundImage).trim() : undefined,
      ctaLabel: ctaLabel ? String(ctaLabel).trim() : undefined,
      ctaLink: ctaLink ? String(ctaLink).trim() : undefined,
      initialTime: parseInitialTime(initialTime),
      variant: isVariant(variant) ? variant : 'slider',
      order: Number.isFinite(order) ? Number(order) : 0,
      isActive: Boolean(isActive),
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    } as PromoBanner);

    res.json({
      success: true,
      data: saved,
      message: 'Promo banner saved successfully',
    });
  } catch (error) {
    console.error('Save promo banner error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save promo banner',
    });
  }
});

/**
 * POST /api/festival-banners
 * Create or update festival banner
 */
router.post('/festival-banners', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);
    const body = req.body;
    const { id, title, subtitle, discount, emi, image, coupons, order, isActive } = body;

    if (!title || !discount || !emi || !image) {
      return res.status(400).json({
        success: false,
        error: 'Title, discount, EMI, and image are required',
      });
    }

    const normalizeCoupons = (coupons?: Array<{ code?: string; amount?: string }>) => {
      if (!Array.isArray(coupons)) return [];
      return coupons
        .map(coupon => ({
          code: String(coupon?.code ?? '').trim(),
          amount: String(coupon?.amount ?? '').trim(),
        }))
        .filter(coupon => coupon.code && coupon.amount);
    };

    const normalizedCoupons = normalizeCoupons(coupons);
    if (normalizedCoupons.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one coupon is required',
      });
    }

    const saved = await saveFestivalBanner({
      id,
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : '',
      discount: String(discount).trim(),
      emi: String(emi).trim(),
      image: String(image).trim(),
      coupons: normalizedCoupons,
      order: Number.isFinite(order) ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    } as FestivalBanner);

    res.json({
      success: true,
      data: saved,
      message: 'Festival banner saved successfully',
    });
  } catch (error) {
    console.error('Save festival banner error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save festival banner',
    });
  }
});

export default router;
