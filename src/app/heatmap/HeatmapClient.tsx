"use client";

import { useState, useCallback, useMemo } from "react";
import type { TaskCategory, RiskTier, HeatmapCell } from "@/types";

// ── Props ─────────────────────────────────────────────────────────────────────

interface IndustryProp {
  naicsCode: string;
  shortName: string;
  sectorRiskScore: number;
}

interface HeatmapClientProps {
  matrix: HeatmapCell[][];
  industries: IndustryProp[];
  taskLabels: Record<string, string>;
}

// ── Color helpers ─────────────────────────────────────────────────────────────

function cellBg(score: number | null): string {
  if (score === null) return "#F1F5F9";
  if (score < 20) return "#F0FDF4";
  if (score < 40) return "#DCFCE7";
  if (score < 60) return "#FEF9C3";
  if (score < 80) return "#FED7AA";
  return "#FECACA";
}

function tierBadgeColor(tier: RiskTier): { bg: string; text: string } {
  switch (tier) {
    case "high":
      return { bg: "#FEE2E2", text: "#991B1B" };
    case "medium":
      return { bg: "#FEF3C7", text: "#92400E" };
    case "low":
      return { bg: "#DCFCE7", text: "#166534" };
  }
}

function sectorDotColor(score: number): string {
  if (score > 65) return "#EF4444";
  if (score >= 35) return "#F59E0B";
  return "#22C55E";
}

// ── Legend ─────────────────────────────────────────────────────────────────────

const LEGEND_STOPS = [
  { label: "No data", color: "#F1F5F9" },
  { label: "0–20", color: "#F0FDF4" },
  { label: "20–40", color: "#DCFCE7" },
  { label: "40–60", color: "#FEF9C3" },
  { label: "60–80", color: "#FED7AA" },
  { label: "80–100", color: "#FECACA" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function HeatmapClient({
  matrix,
  industries,
  taskLabels,
}: HeatmapClientProps) {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Sort industries by sectorRiskScore descending (highest risk on the left)
  const sortedIndustries = useMemo(
    () =>
      [...industries]
        .sort((a, b) => b.sectorRiskScore - a.sectorRiskScore)
        .map((ind) => ({
          ...ind,
          originalIndex: industries.findIndex(
            (i) => i.naicsCode === ind.naicsCode
          ),
        })),
    [industries]
  );

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell((prev) =>
      prev?.row === row && prev?.col === col ? null : { row, col }
    );
  }, []);

  // Get the selected cell data
  const selectedData =
    selectedCell !== null
      ? matrix[selectedCell.row][
          sortedIndustries[selectedCell.col].originalIndex
        ]
      : null;
  const selectedIndustry =
    selectedCell !== null ? sortedIndustries[selectedCell.col] : null;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Scrollable grid ──────────────────────────────────────────────── */}
      <div
        className="overflow-x-auto rounded-xl border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="min-w-[1100px]">
          {/* Column headers */}
          <div className="flex">
            {/* Top-left corner spacer */}
            <div
              className="shrink-0 sticky left-0 z-10"
              style={{
                width: 140,
                minHeight: 100,
                backgroundColor: "var(--color-surface)",
              }}
            />
            {sortedIndustries.map((ind) => (
              <div
                key={ind.naicsCode}
                className="flex flex-col items-center justify-end pb-2"
                style={{ width: 60, minHeight: 100 }}
              >
                <span
                  className="inline-block rounded-full mb-1"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: sectorDotColor(ind.sectorRiskScore),
                  }}
                  title={`Sector risk: ${ind.sectorRiskScore}`}
                />
                <span
                  className="text-[10px] leading-tight text-center font-medium"
                  style={{
                    color: "var(--color-text-secondary)",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    maxHeight: 80,
                    overflow: "hidden",
                  }}
                >
                  {ind.shortName}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {matrix.map((row, rowIdx) => {
            const taskCat = row[0]?.taskCategory as TaskCategory;
            return (
              <div key={taskCat} className="flex">
                {/* Row header — sticky */}
                <div
                  className="shrink-0 sticky left-0 z-10 flex items-center px-3 border-t"
                  style={{
                    width: 140,
                    height: 48,
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <span
                    className="text-xs font-semibold truncate"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {taskLabels[taskCat] ?? taskCat}
                  </span>
                </div>

                {/* Cells */}
                {sortedIndustries.map((ind, colIdx) => {
                  const cell = row[ind.originalIndex];
                  const isSelected =
                    selectedCell?.row === rowIdx &&
                    selectedCell?.col === colIdx;
                  return (
                    <button
                      key={ind.naicsCode}
                      type="button"
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      className="shrink-0 border-t transition-all duration-100 flex items-center justify-center cursor-pointer"
                      style={{
                        width: 60,
                        height: 48,
                        backgroundColor: cellBg(cell.score),
                        borderColor: isSelected
                          ? "var(--color-navy-deep)"
                          : "var(--color-border)",
                        outline: isSelected
                          ? "2px solid var(--color-navy-deep)"
                          : "none",
                        outlineOffset: -2,
                      }}
                      title={`${taskLabels[taskCat]} × ${ind.shortName}: ${cell.score ?? "No data"}`}
                      aria-label={`${taskLabels[taskCat]} and ${ind.shortName}: score ${cell.score ?? "no data"}`}
                    >
                      <span
                        className="text-[11px] font-medium"
                        style={{
                          color:
                            cell.score === null
                              ? "var(--color-text-tertiary)"
                              : "var(--color-text-primary)",
                        }}
                      >
                        {cell.score !== null
                          ? Math.round(cell.score)
                          : "\u2014"}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Legend ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Score scale:
        </span>
        {LEGEND_STOPS.map((stop) => (
          <div key={stop.label} className="flex items-center gap-1.5">
            <span
              className="inline-block rounded"
              style={{
                width: 16,
                height: 16,
                backgroundColor: stop.color,
                border: "1px solid var(--color-border)",
              }}
            />
            <span
              className="text-[11px]"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {stop.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Detail panel ─────────────────────────────────────────────────── */}
      {selectedCell !== null && selectedData && selectedIndustry && (
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3
                className="font-display font-bold text-lg"
                style={{
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {taskLabels[selectedData.taskCategory] ??
                  selectedData.taskCategory}{" "}
                &times; {selectedIndustry.shortName}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {selectedData.occupationCount} matching occupation
                {selectedData.occupationCount !== 1 ? "s" : ""}
              </p>
            </div>

            {selectedData.score !== null && selectedData.tier !== null ? (
              <div className="flex items-center gap-3">
                <span
                  className="font-display font-bold text-2xl"
                  style={{
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {Math.round(selectedData.score)}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  style={{
                    backgroundColor: tierBadgeColor(selectedData.tier).bg,
                    color: tierBadgeColor(selectedData.tier).text,
                  }}
                >
                  {selectedData.tier}
                </span>
              </div>
            ) : (
              <span
                className="text-sm italic"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                No data for this intersection
              </span>
            )}
          </div>

          {selectedData.drivingOccupations.length > 0 && (
            <div className="mt-5">
              <p
                className="text-xs font-bold uppercase tracking-wide mb-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Top driving occupations
              </p>
              <div className="flex flex-col gap-2">
                {selectedData.drivingOccupations.map((occ) => (
                  <div
                    key={occ.nocCode}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: "var(--color-paper-deep)",
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {occ.shortTitle}
                    </span>
                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {occ.compositeScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
