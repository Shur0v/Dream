import React from 'react';

/**
 * Layout for reseller register page
 * No sidebar - clean auth experience
 */
export default function ResellerRegisterLayout({
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
