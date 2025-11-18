import { NextRequest, NextResponse } from 'next/server';
import { sampleUsers, mockApiDelay } from '@/lib/dummyData';

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(1500);

    const body = await request.json();
    const { firstName, lastName, email, phone, password, role } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const validRoles = ['client', 'seller', 'reseller'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    const existingUser = sampleUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      role,
      phone: phone || undefined,
      avatar: undefined,
      address: undefined,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${newUser.id}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          avatar: newUser.avatar,
          phone: newUser.phone,
          isEmailVerified: newUser.isEmailVerified,
        },
        token,
        refreshToken,
      },
      message: 'Registration successful',
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

