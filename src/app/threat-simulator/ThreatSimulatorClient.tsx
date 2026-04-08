"use client";

import { useState } from "react";
import Link from "next/link";
import type { ThreatScenario, Industry } from "@/types";

const fmt = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const fmtNum = new Intl.NumberFormat("en-CA");
const fmtPct = (n: number) => `${Math.round(n)}%`;

const ICONS: Record<string, string> = {
  megaphone: "\uD83D\uDCE3",
  calculator: "\uD83E\uddEE",
  scale: "\u2696\uFE0F",
  truck: "\uD83D\ude9A",
  headset: "\uD83C\uDFA7",
};

interface Props {
  scenarios: ThreatScenario[];
  industries: Industry[];
}

export function ThreatSimulatorClient({ scenarios }: Props) {
  const [selectedId, setSelectedId] = useState(scenarios[0]?.id ?? "");
  const active = scenarios.find((s) => s.id === selectedId) ?? scenarios[0];

  const costReduction = ((active.traditional.annualCost - active.aiNative.annualCost) / active.traditional.annualCost) * 100;
  const unitCostReduction = ((active.traditional.costPerUnit - active.aiNative.costPerUnit) / active.traditional.costPerUnit) * 100;

  // Parse output numbers for comparison (strip non-digits)
  const parseOutput = (s: string) => {
    const m = s.replace(/,/g, "").match(/[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
  };
  const tradOutput = parseOutput(active.traditional.output);
  const aiOutput = parseOutput(active.aiNative.output);
  const outputIncrease = tradOutput > 0 ? ((aiOutput - tradOutput) / tradOutput) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Scenario picker ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {scenarios.map((s) => {
          const isActive = s.id === selectedId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className="rounded-xl border px-4 py-3 text-left transition-all"
              style={{
                backgroundColor: isActive ? "var(--color-navy-deep)" : "var(--color-paper-deep)",
                borderColor: isActive ? "var(--color-gold)" : "var(--color-border)",
                borderWidth: isActive ? 2 : 1,
              }}
            >
              <span className="text-lg" aria-hidden="true">
                {ICONS[s.icon] ?? s.icon}
              </span>
              <p
                className="mt-1 text-sm font-semibold leading-snug"
                style={{ color: isActive ? "var(--color-text-inverse)" : "var(--color-text-primary)" }}
              >
                {s.label}
              </p>
              <p
                className="mt-0.5 text-xs"
                style={{ color: isActive ? "rgba(248,250,252,0.5)" : "var(--color-text-tertiary)" }}
              >
                vs {fmtNum.format(active.id === s.id ? s.traditional.teamSize : s.traditional.teamSize)} staff
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Comparison panel ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Traditional */}
        <ComparisonCard
          heading="Traditional Team"
          tint="warm"
          team={active.traditional}
        />
        {/* AI-Native */}
        <ComparisonCard
          heading="AI-Native Team"
          tint="cool"
          team={active.aiNative}
        />
      </div>

      {/* ── Illustrative disclaimer ──────────────────────────────────── */}
      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        <span className="font-semibold">Illustrative estimates.</span>{" "}
        Team sizes, costs, and output figures are modelled scenarios based on published industry research and are not verified case study data. Use as directional benchmarks, not precise forecasts.
      </p>

      {/* ── Delta callouts ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DeltaStat label="Cost reduction" value={fmtPct(costReduction)} />
        <DeltaStat label="Output increase" value={`+${fmtPct(outputIncrease)}`} />
        <DeltaStat label="Unit cost reduction" value={fmtPct(unitCostReduction)} />
      </div>

      {/* ── Key insight ──────────────────────────────────────────────── */}
      <div
        className="rounded-xl border-l-4 px-6 py-5"
        style={{
          borderColor: "var(--color-gold)",
          backgroundColor: "var(--color-paper-deep)",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: "var(--color-gold)" }}
        >
          Key Insight
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-primary)" }}
        >
          {active.keyInsight}
        </p>
        <p
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {active.source}
        </p>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2">
        <Link href="/calculator" className="btn-primary text-sm">
          Calculate your own risk score
        </Link>
        <Link
          href="/scenarios"
          className="text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: "var(--color-navy-deep)" }}
        >
          Explore scenarios →
        </Link>
      </div>

      {/* Cross-link to research page */}
      <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          Want to understand why these numbers are possible?{" "}
          <Link
            href="/threat-model"
            className="underline underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-navy-deep)" }}
          >
            Read the research behind this →
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function ComparisonCard({
  heading,
  tint,
  team,
}: {
  heading: string;
  tint: "warm" | "cool";
  team: ThreatScenario["traditional"];
}) {
  const bgTint = tint === "warm" ? "rgba(220, 38, 38, 0.04)" : "rgba(21, 128, 61, 0.04)";
  const accentColor = tint === "warm" ? "#DC2626" : "#15803D";

  return (
    <div
      className="rounded-xl border p-6 flex flex-col gap-4"
      style={{
        backgroundColor: bgTint,
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-1.5 w-8 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <h3
          className="font-display font-bold text-base"
          style={{ color: "var(--color-text-primary)" }}
        >
          {heading}
        </h3>
      </div>

      {/* Team size */}
      <div>
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          Team size
        </p>
        <p
          className="font-display font-bold"
          style={{ color: accentColor, fontSize: "2.5rem", lineHeight: 1, letterSpacing: "-0.03em" }}
        >
          {team.teamSize}
        </p>
      </div>

      {/* Roles */}
      <div>
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
          Roles
        </p>
        <div className="flex flex-wrap gap-1.5">
          {team.roles.map((r) => (
            <span
              key={r}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Annual cost */}
      <div>
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          Annual cost
        </p>
        <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
          {fmt.format(team.annualCost)}
        </p>
      </div>

      {/* Output */}
      <div>
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          Output
        </p>
        <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {team.output}
        </p>
      </div>

      {/* Cost per unit */}
      <div>
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          {team.unitLabel}
        </p>
        <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {fmt.format(team.costPerUnit)}
        </p>
      </div>
    </div>
  );
}

function DeltaStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl border px-5 py-4 text-center"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="font-display font-bold text-2xl"
        style={{ color: "var(--color-navy-deep)", letterSpacing: "-0.03em" }}
      >
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
    </div>
  );
}
