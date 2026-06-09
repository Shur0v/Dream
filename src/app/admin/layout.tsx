'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Database, LayoutDashboard, LogOut, ShieldCheck, Store, Users } from 'lucide-react';
import { adminLogout, isAdminAuthenticated } from '@/lib/adminAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/forgot-password');

  useEffect(() => {
    if (isAuthPage) {
      setChecking(false);
      return;
    }

    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    setChecking(false);
  }, [isAuthPage, router]);

  if (isAuthPage) return <div className="min-h-screen bg-[#F7F7F7]">{children}</div>;

  if (checking) {
    return <div className="min-h-screen bg-[#F9FAFC] flex items-center justify-center text-slate-500">Checking admin access...</div>;
  }

  if (!isAdminAuthenticated()) return null;

  const navItems = [
    { label: 'Platform Scan', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Seller Admin', href: '/selleradmin', icon: Store },
    { label: 'Resellers', href: '/selleradmin/resellers', icon: ShieldCheck },
    { label: 'Payouts', href: '/selleradmin/payouts', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFC]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 flex-col bg-gradient-to-b from-[#1c0d48] to-[#0f0727] text-white shadow-2xl md:flex">
        <div className="border-b border-purple-950/40 p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 shadow-lg shadow-purple-500/30">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide">DreamShop</h1>
              <p className="text-[11px] uppercase tracking-[0.2em] text-purple-300/70">Main Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#5B21B6]/80 to-[#7C3AED]/80 text-white shadow-md shadow-purple-900/40'
                    : 'text-purple-200/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-purple-950/40 p-4">
          <button
            onClick={() => {
              adminLogout();
              router.push('/admin/login');
            }}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-purple-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-semibold">Log Out</span>
          </button>
        </div>
      </aside>

      <main className="min-h-screen md:ml-80">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-100 bg-white px-6 shadow-sm shadow-zinc-100/40 md:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-500">Main Admin</p>
            <h2 className="text-xl font-black text-slate-950">Full Platform Scanner</h2>
          </div>
          <div className="rounded-2xl bg-fuchsia-50 px-4 py-2 text-sm font-bold text-fuchsia-600">ID: admin</div>
        </header>
        <div className="p-5 md:p-10">{children}</div>
      </main>
    </div>
  );
}
