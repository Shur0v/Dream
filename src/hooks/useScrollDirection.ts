/**
 * @fileoverview Ultra-simple scroll detection hook with zero blinking
 * Uses minimal state changes and CSS-only animations
 * 
 * @description This hook provides:
 * - Zero blinking scroll detection
 * - Minimal state changes
 * - Ultra-stable behavior
 * 
 * @author Your Name
 * @version 3.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Scroll direction type
 */
type ScrollDirection = 'up' | 'down' | null;

/**
 * Hook return type
 */
interface UseScrollDirectionReturn {
  /**
   * Current scroll direction
   */
  scrollDirection: ScrollDirection;
  
  /**
   * Current scroll position
   */
  scrollY: number;
  
  /**
   * Whether user is at the top of the page
   */
  isAtTop: boolean;
  
  /**
   * Whether header should be visible
   */
  shouldShowHeader: boolean;
}

/**
 * Ultra-simple scroll detection hook with zero blinking
 * 
 * @description Provides rock-solid scroll detection without any blinking
 * 
 * @param threshold - Minimum scroll distance to trigger direction change (default: 50)
 * @param debounceMs - Debounce interval for scroll events (default: 50)
 * 
 * @returns Object containing scroll direction, position, and visibility state
 * 
 * @example
 * ```tsx
 * const { shouldShowHeader, scrollDirection } = useScrollDirection();
 * ```
 */
export const useScrollDirection = (
  threshold: number = 50,
  debounceMs: number = 50
): UseScrollDirectionReturn => {
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [shouldShowHeader, setShouldShowHeader] = useState(true);
  
  // Refs for ultra-stable tracking
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<ScrollDirection>(null);
  const lastDirection = useRef<ScrollDirection>(null);
  const scrollCount = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
    
    setScrollY(currentScrollY);
    setIsAtTop(currentScrollY <= 20);
    
    // Only process if scroll difference is significant
    if (scrollDifference > threshold) {
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
      // Count consecutive scrolls in same direction
      if (direction === lastDirection.current) {
        scrollCount.current += 1;
      } else {
        scrollCount.current = 1;
        lastDirection.current = direction;
      }
      
      // Only change state if we have 2+ consecutive scrolls in same direction
      if (scrollCount.current >= 2) {
        if (direction === 'down' && !isAtTop) {
          // Scrolling down - hide header
          setShouldShowHeader(false);
          scrollDirection.current = 'down';
        } else if (direction === 'up') {
          // Scrolling up - show header
          setShouldShowHeader(true);
          scrollDirection.current = 'up';
        }
      }
      
      lastScrollY.current = currentScrollY;
    }
  }, [threshold, isAtTop]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(handleScroll, debounceMs);
    };

    // Add scroll event listener
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll, debounceMs]);

  return {
    scrollDirection: scrollDirection.current,
    scrollY,
    isAtTop,
    shouldShowHeader,
  };
};

export default useScrollDirection;