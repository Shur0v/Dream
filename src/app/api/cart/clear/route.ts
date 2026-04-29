import { NextRequest, NextResponse } from 'next/server';
import { ensureDatabaseReady, sql } from '@backend/lib/neon';

const getUserId = (request: NextRequest): string => {
  const explicit = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId');
  if (explicit) return explicit;
  return 'guest-user';
};

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    await ensureDatabaseReady();
    await sql.query(
      `UPDATE carts
       SET data = jsonb_set(
         jsonb_set(
           jsonb_set(data, '{items}', '[]'::jsonb, true),
           '{totalItems}',
           '0'::jsonb,
           true
         ),
         '{totalPrice}',
         '0'::jsonb,
         true
       ),
       updated_at = NOW()
       WHERE user_id = $1`,
      [userId]
    );
    return NextResponse.json({
      success: true,
      data: { items: [], totalItems: 0, totalPrice: 0 },
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

