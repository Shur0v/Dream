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
import { sampleProducts, mockApiDelay } from '@/lib/dummyData';

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
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let filteredProducts = [...sampleProducts];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
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

    // Apply pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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
    const { name, description, price, originalPrice, images, category, subcategory, brand, sku, stock, tags, specifications } = body;

    // Validate required fields
    if (!name || !description || !price || !category || !brand || !sku) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Validate price
    if (price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate stock
    if (stock < 0) {
      return NextResponse.json(
        { success: false, error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = {
      id: `product-${Date.now()}`,
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images: images || [],
      category,
      subcategory: subcategory || undefined,
      brand,
      sku,
      stock: parseInt(stock) || 0,
      isActive: true,
      tags: tags || [],
      specifications: specifications || {},
      sellerId: 'seller-1', // TODO: Get from authenticated user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In real app, save to database
    // await saveProduct(newProduct);

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
