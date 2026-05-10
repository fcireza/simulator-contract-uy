import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is on a mobile device.
 * Uses matchMedia to efficiently detect breakpoint changes (fires only on crossing).
 * SSR-safe: guards against undefined window.
 */
export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // SSR-safe initial state - default to false until mounted
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mql = window.matchMedia('(max-width: 767px)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    // Set initial state from matchMedia
    setIsMobile(mql.matches);
    
    // Listen for breakpoint changes only
    mql.addEventListener('change', handleChange);
    
    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
};
