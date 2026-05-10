import { useState, useEffect, type FormEvent, useCallback } from 'react';
import type { TaxRegime, FamilySituation, IraeExemption } from '../utils/taxCalculator';
import Tooltip from './Tooltip';

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
  darkMode: boolean;
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

export default function Inputs({ onCalculate, mode, darkMode, regime, onRegimeChange, isUniversityProfessional, onProfessionalChange, family, onFamilyChange, exchangeRate, exchangeRateLoading, exchangeRateError }: InputsProps) {
  const [incomeUsd, setIncomeUsd] = useState<string>('3000');
  const [exchangeRateInput, setExchangeRateInput] = useState<string>(exchangeRate.toString());
  const [clientType, setClientType] = useState<'local' | 'exterior'>('exterior');
  const [useAccountant, setUseAccountant] = useState(false);
  const [useEscribana, setUseEscribana] = useState(false);
  const [useFacturacion, setUseFacturacion] = useState(false);
  const [accountantCost, setAccountantCost] = useState<string>('5000');
  const [escribanaCost, setEscribanaCost] = useState<string>('8000');
  const [facturacionCost, setFacturacionCost] = useState<string>('3000');
  const [servicesOpen, setServicesOpen] = useState(true);
  const [familyOpen, setFamilyOpen] = useState(false);
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

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const inputClass = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400'
    : 'border-gray-300 focus:ring-blue-500';
  const checkboxLabelClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const radioLabelClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`max-w-md mx-auto ${bgClass} rounded-xl shadow-lg p-6 space-y-4`}>
      <h2 className={`text-2xl font-bold ${textClass}`}>
        {mode === 'normal' ? 'Simulación de Ingresos' : 'Simulación Inversa'}
      </h2>

      {/* Regime Selector */}
      <div className="mb-4">
        <label className={`block text-sm font-medium ${labelClass} mb-2`}>
          Régimen Impositivo
        </label>
        <select
          value={regime === 'unipersonal' ? 'unipersonal' : 'sas'}
          onChange={(e) => {
            if (e.target.value === 'unipersonal') {
              onRegimeChange('unipersonal');
            } else {
              onRegimeChange(isUniversityProfessional ? 'sas-con-caja' : 'sas-sin-caja');
            }
          }}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
        >
          <option value="unipersonal">Unipersonal (IRPF + BPS/FONASA)</option>
          <option value="sas">SAS (Sociedad Anónima Simplificada)</option>
        </select>

        {/* Caja Profesional Toggle - only for SAS */}
        {regime !== 'unipersonal' && (
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-sm ${labelClass}`}>
              Aporta a Caja Profesional
            </span>
            <button
              type="button"
              onClick={() => onProfessionalChange(!isUniversityProfessional)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isUniversityProfessional
                  ? 'bg-blue-600'
                  : darkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isUniversityProfessional ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}

        {/* IRAE Exemption Toggle - only for SAS */}
        {regime !== 'unipersonal' && (
          <div className="mt-3">
            <label className={`block text-sm font-medium ${labelClass} mb-1.5`}>
              Exoneración IRAE (Software Exportación)
            </label>
            <div className={`flex rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              {(['none', 'partial', 'full'] as IraeExemption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIraeExemption(opt)}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    iraeExemption === opt
                      ? opt === 'none'
                        ? 'bg-red-500 text-white'
                        : opt === 'partial'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt === 'none' ? 'Sin' : opt === 'partial' ? 'Parcial' : 'Total'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show current SAS mode */}
        {regime !== 'unipersonal' && (
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {regime === 'sas-con-caja'
              ? `→ SAS con Caja Profesional (IRAE 25%${iraeExemption !== 'none' ? ` - Exoneración ${iraeExemption === 'partial' ? '50%' : '100%'}` : ''} + Caja ~22.5%)`
              : `→ SAS sin Caja (IRAE 25%${iraeExemption !== 'none' ? ` - Exoneración ${iraeExemption === 'partial' ? '50%' : '100%'}` : ''} + BPS común ~12.5%)`
            }
          </p>
        )}
      </div>

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

        <div>
          <label className={`block text-sm font-medium ${labelClass} mb-1`}>
            Tipo de Cambio (UYU/USD)
            {exchangeRateLoading && <span className="ml-2 text-xs text-gray-500">Cargando...</span>}
            {!exchangeRateLoading && !exchangeRateError && (
              <Tooltip content="Valor obtenido de exchangerate-api.com. Editable manualmente.">
                <span className="inline-flex items-center ml-1">
                  <svg fill="none" stroke="currentColor" className="w-4 h-4 text-green-500" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" strokeWidth={2}/></svg>
                </span>
              </Tooltip>
            )}
            {!exchangeRateLoading && exchangeRateError && (
              <Tooltip content="No se pudo obtener la cotización actual. Usando valor por defecto (39.5).">
                <span className="inline-flex items-center ml-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
              </Tooltip>
            )}
          </label>
          <input
            type="number"
            value={exchangeRateInput}
            onChange={(e) => setExchangeRateInput(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
            placeholder="39.5"
            min="0"
            step="0.5"
          />
          {exchangeRateError && (
            <p className="mt-1 text-xs text-yellow-600">{exchangeRateError}</p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium ${labelClass} mb-2`}>
            Tipo de Cliente
          </label>
          <div className="flex gap-4">
            <label className={`flex items-center ${radioLabelClass}`}>
              <input
                type="radio"
                name="clientType"
                checked={clientType === 'exterior'}
                onChange={() => setClientType('exterior')}
                className="mr-2"
              />
              Exterior (IVA 0%)
            </label>
            <label className={`flex items-center ${radioLabelClass}`}>
              <input
                type="radio"
                name="clientType"
                checked={clientType === 'local'}
                onChange={() => setClientType('local')}
                className="mr-2"
              />
              Local (IVA 22%)
            </label>
          </div>
        </div>

        {/* Family Situation - Collapsible - Only for Unipersonal */}
        {regime === 'unipersonal' && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setFamilyOpen(!familyOpen)}
              className={`flex items-center justify-between w-full text-left font-medium ${labelClass} mb-2`}
            >
              <span>Situación Familiar</span>
              <svg
                className={`w-5 h-5 transition-transform ${familyOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {familyOpen && (
              <div className="space-y-3 ml-2">
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
            )}
          </div>
        )}

        {/* Services - Collapsible Section */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setServicesOpen(!servicesOpen)}
            className={`flex items-center justify-between w-full text-left font-medium ${labelClass} mb-2`}
          >
            <span>Gastos Deducibles</span>
            <svg
              className={`w-5 h-5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

            {servicesOpen && (
              <div className="space-y-2 ml-2">
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
            )}
        </div>

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
    </div>
  );
}
