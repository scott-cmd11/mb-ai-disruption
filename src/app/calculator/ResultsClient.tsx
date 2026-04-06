"use client";

import { useEffect, useRef, useState } from "react";
import type { AssessmentResult, Industry, SectorPlaybook, ThreatScenario } from "@/types";
import { CostCurveChart } from "./CostCurveChart";
import Link from "next/link";

// ── Helpers ───────────────────────────────────────────────────────────────────

const TIER_COLORS = {
  low:    "var(--color-risk-low)",
  medium: "var(--color-risk-medium)",
  high:   "var(--color-risk-high)",
};

const TIER_LABELS = { low: "Low Exposure", medium: "Moderate Exposure", high: "High Exposure" };

const URGENCY_LABEL = { immediate: "IMMEDIATE", near_term: "NEAR TERM", watch: "WATCH" };
const URGENCY_ORDER = { immediate: 0, near_term: 1, watch: 2 };

// Half-donut arc math: semicircle radius=80, center=(100,100)
const ARC_LENGTH = Math.PI * 80; // ≈ 251.3

// ── Score Gauge ───────────────────────────────────────────────────────────────

function ScoreGauge({ score, tier }: { score: number; tier: "low" | "medium" | "high" }) {
  const fillRef = useRef<SVGPathElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setMounted(true);
  }, []);

  const fillLength = (score / 100) * ARC_LENGTH;
  const dashOffset = mounted ? ARC_LENGTH - fillLength : ARC_LENGTH;
  const color = TIER_COLORS[tier];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 200 110"
        className="w-full max-w-xs"
        aria-label={`Risk score: ${Math.round(score)} out of 100`}
      >
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          ref={fillRef}
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        {/* Score label */}
        <text
          x="100"
          y="82"
          textAnchor="middle"
          fontSize="36"
          fontWeight="600"
          fontFamily="var(--font-display)"
          fill="var(--color-text-primary)"
        >
          {Math.round(score)}
        </text>
        <text
          x="100"
          y="98"
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-body)"
          fill="var(--color-text-tertiary)"
        >
          / 100
        </text>
      </svg>
      {/* Tier badge */}
      <span
        className="text-xs font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-sm border"
        style={{
          color,
          borderColor: color,
          backgroundColor:
            tier === "high"
              ? "var(--color-risk-high-bg)"
              : tier === "medium"
              ? "var(--color-risk-medium-bg)"
              : "var(--color-risk-low-bg)",
        }}
      >
        {TIER_LABELS[tier]}
      </span>
    </div>
  );
}

// ── Component Bars ────────────────────────────────────────────────────────────

function ComponentBars({ result }: { result: AssessmentResult }) {
  const { breakdown } = result;
  const components = [
    { label: "Automation Probability", sublabel: "Frey & Osborne", value: breakdown.freyOsborneComponent },
    { label: "AI Occupational Exposure", sublabel: "Felten-Raj-Seamans AIOE", value: breakdown.aioeComponent },
    { label: "LLM Task Sensitivity", sublabel: "Eloundou et al.", value: breakdown.llmExposureComponent },
    { label: "Industry Adoption Gap", sublabel: "Sector AI readiness", value: breakdown.industryAdoptionGapComponent },
  ];
  const maxVal = Math.max(...components.map((c) => c.value), 1);

  return (
    <div className="flex flex-col gap-4">
      {components.map(({ label, sublabel, value }) => (
        <div key={label} className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
                {label}
              </span>
              <span className="ml-1.5 text-[0.6rem]" style={{ color: "var(--color-text-tertiary)" }}>
                {sublabel}
              </span>
            </div>
            <span className="font-mono tabular-nums text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              {value.toFixed(1)}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(value / maxVal) * 100}%`,
                backgroundColor:
                  result.riskTier === "high"
                    ? "var(--color-risk-high)"
                    : result.riskTier === "medium"
                    ? "var(--color-risk-medium)"
                    : "var(--color-risk-low)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Benchmark Row ─────────────────────────────────────────────────────────────

function BenchmarkRow({
  label,
  yourScore,
  compareScore,
  compareLabel,
}: {
  label: string;
  yourScore: number;
  compareScore: number;
  compareLabel: string;
}) {
  const higher = yourScore > compareScore;
  const diff = Math.abs(Math.round(yourScore - compareScore));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>{label}</span>
        <span style={{ color: higher ? "var(--color-risk-high)" : "var(--color-risk-low)" }}>
          {higher ? `+${diff}` : `-${diff}`} vs {compareLabel}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
        {/* Compare score marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full"
          style={{ left: `${compareScore}%`, backgroundColor: "var(--color-text-tertiary)" }}
        />
        {/* Your score dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-all duration-700"
          style={{
            left: `calc(${yourScore}% - 6px)`,
            backgroundColor: "var(--color-navy)",
            borderColor: "var(--color-paper)",
          }}
        />
      </div>
      <div className="flex justify-between text-[0.6rem] font-mono" style={{ color: "var(--color-text-tertiary)" }}>
        <span>0</span>
        <span>{compareLabel}: {Math.round(compareScore)}</span>
        <span>100</span>
      </div>
    </div>
  );
}

// ── Recommendations ───────────────────────────────────────────────────────────

function RecommendationList({ result }: { result: AssessmentResult }) {
  const grouped = result.recommendations.reduce<Record<string, typeof result.recommendations>>(
    (acc, rec) => {
      if (!acc[rec.urgency]) acc[rec.urgency] = [];
      acc[rec.urgency].push(rec);
      return acc;
    },
    {}
  );

  const urgencies = (Object.keys(grouped) as (keyof typeof URGENCY_LABEL)[]).sort(
    (a, b) => URGENCY_ORDER[a] - URGENCY_ORDER[b]
  );

  return (
    <div className="flex flex-col gap-6">
      {urgencies.map((urgency) => (
        <div key={urgency}>
          <p className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: "var(--color-gold)" }}>
            {URGENCY_LABEL[urgency]}
          </p>
          <div className="flex flex-col gap-3">
            {grouped[urgency].map((rec) => (
              <div
                key={rec.id}
                className="rounded-sm border p-4"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
                  {rec.headline}
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
                  {rec.body}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {rec.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.6rem] tracking-wide uppercase px-2 py-0.5 rounded-sm border"
                      style={{ color: "var(--color-text-tertiary)", borderColor: "var(--color-border)", backgroundColor: "var(--color-paper-deep)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Share Button ──────────────────────────────────────────────────────────────

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-xs font-medium tracking-wide transition-colors"
      style={{ borderColor: "var(--color-border-strong)", color: "var(--color-text-secondary)" }}
    >
      {copied ? "✓ Copied" : "Share results"}
    </button>
  );
}

// ── Section heading helper ────────────────────────────────────────────────────

function SectionHeading({ label, heading }: { label: string; heading: string }) {
  return (
    <div className="mb-4">
      <p className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-0.5" style={{ color: "var(--color-gold)" }}>
        {label}
      </p>
      <h2 className="font-display text-xl font-light italic" style={{ color: "var(--color-text-primary)" }}>
        {heading}
      </h2>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

// ── Action Roadmap ───────────────────────────────────────────────────────────

function ActionRoadmap({ playbook }: { playbook: SectorPlaybook }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 12-month actions */}
        <div
          className="rounded-sm border p-4"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper-deep)" }}
        >
          <p
            className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-3"
            style={{ color: "var(--color-navy)" }}
          >
            Next 12 months
          </p>
          <ol className="list-decimal list-inside flex flex-col gap-2">
            {playbook.actions12Month.map((action, i) => (
              <li
                key={i}
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {action}
              </li>
            ))}
          </ol>
        </div>

        {/* 1-3 year actions */}
        <div
          className="rounded-sm border p-4"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper-deep)" }}
        >
          <p
            className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-3"
            style={{ color: "var(--color-navy)" }}
          >
            1-3 years
          </p>
          <ol className="list-decimal list-inside flex flex-col gap-2">
            {playbook.actions1to3Year.map((action, i) => (
              <li
                key={i}
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {action}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Biggest mistake */}
      <div
        className="rounded-sm border-l-4 p-4"
        style={{
          borderColor: "var(--color-risk-high)",
          backgroundColor: "var(--color-risk-high-bg)",
        }}
      >
        <p className="text-xs font-bold mb-1" style={{ color: "var(--color-risk-high)" }}>
          Biggest mistake to avoid
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {playbook.biggestMistake}
        </p>
      </div>

      {/* Strategic priority */}
      <div
        className="rounded-sm border-l-4 p-4"
        style={{
          borderColor: "var(--color-navy)",
          backgroundColor: "rgba(11, 25, 41, 0.04)",
        }}
      >
        <p className="text-xs font-bold mb-1" style={{ color: "var(--color-navy)" }}>
          Strategic priority
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {playbook.strategicPriority}
        </p>
      </div>
    </div>
  );
}

// ── Underestimation Warning ──────────────────────────────────────────────────

function UnderestimationWarning({ playbook, sectorLabel }: { playbook: SectorPlaybook; sectorLabel: string }) {
  const { underestimationRisk: risk } = playbook;
  const urgencyColor =
    risk.urgency === "Critical" ? "var(--color-risk-high)"
    : risk.urgency === "High" ? "#B45309"
    : "var(--color-text-tertiary)";

  return (
    <div
      className="rounded-sm border p-5"
      style={{
        borderColor: "#D97706",
        backgroundColor: "rgba(217, 119, 6, 0.05)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-lg" aria-hidden="true">&#9888;</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Why {sectorLabel} businesses underestimate the threat
          </p>
          <span
            className="inline-block mt-1 text-[0.6rem] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded-sm"
            style={{ color: urgencyColor, backgroundColor: "rgba(217, 119, 6, 0.1)" }}
          >
            {risk.urgency} urgency
          </span>
        </div>
      </div>

      <dl className="flex flex-col gap-3">
        <div>
          <dt className="text-xs font-bold" style={{ color: "var(--color-text-secondary)" }}>Common assumption</dt>
          <dd className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{risk.reason}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold" style={{ color: "var(--color-text-secondary)" }}>What they&apos;re getting wrong</dt>
          <dd className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{risk.gettingWrong}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold" style={{ color: "var(--color-risk-high)" }}>Likely consequence</dt>
          <dd className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{risk.consequence}</dd>
        </div>
      </dl>
    </div>
  );
}

// ── RLI Reality-Check Callout ────────────────────────────────────────────────

function RLICallout() {
  return (
    <div
      className="rounded-sm border p-5 mb-6"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper-deep)" }}
    >
      <p
        className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-2"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Reality check · Remote Labor Index (2025)
      </p>
      <p className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
        Where frontier AI agents actually are today
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div>
          <p className="font-display text-2xl font-bold" style={{ color: "var(--color-navy)" }}>0.8–4.2%</p>
          <p className="text-[0.65rem] leading-tight mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            of complex projects completed autonomously by frontier AI
          </p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold" style={{ color: "var(--color-navy)" }}>240</p>
          <p className="text-[0.65rem] leading-tight mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            real freelance projects tested across 23 skill categories
          </p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold" style={{ color: "var(--color-navy)" }}>45.6%</p>
          <p className="text-[0.65rem] leading-tight mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            of failures due to poor output quality — not missing capability
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
        The disruption scores above reflect theoretical AI capability — what AI{" "}
        <em>could</em> automate. The Remote Labor Index benchmarks what frontier AI
        agents <em>actually</em> complete on real paid projects today: just 0.83%
        (Gemini 2.5 Pro) to 4.17% (Claude Opus) — a tiny fraction of the theoretical
        ceiling. The cost-convergence curve below shows how the gap between capability
        and deployment is expected to close.
      </p>
      <p className="text-[0.6rem] mt-2" style={{ color: "var(--color-text-tertiary)" }}>
        Source:{" "}
        <a
          href="https://www.remotelabor.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          remotelabor.ai
        </a>{" "}
        — 240 projects, 358 freelancers, Feb–Mar 2025. Illustrative range; actual rates
        vary by task type and model version.
      </p>
    </div>
  );
}

// ── Competitive Threat Preview ───────────────────────────────────────────────

function ThreatPreview({ scenario }: { scenario: ThreatScenario }) {
  const costReduction = Math.round((1 - scenario.aiNative.annualCost / scenario.traditional.annualCost) * 100);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        In your sector, a lean AI-native competitor could look like this:
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Traditional */}
        <div
          className="rounded-sm border p-4"
          style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(220, 38, 38, 0.03)" }}
        >
          <p className="text-[0.6rem] tracking-[0.15em] uppercase font-bold mb-2" style={{ color: "var(--color-text-tertiary)" }}>
            Traditional
          </p>
          <p className="font-display font-bold text-2xl" style={{ color: "var(--color-text-primary)" }}>
            {scenario.traditional.teamSize}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>team members</p>
          <p className="font-mono text-sm font-bold mt-2" style={{ color: "var(--color-text-primary)" }}>
            {fmt.format(scenario.traditional.annualCost)}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>/year</p>
        </div>

        {/* AI-Native */}
        <div
          className="rounded-sm border p-4"
          style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(21, 128, 61, 0.03)" }}
        >
          <p className="text-[0.6rem] tracking-[0.15em] uppercase font-bold mb-2" style={{ color: "#15803D" }}>
            AI-Native
          </p>
          <p className="font-display font-bold text-2xl" style={{ color: "var(--color-text-primary)" }}>
            {scenario.aiNative.teamSize}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>team members</p>
          <p className="font-mono text-sm font-bold mt-2" style={{ color: "#15803D" }}>
            {fmt.format(scenario.aiNative.annualCost)}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>/year</p>
        </div>
      </div>

      <p className="text-center text-sm font-bold" style={{ color: "var(--color-risk-high)" }}>
        {costReduction}% lower cost
      </p>

      <Link
        href={`/threat-simulator#${scenario.id}`}
        className="btn-primary text-sm text-center"
      >
        See full threat model
      </Link>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function ResultsClient({
  result,
  industryName,
  industry,
  playbook,
  threatScenario,
  onReset,
}: {
  result: AssessmentResult;
  industryName: string;
  industry?: Industry;
  playbook?: SectorPlaybook;
  threatScenario?: ThreatScenario;
  onReset: () => void;
}) {
  const { breakdown, riskTier } = result;
  const [provenanceOpen, setProvenanceOpen] = useState(false);
  const modifierNote =
    breakdown.adoptionModifier < 1
      ? `Your AI adoption reduces exposure by ${Math.round((1 - breakdown.adoptionModifier) * 100)}%.`
      : breakdown.sizeMultiplier > 1
      ? "Smaller businesses face slightly higher relative exposure."
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-[0.6rem] tracking-[0.25em] uppercase font-bold mb-2" style={{ color: "var(--color-gold)" }}>
          Assessment results · {industryName}
        </p>
        <h1 className="font-display text-3xl font-light italic" style={{ color: "var(--color-text-primary)" }}>
          Your AI Disruption Score
        </h1>
      </div>

      {/* Gauge + modifiers */}
      <div
        className="rounded-sm border p-6 sm:p-8 mb-6"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <ScoreGauge score={breakdown.adjustedScore} tier={riskTier} />
        {modifierNote && (
          <p className="mt-4 text-xs text-center" style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-body)" }}>
            {modifierNote}
          </p>
        )}
      </div>

      {/* Score breakdown */}
      <div
        className="rounded-sm border p-6 sm:p-8 mb-6"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <SectionHeading label="Score components" heading="How your score was calculated" />
        <ComponentBars result={result} />
      </div>

      {/* Benchmarks */}
      <div
        className="rounded-sm border p-6 sm:p-8 mb-6"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <SectionHeading label="Benchmarks" heading="How you compare" />
        <div className="flex flex-col gap-6">
          <BenchmarkRow
            label={`vs. ${industryName} average`}
            yourScore={breakdown.adjustedScore}
            compareScore={result.industryAverage}
            compareLabel="Industry avg"
          />
          <BenchmarkRow
            label="vs. Manitoba provincial average"
            yourScore={breakdown.adjustedScore}
            compareScore={result.provinceAverage}
            compareLabel="MB avg"
          />
        </div>
      </div>

      {/* At-risk occupations */}
      {result.topRiskedOccupations.length > 0 && (
        <div
          className="rounded-sm border p-6 sm:p-8 mb-6"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <SectionHeading label="Occupations" heading="Roles most exposed in your sector" />
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--color-border)" }}>
            {result.topRiskedOccupations.map((occ) => (
              <div key={occ.nocCode} className="flex justify-between items-center py-2.5">
                <span className="text-sm" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
                  {occ.shortTitle}
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={`text-xs font-mono tabular-nums font-semibold ${
                      occ.riskTier === "high" ? "risk-badge-high" : occ.riskTier === "medium" ? "risk-badge-medium" : "risk-badge-low"
                    }`}
                  >
                    {occ.compositeScore}
                  </span>
                  <span className="text-[0.55rem] ml-1"
                    style={{
                      color: occ.scoreConfidence === "published"
                        ? "var(--color-risk-low)"
                        : "var(--color-text-tertiary)",
                    }}
                  >
                    {occ.scoreConfidence === "published" ? "✓ published" : "~ est."}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Data Provenance Panel ─────────────────────────────── */}
      <div className="rounded-xl border overflow-hidden mt-4" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={() => setProvenanceOpen(!provenanceOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-muted)]"
        >
          <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {provenanceOpen ? "▾" : "▸"} How is this score calculated?
          </span>
          <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Data sources</span>
        </button>

        {provenanceOpen && (
          <div className="border-t px-4 py-4 text-xs leading-relaxed flex flex-col gap-3"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-muted)", color: "var(--color-text-secondary)" }}>

            <p>
              Your score is a weighted composite of three published data sources, calibrated to Manitoba&apos;s labour market.
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <span className="font-semibold w-28 flex-shrink-0" style={{ color: "var(--color-text-primary)" }}>30% — Automation risk</span>
                <span>Frey &amp; Osborne (2013) Oxford probability-of-computerisation estimates for 702 US occupations, mapped to Canadian NOC codes.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold w-28 flex-shrink-0" style={{ color: "var(--color-text-primary)" }}>30% — AI exposure</span>
                <span>Felten, Raj &amp; Seamans (2021) AI Occupational Impact scores linking O*NET task descriptions to AI capability domains.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold w-28 flex-shrink-0" style={{ color: "var(--color-text-primary)" }}>25% — LLM exposure</span>
                <span>Eloundou et al. (2023) <em>GPTs are GPTs</em> — human-annotated <code className="text-[0.6rem] px-1 py-0.5 rounded bg-white">human_rating_beta</code> scores for 923 O*NET occupations. <span style={{ color: "var(--color-risk-low)" }}>✓ Published data</span> for all 49 occupations shown.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold w-28 flex-shrink-0" style={{ color: "var(--color-text-primary)" }}>15% — Adoption gap</span>
                <span>Sector-level AI adoption rate vs. Manitoba baseline (~2%, StatsCan CSBC Table 33-10-0825-01, 2024). Sectors below the baseline score higher.</span>
              </div>
            </div>

            <p className="pt-1 border-t" style={{ borderColor: "var(--color-border)", color: "var(--color-text-tertiary)" }}>
              Occupation scores marked <span style={{ color: "var(--color-risk-low)" }}>✓ published</span> use direct values from the source datasets. Scores marked <span>~ est.</span> use category-level averages where direct crosswalks were unavailable.
            </p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div
        className="rounded-sm border p-6 sm:p-8 mb-8"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <SectionHeading label="Recommendations" heading="What to consider next" />
        <RecommendationList result={result} />
      </div>

      {/* Action Roadmap (from sector playbook) */}
      {playbook && (
        <div
          className="rounded-sm border p-6 sm:p-8 mb-6"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <SectionHeading label="Action roadmap" heading={`What ${industryName} businesses should do`} />
          <ActionRoadmap playbook={playbook} />
        </div>
      )}

      {/* Underestimation Warning */}
      {playbook && (
        <div className="mb-6">
          <UnderestimationWarning playbook={playbook} sectorLabel={industryName} />
        </div>
      )}

      {/* Competitive Threat Preview */}
      {threatScenario && (
        <div
          className="rounded-sm border p-6 sm:p-8 mb-8"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <SectionHeading label="Competitive threat" heading="The lean AI competitor in your sector" />
          <ThreatPreview scenario={threatScenario} />
        </div>
      )}

      {/* RLI Reality-Check Callout */}
      {playbook && industry && <RLICallout />}

      {/* Cost Curve Convergence */}
      {playbook && industry && (
        <CostCurveChart
          industry={industry}
          playbook={playbook}
          result={result}
        />
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <ShareButton />
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-sm px-5 py-2 text-xs font-medium tracking-wide transition-colors"
          style={{ backgroundColor: "var(--color-navy)", color: "var(--color-text-inverse)" }}
        >
          Start over
        </button>
      </div>

      <p className="mt-6 text-center text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        Scores reflect relative AI disruption exposure, not certainty of displacement.
      </p>
    </div>
  );
}
