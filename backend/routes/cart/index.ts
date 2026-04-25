import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@backend/lib/db';
import { ensureDatabaseReady, sql } from '@backend/lib/neon';

interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  images?: string[];
}

interface CartItem {
  id: string;
  productId: string;
  product: CartProduct;
  quantity: number;
  price: number;
  addedAt: string;
}

interface CartPayload {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

const nowIso = () => new Date().toISOString();

function getUserId(request: NextRequest): string {
  const explicit = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId');
  if (explicit) return explicit;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer token-')) {
    const token = authHeader.substring(7);
    const parts = token.split('-');
    if (parts.length >= 3) {
      return parts.slice(1, -1).join('-');
    }
  }

  return 'guest-user';
}

function emptyCart(userId: string): CartPayload {
  const now = nowIso();
  return {
    id: `cart-${userId}`,
    userId,
    items: [],
    totalItems: 0,
    totalPrice: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  return { totalItems, totalPrice };
}

async function readCart(userId: string): Promise<CartPayload> {
  await ensureDatabaseReady();
  const rows = await sql.query('SELECT data FROM carts WHERE user_id = $1 LIMIT 1', [userId]);
  const row = rows[0] as { data?: CartPayload } | undefined;
  return row?.data || emptyCart(userId);
}

async function writeCart(userId: string, cart: CartPayload): Promise<void> {
  await ensureDatabaseReady();
  await sql.query(
    `INSERT INTO carts (id, user_id, data, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [cart.id, userId, JSON.stringify(cart)]
  );
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const cart = await readCart(userId);

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Cart retrieved successfully',
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }
    if (quantity <= 0) {
      return NextResponse.json({ success: false, error: 'Quantity must be greater than 0' }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, error: 'Product not available' }, { status: 404 });
    }

    const cart = await readCart(userId);
    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingItemIndex >= 0) {
      const nextQty = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < nextQty) {
        return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
      }
      cart.items[existingItemIndex].quantity = nextQty;
      cart.items[existingItemIndex].price = product.price * nextQty;
    } else {
      if (product.stock < quantity) {
        return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
      }
      cart.items.push({
        id: `cart-item-${Date.now()}`,
        productId,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          isActive: product.isActive,
          images: product.images,
        },
        quantity,
        price: product.price * quantity,
        addedAt: nowIso(),
      });
    }

    const totals = calculateTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;
    cart.updatedAt = nowIso();

    await writeCart(userId, cart);

    return NextResponse.json({
      success: true,
      data: { items: cart.items, totalItems: cart.totalItems, totalPrice: cart.totalPrice },
      message: 'Item added to cart successfully',
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json({ success: false, error: 'Product ID and quantity are required' }, { status: 400 });
    }
    if (quantity < 0) {
      return NextResponse.json({ success: false, error: 'Quantity cannot be negative' }, { status: 400 });
    }

    const cart = await readCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.productId === productId);
    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: 'Item not found in cart' }, { status: 404 });
    }

    const product = await getProductById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, error: 'Product not available' }, { status: 404 });
    }

    if (quantity > 0 && product.stock < quantity) {
      return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price * quantity;
      cart.items[itemIndex].product.stock = product.stock;
      cart.items[itemIndex].product.isActive = product.isActive;
    }

    const totals = calculateTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;
    cart.updatedAt = nowIso();

    await writeCart(userId, cart);

    return NextResponse.json({
      success: true,
      data: { items: cart.items, totalItems: cart.totalItems, totalPrice: cart.totalPrice },
      message: 'Cart updated successfully',
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const cart = await readCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.productId === productId);
    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: 'Item not found in cart' }, { status: 404 });
    }

    cart.items.splice(itemIndex, 1);
    const totals = calculateTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;
    cart.updatedAt = nowIso();
    await writeCart(userId, cart);

    return NextResponse.json({
      success: true,
      data: { items: cart.items, totalItems: cart.totalItems, totalPrice: cart.totalPrice },
      message: 'Item removed from cart successfully',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
