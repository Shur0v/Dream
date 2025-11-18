import { NextRequest, NextResponse } from 'next/server';
import { sampleProducts, sampleCartItems, mockApiDelay } from '@/lib/dummyData';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(600);

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

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(800);

    const body = await request.json();
    const { productId, quantity = 1 } = body;

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

    const product = sampleProducts.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

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

    const existingItemIndex = sampleCartItems.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      sampleCartItems[existingItemIndex].quantity += quantity;
      sampleCartItems[existingItemIndex].price =
        sampleCartItems[existingItemIndex].product.price * sampleCartItems[existingItemIndex].quantity;
    } else {
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

export async function PUT(request: NextRequest) {
  try {
    await mockApiDelay(700);

    const body = await request.json();
    const { productId, quantity } = body;

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

    const itemIndex = sampleCartItems.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    const product = sampleCartItems[itemIndex].product;
    if (quantity > 0 && product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    if (quantity === 0) {
      sampleCartItems.splice(itemIndex, 1);
    } else {
      sampleCartItems[itemIndex].quantity = quantity;
      sampleCartItems[itemIndex].price = product.price * quantity;
    }

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

export async function DELETE(request: NextRequest) {
  try {
    await mockApiDelay(500);

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const itemIndex = sampleCartItems.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    sampleCartItems.splice(itemIndex, 1);

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

