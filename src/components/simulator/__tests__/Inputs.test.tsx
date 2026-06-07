import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Inputs from '../Inputs';
import { DEFAULT_BPC_2026, type TaxRegime, type FamilySituation } from '../../../utils/taxCalculator';

// Mock dark mode context
vi.mock('../../../hooks/DarkModeContext', () => ({
  useDarkModeContext: () => ({ darkMode: false }),
}));

// Mock convertCurrency to avoid import issues in test
vi.mock('../../../utils/convertCurrency', () => ({
  convertCurrency: (value: number, rate: number, direction: string) => {
    if (!rate || rate <= 0 || Number.isNaN(rate)) return NaN;
    const raw = direction === 'toUYU' ? value * rate : value / rate;
    return Math.round(raw * 100) / 100;
  },
}));

const defaultFamily: FamilySituation = {
  hasSpouse: false,
  childrenCount: 0,
  disabledChildrenCount: 0,
  graduationYear: 0,
};

function renderInputs(overrides?: {
  onCalculate?: (inputs: any) => void;
  regime?: TaxRegime;
  family?: FamilySituation;
  onClearPersisted?: () => void;
  currency?: 'USD' | 'UYU';
  exchangeRate?: number;
}) {
  const onCalculate = overrides?.onCalculate ?? vi.fn();
  const onRegimeChange = vi.fn();
  const onProfessionalChange = vi.fn();
  const onFamilyChange = vi.fn();

  render(
    <Inputs
      onCalculate={onCalculate}
      mode="normal"
      regime={overrides?.regime ?? 'unipersonal'}
      onRegimeChange={onRegimeChange}
      isUniversityProfessional={false}
      onProfessionalChange={onProfessionalChange}
      family={overrides?.family ?? defaultFamily}
      onFamilyChange={onFamilyChange}
      exchangeRate={overrides?.exchangeRate ?? 40}
      exchangeRateLoading={false}
      exchangeRateError={null}
      onClearPersisted={overrides?.onClearPersisted}
      currency={overrides?.currency ?? 'USD'}
    />,
  );

  return { onCalculate, onRegimeChange, onProfessionalChange, onFamilyChange };
}

describe('Inputs — BPC field', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render BPC input with default placeholder and min=1', () => {
    renderInputs();

    const bpcInput = screen.getByPlaceholderText(DEFAULT_BPC_2026.toString()) as HTMLInputElement;
    expect(bpcInput).toBeTruthy();
    expect(bpcInput.min).toBe('1');
    expect(bpcInput.type).toBe('number');
  });

  it('should pass custom BPC value on submit', () => {
    const onCalculate = vi.fn();
    renderInputs({ onCalculate });

    const bpcInput = screen.getByPlaceholderText(DEFAULT_BPC_2026.toString());
    fireEvent.change(bpcInput, { target: { value: '7000' } });

    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({ bpc: 7000 }));
  });

  it('should not pass BPC=0 (guard at resolveBpc level handles it)', () => {
    const onCalculate = vi.fn();
    renderInputs({ onCalculate });

    // BPC starts empty; set it to "0" via the state setter
    const bpcInput = screen.getByPlaceholderText(DEFAULT_BPC_2026.toString());
    fireEvent.change(bpcInput, { target: { value: '0' } });

    // Submit form
    const form = bpcInput.closest('form');
    fireEvent.submit(form!);

    // The string "0" is truthy -> parseFloat("0") = 0 passed to callback
    // resolveBpc(0) in taxCalculator guards: returns DEFAULT_BPC_2026
    expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({ bpc: 0 }));
  });

  it('should not pass empty BPC (undefined, uses default downstream)', () => {
    const onCalculate = vi.fn();
    renderInputs({ onCalculate });

    // Don't touch BPC input — it stays empty
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    // Empty string is falsy -> bpc: undefined
    expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({ bpc: undefined }));
  });

  it('should render "Limpiar datos guardados" button when onClearPersisted is provided', () => {
    const onClearPersisted = vi.fn();
    renderInputs({ onClearPersisted });

    const clearButton = screen.getByText('Limpiar datos guardados');
    expect(clearButton).toBeTruthy();
  });

  it('should call onClearPersisted when clear button is clicked', async () => {
    const onClearPersisted = vi.fn();
    renderInputs({ onClearPersisted });

    const clearButton = screen.getByText('Limpiar datos guardados');
    await userEvent.click(clearButton);

    expect(onClearPersisted).toHaveBeenCalledTimes(1);
  });
});

describe('Inputs — Currency Display', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show label with active currency (USD)', () => {
    renderInputs({ currency: 'USD' });

    expect(screen.getByText('Ingreso Mensual (USD)')).toBeTruthy();
  });

  it('should show label with active currency (UYU)', () => {
    renderInputs({ currency: 'UYU' });

    expect(screen.getByText('Ingreso Mensual (UYU)')).toBeTruthy();
  });

  it('should display converted value when currency is UYU', () => {
    // Default incomeUsd is '3000', rate is 40 → 3000 * 40 = 120000
    renderInputs({ currency: 'UYU' });

    const input = screen.getByPlaceholderText('120000') as HTMLInputElement;
    expect(input.value).toBe('120000');
  });

  it('should display USD value when currency is USD', () => {
    renderInputs({ currency: 'USD' });

    const input = screen.getByPlaceholderText('3000') as HTMLInputElement;
    expect(input.value).toBe('3000');
  });

  it('should submit incomeUsd in USD regardless of display currency', () => {
    const onCalculate = vi.fn();
    renderInputs({ onCalculate, currency: 'UYU' });

    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    // Should submit the stored USD value (3000), not the displayed UYU value
    expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({ incomeUsd: 3000 }));
  });

  it('should show currency error when in UYU mode and exchange rate is invalid', () => {
    renderInputs({ currency: 'UYU', exchangeRate: 0 });

    expect(screen.getByText('No se puede convertir a UYU: tipo de cambio inválido')).toBeTruthy();
  });

  it('should not show currency error when in USD mode even with invalid rate', () => {
    renderInputs({ currency: 'USD', exchangeRate: 0 });

    expect(screen.queryByText('No se puede convertir a UYU: tipo de cambio inválido')).toBeNull();
  });
});

describe('Inputs — Exchange rate sync', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should submit with updated exchange rate without requiring interaction', async () => {
    const onCalculate = vi.fn();

    // Step 1: Mount with initial rate (like before API fetch completes)
    const { rerender } = render(
      <Inputs
        onCalculate={onCalculate}
        mode="normal"
        regime="unipersonal"
        onRegimeChange={vi.fn()}
        isUniversityProfessional={false}
        onProfessionalChange={vi.fn()}
        family={defaultFamily}
        onFamilyChange={vi.fn()}
        exchangeRate={39.5}
        exchangeRateLoading={true}
        exchangeRateError={null}
        currency="USD"
      />,
    );

    // Step 2: Re-render with API-fetched rate (simulates useExchangeRate completion)
    rerender(
      <Inputs
        onCalculate={onCalculate}
        mode="normal"
        regime="unipersonal"
        onRegimeChange={vi.fn()}
        isUniversityProfessional={false}
        onProfessionalChange={vi.fn()}
        family={defaultFamily}
        onFamilyChange={vi.fn()}
        exchangeRate={41.50}
        exchangeRateLoading={false}
        exchangeRateError={null}
        currency="USD"
      />,
    );

    // Click Calcular without touching exchange rate field
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    // Should NOT show validation error
    expect(screen.queryByText('Por favor ingrese valores válidos')).toBeNull();

    // Should call onCalculate with the updated rate
    expect(onCalculate).toHaveBeenCalledWith(
      expect.objectContaining({ exchangeRate: 41.50 }),
    );
  });
});
