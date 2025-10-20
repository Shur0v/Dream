import React from 'react';

/**
 * Layout for reseller auth pages (login, register)
 * No sidebar - clean auth experience
 */
export default function ResellerAuthLayout({
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
