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
            <div className="w-5 h-0.5" style={{ background: "#DC2626" }} />
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Your firm (traditional)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-px border-t-2 border-dashed" style={{ borderColor: "#15803D" }} />
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
            stroke="var(--color-border)" strokeWidth={1} />

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

        {/* Y-axis label */}
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

        {/* Data provenance note */}
        <p className="text-[0.65rem] mt-3 leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
          <span className="font-semibold">Illustrative model.</span>{" "}
          Crossover timing and cost projections are derived from sector parameters and published AI adoption research — not empirical forecasts. Scenario speeds reflect Manitoba&apos;s current ~2% AI adoption rate (StatsCan CSBC 2024) relative to national acceleration trends.
        </p>

      </div>
    </div>
  );
}
