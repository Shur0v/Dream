/**
 * Unit and Integration Tests for Featured Products API
 * Uses Jest + supertest for testing Express endpoints
 */

import request from 'supertest';
import express, { Express } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import featuredRoutes from '../express-routes/featured';
import adminRoutes from '../express-routes/admin';

// Mock the database functions
jest.mock('../express-lib/db', () => {
  const mockFeaturedProducts: any[] = [];
  
  return {
    getFeaturedProducts: jest.fn(async () => [...mockFeaturedProducts]),
    addFeaturedProduct: jest.fn(async (product: any) => {
      const existingIndex = mockFeaturedProducts.findIndex(fp => fp.productId === product.productId);
      const featuredProduct = {
        ...product,
        featuredAt: new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        mockFeaturedProducts[existingIndex] = featuredProduct;
      } else {
        mockFeaturedProducts.push(featuredProduct);
      }
      
      return featuredProduct;
    }),
    removeFeaturedProduct: jest.fn(async (productId: string) => {
      const index = mockFeaturedProducts.findIndex(fp => fp.productId === productId);
      if (index >= 0) {
        mockFeaturedProducts.splice(index, 1);
        return true;
      }
      return false;
    }),
    getProductById: jest.fn(async (id: string) => {
      // Mock product
      return {
        id,
        name: 'Test Product',
        slug: 'test-product',
        price: 99.99,
        images: ['/test-image.jpg'],
      };
    }),
  };
});

// Create test Express app
function createTestApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api', featuredRoutes);
  app.use('/api/admin', adminRoutes);
  return app;
}

describe('Featured Products API', () => {
  let app: Express;
  const testProduct = {
    productId: 'test-product-1',
    name: 'Test Product',
    slug: 'test-product',
    price: 99.99,
    thumbnail: '/test-thumbnail.jpg',
  };

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /api/featured', () => {
    it('should return empty array when no featured products', async () => {
      const { getFeaturedProducts } = require('../express-lib/db');
      getFeaturedProducts.mockResolvedValueOnce([]);

      const response = await request(app)
        .get('/api/featured')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
        message: 'Featured products retrieved successfully',
      });
    });

    it('should return featured products', async () => {
      const { getFeaturedProducts } = require('../express-lib/db');
      const mockProducts = [
        {
          productId: 'prod-1',
          name: 'Product 1',
          slug: 'product-1',
          price: 49.99,
          thumbnail: '/thumb1.jpg',
          featuredAt: '2024-01-01T00:00:00Z',
        },
      ];
      getFeaturedProducts.mockResolvedValueOnce(mockProducts);

      const response = await request(app)
        .get('/api/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].productId).toBe('prod-1');
    });
  });

  describe('POST /api/admin/feature', () => {
    it('should add a product to featured products', async () => {
      const response = await request(app)
        .post('/api/admin/feature')
        .send(testProduct)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.productId).toBe(testProduct.productId);
      expect(response.body.data.featuredAt).toBeDefined();
    });

    it('should be idempotent - update timestamp if already featured', async () => {
      const { addFeaturedProduct } = require('../express-lib/db');
      
      // First add
      await request(app)
        .post('/api/admin/feature')
        .send(testProduct)
        .expect(200);

      const firstCall = addFeaturedProduct.mock.calls[0][0];
      
      // Add again (should update timestamp)
      await request(app)
        .post('/api/admin/feature')
        .send(testProduct)
        .expect(200);

      expect(addFeaturedProduct).toHaveBeenCalledTimes(2);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/admin/feature')
        .send({
          // Missing required fields
          productId: 'test',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should validate productId is non-empty string', async () => {
      const response = await request(app)
        .post('/api/admin/feature')
        .send({
          ...testProduct,
          productId: '',
        })
        .expect(400);

      expect(response.body.error).toContain('productId');
    });

    it('should validate price is non-negative number', async () => {
      const response = await request(app)
        .post('/api/admin/feature')
        .send({
          ...testProduct,
          price: -10,
        })
        .expect(400);

      expect(response.body.error).toContain('price');
    });

    it('should return 404 if product does not exist', async () => {
      const { getProductById } = require('../express-lib/db');
      getProductById.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post('/api/admin/feature')
        .send(testProduct)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('DELETE /api/admin/feature/:productId', () => {
    it('should remove a product from featured products', async () => {
      // First add the product
      await request(app)
        .post('/api/admin/feature')
        .send(testProduct)
        .expect(200);

      // Then remove it
      const response = await request(app)
        .delete(`/api/admin/feature/${testProduct.productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 if product is not featured', async () => {
      const { removeFeaturedProduct } = require('../express-lib/db');
      removeFeaturedProduct.mockResolvedValueOnce(false);

      const response = await request(app)
        .delete('/api/admin/feature/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should validate productId parameter', async () => {
      const response = await request(app)
        .delete('/api/admin/feature/')
        .expect(404); // Express will handle this as route not found

      // Test with empty productId
      const response2 = await request(app)
        .delete('/api/admin/feature/   ')
        .expect(400);

      expect(response2.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const { getFeaturedProducts } = require('../express-lib/db');
      getFeaturedProducts.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/featured')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Internal server error');
    });
  });
});



