import React from 'react';

/**
 * Layout for the products page
 * Wraps the products page content with necessary structure
 */
export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
