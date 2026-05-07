import { useState, useCallback } from 'react';

const DARK_MODE_KEY = 'simulator-it-dark-mode';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem(DARK_MODE_KEY);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(DARK_MODE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { darkMode, toggleDarkMode };
}
