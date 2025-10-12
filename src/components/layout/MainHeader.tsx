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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };
  
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1320px] mx-auto py-3.5">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
          {/* Logo */}
          <div className="w-[190.5px] h-[69.3px] flex-shrink-0">
            <Link href="/">
              <Image
                className="w-full h-[69.3px] object-cover"
                src="/header/icons/logo.svg"
                alt="DreamShop"
                width={190}
                height={69}
                priority
              />
            </Link>
          </div>

          {/* Search and Actions Container */}
          <div className="w-full lg:w-auto lg:flex-1 lg:max-w-[974px] flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="w-full lg:w-[519px] bg-white rounded-xl border border-fuchsia-500">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="flex items-center gap-3 pl-6 flex-1">
                  <div className="hidden sm:flex items-center gap-1 cursor-pointer">
                    <div className="text-neutral-800 text-base font-medium leading-7 whitespace-nowrap">
                      All Categories
                    </div>
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Image
                        src="/header/icons/downicon.svg"
                        alt="dropdown"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-zinc-400"></div>
                  <input
                    type="text"
                    placeholder="Search by product name…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-1.5 text-zinc-500 text-sm sm:text-base font-normal leading-7 bg-transparent border-none outline-none focus:ring-0 placeholder:text-zinc-400"
                  />
                </div>
                <button
                  type="submit"
                  className="m-1.5 px-3 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 lg:gap-8">
              <div className="flex justify-start items-center gap-4 sm:gap-6 lg:gap-7">
                <div className="flex justify-start items-center gap-4">
                  {/* Wishlist - Hidden on small mobile */}
                  <button
                    onClick={onWishlistClick}
                    className="hidden sm:block relative hover:opacity-80 transition-opacity"
                    aria-label="Wishlist"
                  >
                    <Image
                      className="w-6 h-6"
                      src="/header/icons/fly.svg"
                      alt="wishlist"
                      width={24}
                      height={24}
                    />
                  </button>

                  {/* Cart */}
                  <div 
                    className="relative flex justify-start items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={onCartClick}
                  >
                    <div className="w-5 h-5 relative overflow-hidden">
                      <ShoppingCart className="w-5 h-5 text-neutral-800" strokeWidth={2} />
                    </div>
                    <div className="hidden sm:block justify-start text-neutral-800 text-base font-semibold leading-7">
                      Cart
                    </div>
                    {cartCount > 0 && (
                      <div className="w-[22px] h-[22px] p-[7.83px] left-[5px] top-[-10px] absolute bg-orange-500 rounded-full flex justify-center items-center">
                        <span className="text-white text-[8px] font-semibold leading-none">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Language Selector - Hidden on mobile */}
                <div className="hidden md:flex justify-start items-center gap-[9px]">
                  <div className="px-4 py-2.5 rounded-3xl border border-fuchsia-500 flex justify-center items-center gap-6 cursor-pointer hover:opacity-90 transition-opacity">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-3.5 h-3.5 relative overflow-hidden">
                        <Image
                          src="/header/icons/usflag.svg"
                          alt="language"
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5"
                        />
                      </div>
                      <div className="justify-center text-neutral-600 text-sm font-normal leading-[14px]">
                        En
                      </div>
                    </div>
                    <div className="w-3.5 h-3.5 relative overflow-hidden flex items-center justify-center">
                      <Image
                        src="/header/icons/downicon.svg"
                        alt="dropdown"
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <Link href="/auth/login">
                <div className="h-[52px] px-6 sm:px-8 py-4 bg-fuchsia-500 rounded-[10px] flex justify-center items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                  <div className="justify-start text-white text-sm sm:text-base font-semibold leading-4 whitespace-nowrap">
                    Sign in
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
