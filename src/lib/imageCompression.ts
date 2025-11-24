/**
 * Image Compression Utility
 * Compresses images to maximum 200KB while maintaining quality
 */

import sharp from 'sharp';

const MAX_SIZE_KB = 200;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

export interface CompressionOptions {
  maxSizeKB?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

/**
 * Compress image buffer to maximum 200KB
 * @param inputBuffer - Image buffer to compress
 * @param options - Compression options
 * @returns Compressed image buffer
 */
export async function compressImage(
  inputBuffer: Buffer,
  options: CompressionOptions = {}
): Promise<Buffer> {
  const maxSizeBytes = (options.maxSizeKB || MAX_SIZE_KB) * 1024;
  const targetFormat = options.format || 'jpeg';
  let quality = options.quality || 85;

  try {
    // Get image metadata
    const metadata = await sharp(inputBuffer).metadata();
    const originalSize = inputBuffer.length;

    // If image is already under limit, return as is
    if (originalSize <= maxSizeBytes) {
      console.log(`[ImageCompression] Image already under ${MAX_SIZE_KB}KB (${(originalSize / 1024).toFixed(2)}KB), skipping compression`);
      return inputBuffer;
    }

    console.log(`[ImageCompression] Compressing image from ${(originalSize / 1024).toFixed(2)}KB to max ${MAX_SIZE_KB}KB`);

    // Start compression with optimal settings
    let compressedBuffer: Buffer;
    let currentSize = originalSize;
    let attempts = 0;
    const maxAttempts = 15;

    // Start with reasonable quality
    quality = 80;
    let minQuality = 30;
    let maxQuality = 90;

    // Determine optimal max width based on original size
    let maxWidth = 2000;
    if (metadata.width) {
      if (originalSize > 5 * 1024 * 1024) { // > 5MB
        maxWidth = 1200;
      } else if (originalSize > 2 * 1024 * 1024) { // > 2MB
        maxWidth = 1500;
      } else if (originalSize > 1024 * 1024) { // > 1MB
        maxWidth = 1800;
      }
    }

    while (currentSize > maxSizeBytes && attempts < maxAttempts) {
      attempts++;
      
      // Create sharp instance
      let sharpInstance = sharp(inputBuffer);

      // Resize if needed (maintain aspect ratio)
      if (metadata.width && metadata.width > maxWidth) {
        sharpInstance = sharpInstance.resize(maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      // Convert and compress - always use JPEG for best compression
      compressedBuffer = await sharpInstance
        .jpeg({ 
          quality, 
          mozjpeg: true,
          progressive: true,
        })
        .toBuffer();

      currentSize = compressedBuffer.length;
      console.log(`[ImageCompression] Attempt ${attempts}: Quality ${quality}, Width ${maxWidth}, Size: ${(currentSize / 1024).toFixed(2)}KB`);

      // If we're within target, accept it
      if (currentSize <= maxSizeBytes) {
        break;
      }

      // Binary search for optimal quality
      if (currentSize > maxSizeBytes) {
        maxQuality = quality;
        quality = Math.floor((minQuality + maxQuality) / 2);
      } else {
        minQuality = quality;
        quality = Math.floor((minQuality + maxQuality) / 2);
      }

      // If quality difference is too small, reduce width
      if (maxQuality - minQuality < 5 && currentSize > maxSizeBytes) {
        maxWidth = Math.max(800, maxWidth - 200);
        quality = 75; // Reset quality
        minQuality = 30;
        maxQuality = 90;
      }
    }

    // Final check - if still too large, apply more aggressive compression
    if (currentSize > maxSizeBytes) {
      console.log(`[ImageCompression] Final size still too large (${(currentSize / 1024).toFixed(2)}KB), applying aggressive compression`);
      
      // Progressively reduce size
      let aggressiveWidth = 1000;
      let aggressiveQuality = 50;
      
      while (currentSize > maxSizeBytes && aggressiveWidth >= 600) {
        let sharpInstance = sharp(inputBuffer);
        
        // Resize aggressively
        if (metadata.width && metadata.width > aggressiveWidth) {
          sharpInstance = sharpInstance.resize(aggressiveWidth, null, {
            withoutEnlargement: true,
            fit: 'inside',
          });
        }

        // Use lower quality
        compressedBuffer = await sharpInstance
          .jpeg({ 
            quality: aggressiveQuality, 
            mozjpeg: true,
            progressive: true,
          })
          .toBuffer();

        currentSize = compressedBuffer.length;
        console.log(`[ImageCompression] Aggressive: Width ${aggressiveWidth}, Quality ${aggressiveQuality}, Size: ${(currentSize / 1024).toFixed(2)}KB`);
        
        if (currentSize <= maxSizeBytes) {
          break;
        }
        
        // Reduce further
        aggressiveWidth -= 100;
        aggressiveQuality = Math.max(30, aggressiveQuality - 5);
      }
    }

    const finalSizeKB = (compressedBuffer.length / 1024).toFixed(2);
    console.log(`[ImageCompression] Successfully compressed to ${finalSizeKB}KB (${((compressedBuffer.length / originalSize) * 100).toFixed(1)}% of original)`);

    return compressedBuffer;
  } catch (error) {
    console.error('[ImageCompression] Error compressing image:', error);
    // If compression fails, return original buffer
    return inputBuffer;
  }
}

/**
 * Compress image from File object
 * @param file - File object to compress
 * @param options - Compression options
 * @returns Compressed File object
 */
export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress the image
    const compressedBuffer = await compressImage(buffer, options);

    // Determine output format
    const targetFormat = options.format || 'jpeg';
    const mimeType = targetFormat === 'webp' ? 'image/webp' : 
                     targetFormat === 'png' ? 'image/png' : 
                     'image/jpeg';
    
    const extension = targetFormat === 'webp' ? '.webp' :
                     targetFormat === 'png' ? '.png' :
                     '.jpg';

    // Create new File object with compressed data
    const blob = new Blob([compressedBuffer], { type: mimeType });
    const fileName = file.name.replace(/\.[^/.]+$/, '') + extension;
    
    return new File([blob], fileName, { type: mimeType });
  } catch (error) {
    console.error('[ImageCompression] Error compressing file:', error);
    // Return original file if compression fails
    return file;
  }
}

