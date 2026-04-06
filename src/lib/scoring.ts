import type {
  AssessmentInput,
  AssessmentResult,
  ScoreBreakdown,
  BusinessSize,
  AIAdoptionStatus,
  RiskTier,
  ScoringWeights,
  Occupation,
  Industry,
  Recommendation,
} from "@/types";
import {
  SCORING_WEIGHTS,
  SIZE_MULTIPLIERS,
  ADOPTION_MODIFIERS,
  RISK_THRESHOLDS,
  PROVINCE_AVERAGE_SCORE,
  MAX_RESULT_OCCUPATIONS,
} from "@/lib/constants";

// ─── Pure calculation functions ───────────────────────────────────────────────

/**
 * Calculate the un-modified composite score from raw component scores.
 * All inputs and output are 0–100. Inputs are clamped before weighting.
 *
 * @param freyOsborne - Frey & Osborne automation probability (0–100)
 * @param aioeScore - AIOE index (0–100)
 * @param llmExposure - LLM exposure score (0–100)
 * @param industryAdoptionGap - adoption gap as 0–100 (i.e. (1 - adoptionRate) × 100)
 * @param weights - optional override of default SCORING_WEIGHTS
 */
export function calculateCompositeScore(
  freyOsborne: number,
  aioeScore: number,
  llmExposure: number,
  industryAdoptionGap: number,
  weights: Partial<ScoringWeights> = {}
): number {
  const w = { ...SCORING_WEIGHTS, ...weights };
  const fo = clamp(freyOsborne, 0, 100);
  const ai = clamp(aioeScore, 0, 100);
  const llm = clamp(llmExposure, 0, 100);
  const gap = clamp(industryAdoptionGap, 0, 100);

  return clamp(
    fo * w.freyOsborne + ai * w.aioe + llm * w.llmExposure + gap * w.industryAdoptionGap,
    0,
    100
  );
}

/**
 * Apply business size and AI adoption status modifiers to a composite score.
 * Returns the adjusted score, clamped to 0–100.
 */
export function applyModifiers(
  compositeScore: number,
  businessSize: BusinessSize,
  adoptionStatus: AIAdoptionStatus
): number {
  const sizeMult = SIZE_MULTIPLIERS[businessSize];
  const adoptMod = ADOPTION_MODIFIERS[adoptionStatus];
  return clamp(compositeScore * sizeMult * adoptMod, 0, 100);
}

/**
 * Convert a numeric score to a risk tier.
 * < lowMax → "low", ≤ mediumMax → "medium", > mediumMax → "high"
 */
export function scoreToRiskTier(score: number): RiskTier {
  if (score < RISK_THRESHOLDS.lowMax) return "low";
  if (score <= RISK_THRESHOLDS.mediumMax) return "medium";
  return "high";
}

/**
 * Compute a full score breakdown object.
 */
export function buildScoreBreakdown(
  freyOsborne: number,
  aioeScore: number,
  llmExposure: number,
  industryAdoptionGap: number,
  businessSize: BusinessSize,
  adoptionStatus: AIAdoptionStatus
): ScoreBreakdown {
  const w = SCORING_WEIGHTS;
  const fo = clamp(freyOsborne, 0, 100);
  const ai = clamp(aioeScore, 0, 100);
  const llm = clamp(llmExposure, 0, 100);
  const gap = clamp(industryAdoptionGap, 0, 100);

  const compositeScore = clamp(
    fo * w.freyOsborne + ai * w.aioe + llm * w.llmExposure + gap * w.industryAdoptionGap,
    0,
    100
  );

  const sizeMultiplier = SIZE_MULTIPLIERS[businessSize];
  const adoptionModifier = ADOPTION_MODIFIERS[adoptionStatus];
  const adjustedScore = clamp(compositeScore * sizeMultiplier * adoptionModifier, 0, 100);

  return {
    freyOsborneComponent: round(fo * w.freyOsborne),
    aioeComponent: round(ai * w.aioe),
    llmExposureComponent: round(llm * w.llmExposure),
    industryAdoptionGapComponent: round(gap * w.industryAdoptionGap),
    compositeScore: round(compositeScore),
    sizeMultiplier,
    adoptionModifier,
    adjustedScore: round(adjustedScore),
  };
}

// ─── Sector-level scoring (for data pipeline) ─────────────────────────────────

/**
 * Compute a sector-level composite score by taking the employment-weighted
 * average of compositeScores for all occupations in the sector, then applying
 * the sector's aiAdoptionGap as the adoptionGap component.
 *
 * Used by the data build pipeline (scripts/build-data.ts).
 */
export function computeSectorScore(
  occupations: Occupation[],
  aiAdoptionGap: number
): number {
  if (occupations.length === 0) return 0;

  const totalEmployment = occupations.reduce((sum, o) => sum + o.mbEmployment, 0);
  if (totalEmployment === 0) return 0;

  const weightedAvg = occupations.reduce(
    (sum, o) => sum + o.compositeScore * (o.mbEmployment / totalEmployment),
    0
  );

  // Blend occupation-weighted average with the sector's adoption gap component
  const gap = clamp(aiAdoptionGap * 100, 0, 100);
  return clamp(weightedAvg * 0.85 + gap * 0.15, 0, 100);
}

// ─── Assessment orchestration ─────────────────────────────────────────────────

/**
 * Produce a full AssessmentResult given user input and pre-loaded data.
 * Runs entirely client-side — no I/O, no async.
 */
export function computeAssessment(
  input: AssessmentInput,
  industry: Industry,
  relevantOccupations: Occupation[]
): AssessmentResult {
  // Derive occupation-level scores adjusted for task composition
  const { freyOsborne, aioeScore, llmExposure } = deriveUserScores(
    input,
    relevantOccupations
  );

  const adoptionGapPct = industry.aiAdoptionGap * 100;

  const breakdown = buildScoreBreakdown(
    freyOsborne,
    aioeScore,
    llmExposure,
    adoptionGapPct,
    input.businessSize,
    input.aiAdoptionStatus
  );

  const riskTier = scoreToRiskTier(breakdown.adjustedScore);

  const topRiskedOccupations = [...relevantOccupations]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, MAX_RESULT_OCCUPATIONS);

  const recommendations = selectRecommendations(breakdown, input);

  return {
    input,
    breakdown,
    riskTier,
    industryAverage: industry.sectorRiskScore,
    provinceAverage: PROVINCE_AVERAGE_SCORE,
    topRiskedOccupations,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Recommendation engine ────────────────────────────────────────────────────

/**
 * Select 3–5 recommendations from a rule-based pool based on score profile,
 * task categories, and adoption status.
 */
export function selectRecommendations(
  breakdown: ScoreBreakdown,
  input: AssessmentInput
): Recommendation[] {
  const score = breakdown.adjustedScore;
  const recs: Recommendation[] = [];

  if (input.aiAdoptionStatus === "not_considering") {
    recs.push({
      id: "ai-literacy",
      headline: "Start with AI literacy for your leadership team",
      body:
        "Before investing in tools, ensure your leaders understand what AI can and cannot do. A one-day workshop focused on your industry's specific use cases is more valuable than a generic overview.",
      urgency: "near_term",
      tags: ["learning", "leadership"],
    });
  }

  if (
    input.primaryTasks.includes("data_processing") ||
    input.primaryTasks.includes("content_creation")
  ) {
    recs.push({
      id: "workflow-audit",
      headline: "Audit your highest-volume repetitive workflows",
      body:
        "Identify the 3–5 tasks that consume the most staff time and are largely rule-based. These are prime candidates for AI-assisted automation and represent your near-term efficiency opportunity.",
      urgency: score > 60 ? "immediate" : "near_term",
      tags: ["automation", "workflow"],
    });
  }

  if (input.primaryTasks.includes("customer_service")) {
    recs.push({
      id: "ai-customer-service",
      headline: "Evaluate AI-assisted customer communication tools",
      body:
        "AI-drafted response templates and intent-routing can reduce handling time significantly. Start with low-stakes channels (email, chat) before moving to voice. Monitor quality carefully in the first 90 days.",
      urgency: "near_term",
      tags: ["customer-service", "tools"],
    });
  }

  if (score >= RISK_THRESHOLDS.mediumMax) {
    recs.push({
      id: "upskilling",
      headline: "Invest in upskilling for AI-adjacent roles",
      body:
        "Your sector's exposure score suggests material displacement risk over the next 5–10 years. Identifying which roles can transition into AI oversight, prompt engineering, or data validation positions your workforce ahead of the curve.",
      urgency: "near_term",
      tags: ["workforce", "upskilling"],
    });
  }

  if (score < RISK_THRESHOLDS.lowMax) {
    recs.push({
      id: "competitive-opportunity",
      headline: "Use AI as a competitive advantage, not a threat",
      body:
        "Your business profile shows lower-than-average disruption exposure. This means early AI adoption in your administrative and planning functions could differentiate you from competitors who are slower to move.",
      urgency: "watch",
      tags: ["strategy", "opportunity"],
    });
  }

  if (input.aiAdoptionStatus === "using") {
    recs.push({
      id: "measure-roi",
      headline: "Establish baseline metrics before your next AI expansion",
      body:
        "Since you are already using AI tools, measuring their actual impact — on cost, quality, and staff time — will help you make the case for further investment and identify where to focus next.",
      urgency: "near_term",
      tags: ["measurement", "strategy"],
    });
  }

  // Always include a watch recommendation about data governance
  recs.push({
    id: "data-governance",
    headline: "Review what proprietary data you are sharing with AI tools",
    body:
      "Many AI productivity tools train on user inputs by default. Ensure you have reviewed the data-handling policies for every AI tool in use, and that sensitive client or employee data is not inadvertently shared.",
    urgency: "immediate",
    tags: ["data", "privacy", "risk-management"],
  });

  // Return up to 4, prioritizing immediate > near_term > watch
  return recs
    .sort((a, b) => urgencyOrder(a.urgency) - urgencyOrder(b.urgency))
    .slice(0, 4);
}

// ─── Internal utilities ───────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function urgencyOrder(urgency: Recommendation["urgency"]): number {
  return { immediate: 0, near_term: 1, watch: 2 }[urgency];
}

/**
 * Derive occupation-level scores weighted by the user's stated task composition
 * and workforce structure. Falls back to sector averages if no occupations available.
 */
function deriveUserScores(
  input: AssessmentInput,
  occupations: Occupation[]
): { freyOsborne: number; aioeScore: number; llmExposure: number } {
  if (occupations.length === 0) {
    return { freyOsborne: 50, aioeScore: 50, llmExposure: 50 };
  }

  // Task-category weight: physical tasks reduce automation exposure, knowledge tasks increase it
  const physicalWeight = input.manualWorkerPct / 100;
  const knowledgeWeight = input.knowledgeWorkerPct / 100;

  const physicalOccs = occupations.filter((o) =>
    o.taskCategories.includes("physical_manual")
  );
  const knowledgeOccs = occupations.filter((o) =>
    o.taskCategories.some((t) =>
      ["data_processing", "content_creation", "technical_analysis"].includes(t)
    )
  );

  const physicalScores =
    physicalOccs.length > 0
      ? avg(physicalOccs.map((o) => o.compositeScore))
      : avg(occupations.map((o) => o.compositeScore));

  const knowledgeScores =
    knowledgeOccs.length > 0
      ? avg(knowledgeOccs.map((o) => o.compositeScore))
      : avg(occupations.map((o) => o.compositeScore));

  // Blend based on workforce composition
  const blendedComposite =
    physicalScores * physicalWeight + knowledgeScores * knowledgeWeight +
    avg(occupations.map((o) => o.compositeScore)) * (1 - physicalWeight - knowledgeWeight);

  // Approximate component splits from sector averages
  const sectorFo = avg(occupations.map((o) => o.freyOsborne));
  const sectorAi = avg(occupations.map((o) => o.aioeScore));
  const sectorLlm = avg(occupations.map((o) => o.llmExposure));
  const sectorComposite = avg(occupations.map((o) => o.compositeScore));

  // Scale each component proportionally to the blended composite
  const ratio = sectorComposite > 0 ? blendedComposite / sectorComposite : 1;

  return {
    freyOsborne: clamp(sectorFo * ratio, 0, 100),
    aioeScore: clamp(sectorAi * ratio, 0, 100),
    llmExposure: clamp(sectorLlm * ratio, 0, 100),
  };
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
