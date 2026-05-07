# Objetivos del Proyecto - Simulador de Ingresos Contractors IT Uruguay

## Visión General

Crear una herramienta web que permita a los **contractors IT en Uruguay** simular sus ingresos netos y comparar regímenes impositivos de forma simple, rápida y visualmente atractiva.

---

## Objetivos Principales

### 1. Simulación Precisa de Ingresos Netos
- Calcular ingreso neto mensual basado en ingreso bruto (USD) y tipo de cambio
- Soportar múltiples regímenes impositivos:
  - **Unipersonal**: IRPF + BPS/FONASA (22.5%)
  - **SAS con Caja Profesional**: IRAE 25% + Caja ~22.5%
  - **SAS sin Caja**: IRAE 25% + BPS común ~12.5%
- Considerar impuestos: BPS/FONASA, IRPF, IRAE, IVA (0% exterior / 22% local), Caja Profesional
- Soportar **simulación inversa** (neto deseado → bruto necesario)

### 2. Comparador de Regímenes
- Permitir al usuario comparar los 3 regímenes lado a lado
- Identificar automáticamente la **MEJOR OPCIÓN** (mayor ingreso neto)
- Basarse en los mismos ingresos brutos para una comparación justa
- Mostrar comparación en **modal visual**

### 3. Servicios Deducibles y Gastos
- Incluir servicios opcionales editables:
  - Contador ($5.000 UYU)
  - Escribana ($8.000 UYU) - necesario para constitución SAS
  - Facturación ($3.000 UYU)
- En Unipersonal: se restan después de impuestos
- En SAS: son gastos deducibles que reducen la base del IRAE
- Permitir cambiar la moneda (USD/UYU) de cada servicio

### 4. Guía Informativa Completa
- Valores oficiales 2026 de BPS, DGI y Fondo de Solidaridad
- Explicación detallada de cada régimen impositivo
- Información sobre deducciones admitidas (IRPF, FONASA, hijos, etc.)
- Guía de decisión para elegir el régimen adecuado
- Diseño atractivo con iconos y secciones expandibles

### 5. Página "Acerca" Atractiva
- Presentación del proyecto y misión
- Features destacadas
- Disclaimer legal
- Créditos y links a redes sociales

### 6. Experiencia de Usuario Premium
- Diseño **responsivo** (mobile, tablet, desktop)
- **Modo oscuro por defecto**
- Footer fijo con navegación rápida
- Comparación de regímenes en modal
- Animaciones suaves y transiciones
- Estilo visual consistente (Tailwind CSS v4)

---

## Características Implementadas ✅

- ✅ Simulación Normal (Bruto → Neto)
- ✅ Simulación Inversa (Neto → Bruto)
- ✅ 3 Regímenes: Unipersonal, SAS con Caja, SAS sin Caja
- ✅ Comparador visual con identificación de mejor opción
- ✅ Servicios editables con selector de moneda
- ✅ Guía con 9 secciones e iconos
- ✅ Página About atractiva
- ✅ Footer con navegación
- ✅ Modo oscuro por defecto
- ✅ Diseño responsivo

---

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: Tailwind CSS v4
- **Arquitectura**: Strategy Pattern para cálculo de impuestos
- **Estado**: React useState

---

## Métricas de Éxito

- Precisión de cálculos: ±10% (estimada)
- Compatibilidad: Todos los navegadores modernos
- Responsive: Mobile, Tablet, Desktop
- Accesibilidad: Soporte para keyboard navigation

---

## Limitaciones Conocidas

- No considera deducciones complejas (alquileres, hardware)
- No soporta múltiples fuentes de ingreso simultáneas
- No incluye IRPF anual completo (usa simplificación bimestral)
- Los valores son de Mayo 2026 (pueden cambiar)

---

*Versión Beta - Mayo 2026*