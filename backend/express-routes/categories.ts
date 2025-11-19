/**
 * Categories Express Routes
 */

import { Router, Request, Response } from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  saveCategory,
  deleteCategory,
} from '../express-lib/db';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/categories
 * Get all categories
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const includeInactive = req.query.includeInactive === 'true';
    const allCategories = await getCategories();
    const filteredCategories = includeInactive
      ? allCategories
      : allCategories.filter(cat => cat.isActive);

    filteredCategories.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: filteredCategories,
      message: 'Categories retrieved successfully',
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/categories/:id
 * Get single category by ID or slug
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const { id } = req.params;
    let category = await getCategoryById(id);

    if (!category) {
      category = await getCategoryBySlug(id);
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
      message: 'Category retrieved successfully',
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/categories
 * Create new category
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { name, description, image, parentId } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required',
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: String(name).trim(),
      slug,
      description: description ? String(description).trim() : undefined,
      image: image ? String(image).trim() : undefined,
      parentId: parentId ? String(parentId).trim() : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCategory(newCategory);

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Create category error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

/**
 * PUT /api/categories/:id
 * Update category
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const { name, description, image, parentId, isActive } = req.body;

    const updatedCategory = {
      ...existingCategory,
      ...(name && { name: String(name).trim() }),
      ...(description !== undefined && { description: String(description).trim() }),
      ...(image !== undefined && { image: String(image).trim() }),
      ...(parentId !== undefined && { parentId: String(parentId).trim() }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      updatedAt: new Date().toISOString(),
    };

    // Update slug if name changed
    if (name) {
      updatedCategory.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    await saveCategory(updatedCategory);

    res.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Update category error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

/**
 * DELETE /api/categories/:id
 * Delete category (soft delete)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const deletedCategory = await deleteCategory(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: deletedCategory,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

export default router;

