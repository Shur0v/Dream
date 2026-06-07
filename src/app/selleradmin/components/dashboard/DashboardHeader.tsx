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
 * Styled with a clean white backdrop, subtle shadows, and premium layout structure
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationCount] = useState(3);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      'w-full bg-white backdrop-blur-md',
      'flex items-center justify-between px-6 md:px-8',
      'border-b border-zinc-100 shadow-sm shadow-zinc-100/40',
      'sticky top-0 z-30 transition-all duration-300',
      isCollapsed ? 'h-14' : 'h-20',
      className
    )}>
      {/* Left Section - Search Bar */}
      {!isCollapsed && (
        <div className="flex-1 max-w-md transition-all duration-300">
          <div className={cn(
            'relative w-full px-4 py-2 bg-[#F9FAFB] rounded-xl',
            'flex items-center gap-3',
            'border border-zinc-200/50 shadow-sm',
            'transition-all duration-300',
            isSearchFocused 
              ? 'bg-white border-purple-400 ring-4 ring-purple-100 shadow-md' 
              : 'hover:bg-[#F3F4F6] hover:border-zinc-300/80'
          )}>
            <Search className={cn(
              'w-4 h-4 transition-colors duration-200',
              isSearchFocused ? 'text-purple-600' : 'text-zinc-400'
            )} />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 text-zinc-700 text-sm font-medium font-['Poppins'] leading-5 outline-none bg-transparent placeholder:text-zinc-400"
            />
          </div>
        </div>
      )}

      {/* Right Section - Notifications & Profile */}
      {!isCollapsed && (
        <div className="flex items-center gap-5 transition-all duration-300">
          {/* Notification Icon */}
          <div className="relative">
            <button className={cn(
              'w-10 h-10 rounded-xl',
              'bg-[#F9FAFB]',
              'border border-zinc-200/40 shadow-sm',
              'flex items-center justify-center',
              'text-zinc-600 hover:text-purple-600',
              'hover:bg-white hover:shadow-md hover:border-purple-300',
              'transition-all duration-200',
              'group cursor-pointer'
            )}>
              <Bell className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </button>
            {notificationCount > 0 && (
              <span className={cn(
                'absolute -top-1 -right-1',
                'w-5 h-5 rounded-full',
                'bg-gradient-to-r from-red-500 to-red-600',
                'text-white text-[10px] font-bold',
                'flex items-center justify-center',
                'border-2 border-white shadow-sm',
                'animate-pulse'
              )}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3.5 pl-5 border-l border-zinc-100">
            <div className="relative group cursor-pointer">
              <div className={cn(
                'w-10 h-10 rounded-full',
                'bg-gradient-to-br from-purple-400 to-fuchsia-500',
                'p-[1.5px] shadow-md shadow-purple-500/10',
                'hover:shadow-lg hover:shadow-purple-500/20',
                'transition-all duration-300'
              )}>
                <div className="w-full h-full rounded-full bg-white p-[1px]">
                  <Image
                    src="https://images.pexels.com/photos/3236651/pexels-photo-3236651.jpeg"
                    alt="User profile"
                    width={38}
                    height={38}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {/* Online Status Indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            
            {/* User Info */}
            <div className="hidden md:flex flex-col items-start select-none">
              <span className="text-sm font-bold text-zinc-800 font-['Poppins'] leading-tight">
                Admin User
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold font-['Poppins'] tracking-wider uppercase">
                Administrator
              </span>
            </div>
            
            <button 
              onClick={toggleCollapse}
              className={cn(
                'hidden md:flex items-center justify-center',
                'w-7 h-7 rounded-lg',
                'text-zinc-400 hover:text-purple-600 hover:bg-zinc-50',
                'transition-all duration-200 cursor-pointer'
              )}
            >
              <ChevronDown className="w-4 h-4 rotate-180 transition-transform duration-200" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed State - Only Button */}
      {isCollapsed && (
        <div className="w-full flex items-center justify-center transition-all duration-300">
          <button 
            onClick={toggleCollapse}
            className={cn(
              'flex items-center justify-center',
              'w-8 h-8 rounded-lg',
              'text-zinc-500 hover:text-purple-600 hover:bg-zinc-50',
              'transition-all duration-200 cursor-pointer'
            )}
            aria-label={isCollapsed ? 'Expand header' : 'Collapse header'}
          >
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform duration-200',
              'rotate-[130deg]'
            )} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;


