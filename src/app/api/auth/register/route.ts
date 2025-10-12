/**
 * @fileoverview User registration API route
 * Handles new user registration with role selection
 * 
 * @description This endpoint:
 * - Validates registration data
 * - Checks for existing users
 * - Creates new user account
 * - Returns authentication tokens
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { sampleUsers, mockApiDelay } from '@/lib/dummyData';

/**
 * Register API endpoint
 * 
 * @description Creates new user account with provided information
 * Validates all required fields and checks for duplicates
 * 
 * @param request - NextRequest containing registration data
 * @returns NextResponse with registration result
 */
export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(1500); // Simulate API delay
    
    const body = await request.json();
    const { firstName, lastName, email, phone, password, role } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['client', 'seller', 'reseller'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = sampleUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Create new user (in real app, save to database)
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

    // Generate mock JWT token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${newUser.id}-${Date.now()}`;

    // Return success response
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
