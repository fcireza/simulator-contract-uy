import { useState, useEffect } from 'react';

interface ExchangeRateResult {
  rate: number;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch the current USD → UYU exchange rate from a free API.
 * Falls back to the default (39.5) on error.
 */
export function useExchangeRate(defaultRate: number = 39.5): ExchangeRateResult & { rate: number } {
  const [rate, setRate] = useState<number>(defaultRate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try exchangingate-api.com (free, no key needed)
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const uyRate = data.rates?.UYU;
        if (!uyRate) throw new Error('UYU rate not found');

        setRate(Math.round(uyRate * 100) / 100);
      } catch (err) {
        if (import.meta.env.DEV) { console.warn('Failed to fetch exchange rate, using default:', err); }
        setError('No se pudo obtener la cotización actual, usando valor por defecto.');
        setRate(defaultRate);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [defaultRate]);

  return { rate, loading, error };
}
