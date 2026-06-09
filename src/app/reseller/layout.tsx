'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  Link as LinkIcon, 
  ArrowDownToLine, 
  ArrowRightLeft, 
  BarChart3, 
  Settings, 
  Headset, 
  LogOut,
  Sparkles
} from 'lucide-react';

/**
 * Layout for reseller pages
 * Wraps reseller pages with reseller-specific layout and navigation
 */
export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState('Share your referral link, track every order, and request payouts from this dashboard.');

  useEffect(() => {
    let mounted = true;
    fetch('/api/platform-message', { cache: 'no-store' })
      .then((res) => res.json())
      .then((result) => {
        if (mounted && result?.data?.message) setAnnouncement(result.data.message);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);
  
  // Hide sidebar for auth pages
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register') || pathname === '/reseller';
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        {children}
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/reseller/dashboard' },
    { icon: ShoppingBag, label: 'My Orders', href: '/reseller/orders' },
    { icon: Wallet, label: 'Earnings', href: '/reseller/earnings' },
    { icon: LinkIcon, label: 'Referral Link', href: '/reseller/referrals' },
    { icon: ArrowDownToLine, label: 'Withdraw', href: '/reseller/withdraw' },
    { icon: ArrowRightLeft, label: 'Transactions', href: '/reseller/transactions' },
    { icon: BarChart3, label: 'Reports', href: '/reseller/reports' },
    { icon: Settings, label: 'Settings', href: '/reseller/settings' },
    { icon: Headset, label: 'Support', href: '/reseller/support' },
    { icon: LogOut, label: 'Logout', href: '/reseller/logout' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFC] font-sans flex">
      {/* Sidebar Navigation */}
      <div className="w-[300px] bg-gradient-to-b from-[#1c0d48] to-[#0f0727] min-h-screen flex-col text-white fixed left-0 top-0 h-full overflow-hidden hidden md:flex shadow-2xl z-50 border-r border-purple-900/30">
        <div className="p-7 flex items-center gap-3 border-b border-purple-950/40">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
             <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight tracking-wide">DreamShop</h2>
            <p className="text-[11px] text-purple-300/70 font-medium uppercase tracking-[0.18em]">Reseller Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={index}
                href={item.href} 
                className={`flex items-center gap-3.5 py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#5B21B6]/80 to-[#7C3AED]/80 text-white font-semibold shadow-md shadow-purple-900/40' 
                    : 'text-purple-200/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Increase your sales banner */}
        <div className="m-5 p-5 bg-gradient-to-br from-[#3b1e8a] via-[#5b21b6] to-[#7c3aed] rounded-2xl text-center relative overflow-hidden shadow-lg shadow-purple-950/50 border border-purple-500/20">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="flex justify-center mb-3 relative z-10">
            <Sparkles className="w-10 h-10 text-purple-100 opacity-90" />
          </div>
          <h4 className="text-white font-bold text-lg mb-1 relative z-10">Admin Message</h4>
          <p className="text-purple-100/85 text-xs mb-4 leading-5 relative z-10">{announcement}</p>
          <Link href="/reseller/dashboard" className="block w-full bg-white text-[#5B21B6] py-2.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors relative z-10 shadow-md">
            Open Dashboard
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-[280px] min-h-screen">
        {children}
      </div>
    </div>
  );
}
