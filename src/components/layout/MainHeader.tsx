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

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search } from 'lucide-react';
import { CartDropdown } from '../cart/CartDropdown';

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
  cartCount = 0,
  wishlistCount = 0,
  onSearch,
  onCartClick,
  onWishlistClick,
  onOpenLoginModal,
  onOpenRegisterModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState('');
  
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Health & Beauty',
    'Toys & Games',
    'Automotive',
    'Food & Beverages',
    'Office Supplies'
  ];
  
  const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

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
  
  return (
    <div className="father w-full bg-white" role="banner" data-layer="father">
      {/* father = full width main header section */}
      
      <div className="daughter max-w-[1320px] mx-auto py-3.5" data-layer="daughter">
        {/* daughter = design holder for entire main header section */}
        
        <div className="layer-1 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0" data-layer="1">
          {/* layer-1 = main header content container */}
          
          {/* Logo */}
          <div className="layer-2 w-[190.5px] h-[69.3px] flex-shrink-0" data-layer="2">
            {/* layer-2 = logo container */}
            <Link href="/" aria-label="DreamShop homepage">
              <Image
                className="w-full h-[69.3px] object-cover"
                src="/header/icons/logo.svg"
                alt="DreamShop logo"
                width={190}
                height={69}
                priority
                loading="eager"
              />
            </Link>
          </div>

          {/* Search and Actions Container */}
          <div className="layer-3 w-full lg:w-auto lg:flex-1 lg:max-w-[974px] flex flex-col lg:flex-row justify-between items-center gap-4" data-layer="3">
            {/* layer-3 = search and actions container */}
            
            {/* Search Bar */}
            <div className="layer-4 w-full lg:w-[519px] bg-white rounded-xl border border-fuchsia-500" data-layer="4">
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
                    
                    {/* Categories Dropdown Menu */}
                    {isCategoriesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                        <div className="py-2">
                          {Array.from({ length: 8 }, (_, index) => {
                            const randomCategory = getRandomCategory();
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  console.log(`Selected category: ${randomCategory}`);
                                  setIsCategoriesOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                {randomCategory}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="layer-10 hidden sm:block w-px h-4 bg-zinc-400" data-layer="10"></div>
                  {/* layer-10 = separator line */}
                  
                  <input
                    type="text"
                    placeholder="Search by product name…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="layer-11 flex-1 py-1.5 text-zinc-500 text-sm sm:text-base font-normal leading-7 bg-transparent border-none outline-none focus:ring-0 placeholder:text-zinc-400"
                    aria-label="Search products"
                    data-layer="11"
                  />
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

            {/* Right Actions */}
            <div className="layer-13 flex justify-center items-center gap-4 sm:gap-6 lg:gap-8" data-layer="13">
              {/* layer-13 = right actions container */}
              
              <div className="layer-14 flex justify-start items-center gap-4 sm:gap-6 lg:gap-7" data-layer="14">
                {/* layer-14 = actions wrapper */}
                
                <div className="layer-15 flex justify-start items-center gap-4" data-layer="15">
                  {/* layer-15 = wishlist and cart container */}
                  
                  {/* Wishlist - Hidden on small mobile */}
                  <button
                    onClick={onWishlistClick}
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
                <div className="layer-21 hidden md:flex justify-start items-center gap-[9px]" data-layer="21">
                  {/* layer-21 = language selector container */}
                  
                  <div className="layer-22 px-4 py-2.5 rounded-3xl border border-fuchsia-500 flex justify-center items-center gap-6 cursor-pointer hover:opacity-90 transition-opacity" role="button" aria-label="Change language" data-layer="22">
                    {/* layer-22 = language selector button */}
                    
                    <div className="layer-23 flex justify-start items-center gap-2" data-layer="23">
                      {/* layer-23 = language flag and text */}
                      
                      <div className="layer-24 w-3.5 h-3.5 relative overflow-hidden" data-layer="24">
                        {/* layer-24 = flag icon container */}
                        <Image
                          src="/header/icons/usflag.svg"
                          alt="English language flag"
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="layer-25 justify-center text-neutral-600 text-sm font-normal leading-[14px]" data-layer="25">
                        {/* layer-25 = language text */}
                        En
                      </div>
                    </div>
                    
                    <div className="layer-26 w-3.5 h-3.5 relative overflow-hidden flex items-center justify-center" data-layer="26">
                      {/* layer-26 = language dropdown arrow */}
                      <Image
                        src="/header/icons/downicon.svg"
                        alt="Language dropdown"
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
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
    </div>
  );
};

export default MainHeader;
