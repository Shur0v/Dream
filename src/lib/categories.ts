import { Category } from '@/types';
import { getApiUrl } from './apiConfig';

type FetchCategoriesOptions = {
  includeInactive?: boolean;
  limit?: number;
  bypassCache?: boolean;
  signal?: AbortSignal;
};

type CategoriesCacheEntry = {
  key: string;
  data: Category[];
  timestamp: number;
};

const CACHE_TTL = 60 * 1000; // 1 minute
let categoriesCache: CategoriesCacheEntry | null = null;

const buildCacheKey = (options: FetchCategoriesOptions): string => {
  const { includeInactive = false, limit } = options;
  return `${includeInactive}-${limit ?? 'all'}`;
};

const buildQuerySuffix = (options: FetchCategoriesOptions): string => {
  const params = new URLSearchParams();
  if (options.includeInactive) {
    params.set('includeInactive', 'true');
  }
  if (typeof options.limit === 'number') {
    params.set('limit', options.limit.toString());
  }
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const clearCategoriesCache = () => {
  categoriesCache = null;
};

export async function fetchCategories(
  options: FetchCategoriesOptions = {}
): Promise<Category[]> {
  const cacheKey = buildCacheKey(options);
  const now = Date.now();

  if (
    !options.bypassCache &&
    categoriesCache &&
    categoriesCache.key === cacheKey &&
    now - categoriesCache.timestamp < CACHE_TTL
  ) {
    return categoriesCache.data;
  }

  const suffix = buildQuerySuffix(options);
  const endpoints = [getApiUrl(`categories${suffix}`), `/api/categories${suffix}`];
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { signal: options.signal });
      if (!response.ok) {
        const message = `Failed to load categories (${response.status})`;
        lastError = new Error(message);
        continue;
      }

      const result = await response.json();
      if (!result?.success || !Array.isArray(result.data)) {
        lastError = new Error(result?.error || 'Invalid categories response');
        continue;
      }

      categoriesCache = {
        key: cacheKey,
        data: result.data as Category[],
        timestamp: now,
      };

      return result.data as Category[];
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('Unknown categories error');
    }
  }

  throw lastError ?? new Error('Unable to load categories');
}

