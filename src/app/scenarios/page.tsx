import type { Metadata } from "next";
import Link from "next/link";
import { getIndustries } from "@/lib/data";
import type { RiskTier } from "@/types";
import { ScenariosClient, type ScenarioId, type ScenarioIndustry } from "./ScenariosClient";

export const metadata: Metadata = {
  title: "Scenarios",
  description:
    "Compare Manitoba AI disruption risk under four scenarios: current baseline, rapid AI adoption, businesses leading on AI, and businesses lagging.",
};

// ── Tier helper ────────────────────────────────────────────────────────────────

function getTier(score: number): RiskTier {
  if (score > 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

// ── Scenario compute functions ─────────────────────────────────────────────────
// All four are computed server-side so the client gets pre-baked data.

const SCENARIO_COMPUTES: Record<
  ScenarioId,
  (sectorRiskScore: number, aiAdoptionRate: number) => number
> = {
  // Baseline — no change
  "baseline": (score) => score,

  // Rapid AI (2027): sectors with low current adoption face higher near-term pressure.
  // Low adoption (< 20%) → +10pts; below 40% → +5pts; 40%+ → +2pts. Cap at 100.
  "rapid-ai": (score, adoptionRate) => {
    const boost = adoptionRate < 0.2 ? 10 : adoptionRate < 0.4 ? 5 : 2;
    return Math.min(100, score + boost);
  },

  // Already Using AI: 0.70 adoption modifier — early movers face 30% less disruption.
  "ahead": (score) => Math.round(score * 0.7),

  // Not Considering AI: 1.10 micro-business multiplier applied.
  // Small businesses without capacity to manage AI transitions face higher effective risk.
  "behind": (score) => Math.min(100, Math.round(score * 1.1)),
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ScenariosPage() {
  const industries = getIndustries();

  // Pre-compute all four scenario scores for every industry.
  // This runs at build time (static generation) — zero runtime compute cost.
  const scenarioIndustries: ScenarioIndustry[] = industries.map((ind) => {
    const scores = {} as ScenarioIndustry["scores"];
    for (const [id, compute] of Object.entries(SCENARIO_COMPUTES)) {
      const score = compute(ind.sectorRiskScore, ind.aiAdoptionRate);
      scores[id as ScenarioId] = { score, tier: getTier(score) };
    }
    return {
      naicsCode: ind.naicsCode,
      shortName: ind.shortName,
      riskTier: ind.riskTier,
      sectorRiskScore: ind.sectorRiskScore,
      aiAdoptionRate: ind.aiAdoptionRate,
      scores,
    };
  });

  const baselineHigh = scenarioIndustries.filter(
    (i) => i.scores["baseline"].tier === "high"
  ).length;

  return (
    <>
      {/* ── Page hero ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="scenarios-heading"
        style={{ backgroundColor: "var(--color-navy-deep)" }}
        className="relative overflow-hidden"
      >
        {/* Amber glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #D97706 0%, transparent 70%)" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 survey-grid" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs" style={{ color: "rgba(248,250,252,0.45)" }}>
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white focus-inverse"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li style={{ color: "rgba(248,250,252,0.75)" }}>Scenarios</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p
              className="text-[0.6rem] font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: "var(--color-gold)" }}
            >
              4 what-if scenarios · {industries.length} Manitoba industries
            </p>
            <h1
              id="scenarios-heading"
              className="font-display font-bold leading-tight"
              style={{
                color: "var(--color-text-inverse)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.025em",
              }}
            >
              How does AI risk change depending on what you do next?
            </h1>
            <p
              className="mt-4 text-base leading-relaxed max-w-xl"
              style={{ color: "rgba(248, 250, 252, 0.6)" }}
            >
              Pick a scenario to see how risk levels shift across Manitoba&apos;s
              industries — whether AI arrives fast, slow, or your business gets
              ahead of it now.
            </p>

            {/* Baseline stat */}
            <div
              className="mt-6 inline-flex items-center gap-3 rounded-lg px-4 py-2.5"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="font-display font-bold text-2xl"
                style={{ color: "var(--color-gold)", letterSpacing: "-0.03em" }}
              >
                {baselineHigh}
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(248,250,252,0.7)" }}
              >
                of {industries.length} industries are at{" "}
                <strong style={{ color: "#F87171" }}>higher risk</strong>{" "}
                today — explore how each scenario changes that number
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive scenarios ──────────────────────────────────────────── */}
      <section
        aria-label="Scenario comparison"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <ScenariosClient industries={scenarioIndustries} />
          </div>
        </div>
      </section>

      {/* ── Explainer strip ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="explainer-heading"
        className="border-t border-slate-100"
        style={{ backgroundColor: "var(--color-paper-deep)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2
            id="explainer-heading"
            className="font-display font-bold mb-8"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
            }}
          >
            What each scenario assumes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Where things stand",
                note: "The starting point. Scores are based on how automatable the jobs are in each industry, how much AI is already being used, and how quickly businesses in that sector are adopting new tools.",
                color: "var(--color-navy)",
              },
              {
                label: "AI spreads quickly",
                note: "Industries with little AI use today get a higher risk score — because fast change would leave less time to prepare. The further behind a sector is, the bigger the increase.",
                color: "#DC2626",
              },
              {
                label: "Already using AI",
                note: "Risk scores drop by about 30% for businesses actively using AI. Getting started early pays off — you're building skills and adapting before disruption forces your hand.",
                color: "#15803D",
              },
              {
                label: "Not started yet",
                note: "Risk scores rise by about 10% for businesses not yet exploring AI tools. This reflects the extra pressure of having to catch up quickly once change is already underway.",
                color: "#B45309",
              },
            ].map(({ label, note, color }) => (
              <div
                key={label}
                className="rounded-xl border p-5 flex flex-col gap-3"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--color-navy)" }}
            >
              Full methodology →
            </Link>
            <Link
              href="/calculator"
              className="btn-primary text-sm"
            >
              Get your personalized score
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
