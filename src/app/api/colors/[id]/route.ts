/**
 * @fileoverview Single Color API route
 * Handles individual color operations
 * 
 * @description This file provides:
 * - GET /api/colors/[id] - Get single color details
 * - PUT /api/colors/[id] - Update color (admin only)
 * - DELETE /api/colors/[id] - Delete color (admin only)
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getColorById, saveColor, deleteColor, getColors } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Color } from '@/types';

/**
 * Get single color
 * 
 * @description Returns detailed information about a specific color
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing color ID
 * @returns NextResponse with color details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300); // Simulate API delay
    
    const { id } = await params;

    // Find color by ID
    const color = await getColorById(id);
    
    if (!color) {
      return NextResponse.json(
        { success: false, error: 'Color not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: color,
      message: 'Color retrieved successfully',
    });

  } catch (error) {
    console.error('Get color error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update color
 * 
 * @description Updates existing color (admin only)
 * 
 * @param request - NextRequest containing update data
 * @param params - Route parameters containing color ID
 * @returns NextResponse with updated color
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { name, hexCode, isActive } = body;

    // Find color
    const existingColor = await getColorById(id);
    
    if (!existingColor) {
      return NextResponse.json(
        { success: false, error: 'Color not found' },
        { status: 404 }
      );
    }

    // Validate hex code if provided
    if (hexCode) {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(hexCode)) {
        return NextResponse.json(
          { success: false, error: 'Invalid hex code format. Use #RRGGBB or #RGB' },
          { status: 400 }
        );
      }
    }

    // Check if name already exists (if changed)
    if (name && name.toLowerCase() !== existingColor.name.toLowerCase()) {
      const allColors = await getColors();
      const nameExists = allColors.some(c => 
        c.name.toLowerCase() === name.toLowerCase() && c.id !== id
      );
      if (nameExists) {
        return NextResponse.json(
          { success: false, error: 'Color with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Update color
    const updatedColor: Color = {
      ...existingColor,
      ...(name && { name }),
      ...(hexCode && { hexCode: hexCode.toUpperCase() }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date().toISOString(),
    };

    // Update in database
    await saveColor(updatedColor);

    return NextResponse.json({
      success: true,
      data: updatedColor,
      message: 'Color updated successfully',
    });

  } catch (error) {
    console.error('Update color error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete color
 * 
 * @description Soft deletes color by setting isActive to false (admin only)
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing color ID
 * @returns NextResponse with deletion result
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Soft delete color
    const deletedColor = await deleteColor(id);
    
    if (!deletedColor) {
      return NextResponse.json(
        { success: false, error: 'Color not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedColor,
      message: 'Color deleted successfully',
    });

  } catch (error) {
    console.error('Delete color error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

