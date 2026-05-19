import { useDarkModeContext } from '../hooks/DarkModeContext';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Cálculos 2026',
    description: 'Basado en valores oficiales de BPS, DGI, FONASA y Fondo de Solidaridad actualizados a 2026.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
    title: '3 Regímenes',
    description: 'Compara Unipersonal, SAS CON/SIN caja profesional para ver cuál te conviene más.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
        />
      </svg>
    ),
    title: 'Cotización USD/UYU',
    description: 'Obtiene la cotización actual, o usá un valor manual con indicador de disponibilidad.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: '8 Tramos IRPF',
    description: 'Sistema progresivo de 8 tramos (0% a 36%) con deducibles por hijos y discapacidad.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: 'Situación Familiar',
    description: 'Calcula automáticamente FONASA y deducciones según tu familia: cónyuge e hijos.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    title: 'Simulación Inversa',
    description: '¿Cuánto necesitás facturar para llevar un neto específico? El simulador te lo dice.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: '100% Responsive',
    description: 'Funciona perfecto en desktop, tablet y móvil. Modo oscuro incluido.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Fondo de Solidaridad',
    description: 'Cálculo automático para graduados 5+ años con ingresos >8 BPC.',
  },
];

export default function About() {
  const { darkMode } = useDarkModeContext();
  const cardClass = darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';
  const accentClass = 'text-blue-500';

  return (
    <div className={`max-w-5xl mx-auto ${textClass}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${headingClass}`}>Acerca del Simulador</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Una herramienta gratuita para{' '}
          <span className={`font-semibold ${accentClass}`}>contractors IT en Uruguay</span> que ayuda a calcular el
          ingreso neto después de impuestos.
        </p>
      </div>

      {/* Mission Section - Moved to first place */}
      <div className={`p-8 rounded-xl ${cardClass} mb-8`}>
        <h3 className={`text-xl font-bold mb-4 ${headingClass}`}>
          <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          Nuestro Objetivo
        </h3>
        <p className="mb-4">
          Este simulador nació de la necesidad de muchos desarrolladores y profesionales IT en Uruguay que trabajan como
          independientes (contractors) para empresas del exterior.
        </p>
        <p>
          La mayoría de las herramientas de cálculo fiscal están diseñadas para empleados en relación de dependencia.
          Este proyecto busca <span className="font-medium">llenar ese vacío</span> y facilitar la toma de decisiones
          informadas sobre el régimen impositivo más conveniente.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={`p-5 rounded-xl border ${cardClass} transition-all hover:scale-[1.02] duration-200`}
          >
            <div className={`mb-3 ${accentClass}`}>{feature.icon}</div>
            <h3 className={`text-base font-semibold mb-2 ${headingClass}`}>{feature.title}</h3>
            <p className="text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className={`p-6 rounded-xl border-l-4 border-yellow-500 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
        <h4 className={`font-semibold mb-2 ${headingClass}`}>
          <svg className="w-6 h-6 inline mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Disclaimer Importante
        </h4>
        <p className="text-sm">
          Este simulador es una <span className="font-medium">herramienta informativa</span> y NO sustituye el
          asesoramiento fiscal profesional. Los cálculos son aproximados (precisión estimada ±10%) y pueden variar según
          tu situación particular.
        </p>
        <p className="text-sm mt-2">
          Para decisiones fiscales importantes,{' '}
          <span className="font-medium">siempre consultar con un contador habilitado</span> por el Colegio de Contadores
          del Uruguay.
        </p>
      </div>
      <br />
      <hr />
    </div>
  );
}
