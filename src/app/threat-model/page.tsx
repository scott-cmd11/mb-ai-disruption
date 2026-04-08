import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Threat Model",
  description:
    "Research-backed analysis of 5 mechanisms AI-native startups use to outcompete traditional businesses — with real company evidence and Manitoba context.",
};

export default function ThreatModelPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="threat-model-heading"
        style={{ backgroundColor: "var(--color-navy-deep)" }}
        className="relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #D97706 0%, transparent 70%)" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 survey-grid" />

        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs" style={{ color: "rgba(248,250,252,0.45)" }}>
              <li>
                <Link href="/" className="transition-colors hover:text-white focus-inverse">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li style={{ color: "rgba(248,250,252,0.75)" }}>Threat Model</li>
            </ol>
          </nav>

          <p
            className="text-[0.6rem] font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: "var(--color-gold)" }}
          >
            Threat Model · 5 Mechanisms · Research-Backed
          </p>
          <h1
            id="threat-model-heading"
            className="font-display font-bold leading-tight"
            style={{
              color: "var(--color-text-inverse)",
              fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
              letterSpacing: "-0.025em",
            }}
          >
            5 ways AI startups outcompete established businesses
          </h1>
          <p
            className="mt-4 text-base leading-relaxed max-w-2xl"
            style={{ color: "rgba(248, 250, 252, 0.65)" }}
          >
            A lean AI-native startup can now deliver more output, faster, at a fraction of the cost.
            Here&apos;s the research on exactly how — and what it means for Manitoba.
          </p>

          {/* Anchor credibility stat */}
          <div
            className="mt-6 inline-flex items-center gap-3 rounded-lg px-4 py-2.5"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="font-display font-bold text-2xl shrink-0"
              style={{ color: "var(--color-gold)", letterSpacing: "-0.03em" }}
            >
              280×
            </span>
            <span className="text-sm" style={{ color: "rgba(248,250,252,0.7)" }}>
              drop in AI computing costs over 2.5 years — the economic foundation of every mechanism below.{" "}
              <span className="text-xs" style={{ color: "rgba(248,250,252,0.4)" }}>
                Source: Epoch AI / CloudZero 2025
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Mechanism 01: Price Floor Collapse ────────────────────────── */}
      <section
        aria-labelledby="mechanism-01"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <details className="group">
          <summary className="block mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden">

            {/* Clickable header row */}
            <div className="flex items-center gap-4">
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ backgroundColor: "#DC2626" }}
                aria-hidden="true"
              >
                01
              </span>
              <h2
                id="mechanism-01"
                className="font-display font-bold"
                style={{ color: "var(--color-text-primary)", fontSize: "1.4rem", letterSpacing: "-0.02em" }}
              >
                Price floor collapse
              </h2>
              {/* Chevron — rotates when open */}
              <svg
                className="ml-auto w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: "var(--color-text-tertiary)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Definition — visible in collapsed state */}
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: "var(--color-text-secondary)", borderLeft: "3px solid #DC2626", paddingLeft: "1.5rem" }}
            >
              AI drops the cost of routine cognitive work to near zero. Tasks that required a $50/hour
              professional now cost fractions of a cent to automate.
            </p>

          </summary>

          {/* Expandable content */}
          <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">

          {/* Stat callout */}
          <div
            className="rounded-lg p-5 mb-6"
            style={{
              backgroundColor: "rgba(217, 119, 6, 0.08)",
              borderLeft: "3px solid var(--color-gold)",
            }}
          >
            <p className="text-2xl font-display font-bold" style={{ color: "var(--color-navy-deep)", letterSpacing: "-0.03em" }}>
              280× cheaper
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              AI computing costs fell 280 times in 2.5 years (2022–2025). A task that once required
              significant compute time now costs fractions of a cent.
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              Source: Epoch AI; CloudZero 2025 State of AI Costs — independently measured infrastructure pricing
            </p>
          </div>

          {/* Evidence */}
          <div className="space-y-4 mb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              <strong style={{ color: "var(--color-text-primary)" }}>The Klarna story — both acts.</strong>{" "}
              In February 2024, Klarna announced its AI assistant had handled 2.3 million customer conversations
              in its first month — the equivalent workload of 700 full-time agents. Resolution time fell from
              11 minutes to under 2 minutes. The company projected a $40M profit improvement for the year.
              (Source: Klarna press release, Feb 27 2024.)
            </p>
            <p>
              By May 2025, the story had a second act: customer satisfaction dropped 22%. CEO Sebastian
              Siemiatkowski admitted that &ldquo;cost unfortunately seems to have been a too predominant
              evaluation factor.&rdquo; Klarna began rehiring human agents. (Source: Bloomberg, Fortune,
              CX Dive — independently reported.)
            </p>
            <p>
              <strong style={{ color: "var(--color-text-primary)" }}>What both acts together show:</strong>{" "}
              Pure AI replacement failed. But Klarna&apos;s per-transaction customer service cost still
              dropped 40% — from $0.32 to $0.19 — even after the rehiring began. The hybrid firm
              (AI + humans) won on cost. The business that ignored AI entirely would be competing against
              that 40% cost advantage with no structural offset.
            </p>
          </div>

          {/* Manitoba sectors */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--color-text-tertiary)" }}>
              Manitoba sectors facing this
            </p>
            <div className="flex flex-wrap gap-2">
              {["Legal", "Accounting", "Marketing agencies", "Customer support", "Bookkeeping"].map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: "rgba(220, 38, 38, 0.06)",
                    borderColor: "rgba(220, 38, 38, 0.2)",
                    color: "#991B1B",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* What to watch for */}
          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
              What to watch for
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              A competitor quoting significantly lower rates for the same scope of work — or a new entrant
              offering flat-fee pricing where hourly billing was the norm. That pricing shift is usually
              the first visible sign of AI-enabled cost compression in a local market.
            </p>
          </div>

          </div>
        </details>
      </section>

      {/* ── Mechanism 02: Speed Arbitrage ──────────────────────────────── */}
      <section
        aria-labelledby="mechanism-02"
        style={{ backgroundColor: "var(--color-paper-deep)" }}
      >
        <details className="group">
          <summary className="block mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden">

            {/* Clickable header row */}
            <div className="flex items-center gap-4">
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ backgroundColor: "#D97706" }}
                aria-hidden="true"
              >
                02
              </span>
              <h2
                id="mechanism-02"
                className="font-display font-bold"
                style={{ color: "var(--color-text-primary)", fontSize: "1.4rem", letterSpacing: "-0.02em" }}
              >
                Speed arbitrage
              </h2>
              {/* Chevron — rotates when open */}
              <svg
                className="ml-auto w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: "var(--color-text-tertiary)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Definition — visible in collapsed state */}
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: "var(--color-text-secondary)", borderLeft: "3px solid #D97706", paddingLeft: "1.5rem" }}
            >
              AI compresses delivery time from days or hours to minutes.
              The first firm to deliver gets the work.
            </p>

          </summary>

          {/* Expandable content */}
          <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">

          <div
            className="rounded-lg p-5 mb-6"
            style={{
              backgroundColor: "rgba(217, 119, 6, 0.08)",
              borderLeft: "3px solid var(--color-gold)",
            }}
          >
            <p className="text-2xl font-display font-bold" style={{ color: "var(--color-navy-deep)", letterSpacing: "-0.03em" }}>
              19% → 79%
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Legal professionals using AI jumped from 19% to 79% in a single year — 2023 to 2024.
              Speed is why: clients expect faster answers, and AI delivers them.
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              Source: Clio 2024 Legal Trends Report — large-sample annual industry survey
            </p>
          </div>

          <div className="space-y-4 mb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              Contract review that used to take 2 hours now takes 15 minutes for firms using AI tools
              (LegalFly customer data). Across multiple providers, customers report 70–85% time savings
              on standard contract work (LegalOn aggregated data). Aviva Insurance deployed AI agents
              for liability assessment and cut processing time by 23 days — independently reported across
              multiple news outlets, with complaints falling 65% and total savings exceeding £60M in 2024.
            </p>
            <p>
              Speed is a competitive differentiator independent of price. A client choosing between a firm
              that delivers in 15 minutes versus 2 days will choose speed — even at equal cost. Once
              AI-augmented competitors set a new baseline for turnaround time, slower delivery feels
              like a service failure rather than normal practice.
            </p>
            <p>
              Clio&apos;s 2024 data also found that 74% of billable legal hours are potentially
              automatable by AI — not because AI replaces judgment, but because most billable hours
              are spent on research, drafting, and review rather than final decisions.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--color-text-tertiary)" }}>
              Manitoba sectors facing this
            </p>
            <div className="flex flex-wrap gap-2">
              {["Legal", "Professional services", "Insurance", "Real estate services"].map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: "rgba(217, 119, 6, 0.06)",
                    borderColor: "rgba(217, 119, 6, 0.25)",
                    color: "#92400E",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
              What to watch for
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Clients beginning to ask &ldquo;how quickly can you turn this around?&rdquo; as a primary
              question — or competitors quoting same-day turnaround on work that traditionally takes days.
              When speed becomes the conversation, the competitive baseline has already shifted.
            </p>
          </div>
          </div>
        </details>
      </section>

      {/* ── Mechanism 03: Scale Without Headcount ──────────────────────── */}
      <section
        aria-labelledby="mechanism-03"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <details className="group">
          <summary className="block mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden">

            {/* Clickable header row */}
            <div className="flex items-center gap-4">
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ backgroundColor: "#7C3AED" }}
                aria-hidden="true"
              >
                03
              </span>
              <h2
                id="mechanism-03"
                className="font-display font-bold"
                style={{ color: "var(--color-text-primary)", fontSize: "1.4rem", letterSpacing: "-0.02em" }}
              >
                Scale without headcount
              </h2>
              {/* Chevron — rotates when open */}
              <svg
                className="ml-auto w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: "var(--color-text-tertiary)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Definition — visible in collapsed state */}
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: "var(--color-text-secondary)", borderLeft: "3px solid #7C3AED", paddingLeft: "1.5rem" }}
            >
              AI-native firms grow their output without growing their team.
              Traditional firms that must hire to scale are structurally disadvantaged.
            </p>

          </summary>

          {/* Expandable content */}
          <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">

          <div
            className="rounded-lg p-5 mb-6"
            style={{
              backgroundColor: "rgba(217, 119, 6, 0.08)",
              borderLeft: "3px solid var(--color-gold)",
            }}
          >
            <p className="text-2xl font-display font-bold" style={{ color: "var(--color-navy-deep)", letterSpacing: "-0.03em" }}>
              $7.5M per employee
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Midjourney — ~40 employees, $300M in revenue. Google, by comparison, generates around
              $1.8M per employee. The ceiling for revenue per person has structurally shifted.
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              Source: Sacra; multiple outlets, 2024. Note: AI product company used to illustrate the structural shift — not a direct service firm comparison.
            </p>
          </div>

          <div className="space-y-4 mb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              14.ai — a Y Combinator startup — runs 24/7 customer support for multiple client companies
              simultaneously with a team of six people. (Source: TechCrunch, March 2026.) That&apos;s not
              six people working longer hours. It&apos;s six people, AI agents, and infrastructure that
              doesn&apos;t need sleep.
            </p>
            <p>
              Andreessen Horowitz&apos;s 2024 analysis of the business process outsourcing (BPO) market
              documented AI-native disruptors achieving 80%+ first-contact resolution rates at staffing
              fractions of traditional BPO firms — with the $300B BPO market identified as one of the
              most structurally vulnerable to AI replacement.
            </p>
            <p>
              The standard benchmark for a well-run software company is $300,000 revenue per employee.
              Leading AI-native service firms are achieving 3–10 times that. The economics of building
              a service business have changed — but most traditional service firms are still pricing and
              staffing as though they haven&apos;t.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--color-text-tertiary)" }}>
              Manitoba sectors facing this
            </p>
            <div className="flex flex-wrap gap-2">
              {["Marketing agencies", "Bookkeeping firms", "Administrative support", "Customer support", "Freight brokerage"].map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: "rgba(124, 58, 237, 0.06)",
                    borderColor: "rgba(124, 58, 237, 0.2)",
                    color: "#5B21B6",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
              What to watch for
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              A competitor that hasn&apos;t visibly hired growing their client base or output significantly.
              Or a new entrant with a very small listed team serving clients at scale. Headcount is no longer
              a reliable proxy for capacity.
            </p>
          </div>
          </div>
        </details>
      </section>

      {/* ── Mechanism 04: Junior Work at AI Quality ────────────────────── */}
      <section
        aria-labelledby="mechanism-04"
        style={{ backgroundColor: "var(--color-paper-deep)" }}
      >
        <details className="group">
          <summary className="block mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden">

            {/* Clickable header row */}
            <div className="flex items-center gap-4">
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ backgroundColor: "#0891B2" }}
                aria-hidden="true"
              >
                04
              </span>
              <h2
                id="mechanism-04"
                className="font-display font-bold"
                style={{ color: "var(--color-text-primary)", fontSize: "1.4rem", letterSpacing: "-0.02em" }}
              >
                Junior work at AI quality
              </h2>
              {/* Chevron — rotates when open */}
              <svg
                className="ml-auto w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: "var(--color-text-tertiary)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Definition — visible in collapsed state */}
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: "var(--color-text-secondary)", borderLeft: "3px solid #0891B2", paddingLeft: "1.5rem" }}
            >
              AI now handles the structured, routine work that junior staff were hired to do —
              at comparable quality, instantly, without training time or turnover costs.
            </p>

          </summary>

          {/* Expandable content */}
          <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">

          <div
            className="rounded-lg p-5 mb-6"
            style={{
              backgroundColor: "rgba(217, 119, 6, 0.08)",
              borderLeft: "3px solid var(--color-gold)",
            }}
          >
            <p className="text-2xl font-display font-bold" style={{ color: "var(--color-navy-deep)", letterSpacing: "-0.03em" }}>
              31% of Canadian workers
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              are in jobs with high AI exposure and low complementarity — the category most at risk
              for displacement rather than augmentation.
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              Source: Statistics Canada experimental estimates, Mehdi &amp; Morissette, 2024 — government statistical agency data
            </p>
          </div>

          <div className="space-y-4 mb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              The Association of Corporate Counsel has described Casetext Co-Counsel (a legal AI tool)
              as &ldquo;roughly the quality of an entry-level associate&rdquo; for legal research.
              Harvey AI — used by 100,000+ lawyers at over 1,300 firms including major AmLaw 100
              firms — matched human baseline performance (80.2%) on legal chronology generation tasks
              in published benchmarks.
            </p>
            <p>
              Decagon, an AI-native customer support company, achieves 80%+ first-contact resolution
              rates on support tickets — better than many human tier-1 teams. Camber, in healthcare
              claims processing, documented 80% fewer first-submission denials for one customer (a16z
              case study).
            </p>
            <p>
              <strong style={{ color: "var(--color-text-primary)" }}>An important caveat:</strong>{" "}
              AI regularly makes errors on complex judgment, hallucinates legal citations, and misapplies
              jurisdiction-specific standards. The ABA&apos;s 2024 survey found 74.7% of legal
              respondents cite accuracy as a major concern. Human oversight remains essential for
              final decisions. The threat is not that AI replaces experienced professionals — it&apos;s
              that it replaces the junior work that makes professional service firms economically scalable.
            </p>
            <p>
              The junior bookkeeper&apos;s routine reconciliation. The paralegal&apos;s first-pass
              research. The junior copywriter&apos;s first draft. Those are the roles that let a small
              local firm grow beyond the founding partners — and they&apos;re directly in the crosshairs.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--color-text-tertiary)" }}>
              Manitoba sectors facing this
            </p>
            <div className="flex flex-wrap gap-2">
              {["Bookkeeping & accounting", "Law offices (paralegal work)", "Marketing agencies", "Administrative support", "Data entry & processing"].map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: "rgba(8, 145, 178, 0.06)",
                    borderColor: "rgba(8, 145, 178, 0.2)",
                    color: "#0E7490",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
              What to watch for
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Clients doing their own first-pass research or drafting before bringing work to you — and
              asking you to review or improve rather than create from scratch. The value-add is shifting
              up the expertise stack. Firms that only sell first-draft work are the most exposed.
            </p>
          </div>
          </div>
        </details>
      </section>

      {/* ── Mechanism 05: Always-On ─────────────────────────────────────── */}
      <section
        aria-labelledby="mechanism-05"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <details className="group">
          <summary className="block mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden">

            {/* Clickable header row */}
            <div className="flex items-center gap-4">
              <span
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ backgroundColor: "#059669" }}
                aria-hidden="true"
              >
                05
              </span>
              <h2
                id="mechanism-05"
                className="font-display font-bold"
                style={{ color: "var(--color-text-primary)", fontSize: "1.4rem", letterSpacing: "-0.02em" }}
              >
                Always-on, no overhead
              </h2>
              {/* Chevron — rotates when open */}
              <svg
                className="ml-auto w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: "var(--color-text-tertiary)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Definition — visible in collapsed state */}
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: "var(--color-text-secondary)", borderLeft: "3px solid #059669", paddingLeft: "1.5rem" }}
            >
              An AI-native competitor is available 24 hours a day, in any language, with no sick days,
              overtime pay, or turnover — at exactly the same cost as business hours.
            </p>

          </summary>

          {/* Expandable content */}
          <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">

          <div
            className="rounded-lg p-5 mb-6"
            style={{
              backgroundColor: "rgba(217, 119, 6, 0.08)",
              borderLeft: "3px solid var(--color-gold)",
            }}
          >
            <p className="text-2xl font-display font-bold" style={{ color: "var(--color-navy-deep)", letterSpacing: "-0.03em" }}>
              $80B
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Gartner&apos;s forecast reduction in contact centre labour costs by 2026 from AI — driven
              almost entirely by the elimination of after-hours and overflow staffing costs.
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              Source: Gartner, reported across multiple industry outlets
            </p>
          </div>

          <div className="space-y-4 mb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              Emma Finance ran an 8-month case study (Feb–Oct 2025) with one human agent plus AI handling
              Tier 1 customer queries overnight. The result: a 124% increase in monthly support interactions
              and a doubled customer base — without adding staff. (Source: DevRev case study.)
            </p>
            <p>
              Avoca handles after-hours and overflow calls for HVAC, plumbing, and electrical businesses
              across North America — booking appointments, answering pricing questions, and dispatching
              jobs end-to-end without human involvement. For a Winnipeg trades business, that&apos;s
              a direct competitor for after-hours call volume.
            </p>
            <p>
              Klarna&apos;s AI assistant runs 24/7 across 23 markets in 35+ languages — an availability
              profile that would require hundreds of shift workers to replicate with human staffing.
            </p>
            <p>
              Previously, only 15% of companies could afford true 24/7 support. That advantage was a
              moat. AI has erased it.
            </p>
          </div>

          {/* Manitoba-specific callout */}
          <div
            className="rounded-lg p-4 mb-6"
            style={{
              backgroundColor: "rgba(5, 150, 105, 0.06)",
              borderLeft: "3px solid #059669",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "#065F46" }}>
              What this means in Winnipeg
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              A local accounting firm competing against an AI-native bookkeeping service that answers
              client queries at 11pm is no longer competing on office hours. The comparison
              isn&apos;t &ldquo;my staff vs. their staff.&rdquo; It&apos;s &ldquo;my office hours vs.
              their machine that never closes.&rdquo;
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--color-text-tertiary)" }}>
              Manitoba sectors facing this
            </p>
            <div className="flex flex-wrap gap-2">
              {["Any customer-facing service business", "Trades & home services", "Accounting & bookkeeping", "Legal intake", "Real estate"].map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: "rgba(5, 150, 105, 0.06)",
                    borderColor: "rgba(5, 150, 105, 0.2)",
                    color: "#065F46",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
              What to watch for
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Client expectations shifting toward same-day or after-hours response as normal — or losing
              a client who mentions response time as a factor. When clients stop expecting business-hours
              response windows, the firms that can&apos;t match that pace have already lost a dimension
              of competition.
            </p>
          </div>
          </div>
        </details>
      </section>

      {/* ── What This Means for Manitoba ────────────────────────────────── */}
      <section
        aria-labelledby="manitoba-heading"
        style={{ backgroundColor: "var(--color-navy-deep)" }}
        className="relative overflow-hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 survey-grid opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">

          <p
            className="text-[0.6rem] font-bold tracking-[0.35em] uppercase mb-3"
            style={{ color: "var(--color-gold)" }}
          >
            Manitoba context
          </p>
          <h2
            id="manitoba-heading"
            className="font-display font-bold mb-8"
            style={{
              color: "var(--color-text-inverse)",
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            What this means for Manitoba businesses
          </h2>

          {/* Stat grid */}
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
            {[
              { value: "12%", label: "of Canadian firms now use AI", sub: "doubled year-over-year", source: "Stats Canada 2024–25" },
              { value: "31.7%", label: "AI adoption in professional services", sub: "#2 sector in Canada", source: "Stats Canada" },
              { value: "57.4%", label: "of Canadian jobs are highly AI-exposed", sub: "", source: "Future Skills Centre, Sept 2025" },
              { value: "1 hr/day", label: "average time AI saves Canadian SMEs", sub: "$1.60 return per $1 invested", source: "CFIB 2025" },
            ].map(({ value, label, sub, source }) => (
              <div
                key={value}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <dt>
                  <span
                    className="block font-display font-bold text-2xl leading-none"
                    style={{ color: "var(--color-gold)", letterSpacing: "-0.03em" }}
                  >
                    {value}
                  </span>
                  <span className="block text-xs mt-1.5 leading-snug" style={{ color: "rgba(248,250,252,0.7)" }}>
                    {label}
                  </span>
                  {sub && (
                    <span className="block text-xs mt-0.5" style={{ color: "rgba(248,250,252,0.4)" }}>
                      {sub}
                    </span>
                  )}
                </dt>
                <dd className="mt-2 text-[0.6rem]" style={{ color: "rgba(248,250,252,0.3)" }}>
                  {source}
                </dd>
              </div>
            ))}
          </dl>

          {/* Canadian signal */}
          <div
            className="rounded-xl p-6 mb-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "rgba(248,250,252,0.4)" }}
            >
              The Canadian signal
            </p>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: "rgba(248,250,252,0.7)" }}>
              <p>
                <strong style={{ color: "rgba(248,250,252,0.9)" }}>Spellbook</strong> — an Ottawa-based
                legal AI company — serves 4,000+ legal teams at a $350M valuation and has partnered with
                the Canadian Bar Association. The bar association is institutionalising AI legal tools.
                This is not a fringe trend, and it&apos;s not American. It&apos;s already inside Canadian
                legal practice.
              </p>
              <p>
                The Manitoba Chambers of Commerce and the Province of Manitoba have jointly invested $2M
                in the Manitoba AI Pathways program to help local SMEs adopt AI — an acknowledgment that
                the transition is already underway and requires active support.
              </p>
              <p>
                The Canadian Chamber of Commerce warned in 2025–26 that &ldquo;Canada risks falling behind
                on AI adoption as businesses wait out trade uncertainty.&rdquo; Hesitation has a cost.
              </p>
            </div>
          </div>

          {/* Honest framing */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "rgba(217, 119, 6, 0.1)",
              border: "1px solid rgba(217, 119, 6, 0.25)",
            }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "var(--color-gold)" }}
            >
              The honest picture
            </p>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: "rgba(248,250,252,0.75)" }}>
              <p>
                Statistics Canada data shows only 6% of AI-adopting Canadian firms have reduced headcount
                so far. The disruption is not arriving as mass layoffs — it&apos;s arriving as margin
                compression and pricing pressure first.
              </p>
              <p>
                Klarna&apos;s per-transaction service cost fell 40% before they rehired a single person.
                The Clio data shows legal billing models shifting — flat-fee billing is up 34% since 2016.
                The disruption shows up in your pricing power before it shows up in your headcount.
              </p>
              <p style={{ color: "rgba(248,250,252,0.9)" }}>
                <strong>The warning is not &ldquo;you will lose your job.&rdquo;</strong>{" "}
                It&apos;s: a competitor using AI can undercut your price and still make money — and that
                window is opening now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Strip ──────────────────────────────────────────────────── */}
      <section
        aria-label="Next steps"
        className="border-t"
        style={{
          backgroundColor: "var(--color-paper-deep)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-6 text-center"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            What to do next
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                href: "/threat-simulator",
                label: "See the cost numbers",
                desc: "Side-by-side: what a lean AI-native team can do vs. a traditional operation in your sector.",
                cta: "Open threat simulator →",
              },
              {
                href: "/calculator",
                label: "Get your risk score",
                desc: "6 questions, 2 minutes. A personalised AI disruption assessment for your industry and business size.",
                cta: "Start assessment →",
              },
              {
                href: "/policy",
                label: "Read the full research",
                desc: "Academic sources, Canadian government data, and the policy context behind these findings.",
                cta: "View research →",
              },
            ].map(({ href, label, desc, cta }) => (
              <Link
                key={href}
                href={href}
                className="group block rounded-xl border p-5 transition-colors hover:border-[var(--color-gold)]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <p
                  className="font-semibold text-sm mb-1.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {label}
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
    </>
  );
}
