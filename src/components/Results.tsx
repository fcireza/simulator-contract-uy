import { useState } from 'react';
import TaxBreakdown, { type TaxBreakdownData } from './TaxBreakdown';

const formatUyu = (amount: number) => `$${amount.toLocaleString('es-UY')} UYU`;
const formatUsd = (amount: number) => `US$ ${amount.toLocaleString('en-US')}`;

interface ResultsProps {
  result: TaxBreakdownData & {
    incomeUyu: number;
    netUyu: number;
    netUsd: number;
  };
  exchangeRate: number;
  darkMode: boolean;
  regime: 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja';
}

export default function Results({ result, exchangeRate, darkMode, regime }: ResultsProps) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

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

      <TaxBreakdown
        data={result}
        grossIncome={result.incomeUyu}
        netIncome={result.netUyu}
        exchangeRate={exchangeRate}
        darkMode={darkMode}
        regime={regime}
      />

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
                <h4 className="font-semibold">IRPF</h4>
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
