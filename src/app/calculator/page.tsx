import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { getIndustries, getOccupations, getSectorPlaybooks, getThreatScenarios } from "@/lib/data";
import { BASE_URL, breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import type { AssessmentInput, Industry, Occupation, SectorPlaybook, TaskCategory, ThreatScenario } from "@/types";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = createPageMetadata({
  title: "Manitoba AI Risk Calculator",
  description:
    "Answer six questions to estimate your Manitoba business's AI disruption exposure by sector, workforce mix, business size, and AI readiness.",
  path: "/calculator",
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const BUSINESS_SIZES = new Set(["micro", "small", "medium", "large"]);
const AI_ADOPTION_STATUSES = new Set(["using", "exploring", "not_considering"]);
const TASK_CATEGORIES = new Set<TaskCategory>([
  "data_processing",
  "content_creation",
  "customer_service",
  "physical_manual",
  "decision_making",
  "creative_design",
  "coordination",
  "technical_analysis",
]);
const CUSTOMER_MODELS = new Set(["b2b", "b2c", "both", "government"]);

function isValidPercentage(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function isValidInput(obj: unknown): obj is AssessmentInput {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  const primaryTasks = o.primaryTasks as unknown[];
  const workforceTotal =
    Number(o.knowledgeWorkerPct) + Number(o.manualWorkerPct) + Number(o.customerFacingPct);

  return (
    typeof o.naicsCode === "string" &&
    BUSINESS_SIZES.has(o.businessSize as string) &&
    AI_ADOPTION_STATUSES.has(o.aiAdoptionStatus as string) &&
    Array.isArray(o.primaryTasks) &&
    primaryTasks.length > 0 &&
    primaryTasks.every((task) => TASK_CATEGORIES.has(task as TaskCategory)) &&
    isValidPercentage(o.knowledgeWorkerPct) &&
    isValidPercentage(o.manualWorkerPct) &&
    isValidPercentage(o.customerFacingPct) &&
    workforceTotal <= 100 &&
    CUSTOMER_MODELS.has(o.customerModel as string)
  );
}

function decodeInput(r: string): AssessmentInput | undefined {
  try {
    const decoded = JSON.parse(Buffer.from(r, "base64").toString("utf-8"));
    return isValidInput(decoded) ? decoded : undefined;
  } catch {
    return undefined;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const industries: Industry[] = getIndustries();
  const occupations: Occupation[] = getOccupations();
  const playbooks: SectorPlaybook[] = getSectorPlaybooks();
  const threatScenarios: ThreatScenario[] = getThreatScenarios();
  const params = await searchParams;
  const decodedInput = params.r ? decodeInput(params.r) : undefined;
  const initialInput =
    decodedInput && industries.some((industry) => industry.naicsCode === decodedInput.naicsCode)
      ? decodedInput
      : undefined;
  const calculatorJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Manitoba AI Risk Calculator",
    url: `${BASE_URL}/calculator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    description:
      "A browser-based AI disruption exposure calculator for Manitoba businesses, using sector, workforce, business size, and AI readiness inputs.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
  };

  return (
    <>
      <JsonLd data={calculatorJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Manitoba AI Risk Calculator", path: "/calculator" },
        ])}
      />
      <div
        className="min-h-screen py-12"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        <section
          aria-label="Calculator overview"
          className="mx-auto mb-10 max-w-4xl px-4 sm:px-6 lg:px-8"
        >
          <div
            className="civic-panel civic-panel-strong px-5 py-6"
            style={{ borderColor: "var(--color-text-primary)" }}
          >
            <p
              className="text-[0.6rem] font-bold uppercase tracking-[0.24em]"
              style={{ color: "var(--color-gold)" }}
            >
              Manitoba AI risk calculator
            </p>
            <h1
              className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl"
              style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
            >
              Estimate your business exposure in six practical questions.
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Use this free Manitoba AI disruption calculator to compare your sector,
              workforce mix, business size, customer model, and AI readiness against
              labour-market exposure research. Your answers stay in your browser.
            </p>
          </div>
        </section>
        <CalculatorClient
          industries={industries}
          occupations={occupations}
          playbooks={playbooks}
          threatScenarios={threatScenarios}
          initialInput={initialInput}
        />
      </div>
    </>
  );
}
