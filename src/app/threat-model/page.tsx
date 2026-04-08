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
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
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
          </div>

          {/* Definition */}
          <p
            className="text-lg font-medium mb-6"
            style={{ color: "var(--color-text-secondary)", borderLeft: "3px solid #DC2626", paddingLeft: "1.5rem" }}
          >
            AI drops the cost of routine cognitive work to near zero. Tasks that required a $50/hour
            professional now cost fractions of a cent to automate.
          </p>

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
              LLM inference costs fell 280 times in 2.5 years (2022–2025). A task that once required
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
      </section>

      {/* Mechanisms 02-05 + Manitoba section + CTA go here */}
    </>
  );
}
