"use strict";
/**
 * Orders Express Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
// Alias for easier use in the file
const getOrderById = db_1.getOrderById;
const saveOrder = db_1.saveOrder;
const router = (0, express_1.Router)();
const mockApiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * GET /api/orders
 * Get all orders (with filtering)
 */
router.get('/', async (req, res) => {
    try {
        // Reduced delay for better performance (was 800ms)
        await mockApiDelay(100);
        const userId = req.query.userId;
        const status = req.query.status;
        let orders = await (0, db_1.getOrders)();
        if (userId) {
            orders = orders.filter(order => order.userId === userId);
        }
        if (status) {
            orders = orders.filter(order => order.status === status);
        }
        res.json({
            success: true,
            data: orders,
            message: 'Orders retrieved successfully',
        });
    }
    catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
/**
 * GET /api/orders/:id
 * Get single order by ID
 */
router.get('/:id', async (req, res) => {
    try {
        await mockApiDelay(300);
        const { id } = req.params;
        const order = await (0, db_1.getOrderById)(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }
        res.json({
            success: true,
            data: order,
            message: 'Order retrieved successfully',
        });
    }
    catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
/**
 * POST /api/orders
 * Create new order
 */
router.post('/', async (req, res) => {
    try {
        await mockApiDelay(1200);
        const { userId, items, shippingAddress, billingAddress, paymentMethod, notes, } = req.body;
        console.log('[POST /api/orders] Received order data:', {
            userId,
            itemsCount: items?.length,
            hasShippingAddress: !!shippingAddress,
            paymentMethod,
            hasNotes: !!notes,
        });
        if (!userId || !items || !Array.isArray(items) || items.length === 0) {
            console.error('[POST /api/orders] Validation failed: userId or items missing');
            return res.status(400).json({
                success: false,
                error: 'User ID and items are required',
            });
        }
        const totalAmount = items.reduce((sum, item) => {
            return sum + (item.price || 0) * (item.quantity || 1);
        }, 0);
        const newOrder = {
            id: `order-${Date.now()}`,
            userId: String(userId),
            items: items.map((item, index) => ({
                id: `order-item-${Date.now()}-${index}`,
                productId: item.productId,
                product: item.product,
                quantity: item.quantity || 1,
                price: item.price || 0,
                color: item.color,
                size: item.size,
            })),
            status: 'pending',
            totalAmount,
            shippingAddress: shippingAddress || {},
            billingAddress: billingAddress,
            paymentMethod: paymentMethod || 'Credit Card',
            paymentStatus: 'pending',
            notes: notes || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        console.log('[POST /api/orders] Saving order:', {
            id: newOrder.id,
            userId: newOrder.userId,
            totalAmount: newOrder.totalAmount,
            itemsCount: newOrder.items.length,
        });
        // Save order to MongoDB
        const savedOrder = await (0, db_1.saveOrder)(newOrder);
        console.log('[POST /api/orders] Order saved successfully:', savedOrder.id);
        res.status(201).json({
            success: true,
            data: savedOrder,
            message: 'Order created successfully',
        });
    }
    catch (error) {
        console.error('[POST /api/orders] Create order error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        });
    }
});
/**
 * PUT /api/orders/:id
 * Update order
 */
router.put('/:id', async (req, res) => {
    try {
        await mockApiDelay(1000);
        const { id } = req.params;
        const existingOrder = await (0, db_1.getOrderById)(id);
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }
        const updatedOrder = {
            ...existingOrder,
            ...req.body,
            updatedAt: new Date().toISOString(),
        };
        await (0, db_1.saveOrder)(updatedOrder);
        res.json({
            success: true,
            data: updatedOrder,
            message: 'Order updated successfully',
        });
    }
    catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
exports.default = router;
