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

      {/* Mechanism sections + Manitoba section + CTA go here in subsequent tasks */}
    </>
  );
}
