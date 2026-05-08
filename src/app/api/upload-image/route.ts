import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import { compressImage } from '@/lib/imageCompression';
import sharp from 'sharp';
import { hasR2Config, uploadWebpToR2 } from '@/lib/r2';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
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
    const folderRaw = formData.get('folder');
    const folder =
      typeof folderRaw === 'string'
        ? folderRaw.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, 60) || 'general'
        : 'general';

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
    const imageBuffer = Buffer.from(arrayBuffer);
    
    console.log(`[UploadImage] Original image size: ${(imageBuffer.length / 1024).toFixed(2)}KB`);

    // Compress image, then normalize output to WebP
    const compressedBuffer = await compressImage(imageBuffer, {
      maxSizeKB: 200,
      format: file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpeg',
    });
    const webpBuffer = await sharp(compressedBuffer).webp({ quality: 82 }).toBuffer();

    console.log(`[UploadImage] Compressed image size: ${(webpBuffer.length / 1024).toFixed(2)}KB`);

    const extension = '.webp';
    const sanitizedBase = path
      .basename(file.name, path.extname(file.name))
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .toLowerCase();
    const finalFileName = `${sanitizedBase}-${Date.now()}${extension}`;
    const objectName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${finalFileName}`;

    if (hasR2Config()) {
      const r2Key = `dreamshop/${objectName}`;
      const r2Url = await uploadWebpToR2(r2Key, webpBuffer);

      return NextResponse.json({
        success: true,
        data: {
          url: r2Url,
          pathname: r2Key,
          provider: 'cloudflare-r2',
        },
        message: 'Image uploaded and converted to WebP via Cloudflare R2',
      });
    }

    const uint8Array = new Uint8Array(webpBuffer);
    const compressedBlob = new Blob([uint8Array], { type: 'image/webp' });
    const compressedFile = new File([compressedBlob], finalFileName, { type: 'image/webp' });

    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_URL) {
      const blob = await put(objectName, compressedFile, {
        access: 'public',
      });

      console.log(`[UploadImage] Uploaded to Vercel Blob: ${(webpBuffer.length / 1024).toFixed(2)}KB`);

      return NextResponse.json({
        success: true,
        data: {
          url: blob.url,
          pathname: blob.pathname,
          provider: 'vercel-blob',
        },
        message: 'Image uploaded and converted to WebP via Vercel Blob',
      });
    }

    const url = await saveLocally(webpBuffer, finalFileName);

    return NextResponse.json({
      success: true,
      data: {
        url,
        pathname: url,
        provider: 'local',
      },
      message: 'Image uploaded and converted to WebP locally',
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

