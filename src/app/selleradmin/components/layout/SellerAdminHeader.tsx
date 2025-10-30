'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';

export const SellerAdminHeader: React.FC = () => {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1320px] mx-auto py-3.5 px-4 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/selleradmin" aria-label="Seller Admin Home">
            <Image
              src="/common/logo.svg"
              alt="DreamShop logo"
              width={190}
              height={69}
              className="w-[150px] sm:w-[190.5px] h-[50px] sm:h-[69.3px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button className="h-[44px] px-5 bg-fuchsia-500 text-white rounded-[10px] font-semibold text-sm hover:opacity-90 transition-opacity" type="button">Add Category</button>
          <button className="h-[44px] px-5 bg-fuchsia-500 text-white rounded-[10px] font-semibold text-sm hover:opacity-90 transition-opacity" type="button">Add Featured</button>
          <button className="h-[44px] px-5 bg-fuchsia-500 text-white rounded-[10px] font-semibold text-sm hover:opacity-90 transition-opacity" type="button">Add Best Selling</button>
        </div>

        {/* Right: Logout */}
        <div className="flex-shrink-0">
          <div className="rounded-[10px] p-[2px] bg-gradient-to-r from-[rgba(210,105,216,1)] to-[rgba(242,0,255,1)] inline-flex">
            <button className="h-[40px] sm:h-[44px] px-5 rounded-[8px] bg-white text-black font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-4" type="button">
              <LogOut className="w-5 h-5" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAdminHeader;


