import React from 'react';
import Footer from '@/components/layout/Footer';

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
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
