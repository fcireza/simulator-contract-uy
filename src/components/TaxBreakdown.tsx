import { useState } from 'react';
import type { IraeExemption } from '../utils/taxCalculator';

const formatUyu = (amount: number) => `$${amount.toLocaleString('es-UY')} UYU`;

interface FamilyDetail {
  hasSpouse: boolean;
  childrenCount: number;
  disabledChildrenCount: number;
  spouseSurcharge?: number;
  childrenSurcharge?: number;
  childDeduction?: number;
  disabledChildDeduction?: number;
}

export interface TaxBreakdownData {
  bpsFonasa?: number;
  fonasaRate?: number;
  bpsRate?: number;
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

export default function TaxBreakdown({ data, grossIncome, netIncome, exchangeRate, darkMode, regime }: TaxBreakdownProps) {
  const [bpsExpanded, setBpsExpanded] = useState(false);
  const [irpfExpanded, setIrpfExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);

  const totalTaxes = (data.bpsFonasa ?? 0) + (data.irpf ?? 0) + (data.cajaProfesional ?? 0) + (data.irae ?? 0) + (data.vat ?? 0) + (data.fondoSolidaridad ?? 0);
  const hasServices = (data.accountantCost ?? 0) > 0 || (data.escribanaCost ?? 0) > 0 || (data.facturacionCost ?? 0) > 0;
  const hasFamilySurcharge = data.familyDetail?.hasSpouse || (data.familyDetail?.childrenCount ?? 0) > 0 || (data.familyDetail?.disabledChildrenCount ?? 0) > 0;
  const hasFamilyDeduction = (data.familyDetail?.childDeduction ?? 0) > 0 || (data.familyDetail?.disabledChildDeduction ?? 0) > 0;
  const isSas = regime !== 'unipersonal';

  return (
    <>
      {/* Tax Breakdown */}
      <div className="space-y-3">
        <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Desglose de Impuestos</h4>

        <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Ingreso Bruto (UYU)</span>
          <span className="font-medium">{formatUyu(grossIncome)}</span>
        </div>

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
                  <span className={`ml-1 text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    ({((data.bpsRate || 0.15) * 100).toFixed(0)}% + {((data.fonasaRate) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
              <span className="font-medium text-red-400">-{formatUyu(data.bpsFonasa ?? 0)}</span>
            </button>
            {bpsExpanded && hasFamilySurcharge && (
              <div className="ml-5 py-2 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                {data.familyDetail?.hasSpouse && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Cónyuge</span>
                    <span className="text-red-400">+{formatUyu(data.familyDetail.spouseSurcharge ?? 0)}</span>
                  </div>
                )}
                {(data.familyDetail?.childrenCount ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Hijos ({data.familyDetail?.childrenCount})</span>
                    <span className="text-red-400">+{formatUyu(data.familyDetail?.childrenSurcharge ?? 0)}</span>
                  </div>
                )}
                {(data.familyDetail?.disabledChildrenCount ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Hijos con discapacidad ({data.familyDetail?.disabledChildrenCount})</span>
                    <span className="text-red-400">+{formatUyu(data.familyDetail?.disabledChildDeduction ?? 0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Caja Profesional (SAS) */}
        {(data.cajaProfesional ?? 0) > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Caja Profesional</span>
            <span className="font-medium text-red-400">-{formatUyu(data.cajaProfesional ?? 0)}</span>
          </div>
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
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ChevronIcon expanded={irpfExpanded} />
                </span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IRPF</span>
                {data.appliedIrpfBracket && (
                  <span className={`ml-1 text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {data.appliedIrpfBracket.label}
                  </span>
                )}
              </div>
              <span className="font-medium text-red-400">-{formatUyu(data.irpf ?? 0)}</span>
            </button>
            {irpfExpanded && hasFamilyDeduction && (
              <div className="ml-5 py-2 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                {(data.familyDetail?.childDeduction ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Deducción hijos IRPF</span>
                    <span className="text-green-400">-{formatUyu(data.familyDetail?.childDeduction ?? 0)}</span>
                  </div>
                )}
                {(data.familyDetail?.disabledChildDeduction ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Deducción hijos disc. IRPF</span>
                    <span className="text-green-400">-{formatUyu(data.familyDetail?.disabledChildDeduction ?? 0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* IRAE (SAS) */}
        {((data.irae ?? 0) > 0 || data.iraeExemptionApplied) && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IRAE (25% utilidades)</span>
              {data.iraeExemptionApplied && (
                <span className={`ml-1 text-xs font-medium ${
                  data.iraeExemptionApplied === 'partial' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  (Ex. {data.iraeExemptionApplied === 'partial' ? '50%' : 'Total'})
                </span>
              )}
            </div>
            <span className={`font-medium ${(data.irae ?? 0) === 0 ? 'text-green-500' : 'text-red-400'}`}>
              {(data.iraeExemptionApplied === 'full' || (data.irae ?? 0) === 0) ? formatUyu(0) : `-${formatUyu(data.irae ?? 0)}`}
            </span>
          </div>
        )}

        {/* IVA (only for local clients) */}
        {(data.vat ?? 0) > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IVA (22% local)</span>
            <span className="font-medium text-red-400">-{formatUyu(data.vat ?? 0)}</span>
          </div>
        )}

        {/* Fondo de Solidaridad */}
        {(data.fondoSolidaridad ?? 0) > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Fondo de Solidaridad</span>
            <span className="font-medium text-red-400">-{formatUyu(data.fondoSolidaridad ?? 0)}</span>
          </div>
        )}

        {/* Services - collapsible */}
        {hasServices && (
          <div>
            <button
              type="button"
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ChevronIcon expanded={servicesExpanded} />
                </span>
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Gastos Deducibles</span>
              </div>
              <span className="font-medium text-red-400">
                -{formatUyu(
                  (data.accountantCost ?? 0) +
                  (data.escribanaCost ?? 0) +
                  (data.facturacionCost ?? 0)
                )}
              </span>
            </button>
            {servicesExpanded && (
              <div className="ml-5 py-2 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                {(data.accountantCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Contador</span>
                    <span className="text-red-400">-{formatUyu(data.accountantCost ?? 0)}</span>
                  </div>
                )}
                {/* Escribana: solo SAS la tiene como deducible */}
                {isSas && (data.escribanaCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Escribana</span>
                    <span className="text-red-400">-{formatUyu(data.escribanaCost ?? 0)}</span>
                  </div>
                )}
                {(data.facturacionCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Facturación</span>
                    <span className="text-red-400">-{formatUyu(data.facturacionCost ?? 0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className={`flex justify-between items-center py-2 border-b font-semibold ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}>
          <span>Tipo de Cambio Aplicado</span>
          <span>${exchangeRate.toFixed(2)} UYU/USD</span>
        </div>
      </div>
    </>
  );
}
