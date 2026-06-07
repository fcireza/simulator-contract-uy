import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReverseSim from './ReverseSim';
import { type FamilySituation } from '../utils/taxCalculator';

// Mock dark mode context
vi.mock('../hooks/DarkModeContext', () => ({
  useDarkModeContext: () => ({ darkMode: false }),
}));

// Mock convertCurrency to avoid import issues in test
vi.mock('../utils/convertCurrency', () => ({
  convertCurrency: (value: number, rate: number, direction: string) => {
    if (!rate || rate <= 0 || Number.isNaN(rate)) return NaN;
    const raw = direction === 'toUYU' ? value * rate : value / rate;
    return Math.round(raw * 100) / 100;
  },
}));

// Mock reverseCalculate
const mockReverseCalculate = vi.fn();
vi.mock('../utils/taxCalculator', async () => {
  const actual = await vi.importActual('../utils/taxCalculator');
  return {
    ...actual,
    reverseCalculate: (...args: any[]) => mockReverseCalculate(...args),
  };
});

const defaultFamily: FamilySituation = {
  hasSpouse: false,
  childrenCount: 0,
  disabledChildrenCount: 0,
  graduationYear: 0,
};

function renderReverseSim(overrides?: {
  onCalculate?: (result: any, bpc?: number) => void;
  family?: FamilySituation;
  onClearPersisted?: () => void;
  currency?: 'USD' | 'UYU';
  exchangeRate?: number;
  exchangeRateError?: string | null;
}) {
  const onCalculate = overrides?.onCalculate ?? vi.fn();
  const onProfessionalChange = vi.fn();
  const onFamilyChange = vi.fn();

  render(
    <ReverseSim
      onCalculate={onCalculate}
      isUniversityProfessional={false}
      onProfessionalChange={onProfessionalChange}
      family={overrides?.family ?? defaultFamily}
      onFamilyChange={onFamilyChange}
      exchangeRate={overrides?.exchangeRate ?? 40}
      exchangeRateLoading={false}
      exchangeRateError={overrides?.exchangeRateError ?? null}
      onClearPersisted={overrides?.onClearPersisted}
      currency={overrides?.currency ?? 'USD'}
    />,
  );

  return { onCalculate, onProfessionalChange, onFamilyChange };
}

describe('ReverseSim — Currency Display', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show label with active currency (USD)', () => {
    renderReverseSim({ currency: 'USD' });

    expect(screen.getByText('Ingreso Neto Deseado (USD)')).toBeTruthy();
  });

  it('should show label with active currency (UYU)', () => {
    renderReverseSim({ currency: 'UYU' });

    expect(screen.getByText('Ingreso Neto Deseado (UYU)')).toBeTruthy();
  });

  it('should display converted value when currency is UYU', () => {
    // Default targetNetUsd is '2000', rate is 40 → 2000 * 40 = 80000
    renderReverseSim({ currency: 'UYU' });

    const input = screen.getByPlaceholderText('80000') as HTMLInputElement;
    expect(input.value).toBe('80000');
  });

  it('should display USD value when currency is USD', () => {
    renderReverseSim({ currency: 'USD' });

    const input = screen.getByPlaceholderText('2000') as HTMLInputElement;
    expect(input.value).toBe('2000');
  });

  it('should have numeric inputMode for income input', () => {
    renderReverseSim({ currency: 'USD' });

    const input = screen.getByPlaceholderText('2000') as HTMLInputElement;
    expect(input.inputMode).toBe('numeric');
  });

  it('should have numeric inputMode in UYU mode too', () => {
    renderReverseSim({ currency: 'UYU' });

    const input = screen.getByPlaceholderText('80000') as HTMLInputElement;
    expect(input.inputMode).toBe('numeric');
  });

  it('should submit targetNetUsd in USD regardless of display currency', () => {
    const onCalculate = vi.fn();
    mockReverseCalculate.mockReturnValue({
      requiredGrossUyu: 100000,
      bpsFonasa: 10000,
      irpf: 5000,
      netUyu: 85000,
    });
    renderReverseSim({ onCalculate, currency: 'UYU' });

    // Submit with UYU display — should convert back to USD for storage
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    // Should submit the stored USD value (2000), not the displayed UYU value (80000)
    expect(mockReverseCalculate).toHaveBeenCalledWith(
      expect.objectContaining({ targetNetUsd: 2000 }),
    );
  });

  it('should show currency error when in UYU mode and exchange rate is invalid', () => {
    renderReverseSim({ currency: 'UYU', exchangeRate: 0 });

    expect(screen.getByText('No se puede convertir a UYU: tipo de cambio inválido')).toBeTruthy();
  });

  it('should not show currency error when in USD mode even with invalid rate', () => {
    renderReverseSim({ currency: 'USD', exchangeRate: 0 });

    expect(screen.queryByText('No se puede convertir a UYU: tipo de cambio inválido')).toBeNull();
  });

  it('should hide currency error when switching back to USD', () => {
    const { rerender } = render(
      <ReverseSim
        onCalculate={vi.fn()}
        isUniversityProfessional={false}
        onProfessionalChange={vi.fn()}
        family={defaultFamily}
        onFamilyChange={vi.fn()}
        exchangeRate={0}
        exchangeRateLoading={false}
        exchangeRateError={null}
        currency="UYU"
      />,
    );

    expect(screen.getByText('No se puede convertir a UYU: tipo de cambio inválido')).toBeTruthy();

    rerender(
      <ReverseSim
        onCalculate={vi.fn()}
        isUniversityProfessional={false}
        onProfessionalChange={vi.fn()}
        family={defaultFamily}
        onFamilyChange={vi.fn()}
        exchangeRate={0}
        exchangeRateLoading={false}
        exchangeRateError={null}
        currency="USD"
      />,
    );

    expect(screen.queryByText('No se puede convertir a UYU: tipo de cambio inválido')).toBeNull();
  });

  it('should convert typed UYU value back to USD for storage on submit', () => {
    const onCalculate = vi.fn();
    mockReverseCalculate.mockReturnValue({
      requiredGrossUyu: 100000,
      bpsFonasa: 10000,
      irpf: 5000,
      netUyu: 85000,
    });
    renderReverseSim({ onCalculate, currency: 'UYU' });

    // Default is 2000 USD → 80000 UYU displayed
    const input = screen.getByPlaceholderText('80000') as HTMLInputElement;
    expect(input.value).toBe('80000');

    // Type 100000 UYU directly via fireEvent (full value at once)
    fireEvent.change(input, { target: { value: '100000' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    // 100000 UYU / 40 rate = 2500 USD should be passed to reverseCalculate
    expect(mockReverseCalculate).toHaveBeenCalledWith(
      expect.objectContaining({ targetNetUsd: 2500 }),
    );
  });
});

describe('ReverseSim — Validation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show validation error when target net is empty', () => {
    renderReverseSim();

    // Clear the target input
    const input = screen.getByPlaceholderText('2000') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    expect(screen.getByText('Por favor ingrese valores válidos')).toBeTruthy();
  });

  it('should show validation error when exchange rate is empty', () => {
    renderReverseSim();

    // ExchangeRateField doesn't use htmlFor, so use placeholder to find it
    const rateInput = screen.getByPlaceholderText('39.5') as HTMLInputElement;
    fireEvent.change(rateInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    expect(screen.getByText('Por favor ingrese valores válidos')).toBeTruthy();
  });

  it('should call onCalculate and clear validation on valid submit', () => {
    const onCalculate = vi.fn();
    mockReverseCalculate.mockReturnValue({
      requiredGrossUyu: 100000,
      bpsFonasa: 10000,
      irpf: 5000,
      netUyu: 85000,
    });
    renderReverseSim({ onCalculate });

    // First trigger validation error
    const input = screen.getByPlaceholderText('2000') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));
    expect(screen.getByText('Por favor ingrese valores válidos')).toBeTruthy();

    // Fix input and submit again
    fireEvent.change(input, { target: { value: '3000' } });
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    // Validation error should be gone
    expect(screen.queryByText('Por favor ingrese valores válidos')).toBeNull();
    expect(onCalculate).toHaveBeenCalledTimes(1);
  });

  it('should render "Limpiar datos guardados" button when onClearPersisted is provided', () => {
    renderReverseSim({ onClearPersisted: vi.fn() });

    expect(screen.getByText('Limpiar datos guardados')).toBeTruthy();
  });

  it('should call onClearPersisted when clear button is clicked', async () => {
    const onClearPersisted = vi.fn();
    renderReverseSim({ onClearPersisted });

    await userEvent.click(screen.getByText('Limpiar datos guardados'));

    expect(onClearPersisted).toHaveBeenCalledTimes(1);
  });
});
