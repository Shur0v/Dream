/**
 * @fileoverview Categories API route
 * Handles category management for both admin and client
 * 
 * @description This file provides:
 * - GET /api/categories - List all categories
 * - POST /api/categories - Create new category (admin only)
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategory } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Category } from '@/types';

/**
 * Get all categories
 * 
 * @description Returns list of all active categories
 * Used by client site for navigation and product filtering
 * 
 * @param request - NextRequest with optional query parameters
 * @returns NextResponse with categories list
 */
export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(400); // Simulate API delay
    
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const allCategories = await getCategories();
    let filteredCategories = includeInactive 
      ? allCategories 
      : allCategories.filter(cat => cat.isActive);

    // Sort by name
    filteredCategories.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      data: filteredCategories,
      message: 'Categories retrieved successfully',
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create new category
 * 
 * @description Creates a new product category (admin only)
 * Validates category data and creates new category entry
 * 
 * @param request - NextRequest containing category data
 * @returns NextResponse with created category
 */
export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(800); // Simulate API delay
    
    // TODO: Add authentication check
    // const user = await authenticateUser(request);
    // if (!user || user.role !== 'super-admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const body = await request.json();
    const { name, slug, description, image, parentId } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const allCategories = await getCategories();
    const slugExists = allCategories.some(cat => cat.slug === slug);
    if (slugExists) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description: description || undefined,
      image: image || undefined,
      parentId: parentId || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to database
    await saveCategory(newCategory);

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    });

  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

