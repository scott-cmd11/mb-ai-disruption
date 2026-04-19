import type { Metadata } from "next";
import Link from "next/link";
import { getOccupations, getIndustries } from "@/lib/data";
import { OccupationClient } from "./OccupationClient";
import { RelatedLinks } from "@/components/RelatedLinks";

export const metadata: Metadata = {
  title: "Occupation Risk Explorer",
  description:
    "Explore AI disruption risk scores for Manitoba occupations — search, filter, and compare by sector, risk tier, and employment.",
};

export default function OccupationPage() {
  const occupations = getOccupations();
  const industries = getIndustries();

  const highRiskCount = occupations.filter((o) => o.riskTier === "high").length;

  return (
    <>
      {/* ── Page hero ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="occupation-heading"
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
              <li style={{ color: "rgba(248,250,252,0.75)" }}>Occupation Explorer</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p
              className="text-[0.6rem] font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: "var(--color-gold)" }}
            >
              Occupation analysis · {occupations.length} occupations · {industries.length} sectors
            </p>
            <h1
              id="occupation-heading"
              className="font-display font-bold leading-tight"
              style={{
                color: "var(--color-text-inverse)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Which occupations face the highest AI disruption risk?
            </h1>
            <p
              className="mt-4 text-base leading-relaxed max-w-xl"
              style={{ color: "rgba(248, 250, 252, 0.6)" }}
            >
              Search and filter Manitoba occupations by sector, risk tier, and
              employment. Click any occupation to see its full risk breakdown.
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
                {highRiskCount}
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(248,250,252,0.7)" }}
              >
                of {occupations.length} occupations at{" "}
                <strong style={{ color: "#F87171" }}>high risk</strong>{" "}
                of AI disruption
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive explorer ──────────────────────────────────────────── */}
      <section
        aria-label="Occupation explorer"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <OccupationClient occupations={occupations} industries={industries} />
        </div>
      </section>

      <RelatedLinks
        links={[
          {
            href: "/explorer",
            label: "Industry explorer",
            description:
              "See how each occupation rolls up into its parent Manitoba sector.",
          },
          {
            href: "/heatmap",
            label: "Task heatmap",
            description:
              "Cross-cut by task type — data, content, decisions, physical work, and more.",
          },
          {
            href: "/calculator",
            label: "Personal score",
            description:
              "Adjust for your business size and AI adoption to get your own risk tier.",
          },
        ]}
      />
    </>
  );
}
