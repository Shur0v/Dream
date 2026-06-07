'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Plus, FolderPlus, TrendingUp, Star, LogOut, Palette, 
  Image as ImageIcon, Megaphone, Tag, Sparkles, MessageSquare, Package, 
  ShoppingCart, Menu, ChevronLeft, Users, ShoppingBag 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminLogout } from '@/lib/adminAuth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * Dashboard Sidebar Component (Layer 2)
 * 
 * @description Provides navigation sidebar for seller admin dashboard
 * styled in a modern, premium deep purple theme with collapse/expand features
 */
export const Sidebar: React.FC<SidebarProps> = ({ className, isCollapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    router.push('/selleradmin/login');
  };

  const navItems: NavItem[] = [
    { 
      label: 'Dashboard', 
      href: '/selleradmin',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    { 
      label: 'Orders', 
      href: '/selleradmin/orders',
      icon: <ShoppingCart className="w-5 h-5" />
    },
    { 
      label: 'Add Product', 
      href: '/selleradmin/add-product',
      icon: <Plus className="w-5 h-5" />
    },
    { 
      label: 'All Products', 
      href: '/selleradmin/all-products',
      icon: <Package className="w-5 h-5" />
    },
    { 
      label: 'Add Category', 
      href: '/selleradmin/add-category',
      icon: <FolderPlus className="w-5 h-5" />
    },
    { 
      label: 'Add Color', 
      href: '/selleradmin/add-color',
      icon: <Palette className="w-5 h-5" />
    },
    { 
      label: 'Add Banner', 
      href: '/selleradmin/add-banner',
      icon: <ImageIcon className="w-5 h-5" />
    },
    { 
      label: 'Promo Banners', 
      href: '/selleradmin/promo-banners',
      icon: <Megaphone className="w-5 h-5" />
    },
    { 
      label: 'Discount Promo', 
      href: '/selleradmin/discount-promo',
      icon: <Tag className="w-5 h-5" />
    },
    { 
      label: 'Festival Offer', 
      href: '/selleradmin/festival-offer',
      icon: <Sparkles className="w-5 h-5" />
    },
    { 
      label: 'Fake Review', 
      href: '/selleradmin/fake-review',
      icon: <MessageSquare className="w-5 h-5" />
    },
    { 
      label: 'Best selling', 
      href: '/selleradmin/best-selling',
      icon: <TrendingUp className="w-5 h-5" />
    },
    { 
      label: 'Featured', 
      href: '/selleradmin/featured',
      icon: <Star className="w-5 h-5" />
    },
    { 
      label: 'Users', 
      href: '/selleradmin/users',
      icon: <Users className="w-5 h-5" />
    },
    { 
      label: 'Theme Control', 
      href: '/selleradmin/theme-control',
      icon: <Palette className="w-5 h-5" />
    },
  ];

  const isActive = (href: string) => {
    if (href === '/selleradmin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className={cn(
      'h-screen bg-gradient-to-b from-[#1c0d48] to-[#0f0727] flex flex-col justify-start items-stretch overflow-hidden fixed left-0 top-0 transition-all duration-300 z-40 border-r border-purple-900/30 shadow-2xl',
      isCollapsed ? 'w-20' : 'w-80',
      className
    )}>
      {/* Top Brand / Logo Section */}
      <div className={cn(
        'flex-shrink-0 p-6 flex items-center justify-between border-b border-purple-950/40',
        isCollapsed ? 'flex-col gap-4' : 'flex-row'
      )}>
        {isCollapsed ? (
          <Link href="/selleradmin" className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 text-white">
            <ShoppingBag className="w-6 h-6 text-purple-300" />
          </Link>
        ) : (
          <Link href="/selleradmin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-lg font-bold font-['Poppins'] leading-tight tracking-wider">DreamShop</span>
              <span className="text-purple-300/60 text-xs font-medium font-['Poppins']">Seller Panel</span>
            </div>
          </Link>
        )}

        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer text-purple-300 hover:text-white',
            isCollapsed ? 'w-full flex justify-center' : ''
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 sidebar-scrollbar">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group',
                isCollapsed ? 'justify-center w-12 mx-auto' : 'w-full',
                active
                  ? 'bg-gradient-to-r from-[#5B21B6]/80 to-[#7C3AED]/80 text-white shadow-md shadow-purple-900/40 font-semibold'
                  : 'text-purple-200/70 hover:bg-white/5 hover:text-white'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={cn(
                'flex-shrink-0 transition-transform group-hover:scale-110 duration-200',
                active ? 'text-white' : 'text-purple-300 group-hover:text-white'
              )}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Promo Banner Section (only when expanded) */}
      {!isCollapsed && (
        <div className="px-5 mb-4 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#3b1e8a] via-[#5b21b6] to-[#7c3aed] text-white flex flex-col items-center text-center gap-3.5 shadow-lg shadow-purple-950/50 border border-purple-500/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold font-['Poppins']">Increase Your Sales</div>
              <div className="text-[11px] text-purple-200/80 font-['Poppins'] leading-normal px-2">Share your referral link and earn commissions</div>
            </div>
            <Link 
              href="/selleradmin/discount-promo" 
              className="w-full py-2 bg-white text-[#5B21B6] text-xs font-bold rounded-xl hover:bg-purple-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center shadow-md shadow-purple-950/20"
            >
              View Referral Link
            </Link>
          </div>
        </div>
      )}

      {/* Logout Button (Bottom) */}
      <div className="p-4 border-t border-purple-950/40">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-red-500/10 text-purple-300 hover:text-red-400 w-full',
            isCollapsed ? 'justify-center' : ''
          )}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && (
            <span className="text-sm font-medium tracking-wide">
              Log Out
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
