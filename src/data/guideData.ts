/**
 * Guide Data — Typed content for the Contractor IT Guide
 * All structure dimensions, comparison rows, and recommendations.
 * NO JSX — pure data only.
 */

export type TaxRegime = 'unipersonal' | 'sas-con-caja' | 'sas-sin-caja';

export interface StructureDimensions {
  tributacion: string;
  costos: string;
  salud: string;
  jubilacion: string;
  riesgo: string;
  escalabilidad: string;
  optimizacionFiscal: string;
}

export interface StructureData {
  regime: TaxRegime;
  name: string;
  description: string;
  dimensions: StructureDimensions;
  pros: string[];
  cons: string[];
}

export interface ComparisonTableRow {
  id: string;
  label: string;
  /** Values in order: Unipersonal, SAS+Caja, SAS+BPS */
  values: [string, string, string];
}

export interface IncomeRecommendation {
  rangeLabel: string;
  minUsd: number;
  maxUsd: number | null;
  recommended: TaxRegime;
  runnerUp: TaxRegime | null;
  note: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
}

// ============================================
// STRUCTURE DATA — 7 Dimensions × 3 Regimes
// ============================================

export const unipersonalData: StructureData = {
  regime: 'unipersonal',
  name: 'Unipersonal',
  description:
    'Régimen para trabajadores independientes sin separación patrimonial. Ideal para ingresos bajos a medios por su simplicidad y bajo costo administrativo.',
  dimensions: {
    tributacion:
      'IVA 0% exportación (servicios al exterior). IVA 22% servicios locales. IRPF progresivo 8 tramos (0%–36%) o IRAE 25% según categoría. BPS 15% jubilación + FONASA variable (8%–13%) sobre 70% del ingreso, tope 15 BPC. Exoneración parcial o total de IRPF/IRAE posible para exportación de software dependiendo de actividad y contratos.',
    costos:
      'BPS+FONASA: ~24.5%–29.5% sobre 70% del ingreso (topeado). Contador: ~$3,000–$7,000 UYU/mes. Facturación: ~$3,000 UYU/mes. Sin costos societarios (no requiere escribano, ni libro societario).',
    salud:
      'FONASA — cobertura de salud pública (ASSE) + posibilidad de mutualista privada con descuento por FONASA. Cobertura básica sin extra-costos. Cónyuge +2%, cada hijo +1.5% sobre la tasa base si ingreso > 2.5 BPC.',
    jubilacion:
      'Jubilación por BPS (Industria y Comercio). Aporte: 15% sobre 70% del ingreso (tope 15 BPC). Haber jubilatorio promedio: ~60%–70% del promedio de ingresos ajustados. Si aplica Caja Profesional (profesionales universitarios), el aporte va a Caja no a BPS.',
    riesgo:
      'Responsabilidad ilimitada — el patrimonio personal responde por deudas comerciales. Riesgo fiscal alto si no se declaran todos los ingresos. Sin protección ante juicios o embargos.',
    escalabilidad:
      'Baja escalabilidad. Difícil contratar empleados (debe cambiarse a SAS). Limitado para facturar montos muy altos (puede generar inspecciones). Sin posibilidad de tener múltiples socios.',
    optimizacionFiscal:
      'Optimización media. IRPF progresivo castiga ingresos altos (tasa marginal hasta 36%). Deducciones limitadas (hijos, FONASA, BPS, Fondo de Solidaridad). Sin posibilidad de gastos deducibles empresariales significativos.',
  },
  pros: [
    'Fácil apertura: se gestiona online en BPS/DGI en pocos días',
    'Bajo costo administrativo: no requiere escribano ni contador permanente (recomendado igual)',
    'Admin simple: una factura mensual, declaración jurada anual',
    'Sin costos societarios: no hay que llevar libros contables ni actas',
    'Ideal para montos bajos: < USD 3,000/mes es la opción más eficiente',
  ],
  cons: [
    'Responsabilidad ilimitada: tus bienes personales están en riesgo',
    'Riesgo patrimonial: cualquier deuda comercial afecta tu patrimonio',
    'Menos escalable: difícil crecer o incorporar socios/empleados',
    'Sin imagen corporativa: algunos clientes B2B prefieren empresas constituidas',
    'IRPF progresivo: a mayores ingresos, mayor carga impositiva marginal (hasta 36%)',
  ],
};

export const sasCajaData: StructureData = {
  regime: 'sas-con-caja',
  name: 'SAS + Caja Profesional',
  description:
    'Sociedad Anónima Simplificada con aportes a Caja Profesional. Para profesionales universitarios con ingresos altos que buscan máxima optimización fiscal y separación patrimonial.',
  dimensions: {
    tributacion:
      'IRAE 25% sobre utilidades (ingresos - gastos deducibles). IVA 0% exportación. IPAT (Impuesto al Patrimonio) si corresponde según activos de la sociedad. Posible exoneración parcial/total de IRAE por exportación de software. Socio aporta a Caja Profesional según su categoría (tasa ~22.5% sobre 70%, tope 15 BPC). NO paga IRPF personal (tributa por dividendos). NO paga FONASA.',
    costos:
      'Caja Profesional: ~22.5% sobre 70% del ingreso (tope 15 BPC). Contador: ~$5,000–$10,000 UYU/mes. Facturación electrónica: ~$3,000 UYU/mes. Mutualista privada: ~$3,000–$8,000 UYU/mes (sin FONASA). Costos societarios: libro de actas, firma de escribano, DGI anual. Certificado digital: ~$2,000 UYU/año.',
    salud:
      'NO tiene FONASA — debe contratar mutualista privada por cuenta propia ($3,000–$8,000 UYU/mes según plan). Puede incluir a familiares con costo adicional. Mejor cobertura que FONASA (mutualistas privadas de mayor calidad).',
    jubilacion:
      'Jubilación por Caja Profesional (no BPS). Aporte ~22.5% sobre 70% del ingreso. Haber jubilatorio suele ser más alto que BPS pero la Caja está en situación financiera compleja. Algunos profesionales jóvenes intentan evitarla por los costos crecientes.',
    riesgo:
      'Responsabilidad limitada: el patrimonio personal NO responde por deudas de la SAS. Mejor protección legal. Mayor compliance: requiere llevar libros, presentar balances, declaraciones juradas.',
    escalabilidad:
      'Alta escalabilidad. Puede tener múltiples socios. Puede contratar empleados. Imagen profesional B2B. Facturación sin límite efectivo. Posibilidad de reinvertir utilidades.',
    optimizacionFiscal:
      'MUY ALTA optimización. IRAE 25% sobre utilidades (vs IRPF hasta 36%). Gastos deducibles: contador, escribano, facturación, mutualista, cursos, equipos, vehículo, viáticos. Sin FONASA. Sin IRPF personal. Sin Fondo de Solidaridad. Caja Profesional permite deducciones adicionales.',
  },
  pros: [
    'Responsabilidad limitada: patrimonio personal separado del empresarial',
    'Alta optimización fiscal: IRAE 25% + gastos deducibles vs IRPF progresivo hasta 36%',
    'Mejor imagen profesional ante clientes B2B del exterior',
    'Escalable: posibilidad de socios, empleados, reinversión de utilidades',
    'Sin FONASA, sin IRPF personal, sin Fondo de Solidaridad',
  ],
  cons: [
    'Complejidad administrativa: requiere contador, libros societarios, balances anuales',
    'Caja Profesional cara: ~22.5%, y la situación financiera de la Caja es preocupante',
    'Mutualista privada obligatoria: ~$3,000–$8,000 UYU/mes extra (sin FONASA)',
    'Costos adicionales: certificado digital, escribano, facturación electrónica',
    'No apto para ingresos bajos: los costos fijos (contador, mutualista) pesan más',
  ],
};

export const sasBpsData: StructureData = {
  regime: 'sas-sin-caja',
  name: 'SAS + BPS (sin Caja)',
  description:
    'Sociedad Anónima Simplificada con BPS común. Para autodidactas, QA, DevOps, PMs, diseñadores y profesionales sin título universitario que buscan responsabilidad limitada.',
  dimensions: {
    tributacion:
      'IRAE 25% sobre utilidades. IVA 0% exportación. IPAT si corresponde. BPS Común: 12.5% sobre 70% del ingreso (tope 15 BPC). FONASA: aplica sobre la facturación de la empresa (no personal). NO paga IRPF personal. NO paga Caja Profesional.',
    costos:
      'BPS 12.5% sobre 70% del ingreso (tope 15 BPC). Contador: ~$5,000–$10,000 UYU/mes. Facturación electrónica: ~$3,000 UYU/mes. FONASA empresarial: tasa según ingresos. Costos societarios: libro de actas, firma de escribano, DGI anual. Certificado digital: ~$2,000 UYU/año.',
    salud:
      'Cobertura por FONASA a través de la empresa. Similar a Unipersonal pero el aporte lo hace la SAS. Acceso a mutualista con descuento FONASA. Cónyuge e hijos aplican recargos similares.',
    jubilacion:
      'Jubilación por BPS (Régimen Común). Aporte 12.5% sobre 70% del ingreso. Haber jubilatorio similar al de Unipersonal. Categoría BPS específica para actividades informáticas (código de actividad DGI).',
    riesgo:
      'Responsabilidad limitada: patrimonio personal protegido. Menor riesgo que Unipersonal pero con más obligaciones formales (balances, DGI, libros).',
    escalabilidad:
      'Alta escalabilidad. Igual que SAS+Caja: puede tener socios, empleados. Buena imagen profesional. Sin límite de facturación efectivo.',
    optimizacionFiscal:
      'Alta optimización. IRAE 25% + gastos deducibles. BPS 12.5% (vs 22.5% Caja Profesional). Sin IRPF personal. Sin Fondo de Solidaridad. Ideal para no-universitarios con ingresos altos.',
  },
  pros: [
    'Responsabilidad limitada: protección del patrimonio personal',
    'BPS más barato que Caja Profesional: 12.5% vs 22.5%',
    'Alta optimización fiscal con IRAE 25% y gastos deducibles',
    'Escalable: posibilidad de socios, empleados, reinversión',
    'Adecuado para autodidactas, QA, DevOps, PMs, diseñadores',
  ],
  cons: [
    'Complejidad administrativa: requiere contador y libros societarios',
    'Costos operativos medios: contador, facturación, certificado digital',
    'Paga FONASA aunque sea como empresa (no personal)',
    'Requiere constitución con escribano (costo inicial ~$15,000–$25,000 UYU)',
    'Menos optimización fiscal que SAS+Caja (BPS no da los mismos beneficios previsionales que Caja)',
  ],
};

export const structureDataList: StructureData[] = [
  unipersonalData,
  sasCajaData,
  sasBpsData,
];

// ============================================
// COMPARISON TABLE — 8 rows × 3 columns
// ============================================

export const comparisonTableRows: ComparisonTableRow[] = [
  {
    id: 'responsabilidad-limitada',
    label: 'Responsabilidad limitada',
    values: ['No', 'Sí', 'Sí'],
  },
  {
    id: 'jubilacion',
    label: 'Jubilación',
    values: ['BPS / Caja Profesional', 'Caja Profesional', 'BPS'],
  },
  {
    id: 'fonasa',
    label: 'FONASA',
    values: ['Sí', 'No (normalmente)', 'Sí'],
  },
  {
    id: 'mutualista',
    label: 'Mutualista',
    values: ['FONASA', 'Privada', 'FONASA'],
  },
  {
    id: 'complejidad',
    label: 'Complejidad',
    values: ['Baja', 'Media / Alta', 'Media'],
  },
  {
    id: 'costos-operativos',
    label: 'Costos operativos',
    values: ['Bajos', 'Altos', 'Medios'],
  },
  {
    id: 'escalabilidad',
    label: 'Escalabilidad',
    values: ['Baja', 'Alta', 'Alta'],
  },
  {
    id: 'optimizacion-fiscal',
    label: 'Optimización fiscal',
    values: ['Media', 'Muy alta', 'Alta'],
  },
];

// ============================================
// INDUSTRY RECOMMENDATIONS — Career Level
// ============================================

export interface IndustryRecommendation {
  level: string;
  description: string;
  recommended: string;
  note: string;
}

export const industryRecommendations: IndustryRecommendation[] = [
  {
    level: 'Junior / Freelance pequeño',
    description: 'Ingresos bajos, primeros trabajos, sin necesidad de estructura compleja',
    recommended: 'Unipersonal',
    note: 'Ideal para empezar: bajo costo, simple, fácil de gestionar',
  },
  {
    level: 'Senior',
    description: 'Ingresos USD 4k+, experiencia, clientes estables',
    recommended: 'SAS',
    note: 'La mejor relación optimización / protección patrimonial',
  },
  {
    level: 'Developer recibido',
    description: 'Título universitario + ingresos altos',
    recommended: 'SAS + Caja Profesional',
    note: 'Máxima optimización fiscal si el ingreso justifica el costo de Caja + mutualista',
  },
  {
    level: 'Startup / Producto propio',
    description: 'Múltiples fundadores, inversión, proyección de crecimiento',
    recommended: 'SAS',
    note: 'Estructura societaria necesaria para inversores y empleados',
  },
];

// ============================================
// INCOME-LEVEL PRACTICAL RULE (2026)
// ============================================

export interface IncomeRule {
  incomeRange: string;
  minUsd: number;
  maxUsd: number | null;
  recommended: string;
}

export const incomeRules: IncomeRule[] = [
  {
    incomeRange: 'Hasta USD 2,000–3,000/mes',
    minUsd: 0,
    maxUsd: 3000,
    recommended: 'Unipersonal',
  },
  {
    incomeRange: 'USD 4,000+/mes',
    minUsd: 4000,
    maxUsd: null,
    recommended: 'SAS',
  },
  {
    incomeRange: 'Developer recibido (cualquier ingreso)',
    minUsd: 0,
    maxUsd: null,
    recommended: 'SAS + Caja Profesional',
  },
];

// ============================================
// IMPORTANT CONSIDERATIONS (Caveats)
// ============================================

export interface ImportantConsideration {
  id: string;
  title: string;
  content: string;
}

export const importantConsiderations: ImportantConsideration[] = [
  {
    id: 'software-exonerado',
    title: '"Software exonerado" NO significa "sin impuestos"',
    content:
      'La exoneración de IRAE/IRPF para exportación de software no es automática ni total. Depende de la actividad exacta, los contratos firmados, el lugar de explotación del servicio, la infraestructura utilizada y la naturaleza del servicio prestado. Muchos contractors creen que por facturar al exterior están 100% exonerados y luego reciben sorpresas en la declaración anual. Siempre consultá con un contador especializado.',
  },
  {
    id: 'caja-profesional',
    title: 'Caja Profesional: costos crecientes y situación compleja',
    content:
      'La Caja Profesional está en una situación financiera compleja. Los costos vienen aumentando por encima de la inflación. Muchos developers jóvenes intentan evitar la Caja usando figuras como SAS + BPS o buscando formas de no encajar en las categorías obligatorias. Sin embargo, si tenés título universitario y ejerces actividades comprendidas, la Caja es obligatoria. Evaluá bien si el costo extra (22.5% vs 12.5% de BPS) se justifica con la optimización fiscal general.',
  },
  {
    id: 'costos-ocultos-sas',
    title: 'Costos ocultos de una SAS',
    content:
      'Además de los costos mensuales (contador, mutualista, facturación), una SAS tiene costos ocultos: certificado digital (~$2,000 UYU/año), facturación electrónica obligatoria, libros societarios (Diario, Inventario, Actas), firmas de escribano para aumentos de capital o cambios de objeto, gastos administrativos DGI, y el costo de oportunidad de la complejidad administrativa. Estos costos fijos hacen que la SAS no sea rentable para ingresos bajos.',
  },
];

// ============================================
// GUIDE INTRO CONTENT
// ============================================

export const guideIntroContent =
  'Un contractor IT es un profesional independiente que presta servicios de tecnología a empresas del exterior (mayormente USA/EU).\n\n'
  + 'A diferencia de un empleado en relación de dependencia, el contractor:\n'
  + '• No tiene vínculo de dependencia (es freelance)\n'
  + '• Factura por servicios prestados\n'
  + '• Maneja sus propios horarios y herramientas\n'
  + '• Es responsable de sus aportes sociales\n\n'
  + 'En Uruguay puede trabajar bajo:\n'
  + '• Régimen Unipersonal (más común)\n'
  + '• SAS (Sociedad Anónima Simplificada)\n\n'
  + 'Su ingreso viene de exportación de servicios → 0% IVA';

export const guideIntroSource = 'BPS - Trabajadores no dependientes';

// ============================================
// GUIDE SECTIONS (for existing flat content)
// ============================================

export const guideSections: GuideSection[] = [
  {
    id: 'bps',
    title: 'BPS (Banco de Previsión Social)',
    category: 'impuestos',
    content:
      'Aportes obligatorios para trabajadores independientes.\n\n'
      + 'Valores 2026:\n'
      + '• BPC: $6,864 UYU\n'
      + '• Tope BPS: 15 BPC = $102,960/mes\n'
      + '• Base imponible: 70% del ingreso bruto\n\n'
      + 'Tasas según régimen:\n'
      + '• Unipersonal: 15% jubilación + FONASA variable\n'
      + '• SAS con caja: 22.5% (Caja Profesional)\n'
      + '• SAS sin caja: 12.5% (BPS Común)\n\n'
      + 'Importante:\n'
      + '• Si el 70% del ingreso supera 15 BPC, se topea en $102,960\n'
      + '• La base es la misma para BPS, FONASA e IRPF',
    source: 'BPS - Valores actuales 2026',
  },
  {
    id: 'fonasa',
    title: 'FONASA (Fondo Nacional de Salud)',
    category: 'impuestos',
    content:
      'Sistema de salud que varía según ingresos y familia.\n\n'
      + 'Se aplica sobre la base imponible (70% del ingreso bruto).\n\n'
      + 'Tasas 2026:\n'
      + 'Ingreso base ≤ 2.5 BPC ($17,160):\n'
      + '  • Base FONASA: 8%\n'
      + '  • Cónyuge: 0%\n'
      + '  • Hijos: 0% (no aplica)\n\n'
      + 'Ingreso base > 2.5 BPC:\n'
      + '  • Base FONASA: 9.5%\n'
      + '  • Cónyuge: +2%\n'
      + '  • Cada hijo: +1.5%\n\n'
      + 'Ejemplos Unipersonal (15% jub + FONASA):\n'
      + '• $100,000/mes + cónyuge → 15% + 9.5% + 2% = 26.5%\n'
      + '• $120,000/mes + cónyuge + 2 hijos → 15% + 9.5% + 2% + 3% = 29.5%\n\n'
      + 'Nota: Los suplementos familiares aumentan el costo pero no reducen el IRPF.',
    source: 'BPS - Tasas FONASA 2026',
  },
  {
    id: 'irpf',
    title: 'IRPF — 8 Tramos Progresivos',
    category: 'impuestos',
    content:
      'Impuesto sobre la Renta de las Personas Físicas. Sistema MARGINAL.\n\n'
      + 'Tramos 2026 (BPC = $6,864 UYU):\n'
      + '1. 0 - 48,048 UYU → 0% IRPF\n'
      + '2. 48,048 - 68,640 UYU → 10%\n'
      + '3. 68,640 - 102,960 UYU → 15%\n'
      + '4. 102,960 - 205,920 UYU → 24%\n'
      + '5. 205,920 - 343,200 UYU → 25%\n'
      + '6. 343,200 - 514,800 UYU → 27%\n'
      + '7. 514,800 - 789,360 UYU → 31%\n'
      + '8. > 789,360 UYU → 36%\n\n'
      + 'Cálculo MARGINAL: cada tasa aplica solo sobre esa porción.\n\n'
      + 'Deducciones IRPF:\n'
      + '• Por hijo: $11,440 UYU/mes (20 BPC/año)\n'
      + '• Hijo con discapacidad: $22,880 UYU/mes (40 BPC/año)\n'
      + '• FONASA, BPS, Fondo Solidaridad, Caja Profesional\n'
      + '• (+6% incremento si ingreso > 10 BPC)',
    source: 'DGI - IRPF escalas 2026 | DGI - Deducciones',
  },
  {
    id: 'iva',
    title: 'IVA (Impuesto al Valor Agregado)',
    category: 'impuestos',
    content:
      'Tasa 0% para exportación de servicios (exterior). Tasa 22% para servicios locales.\n\n'
      + 'Contractors IT generalmente facturan al exterior → 0% IVA.\n\n'
      + 'Servicios al exterior:\n'
      + '• 0% IVA (exportación)\n'
      + '• Podés solicitar exoneración de IVA\n'
      + '• No necesitás factura electrónica (rubricado basta)\n\n'
      + 'Servicios locales (URUGUAYOS):\n'
      + '• 22% IVA sobre el ingreso bruto\n'
      + '• Requiere facturación electrónica (DGI)\n'
      + '• Podés darte de baja en el rubricado si no tenés otros ingresos gravados\n\n'
      + 'Si facturás AMBOS tipos:\n'
      + '• Llevá contador\n'
      + '• IVA separado por cada tipo de cliente',
    source: 'DGI - IVA Servicios Personales',
  },
  {
    id: 'family',
    title: 'Situación Familiar',
    category: 'impuestos',
    content:
      'El simulador calcula automáticamente según tu familia.\n\n'
      + 'BPS + FONASA (aumenta costo):\n'
      + '• Cónyuge a cargo: +2% FONASA\n'
      + '• Cada hijo: +1.5% FONASA (solo si base > 2.5 BPC)\n'
      + '• Hijo con discapacidad: mismo % que hijo normal\n\n'
      + 'IRPF (reduce impuesto - deducción):\n'
      + '• Por hijo: $11,440 UYU/mes deducible\n'
      + '• Hijo con discapacidad: $22,880 UYU/mes\n'
      + '• Aplican al cálculo del IRPF\n\n'
      + 'Cómo ingresarlo en el simulador:\n'
      + '1. Tildar "Cónyuge a cargo"\n'
      + '2. Tildar "Hijos a cargo" e ingresar cantidad\n'
      + '3. Ingresar año de graduación universitaria',
    source: 'BPS + DGI - Deducciones familiares',
  },
  {
    id: 'fondo-solidaridad',
    title: 'Fondo de Solidaridad',
    category: 'impuestos',
    content:
      'Aporte obligatorio para egresados de universidades públicas (UdelaR, UTEC, UTU).\n\n'
      + '¿Cuándo aplica? (AMBAS condiciones):\n'
      + '1. Egresado hace 5+ años (año de graduación ingresado en Situación Familiar)\n'
      + '2. Ingreso mensual > 8 BPC ($54,912 UYU)\n\n'
      + 'Monto mensual según nivel de ingreso:\n'
      + '• 8 – 15 BPC: 0.5 BPC/mes + $476 adicional\n'
      + '• 15 – 30 BPC: 1 BPC/mes + $476 adicional\n'
      + '• 30+ BPC: 2 BPC/mes + $476 adicional\n\n'
      + 'Socios de SAS NO pagan Fondo de Solidaridad.',
    source: 'Fondo de Solidaridad - Ley 18.829',
  },
  {
    id: 'bpc',
    title: 'BPC (Base de Prestaciones y Cotizaciones)',
    category: 'impuestos',
    content:
      'El BPC (Base de Prestaciones y Cotizaciones) es la unidad indexadora del sistema tributario uruguayo. Pensalo como el "IPC de los impuestos" — casi todos los montos, topes y tramos del sistema se definen en BPC, no en pesos.\n\n'
      + 'Dónde aparece el BPC:\n'
      + '• BPS: tope máximo de aporte = 15 BPC\n'
      + '• IRPF: los 8 tramos del impuesto se definen en BPC (7, 10, 15, 30, 50, 75, 115)\n'
      + '• FONASA: el salto de tasa 8% → 9.5% ocurre cuando la base supera 2.5 BPC\n'
      + '• Fondo de Solidaridad: aplica solo si ingresos > 8 BPC\n'
      + '• Deducciones por hijos: 20 BPC/año por hijo, 40 BPC/año por hijo con discapacidad\n\n'
      + 'Valor 2026: $6,864 UYU (actualizado anualmente por BPS)\n\n'
      + 'Por qué es importante:\n'
      + '• Si el BPC sube, los topes y tramos se mueven solos — no necesitás nueva ley\n'
      + '• Dos personas con el mismo ingreso en dólares pueden pagar distinto IRPF según el BPC del año\n'
      + '• Cambiar el BPC en el simulador te permite proyectar escenarios futuros (ej: si BPC sube a $8,000)\n\n'
      + 'En el simulador:\n'
      + '• Podés ingresar un valor BPC personalizado en el campo "BPC ($)"\n'
      + '• Si lo dejás vacío, usa el default de 2026 ($6,864)\n'
      + '• Al cambiarlo, se recalculan: IRPF, BPS/FONASA, Fondo de Solidaridad\n'
      + '• Ideal para ver "qué pasa si el BPC sube un 20% el año que viene"',
    source: 'BPS - Valores 2026 | Ley 18.829',
  },
  {
    id: 'valores',
    title: 'Valor BPC 2026',
    category: 'impuestos',
    content:
      'Valores oficiales BPS vigentes 2026:\n\n'
      + '• BPC: $6,864 UYU\n'
      + '• Salario mínimo: $24,572.00\n'
      + '• Tope BPS: 15 BPC = $102,960 UYU (base máxima mensual)\n\n'
      + 'Cálculo de base imponible:\n'
      + '• Base = 70% del ingreso bruto\n'
      + '• Ejemplo: $100,000 UYU → base = $70,000 UYU\n\n'
      + 'Tramos IRPF (en BPC):\n'
      + '• 7 BPC = $48,048 (exento)\n'
      + '• 10 BPC = $68,640\n'
      + '• 15 BPC = $102,960\n'
      + '• 30 BPC = $205,920\n'
      + '• 50 BPC = $343,200\n'
      + '• 75 BPC = $514,800\n'
      + '• 115 BPC = $789,360',
    source: 'BPS - Valores 2026',
  },
  {
    id: 'simulacion',
    title: 'Simulación de Ingresos',
    category: 'simulacion',
    content:
      'Calcula tu ingreso neto después de impuestos.\n\n'
      + 'Ingresá:\n'
      + '• Ingreso bruto (USD o UYU)\n'
      + '• Tipo de cambio\n'
      + '• Cliente: Exterior (0% IVA) o Local (22% IVA)\n'
      + '• Régimen: Unipersonal / SAS con Caja / SAS sin Caja\n'
      + '• Situación familiar: cónyuge, hijos, año graduación\n'
      + '• Servicios: Contador, Escribana, Facturación\n'
      + '• Exoneración IRAE (SAS): Sin / Parcial 50% / Total 100%\n\n'
      + 'El simulador muestra:\n'
      + '• Ingreso neto (USD y UYU)\n'
      + '• Desglose: BPS+FONASA, IRPF, IRAE, Caja, IVA\n'
      + '• Fondo de Solidaridad si aplica\n'
      + '• Deducciones por hijos\n'
      + '• Tasa efectiva total\n'
      + '• Exoneración IRAE aplicada (SAS)\n\n'
      + 'Hacé click en "Comparar" para ver qué régimen te conviene más.',
    source: 'Simulador Contractor UY',
  },
  {
    id: 'reverse',
    title: 'Simulación Inversa',
    category: 'simulacion',
    content:
      '¿Cuánto necesitás facturar para llevarte un neto específico?\n\n'
      + 'Ingresá:\n'
      + '• Ingreso neto que querés obtener (en USD)\n'
      + '• Régimen a calcular\n'
      + '• Servicios que vas a usar (contador, facturación)\n\n'
      + 'El simulador itera para encontrar el bruto necesario.\n\n'
      + 'El resultado muestra:\n'
      + '• Ingreso bruto requerido (USD y UYU)\n'
      + '• Desglose completo (igual que simulación normal)\n'
      + '• BPS+FONASA con tasas aplicadas\n'
      + '• IRPF con tramo detectado\n'
      + '• Fondo Solidaridad si aplica\n\n'
      + 'Nota: El valor es estimado. El neto real puede variar ±5% según deducciones exactas.',
    source: 'Calculadora inversa',
  },
  {
    id: 'compare',
    title: 'Comparación (Versus)',
    category: 'simulacion',
    content:
      'Compara automáticamente los 3 regímenes con los mismos ingresos brutos.\n\n'
      + 'Regímenes comparados:\n'
      + '1. UNIPERSONAL: BPS 15% + FONASA 8-13% + IRPF progresivo\n'
      + '2. SAS CON CAJA: Caja 22.5% + IRAE 25% (sin FONASA, sin IRPF)\n'
      + '3. SAS SIN CAJA: BPS 12.5% + IRAE 25% (sin IRPF)\n\n'
      + 'Usá el botón "Comparar" en la simulación para ver cuál te conviene más.',
    source: 'Comandos del simulador',
  },
];
