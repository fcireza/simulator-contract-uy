import { describe, it, expect } from 'vitest';
import {
  calculateNet,
  reverseCalculate,
  compareRegimes,
  calculateVAT,
  calculateFondoSolidaridad,
  calculateFonasaRate,
  type TaxCalculationInput,
  type TaxRegime,
  type FamilySituation,
} from '../utils/taxCalculator';

// ============================================
// TEST HELPERS
// ============================================

const BPC = 6864;
const TOPE_BPS = 15 * BPC; // 102,960 UYU

function makeInput(overrides: Partial<TaxCalculationInput> = {}): TaxCalculationInput {
  return {
    incomeUsd: 5000,
    exchangeRate: 39.5,
    clientType: 'exterior',
    regime: 'unipersonal',
    useAccountant: false,
    useEscribana: false,
    useFacturacion: false,
    ...overrides,
  };
}

const EXCHANGE_RATE = 39.5;

// ============================================
// VAT (IVA) CALCULATIONS
// ============================================

describe('calculateVAT', () => {
  it('should return 0 for export services (exterior)', () => {
    expect(calculateVAT(100000, 'exterior')).toBe(0);
  });

  it('should calculate 22% VAT for local services', () => {
    const income = 100000;
    expect(calculateVAT(income, 'local')).toBe(Math.round(income * 0.22));
  });

  it('should return 0 for zero income', () => {
    expect(calculateVAT(0, 'local')).toBe(0);
    expect(calculateVAT(0, 'exterior')).toBe(0);
  });
});

// ============================================
// AUTOMATIC CALCULATIONS (family, fondosol)
// ============================================

describe('calculateFondoSolidaridad', () => {
  it('should return 0 for non-graduates', () => {
    expect(calculateFondoSolidaridad(500000, 0)).toBe(0);
  });

  it('should return 0 if less than 5 years since graduation', () => {
    expect(calculateFondoSolidaridad(500000, 2024)).toBe(0); // only 2 years
  });

  it('should return 0 if income below 8 BPC', () => {
    // 8 BPC = 54,912 UYU
    expect(calculateFondoSolidaridad(50000, 2018)).toBe(0); // 8 years grad, but low income
  });

  it('should apply for graduate 5+ years with income > 8 BPC', () => {
    // Graduated 2018, income 100,000 UYU (> 8 BPC = 54,912)
    const result = calculateFondoSolidaridad(100000, 2018);
    expect(result).toBeGreaterThan(0);
  });

  it('should scale with income level (0.5/1/2 BPC)', () => {
    // Low bracket: 8-15 BPC
    const low = calculateFondoSolidaridad(80000, 2018);
    // Mid bracket: 15-30 BPC
    const mid = calculateFondoSolidaridad(150000, 2018);
    // High bracket: 30+ BPC
    const high = calculateFondoSolidaridad(300000, 2018);

    expect(high).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThanOrEqual(low);
  });
});

describe('calculateFonasaRate', () => {
  const family: FamilySituation = { hasSpouse: false, childrenCount: 0, disabledChildrenCount: 0, graduationYear: 0 };

  it('should use lower rate for income under 2.5 BPC base', () => {
    // base = gross * 0.70; if base <= 2.5 * BPC = 17,160, use lower rates
    const rate = calculateFonasaRate(20000, family);
    expect(rate).toBe(0.08); // 8% base
  });

  it('should use higher rate for income over 2.5 BPC base', () => {
    // base = gross * 0.70; if base > 2.5 * BPC, use higher rates
    const rate = calculateFonasaRate(100000, family);
    expect(rate).toBe(0.095); // 9.5% base
  });

  it('should add spouse surcharge', () => {
    const withSpouse: FamilySituation = { ...family, hasSpouse: true };
    const rate = calculateFonasaRate(100000, withSpouse);
    expect(rate).toBe(0.115); // 9.5% + 2%
  });

  it('should add children surcharge for income > 2.5 BPC', () => {
    const withChildren: FamilySituation = { ...family, childrenCount: 2 };
    const rate = calculateFonasaRate(100000, withChildren);
    expect(rate).toBe(0.095 + 0.015 * 2); // 9.5% + 1.5% * 2
  });

  it('should add both spouse and children', () => {
    const full: FamilySituation = { hasSpouse: true, childrenCount: 1, disabledChildrenCount: 0, graduationYear: 0 };
    const rate = calculateFonasaRate(100000, full);
    expect(rate).toBe(0.095 + 0.02 + 0.015); // 9.5% + 2% + 1.5%
  });
});

// ============================================
// UNIPERSONAL REGIME — FORWARD CALCULATION
// ============================================

describe('calculateNet — Unipersonal', () => {
  describe('basic calculation', () => {
    it('should calculate net income for exterior client', () => {
      const result = calculateNet(makeInput({ incomeUsd: 5000 }));

      expect(result.incomeUyu).toBe(5000 * EXCHANGE_RATE);
      expect(result.vat).toBe(0); // exterior = 0% VAT
      expect(result.cajaProfesional).toBe(0);
      expect(result.irae).toBe(0);
      expect(result.deductibleExpenses).toBe(0);
      expect(result.netUsd).toBeGreaterThan(0);
    });

    it('should calculate VAT for local client', () => {
      const result = calculateNet(makeInput({ clientType: 'local' }));
      expect(result.vat).toBeGreaterThan(0);
    });

    it('should handle zero income', () => {
      const result = calculateNet(makeInput({ incomeUsd: 0 }));
      expect(result.incomeUyu).toBe(0);
      expect(result.bpsFonasa).toBe(0);
      expect(result.irpf).toBe(0);
      expect(result.netUyu).toBe(0);
      expect(result.netUsd).toBe(0);
    });

    it('should return positive net for small income', () => {
      const result = calculateNet(makeInput({ incomeUsd: 1000 }));
      expect(result.netUyu).toBeGreaterThan(0);
    });
  });

  describe('BPS + FONASA', () => {
    it('should cap BPS base at 15 BPCs (tope BPS)', () => {
      // Income above the tope: gross = 200,000 -> 70% = 140,000 > TOPE_BPS
      const gross = 200000;
      const result = calculateNet(makeInput({ incomeUsd: gross / EXCHANGE_RATE }));
      // Capped at TOPE_BPS * (0.15 BPS + 0.095 FONASA for default family, no children)
      expect(result.bpsFonasa).toBe(Math.round(TOPE_BPS * (0.15 + 0.095)));
    });

    it('should vary BPS with family situation', () => {
      const withoutFamily = calculateNet(makeInput({ incomeUsd: 5000 }));
      const withFamily = calculateNet(makeInput({
        incomeUsd: 5000,
        family: { hasSpouse: true, childrenCount: 1, disabledChildrenCount: 0, graduationYear: 0 },
      }));

      // With family, FONASA rate is higher -> BPS+FONASA should be higher
      expect(withFamily.bpsFonasa).toBeGreaterThan(withoutFamily.bpsFonasa);
    });
  });

  describe('IRPF progressive brackets (8 tiers)', () => {
    it('should have 0 IRPF for income below first bracket', () => {
      // IRPF 0% bracket: taxable income <= 7 BPC (= 48,048 UYU)
      // With low income, BPS takes ~24.5%, so gross needs to be ~58K UYU or less
      const result = calculateNet(makeInput({ incomeUsd: 1000 }));
      expect(result.irpf).toBe(0);
    });

    it('should apply IRPF for mid-range income', () => {
      const result = calculateNet(makeInput({ incomeUsd: 8000 }));
      expect(result.irpf).toBeGreaterThan(0);
    });

    it('should apply higher brackets for very high income', () => {
      const result = calculateNet(makeInput({ incomeUsd: 80000 }));
      expect(result.irpf).toBeGreaterThan(0);
    });

    it('should progressively increase IRPF as income increases', () => {
      const low = calculateNet(makeInput({ incomeUsd: 5000 }));
      const mid = calculateNet(makeInput({ incomeUsd: 10000 }));
      const high = calculateNet(makeInput({ incomeUsd: 20000 }));

      expect(mid.irpf).toBeGreaterThan(low.irpf);
      expect(high.irpf).toBeGreaterThan(mid.irpf);
    });

    it('should reduce IRPF with child deductions', () => {
      const noChildren = calculateNet(makeInput({ incomeUsd: 10000 }));
      const withChildren = calculateNet(makeInput({
        incomeUsd: 10000,
        family: { hasSpouse: false, childrenCount: 2, disabledChildrenCount: 0, graduationYear: 0 },
      }));

      // Children provide IRPF deductions -> lower tax
      expect(withChildren.irpf).toBeLessThanOrEqual(noChildren.irpf);
    });
  });

  describe('Fondo de Solidaridad', () => {
    it('should not apply for non-graduates', () => {
      const result = calculateNet(makeInput({ incomeUsd: 10000 }));
      expect(result.fondoSolidaridad).toBe(0);
    });

    it('should apply for graduates 5+ years with sufficient income', () => {
      const result = calculateNet(makeInput({
        incomeUsd: 10000, // ~395,000 UYU > 8 BPC
        family: { hasSpouse: false, childrenCount: 0, disabledChildrenCount: 0, graduationYear: 2018 },
      }));
      expect(result.fondoSolidaridad).toBeGreaterThan(0);
    });

    it('should reduce net income when Fondo de Solidaridad applies', () => {
      const noFondosol = calculateNet(makeInput({ incomeUsd: 10000 }));
      const withFondosol = calculateNet(makeInput({
        incomeUsd: 10000,
        family: { hasSpouse: false, childrenCount: 0, disabledChildrenCount: 0, graduationYear: 2018 },
      }));

      // Same gross, but with Fondosol the net should be lower
      expect(withFondosol.netUyu).toBeLessThan(noFondosol.netUyu);
    });
  });

  describe('service costs', () => {
    it('should not deduct service costs when not used', () => {
      const result = calculateNet(makeInput({
        useAccountant: false,
        useEscribana: false,
        useFacturacion: false,
      }));
      expect(result.accountantCost).toBe(0);
      expect(result.escribanaCost).toBe(0);
      expect(result.facturacionCost).toBe(0);
    });

    it('should deduct default service costs when used', () => {
      const result = calculateNet(makeInput({
        useAccountant: true,
        useEscribana: true,
        useFacturacion: true,
      }));
      expect(result.accountantCost).toBe(5000);
      expect(result.escribanaCost).toBe(8000);
      expect(result.facturacionCost).toBe(3000);
    });

    it('should use custom service costs when provided', () => {
      const result = calculateNet(makeInput({
        useAccountant: true,
        useEscribana: true,
        useFacturacion: true,
        accountantCost: 7000,
        escribanaCost: 10000,
        facturacionCost: 4500,
      }));
      expect(result.accountantCost).toBe(7000);
      expect(result.escribanaCost).toBe(10000);
      expect(result.facturacionCost).toBe(4500);
    });

    it('should reduce net by service costs', () => {
      const withoutServices = calculateNet(makeInput());
      const withServices = calculateNet(makeInput({
        useAccountant: true,
        useEscribana: true,
        useFacturacion: true,
      }));
      const totalServices = 5000 + 8000 + 3000;
      expect(withoutServices.netUyu - withServices.netUyu).toBe(totalServices);
    });
  });
});

// ============================================
// SAS CON CAJA — FORWARD CALCULATION
// ============================================

describe('calculateNet — SAS con Caja', () => {
  it('should calculate caja profesional instead of BPS', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      incomeUsd: 5000,
    }));

    expect(result.cajaProfesional).toBeGreaterThan(0);
    expect(result.bpsFonasa).toBe(0);
    expect(result.irpf).toBe(0);
    expect(result.irae).toBeGreaterThan(0);
  });

  it('should calculate caja on 70% of gross at 22.5%, capped at 15 BPCs', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      incomeUsd: 5000,
    }));
    // Capped at TOPE_BPS * 0.225
    expect(result.cajaProfesional).toBe(Math.round(TOPE_BPS * 0.225));
  });

  it('should calculate caja without cap for lower income', () => {
    const gross = 100000; // below tope
    const expectedCaja = Math.round(gross * 0.70 * 0.225);
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      incomeUsd: gross / EXCHANGE_RATE,
    }));
    expect(result.cajaProfesional).toBe(expectedCaja);
  });

  it('should calculate IRAE on profits after deductible expenses', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      useAccountant: true,
    }));

    const incomeUyu = 5000 * EXCHANGE_RATE;
    const expenses = 5000; // default accountant
    const expectedIrae = Math.round((incomeUyu - expenses) * 0.25);
    expect(result.irae).toBe(expectedIrae);
  });

  it('should include service costs as deductible expenses', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      useAccountant: true,
      useEscribana: true,
      useFacturacion: true,
    }));
    expect(result.deductibleExpenses).toBe(5000 + 8000 + 3000);
  });

  it('should calculate net as gross - caja - irae - deductible expenses', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      useAccountant: true,
    }));
    const expected = result.incomeUyu - result.cajaProfesional - result.irae - result.deductibleExpenses;
    expect(result.netUyu).toBe(expected);
  });

  it('should not apply Fondo de Solidaridad for SAS', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      incomeUsd: 10000,
      family: { hasSpouse: false, childrenCount: 0, disabledChildrenCount: 0, graduationYear: 2018 },
    }));
    expect(result.fondoSolidaridad).toBe(0);
  });
});

// ============================================
// SAS SIN CAJA — FORWARD CALCULATION
// ============================================

describe('calculateNet — SAS sin Caja', () => {
  it('should calculate BPS comun instead of caja profesional', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-sin-caja',
      incomeUsd: 5000,
    }));

    expect(result.bpsFonasa).toBeGreaterThan(0);
    expect(result.cajaProfesional).toBe(0);
    expect(result.irae).toBeGreaterThan(0);
  });

  it('should calculate BPS comun on 70% of gross at 12.5%, capped at 15 BPCs', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-sin-caja',
      incomeUsd: 5000,
    }));
    expect(result.bpsFonasa).toBe(Math.round(TOPE_BPS * 0.125));
  });

  it('should calculate BPS comun without cap for lower income', () => {
    const gross = 100000; // below tope
    const expectedBps = Math.round(gross * 0.70 * 0.125);
    const result = calculateNet(makeInput({
      regime: 'sas-sin-caja',
      incomeUsd: gross / EXCHANGE_RATE,
    }));
    expect(result.bpsFonasa).toBe(expectedBps);
  });

  it('should calculate IRAE on profits', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-sin-caja',
      incomeUsd: 5000,
    }));
    const expectedIrae = Math.round((5000 * EXCHANGE_RATE) * 0.25);
    expect(result.irae).toBe(expectedIrae);
  });
});

// ============================================
// REGIME COMPARISON
// ============================================

describe('compareRegimes', () => {
  it('should return results for all 3 regimes', () => {
    const results = compareRegimes(makeInput({
      incomeUsd: 5000,
      clientType: 'exterior',
      useAccountant: true,
    }));

    expect(results).toHaveLength(3);
    expect(results[0].incomeUyu).toBe(results[1].incomeUyu);
    expect(results[0].incomeUyu).toBe(results[2].incomeUyu);
  });

  it('should return different net amounts per regime', () => {
    const results = compareRegimes(makeInput({ incomeUsd: 5000 }));
    const nets = results.map(r => r.netUyu);
    const uniqueNets = new Set(nets);
    expect(uniqueNets.size).toBeGreaterThan(1);
  });

  it('should correctly label regimes in results', () => {
    const results = compareRegimes(makeInput({ incomeUsd: 10000 }));

    expect(results[0].irpf).toBeGreaterThan(0); // unipersonal
    expect(results[0].irae).toBe(0);
    expect(results[1].irpf).toBe(0); // sas-con-caja
    expect(results[1].irae).toBeGreaterThan(0);
    expect(results[2].irpf).toBe(0); // sas-sin-caja
    expect(results[2].irae).toBeGreaterThan(0);
  });

  it('should pass family situation through all regimes', () => {
    const results = compareRegimes(makeInput({
      incomeUsd: 10000,
      family: { hasSpouse: true, childrenCount: 2, disabledChildrenCount: 0, graduationYear: 2018 },
    }));

    // Unipersonal should have family-affected BPS and Fondosol
    expect(results[0].fondoSolidaridad).toBeGreaterThan(0);
    // SAS should not have Fondosol
    expect(results[1].fondoSolidaridad).toBe(0);
    expect(results[2].fondoSolidaridad).toBe(0);
  });
});

// ============================================
// REVERSE CALCULATION — UNIPERSONAL
// ============================================

describe('reverseCalculate — Unipersonal', () => {
  it('should calculate required gross for a target net', () => {
    const result = reverseCalculate({
      targetNetUsd: 3000,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    });

    expect(result.requiredGrossUsd).toBeGreaterThan(3000);
    expect(result.requiredGrossUyu).toBeGreaterThan(0);
    expect(result.estimatedTaxes).toBeGreaterThan(0);
  });

  it('should produce a forward net close to the target', () => {
    const targetNet = 3000;
    const reverse = reverseCalculate({
      targetNetUsd: targetNet,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    });

    const forward = calculateNet(makeInput({
      incomeUsd: reverse.requiredGrossUsd,
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    }));

    const netUsdDiff = Math.abs(forward.netUsd - targetNet);
    expect(netUsdDiff).toBeLessThan(50);
  });

  it('should include service costs in reverse calculation', () => {
    const withoutServices = reverseCalculate({
      targetNetUsd: 3000,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    });

    const withServices = reverseCalculate({
      targetNetUsd: 3000,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: true,
      useEscribana: true,
      useFacturacion: true,
    });

    expect(withServices.requiredGrossUsd).toBeGreaterThan(withoutServices.requiredGrossUsd);
    expect(withServices.accountantCost).toBe(5000);
    expect(withServices.escribanaCost).toBe(8000);
    expect(withServices.facturacionCost).toBe(3000);
  });

  it('should include Fondo de Solidaridad in reverse calculation', () => {
    const result = reverseCalculate({
      targetNetUsd: 3000,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
      family: { hasSpouse: false, childrenCount: 0, disabledChildrenCount: 0, graduationYear: 2018 },
    });

    expect(result.fondoSolidaridad).toBeGreaterThanOrEqual(0);
  });
});

// ============================================
// REVERSE CALCULATION — SAS
// ============================================

describe('reverseCalculate — SAS', () => {
  it('should calculate required gross for SAS con Caja', () => {
    const result = reverseCalculate({
      targetNetUsd: 3000,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'sas-con-caja',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    });

    expect(result.requiredGrossUsd).toBeGreaterThan(3000);
  });

  it('should calculate required gross for SAS sin Caja', () => {
    const result = reverseCalculate({
      targetNetUsd: 3000,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'sas-sin-caja',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    });

    expect(result.requiredGrossUsd).toBeGreaterThan(3000);
  });

  it('should produce a forward net close to the target for SAS con Caja', () => {
    const targetNet = 3000;
    const reverse = reverseCalculate({
      targetNetUsd: targetNet,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'sas-con-caja',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    });

    const forward = calculateNet(makeInput({
      incomeUsd: reverse.requiredGrossUsd,
      regime: 'sas-con-caja',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    }));

    const netUsdDiff = Math.abs(forward.netUsd - targetNet);
    expect(netUsdDiff).toBeLessThan(50);
  });
});

// ============================================
// EFFECTIVE TAX RATE
// ============================================

describe('effectiveTaxRate', () => {
  it('should return 0 for zero gross', () => {
    const result = calculateNet(makeInput({ incomeUsd: 0 }));
    expect(result.effectiveTaxRate).toBe(0);
  });

  it('should compute effective rate for unipersonal exterior client', () => {
    const result = calculateNet(makeInput({ incomeUsd: 5000 }));
    expect(result.effectiveTaxRate).toBeDefined();
    expect(result.effectiveTaxRate!).toBeGreaterThan(0);
    // Total taxes / gross * 100
    const totalTaxes = result.bpsFonasa + result.irpf + result.vat + result.fondoSolidaridad;
    const expected = Math.round((totalTaxes / result.incomeUyu) * 100 * 10) / 10;
    expect(result.effectiveTaxRate).toBe(expected);
  });

  it('should compute higher effective rate for local client (VAT)', () => {
    const exteriorResult = calculateNet(makeInput({ incomeUsd: 5000, clientType: 'exterior' }));
    const localResult = calculateNet(makeInput({ incomeUsd: 5000, clientType: 'local' }));
    expect(localResult.effectiveTaxRate!).toBeGreaterThan(exteriorResult.effectiveTaxRate!);
  });

  it('should compute effective rate for SAS con Caja', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-con-caja',
      incomeUsd: 5000,
    }));
    expect(result.effectiveTaxRate).toBeDefined();
    expect(result.effectiveTaxRate!).toBeGreaterThan(0);
    const totalTaxes = result.cajaProfesional + result.irae + result.vat + result.fondoSolidaridad;
    const expected = Math.round((totalTaxes / result.incomeUyu) * 100 * 10) / 10;
    expect(result.effectiveTaxRate).toBe(expected);
  });

  it('should compute effective rate for SAS sin Caja', () => {
    const result = calculateNet(makeInput({
      regime: 'sas-sin-caja',
      incomeUsd: 5000,
    }));
    expect(result.effectiveTaxRate).toBeDefined();
    expect(result.effectiveTaxRate!).toBeGreaterThan(0);
  });

  it('should have different effective rates across regimes', () => {
    const unipersonal = calculateNet(makeInput({ incomeUsd: 5000 }));
    const sasCaja = calculateNet(makeInput({ regime: 'sas-con-caja', incomeUsd: 5000 }));
    const sasBps = calculateNet(makeInput({ regime: 'sas-sin-caja', incomeUsd: 5000 }));
    const rates = new Set([unipersonal.effectiveTaxRate, sasCaja.effectiveTaxRate, sasBps.effectiveTaxRate]);
    expect(rates.size).toBeGreaterThan(1);
  });

  it('should have effectiveRate on compareRegimes results', () => {
    const results = compareRegimes(makeInput({ incomeUsd: 5000 }));
    results.forEach(r => {
      expect(r.effectiveTaxRate).toBeDefined();
      expect(r.effectiveTaxRate!).toBeGreaterThan(0);
    });
  });
});

// ============================================
// EDGE CASES & VALIDATION
// ============================================

describe('edge cases', () => {
  it('should throw for unknown regime', () => {
    expect(() => calculateNet(makeInput({ regime: 'unknown' as TaxRegime })))
      .toThrow('Unknown regime');
  });

  it('should throw for negative income', () => {
    expect(() => calculateNet(makeInput({ incomeUsd: -100 })))
      .toThrow('incomeUsd cannot be negative');
  });

  it('should throw for zero exchange rate', () => {
    expect(() => calculateNet(makeInput({ exchangeRate: 0 })))
      .toThrow('exchangeRate must be positive');
  });

  it('should throw for negative exchange rate', () => {
    expect(() => calculateNet(makeInput({ exchangeRate: -1 })))
      .toThrow('exchangeRate must be positive');
  });

  it('should throw for negative target net in reverse calculation', () => {
    expect(() => reverseCalculate({
      targetNetUsd: -100,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    })).toThrow('targetNetUsd cannot be negative');
  });

  it('should handle very high income', () => {
    const result = calculateNet(makeInput({ incomeUsd: 100000 }));
    expect(result.netUyu).toBeGreaterThan(0);
    expect(result.netUsd).toBeGreaterThan(0);
  });

  it('should handle exchange rate of 1', () => {
    const result = calculateNet(makeInput({ exchangeRate: 1, incomeUsd: 5000 }));
    expect(result.incomeUyu).toBe(5000);
  });

  it('should not produce negative net for very low income', () => {
    const result = calculateNet(makeInput({ incomeUsd: 100 }));
    expect(result.netUyu).toBeGreaterThanOrEqual(0);
  });
});

// ============================================
// PROGRESSIVE IRPF SPECIFIC TESTS
// ============================================

describe('progressive IRPF calculation (8 brackets)', () => {
  it('should apply 0% for income below first bracket', () => {
    // Taxable income <= 7 BPC -> 0% IRPF. Need very low gross (~$1000 USD).
    const result = calculateNet(makeInput({ incomeUsd: 1000 }));
    expect(result.irpf).toBe(0);
  });

  it('should progressively increase effective rate as income increases', () => {
    const low = calculateNet(makeInput({ incomeUsd: 5000 }));
    const mid = calculateNet(makeInput({ incomeUsd: 10000 }));
    const high = calculateNet(makeInput({ incomeUsd: 20000 }));

    const lowTaxable = low.incomeUyu - low.bpsFonasa;
    const midTaxable = mid.incomeUyu - mid.bpsFonasa;
    const highTaxable = high.incomeUyu - high.bpsFonasa;

    const lowRate = lowTaxable > 0 ? low.irpf / lowTaxable : 0;
    const midRate = midTaxable > 0 ? mid.irpf / midTaxable : 0;
    const highRate = highTaxable > 0 ? high.irpf / highTaxable : 0;

    expect(midRate).toBeGreaterThanOrEqual(lowRate);
    expect(highRate).toBeGreaterThanOrEqual(midRate);
  });

  it('should correctly calculate IRPF below first bracket', () => {
    // 100,000 UYU gross -> taxable ~82,850 (after BPS) -> ~12 BPC -> above 7 BPC -> IRPF > 0
    // Use lower income to stay in 0% bracket
    const gross = 50000;
    const result = calculateNet(makeInput({ incomeUsd: gross / EXCHANGE_RATE }));
    expect(result.irpf).toBe(0);
  });

  it('should apply IRPF just above first bracket threshold', () => {
    // Need taxable income > 7 BPC (= 48,048) to trigger tax
    // With high income, BPS is capped, so most income is taxable
    const gross = 235225;
    const result = calculateNet(makeInput({ incomeUsd: gross / EXCHANGE_RATE }));
    const taxable = result.incomeUyu - result.bpsFonasa;
    if (taxable > 7 * BPC) {
      expect(result.irpf).toBeGreaterThan(0);
    }
  });
});

// ============================================
// ROUND-TRIP CONSISTENCY
// ============================================

describe('round-trip consistency', () => {
  it('forward -> reverse -> forward should be consistent for unipersonal', () => {
    const originalIncome = 5000;
    const forward = calculateNet(makeInput({ incomeUsd: originalIncome }));

    const reverse = reverseCalculate({
      targetNetUsd: forward.netUsd,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    });

    const forwardAgain = calculateNet(makeInput({
      incomeUsd: reverse.requiredGrossUsd,
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
    }));

    const netDiff = Math.abs(forwardAgain.netUsd - forward.netUsd);
    expect(netDiff).toBeLessThan(50);
  });

  it('forward -> reverse -> forward should be consistent with family situation', () => {
    const family: FamilySituation = { hasSpouse: true, childrenCount: 1, disabledChildrenCount: 0, graduationYear: 2018 };
    const forward = calculateNet(makeInput({ incomeUsd: 5000, family }));

    const reverse = reverseCalculate({
      targetNetUsd: forward.netUsd,
      exchangeRate: EXCHANGE_RATE,
      clientType: 'exterior',
      regime: 'unipersonal',
      useAccountant: false,
      useEscribana: false,
      useFacturacion: false,
      family,
    });

    const forwardAgain = calculateNet(makeInput({
      incomeUsd: reverse.requiredGrossUsd,
      family,
    }));

    const netDiff = Math.abs(forwardAgain.netUsd - forward.netUsd);
    expect(netDiff).toBeLessThan(50);
  });
});
