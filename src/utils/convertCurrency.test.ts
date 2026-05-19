import { describe, it, expect } from 'vitest';
import { convertCurrency } from './convertCurrency';

describe('convertCurrency', () => {
  describe('USD to UYU', () => {
    it('should convert 5000 USD to 200000 UYU at rate 40', () => {
      expect(convertCurrency(5000, 40, 'toUYU')).toBe(200000);
    });

    it('should convert 3000 USD to 118500 UYU at rate 39.5', () => {
      expect(convertCurrency(3000, 39.5, 'toUYU')).toBe(118500);
    });
  });

  describe('UYU to USD', () => {
    it('should convert 200000 UYU to 5000 USD at rate 40', () => {
      expect(convertCurrency(200000, 40, 'toUSD')).toBe(5000);
    });

    it('should convert 118500 UYU to 3000 USD at rate 39.5', () => {
      expect(convertCurrency(118500, 39.5, 'toUSD')).toBe(3000);
    });
  });

  describe('round-trip consistency', () => {
    it('should return original value after USD→UYU→USD', () => {
      const original = 5000;
      const rate = 40;
      const uyu = convertCurrency(original, rate, 'toUYU');
      const back = convertCurrency(uyu, rate, 'toUSD');
      expect(back).toBe(original);
    });

    it('should return original value after UYU→USD→UYU', () => {
      const original = 200000;
      const rate = 40;
      const usd = convertCurrency(original, rate, 'toUSD');
      const back = convertCurrency(usd, rate, 'toUYU');
      expect(back).toBe(original);
    });
  });

  describe('guard against invalid rates', () => {
    it('should return NaN for rate = 0', () => {
      expect(convertCurrency(5000, 0, 'toUYU')).toBeNaN();
    });

    it('should return NaN for negative rate', () => {
      expect(convertCurrency(5000, -40, 'toUYU')).toBeNaN();
    });

    it('should return NaN for NaN rate', () => {
      expect(convertCurrency(5000, NaN, 'toUYU')).toBeNaN();
    });
  });

  describe('floating-point precision', () => {
    it('should round to 2 decimal places', () => {
      // 3333.33 * 39.5 = 131666.535 → should round to 131666.54
      const result = convertCurrency(3333.33, 39.5, 'toUYU');
      expect(result).toBe(131666.54);
    });

    it('should handle fractional UYU→USD conversion', () => {
      // 131666.54 / 39.5 = 3333.330... → should round to 3333.33
      const result = convertCurrency(131666.54, 39.5, 'toUSD');
      expect(result).toBe(3333.33);
    });
  });
});
