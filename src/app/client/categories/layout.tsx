import React from 'react';

/**
 * Layout for the categories page
 * Simple wrapper since MainLayout is used in the page component
 */
export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
