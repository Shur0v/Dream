"use strict";
/**
 * Featured Products Express Routes
 * Handles featured products management
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
/**
 * GET /api/featured-products
 * Get all featured products
 */
router.get('/', async (req, res) => {
    try {
        const featuredProducts = await (0, db_1.getFeaturedProducts)();
        res.json({
            success: true,
            data: featuredProducts,
            message: 'Featured products retrieved successfully',
        });
    }
    catch (error) {
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
router.post('/admin/feature', async (req, res) => {
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
        const product = await (0, db_1.getProductById)(productId.trim());
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found',
                message: `Product with id ${productId} does not exist`,
            });
        }
        // Add or update featured product (idempotent)
        const featuredProduct = await (0, db_1.addFeaturedProduct)(productId.trim());
        res.json({
            success: true,
            data: featuredProduct,
            message: 'Product added to featured products successfully',
        });
    }
    catch (error) {
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
router.delete('/admin/feature/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId || productId.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Invalid productId',
                message: 'productId is required',
            });
        }
        const removed = await (0, db_1.removeFeaturedProduct)(productId.trim());
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
    }
    catch (error) {
        console.error('Remove featured product error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Failed to remove featured product',
        });
    }
});
exports.default = router;
