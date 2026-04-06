"use client";

import { useState, useMemo } from "react";
import type { Industry, Occupation, RiskTier, TaskCategory } from "@/types";

// ── AI Buildout Demand Set (OpenAI Industrial Policy, April 2026) ─────────────
// These occupations face *rising* demand from AI infrastructure buildout,
// directly named in OpenAI's industrial policy report (~20% more skilled trades needed).

const AI_BUILDOUT_NOC_CODES = new Set(["72400", "72020", "72106", "73200", "92100"]);

const AI_BUILDOUT_ROLES: Record<string, string> = {
  "72400": "electricians",
  "72020": "carpenters",
  "72106": "metal and ironworkers",
  "73200": "heavy equipment operators",
  "92100": "mechanics",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const TASK_LABELS: Record<TaskCategory, string> = {
  data_processing: "Data Processing",
  content_creation: "Content Creation",
  customer_service: "Customer Service",
  physical_manual: "Physical/Manual",
  decision_making: "Decision Making",
  creative_design: "Creative Design",
  coordination: "Coordination",
  technical_analysis: "Technical Analysis",
};

const TIER_LABELS: Record<RiskTier, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

function scoreTier(score: number): RiskTier {
  if (score > 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-CA");
}

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  occupations: Occupation[];
  industries: Industry[];
}

// ── Component ────────────────────────────────────────────────────────────────

export function OccupationClient({ occupations, industries }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<RiskTier | "all">("all");
  const [sortMode, setSortMode] = useState<"risk" | "employment" | "alpha">("risk");
  const [risingDemandOnly, setRisingDemandOnly] = useState(false);
  const [selectedNocCode, setSelectedNocCode] = useState<string | null>(null);

  // Build sector options from industries
  const sectorOptions = useMemo(
    () => industries.map((ind) => ({ code: ind.naicsCode, name: ind.shortName })),
    [industries]
  );

  // Industry lookup map
  const industryMap = useMemo(() => {
    const map = new Map<string, Industry>();
    for (const ind of industries) map.set(ind.naicsCode, ind);
    return map;
  }, [industries]);

  // Filtered + sorted occupations
  const filtered = useMemo(() => {
    let list = occupations;

    if (risingDemandOnly) {
      list = list.filter((o) => AI_BUILDOUT_NOC_CODES.has(o.nocCode));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.shortTitle.toLowerCase().includes(q) ||
          o.title.toLowerCase().includes(q) ||
          o.nocCode.includes(q)
      );
    }

    if (sectorFilter !== "all") {
      list = list.filter((o) => o.naicsSectors.includes(sectorFilter));
    }

    if (tierFilter !== "all") {
      list = list.filter((o) => o.riskTier === tierFilter);
    }

    const sorted = [...list];
    switch (sortMode) {
      case "risk":
        sorted.sort((a, b) => b.compositeScore - a.compositeScore);
        break;
      case "employment":
        sorted.sort((a, b) => b.mbEmployment - a.mbEmployment);
        break;
      case "alpha":
        sorted.sort((a, b) => a.shortTitle.localeCompare(b.shortTitle));
        break;
    }
    return sorted;
  }, [occupations, searchQuery, sectorFilter, tierFilter, sortMode, risingDemandOnly]);

  const selected = selectedNocCode
    ? occupations.find((o) => o.nocCode === selectedNocCode) ?? null
    : null;

  // Related occupations for detail panel
  const relatedOccupations = useMemo(() => {
    if (!selected) return [];
    return occupations
      .filter(
        (o) =>
          o.nocCode !== selected.nocCode &&
          Math.abs(o.compositeScore - selected.compositeScore) <= 15 &&
          o.naicsSectors.some((s) => selected.naicsSectors.includes(s))
      )
      .sort((a, b) => Math.abs(a.compositeScore - selected.compositeScore) - Math.abs(b.compositeScore - selected.compositeScore))
      .slice(0, 5);
  }, [selected, occupations]);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Controls bar ──────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Search */}
        <div className="flex flex-col gap-1 sm:min-w-[220px] sm:flex-1">
          <label
            htmlFor="occ-search"
            className="text-xs font-semibold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Search
          </label>
          <input
            id="occ-search"
            type="search"
            placeholder="Title, NOC code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm font-body"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-paper)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>

        {/* Sector */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="occ-sector"
            className="text-xs font-semibold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Sector
          </label>
          <select
            id="occ-sector"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm font-body"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-paper)",
              color: "var(--color-text-primary)",
            }}
          >
            <option value="all">All sectors</option>
            {sectorOptions.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tier radio buttons */}
        <fieldset className="flex flex-col gap-1">
          <legend
            className="text-xs font-semibold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Risk tier
          </legend>
          <div className="flex gap-1">
            {(["all", "high", "medium", "low"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTierFilter(tier)}
                className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  borderColor:
                    tierFilter === tier
                      ? "var(--color-navy)"
                      : "var(--color-border)",
                  backgroundColor:
                    tierFilter === tier
                      ? "var(--color-navy)"
                      : "var(--color-paper)",
                  color:
                    tierFilter === tier
                      ? "var(--color-text-inverse)"
                      : "var(--color-text-secondary)",
                }}
                aria-pressed={tierFilter === tier}
              >
                {tier === "all" ? "All" : TIER_LABELS[tier]}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Rising demand toggle */}
        <div className="flex flex-col gap-1 justify-end">
          <button
            type="button"
            onClick={() => setRisingDemandOnly(!risingDemandOnly)}
            className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap"
            style={{
              borderColor: risingDemandOnly ? "#15803D" : "var(--color-border)",
              backgroundColor: risingDemandOnly ? "rgba(21, 128, 61, 0.08)" : "var(--color-paper)",
              color: risingDemandOnly ? "#15803D" : "var(--color-text-secondary)",
            }}
            aria-pressed={risingDemandOnly}
          >
            ↑ Rising demand only
          </button>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="occ-sort"
            className="text-xs font-semibold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Sort by
          </label>
          <select
            id="occ-sort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as "risk" | "employment" | "alpha")}
            className="rounded-md border px-3 py-2 text-sm font-body"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-paper)",
              color: "var(--color-text-primary)",
            }}
          >
            <option value="risk">Highest risk</option>
            <option value="employment">Most employed</option>
            <option value="alpha">A-Z</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
        Showing {filtered.length} of {occupations.length} occupations
      </p>

      {/* ── Main layout: grid + detail panel ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Card grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <p
              className="text-center py-16 text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No occupations match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((occ) => (
                <button
                  key={occ.nocCode}
                  type="button"
                  onClick={() =>
                    setSelectedNocCode(
                      selectedNocCode === occ.nocCode ? null : occ.nocCode
                    )
                  }
                  className="rounded-xl border p-4 text-left transition-shadow hover:shadow-md"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor:
                      selectedNocCode === occ.nocCode
                        ? "var(--color-navy)"
                        : "var(--color-border)",
                    boxShadow:
                      selectedNocCode === occ.nocCode
                        ? "0 0 0 2px var(--color-navy)"
                        : undefined,
                  }}
                >
                  {/* Title + badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className="text-sm font-semibold leading-snug"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {occ.shortTitle}
                    </span>
                    <span className={`badge-${occ.riskTier} shrink-0`}>
                      {TIER_LABELS[occ.riskTier]}
                    </span>
                  </div>
                  {/* AI buildout rising demand indicator */}
                  {AI_BUILDOUT_NOC_CODES.has(occ.nocCode) && (
                    <span
                      className="text-[0.55rem] px-1.5 py-0.5 rounded border font-semibold"
                      style={{ color: "#15803D", borderColor: "#15803D", backgroundColor: "rgba(21, 128, 61, 0.06)" }}
                    >
                      ↑ rising demand
                    </span>
                  )}

                  {/* scoreConfidence micro-badge */}
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded border font-medium"
                    style={{
                      color: occ.scoreConfidence === "published"
                        ? "var(--color-risk-low)"
                        : occ.scoreConfidence === "derived"
                        ? "var(--color-text-secondary)"
                        : "var(--color-text-tertiary)",
                      borderColor: occ.scoreConfidence === "published"
                        ? "var(--color-risk-low)"
                        : "var(--color-border)",
                      backgroundColor: "transparent",
                    }}
                  >
                    {occ.scoreConfidence === "published" ? "published data" : occ.scoreConfidence === "derived" ? "derived" : "estimated"}
                  </span>

                  {/* Composite score bar */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ color: "var(--color-text-primary)", minWidth: "2ch" }}
                    >
                      {occ.compositeScore}
                    </span>
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-surface-muted)" }}
                    >
                      <div
                        className={`h-full rounded-full risk-bar-${occ.riskTier}`}
                        style={{ width: `${occ.compositeScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Employment */}
                  <p className="text-xs mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                    {formatNumber(occ.mbEmployment)} employed in MB
                  </p>

                  {/* Task pills (2-3) */}
                  <div className="flex flex-wrap gap-1">
                    {occ.taskCategories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full px-2 py-0.5 text-[0.625rem] font-medium"
                        style={{
                          backgroundColor: "var(--color-surface-muted)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {TASK_LABELS[cat]}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Detail panel ────────────────────────────────────────────── */}
        {selected && (
          <div
            className="lg:w-[380px] lg:shrink-0 rounded-xl border p-6 self-start lg:sticky lg:top-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setSelectedNocCode(null)}
                className="text-xs rounded-md px-2 py-1 transition-colors"
                style={{ color: "var(--color-text-tertiary)" }}
                aria-label="Close detail panel"
              >
                Close
              </button>
            </div>

            {/* 1. Title + NOC + badge */}
            <h2
              className="font-display font-bold text-lg leading-snug mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {selected.title}
            </h2>
            <div className="flex items-center gap-2 mb-5">
              <span
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                NOC {selected.nocCode}
              </span>
              <span className={`badge-${selected.riskTier}`}>
                {TIER_LABELS[selected.riskTier]}
              </span>
            </div>

            {/* 2. Three component score bars */}
            <div className="flex flex-col gap-3 mb-5">
              {([
                { label: "Automation Risk", value: selected.freyOsborne },
                { label: "AI Exposure", value: selected.aioeScore },
                { label: "LLM Impact", value: selected.llmExposure },
              ] as const).map(({ label, value }) => {
                const tier = scoreTier(value);
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {value}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-surface-muted)" }}
                    >
                      <div
                        className={`h-full rounded-full risk-bar-${tier}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Composite score */}
            <div
              className="rounded-lg px-4 py-3 mb-5 text-center"
              style={{ backgroundColor: "var(--color-surface-muted)" }}
            >
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Composite Score
              </p>
              <p
                className="font-display font-bold text-3xl"
                style={{
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                {selected.compositeScore}
              </p>
            </div>

            {/* 4. Task categories */}
            <div className="mb-5">
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Task Categories
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selected.taskCategories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-surface-muted)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {TASK_LABELS[cat]}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Found in sectors */}
            <div className="mb-5">
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Found in
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selected.naicsSectors.map((code) => {
                  const ind = industryMap.get(code);
                  return (
                    <span
                      key={code}
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "var(--color-paper-deep)",
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {ind ? ind.shortName : code}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 6. Manitoba employment */}
            <div className="mb-5">
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Manitoba Employment
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {formatNumber(selected.mbEmployment)}
              </p>
            </div>

            {/* 7. Related occupations */}
            {relatedOccupations.length > 0 && (
              <div className="mb-5">
                <p
                  className="text-xs font-semibold mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Related Occupations
                </p>
                <div className="flex flex-col gap-1.5">
                  {relatedOccupations.map((rel) => (
                    <button
                      key={rel.nocCode}
                      type="button"
                      onClick={() => setSelectedNocCode(rel.nocCode)}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50"
                      style={{
                        backgroundColor: "var(--color-paper)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <span style={{ color: "var(--color-text-primary)" }}>
                        {rel.shortTitle}
                      </span>
                      <span className={`badge-${rel.riskTier} ml-2`}>
                        {rel.compositeScore}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Score confidence */}
            <div
              className="rounded-md px-3 py-2 text-xs"
              style={{
                backgroundColor: "var(--color-surface-muted)",
                color: "var(--color-text-tertiary)",
              }}
            >
              Data confidence:{" "}
              <span className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                {selected.scoreConfidence === "published"
                  ? "Published data"
                  : selected.scoreConfidence === "derived"
                    ? "Derived estimate"
                    : "Estimated"}
              </span>
            </div>

            {/* AI Buildout Rising Demand signal */}
            {AI_BUILDOUT_NOC_CODES.has(selected.nocCode) && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                <p
                  className="text-[0.6rem] font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#15803D" }}
                >
                  Rising Demand Signal
                </p>
                <div
                  className="rounded-sm border-l-4 px-3 py-2.5 mb-2"
                  style={{ borderColor: "#15803D", backgroundColor: "rgba(21, 128, 61, 0.05)" }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: "#15803D" }}>
                    ↑ AI buildout is increasing demand for {AI_BUILDOUT_ROLES[selected.nocCode]}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    The low exposure score reflects low displacement risk — and that&apos;s only
                    half the story. OpenAI&apos;s 2026 industrial policy report projects that
                    AI infrastructure buildout (data centres, power grids, cooling systems)
                    will require approximately 20% more skilled trades workers than currently
                    exist. Demand for this role is likely to <em>increase</em>, not decrease.
                  </p>
                </div>
                <p className="text-[0.6rem]" style={{ color: "var(--color-text-tertiary)" }}>
                  Source: OpenAI,{" "}
                  <a
                    href="https://openai.com/index/industrial-policy-for-the-intelligence-age/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80"
                  >
                    Industrial Policy for the Intelligence Age
                  </a>
                  , April 2026.
                </p>
              </div>
            )}

            {/* Anthropic Economic Index supplementary context */}
            {selected.anthropicUsageGroup !== undefined && selected.anthropicUsageIntensity !== undefined && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-[0.6rem] font-bold tracking-widest uppercase mb-2"
                  style={{ color: "var(--color-text-tertiary)" }}>
                  Anthropic Economic Index (2026)
                </p>
                <p className="text-xs mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {selected.anthropicUsageGroup}
                  </span>
                  {" "}— {selected.anthropicUsageIntensity}/100 usage intensity
                </p>
                <div className="h-1.5 rounded-full overflow-hidden mb-2"
                  style={{ backgroundColor: "var(--color-border)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${selected.anthropicUsageIntensity}%`,
                      backgroundColor: "var(--color-text-tertiary)",
                    }} />
                </div>
                <p className="text-[0.6rem] leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                  Group-level signal — same value for all occupations in this SOC category.
                  Measures actual Claude usage patterns (Feb 2026), not theoretical capability.{" "}
                  <a href="https://huggingface.co/datasets/Anthropic/EconomicIndex"
                    target="_blank" rel="noopener noreferrer"
                    className="underline hover:opacity-80">
                    Source
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
