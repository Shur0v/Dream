import { NextRequest, NextResponse } from 'next/server';
import {
  getCategoryById,
  getCategoryBySlug,
  saveCategory,
  deleteCategory,
  getCategories
} from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Category } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300);

    const { id } = await params;

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(600);

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image, parentId, isActive } = body;

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(600);

    const { id } = await params;
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

