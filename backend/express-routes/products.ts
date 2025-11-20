/**
 * Products Express Routes
 */

import { Router, Request, Response } from 'express';
import {
  getProducts,
  getProductById,
  saveProduct,
  deleteProduct,
  getColors,
} from '../express-lib/db';
import { Product } from '../../src/types';

const router = Router();

// Mock API delay helper
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/products
 * Get all products with filtering, pagination, and sorting
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 40;
    const category = req.query.category as string;
    const categoryId = req.query.categoryId as string;
    const color = req.query.color as string;
    const search = req.query.search as string;
    const minPrice = req.query.minPrice as string;
    const maxPrice = req.query.maxPrice as string;
    const inStock = req.query.inStock === 'true';
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    let filteredProducts = await getProducts();

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (categoryId) {
      filteredProducts = filteredProducts.filter(product =>
        product.categoryId === categoryId
      );
    }

    // Filter by color
    if (color) {
      filteredProducts = filteredProducts.filter(product => {
        if (product.colors && product.colors.length > 0) {
          return product.colors.some(c =>
            c.toLowerCase() === color.toLowerCase() || c === color
          );
        }
        if (product.specifications?.color) {
          return (product.specifications.color as string).toLowerCase().includes(color.toLowerCase());
        }
        return false;
      });
    }

    // Filter by price range
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= parseFloat(maxPrice)
      );
    }

    // Filter by stock
    if (inStock) {
      filteredProducts = filteredProducts.filter(product =>
        product.stock > 0 && product.isActive
      );
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Enrich with color objects
    const allColors = await getColors();
    const enrichedProducts = filteredProducts.map(product => {
      if (product.colors && product.colors.length > 0) {
        const colorObjects = product.colors
          .map(colorId => allColors.find(c => c.id === colorId))
          .filter(Boolean);
        return {
          ...product,
          colorOptions: colorObjects,
        };
      }
      return product;
    });

    // Paginate
    const total = enrichedProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = enrichedProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: 'Products retrieved successfully',
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/products/:id
 * Get single product by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product retrieved successfully',
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/products
 * Create new product
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(1200);

    const {
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      categoryId,
      subcategory,
      brand,
      sku,
      stock,
      colors,
      size,
      tags,
      specifications,
    } = req.body;

    if (!name || !description || price === undefined || price === null || !category || !brand || !sku) {
      return res.status(400).json({
        success: false,
        error: 'Required fields missing. Please check: name, description, price, category, brand, and sku.',
      });
    }

    const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a valid number greater than 0',
      });
    }

    const stockNum = typeof stock === 'string' ? parseInt(stock) : Number(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock must be a valid number and cannot be negative',
      });
    }

    // Validate colors if provided
    if (colors && Array.isArray(colors) && colors.length > 0) {
      const allColors = await getColors();
      const validColors = colors.every(colorId =>
        allColors.some(c => c.id === colorId)
      );

      if (!validColors) {
        return res.status(400).json({
          success: false,
          error: 'One or more color IDs are invalid',
        });
      }
    }

    const originalPriceNum = originalPrice
      ? (typeof originalPrice === 'string' ? parseFloat(originalPrice) : Number(originalPrice))
      : undefined;

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: String(name).trim(),
      description: String(description).trim(),
      price: priceNum,
      originalPrice: originalPriceNum && !isNaN(originalPriceNum) ? originalPriceNum : undefined,
      discount: originalPriceNum && originalPriceNum > priceNum
        ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
        : undefined,
      images: Array.isArray(images) ? images.filter((img: string) => img && img.trim() !== '') : [],
      category: String(category).trim(),
      categoryId: categoryId ? String(categoryId).trim() : undefined,
      subcategory: subcategory ? String(subcategory).trim() : undefined,
      brand: String(brand).trim(),
      sku: String(sku).trim(),
      stock: stockNum,
      colors: colors && Array.isArray(colors) && colors.length > 0 ? colors.filter((c: string) => c && c.trim() !== '') : [],
      size: size && Array.isArray(size) ? size.filter((s: string) => s) : undefined,
      isActive: true,
      tags: Array.isArray(tags) ? tags.filter((t: string) => t) : [],
      specifications: specifications && typeof specifications === 'object' ? specifications : {},
      sellerId: 'seller-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveProduct(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * PUT /api/products/:id
 * Update product
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(1000);

    const { id } = req.params;
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const body = req.body;
    const updatedProduct: Product = {
      ...existingProduct,
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.price !== undefined && { price: parseFloat(body.price) }),
      ...(body.originalPrice !== undefined && { originalPrice: parseFloat(body.originalPrice) }),
      ...(body.images !== undefined && { images: Array.isArray(body.images) ? body.images : [] }),
      ...(body.category && { category: body.category }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      ...(body.subcategory !== undefined && { subcategory: body.subcategory }),
      ...(body.brand && { brand: body.brand }),
      ...(body.sku && { sku: body.sku }),
      ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
      ...(body.colors !== undefined && { colors: body.colors }),
      ...(body.size !== undefined && { size: body.size }),
      ...(body.tags && { tags: body.tags }),
      ...(body.specifications && { specifications: body.specifications }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      updatedAt: new Date().toISOString(),
    };

    await saveProduct(updatedProduct);

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product (soft delete)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const deletedProduct = await deleteProduct(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;


