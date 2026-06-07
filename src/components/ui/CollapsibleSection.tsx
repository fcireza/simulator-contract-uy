import { type ReactNode, useState } from 'react';
import { useDarkModeContext } from '../../hooks/DarkModeContext';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Extra classes for the wrapper */
  className?: string;
  /** Extra node rendered after the chevron in the header row */
  headerRight?: ReactNode;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/**
 * A collapsible section with a clickable header (title + chevron).
 *
 * Drop-in replacement for the repeated pattern:
 * ```tsx
 * <button onClick={() => setOpen(!open)}>
 *   <span>Title</span>
 *   <svg className={open ? 'rotate-180' : ''}>...</svg>
 * </button>
 * {open && <Content />}
 * ```
 *
 * Uses darkMode context internally.
 */
export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerRight,
}: CollapsibleSectionProps) {
  const { darkMode } = useDarkModeContext();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full text-left font-medium ${labelClass} mb-2`}
      >
        <span>{title}</span>
        <div className="flex items-center gap-1">
          {headerRight}
          <ChevronIcon expanded={isOpen} />
        </div>
      </button>
      {isOpen && <div className="ml-2">{children}</div>}
    </div>
  );
}
