# Structure Comparison Specification

## Purpose

Provide row-based qualitative comparison across Unipersonal, SAS+Caja Profesional, and SAS+BPS structures, plus effective tax rate display in Results.

## Requirements

### Requirement: Reusable comparison table component

The system SHALL create `src/components/StructureComparisonTable.tsx` — a reusable component accepting row data with structure columns.

#### Scenario: Component renders
- GIVEN row data with 3 structure values
- WHEN rendered
- THEN a table with header row (3 structure names) and data rows SHALL display

#### Scenario: Dark mode support
- GIVEN dark mode is enabled
- WHEN rendered
- THEN the table SHALL use dark mode color tokens

### Requirement: Qualitative comparison table in RegimeComparison

The system SHALL append a row-based qualitative table below the existing 3 cards in RegimeComparison.tsx.

#### Scenario: Table appended
- GIVEN comparison results exist
- WHEN RegimeComparison renders
- THEN the 8-row table (Responsabilidad limitada, Jubilación, Fonasa, Mutualista, Complejidad, Costos operativos, Escalabilidad, Optimización fiscal) SHALL appear below the cards

### Requirement: Take-home percentage

The comparison table SHALL show a take-home % row computing (netUyu / grossUyu) per structure.

#### Scenario: Percentage computed
- GIVEN each regime result has netUyu and incomeUyu
- WHEN the table renders
- THEN the take-home % row SHALL display (net/income * 100) per structure, rounded to 1 decimal

### Requirement: Effective tax rate in Results

The system SHALL add an effective tax rate row in Results.tsx, computed as (total taxes / gross income) × 100.

#### Scenario: Rate displayed
- GIVEN a simulation result
- WHEN Results renders
- THEN a row SHALL show "Tasa Efectiva: X.X%" below the tax breakdown

### Requirement: SVG icons replace emoji

Results.tsx SHALL replace `▶` and `▼` emoji collapsible indicators with inline SVG `<path>` chevrons.

#### Scenario: Chevron rendered
- GIVEN a collapsible section (e.g., BPS+FONASA)
- WHEN collapsed
- THEN an SVG chevron pointing right SHALL display
- WHEN expanded
- THEN an SVG chevron pointing down SHALL display

### Requirement: taxCalculator.ts cleanup

The system SHALL remove the unused `BFC` constant from taxCalculator.ts and verify Caja Profesional category logic matches 2026 rates (22.5% on 70% capped at 15 BPC).

#### Scenario: BFC removed
- GIVEN taxCalculator.ts
- WHEN compiled
- THEN no reference to BFC SHALL exist (no unused const warnings)

#### Scenario: Tests pass
- GIVEN the cleanup
- WHEN `npm test` runs
- THEN all 770 lines of existing tests SHALL pass with zero regressions
