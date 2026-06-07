import { useDarkModeContext } from '../hooks/DarkModeContext';

interface CurrencyToggleProps {
  currency: 'USD' | 'UYU';
  onToggle: () => void;
  activeColor?: 'blue' | 'green';
}

const colorMap = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
} as const;

export default function CurrencyToggle({ currency, onToggle, activeColor = 'blue' }: CurrencyToggleProps) {
  const { darkMode } = useDarkModeContext();
  const activeClass = colorMap[activeColor];

  return (
    <div className="flex justify-center">
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 shadow-sm flex`}>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={currency === 'USD'}
          aria-label="Mostrar en dólares"
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currency === 'USD'
              ? `${activeClass} text-white`
              : darkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          USD
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={currency === 'UYU'}
          aria-label="Mostrar en pesos uruguayos"
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currency === 'UYU'
              ? `${activeClass} text-white`
              : darkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          UYU
        </button>
      </div>
    </div>
  );
}
