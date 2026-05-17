# Tax Calculator Specification

## Purpose
Provide pure TypeScript functions to calculate Uruguayan taxes for IT contractors (unipersonal regime): BPS, FONASA, IRPF, and VAT.

## Requirements

### Requirement: Calculate BPS and FONASA

The system SHALL calculate BPS + FONASA as 22.5% of the taxable base (70% of gross income in UYU).

#### Scenario: Standard calculation
- GIVEN gross income is 100,000 UYU
- WHEN calculateBPSFonasa is called
- THEN result SHALL be 15,750 UYU (100,000 × 0.70 × 0.225)

#### Scenario: Zero income
- GIVEN gross income is 0 UYU
- WHEN calculateBPSFonasa is called
- THEN result SHALL be 0

### Requirement: Calculate IRPF

The system SHALL estimate IRPF using simplified progressive brackets for MVP (±10% accuracy).

#### Scenario: Income below bracket 1
- GIVEN taxable income (gross - BPS/FONASA) is 20,000 UYU
- WHEN calculateIRPF is called
- THEN result SHALL be 0 (below minimum bracket)

#### Scenario: Income in first bracket
- GIVEN taxable income is 50,000 UYU
- WHEN calculateIRPF is called
- THEN result SHALL apply first bracket rate (simplified: ~10%)

### Requirement: Calculate VAT

The system SHALL apply 0% VAT for export clients, 22% for local clients.

#### Scenario: Export client
- GIVEN client type is "exterior"
- WHEN calculateVAT is called
- THEN result SHALL be 0

#### Scenario: Local client
- GIVEN client type is "local" and income is 100,000 UYU
- WHEN calculateVAT is called
- THEN result SHALL be 22,000 UYU

### Requirement: Calculate Net Income

The system SHALL compute net income as: gross UYU - BPS - FONASA - IRPF - VAT. Convert to USD using provided exchange rate.

#### Scenario: Full calculation
- GIVEN gross income 100,000 UYU, BPS/FONASA 15,750, IRPF 5,000, VAT 0, exchange rate 40
- WHEN calculateNet is called
- THEN net UYU SHALL be 79,250 and net USD SHALL be 1,981.25
