/**
 * Express.js Backend Server
 * Main entry point for the backend API
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase } from './config/database';

// Load environment variables from root .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Import routes
import productsRoutes from './express-routes/products';
import categoriesRoutes from './express-routes/categories';
import colorsRoutes from './express-routes/colors';
import ordersRoutes from './express-routes/orders';
import authRoutes from './express-routes/auth';
import cartRoutes from './express-routes/cart';
import adminRoutes from './express-routes/admin';
import usersRoutes from './express-routes/users';
import featuredRoutes from './express-routes/featured';
import bannersRoutes from './express-routes/banners';
import bestSellingRoutes from './express-routes/best-selling';
import uploadRoutes from './express-routes/upload';
import reviewsRoutes from './express-routes/reviews';

const app: Express = express();
const PORT = Number.parseInt(process.env.BACKEND_PORT || '5000', 10);

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads');
app.use('/uploads', express.static(publicUploadsPath));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/colors', colorsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/featured-products', featuredRoutes);
app.use('/api', bannersRoutes);
app.use('/api', bestSellingRoutes);
app.use('/api', uploadRoutes);
app.use('/api', reviewsRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

async function startServer() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await connectToDatabase();
    console.log('PostgreSQL database ready');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Express server running on http://0.0.0.0:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Please check your DATABASE_URL / POSTGRES_URL in .env');
    process.exit(1);
  }
}

startServer();

export default app;
