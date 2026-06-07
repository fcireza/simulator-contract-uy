import { useState } from 'react';
import type { IraeExemption } from '../utils/taxCalculator';
import { DEFAULT_BPC_2026 } from '../utils/taxCalculator';
import { formatUyu } from '../utils/format';
import TaxLineItem from './TaxLineItem';
import FamilySurchargeDetail from './FamilySurchargeDetail';
import IrpfDeductionDetail from './IrpfDeductionDetail';
import ServicesBreakdown from './ServicesBreakdown';

export interface FamilyDetail {
  hasSpouse: boolean;
  childrenCount: number;
  disabledChildrenCount: number;
  spouseSurcharge?: number;
  childrenSurcharge?: number;
  childDeduction?: number;
  disabledChildDeduction?: number;
  disabledChildrenSurcharge?: number;
}

export interface TaxBreakdownData {
  bpsFonasa?: number;
  fonasaRate?: number;
  bpsRate?: number;
  bpsAmount?: number;
  fonasaAmount?: number;
  irpf?: number;
  appliedIrpfBracket?: { rate: number; limitBpc: number; label: string };
  cajaProfesional?: number;
  irae?: number;
  iraeExemptionApplied?: IraeExemption;
  vat?: number;
  fondoSolidaridad?: number;
  familyDetail?: FamilyDetail;
  accountantCost?: number;
  escribanaCost?: number;
  facturacionCost?: number;
  effectiveTaxRate?: number;
}

interface TaxBreakdownProps {
  data: TaxBreakdownData;
  grossIncome: number;
  netIncome: number;
  exchangeRate: number;
  darkMode: boolean;
  regime: 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja';
  bpc?: number;
  currency?: 'USD' | 'UYU';
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function TaxBreakdown({
  data,
  grossIncome,
  exchangeRate,
  darkMode,
  regime,
  bpc,
  currency = 'USD',
}: TaxBreakdownProps) {
  const [bpsExpanded, setBpsExpanded] = useState(false);
  const [irpfExpanded, setIrpfExpanded] = useState(false);

  const hasFamilySurcharge =
    data.familyDetail?.hasSpouse ||
    (data.familyDetail?.childrenCount ?? 0) > 0 ||
    (data.familyDetail?.disabledChildrenCount ?? 0) > 0;

  return (
    <>
      {/* Tax Breakdown */}
      <div className="space-y-3">
        <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Desglose de Impuestos ({currency})
        </h4>

        {/* Gross income */}
        <TaxLineItem label="Ingreso Bruto (UYU)" value={grossIncome} darkMode={darkMode} />

        {/* BPS + FONASA - collapsible with family surcharge */}
        {(data.bpsFonasa ?? 0) > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setBpsExpanded(!bpsExpanded)}
              className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ChevronIcon expanded={bpsExpanded} />
                </span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>BPS + FONASA</span>
                {data.fonasaRate !== undefined && (
                  <span className={`ml-1 text-xs ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                    ({((data.bpsRate || 0.15) * 100).toFixed(0)}% + {(data.fonasaRate * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
              <span className="font-medium text-red-400">-{formatUyu(data.bpsFonasa ?? 0)}</span>
            </button>
            {bpsExpanded && (
              <div className="ml-5 py-2 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                {/* BPS amount */}
                {(data.bpsAmount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      BPS ({(data.bpsRate || 0.15) * 100}%)
                    </span>
                    <span className="text-red-400">-{formatUyu(data.bpsAmount ?? 0)}</span>
                  </div>
                )}
                {/* FONASA amount */}
                {(data.fonasaAmount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      FONASA ({((data.fonasaRate ?? 0) * 100).toFixed(1)}%)
                    </span>
                    <span className="text-red-400">-{formatUyu(data.fonasaAmount ?? 0)}</span>
                  </div>
                )}
                {/* Family surcharge details */}
                {hasFamilySurcharge && <FamilySurchargeDetail familyDetail={data.familyDetail!} darkMode={darkMode} />}
              </div>
            )}
          </div>
        )}

        {/* Caja Profesional (SAS) */}
        {(data.cajaProfesional ?? 0) > 0 && (
          <TaxLineItem label="Caja Profesional" value={data.cajaProfesional ?? 0} darkMode={darkMode} color="red" />
        )}

        {/* IRPF - collapsible with deductions */}
        {(data.irpf ?? 0) > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setIrpfExpanded(!irpfExpanded)}
              className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ChevronIcon expanded={irpfExpanded} />
                </span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IRPF</span>
              </div>
              <span className="font-medium text-red-400">-{formatUyu(data.irpf ?? 0)}</span>
            </button>
            {irpfExpanded && <IrpfDeductionDetail data={data} darkMode={darkMode} />}
          </div>
        )}

        {/* IRAE (SAS) */}
        {((data.irae ?? 0) > 0 || data.iraeExemptionApplied) && (
          <div
            className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IRAE (25% utilidades)</span>
              {data.iraeExemptionApplied && (
                <span
                  className={`ml-1 text-xs font-medium ${
                    data.iraeExemptionApplied === 'partial' ? 'text-yellow-500' : 'text-green-500'
                  }`}
                >
                  (Ex. {data.iraeExemptionApplied === 'partial' ? '50%' : 'Total'})
                </span>
              )}
            </div>
            <span className={`font-medium ${(data.irae ?? 0) === 0 ? 'text-green-500' : 'text-red-400'}`}>
              {data.iraeExemptionApplied === 'full' || (data.irae ?? 0) === 0
                ? formatUyu(0)
                : `-${formatUyu(data.irae ?? 0)}`}
            </span>
          </div>
        )}

        {/* IVA (only for local clients) */}
        {(data.vat ?? 0) > 0 && (
          <TaxLineItem label="IVA (22% local)" value={data.vat ?? 0} darkMode={darkMode} color="red" />
        )}

        {/* Fondo de Solidaridad */}
        {(data.fondoSolidaridad ?? 0) > 0 && (
          <TaxLineItem
            label="Fondo de Solidaridad"
            value={data.fondoSolidaridad ?? 0}
            darkMode={darkMode}
            color="red"
          />
        )}

        {/* Services - collapsible */}
        <ServicesBreakdown
          accountantCost={data.accountantCost}
          escribanaCost={data.escribanaCost}
          facturacionCost={data.facturacionCost}
          showEscribana={regime !== 'unipersonal'}
          darkMode={darkMode}
        />

        {/* Exchange rate */}
        <div
          className={`flex justify-between items-center py-2 border-b font-semibold ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}
        >
          <span>Tipo de Cambio Aplicado</span>
          <span>${exchangeRate.toFixed(2)} UYU/USD</span>
        </div>

        {/* BPC value */}
        <div
          className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>BPC (Base de Prestaciones)</span>
          <span className={darkMode ? 'text-white' : 'text-gray-800'}>
            ${(bpc ?? DEFAULT_BPC_2026).toLocaleString()} UYU
          </span>
        </div>
      </div>
    </>
  );
}
