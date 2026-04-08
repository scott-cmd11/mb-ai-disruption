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
    label: "Where things stand",
    eyebrow: "Today's picture",
    description: "Current estimated AI disruption risk for each Manitoba industry, based on published research.",
    detail: "This is the starting point. Scores reflect how automatable the jobs are in each industry, how much AI is already being used, and how quickly businesses in that sector are adopting new tools.",
  },
  {
    id: "rapid-ai",
    label: "AI spreads quickly",
    eyebrow: "If AI moves fast",
    description: "What if AI tools become the norm within 2–3 years? Industries that haven't started yet would have less time to adapt.",
    detail: "Industries with little AI use today would face more pressure in this scenario — because fast-moving change would leave less runway to catch up. The further behind, the bigger the impact.",
  },
  {
    id: "ahead",
    label: "Already using AI",
    eyebrow: "Your business is ahead",
    description: "If your business is already using AI tools, you're in a stronger position. Early adopters face less disruption because they're leading the change rather than reacting to it.",
    detail: "Risk scores drop by about 30% for businesses actively using AI. Getting started early pays off — familiarity with these tools reduces the shock when change arrives.",
  },
  {
    id: "behind",
    label: "Not started yet",
    eyebrow: "Your business hasn't started",
    description: "Businesses that haven't begun thinking about AI may face more pressure — especially those in industries that are already at higher risk.",
    detail: "Risk scores rise by about 10% for businesses not yet exploring AI tools. This reflects the added challenge of having to catch up quickly once change is already underway.",
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
                higher-risk industries
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
              { value: stats.high, label: "Higher risk", color: "#DC2626" },
              { value: stats.medium, label: "Moderate risk", color: "#B45309" },
              { value: stats.low, label: "Lower risk", color: "#15803D" },
              {
                value: activeId === "baseline" ? "—" : stats.changed,
                label: "Risk level shifts",
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
          aria-label={`Manitoba sector risk scores — ${activeScenario.label}`}
        >
          <caption className="sr-only">
            All 20 Manitoba sectors ranked by estimated AI disruption risk under the{" "}
            {activeScenario.label} scenario.
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
                Industry
              </th>
              <th
                scope="col"
                className="py-3 pr-4 text-left text-[0.6rem] font-bold tracking-widest uppercase"
                style={{ color: "var(--color-gold)" }}
              >
                Risk score
              </th>
              {activeId !== "baseline" && (
                <th
                  scope="col"
                  className="py-3 pr-4 text-left text-[0.6rem] font-bold tracking-widest uppercase hidden sm:table-cell"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  vs. today
                </th>
              )}
              <th
                scope="col"
                className="py-3 pr-5 w-28 text-right text-[0.6rem] font-bold tracking-widest uppercase"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Risk level
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "var(--color-surface)" }}>
            {sorted.map((industry, i) => {
              const baseline = industry.scores["baseline"];
              const active   = industry.scores[activeId];
              const delta    = active.score - baseline.score;
              const tierChanged = active.tier !== baseline.tier;

              return (
                <tr
                  key={industry.naicsCode}
                  className="border-b border-slate-100 last:border-0 hover:bg-amber-50/40 transition-colors"
                  style={{
                    backgroundColor: tierChanged
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

                  {/* Industry name */}
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

                  {/* Risk score bar */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: "#E2E8F0", height: "8px", minWidth: "80px" }}
                        aria-hidden="true"
                      >
                        <div
                          className={`h-full rounded-full risk-bar-${active.tier}`}
                          style={{ width: `${active.score}%` }}
                        />
                      </div>
                      <span
                        className="w-7 text-right text-sm font-mono tabular-nums font-bold shrink-0"
                        style={{ color: "var(--color-text-primary)" }}
                        aria-label={`Risk score: ${active.score} out of 100`}
                      >
                        {active.score}
                      </span>
                    </div>
                  </td>

                  {/* Change from today */}
                  {activeId !== "baseline" && (
                    <td className="py-3.5 pr-4 hidden sm:table-cell">
                      <div className="flex flex-col gap-0.5">
                        {delta !== 0 ? (
                          <span
                            className="text-xs font-semibold tabular-nums"
                            style={{ color: delta > 0 ? "#DC2626" : "#15803D" }}
                            aria-label={delta > 0 ? `${delta} points higher than today` : `${Math.abs(delta)} points lower than today`}
                          >
                            {delta > 0 ? `↑ ${delta} pts higher` : `↓ ${Math.abs(delta)} pts lower`}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>no change</span>
                        )}
                        {tierChanged && (
                          <span
                            className="text-[0.6rem] font-bold tracking-wide"
                            style={{ color: TIER_ORDER[active.tier] > TIER_ORDER[baseline.tier] ? "#DC2626" : "#15803D" }}
                          >
                            {TIER_ORDER[active.tier] > TIER_ORDER[baseline.tier]
                              ? `moves to ${TIER_LABEL[active.tier]} risk`
                              : `drops to ${TIER_LABEL[active.tier]} risk`}
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Risk level badge */}
                  <td className="py-3.5 pr-5 text-right">
                    <TierBadge tier={active.tier} />
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
