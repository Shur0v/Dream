'use client';

/**
 * @fileoverview Main Navigation Header component
 * Provides logo, search, and user actions
 * 
 * @description This component includes:
 * - Logo and brand name
 * - Search functionality
 * - User account actions
 * - Shopping cart and wishlist
 * - Language selector
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { CartDropdown } from '../cart/CartDropdown';
import { WishlistDropdown } from '../wishlist/WishlistDropdown';
import { Category, Product } from '@/types';
import { getCartCount, getWishlistCount, getCurrentUser, syncCartFromApi, syncWishlistFromApi } from '@/lib/userStorage';
import { fetchWithCache } from '@/lib/indexeddb/apiCache';

// User data interface
interface UserData {
  username: string;
  mobile: string;
  email: string;
  loginTime: string;
}

/**
 * Props interface for MainHeader component
 */
interface MainHeaderProps {
  /**
   * Cart items count
   * @default 0
   */
  cartCount?: number;
  
  /**
   * Wishlist items count
   * @default 0
   */
  wishlistCount?: number;
  
  /**
   * Callback when search is performed
   */
  onSearch?: (query: string) => void;
  
  /**
   * Callback when cart is clicked
   */
  onCartClick?: () => void;
  
  /**
   * Callback when wishlist is clicked
   */
  onWishlistClick?: () => void;
  
  /**
   * Callback when login modal should be opened
   */
  onOpenLoginModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
  
  /**
   * Callback when register modal should be opened
   */
  onOpenRegisterModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
}

/**
 * Main Navigation Header component
 */
export const MainHeader: React.FC<MainHeaderProps> = ({
  cartCount: propCartCount,
  wishlistCount: propWishlistCount,
  onSearch,
  onCartClick,
  onWishlistClick,
  onOpenLoginModal,
  onOpenRegisterModal,
}) => {
  // Get user data from localStorage
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const loadUserData = async () => {
      const user = getCurrentUser();
      if (user) {
        setUserData(user);
        await Promise.allSettled([syncCartFromApi(), syncWishlistFromApi()]);
        setCartCount(getCartCount());
        setWishlistCount(getWishlistCount());
      } else {
        setUserData(null);
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    // Load initially
    loadUserData();

    // Listen for storage changes (when user logs in from another tab or cart/wishlist updates)
    window.addEventListener('cart-wishlist-updated', loadUserData);

    return () => {
      window.removeEventListener('cart-wishlist-updated', loadUserData);
    };
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'bn'>('en');
  const [hoveredCategory, setHoveredCategory] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isLanguageOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageOpen, isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleCartClick = () => {
    setIsCartOpen(true);
    onCartClick?.();
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    // Handle quantity change logic here
    console.log(`Item ${itemId} quantity changed to ${quantity}`);
  };

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log('Proceeding to checkout');
    setIsCartOpen(false);
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
    onWishlistClick?.();
  };

  const handleWishlistClose = () => {
    setIsWishlistOpen(false);
  };

  const handleRemoveWishlistItem = (itemId: number) => {
    // Handle remove wishlist item logic here
    console.log(`Removing wishlist item ${itemId}`);
  };

  // Fetch categories from API - same as BrowseCategories component
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetchWithCache(`/api/categories?limit=80`, {}, 2 * 60 * 1000);
        const result = await response.json();
        
        if (result.success && result.data) {
          // Filter only active categories (same as BrowseCategories)
          const activeCategories = result.data.filter((cat: Category) => cat.isActive);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Search suggestions based on query
  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(searchQuery)}&limit=5&sortBy=createdAt&sortOrder=desc`
        );
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setSearchSuggestions(result.data);
            setShowSuggestions(true);
          }
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSearchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      router.push(`/client/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      onSearch?.(searchQuery);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setIsCategoriesOpen(false);
    if (category.slug) {
      router.push(`/client/categories?category=${category.slug}`);
    } else {
      router.push(`/client/categories?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchQuery('');
    setShowSuggestions(false);
    if (product.slug) {
      router.push(`/client/product-details/${product.slug}`);
    } else {
      router.push(`/client/product-details/${product.id}`);
    }
  };

  const navigationLinks = [
    { text: "Home", href: "/" },
    { text: "All Products", href: "/client/categories" },
    { text: "Become a Seller", href: "#", onClick: () => { onOpenRegisterModal?.('seller'); setIsMobileMenuOpen(false); } },
    { text: "Re seller", href: "#", onClick: () => { onOpenRegisterModal?.('reseller'); setIsMobileMenuOpen(false); } },
  ];
  
  return (
    <div className="father w-full bg-white" role="banner" data-layer="father">
      {/* father = full width main header section */}
      
      <div className="daughter max-w-[1320px] mx-auto py-1.5 px-2" data-layer="daughter">
        {/* daughter = design holder for entire main header section */}
        
        <div className="layer-1 flex flex-col lg:flex-row justify-between items-center lg:gap-0" data-layer="1">
          {/* layer-1 = main header content container */}
          
          {/* Logo - Left side on mobile, normal on desktop */}
          <div className="layer-2 w-full lg:w-[190.5px] h-[69.3px] flex items-center justify-between lg:justify-start" data-layer="2">
            {/* layer-2 = logo container */}
            
            <Link
              href="/"
              onClick={(e) => {
                // If already on home page, prevent navigation and just scroll to top
                if (pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  // Let Link handle navigation (it's already prefetched)
                  // Just ensure smooth scroll after navigation
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 50);
                }
              }}
              aria-label="Dreamshop homepage"
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
              prefetch={true}
            >
              <Image
                className="w-[190.5px] h-[69.3px] object-contain"
                src="/common/logo.svg"
                alt="Dreamshop logo"
                width={190}
                height={69}
                priority
                loading="eager"
              />
            </Link>

            {/* Hamburger Menu Button - Mobile Only, Right Side */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden p-2 hover:opacity-80 transition-opacity"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral-800" strokeWidth={2.5} />
              ) : (
                <Menu className="w-6 h-6 text-neutral-800" strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Search and Actions Container */}
          <div className="layer-3 w-full lg:w-auto lg:flex-1 lg:max-w-[974px] flex flex-col lg:flex-row justify-between items-center gap-4 lg:justify-end xl:justify-between" data-layer="3">
            {/* layer-3 = search and actions container */}
            
            {/* Search Bar - Hidden on mobile */}
            <div className="layer-4 hidden xl:block w-full xl:w-[519px] bg-white rounded-xl border border-fuchsia-500" data-layer="4">
              {/* layer-4 = search bar container */}
              
              <form onSubmit={handleSearch} className="layer-5 flex items-center" data-layer="5">
                {/* layer-5 = search form */}
                
                <div className="layer-6 flex items-center gap-3 pl-6 flex-1" data-layer="6">
                  {/* layer-6 = search input container */}
                  
                  <div className="layer-7 hidden sm:flex items-center gap-1 cursor-pointer relative" data-layer="7">
                    {/* layer-7 = categories dropdown */}
                    
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      aria-expanded={isCategoriesOpen}
                      aria-haspopup="true"
                    >
                      <div className="layer-8 text-neutral-800 text-base font-medium leading-7 whitespace-nowrap" data-layer="8">
                        {/* layer-8 = categories text */}
                        All Categories
                      </div>
                      
                      <div className="layer-9 w-5 h-5 flex items-center justify-center" data-layer="9">
                        {/* layer-9 = dropdown arrow */}
                        <Image
                          src="/header/icons/downicon.svg"
                          alt="Categories dropdown"
                          width={20}
                          height={20}
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isCategoriesOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                          loading="lazy"
                        />
                      </div>
                    </button>
                    
                    {/* Categories Dropdown Menu - Same data source as BrowseCategories */}
                    {isCategoriesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                        <div className="py-2">
                          {categoriesLoading ? (
                            <div className="px-4 py-2 text-sm text-gray-500">Loading categories...</div>
                          ) : categories.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500">No categories available</div>
                          ) : (
                            categories.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                {/* Show only category name, no images */}
                                {category.name}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="layer-10 hidden sm:block w-px h-4 bg-zinc-400" data-layer="10"></div>
                  {/* layer-10 = separator line */}
                  
                  <div ref={searchRef} className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search by product name, category, or tag…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                      className="layer-11 w-full py-1.5 text-zinc-500 text-sm sm:text-base font-normal leading-7 bg-transparent border-none outline-none focus:ring-0 placeholder:text-zinc-400"
                      aria-label="Search products"
                      data-layer="11"
                    />
                    
                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                        <div className="py-2">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Suggested Products
                          </div>
                          {searchSuggestions.map((product) => {
                            const productImage = product.images && product.images.length > 0 
                              ? product.images[0] 
                              : '/placeholder-image.png';
                            return (
                              <button
                                key={product.id}
                                onClick={() => handleSuggestionClick(product)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={productImage}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {product.category && <span>{product.category}</span>}
                                    {product.tags && product.tags.length > 0 && (
                                      <span className="ml-2">
                                        Tags: {product.tags.slice(0, 2).join(', ')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm font-semibold text-fuchsia-600 mt-1">
                                    ৳{product.price}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="layer-12 m-1.5 px-3 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                  aria-label="Search products"
                  data-layer="12"
                >
                  {/* layer-12 = search button */}
                  <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>
              </form>
            </div>

            {/* Right Actions - Hidden on mobile */}
            <div className="layer-13 hidden lg:flex justify-center items-center gap-4 sm:gap-6 lg:gap-8" data-layer="13">
              {/* layer-13 = right actions container */}
              
              <div className="layer-14 flex justify-start items-center gap-4 sm:gap-6 lg:gap-7" data-layer="14">
                {/* layer-14 = actions wrapper */}
                
                <div className="layer-15 flex justify-start items-center gap-4" data-layer="15">
                  {/* layer-15 = wishlist and cart container */}
                  
                  {/* Wishlist - Hidden on small mobile */}
                  <button
                    onClick={handleWishlistClick}
                    className="layer-16 hidden sm:block relative hover:opacity-80 transition-opacity"
                    aria-label="View wishlist"
                    data-layer="16"
                  >
                    {/* layer-16 = wishlist button */}
                    <Image
                      className="w-6 h-6"
                      src="/header/icons/fly.svg"
                      alt="Wishlist icon"
                      width={24}
                      height={24}
                      loading="lazy"
                    />
                  </button>

                  {/* Cart */}
                  <div 
                    className="layer-17 relative flex justify-start items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={handleCartClick}
                    role="button"
                    aria-label="View shopping cart"
                    data-layer="17"
                  >
                    {/* layer-17 = cart button */}
                    
                    <div className="layer-18 w-5 h-5 relative overflow-hidden" data-layer="18">
                      {/* layer-18 = cart icon container */}
                      <ShoppingCart className="w-5 h-5 text-neutral-800" strokeWidth={2} />
                    </div>
                    
                    <div className="layer-19 hidden sm:block justify-start text-neutral-800 text-base font-semibold leading-7" data-layer="19">
                      {/* layer-19 = cart text */}
                      Cart
                    </div>
                    
                    {cartCount > 0 && (
                      <div className="layer-20 w-[22px] h-[22px] p-[7.83px] left-[5px] top-[-10px] absolute bg-orange-500 rounded-full flex justify-center items-center" data-layer="20">
                        {/* layer-20 = cart count badge */}
                        <span className="text-white text-[8px] font-semibold leading-none">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Language Selector - Hidden on mobile */}
                <div ref={languageDropdownRef} className="layer-21 hidden md:flex justify-start items-center gap-[9px] relative" data-layer="21">
                  {/* layer-21 = language selector container */}
                  
                  <div 
                    className="layer-22 px-4 py-2.5 rounded-3xl border border-fuchsia-500 flex justify-center items-center gap-6 cursor-pointer hover:opacity-90 transition-opacity relative" 
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    role="button" 
                    aria-label="Change language" 
                    aria-expanded={isLanguageOpen}
                    data-layer="22"
                  >
                    {/* layer-22 = language selector button */}
                    
                    <div className="layer-23 flex justify-start items-center gap-2" data-layer="23">
                      {/* layer-23 = language flag and text */}
                      
                      <div className="layer-24 w-3.5 h-3.5 relative overflow-hidden" data-layer="24">
                        {/* layer-24 = flag icon container */}
                        <Image
                          src={selectedLanguage === 'en' ? "/header/icons/usflag.svg" : "/header/icons/bdflag.svg"}
                          alt={selectedLanguage === 'en' ? "English language flag" : "Bangla language flag"}
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="layer-25 justify-center text-neutral-600 text-sm font-normal leading-[14px]" data-layer="25">
                        {/* layer-25 = language text */}
                        {selectedLanguage === 'en' ? 'Eng' : 'বাংলা'}
                      </div>
                    </div>
                    
                    <div className="layer-26 w-3.5 h-3.5 relative overflow-hidden flex items-center justify-center" data-layer="26">
                      {/* layer-26 = language dropdown arrow */}
                      <Image
                        src="/header/icons/downicon.svg"
                        alt="Language dropdown"
                        width={14}
                        height={14}
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isLanguageOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Language Dropdown Menu */}
                  {isLanguageOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-fuchsia-500 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setSelectedLanguage('en');
                            setIsLanguageOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-fuchsia-50 transition-colors ${
                            selectedLanguage === 'en' ? 'bg-fuchsia-50 text-fuchsia-600' : 'text-gray-700'
                          }`}
                        >
                          <Image
                            src="/header/icons/usflag.svg"
                            alt="English"
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5"
                            loading="lazy"
                          />
                          <span>English</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLanguage('bn');
                            setIsLanguageOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-fuchsia-50 transition-colors ${
                            selectedLanguage === 'bn' ? 'bg-fuchsia-50 text-fuchsia-600' : 'text-gray-700'
                          }`}
                        >
                          <Image
                            src="/header/icons/bdflag.svg"
                            alt="Bangla"
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5"
                            loading="lazy"
                          />
                          <span>বাংলা</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sign In Button / Username Display */}
              {userData ? (
                <button
                  disabled
                  className="layer-27 h-[52px] px-6 sm:px-8 py-4 bg-fuchsia-500 rounded-[10px] flex justify-center items-center gap-2 opacity-90 cursor-not-allowed"
                  aria-label="Signed in as user"
                  data-layer="27"
                >
                  {/* layer-27 = sign in button */}
                  
                  <div className="layer-28 justify-start text-white text-sm sm:text-base font-semibold leading-4 whitespace-nowrap" data-layer="28">
                    {/* layer-28 = sign in button text */}
                    {userData.username}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => onOpenLoginModal?.('client')}
                  className="layer-27 h-[52px] px-6 sm:px-8 py-4 bg-fuchsia-500 rounded-[10px] flex justify-center items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  aria-label="Sign in to your account"
                  data-layer="27"
                >
                  {/* layer-27 = sign in button */}
                  
                  <div className="layer-28 justify-start text-white text-sm sm:text-base font-semibold leading-4 whitespace-nowrap" data-layer="28">
                    {/* layer-28 = sign in button text */}
                    Sign in
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Dropdown - Positioned relative to header */}
      <div className="relative">
        <CartDropdown
          isOpen={isCartOpen}
          onClose={handleCartClose}
          onQuantityChange={handleQuantityChange}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Wishlist Dropdown - Positioned relative to header */}
      <div className="relative">
        <WishlistDropdown
          isOpen={isWishlistOpen}
          onClose={handleWishlistClose}
          onRemoveItem={handleRemoveWishlistItem}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-50 z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer - Slides in from right */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-neutral-800">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:opacity-80 transition-opacity"
              aria-label="Close mobile menu"
            >
              <X className="w-6 h-6 text-neutral-800" strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {/* Shop Button */}
              <Link
                href="/client/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white rounded-lg font-semibold text-center hover:opacity-90 transition-opacity"
              >
                Shop
              </Link>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 mt-4">
                {navigationLinks.map((link, index) => {
                  if (link.onClick) {
                    return (
                      <button
                        key={index}
                        onClick={link.onClick}
                        className="w-full px-4 py-3 text-left text-neutral-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {link.text}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full px-4 py-3 text-left text-neutral-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {link.text}
                    </Link>
                  );
                })}
              </div>

              {/* Cart and Wishlist in Mobile Menu */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleWishlistClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-neutral-800 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <Image
                    className="w-5 h-5"
                    src="/header/icons/fly.svg"
                    alt="Wishlist"
                    width={20}
                    height={20}
                  />
                  Wishlist
                </button>
                <button
                  onClick={() => {
                    handleCartClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-neutral-800 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3 mt-2"
                >
                  <ShoppingCart className="w-5 h-5 text-neutral-800" strokeWidth={2} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Sign In Button in Mobile Menu */}
              {userData ? (
                <button
                  disabled
                  className="w-full mt-4 px-4 py-3 bg-fuchsia-500 text-white rounded-lg font-semibold opacity-90 cursor-not-allowed"
                >
                  {userData.username}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenLoginModal?.('client');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 px-4 py-3 bg-fuchsia-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
