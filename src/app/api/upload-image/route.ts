import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import { compressImage } from '@/lib/imageCompression';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB (allow large uploads, will compress to 200KB)
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function saveLocally(buffer: Buffer, filename: string) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const targetPath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(targetPath, buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type' },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 413 }
      );
    }

    // Convert File to Buffer for compression
    const arrayBuffer = await file.arrayBuffer();
    let imageBuffer = Buffer.from(arrayBuffer);
    
    console.log(`[UploadImage] Original image size: ${(imageBuffer.length / 1024).toFixed(2)}KB`);

    // Compress image to max 200KB
    imageBuffer = await compressImage(imageBuffer, {
      maxSizeKB: 200,
      format: file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpeg',
    });

    console.log(`[UploadImage] Compressed image size: ${(imageBuffer.length / 1024).toFixed(2)}KB`);

    // Determine file extension based on compressed format (use JPEG for best compression)
    const extension = '.jpg'; // Always use JPEG for compressed images
    const sanitizedBase = path
      .basename(file.name, path.extname(file.name))
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .toLowerCase();
    const finalFileName = `${sanitizedBase}-${Date.now()}${extension}`;
    const objectName = `product-media/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${finalFileName}`;

    // Create compressed File/Blob for Vercel Blob upload
    const compressedBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    const compressedFile = new File([compressedBlob], finalFileName, { type: 'image/jpeg' });

    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_URL) {
      const blob = await put(objectName, compressedFile, {
        access: 'public',
      });

      console.log(`[UploadImage] Uploaded to Vercel Blob: ${(imageBuffer.length / 1024).toFixed(2)}KB`);

      return NextResponse.json({
        success: true,
        data: {
          url: blob.url,
          pathname: blob.pathname,
        },
        message: 'Image uploaded and compressed successfully via Vercel Blob',
      });
    }

    const url = await saveLocally(imageBuffer, finalFileName);

    return NextResponse.json({
      success: true,
      data: {
        url,
        pathname: url,
      },
      message: 'Image uploaded locally (Blob not configured)',
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to upload image';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

