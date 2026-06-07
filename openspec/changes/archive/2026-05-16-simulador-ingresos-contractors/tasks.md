# Tasks: Simulador de Ingresos para Contractors IT en Uruguay

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~800-1000 (new project scaffolding + implementation) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Project scaffold → PR 2: Tax logic + UI |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No (exception-ok accepted by user)
Chained PRs recommended: Yes
Chain strategy: size-exception
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Scaffold Vite + React + TS + Tailwind v4 | Single PR | Base setup, no feature code |
| 2 | Implement tax logic + UI components | Single PR | Core feature, size:exception |

## Phase1: Project Scaffolding

- [x] 1.1 Create package.json with Vite + React + TypeScript dependencies
- [x] 1.2 Create vite.config.ts with React plugin
- [x] 1.3 Create tsconfig.json (simplified, no project references)
- [x] 1.4 Create tailwind.config.js with Tailwind v4
- [x] 1.5 Create postcss.config.js for Tailwind
- [x] 1.6 Create index.html with React mount point
- [x] 1.7 Create src/main.tsx entry point
- [x] 1.8 Create src/index.css with Tailwind directives
- [x] 1.9 Install dependencies (npm install)

## Phase2: Types and Tax Logic

- [x] 2.1 Create src/types/index.ts with SimulatorInputs, TaxCalculationResult, SimulatorState interfaces
- [x] 2.2 Create src/utils/taxCalculator.ts with calculateBPSFonasa function
- [x] 2.3 Add calculateIRPF function (simplified progressive brackets)
- [x] 2.4 Add calculateVAT function (0% exterior, 22% local)
- [x] 2.5 Add calculateNet function (full pipeline)
- [x] 2.6 Add reverseCalculate function (desired net → required gross)

## Phase3: UI Components

- [x] 3.1 Create src/components/Inputs.tsx with form (income, rate, client type)
- [x] 3.2 Create src/components/Results.tsx with card (net + tax breakdown)
- [x] 3.3 Create src/components/ReverseSim.tsx with reverse simulation form
- [x] 3.4 Implement reverse toggle and mode switching in App.tsx

## Phase4: App Wiring and Integration

- [x] 4.1 Create src/App.tsx with state management (useState)
- [x] 4.2 Wire inputs → taxCalculator → results display
- [x] 4.3 Wire reverse simulation flow
- [x] 4.4 Add validation (negative income, zero values)
- [x] 4.5 Add loading state (< 1s calculation)

## Phase5: Cleanup and Verification

- [x] 5.1 Verify build passes (npm run build)
- [ ] 5.2 Verify all spec scenarios manually in browser
- [ ] 5.3 Verify responsive layout and Tailwind v4 styling
- [ ] 5.4 Add comments to complex tax logic
- [x] 5.5 Final review against proposal scope
