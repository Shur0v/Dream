'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { Product, Category } from '@/types';
import { fetchCategories as loadCategoriesFromApi } from '@/lib/categories';
import FestivalBannerSection from '@/app/client/components/FestivalBannerSection';
import { addToCart, addToWishlist, isUserLoggedIn, CartItem, WishlistItem } from '@/lib/userStorage';
import { SignInRequiredModal } from '@/components/ui/SignInRequiredModal';

/**
 * ProductList component for displaying products with filtering and sorting
 * 
 * @description Displays products in a grid layout with:
 * - Filtering by category, price range, rating
 * - Sorting by price, rating, popularity
 * - Search functionality
 * - Pagination
 */
export default function ProductList() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    sortBy: 'popularity'
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'wishlist' | null>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  // Fetch products from API with caching
  useEffect(() => {
    let active = true;
    
    const fetchProducts = async () => {
      try {
        setError(null);
        const cacheKey = '/api/products?limit=500';
        
        // Check cache first for instant loading
        const { getCachedResponse } = await import('@/lib/indexeddb/apiCache');
        const cachedData = await getCachedResponse(cacheKey);
        
        if (cachedData && active) {
          // Show cached data instantly (no loading state)
          if (cachedData.success && cachedData.data && Array.isArray(cachedData.data)) {
            setProducts(cachedData.data);
            setLoading(false);
          }
        } else if (active) {
          setLoading(true);
        }

        // Fetch from network (update cache in background)
        const { fetchWithCache } = await import('@/lib/indexeddb/apiCache');
        const response = await fetchWithCache(cacheKey, {}, 60 * 60 * 1000);
        const result = await response.json();
        
        if (active) {
          if (result.success && result.data && Array.isArray(result.data)) {
            setProducts(result.data);
          } else {
            setError(result.error || 'Invalid response from server');
            setProducts([]);
          }
        }
      } catch (err) {
        if (active) {
          console.error('[ProductList] Error fetching products:', err);
          setError(err instanceof Error ? err.message : 'Failed to load products');
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        // Clear cache and fetch fresh categories
        if (typeof window !== 'undefined') {
          localStorage.removeItem('categories_cache');
          localStorage.removeItem('categories_cache_timestamp');
        }
        const fetchedCategories = await loadCategoriesFromApi({ bypassCache: true });
        if (active) {
          setCategories(fetchedCategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        if (active) {
          setCategoriesError(err instanceof Error ? err.message : 'Failed to load categories');
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  // Listen for login success to retry pending actions
  useEffect(() => {
    const handleStorageChange = () => {
      if (isUserLoggedIn() && pendingAction && pendingProduct && showSignInModal) {
        // User logged in, retry the pending action
        if (pendingAction === 'cart') {
          const cartItem: CartItem = {
            id: `cart-${pendingProduct.id}-${Date.now()}`,
            productId: pendingProduct.id,
            name: pendingProduct.name,
            price: pendingProduct.price,
            quantity: 1,
            image: pendingProduct.images && pendingProduct.images.length > 0 ? pendingProduct.images[0] : '/placeholder-image.png',
          };
          addToCart(cartItem);
          window.dispatchEvent(new Event('storage'));
        } else if (pendingAction === 'wishlist') {
          const wishlistItem: WishlistItem = {
            id: `wishlist-${pendingProduct.id}-${Date.now()}`,
            productId: pendingProduct.id,
            name: pendingProduct.name,
            price: pendingProduct.price,
            image: pendingProduct.images && pendingProduct.images.length > 0 ? pendingProduct.images[0] : '/placeholder-image.png',
          };
          addToWishlist(wishlistItem);
          window.dispatchEvent(new Event('storage'));
        }
        setShowSignInModal(false);
        setPendingAction(null);
        setPendingProduct(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [pendingAction, pendingProduct, showSignInModal]);

  // Sample products data (fallback)
  const sampleProducts = [
    {
      id: '1',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      images: ['/card/image/img1.jpg'],
      category: 'Electronics',
      brand: 'TechBrand',
      sku: 'WH-001',
      stock: 50,
      isActive: true,
      tags: ['wireless', 'headphones', 'electronics'],
      sellerId: 'seller-001',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Smart Watch',
      description: 'Advanced smartwatch with health monitoring features',
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      images: ['/hero/images/image2.jpg'],
      category: 'Electronics',
      brand: 'SmartTech',
      sku: 'SW-002',
      stock: 30,
      isActive: true,
      tags: ['smartwatch', 'health', 'electronics'],
      sellerId: 'seller-002',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with excellent sound quality',
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      images: ['/hero/images/image3.png'],
      category: 'Electronics',
      brand: 'SoundMax',
      sku: 'BS-003',
      stock: 0,
      isActive: true,
      tags: ['bluetooth', 'speaker', 'portable'],
      sellerId: 'seller-003',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Gaming Mouse',
      description: 'High-precision gaming mouse with RGB lighting',
      price: 49.99,
      originalPrice: 69.99,
      discount: 29,
      images: ['/hero/images/image4.png'],
      category: 'Electronics',
      brand: 'GamePro',
      sku: 'GM-004',
      stock: 25,
      isActive: true,
      tags: ['gaming', 'mouse', 'rgb'],
      sellerId: 'seller-004',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  const categoryFilterOptions = useMemo(() => {
    const normalizeValue = (category: Category) => {
      if (category.slug) return category.slug;
      if (category.id) return category.id;
      return category.name.toLowerCase().replace(/\s+/g, '-');
    };

    return [
      { label: 'All', value: 'all' },
      ...categories.map((cat) => ({
        label: cat.name,
        value: normalizeValue(cat),
      })),
    ];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    console.log('[ProductList] Filtering products:', {
      totalProducts: products.length,
      categoryFilter: filters.category,
      priceRange: filters.priceRange,
      rating: filters.rating,
    });
    
    let filtered = products.filter((product) => {
      // Category filter
      if (filters.category !== 'all') {
        const normalizedProductCategory = product.category
          ? product.category.toLowerCase().replace(/\s+/g, '-')
          : '';
        const normalizedFilterCategory = filters.category.toLowerCase();
        if (normalizedProductCategory !== normalizedFilterCategory) {
          return false;
        }
      }
      
      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = product.price || 0;
        switch (filters.priceRange) {
          case 'under-50':
            if (price >= 50) return false;
            break;
          case '50-100':
            if (price < 50 || price > 100) return false;
            break;
          case '100-200':
            if (price < 100 || price > 200) return false;
            break;
          case 'over-200':
            if (price <= 200) return false;
            break;
        }
      }
      
      // Rating filter (if product has rating)
      if (filters.rating !== 'all') {
        const rating = (product as any).rating || 0;
        const minRating = parseFloat(filters.rating.replace('+', ''));
        if (rating < minRating) return false;
      }
      
      return true;
    });
    
    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });
        break;
      default: // popularity
        // Keep original order or sort by createdAt desc
        filtered.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });
    }
    
    console.log('[ProductList] Filtered products count:', filtered.length);
    return filtered;
  }, [products, filters.category, filters.priceRange, filters.rating, filters.sortBy]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <>
      <FestivalBannerSection />
      <div className="w-full max-w-[1320px] mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-gray-600">Discover our complete collection of products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              {categoriesLoading ? (
                <div className="text-gray-500 text-sm py-2">Loading categories...</div>
              ) : categoriesError ? (
                <div className="text-red-500 text-sm py-2">{categoriesError}</div>
              ) : categories.length === 0 ? (
                <div className="text-gray-500 text-sm py-2">No categories available</div>
              ) : (
                categoryFilterOptions.map((category) => (
                  <label key={category.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={filters.category === category.value}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{category.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-2">
              {[
                { label: 'All', value: 'all' },
                { label: 'Under ৳50', value: 'under-50' },
                { label: '৳50 - ৳100', value: '50-100' },
                { label: '৳100 - ৳200', value: '100-200' },
                { label: 'Over ৳200', value: 'over-200' }
              ].map((range) => (
                <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={filters.priceRange === range.value}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
            <div className="space-y-2">
              {[
                { label: 'All', value: 'all' },
                { label: '4+ Stars', value: '4+' },
                { label: '3+ Stars', value: '3+' },
                { label: '2+ Stars', value: '2+' }
              ].map((rating) => (
                <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating.value}
                    checked={filters.rating === rating.value}
                    onChange={(e) => handleFilterChange('rating', rating.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{rating.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">Loading products...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-red-600">{error}</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">No products found</div>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const handleAddToCart = () => {
                if (!isUserLoggedIn()) {
                  setPendingProduct(product);
                  setPendingAction('cart');
                  setShowSignInModal(true);
                  return;
                }

                const cartItem: CartItem = {
                  id: `cart-${product.id}-${Date.now()}`,
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png',
                };
                addToCart(cartItem);
                window.dispatchEvent(new Event('storage'));
              };

              const handleAddToWishlist = () => {
                if (!isUserLoggedIn()) {
                  setPendingProduct(product);
                  setPendingAction('wishlist');
                  setShowSignInModal(true);
                  return;
                }

                const wishlistItem: WishlistItem = {
                  id: `wishlist-${product.id}-${Date.now()}`,
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png',
                };
                addToWishlist(wishlistItem);
                window.dispatchEvent(new Event('storage'));
              };

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onProductClick={(product) => {
                    router.push(`/client/product-details/${product.id}`);
                  }}
                />
              );
            })}
          </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Sign In Required Modal */}
      <SignInRequiredModal
        isOpen={showSignInModal}
        onClose={() => {
          setShowSignInModal(false);
          setPendingAction(null);
          setPendingProduct(null);
        }}
        onSignIn={() => {
          // Trigger login modal via custom event
          window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { userType: 'client' } }));
          // The storage event listener will handle retry after login
        }}
        message={pendingAction === 'cart' 
          ? 'Please sign in to add items to your cart.' 
          : 'Please sign in to add items to your wishlist.'}
      />
    </>
  );
}
