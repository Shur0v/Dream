/**
 * Express.js Backend Server
 * Main entry point for the backend API
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from backend/.env
const envPath = path.join(process.cwd(), 'backend', '.env');
dotenv.config({ path: envPath });

// Import routes
import productsRoutes from './express-routes/products';
import categoriesRoutes from './express-routes/categories';
import colorsRoutes from './express-routes/colors';
import ordersRoutes from './express-routes/orders';
import authRoutes from './express-routes/auth';
import cartRoutes from './express-routes/cart';
import adminRoutes from './express-routes/admin';
import usersRoutes from './express-routes/users';

const app: Express = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware - CORS with proper headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/colors', colorsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

