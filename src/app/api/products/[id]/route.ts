/**
 * @fileoverview Single product API route
 * Handles individual product operations (get, update, delete)
 * 
 * @description This file provides:
 * - GET /api/products/[id] - Get single product details
 * - PUT /api/products/[id] - Update product (seller/admin only)
 * - DELETE /api/products/[id] - Delete product (admin only)
 * 
 * @author Your Name
 * @version 1.0.0
 */

export { GET, PUT, DELETE } from '@backend/routes/products/id';
