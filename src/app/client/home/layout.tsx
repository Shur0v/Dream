import React from 'react';

/**
 * Layout for the client home page
 * Wraps the home page content with necessary providers and structure
 */
export default function HomeLayout({
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
