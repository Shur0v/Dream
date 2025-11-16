/**
 * @fileoverview Products API routes for product management
 * Handles product listing, creation, updates, and deletion
 * 
 * @description This file provides:
 * - GET /api/products - List products with filtering and pagination
 * - POST /api/products - Create new product (seller/admin only)
 * - GET /api/products/[id] - Get single product details
 * - PUT /api/products/[id] - Update product (seller/admin only)
 * - DELETE /api/products/[id] - Delete product (admin only)
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct, getColors } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Product } from '@/types';

/**
 * Get products list API endpoint
 * 
 * @description Returns paginated list of products with filtering options
 * Supports search, category filtering, and pagination
 * 
 * @param request - NextRequest with query parameters
 * @returns NextResponse with products list
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(800); // Simulate API delay
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
    const color = searchParams.get('color'); // Color ID or name
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const allProducts = await getProducts();
    let filteredProducts = [...allProducts];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter (by name or ID)
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

    // Apply color filter
    if (color) {
      filteredProducts = filteredProducts.filter(product => {
        if (product.colors && product.colors.length > 0) {
          return product.colors.some(c => 
            c.toLowerCase() === color.toLowerCase() || 
            c === color
          );
        }
        // Fallback: check specifications for color
        if (product.specifications?.color) {
          return product.specifications.color.toLowerCase().includes(color.toLowerCase());
        }
        return false;
      });
    }

    // Apply price filters
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

    // Apply stock filter
    if (inStock) {
      filteredProducts = filteredProducts.filter(product =>
        product.stock > 0 && product.isActive
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue, bValue;
      
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

    // Enrich products with color objects if colors are present
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

    // Apply pagination
    const total = enrichedProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = enrichedProducts.slice(startIndex, endIndex);

    return NextResponse.json({
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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create product API endpoint
 * 
 * @description Creates new product (seller/admin only)
 * Validates product data and creates new product entry
 * 
 * @param request - NextRequest containing product data
 * @returns NextResponse with created product
 */
export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(1200); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || !['seller', 'super-admin'].includes(user.role)) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const body = await request.json();
    console.log('Received product data:', body);
    
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
      colors, // Array of color IDs
      size, // Array of sizes
      tags, 
      specifications 
    } = body;

    // Validate required fields
    if (!name || !description || price === undefined || price === null || !category || !brand || !sku) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing. Please check: name, description, price, category, brand, and sku.' },
        { status: 400 }
      );
    }

    // Convert and validate price
    const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a valid number greater than 0' },
        { status: 400 }
      );
    }

    // Convert and validate stock
    const stockNum = typeof stock === 'string' ? parseInt(stock) : Number(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return NextResponse.json(
        { success: false, error: 'Stock must be a valid number and cannot be negative' },
        { status: 400 }
      );
    }

    // Validate colors if provided
    if (colors && Array.isArray(colors)) {
      const allColors = await getColors();
      const validColors = colors.every(colorId => 
        allColors.some(c => c.id === colorId)
      );
      if (!validColors) {
        return NextResponse.json(
          { success: false, error: 'One or more color IDs are invalid' },
          { status: 400 }
        );
      }
    }

    // Convert originalPrice
    const originalPriceNum = originalPrice 
      ? (typeof originalPrice === 'string' ? parseFloat(originalPrice) : Number(originalPrice))
      : undefined;

    // Create new product
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: String(name).trim(),
      description: String(description).trim(),
      price: priceNum,
      originalPrice: originalPriceNum && !isNaN(originalPriceNum) ? originalPriceNum : undefined,
      discount: originalPriceNum && originalPriceNum > priceNum
        ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
        : undefined,
      images: Array.isArray(images) ? images.filter(img => img && img.trim() !== '') : [],
      category: String(category).trim(),
      categoryId: categoryId ? String(categoryId).trim() : undefined,
      subcategory: subcategory ? String(subcategory).trim() : undefined,
      brand: String(brand).trim(),
      sku: String(sku).trim(),
      stock: stockNum,
      colors: colors && Array.isArray(colors) ? colors.filter(c => c) : undefined,
      size: size && Array.isArray(size) ? size.filter(s => s) : undefined,
      isActive: true,
      tags: Array.isArray(tags) ? tags.filter(t => t) : [],
      specifications: specifications && typeof specifications === 'object' ? specifications : {},
      sellerId: 'seller-1', // TODO: Get from authenticated user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Product to save:', newProduct);

    // Save to database
    try {
      await saveProduct(newProduct);
      console.log('Product saved successfully to database');
    } catch (error) {
      console.error('Error saving product to database:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save product to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
