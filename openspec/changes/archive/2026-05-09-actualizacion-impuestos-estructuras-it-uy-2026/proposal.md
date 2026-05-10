# Proposal: Actualización Impuestos y Estructuras IT Uruguay 2026

## Intent

Update guide, comparison, and results UI to reflect 2026 regulations with comprehensive 3-structure breakdown (Unipersonal, SAS+Caja Profesional, SAS+BPS/Fonasa). Current Guide.tsx lacks depth on per-structure tradeoffs and income-level recommendations.

## Scope

### In Scope
- Rewrite Guide.tsx: deep sections per structure (7 dimensions: tributación, costos, salud, jubilación, riesgo, escalabilidad, optimización fiscal)
- Add comparative table across 3 structures + income-level recommendations
- Enhance RegimeComparison.tsx with row-based qualitative table (below existing cards)
- Improve Results.tsx: add effective tax rate, replace ▶▼ emoji with SVG chevrons
- Minor taxCalculator.ts cleanup: remove unused BFC const, verify Caja Profesional logic
- New `guideData.ts` for structured per-structure data
- New `StructureComparisonTable.tsx` reusable component
- Update taxCalculator.test.ts for any logic changes

### Out of Scope
- ReverseSim.tsx duplication refactor (separate change)
- Inputs.tsx regime type mismatch (minor, existing App.tsx workaround works)
- Full redesign of RegimeComparison cards — only adding table

## Capabilities

### New Capabilities
- `structure-guide`: Per-structure breakdown with 7 decision dimensions + income-level recommendations
- `structure-comparison`: Row-based qualitative + quantitative comparison table

### Modified Capabilities
- None — no existing specs to modify

## Approach

1. **Extract data**: Create `guideData.ts` with typed, testable structure data
2. **Rewrite Guide.tsx**: Replace flat sections with 3 deep structure sections + comparative table + recommendations
3. **New component**: `StructureComparisonTable.tsx` — row-based qualitative table
4. **Enhance RegimeComparison.tsx**: Append comparison table below existing cards
5. **Patch Results.tsx**: Add effective tax rate row, replace ▶▼ with SVG `<path>` chevrons
6. **Cleanup taxCalculator.ts**: Remove unused `BFC` const, verify Caja Profesional calc
7. **Update tests**: Cover cleanup changes, no regression

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/views/Guide.tsx` | Modified | Rewrite with 3 deep structure sections + tables |
| `src/components/RegimeComparison.tsx` | Modified | Add qualitative table below 3 cards |
| `src/components/Results.tsx` | Modified | Add effective tax rate, SVG icons |
| `src/utils/taxCalculator.ts` | Modified | Remove unused BFC, minor cleanup |
| `src/data/guideData.ts` | New | Typed structure dimensions data |
| `src/components/StructureComparisonTable.tsx` | New | Reusable row-based comparison table |
| `src/utils/taxCalculator.test.ts` | Modified | Update for cleanup verification |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Guide rewrite breaks layout | Low | Keep accordion structure, only change content + add tables |
| Calculator refactor breaks tests | Low | Run full test suite, verify round-trip results unchanged |
| Content inaccuracy | Med | Base on official BPS/DGI 2026 values already validated in exploration |

## Rollback Plan

`git revert` on Guide.tsx, RegimeComparison.tsx, Results.tsx, taxCalculator.ts. Delete new files (`guideData.ts`, `StructureComparisonTable.tsx`). BFC removal is trivially safe (unused const).

## Dependencies

None — all changes are self-contained within the repo.

## Success Criteria

- [ ] Guide.tsx renders 3 structure sections with 7 dimensions each
- [ ] Comparative table shows qualitative rows + income-level recommendations
- [ ] Results.tsx shows effective tax rate with inline SVG icons (no emoji)
- [ ] RegimeComparison.tsx shows card layout + appended table layout
- [ ] All existing tests pass with zero regressions
- [ ] No emoji used as icons — all inline SVGs per project standards
