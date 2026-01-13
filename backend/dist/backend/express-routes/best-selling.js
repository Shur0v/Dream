"use strict";
/**
 * Best Selling Products Express Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
const mockApiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * GET /api/best-selling-products
 * Get best selling products
 */
router.get('/best-selling-products', async (req, res) => {
    try {
        await mockApiDelay(300);
        const limit = parseInt(req.query.limit || '100', 10);
        let bestSellingProducts = await (0, db_1.getBestSellingProducts)();
        // Enrich with color options if needed
        const colors = await (0, db_1.getColors)();
        bestSellingProducts = bestSellingProducts.map(bs => {
            if (bs.colors && bs.colors.length > 0) {
                const colorOptions = colors.filter(c => bs.colors?.includes(c.id));
                return { ...bs, colorOptions };
            }
            return bs;
        });
        // Sort by bestSellingAt (most recent first)
        bestSellingProducts.sort((a, b) => new Date(b.bestSellingAt).getTime() - new Date(a.bestSellingAt).getTime());
        // Limit results
        const limited = bestSellingProducts.slice(0, limit);
        res.json({
            success: true,
            data: limited,
            total: bestSellingProducts.length,
        });
    }
    catch (error) {
        console.error('Error fetching best selling products:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch best selling products',
        });
    }
});
exports.default = router;
