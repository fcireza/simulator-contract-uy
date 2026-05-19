import { createContext, useContext, type ReactNode } from 'react';
import { useDarkMode } from './useDarkMode';

interface DarkModeContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  return <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
}

export function useDarkModeContext(): DarkModeContextValue {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkModeContext must be used within a DarkModeProvider');
  }
  return context;
}
