import { useState, type FormEvent, useCallback, useEffect, useRef } from 'react';
import {
  type TaxRegime,
  type FamilySituation,
  type IraeExemption,
  type ReverseCalculationInput,
  DEFAULT_BPC_2026,
} from '../../utils/taxCalculator';
import { convertCurrency } from '../../utils/convertCurrency';
import ThemeCard from '../ui/ThemeCard';
import CollapsibleSection from '../ui/CollapsibleSection';
import ExchangeRateField from './ExchangeRateField';
import ClientTypeField from './ClientTypeField';
import RegimeSelector from './RegimeSelector';
import { useDarkModeContext } from '../../hooks/DarkModeContext';
import usePersistedState, { clearAllPersisted } from '../../hooks/usePersistedState';

interface ReverseSimProps {
  onCalculate: (input: ReverseCalculationInput) => void;
  isUniversityProfessional: boolean;
  onProfessionalChange: (value: boolean) => void;
  family: FamilySituation;
  onFamilyChange: (family: FamilySituation) => void;
  exchangeRate: number;
  exchangeRateLoading?: boolean;
  exchangeRateError?: string | null;
  onClearPersisted?: () => void;
  currency: 'USD' | 'UYU';
}

export default function ReverseSim({
  onCalculate,
  isUniversityProfessional,
  onProfessionalChange,
  family,
  onFamilyChange,
  exchangeRate,
  exchangeRateLoading,
  exchangeRateError,
  onClearPersisted,
  currency,
}: ReverseSimProps) {
  const { darkMode } = useDarkModeContext();
  const [targetNetUsd, setTargetNetUsd] = usePersistedState<string>('simulator-targetNetUsd', '2000');
  const [regime, setRegime] = usePersistedState<TaxRegime>('simulator-regime', 'unipersonal');
  const [exchangeRateInput, setExchangeRateInput] = usePersistedState<string>(
    'simulator-exchangeRate',
    exchangeRate.toString(),
  );
  const [clientType, setClientType] = usePersistedState<'local' | 'exterior'>('simulator-clientType', 'exterior');
  const [useAccountant, setUseAccountant] = usePersistedState<boolean>('simulator-useAccountant', false);
  const [useEscribana, setUseEscribana] = usePersistedState<boolean>('simulator-useEscribana', false);
  const [useFacturacion, setUseFacturacion] = usePersistedState<boolean>('simulator-useFacturacion', false);
  const [accountantCost, setAccountantCost] = usePersistedState<string>('simulator-accountantCost', '5000');
  const [escribanaCost, setEscribanaCost] = usePersistedState<string>('simulator-escribanaCost', '8000');
  const [facturacionCost, setFacturacionCost] = usePersistedState<string>('simulator-facturacionCost', '3000');
  const [iraeExemption, setIraeExemption] = usePersistedState<IraeExemption>('simulator-iraeExemption', 'none');
  const [bpc, setBpc] = usePersistedState<string>('simulator-bpc', '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [userEditedRate, setUserEditedRate] = useState(false);

  // ── Target input: local draft for free typing, sync on blur/submit ──

  const [targetDraft, setTargetDraft] = useState<string>(() => {
    if (currency === 'UYU') {
      const usd = parseFloat(targetNetUsd) || 0;
      const converted = convertCurrency(usd, exchangeRate, 'toUYU');
      return Number.isNaN(converted) ? targetNetUsd : converted.toString();
    }
    return targetNetUsd;
  });
  const targetFocused = useRef(false);
  const targetDraftRef = useRef(targetDraft);

  // When currency or exchange rate changes while NOT actively editing, recompute draft from persisted USD
  useEffect(() => {
    if (!targetFocused.current) {
      let nextDraft: string;
      if (currency === 'UYU') {
        const usd = parseFloat(targetNetUsd) || 0;
        const converted = convertCurrency(usd, exchangeRate, 'toUYU');
        nextDraft = Number.isNaN(converted) ? targetNetUsd : converted.toString();
      } else {
        nextDraft = targetNetUsd;
      }
      targetDraftRef.current = nextDraft;
      setTargetDraft(nextDraft);
    }
  }, [currency, exchangeRate, targetNetUsd]);

  const handleTargetChange = (raw: string) => {
    const clean = raw.replace(',', '.');
    targetDraftRef.current = clean;
    setTargetDraft(clean);

    // In USD mode: sync immediately (no conversion, safe for free typing)
    // In UYU mode: only update local draft, sync on blur/submit
    if (currency !== 'UYU') {
      setTargetNetUsd(clean);
    }
  };

  const handleTargetFocus = () => {
    targetFocused.current = true;
  };

  const handleTargetBlur = () => {
    targetFocused.current = false;
    if (currency === 'UYU') {
      const num = parseFloat(targetDraftRef.current);
      if (!isNaN(num) && num > 0) {
        const usd = convertCurrency(num, exchangeRate, 'toUSD');
        if (!Number.isNaN(usd)) {
          setTargetNetUsd(usd.toString());
          return;
        }
      }
      setTargetNetUsd(targetDraftRef.current);
    }
  };

  // Show error when in UYU mode but exchange rate is invalid
  const currencyError =
    currency === 'UYU' && (!exchangeRate || exchangeRate <= 0 || isNaN(exchangeRate))
      ? 'No se puede convertir a UYU: tipo de cambio inválido'
      : null;

  // Update exchange rate input when the fetched rate changes (only if user hasn't manually edited)
  useEffect(() => {
    if (!userEditedRate) {
      setExchangeRateInput(exchangeRate.toString());
    }
  }, [exchangeRate, userEditedRate, setExchangeRateInput]);

  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const inputClass = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-primary-400'
    : 'border-gray-300 focus:ring-primary-500';
  const checkboxLabelClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const radioLabelClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  const handleFamilyToggle = useCallback(
    (field: keyof FamilySituation, value: boolean | number) => {
      onFamilyChange({ ...family, [field]: value });
    },
    [family, onFamilyChange],
  );

  const handleRegimeChange = (newRegime: TaxRegime) => {
    setRegime(newRegime);
  };

  const handleProfessionalChange = (value: boolean) => {
    onProfessionalChange(value);
    setRegime(value ? 'sas-con-caja' : 'sas-sin-caja');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const rate = parseFloat(exchangeRateInput);

    // Parse the current draft and sync to persisted USD
    const draftNum = parseFloat(targetDraftRef.current);
    let targetUsdValue: number;

    if (!isNaN(draftNum) && draftNum > 0) {
      if (currency === 'UYU') {
        const usd = convertCurrency(draftNum, exchangeRate, 'toUSD');
        targetUsdValue = !Number.isNaN(usd) ? Math.round(usd) : draftNum;
      } else {
        targetUsdValue = draftNum;
      }
      setTargetNetUsd(targetUsdValue.toString());
    } else {
      targetUsdValue = parseFloat(targetNetUsd) || 0;
    }

    if (isNaN(targetUsdValue) || isNaN(rate) || targetUsdValue <= 0 || rate <= 0) {
      setValidationError('Por favor ingrese valores válidos');
      return;
    }
    setValidationError(null);

    onCalculate({
      targetNetUsd: targetUsdValue,
      exchangeRate: rate,
      clientType,
      regime,
      useAccountant,
      useEscribana,
      useFacturacion,
      accountantCost: useAccountant ? parseFloat(accountantCost) : undefined,
      escribanaCost: useEscribana ? parseFloat(escribanaCost) : undefined,
      facturacionCost: useFacturacion ? parseFloat(facturacionCost) : undefined,
      family,
      iraeExemption: regime !== 'unipersonal' ? iraeExemption : undefined,
      bpc: bpc ? parseFloat(bpc) : undefined,
    });
  };

  return (
    <ThemeCard className="max-w-md mx-auto space-y-4">
      <h2 className={`text-2xl font-bold ${textClass}`}>Simulación Inversa</h2>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Ingrese el ingreso neto que desea obtener y calcularemos el bruto necesario.
      </p>

      <RegimeSelector
        regime={regime}
        onRegimeChange={handleRegimeChange}
        isUniversityProfessional={isUniversityProfessional}
        onProfessionalChange={handleProfessionalChange}
        iraeExemption={iraeExemption}
        onIraeExemptionChange={setIraeExemption}
        labelClass={labelClass}
        inputClass={inputClass}
        darkMode={darkMode}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${labelClass} mb-1`}>Ingreso Neto Deseado ({currency})</label>
          <input
            type="text"
            inputMode="numeric"
            value={targetDraft}
            onChange={(e) => handleTargetChange(e.target.value)}
            onFocus={handleTargetFocus}
            onBlur={handleTargetBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
            placeholder={currency === 'USD' ? '2000' : '80000'}
          />
          {currencyError && <p className="text-red-500 text-xs mt-1">{currencyError}</p>}
        </div>

        <ExchangeRateField
          value={exchangeRateInput}
          onChange={(v) => {
            setExchangeRateInput(v);
            setUserEditedRate(true);
          }}
          loading={exchangeRateLoading}
          error={exchangeRateError}
          labelClass={labelClass}
          inputClass={inputClass}
        />

        <div>
          <label className={`block text-sm font-medium ${labelClass} mb-1`}>
            BPC ($){' '}
            <span className={`text-xs font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              (opcional, default {DEFAULT_BPC_2026})
            </span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={bpc}
             onChange={(e) => setBpc(e.target.value.replace(',', '.'))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
            placeholder={DEFAULT_BPC_2026.toString()}
          
          />
        </div>

        <ClientTypeField
          value={clientType}
          onChange={setClientType}
          labelClass={labelClass}
          radioLabelClass={radioLabelClass}
          name="clientTypeReverse"
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
                      <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Sin discapacidad
                      </label>
                      <input
                        type="text"
            inputMode="numeric"
                        value={family.childrenCount}
                        onChange={(e) =>
                          handleFamilyToggle('childrenCount', Math.max(0, parseInt(e.target.value.replace(',', '.')) || 0))
                        }
                        className={`w-16 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}

                      />
                    </div>
                    <div>
                      <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Con discapacidad
                      </label>
                      <input
                        type="text"
            inputMode="numeric"
                        value={family.disabledChildrenCount}
                        onChange={(e) =>
                          handleFamilyToggle('disabledChildrenCount', Math.max(0, parseInt(e.target.value.replace(',', '.')) || 0))
                        }
                        className={`w-16 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}

                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Graduation Year */}
              <div>
                <label className={`block text-sm ${checkboxLabelClass} mb-1`}>Año de graduación universitaria</label>
                <input
                  type="text"
            inputMode="numeric"
                  value={family.graduationYear || ''}
                  onChange={(e) => handleFamilyToggle('graduationYear', parseInt(e.target.value.replace(',', '.')) || 0)}
                  className={`w-24 px-2 py-1 text-sm border rounded focus:ring-1 ${inputClass}`}
                  placeholder="Ej: 2018"

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
                  type="text"
            inputMode="numeric"
                  value={accountantCost}
                  onChange={(e) => setAccountantCost(e.target.value.replace(',', '.'))}
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
                      type="text"
            inputMode="numeric"
                      value={escribanaCost}
                      onChange={(e) => setEscribanaCost(e.target.value.replace(',', '.'))}
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
                  type="text"
            inputMode="numeric"
                  value={facturacionCost}
                  onChange={(e) => setFacturacionCost(e.target.value.replace(',', '.'))}
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
          className="w-full bg-accent text-primary-800 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Calcular Ingreso Requerido
        </button>
        {onClearPersisted && (
          <button
            type="button"
            onClick={() => {
              clearAllPersisted();
              onClearPersisted();
            }}
            className={`w-full text-sm py-1 rounded-lg transition-colors ${
              darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Limpiar datos guardados
          </button>
        )}
        {validationError && <p className="text-red-500 text-sm mt-1">{validationError}</p>}
      </form>
    </ThemeCard>
  );
}
