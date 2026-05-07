# Proposal: Simulador de Ingresos para Contractors IT en Uruguay

## Intent

Proveer una herramienta web simple y rápida para que trabajadores independientes de IT en Uruguay estimen sus ingresos netos considerando obligaciones fiscales locales (BPS, FONASA, IRPF). El objetivo es eliminar la incertidumbre al negociar contratos con el exterior o locales.

## Scope

### In Scope
- Simulación de ingresos mensuales en USD con tipo de cambio configurable
- Cálculo automático de BPS (20-25% sobre base imponible del 70%)
- Cálculo de FONASA (incluido en aportes)
- Cálculo de IRPF estimado con tramos simplificados
- Visualización de ingreso neto en UYU y USD
- Simulación inversa (ingreso neto deseado → bruto necesario)
- Interfaz con Tailwind v4 + Magic UI
- Soporte para clientes locales (IVA 22%) y del exterior (IVA 0%)

### Out of Scope
- Integraciones con sistemas gubernamentales (DGI, BPS)
- Facturación electrónica real
- Persistencia de simulaciones (queda para v1.1)
- IRPF por franjas reales completas (MVP usa simplificado)
- Comparación de regímenes (Unipersonal vs SAS vs otros)

## Capabilities

### New Capabilities
- `income-simulation`: Cálculo de ingresos netos con impuestos Uruguay
- `reverse-simulation`: Cálculo inverso para determinar ingreso bruto necesario
- `tax-calculator`: Lógica de negocio para BPS, FONASA, IRPF e IVA
- `simulator-ui`: Interfaz de usuario con inputs, visualización y desglose

### Modified Capabilities
- None (proyecto nuevo, no hay specs previas)

## Approach

Frontend Vite + React + TypeScript con:
- **Cálculos**: Funciones puras en TypeScript para cada impuesto
- **UI**: Componentes con Tailwind v4 + Magic UI (cards, inputs, modals)
- **State**: React local state (useState/useReducer) para MVP
- **Arquitectura**: Separación clara: `utils/taxCalculator.ts` + componentes UI
- **Sin backend** en MVP: todo se procesa en cliente

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/utils/taxCalculator.ts` | New | Lógica de cálculo de impuestos Uruguay |
| `src/components/` | New | Componentes UI del simulador |
| `src/App.tsx` | New | Entrada principal de la app |
| `index.html` | New | HTML base de Vite |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Precisión ±10% insuficiente para usuarios | Med | Documentar supuestos claramente en UI |
| Cambios en tasas fiscales Uruguay | High | Configuración flexible, fácil actualizar constantes |
| UX confusa para no expertos fiscales | Med | Usar Magic UI, tooltips explicativos |

## Rollback Plan

1. Hacer backup de archivos existentes (si los hay) antes de empezar
2. Si algo falla: `git reset --hard` al commit anterior
3. Los cálculos son puramente frontend, no hay migraciones ni datos que resguardar

## Dependencies

- Vite + React + TypeScript (asumido del sdd-init previo)
- Tailwind v4
- Magic UI (componentes prediseñados)
- Node.js/npm para desarrollo

## Success Criteria

- [ ] Usuario puede ingresar ingreso mensual USD, tipo de cambio y tipo de cliente
- [ ] El sistema calcula y muestra BPS, FONASA, IRPF, neto UYU y USD
- [ ] Funciona simulación inversa
- [ ] UI es clara, responsive y usa Tailwind v4 + Magic UI
- [ ] Tiempo de respuesta < 1 segundo
- [ ] Cálculos tienen precisión aceptable (dentro del ±10% estimado)
