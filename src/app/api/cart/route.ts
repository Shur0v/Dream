/**
 * @fileoverview Cart API routes for shopping cart management
 * Handles cart operations like add, remove, update quantities
 * 
 * @description This file provides:
 * - GET /api/cart - Get user's cart
 * - POST /api/cart - Add item to cart
 * - PUT /api/cart - Update cart item quantity
 * - DELETE /api/cart - Remove item from cart
 * - DELETE /api/cart/clear - Clear entire cart
 * 
 * @author Your Name
 * @version 1.0.0
 */

export { GET, POST, PUT, DELETE } from '@backend/routes/cart';
