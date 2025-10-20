import React from 'react';
import Footer from '@/components/layout/Footer';
import { MainHeader } from '@/components/layout/MainHeader';

/**
 * Layout for all client pages
 * Wraps client pages with client-specific layout and navigation
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MainHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
