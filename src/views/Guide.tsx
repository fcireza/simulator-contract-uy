import { useState, useCallback } from 'react';
import {
  guideSections,
  guideIntroContent,
  guideIntroSource,
  structureDataList,
  comparisonTableRows,
  industryRecommendations,
  incomeRules,
  importantConsiderations,
} from '../data/guideData';
import type { TaxRegime } from '../data/guideData';
import StructureComparisonTable from '../components/StructureComparisonTable';
import { useDarkModeContext } from '../hooks/DarkModeContext';

// ============================================
// Inline SVG Icons (replacing emoji)
// ============================================

const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconBuilding = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
  </svg>
);

const IconCaja = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconBps = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconCalculator = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const IconLightbulb = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconWarning = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const IconCompare = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// ============================================
// Categories with section groupings
// ============================================

interface CategoryDef {
  id: string;
  title: string;
  icon: React.ReactNode;
  sectionIds: string[];
}

const categories: CategoryDef[] = [
  {
    id: 'intro',
    title: '¿Qué es un Contractor IT?',
    icon: <IconUser />,
    sectionIds: ['intro-card'],
  },
  {
    id: 'regimenes',
    title: 'Estructuras Detalladas',
    icon: <IconBuilding />,
    sectionIds: ['structure-unipersonal', 'structure-sas-caja', 'structure-sas-bps'],
  },
  {
    id: 'comparativa',
    title: 'Tabla Comparativa',
    icon: <IconCompare />,
    sectionIds: ['comparison-table'],
  },
  {
    id: 'recomendaciones',
    title: 'Recomendaciones',
    icon: <IconLightbulb />,
    sectionIds: ['industry-recs', 'income-rules'],
  },
  {
    id: 'consideraciones',
    title: 'Consideraciones Importantes',
    icon: <IconWarning />,
    sectionIds: ['caveats'],
  },
  {
    id: 'impuestos',
    title: 'Impuestos',
    icon: <IconChart />,
    sectionIds: ['bps', 'fonasa', 'irpf', 'iva', 'family', 'fondo-solidaridad', 'valores'],
  },
  {
    id: 'simulacion',
    title: 'Simulación',
    icon: <IconCalculator />,
    sectionIds: ['simulacion', 'reverse', 'compare'],
  },
];

// ============================================
// Structure section renderers (7 dimensions)
// ============================================

function renderDimensions(
  dims: {
    tributacion: string;
    costos: string;
    salud: string;
    jubilacion: string;
    riesgo: string;
    escalabilidad: string;
    optimizacionFiscal: string;
  },
  darkMode: boolean,
) {
  const items = [
    {
      label: 'Tributación', value: dims.tributacion,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: 'Costos', value: dims.costos,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    },
    {
      label: 'Salud / Cobertura Médica', value: dims.salud,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    },
    {
      label: 'Jubilación', value: dims.jubilacion,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: 'Riesgo', value: dims.riesgo,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>,
    },
    {
      label: 'Escalabilidad', value: dims.escalabilidad,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    },
    {
      label: 'Optimización Fiscal', value: dims.optimizacionFiscal,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}
        >
          <h5 className={`font-semibold text-sm mb-1 flex items-center gap-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <span className="text-blue-500">{item.icon}</span>
            <span>{item.label}</span>
          </h5>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function renderProsCons(
  pros: string[],
  cons: string[],
  darkMode: boolean,
) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mt-4">
      <div>
        <h5 className={`font-semibold text-sm mb-2 flex items-center gap-1.5 text-green-600 dark:text-green-400`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Ventajas
        </h5>
        <ul className="space-y-1">
          {pros.map((pro, i) => (
            <li key={i} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start gap-1`}>
              <span className="text-green-500 mt-0.5 shrink-0">•</span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h5 className={`font-semibold text-sm mb-2 flex items-center gap-1.5 text-red-500 dark:text-red-400`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Desventajas
        </h5>
        <ul className="space-y-1">
          {cons.map((con, i) => (
            <li key={i} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start gap-1`}>
              <span className="text-red-400 mt-0.5 shrink-0">•</span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================
// Main Guide Component
// ============================================

export default function Guide() {
  const { darkMode } = useDarkModeContext();
  const [expandedSection, setExpandedSection] = useState<string | null>('intro-card');

  const handleToggleSection = useCallback((id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  }, []);

  const headingClass = darkMode ? 'text-white' : 'text-gray-900';
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const cardClass = darkMode
    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
    : 'bg-white border-gray-200 hover:bg-gray-50';

  const comparisonColumns = [
    { key: 'unipersonal' as TaxRegime, label: 'Unipersonal' },
    { key: 'sas-con-caja' as TaxRegime, label: 'SAS + Caja' },
    { key: 'sas-sin-caja' as TaxRegime, label: 'SAS + BPS' },
  ];

  return (
    <div className={`max-w-5xl mx-auto ${textClass}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-bold mb-4 ${headingClass}`}>
          Guía del Contractor IT
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Todo lo que necesitás saber sobre{' '}
          <span className="text-blue-500 font-semibold">impuestos y regímenes</span>{' '}
          para trabajar como independiente en Uruguay.
        </p>
        <p className="text-sm mt-2 opacity-70">
          Clickeá en cada sección para expandir
        </p>
      </div>

      {/* Sections by Category */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="mb-8">
            <h3 className={`text-2xl font-bold mb-4 ${headingClass} flex items-center gap-2`}>
              <span className="text-blue-500">{category.icon}</span>
              <span>{category.title}</span>
            </h3>

            <div className="space-y-3">
              {/* Intro Card (special rendering) */}
              {category.id === 'intro' && (
                <div
                  className={`rounded-xl border transition-all duration-200 ${cardClass}`}
                >
                  <button
                    onClick={() => handleToggleSection('intro-card')}
                    className="w-full text-left px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-blue-500">
                        <IconUser />
                      </div>
                      <span className={`font-semibold text-lg ${headingClass}`}>
                        ¿Qué es un Contractor IT?
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${expandedSection === 'intro-card' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedSection === 'intro-card' && (
                    <div className="px-6 pb-5 pt-0">
                      <p className="leading-relaxed mb-4 whitespace-pre-line">
                        {guideIntroContent}
                      </p>
                      <p className={`text-xs border-t pt-3 ${darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-200'}`}>
                        Fuente: {guideIntroSource}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Structure Detail Sections (3 deep sections) */}
              {category.id === 'regimenes' &&
                structureDataList.map((sd) => (
                  <div
                    key={`structure-${sd.regime}`}
                    className={`rounded-xl border transition-all duration-200 ${cardClass}`}
                  >
                    <button
                      onClick={() => handleToggleSection(`structure-${sd.regime}`)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-blue-500">
                          {sd.regime === 'unipersonal' ? <IconUser /> : sd.regime === 'sas-con-caja' ? <IconCaja /> : <IconBps />}
                        </div>
                        <span className={`font-semibold text-lg ${headingClass}`}>
                          {sd.name}
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSection === `structure-${sd.regime}` ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {expandedSection === `structure-${sd.regime}` && (
                      <div className="px-6 pb-5 pt-0 space-y-4">
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {sd.description}
                        </p>

                        {/* 7 Dimensions */}
                        {renderDimensions(sd.dimensions, darkMode)}

                        {/* Pros / Cons */}
                        {renderProsCons(sd.pros, sd.cons, darkMode)}
                      </div>
                    )}
                  </div>
                ))}

              {/* Comparison Table */}
              {category.id === 'comparativa' && (
                <div
                  className={`rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} p-6`}
                >
                  <StructureComparisonTable
                    rows={comparisonTableRows}
                    columns={comparisonColumns}
                    darkMode={darkMode}
                  />
                </div>
              )}

              {/* Recommendations */}
              {category.id === 'recomendaciones' && (
                <div className="space-y-4">
                  {/* Industry Usage */}
                  <div
                    className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
                  >
                    <h4 className={`font-bold text-base mb-4 ${headingClass}`}>
                      Uso según perfil
                    </h4>
                    <div className="space-y-3">
                      {industryRecommendations.map((rec) => (
                        <div
                          key={rec.level}
                          className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className={`font-semibold text-sm ${headingClass}`}>
                                {rec.level}
                              </h5>
                              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {rec.description}
                              </p>
                            </div>
                            <span className="shrink-0 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                              {rec.recommended}
                            </span>
                          </div>
                          <p className={`text-xs mt-2 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {rec.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Income-Level Practical Rule */}
                  <div
                    className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
                  >
                    <h4 className={`font-bold text-base mb-4 ${headingClass}`}>
                      Regla práctica según ingreso (2026)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className={`w-full text-sm border-collapse ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <thead>
                          <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                            <th className={`text-left px-4 py-2 font-semibold border-b ${darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-800'}`}>
                              Ingreso
                            </th>
                            <th className={`text-center px-4 py-2 font-semibold border-b ${darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-800'}`}>
                              Estructura recomendada
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {incomeRules.map((rule) => (
                            <tr
                              key={rule.incomeRange}
                              className={darkMode ? 'border-gray-700' : 'border-gray-200'}
                            >
                              <td className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                                {rule.incomeRange}
                              </td>
                              <td className={`px-4 py-3 border-b text-center font-medium ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-blue-600 dark:text-blue-400`}>
                                {rule.recommended}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Considerations */}
              {category.id === 'consideraciones' && (
                <div className="space-y-4">
                  {importantConsiderations.map((caveat) => (
                    <div
                      key={caveat.id}
                      className={`rounded-xl border-l-4 border-yellow-500 p-6 ${darkMode ? 'bg-yellow-900/20 border-gray-700' : 'bg-yellow-50 border-gray-200'}`}
                    >
                      <h4 className={`font-bold text-sm mb-2 flex items-center gap-2 ${headingClass}`}>
                        <IconWarning />
                        {caveat.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {caveat.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Regular guide sections (impuestos, simulacion) */}
              {category.id !== 'intro' &&
                category.id !== 'regimenes' &&
                category.id !== 'comparativa' &&
                category.id !== 'recomendaciones' &&
                category.id !== 'consideraciones' &&
                guideSections
                  .filter((s) => category.sectionIds.includes(s.id))
                  .map((section) => (
                    <div
                      key={section.id}
                      className={`rounded-xl border transition-all duration-200 ${cardClass}`}
                    >
                      <button
                        onClick={() => handleToggleSection(section.id)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-blue-500">
                            <IconChart />
                          </div>
                          <span className={`font-semibold text-lg ${headingClass}`}>
                            {section.title}
                          </span>
                        </div>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedSection === section.id && (
                        <div className="px-6 pb-5 pt-0">
                          <p className="leading-relaxed mb-4 whitespace-pre-line">
                            {section.content}
                          </p>
                          <p className={`text-xs border-t pt-3 ${darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-200'}`}>
                            Fuente: {section.source}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className={`mt-10 p-6 rounded-xl border-l-4 border-yellow-500 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
        <h4 className={`font-semibold mb-2 flex items-center gap-2 ${headingClass}`}>
          <IconWarning />
          Nota Importante
        </h4>
        <p className="text-sm">
          Esta guía es solo informativa y no sustituye el asesoramiento fiscal profesional.
          Los valores y reglas pueden cambiar. Consultá siempre con un contador habilitado.
        </p>
      </div>
    </div>
  );
}
