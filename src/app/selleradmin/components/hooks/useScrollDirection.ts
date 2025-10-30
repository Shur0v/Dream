import { useState, useEffect, useCallback, useRef } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionReturn {
  scrollDirection: ScrollDirection;
  scrollY: number;
  isAtTop: boolean;
  shouldShowHeader: boolean;
}

export const useScrollDirection = (
  threshold: number = 50,
  debounceMs: number = 50
): UseScrollDirectionReturn => {
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [shouldShowHeader, setShouldShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<ScrollDirection>(null);
  const lastDirection = useRef<ScrollDirection>(null);
  const scrollCount = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
    setScrollY(currentScrollY);
    setIsAtTop(currentScrollY <= 20);
    if (scrollDifference > threshold) {
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
      if (direction === lastDirection.current) {
        scrollCount.current += 1;
      } else {
        scrollCount.current = 1;
        lastDirection.current = direction;
      }
      if (scrollCount.current >= 2) {
        if (direction === 'down' && !isAtTop) {
          setShouldShowHeader(false);
          scrollDirection.current = 'down';
        } else if (direction === 'up') {
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
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, debounceMs);
    };
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll, debounceMs]);

  return { scrollDirection: scrollDirection.current, scrollY, isAtTop, shouldShowHeader };
};

export default useScrollDirection;


