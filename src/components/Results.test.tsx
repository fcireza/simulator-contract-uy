import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Results from './Results';
import type { TaxBreakdownData } from './TaxBreakdown';

// Mock dark mode context
vi.mock('../hooks/DarkModeContext', () => ({
  useDarkModeContext: () => ({ darkMode: false }),
}));

// Mock useDeviceDetect
vi.mock('../utils/useDeviceDetect', () => ({
  useDeviceDetect: () => false,
}));

const defaultTaxData: TaxBreakdownData = {
  bpsFonasa: 15000,
  bpsRate: 0.15,
  fonasaRate: 0.095,
  bpsAmount: 10500,
  fonasaAmount: 4500,
  irpf: 8000,
  fondoSolidaridad: 2000,
  effectiveTaxRate: 25.0,
};

function renderResults(overrides?: {
  grossIncomeUyu?: number;
  netIncomeUyu?: number;
  netIncomeUsd?: number;
  taxData?: TaxBreakdownData;
  exchangeRate?: number;
  regime?: 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja';
  mode?: 'normal' | 'reverse';
  onCompare?: () => void;
  bpc?: number;
  currency?: 'USD' | 'UYU';
}) {
  render(
    <Results
      grossIncomeUyu={overrides?.grossIncomeUyu ?? 100000}
      netIncomeUyu={overrides?.netIncomeUyu ?? 75000}
      netIncomeUsd={overrides?.netIncomeUsd ?? 1875}
      taxData={overrides?.taxData ?? defaultTaxData}
      exchangeRate={overrides?.exchangeRate ?? 40}
      regime={overrides?.regime ?? 'unipersonal'}
      mode={overrides?.mode ?? 'normal'}
      onCompare={overrides?.onCompare}
      bpc={overrides?.bpc}
      currency={overrides?.currency ?? 'USD'}
    />,
  );
}

describe('Results — Basic rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render gross income in context header', () => {
    renderResults({ grossIncomeUyu: 100000 });

    // contextValue = formatUsd(100000/40) + ' brutos' = 'US$ 2,500 brutos'
    expect(screen.getByText(/US\$ 2,500 brutos/)).toBeTruthy();
  });

  it('should render regime label and description', () => {
    renderResults({ regime: 'unipersonal' });

    expect(screen.getByText('Unipersonal')).toBeTruthy();
    expect(screen.getByText(/IRPF \+ BPS\/FONASA/)).toBeTruthy();
  });

  it('should render SAS con Caja label', () => {
    renderResults({ regime: 'sas-con-caja' });

    expect(screen.getByText('SAS con Caja Profesional')).toBeTruthy();
  });

  it('should render SAS sin Caja label', () => {
    renderResults({ regime: 'sas-sin-caja' });

    expect(screen.getByText('SAS sin Caja (BPS)')).toBeTruthy();
  });
});

describe('Results — Highlight card', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show net income as primary in normal mode', () => {
    renderResults({ netIncomeUyu: 75000, netIncomeUsd: 1875 });

    // Primary (USD mode): net in USD — formatUsd(1875) = 'US$ 1,875'
    expect(screen.getByText(/US\$ 1,875/)).toBeTruthy();
    // Secondary: net in UYU — formatUyu(75000) = '$75.000 UYU'
    expect(screen.getByText(/\$75\.000 UYU/)).toBeTruthy();
  });

  it('should show gross income as primary in reverse mode', () => {
    renderResults({ mode: 'reverse', grossIncomeUyu: 130000, netIncomeUyu: 75000 });

    // 'US$ 3,250' appears in BOTH context header and highlight card
    const usdElements = screen.getAllByText(/US\$ 3,250/);
    expect(usdElements.length).toBe(2);
    // Secondary: gross in UYU — formatUyu(130000) = '$130.000 UYU'
    expect(screen.getByText(/\$130\.000 UYU/)).toBeTruthy();
  });

  it('should show correct highlight label in normal mode', () => {
    renderResults({ mode: 'normal' });

    expect(screen.getByText('Ingreso Neto Estimado')).toBeTruthy();
  });

  it('should show correct highlight label in reverse mode', () => {
    renderResults({ mode: 'reverse' });

    expect(screen.getByText('Ingreso Bruto Necesario')).toBeTruthy();
  });

  it('should show net percent in normal mode', () => {
    // netIncomeUyu 75000 / grossIncomeUyu 100000 = 75%
    renderResults();

    // "75.0%" appears both in the highlight card and in the breakdown legend
    const pctElements = screen.getAllByText('75.0%');
    expect(pctElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/del bruto queda en tu bolsillo/)).toBeTruthy();
  });

  it('should not show take-home section in reverse mode', () => {
    renderResults({ mode: 'reverse' });

    // The take-home label/percentage is hidden in reverse mode (!isReverse)
    expect(screen.queryByText(/del bruto (queda|se va)/)).toBeNull();
  });
});

describe('Results — Currency emphasis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render both USD and UYU amounts', () => {
    renderResults({ currency: 'USD', netIncomeUsd: 1875, netIncomeUyu: 75000 });

    expect(screen.getByText(/US\$ 1,875/)).toBeTruthy();
    // formatUyu(75000) = '$75.000 UYU'
    expect(screen.getByText(/\$75\.000 UYU/)).toBeTruthy();
  });

  it('should swap primary/secondary when currency is UYU', () => {
    renderResults({ currency: 'UYU', netIncomeUsd: 1875, netIncomeUyu: 75000 });

    // formatUyu(75000) = '$75.000 UYU' — primary (text-4xl)
    const uyuEl = screen.getByText(/\$75\.000 UYU/);
    expect(uyuEl.className).toContain('text-4xl');

    // formatUsd(1875) = 'US$ 1,875' — secondary (text-lg)
    const usdEl = screen.getByText(/US\$ 1,875/);
    expect(usdEl.className).toContain('text-lg');
  });
});

describe('Results — Breakdown bar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render breakdown bar section', () => {
    renderResults();

    expect(screen.getByText('A dónde va tu dinero')).toBeTruthy();
  });

  it('should render net percent in breakdown legend', () => {
    renderResults({ netIncomeUyu: 75000, grossIncomeUyu: 100000 });

    // netPercent = 75000/100000 * 100 = 75%
    // Rendered as <strong>75.0%</strong> inside the "Neto" span
    const netoElements = screen.getAllByText(/Neto/);
    // "Neto" appears in the legend text, and "Ingreso Neto Estimado" in the highlight
    expect(netoElements.length).toBeGreaterThanOrEqual(1);

    // "75.0%" appears in both highlight card and breakdown bar
    const pctElements = screen.getAllByText('75.0%');
    expect(pctElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should render tax percent in breakdown legend', () => {
    renderResults({
      grossIncomeUyu: 100000,
      taxData: { ...defaultTaxData, bpsFonasa: 15000, irpf: 8000 },
    });

    // totalTaxes = 15000 + 8000 + 2000 = 25000
    // taxPercent = 25000/100000 * 100 = 25%
    expect(screen.getByText('Impuestos')).toBeTruthy();
  });

  it('should not overflow for local clients (VAT excluded from totalTaxes)', () => {
    renderResults({
      grossIncomeUyu: 100000,
      netIncomeUyu: 60000,
      taxData: {
        ...defaultTaxData,
        bpsFonasa: 15000,
        irpf: 8000,
        vat: 22000, // VAT is present but excluded from totalTaxes
        fondoSolidaridad: 2000,
      },
    });

    // netPercent = 60%, taxPercent = 25%, services = 0%
    // Bar widths: 60% + 25% = 85% — safe
    const netoElements = screen.getAllByText(/Neto/);
    expect(netoElements.length).toBeGreaterThanOrEqual(1);

    // The green bar should be 60% wide
    const greenBar = document.querySelector('.bg-green-500');
    expect(greenBar).toBeTruthy();
    expect((greenBar as HTMLElement).style.width).toBe('60%');
  });

  it('should show services segment when services exist', () => {
    renderResults({
      taxData: {
        ...defaultTaxData,
        accountantCost: 5000,
        escribanaCost: 3000,
        facturacionCost: 2000,
      },
    });

    expect(screen.getByText(/Gastos/)).toBeTruthy();
  });
});

describe('Results — Effective tax rate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render effective tax rate when present', () => {
    renderResults({
      taxData: { ...defaultTaxData, effectiveTaxRate: 25.0 },
    });

    expect(screen.getByText('Tasa Efectiva Total')).toBeTruthy();
    expect(screen.getByText('25%')).toBeTruthy();
  });

  it('should not render effective tax rate when absent', () => {
    renderResults({
      taxData: { ...defaultTaxData, effectiveTaxRate: undefined },
    });

    expect(screen.queryByText('Tasa Efectiva Total')).toBeNull();
  });
});

describe('Results — Comparison button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render comparison button when onCompare is provided', () => {
    renderResults({ onCompare: vi.fn() });

    expect(screen.getByText('Comparar regímenes impositivos')).toBeTruthy();
  });

  it('should not render comparison button when onCompare is omitted', () => {
    renderResults();

    expect(screen.queryByText('Comparar regímenes impositivos')).toBeNull();
  });

  it('should call onCompare when clicked', () => {
    const onCompare = vi.fn();
    renderResults({ onCompare });

    fireEvent.click(screen.getByText('Comparar regímenes impositivos'));
    expect(onCompare).toHaveBeenCalledTimes(1);
  });
});

describe('Results — Tax breakdown toggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render "Ver desglose detallado" button', () => {
    renderResults();

    expect(screen.getByText('Ver desglose detallado')).toBeTruthy();
  });

  it('should show TaxBreakdown when clicked', () => {
    renderResults();

    fireEvent.click(screen.getByText('Ver desglose detallado'));

    expect(screen.getByText('Desglose de Impuestos (USD)')).toBeTruthy();
  });

  it('should show breakdown with correct currency label', () => {
    renderResults({ currency: 'UYU' });

    fireEvent.click(screen.getByText('Ver desglose detallado'));

    expect(screen.getByText('Desglose de Impuestos (UYU)')).toBeTruthy();
  });
});

describe('Results — Guide modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open guide modal when button is clicked', () => {
    renderResults();

    // The "Ver guía completa de impuestos" text appears on both the card button
    // and inside the modal as a nav button
    const guideButtons = screen.getAllByText(/Ver guía completa de impuestos/);
    fireEvent.click(guideButtons[0]);

    expect(screen.getByText('Guía de Impuestos 2026')).toBeTruthy();
  });

  it('should close guide modal when close button is clicked', () => {
    renderResults();

    const guideButtons = screen.getAllByText(/Ver guía completa de impuestos/);
    fireEvent.click(guideButtons[0]);

    const closeButton = screen.getByLabelText('Cerrar guía');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Guía de Impuestos 2026')).toBeNull();
  });

  it('should close guide modal when clicking backdrop', () => {
    renderResults();

    const guideButtons = screen.getAllByText(/Ver guía completa de impuestos/);
    fireEvent.click(guideButtons[0]);

    // Click the backdrop overlay
    const backdrop = document.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop!);

    expect(screen.queryByText('Guía de Impuestos 2026')).toBeNull();
  });

  it('should dispatch navigate-to event from modal navigation', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    renderResults();

    const guideButtons = screen.getAllByText(/Ver guía completa de impuestos/);
    fireEvent.click(guideButtons[0]);

    // Second "Ver guía completa de impuestos" inside the modal
    const modalNavButtons = screen.getAllByText(/Ver guía completa de impuestos/);
    fireEvent.click(modalNavButtons[1]);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'navigate-to',
      }),
    );
  });
});

describe('Results — Edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle zero gross income without crashing', () => {
    renderResults({
      grossIncomeUyu: 0,
      netIncomeUyu: 0,
      netIncomeUsd: 0,
      taxData: {},
    });

    // Should render without division by zero errors
    expect(screen.getByText('Simulación')).toBeTruthy();
  });

  it('should handle missing optional tax fields', () => {
    renderResults({
      taxData: { effectiveTaxRate: 15 },
    });

    // Should render without crashing when bpsFonasa, irpf, etc are undefined
    expect(screen.getByText(/Simulación/)).toBeTruthy();
  });
});

describe('Results — BPC display in breakdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show custom BPC value in breakdown', () => {
    renderResults({ bpc: 7000 });

    fireEvent.click(screen.getByText('Ver desglose detallado'));

    // TaxBreakdown renders: ${(bpc ?? DEFAULT_BPC_2026).toLocaleString()} UYU
    // toLocaleString() defaults to en-US → comma separator
    expect(screen.getByText('$7,000 UYU')).toBeTruthy();
  });

  it('should show default BPC when custom BPC is not provided', () => {
    renderResults({ bpc: undefined });

    fireEvent.click(screen.getByText('Ver desglose detallado'));

    // Default BPC is 6864 → toLocaleString() = '6,864'
    expect(screen.getByText('$6,864 UYU')).toBeTruthy();
  });
});
