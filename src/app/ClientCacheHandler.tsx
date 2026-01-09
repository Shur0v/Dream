'use client';

import { useEffect } from 'react';
import { clearClientAPICache, clearAPICache } from '@/lib/indexeddb/apiCache';

/**
 * Client Cache Handler Component
 * 
 * - Detects hard reload (Ctrl+Shift+R) and clears all cache
 * - Listens for cache invalidation events from dashboard
 */
export default function ClientCacheHandler() {
  useEffect(() => {
    // Check for hard reload flag
    const isHardReload = sessionStorage.getItem('hard_reload');
    
    if (isHardReload === 'true') {
      // Clear all cache on hard reload
      clearAPICache().catch(() => {});
      sessionStorage.removeItem('hard_reload');
      console.log('[ClientCacheHandler] Hard reload detected, cleared all cache');
    }

    // Listen for Ctrl+Shift+R keypress
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        // Set flag for next page load
        sessionStorage.setItem('hard_reload', 'true');
        // Clear cache immediately
        clearAPICache().catch(() => {});
        console.log('[ClientCacheHandler] Hard reload triggered (Ctrl+Shift+R), cleared all cache');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Listen for cache invalidation events from dashboard
    const handleCacheInvalidation = () => {
      clearClientAPICache().catch(() => {});
      console.log('[ClientCacheHandler] Cache invalidation event received, cleared client cache');
    };

    window.addEventListener('dashboard:invalidate-cache', handleCacheInvalidation);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dashboard:invalidate-cache', handleCacheInvalidation);
    };
  }, []);

  return null;
}

