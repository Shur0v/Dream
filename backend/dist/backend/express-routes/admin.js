"use strict";
/**
 * Admin Express Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const db_2 = require("../express-lib/db");
const router = (0, express_1.Router)();
const mockApiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
    try {
        // Reduced delay for better performance (was 500ms)
        await mockApiDelay(50);
        const [products, orders, users] = await Promise.all([
            (0, db_2.getProducts)(),
            (0, db_1.getOrders)(),
            (0, db_1.getUsers)(),
        ]);
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
        res.json({
            success: true,
            data: {
                totalRevenue,
                totalProducts: products.length,
                totalOrders: orders.length,
                pendingOrders,
                recentOrders,
            },
            message: 'Dashboard data retrieved successfully',
        });
    }
    catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
/**
 * GET /api/admin/orders
 * Get all orders with filtering and pagination
 */
router.get('/orders', async (req, res) => {
    try {
        // Reduced delay for better performance (was 800ms)
        await mockApiDelay(100);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        const search = req.query.search;
        let orders = await (0, db_1.getOrders)();
        console.log(`[GET /api/admin/orders] Fetched ${orders.length} orders from MongoDB`);
        if (status) {
            orders = orders.filter(order => order.status === status);
            console.log(`[GET /api/admin/orders] Filtered by status '${status}': ${orders.length} orders`);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            orders = orders.filter(order => order.id.toLowerCase().includes(searchLower) ||
                order.userId.toLowerCase().includes(searchLower) ||
                order.items.some(item => item.product?.name.toLowerCase().includes(searchLower)));
        }
        // Sort by createdAt descending (newest first) by default
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        orders.sort((a, b) => {
            let aValue;
            let bValue;
            if (sortBy === 'createdAt') {
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
            }
            else if (sortBy === 'totalAmount') {
                aValue = a.totalAmount || 0;
                bValue = b.totalAmount || 0;
            }
            else {
                aValue = a.createdAt;
                bValue = b.createdAt;
            }
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
        const total = orders.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginatedOrders = orders.slice(startIndex, startIndex + limit);
        console.log(`[GET /api/admin/orders] Returning ${paginatedOrders.length} orders (page ${page}, total: ${total})`);
        res.json({
            success: true,
            data: paginatedOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
            message: 'Orders retrieved successfully',
        });
    }
    catch (error) {
        console.error('Get admin orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
/**
 * GET /api/admin/orders/recent
 * Get recent orders
 */
router.get('/orders/recent', async (req, res) => {
    try {
        // Reduced delay for better performance (was 500ms)
        await mockApiDelay(50);
        const orders = await (0, db_1.getOrders)();
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
        res.json({
            success: true,
            data: recentOrders,
            message: 'Recent orders retrieved successfully',
        });
    }
    catch (error) {
        console.error('Get recent orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
/**
 * POST /api/admin/orders/:id/approve
 * Approve an order
 */
router.post('/orders/:id/approve', async (req, res) => {
    try {
        // Reduced delay for better performance (was 600ms)
        await mockApiDelay(100);
        const { id } = req.params;
        console.log(`[POST /api/admin/orders/${id}/approve] Approving order`);
        const orders = await (0, db_1.getOrders)();
        const order = orders.find(o => o.id === id);
        if (!order) {
            console.error(`[POST /api/admin/orders/${id}/approve] Order not found`);
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }
        order.status = 'approved';
        order.updatedAt = new Date().toISOString();
        console.log(`[POST /api/admin/orders/${id}/approve] Saving approved order`);
        await (0, db_1.saveOrder)(order);
        console.log(`[POST /api/admin/orders/${id}/approve] Order approved successfully`);
        res.json({
            success: true,
            data: order,
            message: 'Order approved successfully',
        });
    }
    catch (error) {
        console.error('[POST /api/admin/orders/:id/approve] Approve order error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        });
    }
});
/**
 * POST /api/admin/orders/:id/reject
 * Reject an order
 */
router.post('/orders/:id/reject', async (req, res) => {
    try {
        // Reduced delay for better performance (was 600ms)
        await mockApiDelay(100);
        const { id } = req.params;
        console.log(`[POST /api/admin/orders/${id}/reject] Rejecting order`);
        const orders = await (0, db_1.getOrders)();
        const order = orders.find(o => o.id === id);
        if (!order) {
            console.error(`[POST /api/admin/orders/${id}/reject] Order not found`);
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }
        order.status = 'rejected';
        order.updatedAt = new Date().toISOString();
        console.log(`[POST /api/admin/orders/${id}/reject] Saving rejected order`);
        await (0, db_1.saveOrder)(order);
        console.log(`[POST /api/admin/orders/${id}/reject] Order rejected successfully`);
        res.json({
            success: true,
            data: order,
            message: 'Order rejected successfully',
        });
    }
    catch (error) {
        console.error('[POST /api/admin/orders/:id/reject] Reject order error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        });
    }
});
/**
 * POST /api/admin/orders/:id/cancel
 * Cancel an order
 */
router.post('/orders/:id/cancel', async (req, res) => {
    try {
        // Reduced delay for better performance (was 600ms)
        await mockApiDelay(100);
        const { id } = req.params;
        const orders = await (0, db_1.getOrders)();
        const order = orders.find(o => o.id === id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
        await (0, db_1.saveOrder)(order);
        res.json({
            success: true,
            data: order,
            message: 'Order cancelled successfully',
        });
    }
    catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
exports.default = router;
