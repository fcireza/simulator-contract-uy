/**
 * Convert a monetary value between USD and UYU.
 *
 * @param value - The amount to convert
 * @param rate - The exchange rate (UYU per 1 USD)
 * @param direction - 'toUYU' (multiply) or 'toUSD' (divide)
 * @returns The converted value rounded to 2 decimals, or NaN if rate is invalid
 */
export function convertCurrency(value: number, rate: number, direction: 'toUYU' | 'toUSD'): number {
  if (!rate || rate <= 0 || Number.isNaN(rate)) {
    return NaN;
  }

  const raw = direction === 'toUYU' ? value * rate : value / rate;
  return Math.round(raw * 100) / 100;
}
