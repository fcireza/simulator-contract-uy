import { useState, useCallback } from 'react';

interface GuideProps {
  darkMode: boolean;
}

interface GuideSection {
  id: string;
  title: string;
  content: string;
  source: string;
  icon: React.ReactNode;
  category?: string;
}

const guideSections: GuideSection[] = [
  // =========================================
  // 1. ¿Qué es un Contractor IT?
  // =========================================
  {
    id: 'contractor',
    title: '¿Qué es un Contractor IT?',
    category: 'intro',
    content: `Un contractor IT es un profesional independiente que presta servicios de tecnología a empresas del exterior (mayormente USA/EU).

A diferencia de un empleado en relación de dependencia, el contractor:
• No tiene vínculo de dependencia (es freelance)
• Factura por servicios prestados
• Maneja sus propios horarios y herramientas
• Es responsable de sus aportes sociales

En Uruguay puede trabajar bajo:
• Régimen Unipersonal (más común)
• SAS (Sociedad Anónima Simplificada)

Su ingreso viene de exportación de servicios → 0% IVA`,
    source: 'BPS - Trabajadores no dependientes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },

  // =========================================
  // 2. Regímenes
  // =========================================
  {
    id: 'unipersonal',
    title: 'Unipersonal',
    category: 'regimenes',
    content: `Trabajadores independientes con aportación Industria y Comercio (BPS).

Características:
• Aportes BPS: 15% jubilación + FONASA variable
• Base imponible: 70% del ingreso bruto (tope 15 BPC = $102,960)
• Impuesto IRPF: 8 tramos progresivos (0% a 36%)
• Fondo de Solidaridad: si aplica (graduado 5+ años)

Ventajas:
• Simplicidad administrativa
• No requiere escribana
• Ideal para ingresos bajos/medios

Desventajas:
• Paga FONASA e IRPF personal
• Fondo de Solidaridad si aplica`,
    source: 'BPS - Industria y Comercio | DGI - IRPF',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'sas',
    title: 'SAS (Sociedad Anónima Simplificada)',
    category: 'regimenes',
    content: `Opción para ingresos altos o necesidad de imagen empresarial. Requiere escribana para constitución.

Dos modalidades:

1. SAS CON Caja Profesional:
   • Requiere título universitario
   • Caja Profesional: 22.5% sobre base imponible (70% ingreso, tope 15 BPC)
   • IRAE: 25% sobre utilidades (después de gastos deducibles)

2. SAS SIN Caja (BPS Común):
   • No requiere título universitario
   • BPS Común: 12.5% sobre base imponible
   • IRAE: 25% sobre utilidades

Los socios de SAS NO pagan:
• FONASA
• Fondo de Solidaridad
• IRPF personal (tributan sobre dividendos)

Gastos deducibles (reducen IRAE):
• Contador: ~$5,000/mes
• Escribana: ~$8,000/mes  
• Facturación: ~$3,000/mes

Ventajas SAS:
• Separación patrimonio personal/empresarial
• Imagen profesional B2B
• Posibilidad de pagar dividendos con menor carga

Socios de SAS NO pagan: FONASA, Fondo Solidaridad, IRPF personal.`,
    source: 'BPS - SAS | DGI - IRAE',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
      </svg>
    ),
  },

  // =========================================
  // 3. Impuestos
  // =========================================
  {
    id: 'bps',
    title: 'BPS (Banco de Previsión Social)',
    category: 'impuestos',
    content: `Aportes obligatorios para trabajadores independientes.

Valores 2026:
• BPC: $6,864 UYU
• Tope BPS: 15 BPC = $102,960/mes
• Base imponible: 70% del ingreso bruto

Tasas según régimen:
• Unipersonal: 15% jubilación + FONASA variable
• SAS con caja: 22.5% (Caja Profesional)
• SAS sin caja: 12.5% (BPS Común)

Importante:
• Si el 70% del ingreso supera 15 BPC, se topea en $102,960
• La base es la misma para BPS, FONASA e IRPF`,
    source: 'BPS - Valores actuales 2026',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'fonasa',
    title: 'FONASA (Fondo Nacional de Salud)',
    category: 'impuestos',
    content: `Sistema de salud que varía según ingresos y familia.

Se aplica sobre la base imponible (70% del ingreso bruto).

Tasas 2026:
Ingreso base ≤ 2.5 BPC ($17,160):
  • Base FONASA: 8%
  • Cónyuge: 0%
  • Hijos: 0% (no aplica)

Ingreso base > 2.5 BPC:
  • Base FONASA: 9.5%
  • Cónyuge: +2%
  • Cada hijo: +1.5%

Ejemplos Unipersonal (15% jub + FONASA):
• $100,000/mes + cónyuge → 15% + 9.5% + 2% = 26.5%
• $120,000/mes + cónyuge + 2 hijos → 15% + 9.5% + 2% + 3% = 29.5%

Nota: Los suplementos familiares aumentan el costo pero no reducen el IRPF.`,
    source: 'BPS - Tasas FONASA 2026',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'irpf',
    title: 'IRPF — 8 Tramos Progresivos',
    category: 'impuestos',
    content: `Impuesto sobre la Renta de las Personas Físicas. Sistema MARGINAL.

      Tramos 2026 (BPC = $6,864 UYU):
      1. Rango: 0 - 48,048 UYU → 0% IRPF:
      2. Rango: 48,048 - 68,640 UYU → 10% IRPF sobre el excedente de 48,048
      3. Rango: 68,640 - 102,960 UYU → 15% IRPF sobre el excedente de 68,640
      4. Rango: 102,960 - 205,920 UYU → 24% IRPF sobre el excedente de 102,960
      5. Rango: 205,920 - 343,200 UYU → 25% IRPF sobre el excedente de 205,920
      6. Rango: 343,200 - 514,800 UYU → 27% IRPF sobre el excedente de 343,200
      7. Rango: 514,800 - 789,360 UYU → 31% IRPF sobre el excedente de 514,800
      8. Rango: > 789,360 UYU → 36% IRPF sobre el excedente de 789,360

      Cálculo MARGINAL: cada tasa aplica solo sobre esa porción.

      Deducciones IRPF:
      • Por hijo: $11,440 UYU/mes (20 BPC/año)
      • Hijo con discapacidad: $22,880 UYU/mes (40 BPC/año)
      • FONASA, BPS, Fondo Solidaridad, Caja Profesional
      • (+6% incremento si ingreso > 10 BPC)

      Cálculo: Anticipos bimestrales + Declaración anual (Form. 1102/1103).`,
    source: 'DGI - IRPF escalas 2026 | DGI - Deducciones',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
      </svg>
    ),
  },
  {
    id: 'iva',
    title: 'IVA (Impuesto al Valor Agregado)',
    category: 'impuestos',
    content: `Tasa 0% para exportación de servicios (exterior). Tasa 22% para servicios locales.

Contractors IT generalmente facturan al exterior → 0% IVA.

Servicios al exterior:
• 0% IVA (exportación)
• Podés solicitar exoneración de IVA
• No necesitás factura electrónica (rubricado basta)

Servicios locales (URUGUAYOS):
• 22% IVA sobre el ingreso bruto
• Requiere facturación electrónica (DGI)
• Podés darte de baja en el rubricado si no tenés otros ingresos gravados

Si facturás AMBOS tipos:
• Llevá contador
• IVA separado por cada tipo de cliente`,
    source: 'DGI - IVA Servicios Personales',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'family',
    title: 'Situación Familiar',
    category: 'impuestos',
    content: `El simulador calcula automáticamente según tu familia.

BPS + FONASA (aumenta costo):
• Cónyuge a cargo: +2% FONASA
• Cada hijo: +1.5% FONASA (solo si base > 2.5 BPC)
• Hijo con discapacidad: mismo % que hijo normal

IRPF (reduce impuesto - deducción):
• Por hijo: $11,440 UYU/mes deducible
• Hijo con discapacidad: $22,880 UYU/mes
• Aplican al cálculo del IRPF

Cómo ingresarlo en el simulador:
1. Tildar "Cónyuge a cargo"
2. Tildar "Hijos a cargo" e ingresar cantidad
3. Ingresar año de graduación universitaria

El simulador aplica automáticamente las tasas correctas.`,
    source: 'BPS + DGI - Deducciones familiares',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'fondo-solidaridad',
    title: 'Fondo de Solidaridad',
    category: 'impuestos',
    content: `Aporte obligatorio para egresados de universidades públicas (UdelaR, UTEC, UTU).

¿Cuándo aplica? (AMBAS condiciones):
1. Egresado hace 5+ años (año de graduación ingresado en Situación Familiar)
2. Ingreso mensual > 8 BPC ($54,912 UYU)

Monto mensual según nivel de ingreso (se calcula automático):
• 8 – 15 BPC: 0.5 BPC/mes = $3,432 + $476 adicional = $3,908
• 15 – 30 BPC: 1 BPC/mes = $6,864 + $476 adicional = $7,340
• 30+ BPC: 2 BPC/mes = $13,728 + $476 adicional = $14,204

¿De dónde sale el $476 adicional?
Es el aporte extra por carreras de 5+ años de duración: ((5/6) * BPC) / 12 = $476/mes.

¿Cómo se usa en la simulación?
• Ingresá tu año de graduación en "Situación Familiar" (ej: 2018)
• El simulador calcula: añosDesdeGrad = 2026 - añoIngresado
• Si añosDesdeGrad < 5 → Fondo = 0
• Si añosDesdeGrad >= 5 Y ingreso > 8 BPC → aplica según tramo de ingreso

Socios de SAS NO pagan Fondo de Solidaridad.`,
    source: 'Fondo de Solidaridad - Ley 18.829',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },

  // =========================================
  // 4. Valor BPC 2026
  // =========================================
  {
    id: 'valores',
    title: 'Valor BPC 2026',
    category: 'valores',
    content: `Valores oficiales BPS vigentes 2026:

    • BPC: $6,864 UYU
    • BFC: $1,847.96 UYU
    • Salario mínimo: $24,572.00
    • Tope BPS: 15 BPC = $102,960 UYU (base máxima mensual)

    Cálculo de base imponible:
    • Base = 70% del ingreso bruto
    • Ejemplo: $100,000 UYU → base = $70,000 UYU

    Tramos IRPF (en BPC):
    • 7 BPC = $48,048 (exento)
    • 10 BPC = $68,640
    • 15 BPC = $102,960
    • 30 BPC = $205,920
    • 50 BPC = $343,200
    • 75 BPC = $514,800
    • 115 BPC = $789,360

    Estos valores aplican a ingresos mensuales. Anual es 12x.`,
    source: 'BPS - Valores 2026',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },

  // =========================================
  // 5. Simulación de Ingresos
  // =========================================
  {
    id: 'simulacion',
    title: 'Simulación de Ingresos',
    category: 'simulacion',
    content: `Calcula tu ingreso neto después de impuestos.

    Ingresá:
    • Ingreso bruto (USD o UYU)
    • Tipo de cambio
    • Cliente: Exterior (0% IVA) o Local (22% IVA)
    • Régimen: Unipersonal / SAS con Caja / SAS sin Caja
    • Situación familiar: cónyuge, hijos, año graduación
    • Servicios: Contador, Escribana, Facturación

    El simulador muestra:
    • Ingreso neto (USD y UYU)
    • Desglose: BPS+FONASA, IRPF, IRAE, Caja, IVA
    • Fondo de Solidaridad si aplica
    • Deducciones por hijos

    Hacé click en "Comparar" para ver qué régimen te conviene más.`,
    source: 'Simulador Contractor UY',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },

  // =========================================
  // 6. Simulación Inversa
  // =========================================
  {
    id: 'reverse',
    title: 'Simulación Inversa',
    category: 'simulacion',
    content: `¿Cuánto necesitás facturar para llevarte un neto específico?

    Ingresá:
    • Ingreso neto que querés obtener (en USD)
    • Régimen a calcular
    • Servicios que vas a usar (contador, facturación)

    El simulador itera para encontrar el bruto necesario.

    El resultado muestra:
    • Ingreso bruto requerido (USD y UYU)
    • Desglose completo (igual que simulación normal)
    • BPS+FONASA con tasas aplicadas
    • IRPF con tramo detectado
    • Fondo Solidaridad si aplica

    Nota: El valor es estimado. El neto real puede variar ±5% según deducciones exactas.`,
    source: 'Calculadora inversa',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },

  // =========================================
  // 7. Comparación (Versus)
  // =========================================
  {
    id: 'compare',
    title: 'Comparación (Versus)',
    category: 'comparacion',
    content: `Compara automáticamente los 3 regímenes con los mismos ingresos brutos.

Regímenes comparados:
1. UNIPERSONAL
   • BPS 15% + FONASA 8-13% + IRPF progresivo
   • + Fondo de Solidaridad si aplica
   • Mejor para ingresos bajos/medios

2. SAS CON CAJA
   • Caja 22.5% + IRAE 25%
   • Sin FONASA, sin IRPF, sin Fondo Solidaridad
   • Mejor para ingresos altos + gastos deducibles

3. SAS SIN CAJA
   • BPS 12.5% + IRAE 25%
   • Sin FONASA, sin IRPF, sin Fondo Solidaridad
   • Alternativa intermedia

Usá el botón "Comparar" en la simulación para ver cuál te conviene más según tu ingreso bruto.`,
    source: 'Comandos del simulador',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

// Group sections by category
const categories = [
  { id: 'intro', title: '¿Qué es un Contractor IT?', icon: '💻', sections: ['contractor'] },
  { id: 'regimenes', title: 'Regímenes', icon: '🏢', sections: ['unipersonal', 'sas'] },
  { id: 'impuestos', title: 'Impuestos', icon: '📊', sections: ['bps', 'fonasa', 'irpf', 'iva', 'family', 'fondo-solidaridad'] },
  { id: 'valores', title: 'Valor BPC 2026', icon: '💰', sections: ['valores'] },
  { id: 'simulacion', title: 'Simulación', icon: '🧮', sections: ['simulacion', 'reverse'] },
  { id: 'comparacion', title: 'Comparación (Versus)', icon: '⚖️', sections: ['compare'] },
];

export default function Guide({ darkMode }: GuideProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(guideSections[0].id);

  const handleToggleSection = useCallback((id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  }, []);

  const headingClass = darkMode ? 'text-white' : 'text-gray-900';
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const cardClass = darkMode
    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
    : 'bg-white border-gray-200 hover:bg-gray-50';

  return (
    <div className={`max-w-5xl mx-auto ${textClass}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-bold mb-4 ${headingClass}`}>
          📖 Guía del Contractor IT
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Todo lo que necesitás saber sobre{' '}
          <span className="text-blue-500 font-semibold">impuestos y regímenes</span>{' '}
          para trabajar como independiente en Uruguay.
        </p>
        <p className="text-sm mt-2 opacity-70">
          💡 Clickeá en cada sección para expandir
        </p>
      </div>

      {/* Sections by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const sections = guideSections.filter((s) => category.sections.includes(s.id));
          if (sections.length === 0) return null;

          return (
            <div key={category.id} className="mb-8">
              <h3 className={`text-2xl font-bold mb-4 ${headingClass} flex items-center gap-2`}>
                <span>{category.icon}</span>
                <span>{category.title}</span>
              </h3>

              <div className="space-y-3">
                {sections.map((section) => (
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
                          {section.icon}
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
                          📚 Fuente: {section.source}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className={`mt-10 p-6 rounded-xl border-l-4 border-yellow-500 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
        <h4 className={`font-semibold mb-2 ${headingClass}`}>
          ⚠️ Nota Importante
        </h4>
        <p className="text-sm">
          Esta guía es solo informativa y no sustituye el asesoramiento fiscal profesional.
          Los valores y reglas pueden cambiar. Consultá siempre con un contador habilitado.
        </p>
      </div>
    </div>
  );
}
