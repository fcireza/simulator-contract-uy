import Tooltip from './Tooltip';

interface ExchangeRateFieldProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  error?: string | null;
  labelClass: string;
  inputClass: string;
}

export default function ExchangeRateField({
  value,
  onChange,
  loading = false,
  error = null,
  labelClass,
  inputClass,
}: ExchangeRateFieldProps) {
  return (
    <div>
      <label className={`block text-sm font-medium ${labelClass} mb-1`}>
        Tipo de Cambio (UYU/USD)
        {loading && <span className="ml-2 text-xs text-gray-500">Cargando...</span>}
        {!loading && !error && (
          <Tooltip content="Valor obtenido de exchangerate-api.com. Editable manualmente.">
            <span className="inline-flex items-center ml-1 cursor-help">
              <svg fill="none" stroke="currentColor" className="w-4 h-4 text-accent" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </Tooltip>
        )}
        {!loading && error && (
          <Tooltip content="No se pudo obtener la cotización actual. Usando valor por defecto (39.5).">
            <span className="inline-flex items-center ml-1">
              <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </span>
          </Tooltip>
        )}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(',', '.'))}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
        placeholder="39.5"
      />
      {error && <p className="mt-1 text-xs text-yellow-600">{error}</p>}
    </div>
  );
}
