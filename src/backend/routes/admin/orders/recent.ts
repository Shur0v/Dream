import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(500);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const allOrders = await getOrders();
    let recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    if (status) {
      recentOrders = recentOrders.filter(order => order.status === status);
    }

    return NextResponse.json({
      success: true,
      data: recentOrders,
      message: 'Recent orders retrieved successfully',
    });

  } catch (error) {
    console.error('Get recent orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

