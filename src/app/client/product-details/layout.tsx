import React from 'react';

/**
 * Layout for the product details page
 * Wraps the product details page content with necessary structure
 */
export default function ProductDetailsLayout({
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
