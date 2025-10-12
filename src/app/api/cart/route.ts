/**
 * @fileoverview Cart API routes for shopping cart management
 * Handles cart operations like add, remove, update quantities
 * 
 * @description This file provides:
 * - GET /api/cart - Get user's cart
 * - POST /api/cart - Add item to cart
 * - PUT /api/cart - Update cart item quantity
 * - DELETE /api/cart - Remove item from cart
 * - DELETE /api/cart/clear - Clear entire cart
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { sampleProducts, sampleCartItems, mockApiDelay } from '@/lib/dummyData';

/**
 * Get cart API endpoint
 * 
 * @description Returns user's current cart with all items
 * Includes product details and calculated totals
 * 
 * @param request - NextRequest with user authentication
 * @returns NextResponse with cart data
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(600); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Mock cart data (in real app, fetch from database)
    const cartItems = sampleCartItems;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    const cart = {
      id: 'cart-1',
      userId: 'user-1',
      items: cartItems,
      totalItems,
      totalPrice,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Cart retrieved successfully',
    });

  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Add item to cart API endpoint
 * 
 * @description Adds product to user's cart or updates quantity if exists
 * Validates product availability and stock
 * 
 * @param request - NextRequest containing product data
 * @returns NextResponse with updated cart
 */
export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(800); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    // Validate input
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Find product
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is active and in stock
    if (!product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product is not available' },
        { status: 400 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Mock cart update (in real app, update database)
    const existingItemIndex = sampleCartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      sampleCartItems[existingItemIndex].quantity += quantity;
      sampleCartItems[existingItemIndex].price = sampleCartItems[existingItemIndex].product.price * sampleCartItems[existingItemIndex].quantity;
    } else {
      // Add new item
      const newItem = {
        id: `cart-item-${Date.now()}`,
        productId,
        product,
        quantity,
        price: product.price * quantity,
        addedAt: new Date().toISOString(),
      };
      sampleCartItems.push(newItem);
    }

    // Calculate totals
    const totalItems = sampleCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = sampleCartItems.reduce((sum, item) => sum + item.price, 0);

    return NextResponse.json({
      success: true,
      data: {
        items: sampleCartItems,
        totalItems,
        totalPrice,
      },
      message: 'Item added to cart successfully',
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update cart item quantity API endpoint
 * 
 * @description Updates quantity of specific cart item
 * Removes item if quantity becomes 0
 * 
 * @param request - NextRequest containing update data
 * @returns NextResponse with updated cart
 */
export async function PUT(request: NextRequest) {
  try {
    await mockApiDelay(700); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const body = await request.json();
    const { productId, quantity } = body;

    // Validate input
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    // Find cart item
    const itemIndex = sampleCartItems.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Check stock availability
    const product = sampleCartItems[itemIndex].product;
    if (quantity > 0 && product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Update or remove item
    if (quantity === 0) {
      sampleCartItems.splice(itemIndex, 1);
    } else {
      sampleCartItems[itemIndex].quantity = quantity;
      sampleCartItems[itemIndex].price = product.price * quantity;
    }

    // Calculate totals
    const totalItems = sampleCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = sampleCartItems.reduce((sum, item) => sum + item.price, 0);

    return NextResponse.json({
      success: true,
      data: {
        items: sampleCartItems,
        totalItems,
        totalPrice,
      },
      message: 'Cart updated successfully',
    });

  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Remove item from cart API endpoint
 * 
 * @description Removes specific item from user's cart
 * 
 * @param request - NextRequest containing product ID
 * @returns NextResponse with updated cart
 */
export async function DELETE(request: NextRequest) {
  try {
    await mockApiDelay(500); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find and remove item
    const itemIndex = sampleCartItems.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    sampleCartItems.splice(itemIndex, 1);

    // Calculate totals
    const totalItems = sampleCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = sampleCartItems.reduce((sum, item) => sum + item.price, 0);

    return NextResponse.json({
      success: true,
      data: {
        items: sampleCartItems,
        totalItems,
        totalPrice,
      },
      message: 'Item removed from cart successfully',
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
