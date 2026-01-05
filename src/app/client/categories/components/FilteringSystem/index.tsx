'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { addToCart, CartItem } from '@/lib/userStorage';

/**
 * Complete Filtering System Component
 * Displays sidebar with search, category, brand, and size filters on the left
 * and product grid on the right with 3 products per row
 */
// Display Product type (converted from API Product)
type DisplayProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  image: string;
  category: string;
  brand: string;
  sizes: string[];
  rating: number;
  reviews: number;
  createdAt?: string;
};

export default function FilteringSystem() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandingOpen, setIsBrandingOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // drawer for <1320px

  // Data states
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [allSizes, setAllSizes] = useState<string[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(9);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Store raw products data
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [rawCategories, setRawCategories] = useState<any[]>([]);

  // Memoize products transformation
  const displayProducts = useMemo(() => {
    // Show all products from database (same as selleradmin)
    // Only filter out explicitly inactive products
    return rawProducts
      .filter((p: Product) => {
        // Show product if isActive is true or undefined (not explicitly false)
        return p.isActive !== false;
      })
      .map((p: Product) => {
        // Get first valid image from images array
        let productImage = '/placeholder-image.png';
        if (p.images && Array.isArray(p.images) && p.images.length > 0) {
          // Find first valid image (not empty, not null, not undefined)
          const validImage = p.images.find(img => img && typeof img === 'string' && img.trim().length > 0);
          if (validImage) {
            productImage = validImage.trim();
          }
        }
        
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          currency: '৳',
          image: productImage,
          category: p.category,
          brand: p.brand,
          sizes: p.size || [],
          rating: 4, // Default rating (can be added to Product type later)
          reviews: 0, // Default reviews (can be added to Product type later)
          createdAt: p.createdAt,
          updatedAt: p.updatedAt, // Include updatedAt for latest data tracking
        };
      });
  }, [rawProducts]);

  // Memoize brands extraction
  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(displayProducts.map(p => p.brand).filter(Boolean))).sort();
  }, [displayProducts]);

  // Memoize sizes extraction
  const allSizesList = useMemo(() => {
    const allSizesSet = new Set<string>();
    displayProducts.forEach(p => {
      p.sizes.forEach(size => allSizesSet.add(size));
    });
    return Array.from(allSizesSet).sort();
  }, [displayProducts]);

  // Memoize categories transformation
  const processedCategories = useMemo(() => {
    if (!rawCategories || !Array.isArray(rawCategories) || rawCategories.length === 0) {
      console.log('[FilteringSystem] No categories to process, rawCategories:', rawCategories);
      return [];
    }
    
    const processed = rawCategories
      .filter((c: any) => c && c.isActive !== false)
      .map((c: any) => ({ name: c.name, count: 0 }));
    
    console.log(`[FilteringSystem] Processed ${processed.length} categories from ${rawCategories.length} raw categories`);
    return processed;
  }, [rawCategories]);

  // Helper function to validate and sanitize image URL for Next.js Image component
  const getValidImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return '/placeholder-image.png';
    }
    
    const trimmed = imageUrl.trim();
    
    // Empty string or too short
    if (trimmed.length < 2) {
      return '/placeholder-image.png';
    }
    
    // Already a valid relative path starting with /
    if (trimmed.startsWith('/')) {
      return trimmed;
    }
    
    // Valid absolute URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    
    // Valid data URL
    if (trimmed.startsWith('data:')) {
      return trimmed;
    }

    // Invalid URL, return placeholder
    return '/placeholder-image.png';
  };

  // Helper function to generate data hash (simple hash based on data content)
  const generateDataHash = (data: any[]): string => {
    if (!data || !Array.isArray(data)) return '';
    // Generate hash based on data length, IDs, and timestamps
    const ids = data.map(item => item.id || '').sort().join(',');
    const timestamps = data.map(item => item.updatedAt || item.createdAt || '').sort().join(',');
    return `${data.length}-${ids.substring(0, 50)}-${timestamps.substring(0, 50)}`;
  };

  // Helper function to safely set localStorage with quota handling
  const safeSetItem = (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        console.warn(`[FilteringSystem] localStorage quota exceeded for ${key}, clearing old cache...`);
        try {
          // Clear old cache items except current one
          const keysToRemove = ['products_cache', 'categories_cache', 'products_cache_timestamp', 'categories_cache_timestamp', 'products_cache_hash', 'categories_cache_hash'];
          keysToRemove.forEach(k => {
            if (k !== key) localStorage.removeItem(k);
          });
          // Try again
          localStorage.setItem(key, value);
          return true;
        } catch (retryError) {
          console.error(`[FilteringSystem] Failed to set ${key} after cleanup:`, retryError);
          return false;
        }
      }
      console.error(`[FilteringSystem] Error setting ${key}:`, error);
      return false;
    }
  };

  // Preload categories API on component mount - same API as MainHeader
  useEffect(() => {
    // Clear old cache and fetch fresh categories from API (same as MainHeader)
    const preloadCategories = async () => {
      const categoriesCacheKey = 'categories_cache';
      const categoriesCacheTimestampKey = 'categories_cache_timestamp';
      const categoriesCacheHashKey = 'categories_cache_hash';
      
      // Clear old cache completely
      if (typeof window !== 'undefined') {
        localStorage.removeItem(categoriesCacheKey);
        localStorage.removeItem(categoriesCacheTimestampKey);
        localStorage.removeItem(categoriesCacheHashKey);
      }
      
      try {
        setCategoriesLoading(true);
        // Use same API endpoint as MainHeader: /api/categories?limit=80&forceRefresh=true
        const response = await fetch(`/api/categories?limit=80&forceRefresh=true`, {
          cache: 'no-store', // Always fetch fresh
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && Array.isArray(result.data)) {
            // Filter only active categories (same as MainHeader)
            const activeCategories = result.data.filter((cat: any) => cat.isActive);
            console.log(`[FilteringSystem] Loaded ${activeCategories.length} active categories from API (same as MainHeader)`);
            setRawCategories(activeCategories);
          }
        }
      } catch (error) {
        console.error('[FilteringSystem] Error preloading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    preloadCategories();
  }, []);

  // Fetch products and categories from API with smart caching (only fetch if data changed)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Detect back navigation
        let isBackNavigation = false;
        try {
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          isBackNavigation = navigationEntry?.type === 'back_forward';
        } catch (e) {
          // Fallback: check if cache is very recent (< 2 minutes), likely back navigation
          const productsCacheTimestamp = localStorage.getItem('products_cache_timestamp');
          if (productsCacheTimestamp) {
            const age = Date.now() - parseInt(productsCacheTimestamp, 10);
            isBackNavigation = age < 120000; // Less than 2 minutes old
          }
        }
        
        setLoading(true);
        
        const productsCacheKey = 'products_cache';
        const productsCacheTimestampKey = 'products_cache_timestamp';
        const productsCacheHashKey = 'products_cache_hash';
        const categoriesCacheKey = 'categories_cache';
        const categoriesCacheTimestampKey = 'categories_cache_timestamp';
        const categoriesCacheHashKey = 'categories_cache_hash';
        
        // Clear old categories cache on first load
        if (!isBackNavigation) {
          localStorage.removeItem(categoriesCacheKey);
          localStorage.removeItem(categoriesCacheTimestampKey);
          localStorage.removeItem(categoriesCacheHashKey);
        }
        
        // Shorter cache TTL to ensure fresh data
        const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
        const CATEGORIES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
        const API_TIMEOUT = 5000; // 5 seconds timeout
        
        // Helper function to fetch with timeout
        const fetchWithTimeout = async (url: string, timeout: number) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        };
        
        // Load cached data immediately (for instant display)
        const cachedProducts = localStorage.getItem(productsCacheKey);
        const cachedProductsTimestamp = localStorage.getItem(productsCacheTimestampKey);
        const cachedProductsHash = localStorage.getItem(productsCacheHashKey);
        const cachedCategories = localStorage.getItem(categoriesCacheKey);
        const cachedCategoriesTimestamp = localStorage.getItem(categoriesCacheTimestampKey);
        const cachedCategoriesHash = localStorage.getItem(categoriesCacheHashKey);
        
        // Clear old products cache on first load to ensure fresh data
        if (!isBackNavigation) {
          localStorage.removeItem(productsCacheKey);
          localStorage.removeItem(productsCacheTimestampKey);
          localStorage.removeItem(productsCacheHashKey);
        }
        
        // Set cached products immediately if valid (only for back navigation)
        let hasValidProductsCache = false;
        if (isBackNavigation && cachedProducts && cachedProductsTimestamp) {
          const age = Date.now() - parseInt(cachedProductsTimestamp, 10);
          if (age < CACHE_TTL) {
            try {
              const parsed = JSON.parse(cachedProducts);
              if (parsed.success && parsed.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
                console.log(`[FilteringSystem] Using cached products (${parsed.data.length} items)`);
                setRawProducts(parsed.data);
                hasValidProductsCache = true;
              }
            } catch (error) {
              console.error('[FilteringSystem] Error parsing cached products:', error);
            }
          }
        }
        
        // Set cached categories immediately if valid (PRIORITY - show categories first)
        let hasValidCategoriesCache = false;
        if (cachedCategories && cachedCategoriesTimestamp) {
          const age = Date.now() - parseInt(cachedCategoriesTimestamp, 10);
          if (age < CATEGORIES_CACHE_TTL) {
            try {
              const parsed = JSON.parse(cachedCategories);
              if (parsed.success && parsed.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
                // Filter only active categories (same as MainHeader)
                const activeCategories = parsed.data.filter((cat: any) => cat.isActive);
                console.log(`[FilteringSystem] Using cached categories (${activeCategories.length} active items)`);
                setRawCategories(activeCategories);
                hasValidCategoriesCache = true;
              }
            } catch (error) {
              console.error('[FilteringSystem] Error parsing cached categories:', error);
            }
          }
        }
        
        // If back navigation: only skip API if BOTH cache are valid AND recent (< 2 minutes)
        // If cache is missing or invalid, MUST fetch from API to show data
        const cacheAge = cachedProductsTimestamp ? Date.now() - parseInt(cachedProductsTimestamp, 10) : Infinity;
        const shouldSkipAPI = isBackNavigation && hasValidProductsCache && hasValidCategoriesCache && cacheAge < 120000; // 2 minutes
        
        if (shouldSkipAPI) {
          console.log('[FilteringSystem] Back navigation detected, using cache only (no API calls)');
          setLoading(false);
          return; // Skip all API calls
        }
        
        // If back navigation but cache is missing/invalid, fetch from API
        if (isBackNavigation && (!hasValidProductsCache || !hasValidCategoriesCache)) {
          console.log('[FilteringSystem] Back navigation detected but cache invalid/missing, fetching from API...');
        }
        
        // If cache is older than 2 minutes, always fetch fresh data to get latest products
        if (cacheAge >= 120000 && hasValidProductsCache) {
          console.log('[FilteringSystem] Cache older than 2 minutes, fetching fresh data to get latest products/images...');
        }
        
        // Fetch categories and products in parallel (only if cache expired or data changed)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const fetchPromises: Promise<void>[] = [];
        
        // Always fetch categories if cache is missing/invalid (PRIORITY - load first)
        // Categories are critical for filter functionality
        // BUT: If back navigation and cache exists, skip to avoid delay (already preloaded)
        const shouldFetchCategories = !isBackNavigation && (!hasValidCategoriesCache || 
            !cachedCategories || 
            !cachedCategoriesTimestamp || 
            (Date.now() - parseInt(cachedCategoriesTimestamp, 10)) >= CATEGORIES_CACHE_TTL);
        
        // Fetch categories FIRST (priority) - use same API as MainHeader
        if (shouldFetchCategories) {
          setCategoriesLoading(true);
          // Fetch categories FIRST before products (higher priority) - same API as MainHeader
          fetchPromises.unshift(
            (async () => {
              try {
                // Use same API endpoint as MainHeader: /api/categories?limit=80&forceRefresh=true
                const categoriesResponse = await fetchWithTimeout(`/api/categories?limit=80&forceRefresh=true`, API_TIMEOUT);
                
                if (categoriesResponse.ok) {
                  const categoriesResult = await categoriesResponse.json();
                  if (categoriesResult.success && categoriesResult.data && Array.isArray(categoriesResult.data)) {
                    // Filter only active categories (same as MainHeader)
                    const activeCategories = categoriesResult.data.filter((cat: any) => cat.isActive);
                    const newHash = generateDataHash(activeCategories);
                    
                    // Check if data actually changed
                    if (cachedCategoriesHash === newHash) {
                      console.log('[FilteringSystem] Categories data unchanged, updating cache timestamp only');
                      // Data unchanged, just update timestamp
                      safeSetItem(categoriesCacheTimestampKey, Date.now().toString());
                    } else {
                      console.log(`[FilteringSystem] Categories data changed, loaded ${activeCategories.length} active categories from API (same as MainHeader)`);
                      // Data changed, update everything with active categories only
                      setRawCategories(activeCategories);
                      safeSetItem(categoriesCacheKey, JSON.stringify({ success: true, data: activeCategories }));
                      safeSetItem(categoriesCacheTimestampKey, Date.now().toString());
                      safeSetItem(categoriesCacheHashKey, newHash);
                    }
                  }
                }
              } catch (error) {
                console.error('[FilteringSystem] Error fetching categories:', error);
                // Use cached data if available
                if (cachedCategories) {
                  const parsed = JSON.parse(cachedCategories);
                  if (parsed.success && parsed.data && Array.isArray(parsed.data)) {
                    console.log('[FilteringSystem] Using cached categories due to API error');
                    setRawCategories(parsed.data);
                  }
                }
              } finally {
                setCategoriesLoading(false);
              }
            })()
          );
        } else {
          console.log('[FilteringSystem] Categories cache valid, skipping API call');
        }
        
        // Always fetch products if cache is missing/invalid (same API as selleradmin)
        const shouldFetchProducts = !hasValidProductsCache || 
            !cachedProducts || 
            !cachedProductsTimestamp || 
            (Date.now() - parseInt(cachedProductsTimestamp, 10)) >= CACHE_TTL;
        
        // Fetch products - use same API as selleradmin (limit=500 to get all products)
        if (shouldFetchProducts) {
          fetchPromises.push(
            (async () => {
              try {
                // Use same API endpoint as selleradmin: /api/products?limit=500
                const productsResponse = await fetchWithTimeout(`${apiUrl}/products?limit=500`, API_TIMEOUT).catch(() => {
                  return fetchWithTimeout('/api/products?limit=500', API_TIMEOUT);
                });
                
                if (productsResponse.ok) {
                  const productsResult = await productsResponse.json();
                  console.log('[FilteringSystem] Products API Response:', {
                    success: productsResult.success,
                    dataLength: productsResult.data?.length,
                    isArray: Array.isArray(productsResult.data)
                  });
                  
                  if (productsResult.success && productsResult.data && Array.isArray(productsResult.data)) {
                    const newHash = generateDataHash(productsResult.data);
                    
                    // Check if data actually changed
                    if (cachedProductsHash === newHash) {
                      console.log('[FilteringSystem] Products data unchanged, updating cache timestamp only');
                      // Data unchanged, just update timestamp
                      safeSetItem(productsCacheTimestampKey, Date.now().toString());
                    } else {
                      console.log(`[FilteringSystem] Products data changed, loaded ${productsResult.data.length} items from API (same as selleradmin)`);
                      // Data changed, update everything
                      setRawProducts(productsResult.data);
                      safeSetItem(productsCacheKey, JSON.stringify(productsResult));
                      safeSetItem(productsCacheTimestampKey, Date.now().toString());
                      safeSetItem(productsCacheHashKey, newHash);
                    }
                  } else {
                    console.error('[FilteringSystem] Invalid products API response:', productsResult);
                  }
                } else {
                  console.error('[FilteringSystem] Products API response not OK:', productsResponse.status);
                }
              } catch (error) {
                console.error('[FilteringSystem] Error fetching products:', error);
                // Don't use cached data if it's empty or invalid
                if (cachedProducts) {
                  try {
                    const parsed = JSON.parse(cachedProducts);
                    if (parsed.success && parsed.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
                      console.log('[FilteringSystem] Using cached products due to API error');
                      setRawProducts(parsed.data);
                    }
                  } catch (parseError) {
                    console.error('[FilteringSystem] Error parsing cached products:', parseError);
                  }
                }
              }
            })()
          );
        } else {
          console.log('[FilteringSystem] Products cache valid, skipping API call');
        }
        
        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Refresh categories when window gains focus (only if data changed)
  useEffect(() => {
    const handleFocus = async () => {
      const categoriesCacheKey = 'categories_cache';
      const categoriesCacheTimestampKey = 'categories_cache_timestamp';
      const categoriesCacheHashKey = 'categories_cache_hash';
      const cachedTimestamp = localStorage.getItem(categoriesCacheTimestampKey);
      const cachedHash = localStorage.getItem(categoriesCacheHashKey);
      
      // Only check for updates if cache is older than 1 minute (to avoid too frequent checks)
      if (!cachedTimestamp || (Date.now() - parseInt(cachedTimestamp, 10)) > 60000) {
        console.log('[FilteringSystem] Window focused, checking for category updates...');
        
        // Fetch fresh categories to check if data changed - use same API as MainHeader
        try {
          // Helper for timeout
          const fetchWithTimeout = async (url: string, timeout: number) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            try {
              const response = await fetch(url, { signal: controller.signal });
              clearTimeout(timeoutId);
              return response;
            } catch (error) {
              clearTimeout(timeoutId);
              throw error;
            }
          };
          
          // Use same API endpoint as MainHeader: /api/categories?limit=80&forceRefresh=true
          const categoriesResponse = await fetchWithTimeout(`/api/categories?limit=80&forceRefresh=true`, 3000);
          
          if (categoriesResponse.ok) {
            const categoriesResult = await categoriesResponse.json();
            if (categoriesResult.success && categoriesResult.data && Array.isArray(categoriesResult.data)) {
              // Filter only active categories (same as MainHeader)
              const activeCategories = categoriesResult.data.filter((cat: any) => cat.isActive);
              const newHash = generateDataHash(activeCategories);
              
              // Only update if data actually changed
              if (cachedHash !== newHash) {
                console.log(`[FilteringSystem] Categories changed on focus, updated ${activeCategories.length} active items (same as MainHeader)`);
                setRawCategories(activeCategories);
                safeSetItem(categoriesCacheKey, JSON.stringify({ success: true, data: activeCategories }));
                safeSetItem(categoriesCacheTimestampKey, Date.now().toString());
                safeSetItem(categoriesCacheHashKey, newHash);
              } else {
                console.log('[FilteringSystem] Categories unchanged on focus, just updating timestamp');
                // Data unchanged, just update timestamp
                safeSetItem(categoriesCacheTimestampKey, Date.now().toString());
              }
            }
          }
        } catch (error) {
          console.error('[FilteringSystem] Error checking categories on focus:', error);
          // Don't update on error, keep using cache
        }
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Update products and derived data when displayProducts changes
  // Only update if actually changed to prevent infinite loops
  useEffect(() => {
    setProducts(prevProducts => {
      // Only update if the array reference or length changed
      if (prevProducts.length !== displayProducts.length || 
          prevProducts.some((p, i) => p.id !== displayProducts[i]?.id)) {
        return displayProducts;
      }
      return prevProducts;
    });
    setBrands(uniqueBrands);
    setAllSizes(allSizesList);
  }, [displayProducts, uniqueBrands, allSizesList]);

  // Update categories when processedCategories changes
  useEffect(() => {
    setCategories(processedCategories);
  }, [processedCategories]);

  // Calculate dynamic category counts based on current filters
  const categoryCounts = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => 
        p.category === cat.name &&
        (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedSizes.length === 0 || selectedSizes.some(size => p.sizes.includes(size)))
      ).length
    }));
  }, [categories, products, searchTerm, selectedBrands, selectedSizes]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // Sort by newest first (by createdAt)
        filtered.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategories, selectedBrands, selectedSizes, sortBy]);

  // Function to chunk products into rows of 3
  const chunkProducts = (products: DisplayProduct[], size: number) => {
    const chunks: DisplayProduct[][] = [];
    for (let i = 0; i < products.length; i += size) {
      chunks.push(products.slice(i, i + size));
    }
    return chunks;
  };

  // Get products to display - just slice the filtered products for better performance
  const displayedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(0, visibleProducts);
  }, [filteredAndSortedProducts, visibleProducts]);
  
  // Memoize product rows for better performance
  const productRows = useMemo(() => {
    return chunkProducts(displayedProducts, 3);
  }, [displayedProducts]);
  
  // Check if there are more products to load
  const hasMoreProducts = filteredAndSortedProducts.length > visibleProducts;

  // Filter handler functions
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSortBy('default');
  };

  // Show more products function
  const showMoreProducts = () => {
    setVisibleProducts(prev => prev + 9);
  };

  // Handle product card click - using Link component for client-side navigation
  // No need for separate handler, Link handles it automatically

  // Reset visible products when filters change
  React.useEffect(() => {
    setVisibleProducts(9);
  }, [searchTerm, selectedCategories, selectedBrands, selectedSizes, sortBy]);

  useEffect(() => {
    if (isFilterOpen) {
      const headerEl = document.querySelector('header');
      setHeaderHeight(headerEl ? headerEl.getBoundingClientRect().height : 0);
    }
  }, [isFilterOpen]);

  useEffect(() => {
    if (!isFilterOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterOpen]);

  const overlayTop = headerHeight || 0;
  const overlayHeight = overlayTop ? `calc(100vh - ${overlayTop}px)` : '100vh';
  const drawerStyle = { top: overlayTop, height: overlayHeight };

  const renderFilterPanel = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Search Bar */}
      <div className="mb-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="absolute right-3 top-2.5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear All */}
      {(searchTerm || selectedCategories.length > 0 || selectedBrands.length > 0 || selectedSizes.length > 0) && (
        <div className="my-4">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-0">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
        >
          Category
          <svg 
            className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isCategoryOpen && (
          <div className=" space-y-2">
            {categoriesLoading || (loading && categoryCounts.length === 0) ? (
              <div className="text-gray-500 text-sm py-2">Loading categories...</div>
            ) : categoryCounts.length === 0 ? (
              <div className="text-gray-500 text-sm py-2">No categories available</div>
            ) : (
              categoryCounts.map((category, index) => (
                <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-3"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({category.count})</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Branding Filter */}
      <div className="mb-0">
        <button
          onClick={() => setIsBrandingOpen(!isBrandingOpen)}
          className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
        >
          Branding
          <svg 
            className={`w-5 h-5 transition-transform ${isBrandingOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isBrandingOpen && (
          <div className=" space-y-2">
            {brands.map((brand, index) => (
              <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input 
                  type="checkbox" 
                  className="mr-3"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span className="text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="mb-0">
        <button
          onClick={() => setIsSizeOpen(!isSizeOpen)}
          className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
        >
          Size
          <svg 
            className={`w-5 h-5 transition-transform ${isSizeOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isSizeOpen && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {allSizes.map((size, index) => (
              <button
                key={index}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                  selectedSizes.includes(size)
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'border-gray-300 hover:bg-purple-50 hover:border-purple-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderModalPanel = () => (
    <div className="w-full">
      {/* Search */}
      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="absolute right-3 top-2.5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear all */}
      {(searchTerm || selectedCategories.length > 0 || selectedBrands.length > 0 || selectedSizes.length > 0) && (
        <div className="mb-4">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Two-column on md: Category + Branding */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="border rounded-lg p-3">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
          >
            Category
            <svg className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isCategoryOpen && (
            <div className="space-y-2">
              {categoriesLoading || (loading && categoryCounts.length === 0) ? (
                <div className="text-gray-500 text-sm py-2">Loading categories...</div>
              ) : categoryCounts.length === 0 ? (
                <div className="text-gray-500 text-sm py-2">No categories available</div>
              ) : (
                categoryCounts.map((category, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryToggle(category.name)}
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">({category.count})</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Branding */}
        <div className="border rounded-lg p-3">
          <button
            onClick={() => setIsBrandingOpen(!isBrandingOpen)}
            className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
          >
            Branding
            <svg className={`w-5 h-5 transition-transform ${isBrandingOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isBrandingOpen && (
            <div className="space-y-2">
              {brands.map((brand, index) => (
                <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Size below */}
      <div className="border rounded-lg p-3 mt-4">
        <button
          onClick={() => setIsSizeOpen(!isSizeOpen)}
          className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
        >
          Size
          <svg className={`w-5 h-5 transition-transform ${isSizeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isSizeOpen && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {allSizes.map((size, index) => (
              <button
                key={index}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                  selectedSizes.includes(size) ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-300 hover:bg-purple-50 hover:border-purple-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 py-6">

      {/* Modal for filters on <1320px - rendered via portal to escape zoom/scale */}
      {isFilterOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] min-[1320px]:hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterOpen(false)} />
            <div
              className="relative w-[80vw] md:w-[720px] max-w-[720px] bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <div className="text-lg font-semibold">Filters</div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {renderModalPanel()}
              </div>
            </div>
          </div>,
          document.body
        )
      }

      <div className="grid grid-cols-1 min-[1320px]:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Filters */}
        <div className="min-[1320px]:block hidden">
          <div className="w-full max-w-[280px] sticky top-4">
            {renderFilterPanel()}
          </div>
        </div>

        {/* Right Side - Product Display */}
        <div className="min-[1320px]:col-span-3">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <h1 className="text-4xl font-semibold text-gray-900 ">Shop Now</h1>

          </div>

          {/* Results, Filter trigger (<1320px), and Sorting */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6 border-b border-gray-200 pb-4">
            <p className="text-gray-600">
              Showing {displayedProducts.length} products (infinite scroll)
            </p>
            <div className="flex items-center gap-2">
              {/* Filter button appears before Sort By on widths below 1320px */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-4 py-2 rounded-md bg-fuchsia-500 text-white font-medium min-[1320px]:hidden"
                aria-label="Open filters"
              >
                Filter
              </button>
              <span className="text-gray-600 whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>

          {/* Products Rows - maintain large-screen ratio (3 cards per row) using fluid scale for >=768px */}
          <div className="hidden md:flex md:flex-col md:justify-start md:items-center md:gap-0">
            {/* Products Grid Container */}
            
            {loading ? (
              <div className="w-full flex flex-col justify-start items-center gap-0">
                {/* Skeleton Loading - Show 9 skeleton cards */}
                {[...Array(9)].map((_, index) => (
                  <div key={`skeleton-${index}`} className="w-full flex justify-center items-center gap-6 h-[582px] mb-6">
                    {[...Array(3)].map((_, cardIndex) => (
                      <div
                        key={`skeleton-card-${index}-${cardIndex}`}
                        className="w-[312px] p-4 bg-gray-100 rounded-xl border border-gray-200 animate-pulse"
                      >
                        {/* Skeleton Image */}
                        <div className="w-full h-72 bg-gray-300 rounded-lg mb-4"></div>
                        {/* Skeleton Text */}
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="w-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No products found</div>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              productRows.map((rowProducts, rowIndex) => (
              <div key={rowIndex} className="w-full flex justify-center items-center gap-6 h-[582px]">
                {/* Individual Product Row */}
                
                {rowProducts.map((product, productIndex) => {
                  const handleAddToCart = (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const cartItem: CartItem = {
                      id: `cart-${product.id}-${Date.now()}`,
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      image: product.image || '/placeholder-image.png',
                    };
                    addToCart(cartItem);
                    window.dispatchEvent(new Event('storage'));
                  };
                  
                  return (
                    <Link 
                      key={product.id} 
                      href={`/client/product-details/${product.id}`} 
                      className="flex h-full items-center"
                      prefetch={true}
                      scroll={true}
                    >
                      <div
                        className="w-[312px] p-4 bg-sky-50 rounded-xl border border-black/10 inline-flex flex-col justify-start items-start group md:hover:shadow-md md:hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 select-none"
                        style={{ transformOrigin: 'center', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                        role="article"
                        aria-labelledby={`product-title-${product.id}`}
                      >
                      {/* Individual Product Card */}
                      
                      {/* Card Header */}
                      <div className="self-stretch inline-flex justify-between items-center mb-2">
                        {/* Card Header Container */}
                        
                        <div className="flex justify-start items-center gap-2">
                          {/* Verified Seller Indicator */}
                          
                          <div className="w-6 h-6 relative transform group-hover:scale-110 transition-transform duration-300">
                            {/* Verified Icon Container */}
                            <Image
                              src="/card/icon/tick.svg"
                              alt="Verified seller"
                              width={24}
                              height={24}
                              loading="lazy"
                            />
                          </div>
                          
                          <div className="justify-start text-neutral-600 text-sm font-semibold font-['PolySans_Trial'] leading-relaxed">
                            {/* Verified Seller Text */}
                            Verified Seller
                          </div>
                        </div>
                        
                        <div 
                          className="transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Wishlist Button Container */}
                          <Image
                            src="/card/icon/butterfly.svg"
                            alt="Add to wishlist"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Product Image */}
                      <div className="self-stretch h-72 relative mb-4 overflow-hidden rounded-lg">
                        {/* Product Image Container */}
                        <Image
                          src={getValidImageUrl(product.image)}
                          alt={`${product.name} product image`}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out select-none pointer-events-none"
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={85}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.png';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="self-stretch flex flex-col justify-start items-start">
                        {/* Product Info Container */}
                        
                        <div className="self-stretch pt-4 pb-5 flex flex-col justify-center items-start gap-3">
                          {/* Product Details Wrapper */}
                          
                          {/* Product Name and Price */}
                          <div className="self-stretch flex flex-col justify-start items-start gap-1">
                            {/* Product Name and Price Container */}
                            
                            <div 
                              className="justify-start text-slate-950 text-lg font-semibold font-['Poppins'] leading-loose group-hover:text-fuchsia-600 transition-colors duration-300 truncate max-w-full" 
                              title={product.name}
                              id={`product-title-${product.id}`}
                              role="heading"
                              aria-level={3}
                            >
                              {/* Product Name */}
                              {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                            </div>
                            
                            <div className="inline-flex justify-start items-center gap-1.5">
                              {/* Price Container */}
                              
                              <div className="flex justify-start items-center">
                                {/* Current Price */}
                                <div className="justify-start text-black text-2xl font-semibold font-['Poppins'] leading-9">
                                  {/* Current Price Display */}
                                  {product.currency}{product.price}
                                </div>
                              </div>
                              
                              <div className="justify-start">
                                {/* Original Price */}
                                <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">(</span>
                                <span className="text-red-500 text-base font-normal font-['Poppins'] line-through leading-normal">
                                  ${product.originalPrice}
                                </span>
                                <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">)</span>
                              </div>
                            </div>
                          </div>

                          {/* Rating and Reviews */}
                          <div className="flex flex-col md:flex-row md:inline-flex justify-start items-start md:items-center gap-1.5">
                            {/* Rating and Reviews Container */}
                            
                            <div className="flex justify-start items-center" role="img" aria-label={`${product.rating} out of 5 stars`}>
                              {/* Star Rating */}
                              
                              {[...Array(product.rating)].map((_, i) => (
                                <svg
                                  key={i}
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="#FFC107"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="transform group-hover:scale-110 transition-transform duration-300"
                                  style={{ transitionDelay: `${i * 50}ms` }}
                                  aria-hidden="true"
                                >
                                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                              ))}
                            </div>
                            
                            {/* Review count - hidden on mobile, shown on desktop next to stars */}
                            <div className="hidden md:block text-center justify-start text-neutral-400 text-sm font-normal font-['Poppins'] leading-relaxed">
                              {/* Reviews Count */}
                              ( {product.reviews} Reviews )
                            </div>
                            
                            {/* Review count box - shown on mobile below stars */}
                            <div className="md:hidden self-stretch px-2 py-1 bg-neutral-100 rounded-md text-center justify-start text-neutral-400 text-xs font-normal font-['Poppins'] leading-snug">
                              {/* Reviews Count Box for Mobile */}
                              ( {product.reviews} Reviews )
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Button - Hidden by default, shown on hover */}
                        <div className="self-stretch overflow-hidden h-0 group-hover:h-14 transition-all duration-500 ease-out">
                          {/* Add to Cart Button Container */}
                          
                          <button 
                            onClick={handleAddToCart}
                            className="w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 group-hover:h-14 group-hover:py-3 group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {/* Add to Cart Button */}
                            
                            <div className="w-5 h-5 relative">
                              {/* Cart Icon Container */}
                              <Image
                                src="/card/icon/cart.svg"
                                alt="Cart icon"
                                width={20}
                                height={20}
                                loading="lazy"
                              />
                            </div>
                            
                            <div className="justify-start text-white text-base font-semibold font-['Poppins'] leading-none whitespace-nowrap">
                              {/* Button Text */}
                              Add to Cart
                            </div>
                          </button>
                        </div>
                      </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))
            )}
            
            {/* Load More Button - Infinite Scroll */}
            {hasMoreProducts && filteredAndSortedProducts.length > 0 && (
              <div className="w-full flex justify-center mt-8">
                <button
                  onClick={showMoreProducts}
                  className="px-6 py-3 border-2 border-fuchsia-500 text-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-colors font-medium font-['Poppins']"
                >
                  See More
                </button>
              </div>
            )}
          </div>

          {/* Products Grid - Mobile only (2 per row) */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {loading ? (
              // Skeleton Loading for Mobile
              [...Array(6)].map((_, index) => (
                <div
                  key={`mobile-skeleton-${index}`}
                  className="p-3 bg-gray-100 rounded-xl border border-gray-200 animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-40 bg-gray-300 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : displayedProducts.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No products found</div>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No products found</div>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              displayedProducts.map((product) => (
              <Link key={product.id} href={`/client/product-details/${product.id}`}>
                <div
                  className="p-3 bg-sky-50 rounded-xl border border-black/10 flex flex-col justify-start items-start group transition-all duration-300 ease-in-out cursor-pointer select-none"
                  role="article"
                  aria-labelledby={`product-title-${product.id}`}
                >
                  {/* Card Header */}
                  <div className="self-stretch inline-flex justify-between items-center mb-2">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <Image src="/card/icon/tick.svg" alt="Verified seller" width={24} height={24} loading="lazy" />
                      </div>
                      <div className="text-neutral-600 text-xs font-semibold font-['PolySans_Trial'] leading-snug whitespace-nowrap">
                        Verified Seller
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Add to wishlist functionality
                        console.log('Add to wishlist:', product.id);
                      }}
                    >
                      <Image src="/card/icon/butterfly.svg" alt="Add to wishlist" width={24} height={24} loading="lazy" />
                    </div>
                  </div>
                  {/* Product Image */}
                  <div className="self-stretch h-40 relative mb-3 overflow-hidden rounded-lg">
                    <Image
                      src={getValidImageUrl(product.image)}
                      alt={`${product.name} product image`}
                      fill
                      className="object-cover select-none pointer-events-none"
                      draggable={false}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                  {/* Info */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div 
                      className="justify-start text-slate-950 text-sm font-semibold font-['Poppins'] leading-tight truncate max-w-full"
                      id={`product-title-${product.id}`}
                      role="heading"
                      aria-level={3}
                    >
                      {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                    </div>
                    <div className="inline-flex justify-start items-center gap-1.5">
                      <div className="justify-start text-black text-lg font-semibold font-['Poppins'] leading-6">
                        {product.currency}{product.price}
                      </div>
                      <div className="justify-start">
                        <span className="text-red-500 text-xs font-normal font-['Poppins'] leading-normal">(</span>
                        <span className="text-red-500 text-xs font-normal font-['Poppins'] line-through leading-normal">
                          ${product.originalPrice}
                        </span>
                        <span className="text-red-500 text-xs font-normal font-['Poppins'] leading-normal">)</span>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex justify-start items-center">
                      {[...Array(product.rating)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))
            )}
            
            {/* Load More Button - Mobile */}
            {!loading && hasMoreProducts && filteredAndSortedProducts.length > 0 && (
              <div className="w-full flex justify-center mt-6 col-span-2">
                <button
                  onClick={showMoreProducts}
                  className="px-6 py-3 border-2 border-fuchsia-500 text-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-colors font-medium font-['Poppins']"
                >
                  See More
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

