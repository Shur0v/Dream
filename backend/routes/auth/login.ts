import { NextRequest, NextResponse } from 'next/server';
import { mockApiDelay } from '@/lib/dummyData';
import { getUserByEmail, getUserById } from '@backend/lib/db';

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(1000);

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(String(email).trim().toLowerCase());
    const storedPassword = user ? (user as any).password : undefined;
    if (!user || !storedPassword || storedPassword !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = `token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
        },
        token,
        refreshToken,
      },
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(500);

    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    if (!token.startsWith('token-')) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const parts = token.split('-');
    const userId = parts.length >= 3 ? parts.slice(1, -1).join('-') : '';
    const user = userId ? await getUserById(userId) : undefined;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: 'User data retrieved successfully',
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

