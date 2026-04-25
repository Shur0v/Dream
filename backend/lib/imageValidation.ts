export const isBase64Image = (value: string): boolean =>
  value.startsWith('data:image/') && value.includes('base64,');

export const isAllowedImageUrl = (value: string): boolean => {
  if (!value) return false;
  if (isBase64Image(value)) return false;
  if (value.startsWith('http://') || value.startsWith('https://')) return true;
  if (value.startsWith('/uploads/')) return true;
  return false;
};

export const validateImageField = (
  value: unknown,
  options: { allowEmpty?: boolean; fieldName: string }
): { valid: true; value: string } | { valid: false; error: string } => {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  if (!trimmed) {
    if (options.allowEmpty) return { valid: true, value: '' };
    return { valid: false, error: `${options.fieldName} is required` };
  }

  if (isBase64Image(trimmed)) {
    return { valid: false, error: `${options.fieldName} must be an uploaded image URL, not base64` };
  }

  if (!isAllowedImageUrl(trimmed)) {
    return { valid: false, error: `${options.fieldName} must be a valid URL` };
  }

  return { valid: true, value: trimmed };
};

export const validateImageList = (
  values: unknown,
  fieldName: string
): { valid: true; value: string[] } | { valid: false; error: string } => {
  if (!Array.isArray(values)) {
    return { valid: false, error: `${fieldName} must be an array` };
  }

  const sanitized: string[] = [];
  for (const item of values) {
    const result = validateImageField(item, { fieldName });
    if (!result.valid) return result;
    sanitized.push(result.value);
  }

  return { valid: true, value: sanitized };
};

