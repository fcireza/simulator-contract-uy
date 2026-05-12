/**
 * Tax Calculator for Uruguayan IT Contractors — 2026 Edition
 * Supports multiple tax regimes: Unipersonal, SAS con Caja, SAS sin Caja
 *
 * Tax rules (2026, sources: BPS/DGI):
 * - BPS/FONASA: 22.5% on 70% of gross, capped at 15 BPCs; varies with family situation
 * - IRPF (Unipersonal): 8 progressive brackets (0% to 36%) on marginal income
 * - IRAE (SAS): 25% on profits (gross - deductible expenses)
 * - VAT (IVA): 0% for exports, 22% for local services
 * - Caja Profesional: 22.5% on taxable base (varies by category)
 * - Fondo de Solidaridad: Auto-applied for graduates 5+ years with income > 8 BPC
 *
 * Note: Values are approximations based on BPC 2026. Actual amounts depend on
 * individual circumstances. Consult a contador for precision.
 */

// ============================================
// TYPES & INTERFACES
// ============================================

export type TaxRegime = 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja';
export type IraeExemption = 'none' | 'partial' | 'full';

/** Family situation affects FONASA rates and IRPF deductions */
export interface FamilySituation {
  hasSpouse: boolean;
  childrenCount: number;
  disabledChildrenCount: number;
  /** Year of university graduation (0 = not applicable / not a graduate) */
  graduationYear: number;
}

export const DEFAULT_FAMILY: FamilySituation = {
  hasSpouse: false,
  childrenCount: 0,
  disabledChildrenCount: 0,
  graduationYear: 0,
};

export interface TaxCalculationInput {
  incomeUsd: number;
  exchangeRate: number;
  clientType: 'local' | 'exterior';
  regime: TaxRegime;
  useAccountant: boolean;
  useEscribana: boolean;
  useFacturacion: boolean;
  accountantCost?: number;
  escribanaCost?: number;
  facturacionCost?: number;
  family?: FamilySituation;
  /** IRAE exemption for software exports (SAS only, default 'none') */
  iraeExemption?: IraeExemption;
}

export interface TaxCalculationResult {
  incomeUyu: number;
  bpsFonasa: number;
  cajaProfesional: number;
  irpf: number;
  irae: number;
  vat: number;
  deductibleExpenses: number;
  netUyu: number;
  netUsd: number;
  accountantCost: number;
  escribanaCost: number;
  facturacionCost: number;
  fondoSolidaridad: number;
  /** Applied IRPF bracket info: { rate, upper limit in BPCs } */
  appliedIrpfBracket?: { rate: number; limitBpc: number; label: string };
  /** FONASA rate applied (decimal, e.g., 0.095) */
  fonasaRate?: number;
  /** BPS rate applied (decimal, always 0.15) */
  bpsRate?: number;
  /** BPS amount (before family surcharge) */
  bpsAmount?: number;
  /** FONASA amount (before family surcharge) */
  fonasaAmount?: number;
  /** Effective tax rate as percentage (totalTaxes / grossUyu * 100) */
  effectiveTaxRate?: number;
  /** IRAE exemption applied */
  iraeExemptionApplied?: IraeExemption;
  /** Family breakdown for display */
  familyDetail?: {
    hasSpouse: boolean;
    childrenCount: number;
    disabledChildrenCount: number;
    spouseSurcharge?: number;
    childrenSurcharge?: number;
    disabledChildrenSurcharge?: number;
    childDeduction?: number;
    disabledChildDeduction?: number;
  };
}

export interface ReverseCalculationInput {
  targetNetUsd: number;
  exchangeRate: number;
  clientType: 'local' | 'exterior';
  regime: TaxRegime;
  useAccountant: boolean;
  useEscribana: boolean;
  useFacturacion: boolean;
  accountantCost?: number;
  escribanaCost?: number;
  facturacionCost?: number;
  family?: FamilySituation;
  /** IRAE exemption for software exports (SAS only, default 'none') */
  iraeExemption?: IraeExemption;
}

export interface ReverseCalculationResult {
  requiredGrossUsd: number;
  requiredGrossUyu: number;
  estimatedTaxes: number;
  accountantCost: number;
  escribanaCost: number;
  facturacionCost: number;
  fondoSolidaridad: number;
  cajaProfesional?: number;
  bpsFonasa?: number;
  irpf?: number;
  irae?: number;
  /** Effective tax rate as percentage */
  effectiveTaxRate?: number;
  /** Applied IRPF bracket info for reverse calculation */
  appliedIrpfBracket?: { rate: number; limitBpc: number; label: string };
  /** FONASA rate applied (decimal) */
  fonasaRate?: number;
  /** BPS rate applied */
  bpsRate?: number;
  /** BPS amount (before family surcharge) */
  bpsAmount?: number;
  /** FONASA amount (before family surcharge) */
  fonasaAmount?: number;
  /** IRAE exemption applied */
  iraeExemptionApplied?: IraeExemption;
  /** Family breakdown for reverse calculation */
  familyDetail?: {
    hasSpouse: boolean;
    childrenCount: number;
    disabledChildrenCount: number;
    spouseSurcharge?: number;
    childrenSurcharge?: number;
    disabledChildrenSurcharge?: number;
    childDeduction?: number;
    disabledChildDeduction?: number;
  };
}

// ============================================
// TAX CONSTANTS (BPC 2026 values)
// ============================================

/**
 * BPC (Base de Prestaciones y Cotizaciones) 2026: $6,864 UYU
 * Sources: BPS Uruguay — Valores vigentes 2026
 */
export const BPC = 6864;

/** Tope BPS: 15 BPCs = 102,960 UYU (maximum monthly base for social security) */
export const TOPE_BPS = 15 * BPC;

/**
 * IRPF progressive brackets 2026 (8 tiers, BPC-based)
 *
 * The system is progressive (marginal): you pay each rate only on the portion
 * of income within that bracket's range, not on the entire income.
 *
 * Source: DGI Uruguay — IRPF escalas 2026
 *
 * Bracket structure:
 *   0–7 BPC:    0%   (exempt)
 *   7–10 BPC:   10%
 *   10–15 BPC:  15%
 *   15–30 BPC:  24%
 *   30–50 BPC:  25%
 *   50–75 BPC:  27%
 *   75–115 BPC: 31%
 *   115+ BPC:   36%
 */
interface IRPFBracket {
  limitBpc: number;      // Upper limit in BPCs (0 = infinity for last bracket)
  rate: number;          // Marginal rate
  fixedAmountBpc: number;// Cumulative tax from previous brackets (in BPCs)
}

const IRPF_BRACKETS: IRPFBracket[] = [
  { limitBpc: 7,   rate: 0.00, fixedAmountBpc: 0 },
  { limitBpc: 10,  rate: 0.10, fixedAmountBpc: 0 },
  { limitBpc: 15,  rate: 0.15, fixedAmountBpc: 0.5 },     // 0.5 BPC fixed from bracket 2
  { limitBpc: 30,  rate: 0.24, fixedAmountBpc: 1.25 },    // 1.25 BPC fixed from brackets 2-3
  { limitBpc: 50,  rate: 0.25, fixedAmountBpc: 4.85 },    // 4.85 BPC fixed from brackets 2-4
  { limitBpc: 75,  rate: 0.27, fixedAmountBpc: 9.85 },    // 9.85 BPC fixed from brackets 2-5
  { limitBpc: 115, rate: 0.31, fixedAmountBpc: 16.6 },    // 16.6 BPC fixed from brackets 2-6
  { limitBpc: 0,   rate: 0.36, fixedAmountBpc: 29.0 },    // 29.0 BPC fixed from brackets 2-7
];

/**
 * FONASA rates by income level and family situation
 *
 * Source: BPS Uruguay — Tasas FONASA 2026
 *
 * Under 2.5 BPC: base 8%, spouse +2%, children 0%
 * Over 2.5 BPC:  base 9.5%, spouse +2%, children +1.5%
 */
const FONASA_UNDER_25BPC = { base: 0.08, spouse: 0.02, children: 0 };
const FONASA_OVER_25BPC  = { base: 0.095, spouse: 0.02, children: 0.015 };

/** Fondo de Solidaridad: applies to graduates 5+ years with income > 8 BPC */
const FONDOSOL_MIN_INCOME_BPC = 8;
const FONDOSOL_GRADUATION_YEARS = 5;

/** Deduction per child for IRPF (monthly) */
const CHILD_DEDUCTION = (20 * BPC) / 12;          // ~$11,440 UYU
const DISABLED_CHILD_DEDUCTION = (40 * BPC) / 12; // ~$22,880 UYU

/** Additional Fondo de Solidaridad for careers 5+ years */
const ADDITIONAL_SOLIDARITY_FUND = ((5 / 6) * BPC) / 12; // ~$476 UYU/month

/** If taxable income > 10 BPC, base increases by 6% */
const TAXABLE_INCOME_INCREASE = 0.06;

/** IRPF deduction rates by income level */
const DEDUCTIONS_RATE_UNDER_15BPC = 0.14;
const DEDUCTIONS_RATE_OVER_15BPC  = 0.08;

/** Current year for automatic Fondo de Solidaridad detection */
const CURRENT_YEAR = 2026;

// ============================================
// INPUT VALIDATION
// ============================================

function validateCalcInput(input: TaxCalculationInput): void {
  if (input.incomeUsd < 0) {
    throw new Error('incomeUsd cannot be negative');
  }
  if (input.exchangeRate <= 0) {
    throw new Error('exchangeRate must be positive');
  }
}

function validateReverseInput(input: ReverseCalculationInput): void {
  if (input.targetNetUsd < 0) {
    throw new Error('targetNetUsd cannot be negative');
  }
  if (input.exchangeRate <= 0) {
    throw new Error('exchangeRate must be positive');
  }
}

// ============================================
// AUTOMATIC CALCULATIONS (family, fondosol, etc.)
// ============================================

/**
 * Auto-detect if Fondo de Solidaridad applies based on graduation year.
 * Returns the monthly amount (0 if not applicable).
 *
 * Rules:
 * - Must be a university graduate (graduationYear > 0)
 * - Must be 5+ years since graduation
 * - Income must be > 8 BPC/month
 */
export function calculateFondoSolidaridad(grossUyu: number, graduationYear: number): number {
  if (graduationYear <= 0) return 0;
  const yearsSinceGrad = CURRENT_YEAR - graduationYear;
  if (yearsSinceGrad < FONDOSOL_GRADUATION_YEARS) return 0;

  const incomeInBpc = grossUyu / BPC;
  if (incomeInBpc <= FONDOSOL_MIN_INCOME_BPC) return 0;

  // Scale: 0.5 BPC for 8-15 BPC, 1 BPC for 15-30 BPC, 2 BPC for 30+ BPC
  const bpcAmount = incomeInBpc > 30 ? 2 : incomeInBpc > 15 ? 1 : 0.5;
  return Math.round(Math.round((bpcAmount * BPC) / 12) + ADDITIONAL_SOLIDARITY_FUND);
}

/**
 * Calculate FONASA rate based on income level and family situation.
 * Returns the rate as a decimal (e.g., 0.115 = 11.5%).
 */
export function calculateFonasaRate(grossUyu: number, family: FamilySituation): number {
  const baseAmount = grossUyu * 0.70; // 70% of gross
  const greaterThan25Bpc = baseAmount > 2.5 * BPC;

  const rates = greaterThan25Bpc ? FONASA_OVER_25BPC : FONASA_UNDER_25BPC;

  let rate = rates.base;
  if (family.hasSpouse) rate += rates.spouse;
  if (family.childrenCount > 0) rate += rates.children * family.childrenCount;
  if (family.disabledChildrenCount > 0) rate += rates.children * family.disabledChildrenCount;

  return rate;
}

/**
 * Calculate IRPF deductions for children.
 */
function calculateChildDeductions(family: FamilySituation): number {
  return (
    family.childrenCount * CHILD_DEDUCTION +
    family.disabledChildrenCount * DISABLED_CHILD_DEDUCTION
  );
}

// ============================================
// BASE CALCULATIONS (shared)
// ============================================

/**
 * Calculate VAT (IVA)
 * Export services (exterior): 0% (export exemption)
 * Local services: 22%
 */
export function calculateVAT(incomeUyu: number, clientType: 'local' | 'exterior'): number {
  if (incomeUyu <= 0) return 0;
  if (clientType === 'exterior') return 0;
  return Math.round(incomeUyu * 0.22);
}

/**
 * Calculate taxable base for BPS/social security
 * Base = 70% of gross income, capped at TOPE_BPS (15 BPCs)
 */
function calculateSocialSecurityBase(grossUyu: number): number {
  if (grossUyu <= 0) return 0;
  const base = grossUyu * 0.70;
  return Math.min(base, TOPE_BPS);
}

/**
 * Calculate the BPS (jubilación) portion given a rate.
 * Reusable across regimes — Unipersonal uses 15%, SAS sin Caja uses 7.5% (inside the 12.5% común).
 */
function calculateBPSPortion(grossUyu: number, bpsRate: number): number {
  if (grossUyu <= 0) return 0;
  return Math.round(calculateSocialSecurityBase(grossUyu) * bpsRate);
}

/**
 * Calculate the FONASA (salud) portion given a rate.
 * Reusable across regimes — Unipersonal uses a variable rate (8% or 9.5% + family surcharges),
 * SAS sin Caja uses 5% (inside the 12.5% común).
 */
function calculateFonasaPortion(grossUyu: number, fonasaRate: number): number {
  if (grossUyu <= 0) return 0;
  return Math.round(calculateSocialSecurityBase(grossUyu) * fonasaRate);
}

/**
 * Calculate service costs from input
 * Returns individual costs and total
 */
function calculateServiceCosts(input: Pick<TaxCalculationInput, 'useAccountant' | 'useEscribana' | 'useFacturacion' | 'accountantCost' | 'escribanaCost' | 'facturacionCost'>) {
  let accountantCost = 0;
  let escribanaCost = 0;
  let facturacionCost = 0;

  if (input.useAccountant) accountantCost = input.accountantCost ?? 5000;
  if (input.useEscribana) escribanaCost = input.escribanaCost ?? 8000;
  if (input.useFacturacion) facturacionCost = input.facturacionCost ?? 3000;

  return { accountantCost, escribanaCost, facturacionCost, total: accountantCost + escribanaCost + facturacionCost };
}

// ============================================
// IRPF CALCULATION (8 progressive brackets)
// ============================================

/**
 * Get the IRPF bracket info for a given taxable income (in UYU).
 * Returns bracket details: rate, upper limit, and display label.
 */
export function getIrpfBracket(taxableIncome: number): { rate: number; limitBpc: number; label: string } {
  const incomeInBpc = taxableIncome / BPC;
  const labels = [
    '0-7 BPC (0%)',
    '7-10 BPC (10%)',
    '10-15 BPC (15%)',
    '15-30 BPC (24%)',
    '30-50 BPC (25%)',
    '50-75 BPC (27%)',
    '75-115 BPC (31%)',
    '115+ BPC (36%)',
  ];

  for (let i = 0; i < IRPF_BRACKETS.length; i++) {
    const bracket = IRPF_BRACKETS[i];
    const upperLimit = bracket.limitBpc === 0 ? Infinity : bracket.limitBpc;
    if (incomeInBpc <= upperLimit) {
      return { rate: bracket.rate, limitBpc: bracket.limitBpc, label: labels[i] };
    }
  }
  return { rate: 0, limitBpc: 7, label: labels[0] };
}

/**
 * Calculate IRPF with full 8-bracket progressive system.
 *
 * Taxable income is adjusted:
 * - +6% if income > 10 BPC
 * - Deductions for children, BPS/FONASA, solidarity fund
 *
 * Progressive calculation: each bracket applies its rate only to the portion
 * of income within that bracket, plus cumulative tax from lower brackets.
 */
function calculateIRPF(taxableIncome: number, family: FamilySituation): number {
  if (taxableIncome <= 0) return 0;

  // Apply +6% increment if income > 10 BPC
  let adjustedIncome = taxableIncome;
  const incomeInBpc = taxableIncome / BPC;
  if (incomeInBpc > 10) {
    adjustedIncome = taxableIncome * (1 + TAXABLE_INCOME_INCREASE);
  }

  // Calculate deductions
  const childDeductions = calculateChildDeductions(family);
  const salaryInBpc = adjustedIncome / BPC;
  const deductionsRate = salaryInBpc > 15 ? DEDUCTIONS_RATE_OVER_15BPC : DEDUCTIONS_RATE_UNDER_15BPC;

  // Personal deductions (children) are 100% tax credits.
  // BPS/FONASA/FS already reduce the taxable base (see caller).
  // The percentage deduction (14%/8%) applies to adjusted income.
  const totalDeductions = childDeductions + (adjustedIncome * deductionsRate);

  // Calculate bracket tax
  let totalBracketTax = 0;
  for (let i = 0; i < IRPF_BRACKETS.length; i++) {
    const bracket = IRPF_BRACKETS[i];
    const limitBpc = bracket.limitBpc === 0 ? Infinity : bracket.limitBpc;
    const limitUyu = limitBpc * BPC;

    if (adjustedIncome > (i === 0 ? 0 : IRPF_BRACKETS[i - 1].limitBpc * BPC)) {
      const prevLimit = i === 0 ? 0 : IRPF_BRACKETS[i - 1].limitBpc * BPC;
      const taxableInBracket = Math.min(limitUyu, adjustedIncome) - prevLimit;
      totalBracketTax += taxableInBracket * bracket.rate;
    }
  }

  return Math.max(0, Math.round(totalBracketTax - totalDeductions));
}

// ============================================
// UNIPERSONAL REGIME
// ============================================

/**
 * Calculate BPS + FONASA (Unipersonal) with family situation, returning split amounts.
 * Rate varies based on income level and family (spouse, children).
 * Returns { total, bps, fonasa } so callers can display both components separately.
 */
function calculateBPSFonasaUnipersonal(grossUyu: number, family: FamilySituation): { total: number; bps: number; fonasa: number } {
  if (grossUyu <= 0) return { total: 0, bps: 0, fonasa: 0 };
  const bpsAmt = calculateBPSPortion(grossUyu, 0.15);
  const fonasaRateValue = calculateFonasaRate(grossUyu, family);
  const fonasaAmt = calculateFonasaPortion(grossUyu, fonasaRateValue);
  return { total: bpsAmt + fonasaAmt, bps: bpsAmt, fonasa: fonasaAmt };
}

function calculateNetUnipersonal(input: TaxCalculationInput): TaxCalculationResult {
  validateCalcInput(input);

  const family = input.family ?? DEFAULT_FAMILY;
  const incomeUyu = Math.round(input.incomeUsd * input.exchangeRate);

  const { total: bpsFonasa, bps: bpsAmount, fonasa: fonasaAmount } = calculateBPSFonasaUnipersonal(incomeUyu, family);
  const fondoSolidaridad = calculateFondoSolidaridad(incomeUyu, family.graduationYear);

  // IRPF Category II: 30% notional deduction (gastos fictos) for presumed costs
  const taxableIncome = incomeUyu * 0.70 - bpsFonasa - fondoSolidaridad;
  const appliedBracket = getIrpfBracket(taxableIncome);
  const irpf = calculateIRPF(taxableIncome, family);
  const vat = calculateVAT(incomeUyu, input.clientType);

  const fonasaRate = calculateFonasaRate(incomeUyu, family);
  const bpsRate = 0.15;

  // Calculate family surcharges for display
  const baseAmount = incomeUyu * 0.70;
  const greaterThan25Bpc = baseAmount > 2.5 * BPC;
  const rates = greaterThan25Bpc ? FONASA_OVER_25BPC : FONASA_UNDER_25BPC;

  const actualBase = calculateSocialSecurityBase(incomeUyu);
  const spouseSurcharge = family.hasSpouse ? Math.round(actualBase * rates.spouse) : undefined;
  const childrenSurcharge = family.childrenCount > 0
    ? Math.round(actualBase * rates.children * family.childrenCount)
    : undefined;
  const disabledChildrenSurcharge = family.disabledChildrenCount > 0
    ? Math.round(actualBase * rates.children * family.disabledChildrenCount)
    : undefined;
  const childDeduction = family.childrenCount > 0
    ? Math.round(family.childrenCount * CHILD_DEDUCTION)
    : undefined;
  const disabledChildDeduction = family.disabledChildrenCount > 0
    ? Math.round(family.disabledChildrenCount * DISABLED_CHILD_DEDUCTION)
    : undefined;

  const services = calculateServiceCosts(input);
  const netUyu = incomeUyu - bpsFonasa - irpf - services.total - fondoSolidaridad;

  const netUsd = input.exchangeRate > 0 ? Math.round(netUyu / input.exchangeRate) : 0;

  const effectiveRate = effectiveTaxRate(incomeUyu, { bpsFonasa, cajaProfesional: 0, irpf, irae: 0, vat, fondoSolidaridad });

  return {
    incomeUyu,
    bpsFonasa,
    cajaProfesional: 0,
    irpf,
    irae: 0,
    vat,
    deductibleExpenses: 0,
    netUyu: Math.max(0, netUyu),
    netUsd: Math.max(0, netUsd),
    accountantCost: services.accountantCost,
    escribanaCost: services.escribanaCost,
    facturacionCost: services.facturacionCost,
    fondoSolidaridad,
    effectiveTaxRate: effectiveRate,
    appliedIrpfBracket: irpf > 0 ? appliedBracket : undefined,
    fonasaRate,
    bpsRate,
    bpsAmount,
    fonasaAmount,
    familyDetail: (family.hasSpouse || family.childrenCount > 0 || family.disabledChildrenCount > 0)
      ? {
        hasSpouse: family.hasSpouse,
        childrenCount: family.childrenCount,
        disabledChildrenCount: family.disabledChildrenCount,
        spouseSurcharge,
        childrenSurcharge,
        disabledChildrenSurcharge,
        childDeduction,
        disabledChildDeduction,
      }
      : undefined,
  };
}

function reverseCalculateUnipersonal(params: ReverseCalculationInput): ReverseCalculationResult {
  validateReverseInput(params);

  const family = params.family ?? DEFAULT_FAMILY;
  const targetNetUyu = params.targetNetUsd * params.exchangeRate;
  const services = calculateServiceCosts(params);

  const adjustedTarget = targetNetUyu;

  let grossEstimate = adjustedTarget * 1.30;
  let iterations = 0;
  const maxIterations = 100;

  let bpsFonasa = 0;
  let irpf = 0;
  let fondoSolidaridadResult = 0;
  let bpsSplit: { total: number; bps: number; fonasa: number } = { total: 0, bps: 0, fonasa: 0 };

  while (iterations < maxIterations) {
    bpsSplit = calculateBPSFonasaUnipersonal(grossEstimate, family);
    const newBpsFonasa = bpsSplit.total;
    const newFondoSolidaridad = calculateFondoSolidaridad(grossEstimate, family.graduationYear);
    // Category II: 30% ficto deduction (gastos fictos) for presumed costs
    const taxableIncome = grossEstimate * 0.70 - newBpsFonasa - newFondoSolidaridad;
    const newIrpf = calculateIRPF(taxableIncome, family);
    const net = grossEstimate - newBpsFonasa - newIrpf - services.total - newFondoSolidaridad;
    const diff = adjustedTarget - net;

    if (Math.abs(diff) < 1) {
      bpsFonasa = newBpsFonasa;
      irpf = newIrpf;
      fondoSolidaridadResult = newFondoSolidaridad;
      break;
    }

    const step = Math.abs(diff) > 1000 ? 0.5 : 0.3;
    grossEstimate += diff * step;
    iterations++;
  }

  if (iterations >= maxIterations) {
    bpsSplit = calculateBPSFonasaUnipersonal(grossEstimate, family);
    bpsFonasa = bpsSplit.total;
    fondoSolidaridadResult = calculateFondoSolidaridad(grossEstimate, family.graduationYear);
    const taxableIncome = grossEstimate * 0.70 - bpsFonasa - fondoSolidaridadResult;
    irpf = calculateIRPF(taxableIncome, family);
  }

  return {
    requiredGrossUsd: params.exchangeRate > 0 ? Math.round((grossEstimate / params.exchangeRate) * 100) / 100 : 0,
    requiredGrossUyu: Math.round(grossEstimate),
    estimatedTaxes: Math.round(bpsFonasa + irpf + fondoSolidaridadResult),
    accountantCost: services.accountantCost,
    escribanaCost: services.escribanaCost,
    facturacionCost: services.facturacionCost,
    fondoSolidaridad: fondoSolidaridadResult,
    bpsFonasa,
    irpf,
    appliedIrpfBracket: irpf > 0 ? getIrpfBracket(grossEstimate * 0.70 - bpsFonasa - fondoSolidaridadResult) : undefined,
    fonasaRate: calculateFonasaRate(grossEstimate, family),
    bpsRate: 0.15,
    bpsAmount: bpsSplit.bps,
    fonasaAmount: bpsSplit.fonasa,
    familyDetail: (family.hasSpouse || family.childrenCount > 0 || family.disabledChildrenCount > 0)
      ? (() => {
          const baseAmt = grossEstimate * 0.70;
          const revRates = baseAmt > 2.5 * BPC ? FONASA_OVER_25BPC : FONASA_UNDER_25BPC;
          const revActualBase = calculateSocialSecurityBase(grossEstimate);
          return {
            hasSpouse: family.hasSpouse,
            childrenCount: family.childrenCount,
            disabledChildrenCount: family.disabledChildrenCount,
            spouseSurcharge: family.hasSpouse ? Math.round(revActualBase * revRates.spouse) : undefined,
            childrenSurcharge: family.childrenCount > 0 ? Math.round(revActualBase * revRates.children * family.childrenCount) : undefined,
            disabledChildrenSurcharge: family.disabledChildrenCount > 0 ? Math.round(revActualBase * revRates.children * family.disabledChildrenCount) : undefined,
            childDeduction: family.childrenCount > 0 ? Math.round(family.childrenCount * CHILD_DEDUCTION) : undefined,
            disabledChildDeduction: family.disabledChildrenCount > 0 ? Math.round(family.disabledChildrenCount * DISABLED_CHILD_DEDUCTION) : undefined,
          };
        })()
      : undefined,
    effectiveTaxRate: grossEstimate > 0
      ? Math.round(((bpsFonasa + irpf + fondoSolidaridadResult) / grossEstimate) * 100 * 10) / 10
      : undefined,
  };
}

// ============================================
// SAS REGIME (con Caja / sin Caja)
// ============================================

/**
 * Calculate Caja Profesional (SAS with university professional)
 * Rate: 22.5% on taxable base (70% of gross), capped at 15 BPCs
 */
function calculateCajaProfesionalSAS(grossUyu: number): number {
  if (grossUyu <= 0) return 0;
  const taxableBase = calculateSocialSecurityBase(grossUyu);
  return Math.round(taxableBase * 0.225);
}

/**
 * Calculate BPS Común (SAS without university professional)
 * Rate: 12.5% on taxable base (70% of gross), capped at 15 BPCs
 * Split: 7.5% BPS (jubilación) + FONASA variable (salud, según ingresos y familia)
 */
function calculateBPSComunSAS(grossUyu: number, family: FamilySituation): { total: number; bps: number; fonasa: number; fonasaRate: number } {
  if (grossUyu <= 0) return { total: 0, bps: 0, fonasa: 0, fonasaRate: 0 };
  const bpsAmt = calculateBPSPortion(grossUyu, 0.075);
  const rate = calculateFonasaRate(grossUyu, family);
  const fonasaAmt = calculateFonasaPortion(grossUyu, rate);
  return { total: bpsAmt + fonasaAmt, bps: bpsAmt, fonasa: fonasaAmt, fonasaRate: rate };
}

/**
 * Calculate IRAE (SAS)
 * Rate: 25% on profits (after deductible expenses)
 * Can be partially or fully exempted for software exports.
 */
function calculateIRAESAS(grossUyu: number, deductibleExpenses: number, exemption: IraeExemption = 'none'): number {
  const taxableProfit = Math.max(0, grossUyu - deductibleExpenses);
  const exemptionFactor = exemption === 'full' ? 0 : exemption === 'partial' ? 0.5 : 1;
  return Math.round(taxableProfit * 0.25 * exemptionFactor);
}

function calculateNetSAS(input: TaxCalculationInput): TaxCalculationResult {
  validateCalcInput(input);

  const incomeUyu = Math.round(input.incomeUsd * input.exchangeRate);

  const services = calculateServiceCosts(input);
  const deductibleExpenses = services.total;

  const vat = calculateVAT(incomeUyu, input.clientType);

  let cajaProfesional = 0;
  let bpsFonasa = 0;
  let bpsAmount: number | undefined;
  let fonasaAmount: number | undefined;
  let bpsRate: number | undefined;
  let fonasaRate: number | undefined;

  const family = input.family ?? DEFAULT_FAMILY;

  if (input.regime === 'sas-con-caja') {
    cajaProfesional = calculateCajaProfesionalSAS(incomeUyu);
  } else {
    const split = calculateBPSComunSAS(incomeUyu, family);
    bpsFonasa = split.total;
    bpsAmount = split.bps;
    fonasaAmount = split.fonasa;
    bpsRate = 0.075;
    fonasaRate = split.fonasaRate;
  }

  const iraeExemption = input.iraeExemption ?? 'none';
  const irae = calculateIRAESAS(incomeUyu, deductibleExpenses, iraeExemption);

  // SAS: no Fondo de Solidaridad for company owners (only for employees)
  const fondoSolidaridad = 0;

  const netUyu = incomeUyu - cajaProfesional - bpsFonasa - irae - deductibleExpenses - fondoSolidaridad;

  const netUsd = input.exchangeRate > 0 ? Math.round(netUyu / input.exchangeRate) : 0;

  const effectiveRate = effectiveTaxRate(incomeUyu, { bpsFonasa, cajaProfesional, irpf: 0, irae, vat, fondoSolidaridad });

  return {
    incomeUyu,
    bpsFonasa,
    cajaProfesional,
    irpf: 0,
    irae,
    vat,
    deductibleExpenses,
    netUyu: Math.max(0, netUyu),
    netUsd: Math.max(0, netUsd),
    accountantCost: services.accountantCost,
    escribanaCost: services.escribanaCost,
    facturacionCost: services.facturacionCost,
    fondoSolidaridad,
    effectiveTaxRate: effectiveRate,
    iraeExemptionApplied: iraeExemption !== 'none' ? iraeExemption : undefined,
    bpsAmount,
    fonasaAmount,
    bpsRate,
    fonasaRate,
    familyDetail: input.regime !== 'sas-con-caja' && (family.hasSpouse || family.childrenCount > 0 || family.disabledChildrenCount > 0)
      ? (() => {
          const baseAmt = incomeUyu * 0.70;
          const rates = baseAmt > 2.5 * BPC ? FONASA_OVER_25BPC : FONASA_UNDER_25BPC;
          const actualBase = calculateSocialSecurityBase(incomeUyu);
          return {
            hasSpouse: family.hasSpouse,
            childrenCount: family.childrenCount,
            disabledChildrenCount: family.disabledChildrenCount,
            spouseSurcharge: family.hasSpouse ? Math.round(actualBase * rates.spouse) : undefined,
            childrenSurcharge: family.childrenCount > 0 ? Math.round(actualBase * rates.children * family.childrenCount) : undefined,
            disabledChildrenSurcharge: family.disabledChildrenCount > 0 ? Math.round(actualBase * rates.children * family.disabledChildrenCount) : undefined,
            childDeduction: family.childrenCount > 0 ? Math.round(family.childrenCount * CHILD_DEDUCTION) : undefined,
            disabledChildDeduction: family.disabledChildrenCount > 0 ? Math.round(family.disabledChildrenCount * DISABLED_CHILD_DEDUCTION) : undefined,
          };
        })()
      : undefined,
  };
}

function reverseCalculateSAS(params: ReverseCalculationInput, useCaja: boolean): ReverseCalculationResult {
  validateReverseInput(params);

  const targetNetUyu = params.targetNetUsd * params.exchangeRate;
  const family = params.family ?? DEFAULT_FAMILY;

  const services = calculateServiceCosts(params);
  const estimatedExpenses = services.total;

  const iraeExemption = params.iraeExemption ?? 'none';

  let grossEstimate = (targetNetUyu + estimatedExpenses) * 1.35;
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const socialSecurity = useCaja
      ? calculateCajaProfesionalSAS(grossEstimate)
      : calculateBPSComunSAS(grossEstimate, family).total;
    const irae = calculateIRAESAS(grossEstimate, estimatedExpenses, iraeExemption);

    const net = grossEstimate - socialSecurity - irae - estimatedExpenses;
    const diff = targetNetUyu - net;

    if (Math.abs(diff) < 1) break;

    const step = Math.abs(diff) > 1000 ? 0.5 : 0.3;
    grossEstimate += diff * step;
    iterations++;
  }

  // Recalculate final values for return
  const finalCaja = useCaja ? calculateCajaProfesionalSAS(grossEstimate) : 0;
  const finalBpsSplit = useCaja ? { total: 0, bps: 0, fonasa: 0, fonasaRate: 0 } : calculateBPSComunSAS(grossEstimate, family);
  const finalBps = finalBpsSplit.total;
  const finalIrae = calculateIRAESAS(grossEstimate, estimatedExpenses, iraeExemption);
  const totalTaxes = finalCaja + finalBps + finalIrae;

  return {
    requiredGrossUsd: params.exchangeRate > 0 ? Math.round((grossEstimate / params.exchangeRate) * 100) / 100 : 0,
    requiredGrossUyu: Math.round(grossEstimate),
    estimatedTaxes: Math.round(totalTaxes),
    accountantCost: services.accountantCost,
    escribanaCost: services.escribanaCost,
    facturacionCost: services.facturacionCost,
    fondoSolidaridad: 0, // SAS: not applicable
    cajaProfesional: finalCaja > 0 ? finalCaja : undefined,
    bpsFonasa: finalBps > 0 ? finalBps : undefined,
    bpsAmount: finalBpsSplit.bps > 0 ? finalBpsSplit.bps : undefined,
    fonasaAmount: finalBpsSplit.fonasa > 0 ? finalBpsSplit.fonasa : undefined,
    bpsRate: !useCaja ? 0.075 : undefined,
    fonasaRate: !useCaja ? finalBpsSplit.fonasaRate : undefined,
    irae: finalIrae > 0 ? finalIrae : (iraeExemption === 'full' ? 0 : undefined),
    iraeExemptionApplied: iraeExemption !== 'none' ? iraeExemption : undefined,
    effectiveTaxRate: grossEstimate > 0
      ? Math.round((totalTaxes / grossEstimate) * 100 * 10) / 10
      : undefined,
    familyDetail: !useCaja && (family.hasSpouse || family.childrenCount > 0 || family.disabledChildrenCount > 0)
      ? (() => {
          const baseAmt = grossEstimate * 0.70;
          const revRates = baseAmt > 2.5 * BPC ? FONASA_OVER_25BPC : FONASA_UNDER_25BPC;
          const revActualBase = calculateSocialSecurityBase(grossEstimate);
          return {
            hasSpouse: family.hasSpouse,
            childrenCount: family.childrenCount,
            disabledChildrenCount: family.disabledChildrenCount,
            spouseSurcharge: family.hasSpouse ? Math.round(revActualBase * revRates.spouse) : undefined,
            childrenSurcharge: family.childrenCount > 0 ? Math.round(revActualBase * revRates.children * family.childrenCount) : undefined,
            disabledChildrenSurcharge: family.disabledChildrenCount > 0 ? Math.round(revActualBase * revRates.children * family.disabledChildrenCount) : undefined,
            childDeduction: family.childrenCount > 0 ? Math.round(family.childrenCount * CHILD_DEDUCTION) : undefined,
            disabledChildDeduction: family.disabledChildrenCount > 0 ? Math.round(family.disabledChildrenCount * DISABLED_CHILD_DEDUCTION) : undefined,
          };
        })()
      : undefined,
  };
}

// ============================================
// EFFECTIVE TAX RATE UTILITY
// ============================================

/**
 * Calculate effective tax rate as percentage.
 * total taxes / grossUyu * 100, rounded to 1 decimal.
 */
export function effectiveTaxRate(grossUyu: number, result: { bpsFonasa: number; cajaProfesional: number; irpf: number; irae: number; vat: number; fondoSolidaridad: number }): number {
  if (grossUyu <= 0) return 0;
  const totalTaxes = result.bpsFonasa + result.cajaProfesional + result.irpf + result.irae + result.vat + result.fondoSolidaridad;
  return Math.round((totalTaxes / grossUyu) * 100 * 10) / 10;
}

// ============================================
// MAIN EXPORTS (Regime-agnostic)
// ============================================

/**
 * Calculate net income after all taxes and expenses
 * Supports Unipersonal, SAS con Caja, and SAS sin Caja regimes
 */
export function calculateNet(input: TaxCalculationInput): TaxCalculationResult {
  switch (input.regime) {
    case 'unipersonal':
      return calculateNetUnipersonal(input);
    case 'sas-con-caja':
    case 'sas-sin-caja':
      return calculateNetSAS(input);
    default:
      throw new Error(`Unknown regime: ${input.regime}`);
  }
}

/**
 * Reverse calculation: Given a desired net income (USD), calculate required gross income
 * Supports Unipersonal, SAS con Caja, and SAS sin Caja regimes
 */
export function reverseCalculate(params: ReverseCalculationInput): ReverseCalculationResult {
  switch (params.regime) {
    case 'unipersonal':
      return reverseCalculateUnipersonal(params);
    case 'sas-con-caja':
      return reverseCalculateSAS(params, true);
    case 'sas-sin-caja':
      return reverseCalculateSAS(params, false);
    default:
      throw new Error(`Unknown regime: ${params.regime}`);
  }
}

/**
 * Compare all tax regimes for the same input
 * Returns results for all regimes to find the best option
 */
export function compareRegimes(input: Omit<TaxCalculationInput, 'regime'>): TaxCalculationResult[] {
  const regimes: TaxRegime[] = ['unipersonal', 'sas-con-caja', 'sas-sin-caja'];
  return regimes.map(regime => calculateNet({ ...input, regime }));
}
