import React from 'react';

/**
 * Layout for admin forgot-password page
 * No sidebar - clean auth experience
 */
export default function AdminForgotPasswordLayout({
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
