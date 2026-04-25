/**
 * Backend handlers for /api/products/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProductById, saveProduct, deleteProduct, getColors } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Product, Color } from '@/types';
import { validateImageList } from '@backend/lib/imageValidation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(500);

    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product is not available' },
        { status: 404 }
      );
    }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(1000);

    const { id } = await params;
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
    const rawImages = hasImagesField
      ? Array.isArray(images)
        ? images.filter((img): img is string => typeof img === 'string' && img.length > 0)
        : []
      : undefined;
    let sanitizedImages = rawImages;
    if (hasImagesField) {
      const imageValidation = validateImageList(rawImages ?? [], 'images');
      if (!imageValidation.valid) {
        return NextResponse.json(
          { success: false, error: imageValidation.error },
          { status: 400 }
        );
      }
      sanitizedImages = imageValidation.value;
    }

    if (price !== undefined && price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    if (stock !== undefined && stock < 0) {
      return NextResponse.json(
        { success: false, error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

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

    const calculatedDiscount = (price !== undefined && originalPrice !== undefined && originalPrice > price)
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

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

    await saveProduct(updatedProduct);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Cache-Invalidate': 'true',
      },
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(800);

    const { id } = await params;
    console.log(`[DELETE /api/products/${id}] Received delete request for ID: ${id}`);
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
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Cache-Invalidate': 'true',
      },
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

