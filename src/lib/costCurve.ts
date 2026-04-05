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

/** AI-native firms begin with few clients relative to staff (high setup cost before workflows are tuned) */
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

export const SVG_LEFT   = 50;  // left margin (y-axis labels)
export const SVG_RIGHT  = 560; // viewBox width
export const SVG_TOP    = 10;  // top margin
export const SVG_BOTTOM = 160; // bottom of chart area (x-axis labels below)
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

export { MONTHS };
