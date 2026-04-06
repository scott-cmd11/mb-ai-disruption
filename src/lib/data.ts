import type { Industry, Occupation, ThreatScenario, SectorPlaybook } from "@/types";

// JSON imports — resolved at build time by Next.js / TypeScript (resolveJsonModule: true).
// These files live in /public/data/ but are imported directly here for type safety
// and build-time validation. Server Components will use these imports; Client Components
// should receive only the slices they need as props from their Server Component parent.
import industriesData from "@/../public/data/industries.json";
import occupationsData from "@/../public/data/occupations.json";
import threatScenariosData from "@/../public/data/threat-scenarios.json";
import sectorPlaybooksData from "@/../public/data/sector-playbooks.json";

// Cast to typed arrays — the JSON shape matches the interface definitions in src/types/index.ts
const industries = industriesData as Industry[];
const occupations = occupationsData as Occupation[];
const threatScenarios = threatScenariosData as ThreatScenario[];
const sectorPlaybooks = sectorPlaybooksData as SectorPlaybook[];

// ─── Industry queries ─────────────────────────────────────────────────────────

/** Return all industries, sorted by sectorRiskScore descending. */
export function getIndustries(): Industry[] {
  return industries;
}

/** Return all industries sorted by risk score descending (for ranked display). */
export function getIndustriesByRisk(): Industry[] {
  return [...industries].sort((a, b) => b.sectorRiskScore - a.sectorRiskScore);
}

/**
 * Look up a single industry by NAICS code.
 * Handles multi-code strings like "31-33" as exact-match keys.
 * Returns undefined if not found.
 */
export function getIndustryByCode(naicsCode: string): Industry | undefined {
  return industries.find((i) => i.naicsCode === naicsCode);
}

// ─── Occupation queries ───────────────────────────────────────────────────────

/** Return all occupations. */
export function getOccupations(): Occupation[] {
  return occupations;
}

/**
 * Return occupations belonging to a given NAICS sector code.
 * An occupation can belong to multiple sectors; this returns any match.
 */
export function getOccupationsBySector(naicsCode: string): Occupation[] {
  return occupations.filter((o) => o.naicsSectors.includes(naicsCode));
}

/** Look up a single occupation by NOC code. Returns undefined if not found. */
export function getOccupationByNoc(nocCode: string): Occupation | undefined {
  return occupations.find((o) => o.nocCode === nocCode);
}

/** Return top N occupations by composite score, optionally filtered by sector. */
export function getTopOccupations(
  limit: number,
  naicsCode?: string
): Occupation[] {
  const pool = naicsCode ? getOccupationsBySector(naicsCode) : occupations;
  return [...pool]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, limit);
}

// ─── Aggregate stats ──────────────────────────────────────────────────────────

/**
 * Compute the employment-weighted provincial average composite score across
 * all occupations. Used to validate the PROVINCE_AVERAGE_SCORE constant.
 */
export function computeProvincialAverage(): number {
  const total = occupations.reduce((sum, o) => sum + o.mbEmployment, 0);
  if (total === 0) return 0;
  const weighted = occupations.reduce(
    (sum, o) => sum + o.compositeScore * (o.mbEmployment / total),
    0
  );
  return Math.round(weighted * 10) / 10;
}

// ─── Threat scenario queries ─────────────────────────────────────────────────

/** Return all threat scenarios. */
export function getThreatScenarios(): ThreatScenario[] {
  return threatScenarios;
}

/** Find a threat scenario relevant to a given NAICS code (exact match). */
export function getThreatScenarioByNaics(naicsCode: string): ThreatScenario | undefined {
  return threatScenarios.find((s) => s.relevantNaicsCodes.includes(naicsCode));
}

// ─── Sector playbook queries ─────────────────────────────────────────────────

/** Return all sector playbooks. */
export function getSectorPlaybooks(): SectorPlaybook[] {
  return sectorPlaybooks;
}

/** Look up a sector playbook by NAICS code. */
export function getSectorPlaybook(naicsCode: string): SectorPlaybook | undefined {
  return sectorPlaybooks.find((p) => p.naicsCode === naicsCode);
}

// ─── Aggregate stats ────────────────────────────────────��─────────────────────

/** Return aggregate employment totals by risk tier. */
export function getEmploymentByTier(): Record<"low" | "medium" | "high", number> {
  return occupations.reduce(
    (acc, o) => {
      acc[o.riskTier] += o.mbEmployment;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );
}
