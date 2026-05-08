import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@backend/lib/db';
import { ensureDatabaseReady, sql } from '@backend/lib/neon';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

interface WishlistPayload {
  id: string;
  userId: string;
  items: WishlistItem[];
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

function emptyWishlist(userId: string): WishlistPayload {
  const now = nowIso();
  return {
    id: `wishlist-${userId}`,
    userId,
    items: [],
    createdAt: now,
    updatedAt: now,
  };
}

async function readWishlist(userId: string): Promise<WishlistPayload> {
  await ensureDatabaseReady();
  const rows = await sql.query('SELECT data FROM wishlists WHERE user_id = $1 LIMIT 1', [userId]);
  const row = rows[0] as { data?: WishlistPayload } | undefined;
  return row?.data || emptyWishlist(userId);
}

async function writeWishlist(userId: string, wishlist: WishlistPayload): Promise<void> {
  await ensureDatabaseReady();
  await sql.query(
    `INSERT INTO wishlists (id, user_id, data, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [wishlist.id, userId, JSON.stringify(wishlist)]
  );
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const wishlist = await readWishlist(userId);
    return NextResponse.json({
      success: true,
      data: wishlist.items,
      message: 'Wishlist retrieved successfully',
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, error: 'Product not available' }, { status: 404 });
    }

    const wishlist = await readWishlist(userId);
    const exists = wishlist.items.some((item) => item.productId === productId);
    if (!exists) {
      wishlist.items.push({
        id: `wishlist-item-${Date.now()}`,
        productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder-image.png',
        addedAt: nowIso(),
      });
      wishlist.updatedAt = nowIso();
      await writeWishlist(userId, wishlist);
    }

    return NextResponse.json({
      success: true,
      data: wishlist.items,
      message: 'Item added to wishlist successfully',
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const productId = request.nextUrl.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const wishlist = await readWishlist(userId);
    const nextItems = wishlist.items.filter((item) => item.productId !== productId);
    wishlist.items = nextItems;
    wishlist.updatedAt = nowIso();
    await writeWishlist(userId, wishlist);

    return NextResponse.json({
      success: true,
      data: wishlist.items,
      message: 'Item removed from wishlist successfully',
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

