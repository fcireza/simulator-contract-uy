import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Inputs from './Inputs';
import { DEFAULT_BPC_2026, type TaxRegime, type FamilySituation } from '../utils/taxCalculator';

// Mock dark mode context
vi.mock('../hooks/DarkModeContext', () => ({
  useDarkModeContext: () => ({ darkMode: false }),
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
      exchangeRate={40}
      exchangeRateLoading={false}
      exchangeRateError={null}
      onClearPersisted={overrides?.onClearPersisted}
    />
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

    expect(onCalculate).toHaveBeenCalledWith(
      expect.objectContaining({ bpc: 7000 })
    );
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
    expect(onCalculate).toHaveBeenCalledWith(
      expect.objectContaining({ bpc: 0 })
    );
  });

  it('should not pass empty BPC (undefined, uses default downstream)', () => {
    const onCalculate = vi.fn();
    renderInputs({ onCalculate });

    // Don't touch BPC input — it stays empty
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

    // Empty string is falsy -> bpc: undefined
    expect(onCalculate).toHaveBeenCalledWith(
      expect.objectContaining({ bpc: undefined })
    );
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
