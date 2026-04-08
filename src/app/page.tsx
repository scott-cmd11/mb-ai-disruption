import Link from "next/link";
import { getIndustriesByRisk } from "@/lib/data";
import type { Industry, RiskTier } from "@/types";

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
  index,
}: {
  industry: Industry;
  rank: number;
  index: number;
}) {
  const barClass = `risk-bar-${industry.riskTier}`;
  const badgeClass = TIER_BADGE_CLASS[industry.riskTier];
  // Stagger each row's animation by 30ms
  const animDelay = `${0.05 + index * 0.03}s`;

  return (
    <tr
      className="anim-row group border-b border-slate-100 last:border-0 hover:bg-amber-50/60 transition-colors"
      style={{ animationDelay: animDelay }}
    >
      {/* Rank */}
      <td
        className="py-3.5 pl-5 w-10 text-right text-xs font-mono tabular-nums select-none"
        style={{ color: "var(--color-text-tertiary)" }}
        aria-label={`Rank ${rank}`}
      >
        {rank}
      </td>

      {/* Sector name — th with scope="row" for screen reader column context */}
      <th
        scope="row"
        className="py-3.5 px-4 text-sm font-semibold text-left w-52"
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
        style={{ backgroundColor: "var(--color-navy-deep)" }}
        className="relative overflow-hidden"
      >
        {/* Amber glow — decorative, aria-hidden */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #D97706 0%, transparent 70%)" }}
        />
        {/* Grid pattern */}
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
                className="anim-hero-0 text-[0.6rem] font-bold tracking-[0.35em] uppercase mb-5"
                style={{ color: "var(--color-gold)" }}
              >
                Manitoba Labour Intelligence · 2026
              </p>

              {/* Heading */}
              <h1
                id="hero-heading"
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

              {/* Description */}
              <p
                className="anim-hero-2 mt-6 text-base leading-relaxed max-w-lg"
                style={{ color: "rgba(248, 250, 252, 0.65)" }}
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
            <div className="anim-hero-4 lg:col-span-2 flex flex-col items-start lg:items-center">
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
                  className="font-display font-bold leading-none anim-pulse-amber"
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
        style={{ backgroundColor: "var(--color-paper)" }}
        className="border-b border-slate-100"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
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
              <div key={unit} className="px-8 py-10 flex flex-col gap-2">
                <dt className="flex items-baseline gap-2">
                  <span
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                      color: "var(--color-navy)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {unit}
                  </span>
                </dt>
                <dd
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* METHODOLOGY CALLOUT                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Methodology overview"
        className="border-b border-slate-100"
        style={{ backgroundColor: "var(--color-paper-deep)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex items-start gap-4 max-w-2xl"
            >
              {/* Left amber accent bar */}
              <div
                className="shrink-0 w-1 self-stretch rounded-full"
                style={{ backgroundColor: "var(--color-gold)" }}
                aria-hidden="true"
              />
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Scores combine four evidence-based measures:{" "}
                <strong style={{ color: "var(--color-text-primary)" }}>
                  automation probability
                </strong>
                ,{" "}
                <strong style={{ color: "var(--color-text-primary)" }}>
                  AI occupation exposure
                </strong>
                ,{" "}
                <strong style={{ color: "var(--color-text-primary)" }}>
                  language AI impact
                </strong>
                , and your sector&rsquo;s{" "}
                <strong style={{ color: "var(--color-text-primary)" }}>
                  AI adoption gap
                </strong>
                . Adjusted for business size and current AI adoption level.
              </p>
            </div>
            <Link
              href="/about"
              className="shrink-0 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--color-navy)" }}
            >
              Read the methodology →
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
            {[
              {
                href: "/calculator",
                title: "Get your risk score",
                desc: "Answer 6 questions about your business. Get a personalised AI disruption assessment in 2 minutes.",
                cta: "Start assessment →",
                featured: true,
              },
              {
                href: "/threat-model",
                title: "How AI startups compete",
                desc: "5 research-backed mechanisms — real company evidence and Manitoba context. The deep read.",
                cta: "Read the analysis →",
                featured: false,
              },
              {
                href: "/threat-simulator",
                title: "Compare AI vs. traditional",
                desc: "Side-by-side cost comparison: what a lean AI-native team costs vs. a traditional operation.",
                cta: "Open simulator →",
                featured: false,
              },
              {
                href: "/scenarios",
                title: "What-if scenarios",
                desc: "How does your industry\u2019s risk change if AI spreads quickly \u2014 or if you haven\u2019t started yet?",
                cta: "Explore scenarios →",
                featured: false,
              },
              {
                href: "/explorer",
                title: "All 20 Manitoba industries",
                desc: "Every Manitoba sector ranked by AI disruption exposure, with score breakdowns.",
                cta: "Explore industries →",
                featured: false,
              },
              {
                href: "/occupation",
                title: "50+ occupations scored",
                desc: "Individual occupation risk scores, task vulnerability, and related roles across Manitoba.",
                cta: "Browse occupations →",
                featured: false,
              },
              {
                href: "/heatmap",
                title: "Task vulnerability map",
                desc: "Which tasks in which sectors are most exposed? A colour-coded matrix view.",
                cta: "View heatmap →",
                featured: false,
              },
              {
                href: "/policy",
                title: "Research & sources",
                desc: "Academic sources, Canadian government data, and the full methodology behind these scores.",
                cta: "Read the research →",
                featured: false,
              },
            ].map(({ href, title, desc, cta, featured }) => (
              <Link
                key={href}
                href={href}
                className="group block rounded-xl border p-5 transition-colors hover:border-[var(--color-gold)]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: featured ? "var(--color-gold)" : "var(--color-border)",
                  borderLeftWidth: featured ? "3px" : undefined,
                  borderLeftColor: featured ? "var(--color-gold)" : undefined,
                }}
              >
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

          {/* Industry table — semantic <table> for screen reader column context */}
          <div
            className="rounded-xl border overflow-hidden shadow-sm"
            style={{ borderColor: "var(--color-border)" }}
          >
            <table className="w-full border-collapse" aria-label="Manitoba industry AI disruption risk scores">
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
                    index={i}
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
              className="relative text-[0.6rem] font-bold tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--color-gold)" }}
            >
              6-step assessment · free · no registration
            </p>
            <h2
              className="relative font-display font-bold"
              style={{
                color: "var(--color-text-inverse)",
                fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Understand your specific exposure
            </h2>
            <p
              className="relative mt-3 text-base max-w-md mx-auto"
              style={{ color: "rgba(248, 250, 252, 0.6)" }}
            >
              Answer 6 questions about your industry, business size, and current AI adoption.
              Get a personalized risk score with a shareable link.
            </p>
            <div className="relative mt-8">
              <Link href="/calculator" className="btn-primary">
                Start Free Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
