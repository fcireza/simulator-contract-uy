# Simulator UI Specification

## Purpose
Provide an intuitive interface using Tailwind v4 and Magic UI components for the simulator.

## Requirements

### Requirement: Input Form

The system SHALL render input fields using Magic UI components: monthly income (USD), exchange rate, client type selector, and optional services (accountant/escribana).

#### Scenario: Render inputs
- GIVEN user opens simulator
- WHEN page loads
- THEN system SHALL display all input fields with labels and Magic UI styling

### Requirement: Results Display

The system SHALL render results in a clear card layout with Magic UI components, showing net income and tax breakdown.

#### Scenario: Show results card
- GIVEN calculation completes
- WHEN results are ready
- THEN system SHALL display a Magic UI card with net income highlighted and tax details in collapsible section

#### Scenario: Reverse simulation toggle
- GIVEN user toggles to reverse simulation mode
- WHEN mode changes
- THEN system SHALL swap input fields to accept desired net income instead of gross
