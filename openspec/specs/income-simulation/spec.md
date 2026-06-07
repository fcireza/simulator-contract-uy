# Income Simulation Specification

## Purpose
Allow users to input monthly income parameters and view calculated net income with tax breakdown.

## Requirements

### Requirement: Input Parameters

The system SHALL provide inputs for monthly income (USD), exchange rate, and client type (local/exterior).

#### Scenario: Valid inputs
- GIVEN user enters 3000 USD, exchange rate 39.5, client type "exterior"
- WHEN simulation is triggered
- THEN system SHALL accept inputs and proceed to calculation

#### Scenario: Invalid income
- GIVEN user enters negative income or 0
- WHEN simulation is triggered
- THEN system SHALL display validation error

### Requirement: Display Results

The system SHALL display net income in UYU and USD, plus tax breakdown (BPS, FONASA, IRPF, VAT).

#### Scenario: Show results after calculation
- GIVEN calculation completes successfully
- WHEN results are displayed
- THEN system SHALL show net_uyu, net_usd, and each tax amount

#### Scenario: Loading state
- GIVEN calculation is in progress
- WHEN results are being computed
- THEN system SHALL show loading indicator (calculation < 1s)
