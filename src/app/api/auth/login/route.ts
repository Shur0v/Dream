/**
 * @fileoverview Authentication API routes for login and registration
 * Handles user authentication, registration, and session management
 * 
 * @description This file provides:
 * - POST /api/auth/login - User login
 * - POST /api/auth/register - User registration
 * - POST /api/auth/logout - User logout
 * - POST /api/auth/refresh - Token refresh
 * - GET /api/auth/me - Get current user
 * 
 * @author Your Name
 * @version 1.0.0
 */

export { POST, GET } from '@backend/routes/auth/login';
