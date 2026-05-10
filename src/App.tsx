import { useState, useCallback, useEffect } from 'react';
import { useExchangeRate } from './hooks/useExchangeRate';
import Navbar from './components/Layout/Navbar';
import Inputs from './components/Inputs';
import Results from './components/Results';
import TaxBreakdown from './components/TaxBreakdown';
import ReverseSim from './components/ReverseSim';
import Guide from './views/Guide';
import RegimeComparison from './components/RegimeComparison';
import About from './views/About';
import Footer from './components/Layout/Footer';
import { calculateNet, compareRegimes, type TaxCalculationResult, type TaxRegime, type FamilySituation, type IraeExemption, type ReverseCalculationResult, DEFAULT_FAMILY } from './utils/taxCalculator';
import { useDarkMode } from './hooks/useDarkMode';

type ActiveTab = 'simulator' | 'guide' | 'about';
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
}

interface ComparisonModalProps {
  results: TaxCalculationResult[];
  darkMode: boolean;
  onClose: () => void;
}

function ComparisonModal({ results, darkMode, onClose }: ComparisonModalProps) {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`sticky top-0 flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Comparación de Regímenes
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <RegimeComparison results={results} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

const MemoizedResults = Results;

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Navigation state
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [mode, setMode] = useState<Mode>('normal');

  // Listen for navigation requests from modal
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: 'guide' }>;
      if (customEvent.detail?.tab === 'guide') {
        setActiveTab('guide');
      }
    };
    window.addEventListener('navigate-to', handleNavigate);
    return () => window.removeEventListener('navigate-to', handleNavigate);
  }, []);

  // Simulator settings state
  const { rate: fetchedRate, loading: rateLoading, error: rateError } = useExchangeRate(39.5);
  const [exchangeRateManual, setExchangeRateManual] = useState<number | null>(null);
  const exchangeRate = exchangeRateManual ?? fetchedRate;
  const [regime, setRegime] = useState<TaxRegime>('unipersonal');
  const [isUniversityProfessional, setIsUniversityProfessional] = useState(false);

  // Family situation (affects taxes automatically)
  const [family, setFamily] = useState<FamilySituation>(DEFAULT_FAMILY);

  // Results state
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [reverseResult, setReverseResult] = useState<ReverseCalculationResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<TaxCalculationResult[] | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [lastInput, setLastInput] = useState<CalculatorInput & { family?: FamilySituation } | null>(null);

  const handleCalculate = useCallback((inputs: CalculatorInput) => {
    setExchangeRateManual(inputs.exchangeRate);

    const detailedRegime: TaxRegime = inputs.regime === 'unipersonal'
      ? 'unipersonal'
      : (isUniversityProfessional ? 'sas-con-caja' : 'sas-sin-caja');

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
    });
    setResult(calcResult);
    setReverseResult(null);
    setComparisonResults(null);
  }, [isUniversityProfessional, family]);

  const handleReverseCalculate = useCallback((reverseResult: ReverseCalculationResult) => {
    setReverseResult(reverseResult);
    setResult(null);
  }, []);

  const handleRegimeChange = useCallback((newRegime: TaxRegime) => {
    setRegime(newRegime);
    if (newRegime === 'unipersonal') {
      setIsUniversityProfessional(false);
    }
    setResult(null);
    setReverseResult(null);
  }, []);

  const handleProfessionalChange = useCallback((value: boolean) => {
    setIsUniversityProfessional(value);
    if (regime !== 'unipersonal') {
      setRegime(value ? 'sas-con-caja' : 'sas-sin-caja');
    }
    setResult(null);
    setReverseResult(null);
  }, [regime]);

  const handleFamilyChange = useCallback((newFamily: FamilySituation) => {
    setFamily(newFamily);
  }, []);

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
    });
    setComparisonResults(comparison);
    setIsComparisonModalOpen(true);
  }, [lastInput, family]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} py-0 px-0`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="max-w-4xl mx-auto py-20 px-5">
        {activeTab === 'simulator' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Simulador de Ingresos
              </h1>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Calcula tu ingreso neto como contractor IT en Uruguay
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-1 shadow-md flex`}>
                <button
                  onClick={() => { setMode('normal'); setResult(null); setReverseResult(null); }}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    mode === 'normal'
                      ? 'bg-blue-600 text-white'
                      : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Simulación Normal
                </button>
                <button
                  onClick={() => { setMode('reverse'); setResult(null); setReverseResult(null); }}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    mode === 'reverse'
                      ? 'bg-green-600 text-white'
                      : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
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
                    onCalculate={handleCalculate}
                    mode={mode}
                    darkMode={darkMode}
                    regime={regime}
                    onRegimeChange={handleRegimeChange}
                    isUniversityProfessional={isUniversityProfessional}
                    onProfessionalChange={handleProfessionalChange}
                    family={family}
                    onFamilyChange={handleFamilyChange}
                    exchangeRate={exchangeRate}
                    exchangeRateLoading={rateLoading}
                    exchangeRateError={rateError}
                  />
                ) : (
                  <ReverseSim
                    onCalculate={handleReverseCalculate}
                    darkMode={darkMode}
                    isUniversityProfessional={isUniversityProfessional}
                    onProfessionalChange={handleProfessionalChange}
                    family={family}
                    onFamilyChange={handleFamilyChange}
                    exchangeRate={exchangeRate}
                    exchangeRateLoading={rateLoading}
                    exchangeRateError={rateError}
                  />
                )}
              </div>

              <div>
                {result ? (
                  <>
                    <MemoizedResults result={result} exchangeRate={exchangeRate} darkMode={darkMode} regime={regime} />
                    <button
                      onClick={handleCompare}
                      className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      Comparar con otros regímenes
                    </button>
                  </>
                ) : reverseResult ? (
                  <div className={`max-w-lg mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 space-y-4`}>
                    <h3 className={`text-xl font-bold border-b pb-2 ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
                      Resultado - Ingreso Requerido
                    </h3>

                    {/* Required Gross Income */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                      <p className="text-sm opacity-90">Ingreso Bruto Necesario</p>
                      <p className="text-3xl font-bold">US$ {reverseResult.requiredGrossUsd.toLocaleString('en-US')}</p>
                      <p className="text-lg">${reverseResult.requiredGrossUyu.toLocaleString('es-UY')} UYU</p>
                    </div>

                    {/* Determine regime from result data */}
                    {(() => {
                      const reverseRegime: 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja' =
                        (reverseResult.cajaProfesional ?? 0) > 0 ? 'sas-con-caja'
                        : (reverseResult.irae ?? 0) > 0 || reverseResult.iraeExemptionApplied ? 'sas-sin-caja'
                        : 'unipersonal';
                      const netIncome = reverseResult.requiredGrossUyu
                        - (reverseResult.bpsFonasa ?? 0)
                        - (reverseResult.irpf ?? 0)
                        - (reverseResult.cajaProfesional ?? 0)
                        - (reverseResult.irae ?? 0)
                        - (reverseResult.fondoSolidaridad ?? 0);
                      return (
                        <TaxBreakdown
                          data={reverseResult}
                          grossIncome={reverseResult.requiredGrossUyu}
                          netIncome={netIncome}
                          exchangeRate={exchangeRate}
                          darkMode={darkMode}
                          regime={reverseRegime}
                        />
                      );
                    })()}
                  </div>
                ) : (
                  <div className={`rounded-xl shadow-lg p-6 text-center ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                    <p>Ingresá los datos y presioná "Calcular" para ver los resultados</p>
                  </div>
                )}

                {isComparisonModalOpen && comparisonResults && (
                  <ComparisonModal
                    results={comparisonResults}
                    darkMode={darkMode}
                    onClose={() => setIsComparisonModalOpen(false)}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'guide' && <Guide darkMode={darkMode} />}

        {activeTab === 'about' && <About darkMode={darkMode} />}
      </div>
      <Footer darkMode={darkMode} onNavigate={setActiveTab} />
    </div>
  );
}

export default App;
