# Design: Actualización Impuestos y Estructuras IT Uruguay 2026

## Technical Approach

Content+UI change: extract guide data into typed module, create reusable comparison table, append table to existing card layout, patch Results with effective tax rate and SVG icons, minimal calculator cleanup. No state changes, no data flow rewrites, no architectural overhaul.

## Architecture Decisions

### Decision: guideData.ts — typed structure data separate from rendering

| Option | Tradeoff |
|--------|----------|
| Keep data in Guide.tsx | Tight coupling, hard to test, harder to maintain 7-dimension × 3-structure content |
| **Extract to `src/data/guideData.ts`** | Data decoupled from rendering; testable (pure data); same pattern as existing inline data |

**Choice**: Extract. Create typed structures `StructureData` (7-dimension breakdown per regime), `StructureDimension` (comparison rows across 3 regimes), and `IncomeRecommendation` (income-level regime advice).

### Decision: StructureComparisonTable — generic prop-driven table

| Option | Tradeoff |
|--------|----------|
| Hardcode tables in Guide.tsx + RegimeComparison.tsx | Duplicate rendering logic |
| **Generic `<table>` component** | Single source of truth, reuses with different row configs |

**Choice**: Props interface `ComparisonTableRow[]` — each row has label + values per regime. Consumer passes rows + column config. Pure presentational, no state.

### Decision: Effective tax rate — computed in calculator

| Option | Tradeoff |
|--------|----------|
| Compute in Results.tsx | Not available in comparison modal or exports; harder to test |
| **Add `effectiveTaxRate?: number` to `TaxCalculationResult`** | Available everywhere; testable alongside other calc logic |

**Choice**: Compute `totalTaxes / grossUyu * 100` in each `calculateNet*` function, store as optional field on the result.

### Decision: RegimeComparison — cards stay, table appended below

| Option | Tradeoff |
|--------|----------|
| Replace cards with table | Lose visual "best option" highlight; cards are better for numeric compare |
| Keep cards + append table | Both quantitative (cards) and qualitative (table) views; table acts as footer |

**Choice**: Cards remain primary. `StructureComparisonTable` rendered below the cards grid inside the same component.

### Decision: Emoji → SVG cleanup

| Option | Tradeoff |
|--------|----------|
| Keep emoji in Guide headers + Results chevrons | Violates project standard |
| **Replace with inline SVGs** | Consistent with rest of app |

**Choice**: Guide category header emojis → SVG icons. Results ▶▼ → `<svg>` chevrons. Guide header text emoji (📖, 💡, ⚠️) kept — those are content, not icons per project convention.

## Data Flow

```
Guide.tsx
  └─→ reads structured data from guideData.ts
  └─→ renders StructureComparisonTable for cross-regime comparison

RegimeComparison.tsx (shown in comparison modal)
  └─ receives TaxCalculationResult[] from App.tsx
  └─ renders 3 result cards
  └─ renders StructureComparisonTable below cards
       └─ table rows are static content (not calculation-derived)

Results.tsx
  └─ reads effectiveTaxRate from TaxCalculationResult (computed in calculator)
  └─ displays as new row in tax breakdown section

taxCalculator.ts
  └─ computeEffectiveTaxRate() → added to each calculateNet* return value
  └─ BFC comment removed (unused constant)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/data/guideData.ts` | Create | Typed data: 7 dimensions × 3 structures, income-level recommendations |
| `src/components/StructureComparisonTable.tsx` | Create | Reusable `<table>` component, dark-mode aware, prop-driven rows |
| `src/views/Guide.tsx` | Modify | Use guideData.ts for content; add comparison table + recommendations section; replace emoji header icons with SVGs |
| `src/components/RegimeComparison.tsx` | Modify | Import and render `StructureComparisonTable` below existing card grid |
| `src/components/Results.tsx` | Modify | Add effective tax rate row; replace ▶▼ with SVG chevrons |
| `src/utils/taxCalculator.ts` | Modify | Add `effectiveTaxRate` to `TaxCalculationResult`; remove BFC comment at line 133 |
| `src/utils/taxCalculator.test.ts` | Modify | Add test verifying effectiveTaxRate computation across regimes |

< 800 chars — compact.

## Interfaces / Contracts

```typescript
// guideData.ts
export interface StructureData {
  regime: TaxRegime;
  name: string;
  description: string;
  /** 7 decision dimensions keyed by id */
  dimensions: {
    tributacion: string;
    costos: string;
    salud: string;
    jubilacion: string;
    riesgo: string;
    escalabilidad: string;
    optimizacionFiscal: string;
  };
  pros: string[];
  cons: string[];
}

/** Row config for StructureComparisonTable */
export interface ComparisonTableRow {
  id: string;
  label: string;
  /** One value per regime column, in display order */
  values: [string, string, string];
}

export interface IncomeRecommendation {
  rangeLabel: string;           // e.g. "Bajo (< $3,000 USD)"
  minUsd: number;
  maxUsd: number | null;
  recommended: TaxRegime;
  runnerUp: TaxRegime | null;
  note: string;
}

// StructureComparisonTable props
interface StructureComparisonTableProps {
  rows: ComparisonTableRow[];
  columns: { key: TaxRegime; label: string }[];
  darkMode: boolean;
}

// TaxCalculationResult addition (taxCalculator.ts)
export interface TaxCalculationResult {
  // ...existing fields...
  effectiveTaxRate?: number;    // NEW: total taxes / grossUyu * 100
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `effectiveTaxRate` computed correctly per regime | Add to existing `describe('calculateNet')` — verify rate is in expected range for known inputs |
| Unit | `guideData.ts` exports valid data | Minimal: structure data has all 7 dimensions, all 3 regimes present |
| Visual | SVG icons render (no broken paths) | Manual — no component tests in current project |
| Regression | Existing 770-line test suite still passes | Run `npx vitest run` after every change |

No new test infrastructure needed — all tests are Vitest, same as existing.

## Migration / Rollout

No migration required. All changes are UI+data — no user state, no persisted data, no feature flags.

## Implementation Order

Order respects dependencies: calculator cleanup (no deps) → data layer (depends on types) → leaf components (depends on data + types) → view + parent components.

1. **taxCalculator.ts**: Add `effectiveTaxRate` to result, remove BFC comment
2. **taxCalculator.test.ts**: Verify effectiveTaxRate computation
3. **guideData.ts**: Define types, export all structure data
4. **StructureComparisonTable.tsx**: Build reusable table component
5. **Guide.tsx**: Rewrite — 3 structure sections, comparison table, recommendations, emoji→SVG for headers
6. **RegimeComparison.tsx**: Import and render StructureComparisonTable below cards
7. **Results.tsx**: Add effective tax rate row, replace ▶▼ with SVG chevrons

## Open Questions

- None. All decisions are straightforward content+UI changes with clear patterns to follow.
