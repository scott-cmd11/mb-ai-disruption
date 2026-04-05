// ─── Risk / Scoring primitives ───────────────────────────────────────────────

export type RiskTier = "low" | "medium" | "high";

export type BusinessSize = "micro" | "small" | "medium" | "large";
// micro: <5 employees, small: 5–49, medium: 50–199, large: 200+

export type AIAdoptionStatus = "using" | "exploring" | "not_considering";

export type TaskCategory =
  | "data_processing"
  | "content_creation"
  | "customer_service"
  | "physical_manual"
  | "decision_making"
  | "creative_design"
  | "coordination"
  | "technical_analysis";

export type ScoreConfidence = "published" | "derived" | "estimated";

// ─── Industry / NAICS ────────────────────────────────────────────────────────

export interface Industry {
  /** Two-digit NAICS code, always a string (handles "31-33" etc.) */
  naicsCode: string;
  /** Full official sector name */
  sector: string;
  /** Short display name */
  shortName: string;
  /** Total Manitoba employees in this sector */
  mbEmployment: number;
  /** Fraction of total MB workforce, 0–1 */
  mbEmploymentShare: number;
  /** Fraction of MB GDP, 0–1 */
  mbGdpShare: number;
  /** Current AI adoption rate, 0–1 (national proxy) */
  aiAdoptionRate: number;
  /** Pre-computed: 1 - aiAdoptionRate */
  aiAdoptionGap: number;
  /** Pre-computed composite sector risk score, 0–100 */
  sectorRiskScore: number;
  riskTier: RiskTier;
  /** Notable Manitoba employers in this sector */
  keyEmployers: string[];
  /** Source data vintage year */
  dataYear: number;
  notes?: string;
}

// ─── Occupation / NOC ────────────────────────────────────────────────────────

export interface Occupation {
  /** 5-digit NOC 2021 code */
  nocCode: string;
  /** Official NOC title */
  title: string;
  /** Short display title */
  shortTitle: string;
  /** Parent NAICS two-digit codes (an occupation can span multiple sectors) */
  naicsSectors: string[];
  /** MB workers in this occupation (Census 2021) */
  mbEmployment: number;
  /** Frey & Osborne automation probability, 0–100 */
  freyOsborne: number;
  /** Felten-Raj-Seamans AIOE index, 0–100 */
  aioeScore: number;
  /** LLM task-exposure score, 0–100 */
  llmExposure: number;
  /** Pre-computed composite score (no size/adoption modifiers), 0–100 */
  compositeScore: number;
  riskTier: RiskTier;
  /** Dominant task categories in this role */
  taskCategories: TaskCategory[];
  /** Source data vintage year */
  dataYear: number;
  /** Provenance of scores — how confident we are in the data */
  scoreConfidence: ScoreConfidence;
}

// ─── Scoring formula configuration ───────────────────────────────────────────

export interface ScoringWeights {
  freyOsborne: number;
  aioe: number;
  llmExposure: number;
  industryAdoptionGap: number;
}

export interface SizeMultipliers {
  micro: number;
  small: number;
  medium: number;
  large: number;
}

export interface AdoptionModifiers {
  using: number;
  exploring: number;
  not_considering: number;
}

// ─── Assessment input (multi-step form state) ─────────────────────────────────

export interface AssessmentInput {
  naicsCode: string;
  businessSize: BusinessSize;
  aiAdoptionStatus: AIAdoptionStatus;
  primaryTasks: TaskCategory[];
  /** Percentage of workforce that are knowledge workers, 0–100 */
  knowledgeWorkerPct: number;
  /** Percentage of workforce doing manual/physical work, 0–100 */
  manualWorkerPct: number;
  /** Percentage of workforce in customer-facing roles, 0–100 */
  customerFacingPct: number;
  customerModel: "b2b" | "b2c" | "both" | "government";
}

// ─── Assessment results ───────────────────────────────────────────────────────

export interface ScoreBreakdown {
  freyOsborneComponent: number;
  aioeComponent: number;
  llmExposureComponent: number;
  industryAdoptionGapComponent: number;
  /** Sum of weighted components before modifiers */
  compositeScore: number;
  sizeMultiplier: number;
  adoptionModifier: number;
  /** Final score after modifiers, clamped 0–100 */
  adjustedScore: number;
}

export interface Recommendation {
  id: string;
  headline: string;
  body: string;
  urgency: "immediate" | "near_term" | "watch";
  tags: string[];
}

// ─── Threat Simulator ────────────────────────────────────────────────────────

export interface ThreatTeam {
  teamSize: number;
  roles: string[];
  annualCost: number;
  output: string;
  costPerUnit: number;
  unitLabel: string;
}

export interface ThreatScenario {
  id: string;
  label: string;
  icon: string;
  relevantNaicsCodes: string[];
  traditional: ThreatTeam;
  aiNative: ThreatTeam;
  keyInsight: string;
  source: string;
}

// ─── Sector Playbooks ────────────────────────────────────────────────────────

export interface CostCurveData {
  /** What a typical client pays this firm type per month (CAD) */
  avgMonthlyClientCost: number;
  /** AI-native firm's cost at month 0 as a multiple of traditional (e.g. 1.6 = 60% more expensive initially) */
  aiNativeStartMultiplier: number;
  /** The asymptotic floor the AI-native curve approaches (e.g. 0.38 = 38% of traditional cost) */
  aiNativeFloorMultiplier: number;
  /** Clients a traditional-firm employee serves per month */
  typicalClientsPerEmployee: number;
  /** Clients an AI-native-firm employee serves at scale */
  aiNativeClientsPerEmployee: number;
}

export interface UnderestimationRisk {
  reason: string;
  gettingWrong: string;
  consequence: string;
  urgency: "Critical" | "High" | "Moderate";
}

export interface SectorPlaybook {
  naicsCode: string;
  sectorLabel: string;
  actions12Month: string[];
  actions1to3Year: string[];
  biggestMistake: string;
  strategicPriority: string;
  underestimationRisk: UnderestimationRisk;
  costCurve: CostCurveData;
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────

export interface HeatmapCell {
  taskCategory: TaskCategory;
  naicsCode: string;
  score: number | null;
  tier: RiskTier | null;
  occupationCount: number;
  drivingOccupations: Array<{
    nocCode: string;
    shortTitle: string;
    compositeScore: number;
  }>;
}

// ─── Assessment results ───────────────────────────────────────────────────────

export interface AssessmentResult {
  input: AssessmentInput;
  breakdown: ScoreBreakdown;
  riskTier: RiskTier;
  /** sectorRiskScore from industries.json for this sector */
  industryAverage: number;
  /** Employment-weighted provincial average */
  provinceAverage: number;
  /** Top occupations in this sector, sorted by compositeScore desc */
  topRiskedOccupations: Occupation[];
  recommendations: Recommendation[];
  /** ISO 8601 timestamp */
  generatedAt: string;
}
