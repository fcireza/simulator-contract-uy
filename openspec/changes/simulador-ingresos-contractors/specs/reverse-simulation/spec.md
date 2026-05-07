# Reverse Simulation Specification

## Purpose
Allow users to input desired net income and calculate required gross income.

## Requirements

### Requirement: Reverse Calculation

The system SHALL calculate required gross income given a desired net amount in UYU or USD.

#### Scenario: Net in UYU
- GIVEN user wants 80,000 UYU net, exchange rate 40, client type "exterior"
- WHEN reverse simulation is triggered
- THEN system SHALL display required gross income in UYU and USD

#### Scenario: Net in USD
- GIVEN user wants 2000 USD net, exchange rate 39.5, client type "local"
- WHEN reverse simulation is triggered
- THEN system SHALL convert to UYU and calculate required gross including VAT

### Requirement: Display Gross Breakdown

The system SHALL show required gross and tax estimates needed to achieve target net.

#### Scenario: Show breakdown
- GIVEN reverse calculation completes
- WHEN results are displayed
- THEN system SHALL show gross income, estimated taxes, and target net achieved
