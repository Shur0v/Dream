/**
 * @fileoverview Colors API route
 * Handles color management for both admin and client
 * 
 * @description This file provides:
 * - GET /api/colors - List all colors
 * - POST /api/colors - Create new color (admin only)
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getColors, saveColor } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Color } from '@/types';

/**
 * Get all colors
 * 
 * @description Returns list of all active colors
 * Used by client site for product color filtering and selection
 * 
 * @param request - NextRequest with optional query parameters
 * @returns NextResponse with colors list
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(300); // Simulate API delay
    
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const allColors = await getColors();
    let filteredColors = includeInactive 
      ? allColors 
      : allColors.filter(color => color.isActive);

    // Sort by name
    filteredColors.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      data: filteredColors,
      message: 'Colors retrieved successfully',
    });

  } catch (error) {
    console.error('Get colors error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create new color
 * 
 * @description Creates a new color option (admin only)
 * Validates color data and creates new color entry
 * 
 * @param request - NextRequest containing color data
 * @returns NextResponse with created color
 */
export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(600); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || user.role !== 'super-admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const body = await request.json();
    const { name, hexCode } = body;

    // Validate required fields
    if (!name || !hexCode) {
      return NextResponse.json(
        { success: false, error: 'Name and hexCode are required' },
        { status: 400 }
      );
    }

    // Validate hex code format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hex code format. Use #RRGGBB or #RGB' },
        { status: 400 }
      );
    }

    // Check if color name already exists
    const allColors = await getColors();
    const nameExists = allColors.some(color => 
      color.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      return NextResponse.json(
        { success: false, error: 'Color with this name already exists' },
        { status: 400 }
      );
    }

    // Create new color
    const newColor: Color = {
      id: `color-${Date.now()}`,
      name,
      hexCode: hexCode.toUpperCase(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to database
    await saveColor(newColor);

    return NextResponse.json({
      success: true,
      data: newColor,
      message: 'Color created successfully',
    });

  } catch (error) {
    console.error('Create color error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

