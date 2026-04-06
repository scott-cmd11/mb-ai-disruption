import type { ScoringWeights, SizeMultipliers, AdoptionModifiers } from "@/types";

export const SCORING_WEIGHTS: ScoringWeights = {
  freyOsborne: 0.3,
  aioe: 0.3,
  llmExposure: 0.25,
  industryAdoptionGap: 0.15,
} as const;

export const SIZE_MULTIPLIERS: SizeMultipliers = {
  micro: 1.1,
  small: 1.0,
  medium: 0.95,
  large: 0.9,
} as const;

export const ADOPTION_MODIFIERS: AdoptionModifiers = {
  using: 0.7,
  exploring: 0.85,
  not_considering: 1.0,
} as const;

/** Score < lowMax → "low", score ≤ mediumMax → "medium", else → "high" */
export const RISK_THRESHOLDS = {
  lowMax: 35,
  mediumMax: 65,
} as const;

/** Employment-weighted provincial average composite score (0–100) */
export const PROVINCE_AVERAGE_SCORE = 52;

/** Total Manitoba workforce headcount (StatsCan LFS, 2023) */
export const TOTAL_MB_WORKFORCE = 700_000;

/** Manitoba nominal GDP, billions CAD (MBS, 2022–23) */
export const MB_GDP_BILLIONS = 77;

/** Primary vintage year for sector data */
export const DATA_VINTAGE_YEAR = 2023;

/** Maximum number of top occupations to include in an AssessmentResult */
export const MAX_RESULT_OCCUPATIONS = 5;

/** Number of recommendations to surface per assessment */
export const RECOMMENDATION_COUNT = 4;
