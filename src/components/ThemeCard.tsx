import { useDarkModeContext } from '../hooks/DarkModeContext';

interface ThemeCardProps {
  children: React.ReactNode;
  /** Extra classes appended after the base card styles */
  className?: string;
}

/**
 * Reusable card wrapper that applies the default card styling
 * (`rounded-xl shadow-lg p-6`) with dark-mode-aware background.
 *
 * Usage:
 * ```tsx
 * <ThemeCard>content</ThemeCard>
 * <ThemeCard className="space-y-4 max-w-md mx-auto">content</ThemeCard>
 * ```
 */
export default function ThemeCard({ children, className = '' }: ThemeCardProps) {
  const { darkMode } = useDarkModeContext();
  return (
    <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${className}`}>{children}</div>
  );
}
