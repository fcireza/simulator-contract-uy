# Tasks: Actualización Impuestos y Estructuras IT Uruguay 2026

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~430-480 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | single-pr |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

## Phase 1: Foundation — Data & Calculator

- [x] 1.1 Create `src/data/guideData.ts` with `StructureData`, `ComparisonTableRow`, `IncomeRecommendation` types and all 3×7 structure dimension data (~130 lines)
- [x] 1.2 Add `effectiveTaxRate` field to `TaxCalculationResult`, compute in each `calculateNet*`, remove BFC comment in `taxCalculator.ts` (~8 lines)
- [x] 1.3 Add tests verifying `effectiveTaxRate` per regime in `taxCalculator.test.ts` (~35 lines)

## Phase 2: Components — Reusable Table

- [x] 2.1 Create `src/components/StructureComparisonTable.tsx` — prop-driven `<table>` with dark mode, accepts `ComparisonTableRow[]` + column config (~90 lines)
- [x] 2.2 Enhance `RegimeComparison.tsx`: import and render `StructureComparisonTable` below 3-card grid (~50 lines)

## Phase 3: UI — Guide & Results

- [x] 3.1 Rewrite `Guide.tsx`: import `guideData.ts`, render 3 collapsible structure sections (7 dims each), comparative table, industry recommendations, 3 caveats; replace emoji with SVGs (~180 lines)
- [x] 3.2 Enhance `Results.tsx`: add "Tasa Efectiva" row `(totalTaxes/gross)*100`, replace ▶▼ with inline SVG chevrons (~40 lines)

## Phase 4: Integration

- [x] 4.1 Wire `StructureComparisonTable` into `RegimeComparison` with correct props, verify dark mode propagation (~5 lines)
- [x] 4.2 Run `npx vitest run`, verify all existing tests pass with zero regressions (0 lines)
- [x] 4.3 Manual: visual check of Guide sections, comparison table, effective tax rate, SVG icons (~0 lines)
