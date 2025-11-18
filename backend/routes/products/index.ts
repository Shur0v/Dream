/**
 * Backend handler for /api/products route.
 * Provides GET (list) and POST (create) endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct, getColors } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Product } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(800);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
    const color = searchParams.get('color');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const allProducts = await getProducts();
    let filteredProducts = [...allProducts];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
    }

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

    if (color) {
      filteredProducts = filteredProducts.filter(product => {
        if (product.colors && product.colors.length > 0) {
          return product.colors.some(c =>
            c.toLowerCase() === color.toLowerCase() ||
            c === color
          );
        }
        if (product.specifications?.color) {
          return product.specifications.color.toLowerCase().includes(color.toLowerCase());
        }
        return false;
      });
    }

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

    if (inStock) {
      filteredProducts = filteredProducts.filter(product =>
        product.stock > 0 && product.isActive
      );
    }

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

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(1200);

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
      colors,
      size,
      tags,
      specifications
    } = body;

    if (!name || !description || price === undefined || price === null || !category || !brand || !sku) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing. Please check: name, description, price, category, brand, and sku.' },
        { status: 400 }
      );
    }

    const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a valid number greater than 0' },
        { status: 400 }
      );
    }

    const stockNum = typeof stock === 'string' ? parseInt(stock) : Number(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return NextResponse.json(
        { success: false, error: 'Stock must be a valid number and cannot be negative' },
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
      colors: colors && Array.isArray(colors) ? colors.filter((c: string) => c) : undefined,
      size: size && Array.isArray(size) ? size.filter((s: string) => s) : undefined,
      isActive: true,
      tags: Array.isArray(tags) ? tags.filter((t: string) => t) : [],
      specifications: specifications && typeof specifications === 'object' ? specifications : {},
      sellerId: 'seller-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Product to save:', newProduct);

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

