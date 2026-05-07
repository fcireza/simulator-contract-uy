const formatUyu = (amount: number) => `$${amount.toLocaleString('es-UY')} UYU`;
const formatUsd = (amount: number) => `US$ ${amount.toLocaleString('en-US')}`;

import { useState } from 'react';

interface ResultsProps {
  result: {
    incomeUyu: number;
    bpsFonasa: number;
    cajaProfesional: number;
    irpf: number;
    irae: number;
    vat: number;
    deductibleExpenses: number;
    netUyu: number;
    netUsd: number;
    accountantCost?: number;
    escribanaCost?: number;
    facturacionCost?: number;
    fondoSolidaridad?: number;
    appliedIrpfBracket?: { rate: number; limitBpc: number; label: string };
    fonasaRate?: number;
    bpsRate?: number;
    familyDetail?: {
      hasSpouse: boolean;
      childrenCount: number;
      disabledChildrenCount: number;
      spouseSurcharge?: number;
      childrenSurcharge?: number;
      childDeduction?: number;
      disabledChildDeduction?: number;
    };
  };
  exchangeRate: number;
  darkMode: boolean;
  regime: 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja';
  onNavigate?: (tab: 'guide') => void;
}

export default function Results({ result, exchangeRate, darkMode, regime }: ResultsProps) {
  const [bpsExpanded, setBpsExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [irpfExpanded, setIrpfExpanded] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const hasFamilySurcharge = result.familyDetail?.hasSpouse || (result.familyDetail?.childrenCount ?? 0) > 0 || (result.familyDetail?.disabledChildrenCount ?? 0) > 0;
  const hasFamilyDeduction = (result.familyDetail?.childDeduction ?? 0) > 0 || (result.familyDetail?.disabledChildDeduction ?? 0) > 0;
  const hasServices = (result.accountantCost ?? 0) > 0 || (result.escribanaCost ?? 0) > 0 || (result.facturacionCost ?? 0) > 0;

  const BPC = 6864;

  return (
    <div className={`max-w-lg mx-auto rounded-xl shadow-lg p-6 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-xl font-bold border-b pb-2 ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
        Resultados de la Simulación
      </h3>

      {/* Net Income Highlight */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white">
        <p className="text-sm opacity-90">Ingreso Neto Estimado</p>
        <p className="text-3xl font-bold">{formatUsd(result.netUsd)}</p>
        <p className="text-lg">{formatUyu(result.netUyu)}</p>
      </div>

      {/* Tax Breakdown */}
      <div className="space-y-3">
        <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Desglose de Impuestos</h4>

        <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Ingreso Bruto (UYU)</span>
          <span className="font-medium">{formatUyu(result.incomeUyu)}</span>
        </div>

        {/* Unipersonal taxes - collapsible with family detail */}
        {result.bpsFonasa > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setBpsExpanded(!bpsExpanded)}
              className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700 border-gray-600' : 'border-gray-200'}`}
            >
              <div className="flex items-center">
                <span className={`mr-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {bpsExpanded ? '▼' : '▶'}
                </span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>BPS + FONASA</span>
                {result.fonasaRate !== undefined && (
                  <span className={`ml-2 text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    ({((result.bpsRate || 0.15) * 100).toFixed(0)}% + {((result.fonasaRate) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
              <span className="font-medium text-red-400">-{formatUyu(result.bpsFonasa)}</span>
            </button>
            {bpsExpanded && hasFamilySurcharge && (
              <div className="ml-4 py-2 space-y-1">
                {result.familyDetail?.hasSpouse && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Cónyuge</span>
                    <span className="text-red-400">+{formatUyu(result.familyDetail.spouseSurcharge || 0)}</span>
                  </div>
                )}
                {(result.familyDetail?.childrenCount ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Hijos ({result.familyDetail?.childrenCount})</span>
                    <span className="text-red-400">+{formatUyu(result.familyDetail?.childrenSurcharge || 0)}</span>
                  </div>
                )}
                {(result.familyDetail?.disabledChildrenCount ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Hijos con discapacidad ({result.familyDetail?.disabledChildrenCount})</span>
                    <span className="text-red-400">+{formatUyu(result.familyDetail?.disabledChildDeduction || 0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {result.irpf > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setIrpfExpanded(!irpfExpanded)}
              className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700 border-gray-600' : 'border-gray-200'}`}
            >
              <div className="flex items-center">
                <span className={`mr-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {irpfExpanded ? '▼' : '▶'}
                </span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IRPF (progresivo 8 tramos)</span>
                {result.appliedIrpfBracket && (
                  <span className={`ml-2 text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {result.appliedIrpfBracket.label}
                  </span>
                )}
              </div>
              <span className="font-medium text-red-400">-{formatUyu(result.irpf)}</span>
            </button>
            {irpfExpanded && hasFamilyDeduction && (
              <div className="ml-4 py-2 space-y-1">
                {(result.familyDetail?.childDeduction ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Deducción hijos IRPF</span>
                    <span className="text-green-400">-{formatUyu(result.familyDetail?.childDeduction || 0)}</span>
                  </div>
                )}
                {(result.familyDetail?.disabledChildDeduction ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Deducción hijos disc. IRPF</span>
                    <span className="text-green-400">-{formatUyu(result.familyDetail?.disabledChildDeduction || 0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SAS taxes */}
        {result.cajaProfesional > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Caja Profesional</span>
            <span className="font-medium text-red-400">-{formatUyu(result.cajaProfesional)}</span>
          </div>
        )}

        {result.irae > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IRAE (25% utilidades)</span>
            <span className="font-medium text-red-400">-{formatUyu(result.irae)}</span>
          </div>
        )}

        {result.vat > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IVA (22% local)</span>
            <span className="font-medium text-red-400">-{formatUyu(result.vat)}</span>
          </div>
        )}

        {/* Fondo de Solidaridad */}
        {(result.fondoSolidaridad ?? 0) > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Fondo de Solidaridad</span>
            <span className="font-medium text-red-400">-{formatUyu(result.fondoSolidaridad ?? 0)}</span>
          </div>
        )}

        {/* Deductible Expenses */}
        {regime !== 'unipersonal' && result.deductibleExpenses > 0 && (
          <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Gastos Deducibles</span>
            <span className="font-medium text-red-400">-{formatUyu(result.deductibleExpenses)}</span>
          </div>
        )}

        {/* Services for Unipersonal - collapsible */}
        {regime === 'unipersonal' && hasServices && (
          <div>
            <button
              type="button"
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700 border-gray-600' : 'border-gray-200'}`}
            >
              <div className="flex items-center">
                <span className={`mr-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {servicesExpanded ? '▼' : '▶'}
                </span>
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Gastos Deducibles / Servicios</span>
              </div>
              <span className="font-medium text-red-400">
                -{formatUyu(
                  (result.accountantCost || 0) +
                  (result.facturacionCost || 0)
                )}
              </span>
            </button>
            {servicesExpanded && (
              <div className="ml-4 py-2 space-y-1">
                {(result.accountantCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Contador</span>
                    <span className="text-red-400">-{formatUyu(result.accountantCost || 0)}</span>
                  </div>
                )}
                {(result.facturacionCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Facturación</span>
                    <span className="text-red-400">-{formatUyu(result.facturacionCost || 0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Services for SAS - individual breakdown */}
        {regime !== 'unipersonal' && hasServices && (
          <div>
            <button
              type="button"
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className={`w-full flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700 border-gray-600' : 'border-gray-200'}`}
            >
              <div className="flex items-center">
                <span className={`mr-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {servicesExpanded ? '▼' : '▶'}
                </span>
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Gastos Deducibles / Servicios</span>
              </div>
              <span className="font-medium text-red-400">
                -{formatUyu(
                  (result.accountantCost || 0) +
                  (result.escribanaCost || 0) +
                  (result.facturacionCost || 0)
                )}
              </span>
            </button>
            {servicesExpanded && (
              <div className="ml-4 py-2 space-y-1">
                {(result.accountantCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Contador</span>
                    <span className="text-red-400">-{formatUyu(result.accountantCost || 0)}</span>
                  </div>
                )}
                {(result.escribanaCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Escribana</span>
                    <span className="text-red-400">-{formatUyu(result.escribanaCost || 0)}</span>
                  </div>
                )}
                {(result.facturacionCost ?? 0) > 0 && (
                  <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>• Facturación</span>
                    <span className="text-red-400">-{formatUyu(result.facturacionCost || 0)}</span>
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

      {/* Info Button */}
      <button
        type="button"
        onClick={() => setInfoModalOpen(true)}
        className={`text-xs mt-4 p-3 rounded w-full text-center font-medium ${
          darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
        } transition-colors`}>
        Ver guía completa de impuestos →
      </button>

      {/* Info Modal */}
      {infoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setInfoModalOpen(false)}>
          <div
            className={`max-w-lg max-h-[80vh] overflow-y-auto rounded-xl p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            onClick={(e) => e.stopPropagation()}
          >
<div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Guía de Impuestos 2026</h3>
              <button
                type="button"
                onClick={() => setInfoModalOpen(false)}
                className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <h4 className="font-semibold">BPC 2026</h4>
                <p>Base de Prestaciones y Cotizaciones: <strong>${BPC.toLocaleString('es-UY')} UYU</strong></p>
                <p>Tope BPS (15 BPC): <strong>${(15 * BPC).toLocaleString('es-UY')} UYU</strong></p>
              </div>

              <div>
                <h4 className="font-semibold">BPS + FONASA (Unipersonal)</h4>
                <p>15% jubilación + tasa FONASA según ingresos y familia:</p>
                <ul className="ml-4 list-disc">
                  <li>Ingresos ≤ 2.5 BPC: FONASA 8%</li>
                  <li>Ingresos &gt; 2.5 BPC: FONASA 9.5%</li>
                  <li>Cónyuge: +2%</li>
                  <li>Por hijo: +1.5%</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">IRPF (8 tramos progresivos)</h4>
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
                <h4 className="font-semibold">Fondo de Solidaridad</h4>
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

            {/* Fixed button outside scrollable area */}
            <button
              type="button"
              onClick={() => {
                setInfoModalOpen(false);
                window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'guide' }));
              }}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-medium ${
                darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
            >
              Ver guía completa de impuestos →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
