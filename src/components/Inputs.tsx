import { useState, useEffect, type FormEvent, useCallback } from 'react';
import type { TaxRegime, FamilySituation, IraeExemption } from '../utils/taxCalculator';
import ThemeCard from './ThemeCard';
import CollapsibleSection from './CollapsibleSection';
import ExchangeRateField from './ExchangeRateField';
import ClientTypeField from './ClientTypeField';
import RegimeSelector from './RegimeSelector';
import { useDarkModeContext } from '../hooks/DarkModeContext';

interface InputsProps {
  onCalculate: (inputs: {
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
  }) => void;
  mode: 'normal' | 'reverse';
  regime: TaxRegime;
  onRegimeChange: (regime: TaxRegime) => void;
  isUniversityProfessional: boolean;
  onProfessionalChange: (value: boolean) => void;
  family: FamilySituation;
  onFamilyChange: (family: FamilySituation) => void;
  exchangeRate: number;
  exchangeRateLoading?: boolean;
  exchangeRateError?: string | null;
}

export default function Inputs({ onCalculate, mode, regime, onRegimeChange, isUniversityProfessional, onProfessionalChange, family, onFamilyChange, exchangeRate, exchangeRateLoading, exchangeRateError }: InputsProps) {
  const { darkMode } = useDarkModeContext();
  const [incomeUsd, setIncomeUsd] = useState<string>('3000');
  const [exchangeRateInput, setExchangeRateInput] = useState<string>(exchangeRate.toString());
  const [clientType, setClientType] = useState<'local' | 'exterior'>('exterior');
  const [useAccountant, setUseAccountant] = useState(false);
  const [useEscribana, setUseEscribana] = useState(false);
  const [useFacturacion, setUseFacturacion] = useState(false);
  const [accountantCost, setAccountantCost] = useState<string>('5000');
  const [escribanaCost, setEscribanaCost] = useState<string>('8000');
  const [facturacionCost, setFacturacionCost] = useState<string>('3000');
  const [iraeExemption, setIraeExemption] = useState<IraeExemption>('none');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update exchange rate input when the fetched rate changes
  useEffect(() => {
    setExchangeRateInput(exchangeRate.toString());
  }, [exchangeRate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const income = parseFloat(incomeUsd);
    const rate = parseFloat(exchangeRateInput);

    if (isNaN(income) || isNaN(rate) || income <= 0 || rate <= 0) {
      setValidationError('Por favor ingrese valores válidos');
      return;
    }
    setValidationError(null);

    onCalculate({
      incomeUsd: income,
      exchangeRate: rate,
      clientType,
      regime: regime === 'unipersonal' ? 'unipersonal' : 'sas',
      useAccountant,
      useEscribana,
      useFacturacion,
      accountantCost: useAccountant ? parseFloat(accountantCost) : undefined,
      escribanaCost: useEscribana ? parseFloat(escribanaCost) : undefined,
      facturacionCost: useFacturacion ? parseFloat(facturacionCost) : undefined,
      iraeExemption: regime !== 'unipersonal' ? iraeExemption : undefined,
    });
  };

  const handleFamilyToggle = useCallback((field: keyof FamilySituation, value: boolean | number) => {
    onFamilyChange({ ...family, [field]: value });
  }, [family, onFamilyChange]);

  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const inputClass = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400'
    : 'border-gray-300 focus:ring-blue-500';
  const checkboxLabelClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const radioLabelClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <ThemeCard className="max-w-md mx-auto space-y-4">
      <h2 className={`text-2xl font-bold ${textClass}`}>
        {mode === 'normal' ? 'Simulación de Ingresos' : 'Simulación Inversa'}
      </h2>

      <RegimeSelector
        regime={regime}
        onRegimeChange={onRegimeChange}
        isUniversityProfessional={isUniversityProfessional}
        onProfessionalChange={onProfessionalChange}
        iraeExemption={iraeExemption}
        onIraeExemptionChange={setIraeExemption}
        labelClass={labelClass}
        inputClass={inputClass}
        darkMode={darkMode}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${labelClass} mb-1`}>
            Ingreso Mensual (USD)
          </label>
          <input
            type="number"
            value={incomeUsd}
            onChange={(e) => setIncomeUsd(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
            placeholder="3000"
            min="0"
            step="100"
          />
        </div>

        <ExchangeRateField
          value={exchangeRateInput}
          onChange={setExchangeRateInput}
          loading={exchangeRateLoading}
          error={exchangeRateError}
          labelClass={labelClass}
          inputClass={inputClass}
        />

        <ClientTypeField
          value={clientType}
          onChange={setClientType}
          labelClass={labelClass}
          radioLabelClass={radioLabelClass}
          name="clientType"
        />

        {/* Family Situation - Collapsible (FONASA varies by family for Unipersonal and SAS sin Caja) */}
        {regime !== 'sas-con-caja' && (
          <CollapsibleSection title="Situación Familiar">
            <div className="space-y-3">
                {/* Spouse */}
                <label className={`flex items-center ${checkboxLabelClass}`}>
                  <input
                    type="checkbox"
                    checked={family.hasSpouse}
                    onChange={(e) => handleFamilyToggle('hasSpouse', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Cónyuge a cargo</span>
                </label>

                {/* Children */}
                <div>
                  <label className={`flex items-center ${checkboxLabelClass}`}>
                    <input
                      type="checkbox"
                      checked={family.childrenCount > 0 || family.disabledChildrenCount > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Check: set default to 1 child
                          if (family.childrenCount === 0 && family.disabledChildrenCount === 0) {
                            handleFamilyToggle('childrenCount', 1);
                          }
                        } else {
                          // Uncheck: clear both
                          handleFamilyToggle('childrenCount', 0);
                          handleFamilyToggle('disabledChildrenCount', 0);
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">Hijos a cargo</span>
                  </label>
                  {(family.childrenCount > 0 || family.disabledChildrenCount > 0) && (
                    <div className="flex items-center gap-3 ml-6 mt-2">
                      <div>
                        <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sin discapacidad</label>
                        <input
                          type="number"
                          value={family.childrenCount}
                          onChange={(e) => handleFamilyToggle('childrenCount', Math.max(0, parseInt(e.target.value) || 0))}
                          className={`w-16 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Con discapacidad</label>
                        <input
                          type="number"
                          value={family.disabledChildrenCount}
                          onChange={(e) => handleFamilyToggle('disabledChildrenCount', Math.max(0, parseInt(e.target.value) || 0))}
                          className={`w-16 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Graduation Year */}
                <div>
                  <label className={`block text-sm ${checkboxLabelClass} mb-1`}>
                    Año de graduación universitaria
                  </label>
                  <input
                    type="number"
                    value={family.graduationYear || ''}
                    onChange={(e) => handleFamilyToggle('graduationYear', parseInt(e.target.value) || 0)}
                    className={`w-24 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}
                    placeholder="Ej: 2018"
                    min="1990"
                    max="2026"
                  />
                  {family.graduationYear > 0 && (
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {2026 - family.graduationYear >= 5
                        ? '→ Fondo de Solidaridad se aplica automáticamente'
                        : `→ ${5 - (2026 - family.graduationYear)} año(s) para Fondo de Solidaridad`}
                    </p>
                  )}
                </div>
              </div>
          </CollapsibleSection>
        )}

        {/* Services - Collapsible Section */}
        <CollapsibleSection title="Gastos Deducibles">
            <div className="space-y-2">
                {/* Accountant */}
                <label className={`flex items-center ${checkboxLabelClass}`}>
                  <input
                    type="checkbox"
                    checked={useAccountant}
                    onChange={(e) => setUseAccountant(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Servicio de Contador</span>
                </label>
                {useAccountant && (
                  <div className="flex items-center gap-2 ml-6">
                    <input
                      type="number"
                      value={accountantCost}
                      onChange={(e) => setAccountantCost(e.target.value)}
                      className={`w-24 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}
                      placeholder="5000"
                      min="0"
                    />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>UYU</span>
                  </div>
                )}

                {/* Escribana - SOLO para SAS */}
                {regime !== 'unipersonal' && (
                  <>
                    <label className={`flex items-center ${checkboxLabelClass}`}>
                      <input
                        type="checkbox"
                        checked={useEscribana}
                        onChange={(e) => setUseEscribana(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Servicio de Escribana (SAS)</span>
                    </label>
                    {useEscribana && (
                      <div className="flex items-center gap-2 ml-6">
                        <input
                          type="number"
                          value={escribanaCost}
                          onChange={(e) => setEscribanaCost(e.target.value)}
                          className={`w-24 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}
                          placeholder="8000"
                          min="0"
                        />
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>UYU</span>
                      </div>
                    )}
                  </>
                )}

                {/* Facturación */}
                <label className={`flex items-center ${checkboxLabelClass} mt-2`}>
                  <input
                    type="checkbox"
                    checked={useFacturacion}
                    onChange={(e) => setUseFacturacion(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Servicio de Facturación</span>
                </label>
                {useFacturacion && (
                  <div className="flex items-center gap-2 ml-6">
                    <input
                      type="number"
                      value={facturacionCost}
                      onChange={(e) => setFacturacionCost(e.target.value)}
                      className={`w-24 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}
                      placeholder="3000"
                      min="0"
                    />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>UYU</span>
                  </div>
                )}
              </div>
        </CollapsibleSection>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Calcular
        </button>
        {validationError && (
          <p className="text-red-500 text-sm mt-1">{validationError}</p>
        )}
      </form>
    </ThemeCard>
  );
}
