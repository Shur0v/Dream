import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function saveLocally(file: File, filename: string) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
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
        { success: false, error: 'File exceeds 5MB limit' },
        { status: 413 }
      );
    }

    const extension = path.extname(file.name) || '.bin';
    const sanitizedBase = path
      .basename(file.name, extension)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .toLowerCase();
    const finalFileName = `${sanitizedBase}${extension}`;
    const objectName = `product-media/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${finalFileName}`;

    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_URL) {
      const blob = await put(objectName, file, {
        access: 'public',
      });

      return NextResponse.json({
        success: true,
        data: {
          url: blob.url,
          pathname: blob.pathname,
        },
        message: 'Image uploaded successfully via Vercel Blob',
      });
    }

    const url = await saveLocally(file, finalFileName);

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

