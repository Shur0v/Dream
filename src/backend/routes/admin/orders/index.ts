import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getProductById, saveOrder } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import type { OrderStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(800);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const allOrders = await getOrders();
    let filteredOrders = [...allOrders];

    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.userId.toLowerCase().includes(searchLower) ||
        order.items.some(item =>
          item.product?.name?.toLowerCase().includes(searchLower)
        )
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) >= start
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) <= end
      );
    }

    filteredOrders.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
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

    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: 'Orders retrieved successfully',
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

type ManualOrderItemInput = {
  productId: string;
  quantity?: number;
  color?: string;
  size?: string;
};

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(300);
    const body = await request.json();

    const customerInfo = body?.customerInfo ?? {};
    const itemsInput: ManualOrderItemInput[] = Array.isArray(body?.items) ? body.items : [];
    const statusInput = String(body?.status || 'approved').toLowerCase();
    const status: OrderStatus =
      statusInput === 'pending' ||
      statusInput === 'confirmed' ||
      statusInput === 'approved' ||
      statusInput === 'rejected' ||
      statusInput === 'shipped' ||
      statusInput === 'delivered' ||
      statusInput === 'cancelled' ||
      statusInput === 'refunded'
        ? (statusInput as OrderStatus)
        : 'approved';

    const customerName = String(customerInfo?.name || '').trim();
    const phoneNumber = String(customerInfo?.phoneNumber || '').trim();
    const district = String(customerInfo?.district || '').trim();
    const upazila = String(customerInfo?.upazila || '').trim();
    const thana = String(customerInfo?.thana || '').trim();
    const postOffice = String(customerInfo?.postOffice || '').trim();
    const email = String(customerInfo?.email || '').trim();

    if (!customerName || !phoneNumber || !district || !upazila || !thana || !postOffice) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, district, upazila, thana, and post office are required.' },
        { status: 400 }
      );
    }

    if (itemsInput.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one product is required.' },
        { status: 400 }
      );
    }

    const normalizedItems = [];
    let totalAmount = 0;

    for (let i = 0; i < itemsInput.length; i += 1) {
      const row = itemsInput[i];
      const product = await getProductById(String(row.productId || '').trim());
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${row.productId}` },
          { status: 404 }
        );
      }
      const quantity = Math.max(1, Math.floor(Number(row.quantity || 1)));
      const price = Number(product.price || 0);
      totalAmount += price * quantity;
      normalizedItems.push({
        id: `order-item-${Date.now()}-${i}`,
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price,
          images: product.images,
          category: product.category,
          brand: product.brand,
          sku: product.sku,
        },
        quantity,
        price,
        color: row.color ? String(row.color).trim() : undefined,
        size: row.size ? String(row.size).trim() : undefined,
      });
    }

    const now = new Date().toISOString();
    const newOrder = {
      id: `order-${Date.now()}`,
      userId: 'manual-admin-order',
      items: normalizedItems,
      status,
      totalAmount,
      shippingAddress: {
        street: thana,
        city: district,
        state: upazila,
        zipCode: postOffice,
        country: 'Bangladesh',
      },
      paymentMethod: String(body?.paymentMethod || 'Cash on Delivery'),
      paymentStatus: status === 'approved' || status === 'delivered' ? 'paid' : 'pending',
      notes: JSON.stringify({
        customerName,
        phoneNumber,
        email: email || '',
        district,
        upazila,
        thana,
        postOffice,
        manualOrder: true,
      }),
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    const saved = await saveOrder(newOrder as any);
    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Manual order created successfully',
    });
  } catch (error) {
    console.error('Create manual admin order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

