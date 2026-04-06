import type { Metadata } from "next";
import { getIndustries, getOccupations, getSectorPlaybooks, getThreatScenarios } from "@/lib/data";
import type { AssessmentInput, Industry, Occupation, SectorPlaybook, ThreatScenario } from "@/types";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Self-Assessment Calculator",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidInput(obj: unknown): obj is AssessmentInput {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.naicsCode === "string" &&
    ["micro", "small", "medium", "large"].includes(o.businessSize as string) &&
    ["using", "exploring", "not_considering"].includes(o.aiAdoptionStatus as string) &&
    Array.isArray(o.primaryTasks) &&
    (o.primaryTasks as unknown[]).length > 0 &&
    typeof o.knowledgeWorkerPct === "number" &&
    typeof o.manualWorkerPct === "number" &&
    typeof o.customerFacingPct === "number" &&
    ["b2b", "b2c", "both", "government"].includes(o.customerModel as string)
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
  const initialInput = params.r ? decodeInput(params.r) : undefined;

  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <CalculatorClient
        industries={industries}
        occupations={occupations}
        playbooks={playbooks}
        threatScenarios={threatScenarios}
        initialInput={initialInput}
      />
    </div>
  );
}
