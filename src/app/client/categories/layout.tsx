import React from 'react';

/**
 * Layout for the categories page
 * Wraps the categories page content with necessary structure
 */
export default function CategoriesLayout({
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
