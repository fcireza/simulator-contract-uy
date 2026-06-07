import { useState, useCallback, useEffect, useRef } from 'react';
import Inputs from '../components/Inputs';
import Results from '../components/Results';
import ReverseSim from '../components/ReverseSim';
import RegimeComparison from '../components/RegimeComparison';
import ThemeCard from '../components/ThemeCard';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useDarkModeContext } from '../hooks/DarkModeContext';
import usePersistedState from '../hooks/usePersistedState';
import {
  calculateNet,
  compareRegimes,
  type TaxCalculationResult,
  type TaxRegime,
  type FamilySituation,
  type IraeExemption,
  type ReverseCalculationResult,
  DEFAULT_FAMILY,
} from '../utils/taxCalculator';

type Mode = 'normal' | 'reverse';

interface CalculatorInput {
  incomeUsd: number;
  exchangeRate: number;
  clientType: 'local' | 'exterior';
  regime: 'unipersonal' | 'sas';
  useAccountant: boolean;
  useEscribana: boolean;
  useFacturacion: boolean;
  accountantCost?: number;
  escribanaCost?: number;
  facturacionCost?: number;
  iraeExemption?: IraeExemption;
  bpc?: number;
}

interface ComparisonModalProps {
  results: TaxCalculationResult[];
  onClose: () => void;
  bpc?: number;
}

function ComparisonModal({ results, onClose, bpc }: ComparisonModalProps) {
  const { darkMode } = useDarkModeContext();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (closeRef.current) {
      closeRef.current.focus();
    }
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Comparación de Regímenes"
      >
        <div
          className={`sticky top-0 flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
        >
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Comparación de Regímenes
            </h2>
            {bpc !== undefined && (
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                BPC: ${bpc.toLocaleString()} UYU
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Cerrar comparación"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <RegimeComparison results={results} />
        </div>
      </div>
    </div>
  );
}

export default function Simulators() {
  const { darkMode } = useDarkModeContext();
  const [mode, setMode] = useState<Mode>('normal');
  const [resetKey, setResetKey] = useState(0);
  const [currency, setCurrency] = usePersistedState<'USD' | 'UYU'>('simulator-currency', 'USD');

  // Exchange rate
  const { rate: fetchedRate, loading: rateLoading, error: rateError } = useExchangeRate(39.5);
  const [exchangeRateManual, setExchangeRateManual] = useState<number | null>(null);
  const exchangeRate = exchangeRateManual ?? fetchedRate;

  // Simulator settings
  const [regime, setRegime] = usePersistedState<TaxRegime>('simulator-regime', 'unipersonal');
  const [isUniversityProfessional, setIsUniversityProfessional] = usePersistedState<boolean>(
    'simulator-isUniversityProfessional',
    false,
  );
  const [family, setFamily] = usePersistedState<FamilySituation>('simulator-family', DEFAULT_FAMILY);

  // Results
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [reverseResult, setReverseResult] = useState<ReverseCalculationResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<TaxCalculationResult[] | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [lastInput, setLastInput] = useState<(CalculatorInput & { family?: FamilySituation }) | null>(null);
  const [reverseBpc, setReverseBpc] = useState<number | undefined>();

  // ── Handlers ──

  const handleCalculate = useCallback(
    (inputs: CalculatorInput) => {
      setExchangeRateManual(inputs.exchangeRate);

      const detailedRegime: TaxRegime =
        inputs.regime === 'unipersonal' ? 'unipersonal' : isUniversityProfessional ? 'sas-con-caja' : 'sas-sin-caja';

      setRegime(detailedRegime);
      setLastInput(inputs);

      const calcResult = calculateNet({
        incomeUsd: inputs.incomeUsd,
        exchangeRate: inputs.exchangeRate,
        clientType: inputs.clientType,
        regime: detailedRegime,
        useAccountant: inputs.useAccountant,
        useEscribana: inputs.useEscribana,
        useFacturacion: inputs.useFacturacion,
        accountantCost: inputs.accountantCost,
        escribanaCost: inputs.escribanaCost,
        facturacionCost: inputs.facturacionCost,
        family,
        iraeExemption: inputs.iraeExemption,
        bpc: inputs.bpc,
      });
      setResult(calcResult);
      setReverseResult(null);
      setComparisonResults(null);
    },
    [isUniversityProfessional, family, setRegime],
  );

  const handleReverseCalculate = useCallback((revResult: ReverseCalculationResult, bpc?: number) => {
    setReverseResult(revResult);
    setReverseBpc(bpc);
    setResult(null);
  }, []);

  const handleRegimeChange = useCallback((newRegime: TaxRegime) => {
    setRegime(newRegime);
    if (newRegime === 'unipersonal') {
      setIsUniversityProfessional(false);
    }
    setResult(null);
    setReverseResult(null);
  }, [setRegime, setIsUniversityProfessional]);

  const handleProfessionalChange = useCallback(
    (value: boolean) => {
      setIsUniversityProfessional(value);
      if (regime !== 'unipersonal') {
        setRegime(value ? 'sas-con-caja' : 'sas-sin-caja');
      }
      setResult(null);
      setReverseResult(null);
    },
    [regime, setIsUniversityProfessional, setRegime],
  );

  const handleFamilyChange = useCallback((newFamily: FamilySituation) => {
    setFamily(newFamily);
  }, [setFamily]);

  const handleCompare = useCallback(() => {
    if (!lastInput) return;
    const comparison = compareRegimes({
      incomeUsd: lastInput.incomeUsd,
      exchangeRate: lastInput.exchangeRate,
      clientType: lastInput.clientType,
      useAccountant: lastInput.useAccountant,
      useEscribana: lastInput.useEscribana,
      useFacturacion: lastInput.useFacturacion,
      accountantCost: lastInput.accountantCost,
      escribanaCost: lastInput.escribanaCost,
      facturacionCost: lastInput.facturacionCost,
      family,
      iraeExemption: lastInput.iraeExemption,
      bpc: lastInput.bpc,
    });
    setComparisonResults(comparison);
    setIsComparisonModalOpen(true);
  }, [lastInput, family]);

  const handleClearPersisted = useCallback(() => {
    setRegime('unipersonal');
    setIsUniversityProfessional(false);
    setFamily(DEFAULT_FAMILY);
    setExchangeRateManual(null);
    setResult(null);
    setReverseResult(null);
    setLastInput(null);
    setCurrency('USD');
    setResetKey((k) => k + 1);
  }, [setRegime, setIsUniversityProfessional, setFamily, setExchangeRateManual, setCurrency]);

  const handleCurrencyToggle = useCallback(() => {
    setCurrency((prev) => (prev === 'USD' ? 'UYU' : 'USD'));
  }, [setCurrency]);

  // ── JSX ──

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Simulador de Ingresos</h1>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Calcula tu ingreso neto como contractor IT en Uruguay
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-1 shadow-md flex`}>
          <button
            onClick={() => {
              setMode('normal');
              setResult(null);
              setReverseResult(null);
            }}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === 'normal'
                ? 'bg-blue-600 text-white'
                : darkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Simulación Normal
          </button>
          <button
            onClick={() => {
              setMode('reverse');
              setResult(null);
              setReverseResult(null);
            }}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === 'reverse'
                ? 'bg-green-600 text-white'
                : darkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Simulación Inversa
          </button>
        </div>
      </div>

      <div className={`grid md:grid-cols-2 gap-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <div>
          {mode === 'normal' ? (
            <Inputs
              key={resetKey}
              onCalculate={handleCalculate}
              mode={mode}
              regime={regime}
              onRegimeChange={handleRegimeChange}
              isUniversityProfessional={isUniversityProfessional}
              onProfessionalChange={handleProfessionalChange}
              family={family}
              onFamilyChange={handleFamilyChange}
              exchangeRate={exchangeRate}
              exchangeRateLoading={rateLoading}
              exchangeRateError={rateError}
              onClearPersisted={handleClearPersisted}
              currency={currency}
              onCurrencyToggle={handleCurrencyToggle}
            />
          ) : (
            <ReverseSim
              key={resetKey}
              onCalculate={handleReverseCalculate}
              isUniversityProfessional={isUniversityProfessional}
              onProfessionalChange={handleProfessionalChange}
              family={family}
              onFamilyChange={handleFamilyChange}
              exchangeRate={exchangeRate}
              exchangeRateLoading={rateLoading}
              exchangeRateError={rateError}
              onClearPersisted={handleClearPersisted}
              currency={currency}
              onCurrencyToggle={handleCurrencyToggle}
            />
          )}
        </div>

        <div>
          {result ? (
            <Results
              grossIncomeUyu={result.incomeUyu}
              netIncomeUyu={result.netUyu}
              netIncomeUsd={result.netUsd}
              taxData={result}
              exchangeRate={exchangeRate}
              regime={regime}
              mode="normal"
              onCompare={handleCompare}
              bpc={lastInput?.bpc}
              currency={currency}
            />
          ) : reverseResult ? (
            (() => {
              const reverseRegime: 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja' =
                (reverseResult.cajaProfesional ?? 0) > 0
                  ? 'sas-con-caja'
                  : (reverseResult.irae ?? 0) > 0 || reverseResult.iraeExemptionApplied
                    ? 'sas-sin-caja'
                    : 'unipersonal';
              const netIncomeUyu =
                reverseResult.requiredGrossUyu -
                (reverseResult.bpsFonasa ?? 0) -
                (reverseResult.irpf ?? 0) -
                (reverseResult.cajaProfesional ?? 0) -
                (reverseResult.irae ?? 0) -
                (reverseResult.fondoSolidaridad ?? 0) -
                (reverseResult.accountantCost ?? 0) -
                (reverseResult.escribanaCost ?? 0) -
                (reverseResult.facturacionCost ?? 0);
              const netIncomeUsd = netIncomeUyu / exchangeRate;
              return (
                <Results
                  grossIncomeUyu={reverseResult.requiredGrossUyu}
                  netIncomeUyu={netIncomeUyu}
                  netIncomeUsd={netIncomeUsd}
                  taxData={reverseResult}
                  exchangeRate={exchangeRate}
                  regime={reverseRegime}
                  mode="reverse"
                  bpc={reverseBpc}
                  currency={currency}
                />
              );
            })()
          ) : (
            <ThemeCard className="text-center">
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Ingresá los datos y presioná "Calcular" para ver los resultados
              </p>
            </ThemeCard>
          )}

          {isComparisonModalOpen && comparisonResults && (
            <ComparisonModal
              results={comparisonResults}
              onClose={() => setIsComparisonModalOpen(false)}
              bpc={lastInput?.bpc}
            />
          )}
        </div>
      </div>
    </>
  );
}
