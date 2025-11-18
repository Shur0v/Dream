import { NextRequest, NextResponse } from 'next/server';
import { getColorById, saveColor, deleteColor, getColors } from '@backend/lib/db';
import { mockApiDelay } from '@/lib/dummyData';
import { Color } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mockApiDelay(300);

    const { id } = await params;
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
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
    const { name, hexCode, isActive } = body;

    const existingColor = await getColorById(id);

    if (!existingColor) {
      return NextResponse.json(
        { success: false, error: 'Color not found' },
        { status: 404 }
      );
    }

    if (hexCode) {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(hexCode)) {
        return NextResponse.json(
          { success: false, error: 'Invalid hex code format. Use #RRGGBB or #RGB' },
          { status: 400 }
        );
      }
    }

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

    const updatedColor: Color = {
      ...existingColor,
      ...(name && { name }),
      ...(hexCode && { hexCode: hexCode.toUpperCase() }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date().toISOString(),
    };

    await saveColor(updatedColor);

    return NextResponse.json({
      success: true,
      data: updatedColor,
      message: 'Color updated successfully',
    });

  } catch (error) {
    console.error('Update color error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

