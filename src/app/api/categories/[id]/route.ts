/**
 * @fileoverview Single Category API route
 * Handles individual category operations
 * 
 * @description This file provides:
 * - GET /api/categories/[id] - Get single category details
 * - PUT /api/categories/[id] - Update category (admin only)
 * - DELETE /api/categories/[id] - Delete category (admin only)
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCategoryById, getCategoryBySlug, saveCategory, deleteCategory, getCategories } from '@/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Category } from '@/types';

/**
 * Get single category
 * 
 * @description Returns detailed information about a specific category
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing category ID
 * @returns NextResponse with category details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300); // Simulate API delay
    
    const { id } = await params;

    // Find category by ID or slug
    let category = await getCategoryById(id);
    if (!category) {
      category = await getCategoryBySlug(id);
    }
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category retrieved successfully',
    });

  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update category
 * 
 * @description Updates existing category (admin only)
 * 
 * @param request - NextRequest containing update data
 * @param params - Route parameters containing category ID
 * @returns NextResponse with updated category
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
    const { name, slug, description, image, parentId, isActive } = body;

    // Find category
    const existingCategory = await getCategoryById(id);
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists (if changed)
    if (slug && slug !== existingCategory.slug) {
      const allCategories = await getCategories();
      const slugExists = allCategories.some(cat => cat.slug === slug && cat.id !== id);
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update category
    const updatedCategory: Category = {
      ...existingCategory,
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(parentId !== undefined && { parentId }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date().toISOString(),
    };

    // Update in database
    await saveCategory(updatedCategory);

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });

  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete category
 * 
 * @description Soft deletes category by setting isActive to false (admin only)
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing category ID
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

    // Soft delete category
    const deletedCategory = await deleteCategory(id);
    
    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedCategory,
      message: 'Category deleted successfully',
    });

  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

