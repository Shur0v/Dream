/**
 * @fileoverview Categories API route
 * Handles category management for both admin and client
 * 
 * @description This file provides:
 * - GET /api/categories - List all categories
 * - POST /api/categories - Create new category (admin only)
 * 
 * @author Your Name
 * @version 1.0.0
 */

// Mark as server-side only
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export { GET, POST } from '@backend/routes/categories';

