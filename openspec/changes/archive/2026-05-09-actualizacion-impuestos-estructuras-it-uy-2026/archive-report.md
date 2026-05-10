# Archive Report: Actualización Impuestos y Estructuras IT Uruguay 2026

**Change**: `actualizacion-impuestos-estructuras-it-uy-2026`
**Archived**: 2026-05-09
**Mode**: `hybrid` (Engram + openspec)
**Verdict**: PASS WITH WARNINGS

---

## SDD Cycle Summary

All SDD phases completed successfully:
- **Explore**: Codebase exploration, 2026 tax regulation validation
- **Proposal**: Intent, scope, approach, risks, rollback plan
- **Spec**: 2 delta specs (structure-guide, structure-comparison) with 17 scenarios
- **Design**: 5 architecture decisions, implementation order, testing strategy
- **Tasks**: 10 tasks across 4 phases, ~430-480 changed lines, medium budget risk, single-pr with size:exception
- **Apply**: All 10 tasks complete, 7 files changed (2 new, 5 modified)
- **Verify**: Build ✅, TypeScript 0 errors ✅, 74/74 tests pass ✅, 17/17 spec scenarios compliant ✅

---

## Specs Synced to Main

| Domain | Action | Requirements |
|--------|--------|--------------|
| `structure-guide` | Created | 6 requirements (guide data module, 3 structure sections, industry guide, income-level rule, caveats, comparative table) |
| `structure-comparison` | Created | 6 requirements (reusable table, RegimeComparison table, take-home %, effective tax rate, SVG icons, BFC cleanup) |

**Total**: 2 new spec domains, 12 requirements, 17 scenarios.

---

## Observation IDs (Engram — for traceability)

| Artifact | Observation ID | Type |
|----------|---------------|------|
| Proposal | #184 | architecture |
| Delta Spec | #185 | architecture |
| Design | #186 | architecture |
| Tasks | #187 | architecture |
| Apply Progress | #188 | architecture |
| Verify Report | #191 | architecture |

---

## Archive Contents

All 5 artifacts preserved in `openspec/changes/archive/2026-05-09-actualizacion-impuestos-estructuras-it-uy-2026/`:

- `proposal.md` ✅
- `specs/structure-guide/spec.md` ✅
- `specs/structure-comparison/spec.md` ✅
- `design.md` ✅
- `tasks.md` ✅
- `verify-report.md` ✅

---

## Source of Truth Updated

- `openspec/specs/structure-guide/spec.md` — new spec (delta was a full spec)
- `openspec/specs/structure-comparison/spec.md` — new spec (delta was a full spec)

---

## Files Changed (7 total)

| File | Action | Lines |
|------|--------|-------|
| `src/data/guideData.ts` | Created | ~130 |
| `src/components/StructureComparisonTable.tsx` | Created | ~90 |
| `src/views/Guide.tsx` | Modified (rewritten) | ~180 |
| `src/components/RegimeComparison.tsx` | Modified | ~50 |
| `src/components/Results.tsx` | Modified | ~40 |
| `src/utils/taxCalculator.ts` | Modified | ~8 |
| `src/utils/taxCalculator.test.ts` | Modified | ~35 |

**Test summary**: 74 passed (67 existing + 7 new `effectiveTaxRate` tests)

---

## Known Warnings (from verify-report)

These were noted but did not block the change:

1. **Guide.tsx: 9 emoji-as-icons in `renderDimensions` and `renderProsCons`** — dimension card emojis (💰💸🏥👴⚠️📈🎯) and pros/cons ✅❌ were not replaced with SVGs. Category/structure header icons were correctly replaced.
2. **No tests for `guideData.ts`, `StructureComparisonTable.tsx`, `Guide.tsx`** — data module and components lack test coverage.
3. **Coverage tool not installed** — `@vitest/coverage-v8` missing; no coverage measurement available.

Suggestions for future improvement:
- Replace dimension emoji icons with SVG icon components
- Add type-safety tests for `guideData.ts` (verify all 3 structures have 7 dimensions, all 8 comparison rows present)
- Install `@vitest/coverage-v8` for coverage measurement
- Add focus ring styles to Guide accordion buttons
- Replace `×` character in Results.tsx modal close button with SVG
- Export `BPC` constant from `taxCalculator.ts` to avoid duplication

---

## SDD Cycle Complete

The change has been fully planned, implemented, verified, and archived. All artifacts persisted in both Engram (observation IDs) and openspec (filesystem). Ready for the next change.
