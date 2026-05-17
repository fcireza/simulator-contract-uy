# Design: Simulador de Ingresos para Contractors IT en Uruguay

## Technical Approach

Scaffold a Vite + React + TypeScript project from scratch, configure Tailwind v4 with Magic UI components, implement tax calculation logic as pure functions, and build a clean UI with input form, results display, and reverse simulation toggle.

## Architecture Decisions

### Decision: Project Scaffolding
**Choice**: Vite + React + TypeScript template
**Alternatives considered**: Next.js (overkill for MVP client-only simulator), CRA (deprecated)
**Rationale**: Vite offers fast HMR, React 19 support, and minimal setup for a client-only MVP. No SSR needed.

### Decision: Styling Stack
**Choice**: Tailwind v4 + Magic UI
**Alternatives considered**: CSS Modules, styled-components, shadcn/ui
**Rationale**: Tailwind v4 for utility-first rapid development. Magic UI provides polished interactive components out-of-the-box.

### Decision: State Management
**Choice**: React useState + useReducer (local state)
**Alternatives considered**: Zustand, Redux, Context API
**Rationale**: MVP has simple state (inputs + results). No need for external libraries. Local state is sufficient.

### Decision: Tax Calculation
**Choice**: Pure TypeScript functions in `src/utils/taxCalculator.ts`
**Alternatives considered**: Class-based calculator, separate npm package
**Rationale**: Pure functions are testable, simple, and fit the MVP scope. No side effects.

### Decision: No Backend for MVP
**Choice**: Client-side only calculations
**Alternatives considered**: Node.js/NestJS API, Serverless functions
**Rationale**: MVP scope explicitly excludes backend. All calculations are mathematical, no sensitive data.

## Data Flow

```
User Input (USD, exchange rate, client type)
          │
          ▼
┌─────────────────────┐
│  Tax Calculator     │ ← Pure functions
│  (taxCalculator.ts)│
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  React State        │ ← useState/useReducer
│  (App.tsx)         │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Results Display    │ ← Magic UI Cards
│  (Components)      │
└─────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Create | Vite + React + TypeScript deps |
| `vite.config.ts` | Create | Vite configuration |
| `tsconfig.json` | Create | TypeScript strict config |
| `tsconfig.app.json` | Create | App-specific TS config |
| `tsconfig.node.json` | Create | Node-specific TS config |
| `tailwind.config.js` | Create | Tailwind v4 config with Magic UI |
| `postcss.config.js` | Create | PostCSS config for Tailwind |
| `index.html` | Create | Entry HTML with React mount |
| `src/main.tsx` | Create | React entry point |
| `src/App.tsx` | Create | Main app with state + layout |
| `src/index.css` | Create | Tailwind directives + custom styles |
| `src/utils/taxCalculator.ts` | Create | Pure tax calculation functions |
| `src/components/Inputs.tsx` | Create | Input form with Magic UI |
| `src/components/Results.tsx` | Create | Results display card |
| `src/components/ReverseSim.tsx` | Create | Reverse simulation form |
| `src/types/index.ts` | Create | TypeScript interfaces |

## Interfaces / Contracts

```typescript
// src/types/index.ts

export interface SimulatorInputs {
  incomeUsd: number;
  exchangeRate: number;
  clientType: 'local' | 'exterior';
  useAccountant: boolean;
  useEscribana: boolean;
}

export interface TaxCalculationResult {
  incomeUyu: number;
  bpsFonasa: number;
  irpf: number;
  vat: number;
  netUyu: number;
  netUsd: number;
}

export interface SimulatorState {
  inputs: SimulatorInputs;
  result: TaxCalculationResult | null;
  mode: 'normal' | 'reverse';
  reverseTarget: number; // Desired net in USD
}
```

```typescript
// src/utils/taxCalculator.ts

export function calculateBPSFonasa(grossUyu: number): number;
// Returns 22.5% of taxable base (70% of gross)

export function calculateIRPF(taxableIncome: number): number;
// Simplified progressive brackets for MVP

export function calculateVAT(incomeUyu: number, clientType: 'local' | 'exterior'): number;
// 0% for exterior, 22% for local

export function calculateNet(inputs: SimulatorInputs): TaxCalculationResult;
// Full calculation pipeline

export function reverseCalculate(targetNetUsd: number, exchangeRate: number, clientType: 'local' | 'exterior'): number;
// Returns required gross USD to achieve target net
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Tax calculation functions | Vitest (if available) or manual verification |
| Integration | Input → Calculation → Display | Manual testing in browser |
| E2E | Full user flow | Manual (no E2E framework in MVP) |

Note: Testing capabilities not detected in sdd-init. MVP relies on manual verification.

## Migration / Rollout

No migration required. Fresh project scaffold.

## Open Questions

- [ ] Exact IRPF brackets for Uruguay 2026 — need to confirm current rates
- [ ] Magic UI installation approach for Vite + React (standard npm package?)
- [ ] Whether to use React 19 features (use() hook, etc.) or stay conservative

## Next Steps

Proceed to sdd-tasks to break down into implementable tasks.
