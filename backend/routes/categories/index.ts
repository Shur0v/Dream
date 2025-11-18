import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategory } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Category } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await mockApiDelay(400);

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const allCategories = await getCategories();
    const filteredCategories = includeInactive
      ? allCategories
      : allCategories.filter(cat => cat.isActive);

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

export async function POST(request: NextRequest) {
  try {
    await mockApiDelay(800);

    const body = await request.json();
    const { name, slug, description, image, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const allCategories = await getCategories();
    const slugExists = allCategories.some(cat => cat.slug === slug);
    if (slugExists) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

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

