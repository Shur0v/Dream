/**
 * @fileoverview Authentication API routes for login and registration
 * Handles user authentication, registration, and session management
 * 
 * @description This file provides:
 * - POST /api/auth/login - User login
 * - POST /api/auth/register - User registration
 * - POST /api/auth/logout - User logout
 * - POST /api/auth/refresh - Token refresh
 * - GET /api/auth/me - Get current user
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { sampleUsers, mockApiDelay } from '@/lib/dummyData';

/**
 * Login API endpoint
 * 
 * @description Authenticates user with email and password
 * Returns JWT token and user data on success
 * 
 * @param request - NextRequest containing login credentials
 * @returns NextResponse with authentication result
 */
export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(1000); // Simulate API delay
    
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in sample data
    const user = sampleUsers.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Mock password validation (in real app, use bcrypt)
    if (password !== 'password123') {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

    // Return success response
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

/**
 * Get current user API endpoint
 * 
 * @description Returns current authenticated user data
 * Validates JWT token and returns user information
 * 
 * @param request - NextRequest with authorization header
 * @returns NextResponse with user data
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(500); // Simulate API delay
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Mock token validation (in real app, verify JWT)
    if (!token.startsWith('mock-jwt-token-')) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Extract user ID from mock token
    const userId = token.split('-')[3];
    const user = sampleUsers.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
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
