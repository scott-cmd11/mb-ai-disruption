# Cost Curve Convergence — Design Spec
**Date:** 2026-04-04
**Status:** Approved for implementation

---

## Overview

Add a "Cost Curve Convergence" visualization to the calculator results page. The chart shows how a traditional firm's cost-per-client compares to an AI-native entrant's over 24 months — with a gold "disruption event" marker at the crossover point. The user can toggle between three adoption-speed scenarios and three metric tabs. When the crossover hits, a red callout appears and a collapsed playbook section reveals concrete actions.

The goal: make the competitive threat feel economic, specific, and time-bound — not theoretical.

---

## Where It Lives

Appended to `ResultsClient.tsx` as a new section below existing recommendations. The `CostCurveChart` component is a new `"use client"` file. The calculator page (`page.tsx`) already loads playbooks and passes them to `ResultsClient` — no additional data fetching required.

---

## Data Changes

### 1. Add `costCurve` block to `sector-playbooks.json`

Each of the 20 sector entries gets a new `costCurve` object:

```json
"costCurve": {
  "avgMonthlyClientCost": 420,
  "aiNativeStartMultiplier": 1.6,
  "aiNativeFloorMultiplier": 0.38,
  "typicalClientsPerEmployee": 6,
  "aiNativeClientsPerEmployee": 60
}
```

**Fields:**
- `avgMonthlyClientCost` — what a typical client pays this type of firm monthly (varies widely: $180 for retail, $420 for professional services, $890 for finance/insurance)
- `aiNativeStartMultiplier` — AI-native firm's cost at month 0 as a multiple of traditional (always > 1, typically 1.4–1.8, reflecting startup investment costs)
- `aiNativeFloorMultiplier` — the floor the AI-native curve asymptotes toward (typically 0.30–0.45 of traditional)
- `typicalClientsPerEmployee` — baseline staffing ratio for a traditional firm (used for staffing ratio tab)
- `aiNativeClientsPerEmployee` — staffing ratio for an AI-native firm at scale (used for staffing ratio tab)

### 2. Add `CostCurveData` interface to `src/types/index.ts`

All fields are required (every sector entry will have a `costCurve` block):

```typescript
export interface CostCurveData {
  /** What a typical client pays this firm type per month (CAD) */
  avgMonthlyClientCost: number;
  /** AI-native firm's cost at month 0 as a multiple of traditional (e.g. 1.6 = 60% more expensive initially) */
  aiNativeStartMultiplier: number;
  /** The asymptotic floor the AI-native curve approaches (e.g. 0.38 = 38% of traditional cost) */
  aiNativeFloorMultiplier: number;
  /** Clients a traditional-firm employee serves per month (e.g. 6 = 6 clients per employee) */
  typicalClientsPerEmployee: number;
  /** Clients an AI-native-firm employee serves at scale (e.g. 60 = 60 clients per employee) */
  aiNativeClientsPerEmployee: number;
}
```

Update `SectorPlaybook` interface to include:
```typescript
costCurve: CostCurveData;
```

---

## Chart Math

All curve computation happens inside `CostCurveChart` at render time. No pre-computation needed.

### Crossover month (base)

Uses `result.industryAverage` (the sector-level risk score, not the user's personal adjusted score). Rationale: the crossover timing is a market-level phenomenon — it happens to the sector regardless of whether this individual business has adopted AI. The user's personal score drives urgency framing in the callout copy, not the crossover timing itself.

```
baseCrossoverMonth = round(36 - (result.industryAverage × 0.24))
```

- Score 74 (high) → month ~18
- Score 55 (medium) → month ~23
- Score 35 (low) → month ~28

**Scenario multipliers** applied to `baseCrossoverMonth`:

| Scenario | Multiplier |
|---|---|
| Slow | × 1.4 |
| Normal | × 1.0 |
| Fast | × 0.6 |

Crossover month is clamped to `[4, 34]`.

**When crossover month > 24 (off the chart):** The crossover dot and danger zone are not rendered. Instead, the callout reads: "At current adoption rates, a disruption event for your sector falls outside the 24-month window. Switch to the Fast scenario to see the accelerated case." The playbook reveal still renders unconditionally — acting early is the point.

### Tab 1 — Cost per client ($/month)

Point count: 25 (month 0 to 24, step 1).

```
traditional[m] = avgMonthlyClientCost × (1 - 0.003 × m)   // ~7% total decline over 24mo
aiNative[m]    = avgMonthlyClientCost
                 × lerp(aiNativeStartMultiplier, aiNativeFloorMultiplier, sigmoid(m / crossoverMonth))
```

Where `sigmoid(x) = 1 / (1 + e^(-4(x-1)))` gives a natural S-curve decay (fast middle, slow ends). The `lerp` maps the multiplier from start to floor.

**Scenario effect on curve shape:** The scenario multiplier scales `crossoverMonth` only. The sigmoid input `m / crossoverMonth` means the entire curve compresses or stretches horizontally — in Fast mode, the AI-native line drops steeply early; in Slow mode it lingers high longer. The `aiNativeFloorMultiplier` is always reached asymptotically and is not scenario-adjusted. This means the curves always converge; only the timing differs.

### Tab 2 — Revenue at risk ($)

Uses `result.input.businessSize` to look up estimated monthly revenue (CAD, Manitoba SMB benchmarks from Statistics Canada Business Counts 2023):

```typescript
const MONTHLY_REVENUE_BY_SIZE: Record<BusinessSize, number> = {
  micro:  35_000,   // <5 employees, ~$420K annual
  small:  180_000,  // 5–49 employees, ~$2.2M annual
  medium: 850_000,  // 50–199 employees, ~$10.2M annual
  large:  3_200_000 // 200+ employees, ~$38.4M annual
};
```

```
estimatedRevenue = MONTHLY_REVENUE_BY_SIZE[result.input.businessSize]

aiNativeShare[m] = min(0.40, m / 24 × 0.40)   // grows linearly 0→40% over 24 months

revenueAtRisk[m] = estimatedRevenue × aiNativeShare[m] × 0.60
```

The `0.60` factor (price elasticity proxy) represents that not all clients defect purely on price — relationships, switching costs, and quality perception retain ~40% even when cheaper alternatives exist. This is a fixed constant, not sector-specific.

Y-axis label: "Monthly revenue at risk (CAD)"

### Tab 3 — Staffing ratio (employees per 100 clients)

```
traditional[m] = 100 / typicalClientsPerEmployee          // flat
aiNative[m]    = 100 / lerp(AI_NATIVE_STAFFING_RAMP_START, aiNativeClientsPerEmployee, m/24)
// AI_NATIVE_STAFFING_RAMP_START = 3
// Rationale: AI-native firms begin with a small client base relative to staff (high setup cost
// before workflows are tuned) — effectively worse than a traditional firm initially. They
// surpass the traditional ratio as automation compounds.  // declining
```

### Y-axis domain

Computed from the min/max of both curves + 10% padding. Rounded to nearest clean interval (50 for cost, 10K for revenue, 1 for staffing).

---

## Component Structure

### New file: `src/app/calculator/CostCurveChart.tsx`

`"use client"` component. Receives:

```typescript
interface Props {
  industry: Industry;
  playbook: SectorPlaybook;
  result: AssessmentResult;
}
```

Note: `activeTab` state type is `"cost" | "revenue" | "staffing"` (string union, not numeric index).

Internal state:
```typescript
const [scenario, setScenario] = useState<'slow' | 'normal' | 'fast'>('normal');
const [activeTab, setActiveTab] = useState<'cost' | 'revenue' | 'staffing'>('cost');
const [playbookOpen, setPlaybookOpen] = useState(false);
```

Renders:
1. **Header row** — title with sector chip, scenario toggle (Slow / Normal / Fast)
2. **Metric tabs** — Cost per client / Revenue at risk / Staffing ratio
3. **SVG chart** — inline, responsive (`width="100%" viewBox="0 0 560 200"`)
4. **Crossover callout** — conditionally rendered with computed month and cost figures
5. **Playbook reveal** — collapsible, shows `playbook.actions12Month` (first 4 items)

### Modified: `src/app/calculator/CalculatorClient.tsx`

The full `Industry` object must be passed to `ResultsClient`. `CalculatorClient` already finds the matching industry (`industries.find(i => i.naicsCode === naicsCode)`). Add `industry` to the `ResultsClient` props call:

```typescript
// In CalculatorClient — find matching industry (already done) and pass it down
<ResultsClient
  result={result}
  playbook={matchingPlaybook}
  threatScenarios={threatScenarios}
  industry={matchingIndustry}   // ← add this
/>
```

### Modified: `src/app/calculator/ResultsClient.tsx`

Add `industry?: Industry` to `ResultsClient`'s props interface. Add `CostCurveChart` import and render after recommendations:

```typescript
{playbook && industry && (
  <CostCurveChart industry={industry} playbook={playbook} result={result} />
)}
```

The component is optional — if either `playbook` or `industry` is absent (e.g. unknown NAICS code), `CostCurveChart` simply does not render. No error state needed.

---

## SVG Chart Implementation

Rendered as a pure inline SVG — no external chart library. Key elements:

| Element | Spec |
|---|---|
| Traditional line | `stroke="#f87171"` (red), solid, `strokeWidth={2.5}` |
| AI-native line | `stroke="#6ee7b7"` (green), dashed (`strokeDasharray="6,3"`), `strokeWidth={2.5}` |
| Danger zone fill | `polygon` of points after crossover, `fill="rgba(239,68,68,0.06)"` |
| Crossover dot | `circle r={6}` fill `#c9a84c`, pulse animation via CSS `@keyframes` |
| Crossover ring | `circle r={11}` stroke `#c9a84c` opacity 0.4, same pulse |
| Grid lines | `stroke="#1e3a55"` at Y-axis intervals |
| Y/X axis labels | `font-size="10"` `fill="#5a7a95"` `font-family="sans-serif"` |

**Pulse animation strategy:** Add the keyframe to `src/app/globals.css` (consistent with how all other animations in this codebase are defined — `anim-row`, `anim-fade-up` etc. all live in globals). Apply via a className on the SVG `<circle>` element:

```css
/* globals.css */
@keyframes pulse-ring {
  0%   { r: 11px; opacity: 0.4; }
  50%  { r: 16px; opacity: 0; }
  100% { r: 11px; opacity: 0.4; }
}
.crossover-ring { animation: pulse-ring 2s ease-in-out infinite; }
```

```tsx
{/* In SVG */}
<circle className="crossover-ring" cx={crossoverX} cy={crossoverY} r={11}
  stroke="#c9a84c" strokeWidth={1.5} fill="none" />
<circle cx={crossoverX} cy={crossoverY} r={6} fill="#c9a84c" />
```

The outer ring animates; the inner dot is static.

**Accessibility:** The SVG element gets `role="img"` and `aria-label` computed from the active tab and crossover month, e.g. `"Cost curve chart: disruption event at month 12 for Professional Services"`. This matches the `ScoreGauge` pattern already in `ResultsClient.tsx`.

---

## Crossover Callout

Rendered immediately below the chart when the crossover month is ≤ 24 (i.e., always for high/medium sectors):

```
"At month {X}, an AI-native competitor breaks even at ${Y}/client — {Z}% of your rate."
```

Where:
- `X` = computed crossover month (scenario-adjusted)
- `Y` = `traditional[crossoverMonth]` rounded to nearest $10
- `Z` = `round((Y / avgMonthlyClientCost) * 100)`

Body copy references Manitoba's ~2% AI adoption rate for local urgency framing.

---

## Playbook Reveal

Collapsed by default. Toggle button shows "▸ What to do before you reach month X" with action count badge.

When open, renders `playbook.actions12Month.slice(0, 4)` as a numbered list. Styled consistently with existing `ActionRoadmap` component patterns.

Link at bottom: "See full {sectorLabel} playbook →" (links to `/calculator` scroll or `/about`).

---

## Scenarios — User-Facing Labels

| Button | Label shown | What it means internally |
|---|---|---|
| Slow | "Slow" | baseCrossover × 1.4 — conservative; incumbents have more time |
| Normal | "Normal" | baseCrossover × 1.0 — based on current adoption acceleration |
| Fast | "Fast" | baseCrossover × 0.6 — aggressive; Manitoba catches up to national average quickly |

Tooltip on hover (or `title` attribute): one-sentence explanation of what each scenario assumes.

---

## Visual Design

Follows existing site design tokens exactly:

| Token | Value |
|---|---|
| `--color-navy-deep` | `#0d1b2a` |
| `--color-paper-deep` | `#112236` |
| `--color-border` | `#1e3a55` |
| `--color-gold` | `#c9a84c` |
| `--color-risk-high` | `#ef4444` / `#f87171` |
| `--color-risk-low` | `#6ee7b7` (repurposed for AI-native) |
| `--color-text-secondary` | `#8fa3b8` |

Container: `rounded-xl border border-[var(--color-border)] bg-[var(--color-paper-deep)]` — matches existing card style.

---

## Data to Add (sector-playbooks.json `costCurve` values)

| NAICS | Sector | avgMonthlyClientCost | aiNativeStart× | aiNativeFloor× | clients/emp (trad) | clients/emp (AI) |
|---|---|---|---|---|---|---|
| 11 | Agriculture | 280 | 1.5 | 0.42 | 8 | 45 |
| 21 | Mining & Oil | 1200 | 1.7 | 0.35 | 4 | 28 |
| 22 | Utilities | 620 | 1.8 | 0.40 | 5 | 32 |
| 23 | Construction | 380 | 1.5 | 0.45 | 7 | 38 |
| 31-33 | Manufacturing | 450 | 1.6 | 0.40 | 6 | 35 |
| 41 | Wholesale Trade | 320 | 1.5 | 0.42 | 8 | 50 |
| 44-45 | Retail | 180 | 1.4 | 0.38 | 12 | 70 |
| 48-49 | Transportation | 290 | 1.5 | 0.43 | 7 | 40 |
| 51 | Information | 560 | 1.7 | 0.35 | 5 | 55 |
| 52 | Finance & Insurance | 890 | 1.8 | 0.32 | 4 | 38 |
| 53 | Real Estate | 340 | 1.5 | 0.40 | 9 | 52 |
| 54 | Professional Services | 420 | 1.6 | 0.38 | 6 | 60 |
| 55 | Corporate Management | 1100 | 1.7 | 0.35 | 3 | 25 |
| 56 | Admin & Support | 220 | 1.4 | 0.38 | 10 | 65 |
| 61 | Education | 310 | 1.5 | 0.45 | 8 | 42 |
| 62 | Health Care | 480 | 1.8 | 0.42 | 5 | 30 |
| 71 | Arts & Recreation | 190 | 1.4 | 0.45 | 10 | 48 |
| 72 | Accommodation & Food | 160 | 1.4 | 0.40 | 14 | 60 |
| 81 | Other Services | 240 | 1.5 | 0.42 | 9 | 50 |
| 91 | Public Administration | 520 | 1.7 | 0.48 | 5 | 28 |

---

## Files Changed

| File | Change |
|---|---|
| `src/app/calculator/CostCurveChart.tsx` | **New** — full chart component |
| `src/app/calculator/ResultsClient.tsx` | Add `industry?: Industry` prop; import + render `CostCurveChart` |
| `src/app/calculator/CalculatorClient.tsx` | Pass `industry={matchingIndustry}` to `ResultsClient` |
| `src/types/index.ts` | Add `CostCurveData` interface; add `costCurve` field to `SectorPlaybook` |
| `public/data/sector-playbooks.json` | Add `costCurve` block to all 20 entries |
| `src/app/globals.css` | Add `@keyframes pulse-ring` and `.crossover-ring` class |

---

## Out of Scope

- Standalone `/cost-curve` page (can be added later)
- Animation of the curve drawing itself (the crossover dot pulses; the lines are static on load)
- User-editable inputs (team size, current pricing) — future enhancement
- Fetching live startup funding data for the signal feed (Concept D from brainstorming) — separate feature
