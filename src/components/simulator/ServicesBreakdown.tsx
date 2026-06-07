import { useState } from 'react';
import { formatUyu } from '../../utils/format';

interface ServicesBreakdownProps {
  accountantCost?: number;
  escribanaCost?: number;
  facturacionCost?: number;
  /** Whether the escribana line is shown (SAS only) */
  showEscribana: boolean;
  darkMode: boolean;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function ServicesBreakdown({
  accountantCost = 0,
  escribanaCost = 0,
  facturacionCost = 0,
  showEscribana,
  darkMode,
}: ServicesBreakdownProps) {
  const [expanded, setExpanded] = useState(false);
  const total = accountantCost + escribanaCost + facturacionCost;

  if (total <= 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <ChevronIcon expanded={expanded} />
          </span>
          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Gastos Deducibles</span>
        </div>
        <span className="font-medium text-red-400">-{formatUyu(total)}</span>
      </button>
      {expanded && (
        <div className="ml-5 py-2 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
          {accountantCost > 0 && (
            <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>• Contador</span>
              <span className="text-red-400">-{formatUyu(accountantCost)}</span>
            </div>
          )}
          {showEscribana && escribanaCost > 0 && (
            <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>• Escribana</span>
              <span className="text-red-400">-{formatUyu(escribanaCost)}</span>
            </div>
          )}
          {facturacionCost > 0 && (
            <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>• Facturación</span>
              <span className="text-red-400">-{formatUyu(facturacionCost)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
