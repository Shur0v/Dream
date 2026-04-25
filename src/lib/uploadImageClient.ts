export interface UploadImageClientOptions {
  folder?: string;
  maxDimension?: number;
  quality?: number;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 45_000;

const getErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const json = await response.json();
      if (json?.error) return String(json.error);
      return `Upload failed with status ${response.status}`;
    } catch {
      return `Upload failed with status ${response.status}`;
    }
  }

  const text = await response.text();
  if (text.includes('413') || text.toLowerCase().includes('entity too large')) {
    return 'Image is too large for server limit. Please use a smaller file.';
  }
  return `Upload failed with status ${response.status}`;
};

export async function compressImageToWebP(
  file: File,
  {
    maxDimension = 2200,
    quality = 0.82,
  }: Pick<UploadImageClientOptions, 'maxDimension' | 'quality'> = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    const imageBitmap = await createImageBitmap(file);
    const ratio = Math.min(1, maxDimension / Math.max(imageBitmap.width, imageBitmap.height));
    const targetWidth = Math.max(1, Math.round(imageBitmap.width * ratio));
    const targetHeight = Math.max(1, Math.round(imageBitmap.height * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      imageBitmap.close();
      return file;
    }

    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    imageBitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );

    if (!blob) return file;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
  } catch {
    return file;
  }
}

export async function uploadImageClient(
  file: File,
  options: UploadImageClientOptions = {}
): Promise<string> {
  const compressed = await compressImageToWebP(file, options);
  const formData = new FormData();
  formData.append('file', compressed);
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Upload endpoint returned invalid response format');
    }

    const result = await response.json();
    if (!result?.success || !result?.data?.url) {
      throw new Error(result?.error || 'Failed to upload image');
    }

    return String(result.data.url);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Upload timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
