'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/adminAuth';

/**
 * Seller Admin Layout
 * 
 * @description Layout wrapper for seller admin pages
 * Protects all selleradmin routes with authentication
 * Note: DashboardLayout component handles its own header and sidebar
 */
export default function SellerAdminLayout({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/selleradmin/login') {
      setIsChecking(false);
      return;
    }

    // Check authentication for all other selleradmin routes
    if (!isAdminAuthenticated()) {
      router.push('/selleradmin/login');
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Show nothing while checking authentication
  if (isChecking) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render protected content if not authenticated (will redirect)
  if (pathname !== '/selleradmin/login' && !isAdminAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}


