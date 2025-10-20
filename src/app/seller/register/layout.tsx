import React from 'react';

/**
 * Layout for seller register page
 * No sidebar - clean auth experience
 */
export default function SellerRegisterLayout({
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
