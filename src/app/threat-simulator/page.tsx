import type { Metadata } from "next";
import Link from "next/link";
import { getThreatScenarios, getIndustries } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";
import { ThreatSimulatorClient } from "./ThreatSimulatorClient";

export const metadata: Metadata = createPageMetadata({
  title: "Lean AI Startup Threat Model",
  description:
    "See how a lean AI-native startup can outperform traditional teams on cost, speed, and output across key Manitoba sectors.",
  path: "/threat-simulator",
});

export default function ThreatSimulatorPage() {
  const scenarios = getThreatScenarios();
  const industries = getIndustries();

  return (
    <>
      {/* ── Page hero ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="threat-heading"
        style={{ backgroundColor: "var(--color-navy-deep)" }}
        className="civic-page-hero relative overflow-hidden"
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
              <li style={{ color: "rgba(248,250,252,0.75)" }}>Threat Model</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p
              className="text-[0.6rem] font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: "var(--color-gold)" }}
            >
              Competitive threat analysis · {scenarios.length} scenarios · side-by-side comparison
            </p>
            <h1
              id="threat-heading"
              className="font-display font-bold leading-tight"
              style={{
                color: "var(--color-text-inverse)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.025em",
              }}
            >
              What does a lean AI competitor look like?
            </h1>
            <p
              className="mt-4 text-base leading-relaxed max-w-xl"
              style={{ color: "rgba(248, 250, 252, 0.6)" }}
            >
              A three-person AI-native startup can now match the output of a
              20-person traditional team — at a fraction of the cost. These
              scenarios model what that threat looks like across Manitoba sectors.
            </p>

            {/* Stat callout */}
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
                $3.48M
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(248,250,252,0.7)" }}
              >
                revenue per employee at AI-native startups —{" "}
                <strong style={{ color: "#F87171" }}>4x the traditional average</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive simulator ─────────────────────────────────────────── */}
      <section
        aria-label="Threat scenario comparison"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ThreatSimulatorClient scenarios={scenarios} industries={industries} />
        </div>
      </section>
    </>
  );
}
