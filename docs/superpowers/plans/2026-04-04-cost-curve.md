# Cost Curve Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Cost Curve Convergence" chart to the calculator results page showing how long before an AI-native startup can undercut a traditional firm's pricing, with three scenario toggles, three metric tabs, a disruption event marker, and a collapsible playbook reveal.

**Architecture:** Pure client-side computation — all math runs inside the `CostCurveChart` component at render time using existing data already loaded by the calculator page. The chart is an inline SVG (no external library). The component is wired into `ResultsClient` via a new optional `industry` prop threaded through from `CalculatorClient`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, inline SVG. No new dependencies.

---

## ⚠ Color Token Alert

The spec mockup used dark navy colors (`#112236`, `#c9a84c`, `#6ee7b7`). The **actual site uses a light theme** for content areas. Use these real tokens from `globals.css`:

| Role | Token | Value |
|---|---|---|
| Container bg | `var(--color-surface-muted)` | `#F1F5F9` |
| Border | `var(--color-border)` | `#E2E8F0` |
| Gold accent | `var(--color-gold)` | `#D97706` |
| Traditional line | `var(--color-risk-high)` | `#DC2626` |
| AI-native line | `var(--color-risk-low)` | `#15803D` |
| Grid lines | `var(--color-border)` | `#E2E8F0` |
| Text secondary | `var(--color-text-secondary)` | `#475569` |
| Text tertiary | `var(--color-text-tertiary)` | `#64748B` |

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/types/index.ts` | Modify | Add `CostCurveData` interface; add `costCurve` field to `SectorPlaybook` |
| `public/data/sector-playbooks.json` | Modify | Add `costCurve` block to all 20 entries |
| `src/lib/costCurve.ts` | **Create** | Pure math functions (crossover, curve points, y-axis domain) — testable in isolation |
| `src/app/calculator/CostCurveChart.tsx` | **Create** | Full UI component — header, tabs, SVG chart, callout, playbook reveal |
| `src/app/calculator/CalculatorClient.tsx` | Modify | Pass `industry` object (not just name string) to `ResultsClient` |
| `src/app/calculator/ResultsClient.tsx` | Modify | Add `industry?: Industry` prop; render `CostCurveChart` after recommendations |
| `src/app/globals.css` | Modify | Add `@keyframes pulse-ring` and `.crossover-ring` |

---

## Task 1: Types + Data

**Files:**
- Modify: `src/types/index.ts`
- Modify: `public/data/sector-playbooks.json`

- [ ] **Step 1.1: Add `CostCurveData` interface and update `SectorPlaybook`**

Open `src/types/index.ts`. After the `SectorPlaybook` interface, add:

```typescript
export interface CostCurveData {
  /** What a typical client pays this firm type per month (CAD) */
  avgMonthlyClientCost: number;
  /** AI-native firm's cost at month 0 as a multiple of traditional (e.g. 1.6 = 60% more expensive initially) */
  aiNativeStartMultiplier: number;
  /** The asymptotic floor the AI-native curve approaches (e.g. 0.38 = 38% of traditional cost) */
  aiNativeFloorMultiplier: number;
  /** Clients a traditional-firm employee serves per month */
  typicalClientsPerEmployee: number;
  /** Clients an AI-native-firm employee serves at scale */
  aiNativeClientsPerEmployee: number;
}
```

In the existing `SectorPlaybook` interface, add the field:
```typescript
costCurve: CostCurveData;
```

- [ ] **Step 1.2: Verify TypeScript compiles**

```bash
cd "C:\Users\scott\coding projects\mb-ai-disruption"
npx tsc --noEmit
```

Expected: Errors for missing `costCurve` on `SectorPlaybook` objects in JSON — that's correct, we haven't updated the JSON yet.

- [ ] **Step 1.3: Add `costCurve` blocks to all 20 entries in `sector-playbooks.json`**

Use the values from the spec table. Each entry gets a `costCurve` field added immediately after `underestimationRisk`. Full values:

```json
// NAICS 11 — Agriculture
"costCurve": { "avgMonthlyClientCost": 280, "aiNativeStartMultiplier": 1.5, "aiNativeFloorMultiplier": 0.42, "typicalClientsPerEmployee": 8, "aiNativeClientsPerEmployee": 45 }

// NAICS 21 — Mining & Oil
"costCurve": { "avgMonthlyClientCost": 1200, "aiNativeStartMultiplier": 1.7, "aiNativeFloorMultiplier": 0.35, "typicalClientsPerEmployee": 4, "aiNativeClientsPerEmployee": 28 }

// NAICS 22 — Utilities
"costCurve": { "avgMonthlyClientCost": 620, "aiNativeStartMultiplier": 1.8, "aiNativeFloorMultiplier": 0.40, "typicalClientsPerEmployee": 5, "aiNativeClientsPerEmployee": 32 }

// NAICS 23 — Construction
"costCurve": { "avgMonthlyClientCost": 380, "aiNativeStartMultiplier": 1.5, "aiNativeFloorMultiplier": 0.45, "typicalClientsPerEmployee": 7, "aiNativeClientsPerEmployee": 38 }

// NAICS 31-33 — Manufacturing
"costCurve": { "avgMonthlyClientCost": 450, "aiNativeStartMultiplier": 1.6, "aiNativeFloorMultiplier": 0.40, "typicalClientsPerEmployee": 6, "aiNativeClientsPerEmployee": 35 }

// NAICS 41 — Wholesale Trade
"costCurve": { "avgMonthlyClientCost": 320, "aiNativeStartMultiplier": 1.5, "aiNativeFloorMultiplier": 0.42, "typicalClientsPerEmployee": 8, "aiNativeClientsPerEmployee": 50 }

// NAICS 44-45 — Retail
"costCurve": { "avgMonthlyClientCost": 180, "aiNativeStartMultiplier": 1.4, "aiNativeFloorMultiplier": 0.38, "typicalClientsPerEmployee": 12, "aiNativeClientsPerEmployee": 70 }

// NAICS 48-49 — Transportation
"costCurve": { "avgMonthlyClientCost": 290, "aiNativeStartMultiplier": 1.5, "aiNativeFloorMultiplier": 0.43, "typicalClientsPerEmployee": 7, "aiNativeClientsPerEmployee": 40 }

// NAICS 51 — Information
"costCurve": { "avgMonthlyClientCost": 560, "aiNativeStartMultiplier": 1.7, "aiNativeFloorMultiplier": 0.35, "typicalClientsPerEmployee": 5, "aiNativeClientsPerEmployee": 55 }

// NAICS 52 — Finance & Insurance
"costCurve": { "avgMonthlyClientCost": 890, "aiNativeStartMultiplier": 1.8, "aiNativeFloorMultiplier": 0.32, "typicalClientsPerEmployee": 4, "aiNativeClientsPerEmployee": 38 }

// NAICS 53 — Real Estate
"costCurve": { "avgMonthlyClientCost": 340, "aiNativeStartMultiplier": 1.5, "aiNativeFloorMultiplier": 0.40, "typicalClientsPerEmployee": 9, "aiNativeClientsPerEmployee": 52 }

// NAICS 54 — Professional Services
"costCurve": { "avgMonthlyClientCost": 420, "aiNativeStartMultiplier": 1.6, "aiNativeFloorMultiplier": 0.38, "typicalClientsPerEmployee": 6, "aiNativeClientsPerEmployee": 60 }

// NAICS 55 — Corporate Management
"costCurve": { "avgMonthlyClientCost": 1100, "aiNativeStartMultiplier": 1.7, "aiNativeFloorMultiplier": 0.35, "typicalClientsPerEmployee": 3, "aiNativeClientsPerEmployee": 25 }

// NAICS 56 — Admin & Support
"costCurve": { "avgMonthlyClientCost": 220, "aiNativeStartMultiplier": 1.4, "aiNativeFloorMultiplier": 0.38, "typicalClientsPerEmployee": 10, "aiNativeClientsPerEmployee": 65 }

// NAICS 61 — Education
"costCurve": { "avgMonthlyClientCost": 310, "aiNativeStartMultiplier": 1.5, "aiNativeFloorMultiplier": 0.45, "typicalClientsPerEmployee": 8, "aiNativeClientsPerEmployee": 42 }

// NAICS 62 — Health Care
"costCurve": { "avgMonthlyClientCost": 480, "aiNativeStartMultiplier": 1.8, "aiNativeFloorMultiplier": 0.42, "typicalClientsPerEmployee": 5, "aiNativeClientsPerEmployee": 30 }

// NAICS 71 — Arts & Recreation
"costCurve": { "avgMonthlyClientCost": 190, "aiNativeStartMultiplier": 1.4, "aiNativeFloorMultiplier": 0.45, "typicalClientsPerEmployee": 10, "aiNativeClientsPerEmployee": 48 }

// NAICS 72 — Accommodation & Food
"costCurve": { "avgMonthlyClientCost": 160, "aiNativeStartMultiplier": 1.4, "aiNativeFloorMultiplier": 0.40, "typicalClientsPerEmployee": 14, "aiNativeClientsPerEmployee": 60 }

// NAICS 81 — Other Services
"costCurve": { "avgMonthlyClientCost": 240, "aiNativeStartMultiplier": 1.5, "aiNativeFloorMultiplier": 0.42, "typicalClientsPerEmployee": 9, "aiNativeClientsPerEmployee": 50 }

// NAICS 91 — Public Administration
"costCurve": { "avgMonthlyClientCost": 520, "aiNativeStartMultiplier": 1.7, "aiNativeFloorMultiplier": 0.48, "typicalClientsPerEmployee": 5, "aiNativeClientsPerEmployee": 28 }
```

- [ ] **Step 1.4: TypeScript check passes clean**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 1.5: Commit**

```bash
git add src/types/index.ts public/data/sector-playbooks.json
git commit -m "feat: add CostCurveData type and costCurve data to sector playbooks"
```

---

## Task 2: Math Utilities

**Files:**
- Create: `src/lib/costCurve.ts`

Extract all chart computation into pure functions. No imports from React or Next.js — testable in isolation.

- [ ] **Step 2.1: Create `src/lib/costCurve.ts`**

```typescript
import type { BusinessSize, CostCurveData } from "@/types";

// ── Constants ──────────────────────────────────────────────────────────────────

export type Scenario = "slow" | "normal" | "fast";
export type MetricTab = "cost" | "revenue" | "staffing";

const SCENARIO_MULTIPLIERS: Record<Scenario, number> = {
  slow:   1.4,
  normal: 1.0,
  fast:   0.6,
};

const MONTHLY_REVENUE_BY_SIZE: Record<BusinessSize, number> = {
  micro:  35_000,
  small:  180_000,
  medium: 850_000,
  large:  3_200_000,
};

const AI_NATIVE_STAFFING_RAMP_START = 3; // clients/employee at month 0 for AI-native firms
const MONTHS = 24;
const POINT_COUNT = MONTHS + 1; // month 0 through 24 inclusive

// ── Pure math helpers ──────────────────────────────────────────────────────────

/** Linear interpolation */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** S-curve sigmoid centred at t=1, steep around the crossover */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-4 * (x - 1)));
}

// ── Crossover month ────────────────────────────────────────────────────────────

/**
 * Returns the scenario-adjusted crossover month (clamped 4–34).
 * Uses the sector-level risk score (industryAverage), not the user's personal score.
 */
export function crossoverMonth(industryAverage: number, scenario: Scenario): number {
  const base = Math.round(36 - industryAverage * 0.24);
  const adjusted = Math.round(base * SCENARIO_MULTIPLIERS[scenario]);
  return Math.max(4, Math.min(34, adjusted));
}

// ── Curve generators ───────────────────────────────────────────────────────────

/** Tab 1: cost per client ($/month) for each month 0–24 */
export function costCurvePoints(
  data: CostCurveData,
  scenario: Scenario,
  industryAverage: number
): { traditional: number[]; aiNative: number[] } {
  const xMonth = crossoverMonth(industryAverage, scenario);
  const traditional: number[] = [];
  const aiNative: number[] = [];

  for (let m = 0; m < POINT_COUNT; m++) {
    traditional.push(data.avgMonthlyClientCost * (1 - 0.003 * m));
    const t = sigmoid(m / xMonth);
    aiNative.push(
      data.avgMonthlyClientCost * lerp(data.aiNativeStartMultiplier, data.aiNativeFloorMultiplier, t)
    );
  }

  return { traditional, aiNative };
}

/** Tab 2: revenue at risk ($/month) for each month 0–24 */
export function revenueCurvePoints(
  businessSize: BusinessSize,
  scenario: Scenario,
  industryAverage: number
): { traditional: number[]; aiNative: number[] } {
  const estimatedRevenue = MONTHLY_REVENUE_BY_SIZE[businessSize];
  const xMonth = crossoverMonth(industryAverage, scenario);
  const traditional: number[] = [];
  const aiNative: number[] = [];

  for (let m = 0; m < POINT_COUNT; m++) {
    traditional.push(estimatedRevenue); // flat baseline
    const aiNativeShare = Math.min(0.40, (m / MONTHS) * 0.40);
    aiNative.push(estimatedRevenue * aiNativeShare * 0.60);
  }

  // suppress unused xMonth warning — crossover affects callout copy, not revenue curve shape
  void xMonth;

  return { traditional, aiNative };
}

/** Tab 3: employees per 100 clients for each month 0–24 */
export function staffingCurvePoints(
  data: CostCurveData,
  scenario: Scenario,
  industryAverage: number
): { traditional: number[]; aiNative: number[] } {
  const xMonth = crossoverMonth(industryAverage, scenario);
  const traditionalRatio = 100 / data.typicalClientsPerEmployee;
  const traditional: number[] = [];
  const aiNative: number[] = [];

  for (let m = 0; m < POINT_COUNT; m++) {
    traditional.push(traditionalRatio);
    const clientsPerEmp = lerp(AI_NATIVE_STAFFING_RAMP_START, data.aiNativeClientsPerEmployee, m / MONTHS);
    aiNative.push(100 / clientsPerEmp);
  }

  void xMonth;

  return { traditional, aiNative };
}

// ── Y-axis domain ──────────────────────────────────────────────────────────────

/** Returns a clean { min, max, step } for the y-axis given both curve arrays. */
export function yAxisDomain(
  traditional: number[],
  aiNative: number[],
  tab: MetricTab
): { min: number; max: number; step: number; gridCount: number } {
  const all = [...traditional, ...aiNative];
  const dataMin = Math.min(...all);
  const dataMax = Math.max(...all);
  const padding = (dataMax - dataMin) * 0.1;

  // Round to a clean interval based on tab
  const interval = tab === "revenue" ? 10_000 : tab === "staffing" ? 1 : 50;
  const min = Math.floor((dataMin - padding) / interval) * interval;
  const max = Math.ceil((dataMax + padding) / interval) * interval;
  const range = max - min;
  const gridCount = 4;
  const step = Math.ceil(range / gridCount / interval) * interval;

  return { min: Math.max(0, min), max, step, gridCount };
}

// ── SVG coordinate helpers ─────────────────────────────────────────────────────

const SVG_LEFT   = 50;  // left margin (y-axis labels)
const SVG_RIGHT  = 560; // viewBox width
const SVG_TOP    = 10;  // top margin
const SVG_BOTTOM = 160; // bottom of chart area (x-axis labels below)
const CHART_W    = SVG_RIGHT - SVG_LEFT;
const CHART_H    = SVG_BOTTOM - SVG_TOP;

/** Convert (month, value) to SVG (x, y) coordinates */
export function toSvgPoint(
  month: number,
  value: number,
  yMin: number,
  yMax: number
): { x: number; y: number } {
  const x = SVG_LEFT + (month / MONTHS) * CHART_W;
  const y = SVG_TOP + (1 - (value - yMin) / (yMax - yMin)) * CHART_H;
  return { x, y };
}

/** Convert an array of values to an SVG polyline points string */
export function toPolylinePoints(
  values: number[],
  yMin: number,
  yMax: number
): string {
  return values
    .map((v, m) => {
      const { x, y } = toSvgPoint(m, v, yMin, yMax);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// ── Callout copy ───────────────────────────────────────────────────────────────

/** Format a currency value to nearest $10 */
export function fmtCurrency(n: number): string {
  const rounded = Math.round(n / 10) * 10;
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(rounded);
}

export { MONTHS, SVG_LEFT, SVG_RIGHT, SVG_TOP, SVG_BOTTOM };
```

- [ ] **Step 2.2: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2.3: Quick sanity check — run a node snippet to verify math**

```bash
node -e "
const { crossoverMonth, costCurvePoints } = require('./src/lib/costCurve.ts');
// This won't work directly (TypeScript) — just check the tsc output above is clean.
// If you want to verify formulas: check that crossoverMonth(74, 'normal') = 18
console.log('Math check: 36 - 74*0.24 =', Math.round(36 - 74*0.24)); // expected: 18
"
```

Expected output: `Math check: 36 - 74*0.24 = 18`

- [ ] **Step 2.4: Commit**

```bash
git add src/lib/costCurve.ts
git commit -m "feat: add cost curve math utilities (crossover, curve points, SVG helpers)"
```

---

## Task 3: CSS Animation

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 3.1: Add pulse-ring animation to globals.css**

Open `src/app/globals.css`. Find the section with existing animation keyframes (search for `@keyframes`). Add immediately after the last existing `@keyframes` block:

```css
/* ── Cost Curve crossover dot animation ──────────────────────── */
@keyframes pulse-ring {
  0%   { r: 11px; opacity: 0.4; }
  50%  { r: 16px; opacity: 0; }
  100% { r: 11px; opacity: 0.4; }
}

.crossover-ring {
  animation: pulse-ring 2s ease-in-out infinite;
}
```

- [ ] **Step 3.2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add pulse-ring animation for cost curve crossover dot"
```

---

## Task 4: CostCurveChart Component

**Files:**
- Create: `src/app/calculator/CostCurveChart.tsx`

This is the main component. Build it in sub-steps, verifying the dev server at the end.

- [ ] **Step 4.1: Create the component skeleton with props, state, and empty render**

```typescript
"use client";

import { useState } from "react";
import type { Industry, SectorPlaybook, AssessmentResult, BusinessSize } from "@/types";
import type { Scenario, MetricTab } from "@/lib/costCurve";
import {
  crossoverMonth, costCurvePoints, revenueCurvePoints, staffingCurvePoints,
  yAxisDomain, toPolylinePoints, toSvgPoint, fmtCurrency,
  MONTHS, SVG_LEFT, SVG_RIGHT, SVG_TOP, SVG_BOTTOM,
} from "@/lib/costCurve";

interface Props {
  industry: Industry;
  playbook: SectorPlaybook;
  result: AssessmentResult;
}

export function CostCurveChart({ industry, playbook, result }: Props) {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [activeTab, setActiveTab] = useState<MetricTab>("cost");
  const [playbookOpen, setPlaybookOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden mt-6">
      <p>CostCurveChart placeholder — {industry.shortName}</p>
    </div>
  );
}
```

- [ ] **Step 4.2: Wire into ResultsClient temporarily to verify it renders (see Task 5 Step 5.1 first)**

Skip ahead to Task 5 Step 5.1 to wire the prop, then come back.

- [ ] **Step 4.3: Build the derived data block**

Replace the placeholder return with the real computed data. Add this block before the return statement:

```typescript
  // ── Derived curve data ─────────────────────────────────────────────────────
  const industryAvg = result.industryAverage;
  const xMonth = crossoverMonth(industryAvg, scenario);
  const crossoverVisible = xMonth <= MONTHS;
  const { costCurve } = playbook;
  const businessSize = result.input.businessSize as BusinessSize;

  const { traditional: tradPts, aiNative: aiPts } = (() => {
    if (activeTab === "cost")     return costCurvePoints(costCurve, scenario, industryAvg);
    if (activeTab === "revenue")  return revenueCurvePoints(businessSize, scenario, industryAvg);
    return staffingCurvePoints(costCurve, scenario, industryAvg);
  })();

  const domain = yAxisDomain(tradPts, aiPts, activeTab);
  const tradPolyline = toPolylinePoints(tradPts, domain.min, domain.max);
  const aiPolyline   = toPolylinePoints(aiPts,  domain.min, domain.max);

  const crossoverSvg = crossoverVisible
    ? toSvgPoint(xMonth, tradPts[xMonth], domain.min, domain.max)
    : null;

  // Danger zone polygon: all points from crossover to month 24 on both curves
  const dangerPolygon = crossoverVisible
    ? (() => {
        const tradAfter = tradPts.slice(xMonth).map((v, i) => toSvgPoint(xMonth + i, v, domain.min, domain.max));
        const aiAfter   = aiPts.slice(xMonth).map((v, i) => toSvgPoint(xMonth + i, v, domain.min, domain.max));
        const pts = [
          ...tradAfter,
          ...[...aiAfter].reverse(),
        ].map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
        return pts;
      })()
    : null;

  // Y-axis grid line values
  const gridValues: number[] = [];
  for (let i = 0; i <= domain.gridCount; i++) {
    gridValues.push(domain.min + i * domain.step);
  }

  // Callout copy
  const tradCostAtCrossover = activeTab === "cost" && crossoverVisible
    ? tradPts[xMonth]
    : null;
  const aiCostPct = tradCostAtCrossover
    ? Math.round((tradPts[xMonth] / costCurve.avgMonthlyClientCost) * 100)
    : null;

  // Y-axis label
  const yLabel =
    activeTab === "cost"     ? "Cost per client (CAD/month)" :
    activeTab === "revenue"  ? "Monthly revenue at risk (CAD)" :
                               "Employees per 100 clients";

  // Format y-axis tick value
  const fmtTick = (v: number) =>
    activeTab === "revenue"
      ? `$${(v / 1000).toFixed(0)}k`
      : activeTab === "cost"
      ? `$${v}`
      : `${v}`;
```

- [ ] **Step 4.4: Build the full JSX return**

Replace the placeholder return with the complete JSX:

```tsx
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden mt-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
            The Cost Curve{" "}
            <span className="text-xs font-medium px-2 py-0.5 rounded-full border ml-1"
              style={{ color: "var(--color-accent-gold)", borderColor: "var(--color-gold-pale)", backgroundColor: "var(--color-gold-pale)" }}>
              {industry.shortName}
            </span>
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            How long before an AI-native competitor can undercut your pricing and still profit?
          </p>
        </div>

        {/* Scenario toggle */}
        <div className="flex-shrink-0">
          <p className="text-[0.6rem] uppercase tracking-widest mb-1 text-right"
            style={{ color: "var(--color-text-tertiary)" }}>Adoption speed</p>
          <div className="flex gap-1">
            {(["slow", "normal", "fast"] as Scenario[]).map((s) => {
              const titles: Record<Scenario, string> = {
                slow: "Conservative — incumbents have more time to adapt",
                normal: "Based on current national AI adoption acceleration",
                fast: "Aggressive — Manitoba catches up to national average quickly",
              };
              return (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  title={titles[s]}
                  className="text-xs px-2.5 py-1 rounded border transition-colors capitalize"
                  style={{
                    backgroundColor: scenario === s ? "var(--color-navy)" : "transparent",
                    color: scenario === s ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
                    borderColor: scenario === s ? "var(--color-navy)" : "var(--color-border)",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Metric tabs ─────────────────────────────────────────── */}
      <div className="flex border-b border-[var(--color-border)] px-5">
        {([
          { id: "cost",     label: "Cost per client" },
          { id: "revenue",  label: "Revenue at risk" },
          { id: "staffing", label: "Staffing ratio" },
        ] as { id: MetricTab; label: string }[]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="text-xs py-2.5 px-3 border-b-2 transition-colors"
            style={{
              borderColor: activeTab === id ? "var(--color-accent-gold)" : "transparent",
              color: activeTab === id ? "var(--color-accent-gold)" : "var(--color-text-secondary)",
              marginBottom: "-1px",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Chart ───────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-2">

        {/* Legend */}
        <div className="flex gap-5 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5" style={{ background: "var(--color-risk-high)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Your firm (traditional)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-px border-t-2 border-dashed" style={{ borderColor: "var(--color-risk-low)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>AI-native entrant</span>
          </div>
          {crossoverVisible && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-accent-gold)" }} />
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Disruption event</span>
            </div>
          )}
        </div>

        {/* SVG chart */}
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_RIGHT} ${SVG_BOTTOM + 20}`}
          role="img"
          aria-label={`Cost curve chart: ${crossoverVisible ? `disruption event at month ${xMonth}` : "no disruption event in 24-month window"} for ${industry.shortName}`}
        >
          {/* Grid lines + Y labels */}
          {gridValues.map((v) => {
            const { y } = toSvgPoint(0, v, domain.min, domain.max);
            return (
              <g key={v}>
                <line x1={SVG_LEFT} y1={y} x2={SVG_RIGHT} y2={y}
                  stroke="var(--color-border)" strokeWidth={0.5} />
                <text x={SVG_LEFT - 4} y={y + 3.5} textAnchor="end"
                  fontSize={9} fill="var(--color-text-tertiary)" fontFamily="sans-serif">
                  {fmtTick(v)}
                </text>
              </g>
            );
          })}

          {/* X-axis line */}
          <line x1={SVG_LEFT} y1={SVG_BOTTOM} x2={SVG_RIGHT} y2={SVG_BOTTOM}
            stroke="var(--color-border-strong)" strokeWidth={1} />

          {/* X-axis labels */}
          {[0, 6, 12, 18, 24].map((m) => {
            const x = SVG_LEFT + (m / MONTHS) * (SVG_RIGHT - SVG_LEFT);
            return (
              <text key={m} x={x} y={SVG_BOTTOM + 14} textAnchor="middle"
                fontSize={9} fill="var(--color-text-tertiary)" fontFamily="sans-serif">
                {m === 0 ? "Now" : `${m}mo`}
              </text>
            );
          })}

          {/* Danger zone */}
          {dangerPolygon && (
            <polygon points={dangerPolygon} fill="rgba(220,38,38,0.05)" />
          )}

          {/* Traditional line */}
          <polyline points={tradPolyline} fill="none"
            stroke="#DC2626" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* AI-native line (dashed) */}
          <polyline points={aiPolyline} fill="none"
            stroke="#15803D" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="6,3" />

          {/* Crossover vertical guide line */}
          {crossoverSvg && (
            <line x1={crossoverSvg.x} y1={crossoverSvg.y} x2={crossoverSvg.x} y2={SVG_BOTTOM}
              stroke="#D97706" strokeWidth={1} strokeDasharray="4,2" />
          )}

          {/* Crossover dot + pulse ring */}
          {crossoverSvg && (
            <>
              <circle
                className="crossover-ring"
                cx={crossoverSvg.x} cy={crossoverSvg.y}
                r={11} stroke="#D97706" strokeWidth={1.5} fill="none"
              />
              <circle cx={crossoverSvg.x} cy={crossoverSvg.y} r={6} fill="#D97706" />
            </>
          )}
        </svg>

        {/* Y-axis label (rotated, below chart for simplicity) */}
        <p className="text-[0.6rem] text-center mt-1" style={{ color: "var(--color-text-tertiary)" }}>
          {yLabel}
        </p>
      </div>

      {/* ── Crossover callout ────────────────────────────────────── */}
      <div className="px-5 pb-4">
        {crossoverVisible && activeTab === "cost" && tradCostAtCrossover ? (
          <div className="rounded-lg border-l-4 px-4 py-3 mb-3"
            style={{ borderColor: "#DC2626", backgroundColor: "#FEF2F2" }}>
            <p className="text-sm font-semibold mb-1" style={{ color: "#DC2626" }}>
              ⚠ At month {xMonth}, an AI-native competitor breaks even at{" "}
              {fmtCurrency(tradCostAtCrossover)}/client — {aiCostPct}% of your rate
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#7F1D1D" }}>
              After this point, a lean AI-native firm can poach your price-sensitive clients
              and still profit. Manitoba&apos;s low AI adoption rate (~2%) means most local firms
              are already inside this window.
            </p>
          </div>
        ) : crossoverVisible ? (
          <div className="rounded-lg border px-4 py-3 mb-3"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-muted)" }}>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Disruption event at month {xMonth}. Switch to the Cost per client tab to see the pricing gap.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border px-4 py-3 mb-3"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-muted)" }}>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              At current adoption rates, a disruption event for your sector falls outside the
              24-month window. Switch to the <strong>Fast</strong> scenario to see the accelerated case.
            </p>
          </div>
        )}

        {/* ── Playbook reveal ──────────────────────────────────── */}
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={() => setPlaybookOpen(!playbookOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-muted)]"
          >
            <span className="text-sm font-semibold" style={{ color: "var(--color-accent-gold)" }}>
              {playbookOpen ? "▾" : "▸"}{" "}
              What to do before you reach month {Math.min(xMonth, MONTHS)}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              {playbook.actions12Month.length} actions
            </span>
          </button>

          {playbookOpen && (
            <div className="border-t px-4 py-3 flex flex-col gap-2"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-muted)" }}>
              {playbook.actions12Month.slice(0, 4).map((action, i) => (
                <div key={i} className="flex gap-2 text-xs leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}>
                  <span className="font-bold flex-shrink-0"
                    style={{ color: "var(--color-accent-gold)" }}>{i + 1}.</span>
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
```

- [ ] **Step 4.5: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4.6: Commit**

```bash
git add src/app/calculator/CostCurveChart.tsx
git commit -m "feat: add CostCurveChart component with SVG chart, scenario toggle, metric tabs"
```

---

## Task 5: Wire Up Props

**Files:**
- Modify: `src/app/calculator/CalculatorClient.tsx`
- Modify: `src/app/calculator/ResultsClient.tsx`

- [ ] **Step 5.1: Add `industry?: Industry` prop to `ResultsClient`**

In `ResultsClient.tsx`, find the props interface (around line 513):

```typescript
// BEFORE:
  result: AssessmentResult;
  industryName: string;
  playbook?: SectorPlaybook;
  threatScenario?: ThreatScenario;
  onReset: () => void;

// AFTER:
  result: AssessmentResult;
  industryName: string;
  industry?: Industry;
  playbook?: SectorPlaybook;
  threatScenario?: ThreatScenario;
  onReset: () => void;
```

Add `industry` to the destructured props at the top of the function body.

- [ ] **Step 5.2: Import `Industry` type in `ResultsClient.tsx`**

`Industry` is already imported in the file (check `import type { ... } from "@/types"`). If not, add it.

- [ ] **Step 5.3: Import and render `CostCurveChart` in `ResultsClient.tsx`**

Add the import at the top:
```typescript
import { CostCurveChart } from "./CostCurveChart";
```

Find the section after the `{threatScenario && ...}` block (the last existing section, around line 644). Add immediately after it:

```tsx
{/* Cost Curve Convergence */}
{playbook && industry && (
  <CostCurveChart
    industry={industry}
    playbook={playbook}
    result={result}
  />
)}
```

- [ ] **Step 5.4: Pass `industry` object from `CalculatorClient.tsx`**

In `CalculatorClient.tsx`, find the `ResultsClient` render (around line 560):

```typescript
// BEFORE:
<ResultsClient
  result={activeResult}
  industryName={industries.find((i) => i.naicsCode === activeResult.input.naicsCode)?.shortName ?? "Your sector"}
  playbook={playbooks.find((p) => p.naicsCode === activeResult.input.naicsCode)}
  threatScenario={...}
  onReset={...}
/>

// AFTER — add the industry prop (the find is already happening for industryName):
const activeIndustry = industries.find((i) => i.naicsCode === activeResult.input.naicsCode);
<ResultsClient
  result={activeResult}
  industryName={activeIndustry?.shortName ?? "Your sector"}
  industry={activeIndustry}
  playbook={playbooks.find((p) => p.naicsCode === activeResult.input.naicsCode)}
  threatScenario={...}
  onReset={...}
/>
```

Note: `initialResult` block (around line 510) has the same pattern — update that `ResultsClient` render too if it exists.

- [ ] **Step 5.5: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5.6: Commit**

```bash
git add src/app/calculator/CalculatorClient.tsx src/app/calculator/ResultsClient.tsx
git commit -m "feat: wire CostCurveChart into calculator results via industry prop"
```

---

## Task 6: Visual Verification

- [ ] **Step 6.1: Start the dev server if not running**

```bash
npm run dev
```

- [ ] **Step 6.2: Navigate to the calculator and complete a full assessment**

Go to `http://localhost:3000/calculator`. Complete all 6 steps using **Professional Services (NAICS 54)**, **Small business**, **Exploring AI**. Submit.

- [ ] **Step 6.3: Verify the Cost Curve section appears**

Scroll past the score gauge and recommendations. The CostCurveChart should appear with:
- Header showing "The Cost Curve" and "Professional Services" chip
- Three scenario buttons (Slow / Normal / Fast), "Normal" active by default
- Three metric tabs, "Cost per client" active
- SVG chart with red solid line (traditional) and green dashed line (AI-native)
- Gold pulsing dot at approximately month 18 (for Professional Services, score ~65)
- Red callout: "At month 18, an AI-native competitor breaks even at..."
- Collapsed playbook section showing "▸ What to do before you reach month 18"

- [ ] **Step 6.4: Test the scenario toggle**

Click **Fast** — the crossover dot should move left (earlier month, around month 11). Click **Slow** — crossover moves right (around month 25, making it go off-chart). Verify the "outside 24-month window" callout appears for Slow.

- [ ] **Step 6.5: Test the metric tabs**

Click **Revenue at risk** — the y-axis should change to CAD amounts based on business size. Red line should be flat (baseline revenue). Green dashed line should grow from zero. Click **Staffing ratio** — red line flat, green dashed line starts high and drops.

- [ ] **Step 6.6: Test the playbook reveal**

Click "▸ What to do before you reach month X" — section should expand showing 4 numbered actions. Click again to collapse.

- [ ] **Step 6.7: Test with a low-risk sector**

Repeat assessment with **Public Administration (NAICS 91)**. Verify crossover is later (lower risk score = later crossover). Verify the chart still renders correctly.

- [ ] **Step 6.8: Final commit**

```bash
git add -A
git commit -m "feat: Cost Curve Convergence — complete implementation

Adds CostCurveChart to calculator results showing traditional vs AI-native
cost convergence over 24 months. Three scenario speeds (Slow/Normal/Fast),
three metric tabs (cost/revenue/staffing), pulsing disruption event marker,
and collapsed playbook reveal. Driven by real sector data from playbooks.json."
```

---

## Quick Reference

**Key files:**
- Math: `src/lib/costCurve.ts`
- Component: `src/app/calculator/CostCurveChart.tsx`
- Types: `src/types/index.ts` → `CostCurveData`, `SectorPlaybook.costCurve`
- Data: `public/data/sector-playbooks.json` → `costCurve` blocks
- Animation: `src/app/globals.css` → `.crossover-ring`

**Color tokens (use these, not hex):**
- Gold accent: `var(--color-accent-gold)` / `#D97706`
- Risk high (traditional line): `var(--color-risk-high)` / `#DC2626`
- Risk low (AI-native line): `var(--color-risk-low)` / `#15803D`
- Border: `var(--color-border)` / `#E2E8F0`

**Math sanity checks:**
- `crossoverMonth(74, 'normal')` → 18
- `crossoverMonth(74, 'fast')`   → 11
- `crossoverMonth(74, 'slow')`   → 25 (off chart → no dot rendered)
- `crossoverMonth(35, 'normal')` → 28 (off chart)
