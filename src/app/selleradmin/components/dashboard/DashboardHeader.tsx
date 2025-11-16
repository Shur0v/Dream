'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  className?: string;
}

/**
 * Dashboard Header Component (Layer 2)
 * 
 * @description Modern top header bar with search, notifications, and user profile
 * Matches sidebar design with gradient, shadows, and smooth transitions
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationCount] = useState(3);

  return (
    <div className={cn(
      'w-full h-20 bg-gradient-to-r from-blue-50 to-blue-100/80 backdrop-blur-sm',
      'flex items-center justify-between px-6 md:px-8',
      'border-b border-blue-200/50 shadow-md shadow-blue-100/20',
      'sticky top-0 z-50',
      className
    )}>
      {/* Left Section - Search Bar */}
      <div className="flex-1 max-w-md">
        <div className={cn(
          'relative w-full px-4 py-2.5 bg-white rounded-xl',
          'flex items-center gap-3',
          'border border-blue-200/50 shadow-sm',
          'transition-all duration-300',
          isSearchFocused 
            ? 'ring-2 ring-fuchsia-500/30 shadow-lg shadow-fuchsia-500/10 border-fuchsia-300' 
            : 'hover:shadow-md hover:border-blue-300'
        )}>
          <Search className={cn(
            'w-5 h-5 transition-colors duration-200',
            isSearchFocused ? 'text-fuchsia-600' : 'text-gray-400'
          )} />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="flex-1 text-gray-700 text-sm font-normal font-['Poppins'] leading-5 outline-none bg-transparent placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative">
          <button className={cn(
            'w-11 h-11 p-2.5 rounded-xl',
            'bg-white/80 backdrop-blur-sm',
            'border border-blue-200/50 shadow-sm',
            'flex items-center justify-center',
            'text-gray-600 hover:text-fuchsia-600',
            'hover:bg-white hover:shadow-md hover:border-fuchsia-300',
            'transition-all duration-200',
            'group'
          )}>
            <Bell className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          </button>
          {notificationCount > 0 && (
            <span className={cn(
              'absolute -top-1 -right-1',
              'w-5 h-5 rounded-full',
              'bg-gradient-to-r from-red-500 to-red-600',
              'text-white text-xs font-semibold',
              'flex items-center justify-center',
              'border-2 border-white shadow-sm',
              'animate-pulse'
            )}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-blue-200/50">
          <div className="relative group">
            <div className={cn(
              'w-12 h-12 rounded-full',
              'bg-gradient-to-br from-fuchsia-400 to-blue-500',
              'p-0.5 shadow-lg shadow-fuchsia-500/20',
              'hover:shadow-xl hover:shadow-fuchsia-500/30',
              'transition-all duration-300',
              'cursor-pointer'
            )}>
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <Image
                  src="https://images.pexels.com/photos/3236651/pexels-photo-3236651.jpeg"
                  alt="User profile"
                  width={44}
                  height={44}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>
            {/* Online Status Indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          
          {/* User Info Dropdown */}
          <button className={cn(
            'hidden md:flex flex-col items-start',
            'hover:opacity-80 transition-opacity duration-200',
            'cursor-pointer group'
          )}>
            <span className="text-sm font-semibold text-gray-800 font-['Poppins']">
              Admin User
            </span>
            <span className="text-xs text-gray-500 font-['Poppins']">
              Administrator
            </span>
          </button>
          
          <button className={cn(
            'hidden md:flex items-center justify-center',
            'w-8 h-8 rounded-lg',
            'text-gray-500 hover:text-fuchsia-600',
            'hover:bg-white/60',
            'transition-all duration-200'
          )}>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

