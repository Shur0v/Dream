import React from 'react';

/**
 * Layout for admin auth pages (login, forgot-password)
 * No sidebar - clean auth experience
 */
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {children}
    </div>
  );
}
