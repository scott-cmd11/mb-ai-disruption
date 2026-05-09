import Link from "next/link";
import { getIndustriesByRisk } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";
import type { Industry, RiskTier } from "@/types";

export const metadata = createPageMetadata({
  title: "Manitoba AI Disruption Explorer",
  description:
    "Measure AI disruption exposure for Manitoba businesses, industries, and occupations with a free calculator built on labour-market research.",
  path: "/",
});

// ── Tier config ────────────────────────────────────────────────────────────────

const TIER_LABEL: Record<RiskTier, string> = {
  high: "High", medium: "Medium", low: "Low",
};

const TIER_BADGE_CLASS: Record<RiskTier, string> = {
  high:   "badge-high",
  medium: "badge-medium",
  low:    "badge-low",
};

// ── Industry table row ─────────────────────────────────────────────────────────
// Semantic <tr>/<td> with proper ARIA — screen readers announce column context

function IndustryRow({
  industry,
  rank,
}: {
  industry: Industry;
  rank: number;
}) {
  const barClass = `risk-bar-${industry.riskTier}`;
  const badgeClass = TIER_BADGE_CLASS[industry.riskTier];

  return (
    <tr
      className="group border-b border-slate-100 last:border-0 hover:bg-amber-50/60 transition-colors"
    >
      {/* Rank */}
      <td
        className="py-3.5 pl-4 sm:pl-5 w-8 sm:w-10 text-right text-xs font-mono tabular-nums select-none"
        style={{ color: "var(--color-text-tertiary)" }}
        aria-label={`Rank ${rank}`}
      >
        {rank}
      </td>

      {/* Sector name — th with scope="row" for screen reader column context */}
      <th
        scope="row"
        className="py-3.5 px-3 sm:px-4 text-sm font-semibold text-left w-36 sm:w-52"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
        }}
      >
        {industry.shortName}
      </th>

      {/* Bar + score */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          {/* Track */}
          <div
            className="flex-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "#E2E8F0", height: "8px" }}
            role="presentation"
            aria-hidden="true"
          >
            {/* Fill */}
            <div
              className={`h-full rounded-full ${barClass}`}
              style={{ width: `${industry.sectorRiskScore}%` }}
            />
          </div>
          {/* Score */}
          <span
            className="w-8 text-right text-sm font-mono tabular-nums font-bold shrink-0"
            style={{ color: "var(--color-text-primary)" }}
            aria-label={`Score: ${industry.sectorRiskScore} out of 100`}
          >
            {industry.sectorRiskScore}
          </span>
        </div>
      </td>

      {/* Tier badge */}
      <td className="py-3.5 pr-5 text-right w-24">
        <span className={badgeClass}>{TIER_LABEL[industry.riskTier]}</span>
      </td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const industries = getIndustriesByRisk();
  const highCount  = industries.filter(i => i.riskTier === "high").length;
  const highPct    = Math.round((highCount / industries.length) * 100);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — full-bleed dark navy                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b"
        style={{
          backgroundColor: "var(--color-paper)",
          borderColor: "var(--color-text-primary)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(23,23,23,0.05) 1px, transparent 1px), linear-gradient(rgba(23,23,23,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(180deg, black, transparent 86%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div
            className="mb-8 grid grid-cols-2 gap-3 border-y py-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] sm:grid-cols-4"
            style={{ borderColor: "var(--color-text-primary)", color: "var(--color-text-secondary)" }}
          >
            <span>Manitoba</span>
            <span>April 2026 baseline</span>
            <span>20 sectors</span>
            <span className="text-right sm:text-left">Free assessment</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.62fr_1.18fr_1.12fr] lg:items-stretch">
            <aside className="hidden border-r pr-8 lg:block" style={{ borderColor: "var(--color-text-primary)" }}>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em]" style={{ color: "var(--color-gold)" }}>
                Civic intelligence file
              </p>
              <div className="mt-8 space-y-8">
                {[
                  ["Audience", "Business owners and workforce planners"],
                  ["Method", "Academic exposure indexes + Manitoba labour data"],
                  ["Output", "A practical 12-month risk signal"],
                ].map(([label, value]) => (
                  <div key={label} className="border-t pt-3" style={{ borderColor: "var(--color-border-strong)" }}>
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--color-text-tertiary)" }}>
                      {label}
                    </p>
                    <p className="mt-1 text-sm leading-snug" style={{ color: "var(--color-text-primary)" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </aside>

            <div>
              <p
                className="mb-5 max-w-xl text-xs font-bold uppercase tracking-[0.28em]"
                style={{ color: "var(--color-gold)" }}
              >
                For Manitoba business owners
              </p>
              <h1
                id="hero-heading"
                className="font-display font-black leading-[0.92]"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "clamp(3rem, 7vw, 5.8rem)",
                  letterSpacing: "-0.045em",
                }}
              >
                Measure your AI exposure before the market does.
              </h1>
              <p
                className="mt-6 max-w-2xl text-xl leading-snug sm:text-2xl"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Score your sector, benchmark your workforce, and turn a vague AI threat into a concrete Manitoba business planning signal.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/calculator" className="btn-primary">
                  Start the assessment
                </Link>
                <Link href="/explorer" className="btn-secondary">
                  View the sector atlas
                </Link>
              </div>
            </div>

            <aside className="exposure-ledger" aria-label="Highest exposure sectors">
              <div className="flex items-start justify-between gap-4 border-b pb-5" style={{ borderColor: "rgba(255,248,234,0.24)" }}>
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em]" style={{ color: "var(--color-gold-light)" }}>
                    Model extract
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-black leading-none" style={{ color: "var(--color-text-inverse)" }}>
                    Sector exposure ledger
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,248,234,0.55)" }}>
                    High
                  </p>
                  <p className="font-display text-5xl font-black leading-none" style={{ color: "var(--color-gold-light)" }}>
                    {highCount}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {industries.slice(0, 6).map((industry, index) => (
                  <div key={industry.naicsCode} className="ledger-row">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,248,234,0.48)" }}>
                          #{String(index + 1).padStart(2, "0")} / NAICS {industry.naicsCode}
                        </p>
                        <p className="truncate text-base font-semibold" style={{ color: "var(--color-text-inverse)" }}>
                          {industry.shortName}
                        </p>
                      </div>
                      <p className="font-mono text-xl font-bold" style={{ color: "var(--color-gold-light)" }}>
                        {industry.sectorRiskScore}
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 bg-[rgba(255,248,234,0.14)]">
                      <div className="h-full" style={{ width: `${industry.sectorRiskScore}%`, backgroundColor: index < highCount ? "var(--color-gold-light)" : "rgba(255,248,234,0.42)" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-3 border-t pt-5 text-center" style={{ borderColor: "rgba(255,248,234,0.24)" }}>
                {[
                  ["20", "sectors"],
                  ["50+", "occupations"],
                  ["4", "components"],
                ].map(([num, label]) => (
                  <div key={label} className="border-r last:border-r-0" style={{ borderColor: "rgba(255,248,234,0.18)" }}>
                    <p className="font-display text-3xl font-black leading-none" style={{ color: "var(--color-gold-light)" }}>
                      {num}
                    </p>
                    <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.16em]" style={{ color: "rgba(255,248,234,0.55)" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        aria-hidden="true"
        style={{ backgroundColor: "var(--color-navy-deep)" }}
        className="hidden"
      >
        {/* Grid pattern — blueprint texture, on-brand for a data tool */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 survey-grid opacity-100"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16 lg:items-center">

            {/* Left: copy — spans 3 of 5 columns */}
            <div className="lg:col-span-3">
              {/* Eyebrow */}
              <p
                className="anim-hero-0 text-xs font-bold tracking-[0.2em] uppercase mb-5"
                style={{ color: "var(--color-gold)" }}
              >
                For Manitoba business owners · Updated April 2026
              </p>

              {/* Heading */}
              <h1
                id="legacy-hero-heading"
                className="anim-hero-1 font-display font-bold leading-[1.05] tracking-tight"
                style={{
                  color: "var(--color-text-inverse)",
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                How exposed is your<br />
                <span style={{ color: "var(--color-gold-light)" }}>
                  business
                </span>{" "}
                to AI disruption?
              </h1>

              {/* Sub-deck */}
              <p
                className="anim-hero-2 mt-6 text-lg leading-snug max-w-xl"
                style={{ color: "rgba(248, 250, 252, 0.85)" }}
              >
                Score your sector, benchmark your workforce, and plan your next 12 months
                — in 2 minutes, free.
              </p>

              {/* Description */}
              <p
                className="anim-hero-2 mt-3 text-sm leading-relaxed max-w-lg"
                style={{ color: "rgba(248, 250, 252, 0.55)" }}
              >
                A data-driven risk assessment for Manitoba industries and occupations,
                built on academic automation research and Statistics Canada labour
                market data.
              </p>

              {/* CTAs */}
              <div className="anim-hero-3 mt-10 flex flex-wrap gap-3">
                <Link href="/calculator" className="btn-primary">
                  Start the Assessment
                </Link>
                <Link href="/explorer" className="btn-secondary">
                  Explore all industries
                </Link>
              </div>
            </div>

            {/* Right: dramatic stat — spans 2 of 5 columns */}
            <div className="anim-hero-4 hidden flex-col items-start sm:flex lg:col-span-2 lg:items-center">
              <div
                className="relative rounded-2xl p-8 w-full max-w-xs"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(2px)",
                }}
              >
                {/* Big number */}
                <p
                  className="font-display font-bold leading-none"
                  style={{
                    fontSize: "clamp(4rem, 12vw, 6.5rem)",
                    color: "var(--color-gold)",
                    letterSpacing: "-0.04em",
                  }}
                  aria-label={`${highCount} out of 20`}
                >
                  {highCount}
                  <span
                    className="font-display font-light"
                    style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "rgba(252,211,77,0.5)" }}
                  >
                    /20
                  </span>
                </p>

                <p
                  className="mt-2 text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(248, 250, 252, 0.9)" }}
                >
                  Manitoba sectors
                </p>
                <p className="text-sm" style={{ color: "rgba(248, 250, 252, 0.55)" }}>
                  rated <span style={{ color: "#F87171", fontWeight: 600 }}>HIGH exposure</span>
                  {" "}to AI disruption
                </p>

                {/* Mini exposure bar */}
                <div
                  className="mt-5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", height: "6px" }}
                  role="presentation"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${highPct}%`,
                      background: "linear-gradient(90deg, #DC2626 0%, #F87171 100%)",
                    }}
                  />
                </div>
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: "rgba(248,250,252,0.35)" }}
                >
                  {highPct}% of all sectors
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STAT STRIP — three key numbers on white                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Key statistics"
        style={{ backgroundColor: "var(--color-text-primary)" }}
        className="border-b"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0" style={{ borderColor: "rgba(255,248,234,0.18)" }}>
            {[
              {
                num: "20",
                unit: "industry sectors",
                desc: "All Manitoba industries rated on a composite AI exposure index combining four evidence-based measures.",
              },
              {
                num: "50+",
                unit: "occupations tracked",
                desc: "Manitoba occupations individually scored on automation probability, AI exposure, and language AI susceptibility.",
              },
              {
                num: "4",
                unit: "score components",
                desc: "Automation research · AI exposure index · Language AI impact · Sector adoption gap — weighted and adjusted for your business.",
              },
            ].map(({ num, unit, desc }) => (
              <div key={unit} className="flex flex-col gap-2 px-8 py-10">
                <dt className="flex items-baseline gap-2">
                  <span
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                      color: "var(--color-gold-light)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "rgba(255,248,234,0.55)" }}
                  >
                    {unit}
                  </span>
                </dt>
                <dd
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,248,234,0.72)" }}
                >
                  {desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WHAT IS THIS — plain-language explainer                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="About this tool"
        className="border-b"
        style={{ backgroundColor: "var(--color-paper-deep)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 border-l-4 py-2 pl-5 sm:flex-row sm:items-start sm:justify-between" style={{ borderColor: "var(--color-text-primary)" }}>
            <div className="flex items-start gap-4 max-w-3xl">
              {/* Left amber accent bar */}
              <div
                className="hidden"
                style={{ backgroundColor: "var(--color-gold)" }}
                aria-hidden="true"
              />
              <div className="space-y-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  What is this?
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  A free tool that shows how likely each Manitoba industry and occupation is to be
                  disrupted by AI — based on published academic datasets, not opinions. Answer 6
                  questions about your business to get a personalised score. No data is collected.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <strong style={{ color: "var(--color-text-secondary)" }}>This is not a government service.</strong>{" "}
                  Built by Scott Hazlitt as a personal project. Scores are modelled estimates —
                  not predictions, and not professional advice.
                </p>
              </div>
            </div>
            <Link
              href="/about"
              className="shrink-0 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--color-navy)" }}
            >
              Full methodology →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WHAT YOU CAN EXPLORE — hub card grid                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="explore-heading"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p
            className="text-[0.6rem] font-bold tracking-[0.25em] uppercase mb-1"
            style={{ color: "var(--color-gold)" }}
          >
            Tools &amp; research
          </p>
          <h2
            id="explore-heading"
            className="font-display font-bold mb-8"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(1.4rem, 3vw, 1.875rem)",
              letterSpacing: "-0.02em",
            }}
          >
            What you can do here
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                {
                  href: "/calculator",
                  title: "Get your risk score",
                  desc: "Answer 6 questions about your business. Get a personalised AI disruption assessment in 2 minutes.",
                  cta: "Start assessment →",
                  featured: true,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="2" x2="12" y2="5" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                    </svg>
                  ),
                },
                {
                  href: "/explorer",
                  title: "All 20 Manitoba industries",
                  desc: "Every Manitoba sector ranked by AI disruption exposure, with score breakdowns and occupation drill-downs.",
                  cta: "Explore industries →",
                  featured: false,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  ),
                },
                {
                  href: "/threat-model",
                  title: "How AI startups compete",
                  desc: "5 research-backed mechanisms — real company evidence, Manitoba context, and a cost-comparison simulator.",
                  cta: "Read the analysis →",
                  featured: false,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  ),
                },
                {
                  href: "/scenarios",
                  title: "What-if scenarios",
                  desc: "How does your industry\u2019s risk change if AI spreads quickly \u2014 or if you haven\u2019t started yet?",
                  cta: "Explore scenarios →",
                  featured: false,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="3" x2="6" y2="15" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <path d="M18 9a9 9 0 0 1-9 9" />
                    </svg>
                  ),
                },
              ] as const
            ).map(({ href, title, desc, cta, featured, icon }) => (
              <Link
                key={href}
                href={href}
                className="group block border p-5 transition-colors hover:border-[var(--color-gold)]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: featured ? "var(--color-text-primary)" : "var(--color-border)",
                  borderTopWidth: featured ? "4px" : undefined,
                  borderLeftColor: featured ? "var(--color-gold)" : undefined,
                }}
              >
                <div
                  className="w-7 h-7 mb-3"
                  style={{ color: featured ? "var(--color-gold)" : "var(--color-navy)" }}
                  aria-hidden="true"
                >
                  {icon}
                </div>
                <p
                  className="font-display font-bold text-sm mb-1.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {title}
                </p>
                <p
                  className="text-xs leading-relaxed mb-3"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {desc}
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-gold)" }}
                >
                  {cta}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INDUSTRY RISK SNAPSHOT — semantic table                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="snapshot-heading"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <p
                className="text-[0.6rem] font-bold tracking-[0.25em] uppercase mb-1"
                style={{ color: "var(--color-gold)" }}
              >
                All 20 sectors · ranked by composite score
              </p>
              <h2
                id="snapshot-heading"
                className="font-display font-bold"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "clamp(1.4rem, 3vw, 1.875rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Manitoba industry risk snapshot
              </h2>
            </div>
            <Link
              href="/explorer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--color-navy)" }}
            >
              <span>Full Explorer</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Legend */}
          <div
            className="flex gap-5 mb-6"
            role="list"
            aria-label="Risk tier legend"
          >
            {(["high", "medium", "low"] as RiskTier[]).map((tier) => (
              <div
                key={tier}
                className="flex items-center gap-2"
                role="listitem"
              >
                <div
                  className={`h-2 w-6 rounded-full risk-bar-${tier}`}
                  aria-hidden="true"
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {TIER_LABEL[tier]} exposure
                </span>
              </div>
            ))}
          </div>

          {/* Industry table — semantic <table> for screen reader column context.
              Horizontal scroll fallback on narrow viewports keeps the bar + score readable. */}
          <div
            className="rounded-xl border shadow-sm overflow-x-auto"
            style={{ borderColor: "var(--color-border)" }}
          >
            <table
              className="w-full border-collapse min-w-[520px]"
              aria-label="Manitoba industry AI disruption risk scores"
            >
              {/* Hidden caption for screen reader context */}
              <caption className="sr-only">
                Manitoba industries ranked by composite AI disruption exposure score (0–100).
                Higher scores indicate greater exposure. Data sourced from Statistics Canada Labour Force Survey 2023.
              </caption>

              <thead>
                <tr style={{ backgroundColor: "var(--color-paper-deep)" }}>
                  <th
                    scope="col"
                    className="py-3 pl-5 w-10 text-right text-[0.6rem] font-bold tracking-widest uppercase"
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
                  <th
                    scope="col"
                    className="py-3 pr-4 text-left text-[0.6rem] font-bold tracking-widest uppercase"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Composite exposure score (0–100)
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-5 w-24 text-right text-[0.6rem] font-bold tracking-widest uppercase"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Tier
                  </th>
                </tr>
              </thead>

              <tbody style={{ backgroundColor: "var(--color-surface)" }}>
                {industries.map((industry, i) => (
                  <IndustryRow
                    key={industry.naicsCode}
                    industry={industry}
                    rank={i + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footnote */}
          <p
            className="mt-4 text-xs leading-relaxed"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Scores reflect relative AI disruption exposure, not certainty of displacement.
            Sector employment data: Statistics Canada Labour Force Survey 2023.
            {" "}
            <Link
              href="/about"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: "var(--color-navy)" }}
            >
              Full methodology
            </Link>
          </p>

          {/* Mobile-only explorer link */}
          <div className="mt-6 sm:hidden">
            <Link
              href="/explorer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--color-navy)" }}
            >
              <span>Interactive Industry Explorer</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ASSESSMENT CTA — navy card                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Start your assessment"
        style={{ backgroundColor: "var(--color-paper-deep)" }}
        className="border-t border-slate-100"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl px-8 py-12 sm:px-12 text-center relative overflow-hidden"
            style={{ backgroundColor: "var(--color-navy-deep)" }}
          >
            {/* Decorative glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(217,119,6,0.12) 0%, transparent 70%)",
              }}
            />

            <p
              className="relative text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--color-gold)" }}
            >
              How we scored it
            </p>
            <h2
              className="relative font-display font-bold"
              style={{
                color: "var(--color-text-inverse)",
                fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Built on peer-reviewed research
            </h2>
            <p
              className="relative mt-3 text-base max-w-lg mx-auto"
              style={{ color: "rgba(248, 250, 252, 0.65)" }}
            >
              Composite scores combine Frey &amp; Osborne (2013), the AI Occupation Exposure
              index (Felten et al.), language-model exposure research, and Statistics Canada
              labour data. See the math.
            </p>
            <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/about" className="btn-primary">
                Read the methodology
              </Link>
              <Link href="/policy" className="btn-secondary btn-secondary-inverse">
                Research &amp; sources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
