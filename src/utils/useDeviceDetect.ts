import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is on a mobile device.
 * Uses window.innerWidth < 768px as breakpoint (common for tablets/mobiles).
 * Also checks userAgent as fallback.
 */
export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const widthCondition = window.innerWidth < 768;
      const userAgentCondition = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(widthCondition || userAgentCondition);
    };

    // Check on mount
    checkIfMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};