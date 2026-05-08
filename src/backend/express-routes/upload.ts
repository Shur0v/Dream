/**
 * Image Upload Express Route
 * Handles file uploads for images
 */

import { Router, Request, Response } from 'express';
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

// Manual file parsing (without multer dependency)
interface ParsedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

async function parseMultipartForm(req: Request): Promise<ParsedFile | null> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let boundary = '';
    let contentType = req.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
      return reject(new Error('Content-Type must be multipart/form-data'));
    }

    boundary = contentType.split('boundary=')[1] || '';
    if (!boundary) {
      return reject(new Error('Invalid multipart form data'));
    }

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundaryBuffer = Buffer.from(`--${boundary}`);
        
        // Manual split by boundary
        const parts: Buffer[] = [];
        let start = 0;
        while (true) {
          const index = buffer.indexOf(boundaryBuffer, start);
          if (index === -1) {
            if (start < buffer.length) {
              parts.push(buffer.slice(start));
            }
            break;
          }
          if (index > start) {
            parts.push(buffer.slice(start, index));
          }
          start = index + boundaryBuffer.length;
        }

        for (const part of parts) {
          const headerEnd = part.indexOf('\r\n\r\n');
          if (headerEnd === -1) continue;

          const headers = part.slice(0, headerEnd).toString();
          if (!headers.includes('Content-Disposition: form-data')) continue;
          if (!headers.includes('name="file"')) continue;

          const contentStart = headerEnd + 4;
          const contentEnd = part.lastIndexOf('\r\n');
          const fileContent = part.slice(contentStart, contentEnd);

          const filenameMatch = headers.match(/filename="([^"]+)"/);
          const filename = filenameMatch ? filenameMatch[1] : 'image.jpg';

          const mimetypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
          const mimetype = mimetypeMatch ? mimetypeMatch[1].trim() : 'image/jpeg';

          resolve({
            buffer: fileContent,
            originalname: filename,
            mimetype,
            size: fileContent.length,
          });
          return;
        }

        reject(new Error('No file found in form data'));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

/**
 * POST /api/upload-image
 * Upload and compress image
 */
router.post('/upload-image', async (req: Request, res: Response) => {
  try {
    const file = await parseMultipartForm(req);

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type',
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      });
    }

    console.log(`[UploadImage] Original image size: ${(file.buffer.length / 1024).toFixed(2)}KB`);

    // Compress image to max 200KB and force WebP output
    const maxSizeBytes = 200 * 1024; // 200KB
    let quality = 85;
    let compressedBuffer: Buffer;

    do {
      compressedBuffer = await sharp(file.buffer)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      if (compressedBuffer.length <= maxSizeBytes || quality <= 50) {
        break;
      }
      quality -= 10;
    } while (quality > 50);

    console.log(`[UploadImage] Compressed image size: ${(compressedBuffer.length / 1024).toFixed(2)}KB`);

    // Generate filename
    const extension = '.webp';
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
      message: 'Image uploaded and converted to WebP successfully',
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
