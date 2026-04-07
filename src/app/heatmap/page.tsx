import type { Metadata } from "next";
import Link from "next/link";
import { getOccupations, getIndustries } from "@/lib/data";
import type { TaskCategory, RiskTier, HeatmapCell } from "@/types";
import { HeatmapClient } from "./HeatmapClient";

export const metadata: Metadata = {
  title: "Task Vulnerability Heatmap",
  description:
    "An 8×20 matrix showing employment-weighted AI disruption scores across task categories and Manitoba industry sectors.",
};

// ── Constants ─────────────────────────────────────────────────────────────────

const TASK_CATEGORIES: TaskCategory[] = [
  "data_processing",
  "content_creation",
  "customer_service",
  "physical_manual",
  "decision_making",
  "creative_design",
  "coordination",
  "technical_analysis",
];

const TASK_LABELS: Record<TaskCategory, string> = {
  data_processing: "Data Processing",
  content_creation: "Content Creation",
  customer_service: "Customer Service",
  physical_manual: "Physical / Manual",
  decision_making: "Decision Making",
  creative_design: "Creative Design",
  coordination: "Coordination",
  technical_analysis: "Technical Analysis",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTier(score: number): RiskTier {
  if (score > 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HeatmapPage() {
  const occupations = getOccupations();
  const industries = getIndustries();

  // Build the 8×20 matrix: rows = task categories, columns = industries
  const matrix: HeatmapCell[][] = TASK_CATEGORIES.map((taskCat) => {
    return industries.map((ind) => {
      // Find occupations that belong to this sector AND have this task category
      const matching = occupations.filter(
        (occ) =>
          occ.naicsSectors.includes(ind.naicsCode) &&
          occ.taskCategories.includes(taskCat)
      );

      if (matching.length === 0) {
        return {
          taskCategory: taskCat,
          naicsCode: ind.naicsCode,
          score: null,
          tier: null,
          occupationCount: 0,
          drivingOccupations: [],
        };
      }

      // Employment-weighted average compositeScore
      const totalEmployment = matching.reduce(
        (sum, occ) => sum + occ.mbEmployment,
        0
      );
      const weightedScore =
        totalEmployment > 0
          ? matching.reduce(
              (sum, occ) =>
                sum + occ.compositeScore * occ.mbEmployment,
              0
            ) / totalEmployment
          : matching.reduce((sum, occ) => sum + occ.compositeScore, 0) /
            matching.length;

      const score = Math.round(weightedScore * 10) / 10;

      // Top driving occupations sorted by compositeScore desc
      const drivingOccupations = [...matching]
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 5)
        .map((occ) => ({
          nocCode: occ.nocCode,
          shortTitle: occ.shortTitle,
          compositeScore: occ.compositeScore,
        }));

      return {
        taskCategory: taskCat,
        naicsCode: ind.naicsCode,
        score,
        tier: getTier(score),
        occupationCount: matching.length,
        drivingOccupations,
      };
    });
  });

  // Count high-exposure intersections
  const highCount = matrix
    .flat()
    .filter((cell) => cell.tier === "high").length;

  // Prepare industry props for the client
  const industryProps = industries.map((ind) => ({
    naicsCode: ind.naicsCode,
    shortName: ind.shortName,
    sectorRiskScore: ind.sectorRiskScore,
  }));

  return (
    <>
      {/* ── Page hero ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="heatmap-heading"
        style={{ backgroundColor: "var(--color-navy-deep)" }}
        className="relative overflow-hidden"
      >
        {/* Amber glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle, #D97706 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 survey-grid"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol
              className="flex items-center gap-2 text-xs"
              style={{ color: "rgba(248,250,252,0.45)" }}
            >
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white focus-inverse"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li style={{ color: "rgba(248,250,252,0.75)" }}>Heatmap</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p
              className="text-[0.6rem] font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: "var(--color-gold)" }}
            >
              Task-sector matrix · 8 task types · {industries.length} sectors
            </p>
            <h1
              id="heatmap-heading"
              className="font-display font-bold leading-tight"
              style={{
                color: "var(--color-text-inverse)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Task Vulnerability Heatmap
            </h1>
            <p
              className="mt-4 text-base leading-relaxed max-w-xl"
              style={{ color: "rgba(248, 250, 252, 0.6)" }}
            >
              An employment-weighted matrix showing where AI disruption
              concentrates across eight task categories and twenty Manitoba
              industry sectors.
            </p>

            {/* High-exposure stat */}
            <div
              className="mt-6 inline-flex items-center gap-3 rounded-lg px-4 py-2.5"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="font-display font-bold text-2xl"
                style={{
                  color: "var(--color-gold)",
                  letterSpacing: "-0.03em",
                }}
              >
                {highCount}
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(248,250,252,0.7)" }}
              >
                <strong style={{ color: "#F87171" }}>high-exposure</strong>{" "}
                intersections across the matrix
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Plain-language explainer ──────────────────────────────────────── */}
      <section
        aria-label="How to read this heatmap"
        style={{ backgroundColor: "var(--color-paper-deep)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-gold)" }}>
                What you&apos;re looking at
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Each cell shows the average AI disruption score for occupations in a given industry that perform a given type of task. Scores run 0–100. Higher means more exposed to AI disruption.
              </p>
            </div>
            <div>
              <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-gold)" }}>
                How scores are weighted
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Scores are weighted by employment — occupations with more Manitoba workers pull the cell score more than smaller ones. A dash means no occupations in that combination were found in the data.
              </p>
            </div>
            <div>
              <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-gold)" }}>
                What to do with it
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Click any cell to see which occupations are driving that score. Columns are sorted by overall sector risk, highest on the left. The coloured dot above each column shows that sector&apos;s overall risk level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Heatmap grid ──────────────────────────────────────────────────── */}
      <section
        aria-label="Heatmap matrix"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <HeatmapClient
            matrix={matrix}
            industries={industryProps}
            taskLabels={TASK_LABELS}
          />
        </div>
      </section>
    </>
  );
}
