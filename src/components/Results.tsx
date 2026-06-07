import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import TaxBreakdown, { type TaxBreakdownData } from './TaxBreakdown';
import ThemeCard from './ThemeCard';
import { useDeviceDetect } from '../utils/useDeviceDetect';
import { formatUyu, formatUsd } from '../utils/format';
import { useDarkModeContext } from '../hooks/DarkModeContext';
import { DEFAULT_BPC_2026 } from '../utils/taxCalculator';

interface InlineTooltipProps {
  term: string;
  explanation: string;
  children: ReactNode;
  onMobileTooltip?: (text: string) => void;
}

function InlineTooltip({ term, explanation, children, onMobileTooltip }: InlineTooltipProps) {
  const isMobile = useDeviceDetect();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onMobileTooltip?.(term + ': ' + explanation);
    },
    [term, explanation, onMobileTooltip],
  );

  const inlineTitle = !isMobile ? term + ': ' + explanation : undefined;
  const inlineClass =
    'relative inline-block cursor-help border-b border-dotted' +
    (isMobile ? '' : ' hover:text-blue-400 dark:hover:text-blue-300');

  return (
    <span className={inlineClass} onClick={isMobile ? handleClick : undefined} title={inlineTitle}>
      {children}
    </span>
  );
}

const REGIME_LABELS: Record<string, string> = {
  unipersonal: 'Unipersonal',
  'sas-con-caja': 'SAS con Caja Profesional',
  'sas-sin-caja': 'SAS sin Caja (BPS)',
};

const REGIME_DESCRIPTIONS: Record<string, string> = {
  unipersonal: 'IRPF + BPS/FONASA — base imponible 70% del bruto',
  'sas-con-caja': 'IRAE 25% + Caja Profesional ~22.5% — sobre utilidades presuntas',
  'sas-sin-caja': 'IRAE 25% + BPS 7.5% + FONASA variable — sobre utilidades presuntas',
};

// --- Unified props for both simulation modes ---
interface ResultsProps {
  // Core financial data
  grossIncomeUyu: number;
  netIncomeUyu: number;
  netIncomeUsd: number;

  // Tax breakdown data
  taxData: TaxBreakdownData;

  // Context
  exchangeRate: number;
  regime: 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja';

  // Mode
  mode?: 'normal' | 'reverse';

  // Callbacks (optional - only shown when provided)
  onCompare?: () => void;

  // BPC value used in calculation
  bpc?: number;

  // Active currency for display emphasis
  currency?: 'USD' | 'UYU';
}

export default function Results({
  grossIncomeUyu,
  netIncomeUyu,
  netIncomeUsd,
  taxData,
  exchangeRate,
  regime,
  mode = 'normal',
  onCompare,
  bpc,
  currency = 'USD',
}: ResultsProps) {
  const { darkMode } = useDarkModeContext();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [mobileTooltip, setMobileTooltip] = useState<string | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  // Focus trap: auto-focus close button when modal opens
  useEffect(() => {
    if (infoModalOpen && modalCloseRef.current) {
      modalCloseRef.current.focus();
    }
  }, [infoModalOpen]);

  // --- Computed values ---
  const grossUsd = grossIncomeUyu / exchangeRate;
  const netPercent = grossIncomeUyu > 0 ? (netIncomeUyu / grossIncomeUyu) * 100 : 0;

  const totalTaxes =
    (taxData.bpsFonasa ?? 0) +
    (taxData.irpf ?? 0) +
    (taxData.cajaProfesional ?? 0) +
    (taxData.irae ?? 0) +
    (taxData.fondoSolidaridad ?? 0);

  const totalServices = (taxData.accountantCost ?? 0) + (taxData.escribanaCost ?? 0) + (taxData.facturacionCost ?? 0);

  const taxPercent = grossIncomeUyu > 0 ? (totalTaxes / grossIncomeUyu) * 100 : 0;
  const servicesPercent = grossIncomeUyu > 0 ? (totalServices / grossIncomeUyu) * 100 : 0;

  // --- Labels by mode ---
  const isReverse = mode === 'reverse';
  const highlightLabel = isReverse ? 'Ingreso Bruto Necesario' : 'Ingreso Neto Estimado';
  const highlightAmount = isReverse ? grossIncomeUyu : netIncomeUyu;
  const highlightAmountUsd = isReverse ? grossUsd : netIncomeUsd;
  const contextTitle = isReverse ? 'Simulación Inversa' : 'Simulación';
  const contextValue = isReverse ? formatUsd(grossUsd) + ' brutos requeridos' : formatUsd(grossUsd) + ' brutos';
  const takeHomeLabel = isReverse ? 'del bruto se va en impuestos y gastos' : 'del bruto queda en tu bolsillo';
  const takeHomeValue = isReverse ? (100 - netPercent).toFixed(1) : netPercent.toFixed(1);

  // --- Theme classes ---
  const infoBtnClass = darkMode
    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
    : 'bg-gray-50 text-gray-500 hover:bg-gray-100';
  const navBtnClass = darkMode
    ? 'bg-blue-600 hover:bg-blue-500 text-white'
    : 'bg-blue-500 hover:bg-blue-600 text-white';
  const closeBtnClass = darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800';
  const modalContentBg = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';

  return (
    <ThemeCard className="max-w-lg mx-auto space-y-5">
      {/* ── 1. CONTEXT HEADER ── */}
      <div className={'pb-3 border-b ' + (darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <p className={'text-xs uppercase tracking-wider ' + (darkMode ? 'text-gray-500' : 'text-gray-400')}>
          {contextTitle}
        </p>
        <p className={'text-lg font-bold ' + (darkMode ? 'text-white' : 'text-gray-900')}>{contextValue}</p>
        <p className={'text-sm ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}>
          {REGIME_LABELS[regime]}
          <span className="block text-xs opacity-70">{REGIME_DESCRIPTIONS[regime]}</span>
        </p>
      </div>

      {/* ── 2. HIGHLIGHT CARD ── */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white space-y-1">
        <p className="text-sm opacity-80 font-medium">{highlightLabel}</p>
        {currency === 'USD' ? (
          <>
            <p className="text-4xl font-extrabold tracking-tight">{formatUsd(highlightAmountUsd)}</p>
            <p className="text-lg font-medium opacity-90">{formatUyu(highlightAmount)}</p>
          </>
        ) : (
          <>
            <p className="text-4xl font-extrabold tracking-tight">{formatUyu(highlightAmount)}</p>
            <p className="text-lg font-medium opacity-90">{formatUsd(highlightAmountUsd)}</p>
          </>
        )}
        {!isReverse && (
          <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-white/20">
            <span className="text-2xl font-bold">{takeHomeValue}%</span>
            <span className="text-sm opacity-80">{takeHomeLabel}</span>
          </div>
        )}
        <p className="text-xs opacity-70 mt-1">*Después de impuestos y gastos deducibles</p>
      </div>

      {/* ── 3. VISUAL BREAKDOWN BAR (3 segments) ── */}
      {grossIncomeUyu > 0 && (
        <div className="space-y-2">
          <p
            className={
              'text-xs font-semibold uppercase tracking-wider ' + (darkMode ? 'text-gray-400' : 'text-gray-500')
            }
          >
            A dónde va tu dinero
          </p>
          <div className="flex h-5 rounded-full overflow-hidden">
            <div
              className="bg-green-500 transition-all duration-700"
              style={{ width: netPercent + '%' }}
              title={'Neto: ' + netPercent.toFixed(1) + '%'}
            />
            {taxPercent > 0 && (
              <div
                className="bg-red-400 transition-all duration-700"
                style={{ width: taxPercent + '%' }}
                title={'Impuestos: ' + taxPercent.toFixed(1) + '%'}
              />
            )}
            {servicesPercent > 0 && (
              <div
                className="bg-amber-400 transition-all duration-700"
                style={{ width: servicesPercent + '%' }}
                title={'Servicios: ' + servicesPercent.toFixed(1) + '%'}
              />
            )}
          </div>
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
                Neto <strong>{netPercent.toFixed(1)}%</strong>
              </span>
            </div>
            {taxPercent > 0 && (
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                <span className={darkMode ? 'text-red-400' : 'text-red-500'}>
                  Impuestos <strong>{taxPercent.toFixed(1)}%</strong>
                </span>
              </div>
            )}
            {servicesPercent > 0 && (
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                <span className={darkMode ? 'text-amber-400' : 'text-amber-600'}>
                  Gastos <strong>{servicesPercent.toFixed(1)}%</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 4. EFFECTIVE TAX RATE ── */}
      {taxData.effectiveTaxRate !== undefined && (
        <div
          className={
            'flex justify-between items-center py-3 px-4 rounded-lg ' + (darkMode ? 'bg-purple-900/30' : 'bg-purple-50')
          }
        >
          <div>
            <p className={'text-sm font-semibold ' + (darkMode ? 'text-purple-200' : 'text-purple-800')}>
              Tasa Efectiva Total
            </p>
            <p className={'text-xs ' + (darkMode ? 'text-purple-300/70' : 'text-purple-600/70')}>
              Carga impositiva real sobre el bruto
            </p>
          </div>
          <span className={'text-2xl font-bold ' + (darkMode ? 'text-purple-300' : 'text-purple-700')}>
            {taxData.effectiveTaxRate}%
          </span>
        </div>
      )}

      {/* ── 5. COMPARISON BUTTON (only normal mode) ── */}
      {onCompare && (
        <button
          type="button"
          onClick={onCompare}
          className={
            'w-full flex items-center justify-between p-3 rounded-lg border transition-colors ' +
            (darkMode
              ? 'border-blue-800 bg-blue-900/20 text-blue-300 hover:bg-blue-900/40'
              : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100')
          }
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-sm font-medium">Comparar regímenes impositivos</span>
          </div>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* ── 6. TAX BREAKDOWN (collapsible) ── */}
      <div className={'border-t pt-3 ' + (darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className={
            'w-full flex items-center justify-between text-sm font-medium ' +
            (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
          }
        >
          <span>Ver desglose detallado</span>
          <svg
            className={'w-4 h-4 transition-transform duration-200 ' + (showBreakdown ? 'rotate-180' : '')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showBreakdown && (
          <div className="mt-3">
            <TaxBreakdown
              data={taxData}
              grossIncome={grossIncomeUyu}
              netIncome={netIncomeUyu}
              exchangeRate={exchangeRate}
              darkMode={darkMode}
              regime={regime}
              bpc={bpc}
              currency={currency}
            />
          </div>
        )}
      </div>

      {/* ── 7. GUIDE BUTTON ── */}
      <button
        type="button"
        onClick={() => setInfoModalOpen(true)}
        className={'text-xs p-3 rounded w-full text-center font-medium transition-colors ' + infoBtnClass}
      >
        Ver guía completa de impuestos →
      </button>

      {/* ── INFO MODAL ── */}
      {infoModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setInfoModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setInfoModalOpen(false)}
        >
          <div
            className={'max-w-lg max-h-[80vh] overflow-y-auto rounded-xl p-6 ' + modalContentBg}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Guía de Impuestos 2026"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Guía de Impuestos 2026</h3>
              <button
                type="button"
                ref={modalCloseRef}
                onClick={() => setInfoModalOpen(false)}
                className={'text-2xl ' + closeBtnClass}
                aria-label="Cerrar guía"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <h4 className="font-semibold">
                  <InlineTooltip
                    term="BPC"
                    explanation="Base de Prestaciones y Cotizaciones"
                    onMobileTooltip={setMobileTooltip}
                  >
                    BPC (Base de Prestaciones y Cotizaciones) 2026
                  </InlineTooltip>
                </h4>
                <p>
                  Base de Prestaciones y Cotizaciones: <strong>${DEFAULT_BPC_2026.toLocaleString()} UYU</strong>
                </p>
                <p>
                  Tope BPS (15 BPC): <strong>${(15 * DEFAULT_BPC_2026).toLocaleString()} UYU</strong>
                </p>
              </div>

              <div>
                <h4 className="font-semibold">
                  <InlineTooltip term="BPS" explanation="Banco de Previsión Social" onMobileTooltip={setMobileTooltip}>
                    BPS (Banco de Previsión Social) +{' '}
                    <InlineTooltip
                      term="FONASA"
                      explanation="Fondo Nacional de Salud"
                      onMobileTooltip={setMobileTooltip}
                    >
                      FONASA (Fondo Nacional de Salud)
                    </InlineTooltip>{' '}
                    (Unipersonal)
                  </InlineTooltip>
                </h4>
                <p>15% jubilación + tasa FONASA según ingresos y familia:</p>
                <ul className="ml-4 list-disc">
                  <li>Ingresos ≤ 2.5 BPC: FONASA 8%</li>
                  <li>Ingresos &gt; 2.5 BPC: FONASA 9.5%</li>
                  <li>Cónyuge: +2%</li>
                  <li>Por hijo: +1.5%</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">
                  <InlineTooltip
                    term="IRPF"
                    explanation="Impuesto a las Rentas de las Personas Físicas"
                    onMobileTooltip={setMobileTooltip}
                  >
                    IRPF (Impuesto a las Rentas de las Personas Físicas)
                  </InlineTooltip>
                </h4>
                <ul className="ml-4 list-disc">
                  <li>0-7 BPC: 0%</li>
                  <li>7-10 BPC: 10%</li>
                  <li>10-15 BPC: 15%</li>
                  <li>15-30 BPC: 24%</li>
                  <li>30-50 BPC: 25%</li>
                  <li>50-75 BPC: 27%</li>
                  <li>75-115 BPC: 31%</li>
                  <li>115+ BPC: 36%</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">Deducciones IRPF</h4>
                <ul className="ml-4 list-disc">
                  <li>Por hijo: $11,440 UYU/año</li>
                  <li>Hijo con discapacidad: $22,880 UYU/año</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">
                  <InlineTooltip
                    term="Fondo de Solidaridad"
                    explanation="Aporte para egresados de instituciones públicas"
                    onMobileTooltip={setMobileTooltip}
                  >
                    Fondo de Solidaridad
                  </InlineTooltip>
                </h4>
                <p>Aplica si:</p>
                <ul className="ml-4 list-disc">
                  <li>Graduado hace 5+ años</li>
                  <li>Ingreso &gt; 8 BPC</li>
                </ul>
                <p>Monto: 0.5-2 BPC según ingreso</p>
              </div>

              <div className="pt-2 text-xs text-gray-500">
                *Valores aproximados. Consultá un contador para precisión.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setInfoModalOpen(false);
                window.dispatchEvent(new CustomEvent('navigate-to', { detail: { tab: 'guide' } }));
              }}
              className={'w-full mt-4 py-3 px-4 rounded-lg font-medium ' + navBtnClass}
            >
              Ver guía completa de impuestos →
            </button>
          </div>
        </div>
      )}

      {/* Mobile tooltip popup for accessibility */}
      {mobileTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setMobileTooltip(null)}>
          <div
            className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 max-w-xs shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {mobileTooltip}
            <button
              className="block mt-2 text-xs text-gray-400 hover:text-white"
              onClick={() => setMobileTooltip(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </ThemeCard>
  );
}
