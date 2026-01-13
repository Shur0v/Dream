/**
 * Image Upload Express Route
 * Handles file uploads for images
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

const router = Router();

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

/**
 * POST /api/upload-image
 * Upload and compress image
 */
router.post('/upload-image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    const file = req.file;
    console.log(`[UploadImage] Original image size: ${(file.buffer.length / 1024).toFixed(2)}KB`);

    // Compress image to max 200KB using sharp
    const maxSizeBytes = 200 * 1024; // 200KB
    let quality = 85;
    let compressedBuffer: Buffer;

    do {
      compressedBuffer = await sharp(file.buffer)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality, progressive: true })
        .toBuffer();

      if (compressedBuffer.length <= maxSizeBytes || quality <= 50) {
        break;
      }
      quality -= 10;
    } while (quality > 50);

    console.log(`[UploadImage] Compressed image size: ${(compressedBuffer.length / 1024).toFixed(2)}KB`);

    // Generate filename
    const extension = '.jpg';
    const sanitizedBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .toLowerCase();
    const finalFileName = `${sanitizedBase}-${Date.now()}${extension}`;

    // Save locally
    await ensureUploadDir();
    const targetPath = path.join(UPLOAD_DIR, finalFileName);
    await fs.writeFile(targetPath, compressedBuffer);

    const url = `/uploads/${finalFileName}`;

    return res.json({
      success: true,
      data: {
        url,
        pathname: url,
      },
      message: 'Image uploaded and compressed successfully',
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
});

export default router;
