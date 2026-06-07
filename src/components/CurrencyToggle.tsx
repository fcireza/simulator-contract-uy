import { useDarkModeContext } from '../hooks/DarkModeContext';

interface CurrencyToggleProps {
  currency: 'USD' | 'UYU';
  onToggle: () => void;
}

export default function CurrencyToggle({ currency, onToggle }: CurrencyToggleProps) {
  const { darkMode } = useDarkModeContext();

  const btnClass = (btnCurrency: 'USD' | 'UYU') =>
    `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
      currency === btnCurrency
        ? btnCurrency === 'UYU'
          ? 'bg-accent text-primary-800'
          : 'bg-primary-600 text-white'
        : darkMode
          ? 'text-gray-300 hover:text-white'
          : 'text-gray-600 hover:text-gray-800'
    }`;

  return (
    <div className="flex justify-center">
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 shadow-sm flex`}>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={currency === 'USD'}
          aria-label="Mostrar en dólares"
          className={btnClass('USD')}
        >
          USD
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={currency === 'UYU'}
          aria-label="Mostrar en pesos uruguayos"
          className={btnClass('UYU')}
        >
          UYU
        </button>
      </div>
    </div>
  );
}
