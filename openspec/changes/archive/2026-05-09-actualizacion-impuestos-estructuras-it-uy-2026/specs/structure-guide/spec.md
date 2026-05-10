# Structure Guide Specification

## Purpose

Provide an interactive guide comparing 3 Uruguayan IT contractor tax structures across 7 decision dimensions, with income-level recommendations and industry usage guidance.

## Requirements

### Requirement: Guide data extracted to typed module

The system SHALL extract all per-structure data into a new `src/data/guideData.ts` module with typed interfaces for the 7 dimensions: tributación, costos, salud, jubilación, riesgo, escalabilidad, optimización fiscal.

#### Scenario: Data is testable
- GIVEN a typed structure dimension
- WHEN imported from guideData
- THEN it SHALL be a plain object with numeric, string, and enum fields (no JSX)

### Requirement: Three deep structure sections

The Guide.tsx SHALL render one collapsible section per structure (Unipersonal, SAS+Caja Profesional, SAS+BPS/Fonasa). Each SHALL cover 7 dimensions with annotated values.

#### Scenario: Unipersonal section
- GIVEN the user expands "Unipersonal"
- WHEN they scroll
- THEN they SHALL see IVA (0% export), IRPF/IRAE (none), BPS 15% + FONASA 8-13%, export benefits, costs, ventajas/desventajas

#### Scenario: SAS + Caja Profesional section
- GIVEN the user expands "SAS + Caja Profesional"
- WHEN they scroll
- THEN they SHALL see IRAE 25%, IVA 0%, IPAT, exoneraciones, Caja Profesional 22.5%, mutualista privada, ventajas/desventajas

#### Scenario: SAS + BPS section
- GIVEN the user expands "SAS + BPS (sin Caja)"
- WHEN they scroll
- THEN they SHALL see IRAE 25%, IVA 0%, BPS 12.5%, Fonasa, IPAT, ventajas/desventajas

### Requirement: Industry usage guide

The Guide SHALL include a section mapping career level to recommended structure.

#### Scenario: Recommendations shown
- GIVEN the guide is rendered
- WHEN the user reads the industry guide
- THEN they SHALL see: Junior/freelance → Unipersonal, Senior → SAS, Developer recibido → SAS + Caja, Startup/producto propio → SAS

### Requirement: Income-level practical rule

The Guide SHALL display a 2026 practical earnings rule.

#### Scenario: Rule by USD income
- GIVEN the practical rule section
- WHEN read
- THEN it SHALL state: hasta USD 2k-3k → Unipersonal, USD 4k+ → SAS, Developer recibido → SAS + Caja

### Requirement: Important caveats

The Guide SHALL display 3 critical caveats: "Software exonerado ≠ sin impuestos", Caja Profesional costs and situation, and hidden SAS costs (certificado digital, libros societarios, firmas, escribano).

#### Scenario: Caveats rendered
- GIVEN the user reads important considerations
- THEN they SHALL see all 3 caveats with brief explanations

### Requirement: Income-level comparative table

The Guide SHALL render a comparative table with rows: Responsabilidad limitada, Jubilación, Fonasa, Mutualista, Complejidad, Costos operativos, Escalabilidad, Optimización fiscal.

#### Scenario: Table shown
- GIVEN the guide is rendered
- WHEN scrolled to the comparative section
- THEN a table with 8 rows and 3 columns (one per structure) SHALL be displayed
