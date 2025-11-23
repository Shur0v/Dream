/**
 * Admin Express Routes
 */

import { Router, Request, Response } from 'express';
import {
  getOrders,
  getProducts,
  getUsers,
  saveOrder,
} from '../express-lib/db';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(500);

    const [products, orders, users] = await Promise.all([
      getProducts(),
      getOrders(),
      getUsers(),
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
  } catch (error) {
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
router.get('/orders', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(800);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    let orders = await getOrders();

    if (status) {
      orders = orders.filter(order => order.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.userId.toLowerCase().includes(searchLower) ||
        order.items.some(item =>
          item.product?.name.toLowerCase().includes(searchLower)
        )
      );
    }

    const total = orders.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(startIndex, startIndex + limit);

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
  } catch (error) {
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
router.get('/orders/recent', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(500);

    const orders = await getOrders();
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    res.json({
      success: true,
      data: recentOrders,
      message: 'Recent orders retrieved successfully',
    });
  } catch (error) {
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
router.post('/orders/:id/approve', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const orders = await getOrders();
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    order.status = 'approved';
    order.updatedAt = new Date().toISOString();

    await saveOrder(order);

    res.json({
      success: true,
      data: order,
      message: 'Order approved successfully',
    });
  } catch (error) {
    console.error('Approve order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/admin/orders/:id/reject
 * Reject an order
 */
router.post('/orders/:id/reject', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const orders = await getOrders();
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    order.status = 'rejected';
    order.updatedAt = new Date().toISOString();

    await saveOrder(order);

    res.json({
      success: true,
      data: order,
      message: 'Order rejected successfully',
    });
  } catch (error) {
    console.error('Reject order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/admin/orders/:id/cancel
 * Cancel an order
 */
router.post('/orders/:id/cancel', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const orders = await getOrders();
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    await saveOrder(order);

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;



