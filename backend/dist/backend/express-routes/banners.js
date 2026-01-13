"use strict";
/**
 * Banners Express Routes
 * Handles hero banners, promo banners, and festival banners
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
const mockApiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * GET /api/hero-banners
 * Get hero banner(s)
 */
router.get('/hero-banners', async (req, res) => {
    try {
        await mockApiDelay(300);
        const all = req.query.all === 'true';
        if (all) {
            // Get all hero banners (including inactive)
            const banners = await (0, db_1.getAllHeroBanners)();
            return res.json({
                success: true,
                data: banners,
            });
        }
        else {
            // Get active hero banner only
            const banner = await (0, db_1.getHeroBanner)();
            return res.json({
                success: true,
                data: banner,
            });
        }
    }
    catch (error) {
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
router.get('/promo-banners', async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const limitParam = req.query.limit;
        const variantParam = req.query.variant;
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;
        const variant = variantParam === 'slider' || variantParam === 'card' ? variantParam : undefined;
        const banners = await (0, db_1.getPromoBanners)({
            includeInactive,
            variant,
            limit,
        });
        res.json({
            success: true,
            data: banners,
            message: 'Promo banners retrieved successfully',
        });
    }
    catch (error) {
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
router.get('/festival-banners', async (req, res) => {
    try {
        await mockApiDelay(300);
        const includeInactive = req.query.includeInactive === 'true';
        const limitParam = req.query.limit;
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;
        const banners = await (0, db_1.getFestivalBanners)({
            includeInactive,
            limit,
        });
        res.json({
            success: true,
            data: banners,
            message: 'Festival banners retrieved successfully',
        });
    }
    catch (error) {
        console.error('Get festival banners error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to load festival banners',
        });
    }
});
exports.default = router;
