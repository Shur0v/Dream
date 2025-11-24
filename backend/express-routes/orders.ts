/**
 * Orders Express Routes
 */

import { Router, Request, Response } from 'express';
import {
  getOrders,
  getOrderById,
  saveOrder,
  invalidateOrdersCache,
} from '../express-lib/db';
import { OrderStatus } from '../../src/types';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/orders
 * Get all orders (with filtering)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(800);

    const userId = req.query.userId as string;
    const status = req.query.status as string;
    let orders = await getOrders();

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
  } catch (error) {
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
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const { id } = req.params;
    const order = await getOrderById(id);

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
  } catch (error) {
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
router.post('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(1200);

    const {
      userId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = req.body;

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

    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);

    const newOrder = {
      id: `order-${Date.now()}`,
      userId: String(userId),
      items: items.map((item: any, index: number) => ({
        id: `order-item-${Date.now()}-${index}`,
        productId: item.productId,
        product: item.product,
        quantity: item.quantity || 1,
        price: item.price || 0,
        color: item.color,
        size: item.size,
      })),
      status: 'pending' as OrderStatus,
      totalAmount,
      shippingAddress: shippingAddress || {},
      billingAddress: billingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'pending' as 'pending' | 'paid' | 'failed' | 'refunded',
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

    // Invalidate cache before saving to ensure fresh read
    invalidateOrdersCache();

    const savedOrder = await saveOrder(newOrder);
    console.log('[POST /api/orders] Order saved successfully:', savedOrder.id);
    
    // Invalidate cache after saving to ensure next read is fresh
    invalidateOrdersCache();

    res.status(201).json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully',
    });
  } catch (error) {
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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(1000);

    const { id } = req.params;
    const existingOrder = await getOrderById(id);

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

    await saveOrder(updatedOrder);

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;

