"use client";

import { useState } from "react";
import type { Industry, RiskTier } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTier(score: number): RiskTier {
  if (score > 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

const TIER_ORDER: Record<RiskTier, number> = { high: 2, medium: 1, low: 0 };

const TIER_LABEL: Record<RiskTier, string> = {
  high: "High", medium: "Medium", low: "Low",
};

// ── Scenarios ──────────────────────────────────────────────────────────────────
// Each scenario provides a `compute` function that derives a score from an
// Industry record. All computation is deterministic and runs at render time
// from precomputed scenario scores passed as props.

export type ScenarioId = "baseline" | "rapid-ai" | "ahead" | "behind";

export interface ScenarioIndustry {
  naicsCode: string;
  shortName: string;
  riskTier: RiskTier;
  sectorRiskScore: number;
  aiAdoptionRate: number;
  scores: Record<ScenarioId, { score: number; tier: RiskTier }>;
}

const SCENARIOS: Array<{
  id: ScenarioId;
  label: string;
  eyebrow: string;
  description: string;
  detail: string;
}> = [
  {
    id: "baseline",
    label: "2024 Baseline",
    eyebrow: "Current data",
    description: "Current composite scores derived from Statistics Canada 2023 data and peer-reviewed automation research.",
    detail: "This is the reference point. Scores reflect peer-reviewed methodology: 30% automation probability, 30% AI occupation exposure, 25% language AI impact, 15% sector adoption gap.",
  },
  {
    id: "rapid-ai",
    label: "Rapid AI (2027)",
    eyebrow: "Accelerated timeline",
    description: "LLM and automation tools become mainstream in 2–3 years rather than 5+. Sectors with low current adoption face higher near-term pressure.",
    detail: "Sectors with AI adoption below 20% receive +10 points; below 40% receive +5 points. Reflects the risk of being caught unprepared as AI normalizes quickly.",
  },
  {
    id: "ahead",
    label: "Already Using AI",
    eyebrow: "Leading position",
    description: "Businesses actively deploying AI tools today. First-mover advantage and internal familiarity reduce effective disruption exposure by 30%.",
    detail: "Applies the 0.70 adoption modifier from the calculator methodology. Businesses using AI are driving change rather than reacting to it.",
  },
  {
    id: "behind",
    label: "Not Considering AI",
    eyebrow: "Lagging position",
    description: "Small businesses not currently exploring AI tools. Adaptation lag and resource constraints amplify exposure — especially in high-risk sectors.",
    detail: "Applies the 1.10 micro-business size multiplier. Reflects higher effective risk for businesses without capacity to manage AI transitions proactively.",
  },
];

// ── Badge components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: RiskTier }) {
  const cls = {
    high:   "badge-high",
    medium: "badge-medium",
    low:    "badge-low",
  }[tier];
  return <span className={cls}>{TIER_LABEL[tier]}</span>;
}

function TierChangePill({
  baseline,
  scenario,
}: {
  baseline: RiskTier;
  scenario: RiskTier;
}) {
  if (baseline === scenario) return null;
  const worsened = TIER_ORDER[scenario] > TIER_ORDER[baseline];
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[0.6rem] font-bold tracking-wide px-1.5 py-0.5 rounded-full"
      style={{
        backgroundColor: worsened ? "#FEF2F2" : "#F0FDF4",
        color: worsened ? "#DC2626" : "#15803D",
      }}
      aria-label={worsened ? `Tier worsened from ${baseline} to ${scenario}` : `Tier improved from ${baseline} to ${scenario}`}
    >
      {worsened ? "▲" : "▼"} {TIER_LABEL[scenario]}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ScenariosClient({
  industries,
}: {
  industries: ScenarioIndustry[];
}) {
  const [activeId, setActiveId] = useState<ScenarioId>("baseline");

  const activeScenario = SCENARIOS.find(s => s.id === activeId)!;

  // Compute summary stats for the active scenario
  const stats = {
    high:    industries.filter(i => i.scores[activeId].tier === "high").length,
    medium:  industries.filter(i => i.scores[activeId].tier === "medium").length,
    low:     industries.filter(i => i.scores[activeId].tier === "low").length,
    changed: industries.filter(
      i => i.scores[activeId].tier !== i.scores["baseline"].tier
    ).length,
  };

  // Sort industries by scenario score descending
  const sorted = [...industries].sort(
    (a, b) => b.scores[activeId].score - a.scores[activeId].score
  );

  return (
    <>
      {/* ── Scenario selector ─────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Select a scenario"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {SCENARIOS.map((s) => {
          const isActive = s.id === activeId;
          const scenarioHighCount = industries.filter(
            i => i.scores[s.id].tier === "high"
          ).length;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={isActive}
              aria-controls="scenario-panel"
              id={`tab-${s.id}`}
              onClick={() => setActiveId(s.id)}
              className="flex flex-col gap-1.5 rounded-xl p-4 text-left transition-all"
              style={{
                backgroundColor: isActive
                  ? "var(--color-navy-deep)"
                  : "var(--color-paper-deep)",
                border: isActive
                  ? "2px solid var(--color-gold)"
                  : "2px solid var(--color-border)",
                boxShadow: isActive
                  ? "0 4px 24px rgba(11, 25, 41, 0.18)"
                  : "none",
              }}
            >
              <p
                className="text-[0.55rem] font-bold tracking-[0.25em] uppercase"
                style={{ color: isActive ? "var(--color-gold)" : "var(--color-text-tertiary)" }}
              >
                {s.eyebrow}
              </p>
              <p
                className="font-display font-bold text-base leading-tight"
                style={{
                  color: isActive
                    ? "var(--color-text-inverse)"
                    : "var(--color-text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.label}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color: isActive ? "rgba(248,250,252,0.55)" : "var(--color-text-tertiary)",
                }}
              >
                <span
                  className="font-bold"
                  style={{ color: isActive ? "#F87171" : "#DC2626" }}
                >
                  {scenarioHighCount}
                </span>{" "}
                high-exposure sectors
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Scenario description + stats ──────────────────────────── */}
      <section
        id="scenario-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeId}`}
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: "var(--color-paper-deep)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
          {/* Description */}
          <div className="flex-1">
            <p
              className="text-[0.6rem] font-bold tracking-[0.25em] uppercase mb-2"
              style={{ color: "var(--color-gold)" }}
            >
              Scenario · {activeScenario.label}
            </p>
            <p
              className="text-base font-semibold leading-snug mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              {activeScenario.description}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {activeScenario.detail}
            </p>
          </div>

          {/* Stats grid */}
          <dl
            className="grid grid-cols-2 gap-3 shrink-0 sm:grid-cols-4 lg:grid-cols-2"
            aria-label="Scenario summary statistics"
          >
            {[
              { value: stats.high, label: "High exposure", color: "#DC2626" },
              { value: stats.medium, label: "Medium exposure", color: "#B45309" },
              { value: stats.low, label: "Low exposure", color: "#15803D" },
              {
                value: activeId === "baseline" ? "—" : stats.changed,
                label: "Tier changes",
                color: "var(--color-navy)",
              },
            ].map(({ value, label, color }) => (
              <div
                key={label}
                className="rounded-lg border p-3 text-center"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <dt
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {label}
                </dt>
                <dd
                  className="font-display font-bold text-2xl leading-none mt-1"
                  style={{ color, letterSpacing: "-0.03em" }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden shadow-sm"
        style={{ borderColor: "var(--color-border)" }}
      >
        <table
          className="w-full border-collapse"
          aria-label={`Manitoba sector risk scores under ${activeScenario.label} scenario`}
        >
          <caption className="sr-only">
            All 20 Manitoba sectors ranked by AI disruption exposure score under the{" "}
            {activeScenario.label} scenario. Baseline scores shown for comparison.
          </caption>
          <thead>
            <tr style={{ backgroundColor: "var(--color-paper-deep)" }}>
              <th
                scope="col"
                className="py-3 pl-5 w-8 text-left text-[0.6rem] font-bold tracking-widest uppercase"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <span className="sr-only">Rank</span>
                <span aria-hidden="true">#</span>
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-[0.6rem] font-bold tracking-widest uppercase"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Sector
              </th>
              {activeId !== "baseline" && (
                <th
                  scope="col"
                  className="py-3 pr-4 text-left text-[0.6rem] font-bold tracking-widest uppercase hidden sm:table-cell"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Baseline score
                </th>
              )}
              <th
                scope="col"
                className="py-3 pr-4 text-left text-[0.6rem] font-bold tracking-widest uppercase"
                style={{ color: "var(--color-gold)" }}
              >
                {activeId === "baseline" ? "Score" : `${activeScenario.label} score`}
              </th>
              <th
                scope="col"
                className="py-3 pr-5 w-28 text-right text-[0.6rem] font-bold tracking-widest uppercase"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Tier
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "var(--color-surface)" }}>
            {sorted.map((industry, i) => {
              const baseline = industry.scores["baseline"];
              const active   = industry.scores[activeId];
              const delta    = active.score - baseline.score;

              return (
                <tr
                  key={industry.naicsCode}
                  className="border-b border-slate-100 last:border-0 hover:bg-amber-50/40 transition-colors"
                  style={{
                    // Highlight rows where tier changed
                    backgroundColor:
                      active.tier !== baseline.tier
                        ? "rgba(254, 243, 199, 0.25)"
                        : undefined,
                  }}
                >
                  {/* Rank */}
                  <td
                    className="py-3.5 pl-5 text-xs font-mono tabular-nums"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {i + 1}
                  </td>

                  {/* Sector name */}
                  <th
                    scope="row"
                    className="py-3.5 px-4 text-sm font-semibold text-left"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                    }}
                  >
                    {industry.shortName}
                  </th>

                  {/* Baseline bar — only shown when comparing against a non-baseline scenario */}
                  {activeId !== "baseline" && (
                    <td className="py-3.5 pr-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex-1 rounded-full overflow-hidden"
                          style={{ backgroundColor: "#E2E8F0", height: "6px" }}
                          aria-hidden="true"
                        >
                          <div
                            className={`h-full rounded-full opacity-40 risk-bar-${baseline.tier}`}
                            style={{ width: `${baseline.score}%` }}
                          />
                        </div>
                        <span
                          className="w-7 text-right text-xs font-mono tabular-nums"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          {baseline.score}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Scenario bar + delta */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: "#E2E8F0", height: "8px" }}
                        aria-hidden="true"
                      >
                        <div
                          className={`h-full rounded-full risk-bar-${active.tier}`}
                          style={{ width: `${active.score}%` }}
                        />
                      </div>
                      <span
                        className="w-7 text-right text-sm font-mono tabular-nums font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                        aria-label={`Score: ${active.score}`}
                      >
                        {active.score}
                      </span>
                      {/* Delta */}
                      {activeId !== "baseline" && delta !== 0 && (
                        <span
                          className="w-10 text-xs font-mono tabular-nums text-right shrink-0"
                          style={{
                            color: delta > 0 ? "#DC2626" : "#15803D",
                            fontWeight: 600,
                          }}
                          aria-label={`${delta > 0 ? "increased by" : "decreased by"} ${Math.abs(delta)}`}
                        >
                          {delta > 0 ? "+" : ""}{delta}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Tier + change indicator */}
                  <td className="py-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <TierChangePill
                        baseline={baseline.tier}
                        scenario={active.tier}
                      />
                      <TierBadge tier={active.tier} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footnote */}
      <p
        className="text-xs leading-relaxed"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Scenario scores are illustrative projections derived from the 2024 baseline using
        the methodology described in the{" "}
        <a
          href="/about"
          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-navy)" }}
        >
          About &amp; Methodology
        </a>{" "}
        page. They are not forecasts.
        Rows highlighted in amber indicate sectors where the scenario changes the risk tier.
      </p>
    </>
  );
}
