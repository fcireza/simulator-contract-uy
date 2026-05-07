import type { TaxCalculationResult, TaxRegime } from '../utils/taxCalculator';

const formatUyu = (amount: number) => `$${amount.toLocaleString('es-UY')} UYU`;
const formatUsd = (amount: number) => `US$ ${amount.toLocaleString('en-US')}`;

interface RegimeComparisonProps {
  results: TaxCalculationResult[];
  darkMode: boolean;
}

const regimeLabels: Record<TaxRegime, string> = {
  unipersonal: 'Unipersonal',
  'sas-con-caja': 'SAS con Caja',
  'sas-sin-caja': 'SAS sin Caja',
};

const regimeTaxes: Record<TaxRegime, string> = {
  unipersonal: 'IRPF + BPS/FONASA',
  'sas-con-caja': 'IRAE 25% + Caja',
  'sas-sin-caja': 'IRAE 25% + BPS',
};

const regimeKeys: TaxRegime[] = ['unipersonal', 'sas-con-caja', 'sas-sin-caja'];

export default function RegimeComparison({ results, darkMode }: RegimeComparisonProps) {
  // Find best net income
  const bestNetUsd = Math.max(...results.map((r) => r.netUsd));

  return (
    <div className={`w-full ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <h3 className="text-xl font-bold mb-4">
        Comparación de Regímenes
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        {results.map((result, index) => {
          const regime = regimeKeys[index];
          const isBest = result.netUsd === bestNetUsd;
          const isUnipersonal = regime === 'unipersonal';

          return (
            <div
              key={regime}
              className={`rounded-xl shadow-lg p-6 space-y-3 ${
                isBest
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                  : darkMode
                    ? 'bg-gray-800'
                    : 'bg-white'
              }`}
            >
              <div className="text-center">
                <h4 className={`text-lg font-bold ${isBest ? 'text-white' : ''}`}>
                  {regimeLabels[regime]}
                </h4>
                <p className={`text-xs mt-1 ${isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {regimeTaxes[regime]}
                </p>
              </div>

              <div className={`text-center py-4 ${isBest ? 'border-y border-green-400' : `border-y ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}`}>
                <p className="text-3xl font-bold">
                  {formatUsd(result.netUsd)}
                </p>
                <p className={`text-sm ${isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatUyu(result.netUyu)}
                </p>
                {isBest && (
                  <span className="inline-block mt-2 px-3 py-1 bg-white text-green-600 text-xs font-bold rounded-full">
                    MEJOR OPCIÓN
                  </span>
                )}
              </div>

              {/* Detailed tax breakdown for Unipersonal */}
              {isUnipersonal && (
                <div className="space-y-1 text-sm">
                  {/* BPS + FONASA */}
                  {result.bpsFonasa > 0 && (
                    <div className="flex justify-between">
                      <div>
                        <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          BPS + FONASA
                        </span>
                        {result.fonasaRate !== undefined && (
                          <span className={`ml-1 text-xs ${isBest ? 'text-green-200' : 'text-blue-500'}`}>
                            ({(result.bpsRate || 0.15) * 100}%)
                          </span>
                        )}
                      </div>
                      <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                        -{formatUyu(result.bpsFonasa)}
                      </span>
                    </div>
                  )}

                  {/* Family breakdown */}
                  {result.familyDetail?.hasSpouse && (
                    <div className="flex justify-between ml-2">
                      <span className={isBest ? 'text-green-200' : darkMode ? 'text-gray-500' : 'text-gray-500'}>
                        • Cónyuge
                      </span>
                      <span className={isBest ? 'text-green-200' : 'text-red-400'}>
                        +{formatUyu(result.familyDetail.spouseSurcharge || 0)}
                      </span>
                    </div>
                  )}
                  {(result.familyDetail?.childrenCount ?? 0) > 0 && (
                    <div className="flex justify-between ml-2">
                      <span className={isBest ? 'text-green-200' : darkMode ? 'text-gray-500' : 'text-gray-500'}>
                        • Hijos ({result.familyDetail?.childrenCount})
                      </span>
                      <span className={isBest ? 'text-green-200' : 'text-red-400'}>
                        +{formatUyu(result.familyDetail?.childrenSurcharge || 0)}
                      </span>
                    </div>
                  )}
                  {(result.familyDetail?.disabledChildrenCount ?? 0) > 0 && (
                    <div className="flex justify-between ml-2">
                      <span className={isBest ? 'text-green-200' : darkMode ? 'text-gray-500' : 'text-gray-500'}>
                        • Hijos disc.
                      </span>
                      <span className={isBest ? 'text-green-200' : 'text-red-400'}>
                        +{formatUyu(result.familyDetail?.disabledChildDeduction || 0)}
                      </span>
                    </div>
                  )}

                  {/* IRPF */}
                  {result.irpf > 0 && (
                    <div className="flex justify-between">
                      <div>
                        <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          IRPF
                        </span>
                        {result.appliedIrpfBracket && (
                          <span className={`ml-1 text-xs ${isBest ? 'text-green-200' : 'text-blue-500'}`}>
                            {result.appliedIrpfBracket.label}
                          </span>
                        )}
                      </div>
                      <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                        -{formatUyu(result.irpf)}
                      </span>
                    </div>
                  )}

                  {/* IRPF deductions */}
                  {(result.familyDetail?.childDeduction ?? 0) > 0 && result.irpf > 0 && (
                    <div className="flex justify-between ml-2">
                      <span className={isBest ? 'text-green-200' : darkMode ? 'text-gray-500' : 'text-gray-500'}>
                        • Deducción hijos
                      </span>
                      <span className={isBest ? 'text-green-300' : 'text-green-600'}>
                        -{formatUyu(result.familyDetail?.childDeduction || 0)}
                      </span>
                    </div>
                  )}

                  {/* Fondo de Solidaridad */}
                  {(result.fondoSolidaridad ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Fondo Solidaridad
                      </span>
                      <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                        -{formatUyu(result.fondoSolidaridad || 0)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* SAS regime breakdown */}
              {!isUnipersonal && (
                <div className="space-y-1 text-sm">
                  {result.cajaProfesional > 0 && (
                    <div className="flex justify-between">
                      <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Caja Profesional
                      </span>
                      <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                        -{formatUyu(result.cajaProfesional)}
                      </span>
                    </div>
                  )}

                  {result.bpsFonasa > 0 && (
                    <div className="flex justify-between">
                      <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        BPS Común
                      </span>
                      <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                        -{formatUyu(result.bpsFonasa)}
                      </span>
                    </div>
                  )}

                  {result.irae > 0 && (
                    <div className="flex justify-between">
                      <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        IRAE
                      </span>
                      <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                        -{formatUyu(result.irae)}
                      </span>
                    </div>
                  )}

                  {result.vat > 0 && (
                    <div className="flex justify-between">
                      <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        IVA
                      </span>
                      <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                        -{formatUyu(result.vat)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Services */}
              {(result.accountantCost + result.escribanaCost + result.facturacionCost) > 0 && (
                <div className="space-y-1 text-sm pt-2 border-t border-dashed">
                  <div className="flex justify-between">
                    <span className={isBest ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Servicios
                    </span>
                    <span className={isBest ? 'text-green-100' : 'text-red-400'}>
                      -{formatUyu(result.accountantCost + result.escribanaCost + result.facturacionCost)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        * Basado en los mismos ingresos brutos. Mejor opción = mayor ingreso neto.
      </p>
    </div>
  );
}
