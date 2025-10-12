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

import { NextRequest, NextResponse } from 'next/server';
import { sampleProducts, mockApiDelay } from '@/lib/dummyData';

/**
 * Get single product API endpoint
 * 
 * @description Returns detailed information about a specific product
 * Includes all product data and related information
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing product ID
 * @returns NextResponse with product details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(500); // Simulate API delay
    
    const { id } = await params;

    // Find product in sample data
    const product = sampleProducts.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is active
    if (!product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product is not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product retrieved successfully',
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update product API endpoint
 * 
 * @description Updates existing product (seller/admin only)
 * Validates update data and updates product information
 * 
 * @param request - NextRequest containing update data
 * @param params - Route parameters containing product ID
 * @returns NextResponse with updated product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(1000); // Simulate API delay
    
    const { id } = await params;
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || !['seller', 'super-admin'].includes(user.role)) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Find product in sample data
    const productIndex = sampleProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, price, originalPrice, images, category, subcategory, brand, sku, stock, tags, specifications, isActive } = body;

    // Validate price if provided
    if (price !== undefined && price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate stock if provided
    if (stock !== undefined && stock < 0) {
      return NextResponse.json(
        { success: false, error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = {
      ...sampleProducts[productIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(originalPrice !== undefined && { originalPrice: parseFloat(originalPrice) }),
      ...(images && { images }),
      ...(category && { category }),
      ...(subcategory !== undefined && { subcategory }),
      ...(brand && { brand }),
      ...(sku && { sku }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(tags && { tags }),
      ...(specifications && { specifications }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date().toISOString(),
    };

    // In real app, update in database
    // await updateProduct(id, updatedProduct);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete product API endpoint
 * 
 * @description Deletes product (admin only)
 * Soft deletes product by setting isActive to false
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing product ID
 * @returns NextResponse with deletion result
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(800); // Simulate API delay
    
    const { id } = await params;
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || user.role !== 'super-admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Find product in sample data
    const productIndex = sampleProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete product (set isActive to false)
    const deletedProduct = {
      ...sampleProducts[productIndex],
      isActive: false,
      updatedAt: new Date().toISOString(),
    };

    // In real app, update in database
    // await softDeleteProduct(id);

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
