import React from 'react';

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
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
