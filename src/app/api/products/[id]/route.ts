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
import { getProductById, saveProduct, deleteProduct, getColors } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Product, Color } from '@/types';

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

    // Find product in database
    const product = await getProductById(id);
    
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

    // Enrich product with color objects if colors are present
    let enrichedProduct = product;
    if (product.colors && product.colors.length > 0) {
      const allColors = await getColors();
      const colorObjects = product.colors
        .map((colorId) => allColors.find((c) => c.id === colorId))
        .filter((color): color is Color => Boolean(color));
      enrichedProduct = {
        ...product,
        colorOptions: colorObjects,
      };
    }

    return NextResponse.json({
      success: true,
      data: enrichedProduct,
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

    // Find product in database
    const existingProduct = await getProductById(id);
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
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
      isActive 
    } = body;

    const hasImagesField = Object.prototype.hasOwnProperty.call(body, 'images');
    const sanitizedImages = hasImagesField
      ? Array.isArray(images)
        ? images.filter((img): img is string => typeof img === 'string' && img.length > 0)
        : []
      : undefined;

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

    // Calculate discount if originalPrice is provided
    const calculatedDiscount = (price !== undefined && originalPrice !== undefined && originalPrice > price)
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

    // Update product
    const updatedProduct: Product = {
      ...existingProduct,
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(originalPrice !== undefined && { originalPrice: parseFloat(originalPrice) }),
      ...(calculatedDiscount !== undefined && { discount: calculatedDiscount }),
      ...(hasImagesField && { images: sanitizedImages ?? [] }),
      ...(category && { category }),
      ...(categoryId !== undefined && { categoryId }),
      ...(subcategory !== undefined && { subcategory }),
      ...(brand && { brand }),
      ...(sku && { sku }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(colors !== undefined && { colors }),
      ...(size !== undefined && { size }),
      ...(tags && { tags }),
      ...(specifications && { specifications }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date().toISOString(),
    };

    // Update in database
    await saveProduct(updatedProduct);

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

    // Soft delete product (set isActive to false)
    const deletedProduct = await deleteProduct(id);
    
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

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
