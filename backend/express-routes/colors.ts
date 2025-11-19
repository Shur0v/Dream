/**
 * Colors Express Routes
 */

import { Router, Request, Response } from 'express';
import {
  getColors,
  getColorById,
  saveColor,
  deleteColor,
} from '../express-lib/db';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/colors
 * Get all colors
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const includeInactive = req.query.includeInactive === 'true';
    const allColors = await getColors();
    const filteredColors = includeInactive
      ? allColors
      : allColors.filter(color => color.isActive);

    filteredColors.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: filteredColors,
      message: 'Colors retrieved successfully',
    });
  } catch (error) {
    console.error('Get colors error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/colors/:id
 * Get single color by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(300);

    const { id } = req.params;
    const color = await getColorById(id);

    if (!color) {
      return res.status(404).json({
        success: false,
        error: 'Color not found',
      });
    }

    res.json({
      success: true,
      data: color,
      message: 'Color retrieved successfully',
    });
  } catch (error) {
    console.error('Get color error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/colors
 * Create new color
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { name, hexCode } = req.body;

    if (!name || !hexCode) {
      return res.status(400).json({
        success: false,
        error: 'Color name and hex code are required',
      });
    }

    // Validate hex code format
    const hexRegex = /^#([0-9a-f]{6})$/i;
    if (!hexRegex.test(hexCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid hex code format. Must be #RRGGBB',
      });
    }

    const newColor = {
      id: `color-${Date.now()}`,
      name: String(name).trim(),
      hexCode: String(hexCode).toUpperCase().trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveColor(newColor);

    res.status(201).json({
      success: true,
      data: newColor,
      message: 'Color created successfully',
    });
  } catch (error) {
    console.error('Create color error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

/**
 * PUT /api/colors/:id
 * Update color
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const existingColor = await getColorById(id);

    if (!existingColor) {
      return res.status(404).json({
        success: false,
        error: 'Color not found',
      });
    }

    const { name, hexCode, isActive } = req.body;

    if (hexCode) {
      const hexRegex = /^#([0-9a-f]{6})$/i;
      if (!hexRegex.test(hexCode)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid hex code format. Must be #RRGGBB',
        });
      }
    }

    const updatedColor = {
      ...existingColor,
      ...(name && { name: String(name).trim() }),
      ...(hexCode && { hexCode: String(hexCode).toUpperCase().trim() }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      updatedAt: new Date().toISOString(),
    };

    await saveColor(updatedColor);

    res.json({
      success: true,
      data: updatedColor,
      message: 'Color updated successfully',
    });
  } catch (error) {
    console.error('Update color error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

/**
 * DELETE /api/colors/:id
 * Delete color (soft delete)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(600);

    const { id } = req.params;
    const deletedColor = await deleteColor(id);

    if (!deletedColor) {
      return res.status(404).json({
        success: false,
        error: 'Color not found',
      });
    }

    res.json({
      success: true,
      data: deletedColor,
      message: 'Color deleted successfully',
    });
  } catch (error) {
    console.error('Delete color error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

export default router;

