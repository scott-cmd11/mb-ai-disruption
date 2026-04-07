"use client";

import "@xyflow/react/dist/style.css";

import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import type { Industry, Occupation } from "@/types";
import { SectorNode, type SectorNodeData } from "./SectorNode";
import {
  GRAPH_NODES,
  GRAPH_EDGES,
  TIER_HEX,
  computeNodeSize,
  type SortMode,
  type TierFilter,
} from "./graphLayout";

// ── Must be at module scope — never inside the component ──────────────────────
const nodeTypes = { sector: SectorNode };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatEmployment(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return n.toString();
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-sm border p-3 flex flex-col gap-1"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper-deep)" }}
    >
      <span className="text-[0.55rem] tracking-[0.15em] uppercase" style={{ color: "var(--color-text-tertiary)" }}>
        {label}
      </span>
      <span className="font-mono tabular-nums text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors tracking-wide"
      style={{
        backgroundColor: active ? "var(--color-navy)" : "var(--color-paper-deep)",
        color: active ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
        borderColor: active ? "var(--color-navy)" : "var(--color-border)",
      }}
    >
      {children}
    </button>
  );
}

// ── Sidebar Panel ─────────────────────────────────────────────────────────────

function SidebarPanel({
  industry,
  sectorOccupations,
}: {
  industry: Industry | null;
  sectorOccupations: Occupation[];
}) {
  if (!industry) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: "var(--color-text-tertiary)" }}>
        <p className="text-sm text-center px-6" style={{ fontFamily: "var(--font-body)" }}>
          Click a sector node to explore its details.
        </p>
      </div>
    );
  }

  const tierClass =
    industry.riskTier === "high"
      ? "risk-badge-high"
      : industry.riskTier === "medium"
      ? "risk-badge-medium"
      : "risk-badge-low";

  const barClass =
    industry.riskTier === "high"
      ? "risk-bar-high"
      : industry.riskTier === "medium"
      ? "risk-bar-medium"
      : "risk-bar-low";

  // Build calculator CTA param — pre-fill naicsCode with sensible defaults
  const calculatorParam = btoa(
    JSON.stringify({
      naicsCode: industry.naicsCode,
      businessSize: "small",
      aiAdoptionStatus: "not_considering",
      primaryTasks: [],
      knowledgeWorkerPct: 50,
      manualWorkerPct: 25,
      customerFacingPct: 25,
      customerModel: "b2b",
    })
  );

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto p-5">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2
            className="font-display text-xl font-light italic leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {industry.shortName}
          </h2>
          <span className={`text-xs font-medium mt-1 shrink-0 ${tierClass}`}>
            {industry.riskTier.charAt(0).toUpperCase() + industry.riskTier.slice(1)}
          </span>
        </div>
        <p className="text-[0.6rem] font-mono" style={{ color: "var(--color-text-tertiary)" }}>
          NAICS {industry.naicsCode}
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="Employment" value={formatEmployment(industry.mbEmployment)} />
        <MetricCard label="GDP share" value={`${(industry.mbGdpShare * 100).toFixed(1)}%`} />
        <MetricCard label="AI adoption" value={`${Math.round(industry.aiAdoptionRate * 100)}%`} />
        <MetricCard label="Risk score" value={`${industry.sectorRiskScore} / 100`} />
      </div>

      {/* Score bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[0.6rem] uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
          <span>Composite exposure</span>
          <span className={`font-mono font-semibold ${tierClass}`}>{industry.sectorRiskScore}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
          <div
            className={`h-full rounded-full ${barClass}`}
            style={{ width: `${industry.sectorRiskScore}%` }}
          />
        </div>
      </div>

      {/* Key employers */}
      {industry.keyEmployers.length > 0 && (
        <div>
          <p className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: "var(--color-gold)" }}>
            Key employers
          </p>
          <ul className="flex flex-col gap-1.5">
            {industry.keyEmployers.slice(0, 5).map((emp) => (
              <li key={emp} className="flex items-start gap-2 text-xs" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
                <span style={{ color: "var(--color-gold)", marginTop: 1 }}>●</span>
                {emp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top occupations */}
      {sectorOccupations.length > 0 && (
        <div>
          <p className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: "var(--color-gold)" }}>
            Top exposed occupations
          </p>
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--color-border)" }}>
            {sectorOccupations.map((occ) => {
              const occTierClass =
                occ.riskTier === "high" ? "risk-badge-high" : occ.riskTier === "medium" ? "risk-badge-medium" : "risk-badge-low";
              return (
                <div key={occ.nocCode} className="flex items-center justify-between py-2 gap-2">
                  <span className="text-xs truncate" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
                    {occ.shortTitle}
                  </span>
                  <span className={`text-xs font-mono tabular-nums font-semibold shrink-0 ${occTierClass}`}>
                    {occ.compositeScore}
                  </span>
                  <span className="text-[0.55rem]"
                    style={{
                      color: occ.scoreConfidence === "published"
                        ? "var(--color-risk-low)"
                        : "var(--color-text-tertiary)",
                    }}
                  >
                    {occ.scoreConfidence === "published" ? "✓" : "~"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <a
        href={`/calculator?r=${calculatorParam}`}
        className="inline-flex items-center justify-center rounded-sm px-4 py-2.5 text-xs font-medium tracking-wide transition-colors mt-auto"
        style={{ backgroundColor: "var(--color-navy)", color: "var(--color-text-inverse)" }}
      >
        Assess this sector →
      </a>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ExplorerClient({
  industries,
  occupations,
}: {
  industries: Industry[];
  occupations: Occupation[];
}) {
  const [selectedId, setSelectedId] = useState<string>("52"); // Finance & Insurance
  const [sortMode, setSortMode] = useState<SortMode>("risk");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");

  // Build a lookup map for O(1) access
  const industriesMap = useMemo(
    () => new Map(industries.map((i) => [i.naicsCode, i])),
    [industries]
  );

  // Derive React Flow nodes
  const nodes = useMemo((): Node[] => {
    return GRAPH_NODES.flatMap((gn) => {
      const industry = industriesMap.get(gn.id);
      if (!industry) return [];
      const size = computeNodeSize(
        industry.mbEmployment,
        industry.mbGdpShare,
        industry.sectorRiskScore,
        sortMode
      );
      const isFiltered = tierFilter !== "all" && industry.riskTier !== tierFilter;
      const data: SectorNodeData = {
        industry,
        size,
        isSelected: gn.id === selectedId,
        isFiltered,
        sortMode,
      };
      const node: Node = {
        id: gn.id,
        type: "sector",
        // Center-based positioning: subtract half size for top-left
        position: { x: gn.cx - size / 2, y: gn.cy - size / 2 },
        data,
        draggable: false,
        selectable: true,
      };
      return [node];
    });
  }, [industriesMap, selectedId, sortMode, tierFilter]);

  // Derive React Flow edges
  const edges: Edge[] = useMemo(() => {
    return GRAPH_EDGES.map((ge) => {
      const sourceIndustry = industriesMap.get(ge.source);
      const sourceFiltered =
        tierFilter !== "all" && sourceIndustry && sourceIndustry.riskTier !== tierFilter;
      const color = sourceIndustry ? TIER_HEX[sourceIndustry.riskTier] : "#ccc";
      return {
        id: ge.id,
        source: ge.source,
        target: ge.target,
        animated: true,
        style: {
          stroke: color,
          strokeWidth: 1.5,
          strokeDasharray: "5 5",
          opacity: sourceFiltered ? 0.08 : 0.38,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color,
        },
      };
    });
  }, [industriesMap, tierFilter]);

  // Occupations for the selected sector
  const sectorOccupations = useMemo(
    () =>
      occupations
        .filter((o) => o.naicsSectors.includes(selectedId))
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 8),
    [occupations, selectedId]
  );

  const selectedIndustry = industriesMap.get(selectedId) ?? null;

  const onNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => setSelectedId(node.id),
    []
  );

  const SORT_OPTIONS: { value: SortMode; label: string }[] = [
    { value: "risk", label: "Risk" },
    { value: "employment", label: "Employment" },
    { value: "gdp", label: "GDP" },
  ];

  const TIER_OPTIONS: { value: TierFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <ReactFlowProvider>
      <div className="flex flex-col" style={{ height: "calc(100vh - 57px)" }}>
        {/* Toolbar */}
        <div
          className="flex items-center gap-6 px-4 py-2.5 border-b shrink-0"
          style={{
            backgroundColor: "var(--color-paper-deep)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] tracking-[0.15em] uppercase font-bold mr-1" style={{ color: "var(--color-text-tertiary)" }}>
              Size by
            </span>
            {SORT_OPTIONS.map((o) => (
              <ToolbarButton key={o.value} active={sortMode === o.value} onClick={() => setSortMode(o.value)}>
                {o.label}
              </ToolbarButton>
            ))}
          </div>
          <div className="h-4 w-px" style={{ backgroundColor: "var(--color-border)" }} />
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] tracking-[0.15em] uppercase font-bold mr-1" style={{ color: "var(--color-text-tertiary)" }}>
              Tier
            </span>
            {TIER_OPTIONS.map((o) => (
              <ToolbarButton key={o.value} active={tierFilter === o.value} onClick={() => setTierFilter(o.value)}>
                {o.label}
              </ToolbarButton>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4 text-[0.6rem]" style={{ color: "var(--color-text-tertiary)" }}>
            <span className="flex items-center gap-1.5">
              <span style={{ color: "var(--color-risk-high)" }}>●</span> High
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: "var(--color-risk-medium)" }}>●</span> Medium
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: "var(--color-risk-low)" }}>●</span> Low
            </span>
          </div>
        </div>

        {/* Main split */}
        <div className="flex flex-1 min-h-0">
          {/* Graph — 65% */}
          <div className="flex-1 min-w-0" style={{ backgroundColor: "var(--color-paper-deep)" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.12 }}
              minZoom={0.25}
              maxZoom={2}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              panOnScroll={false}
              panOnDrag={false}
            >
              <Background
                color="var(--color-border)"
                gap={32}
                size={1}
                style={{ backgroundColor: "var(--color-paper-deep)" }}
              />
              <Controls
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 4,
                }}
              />

            </ReactFlow>
          </div>

          {/* Sidebar — 35% */}
          <div
            className="w-80 shrink-0 border-l flex flex-col"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <div
              className="px-5 py-3 border-b shrink-0"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper-deep)" }}
            >
              <p className="text-[0.6rem] tracking-[0.2em] uppercase font-bold" style={{ color: "var(--color-gold)" }}>
                Sector detail
              </p>
            </div>
            <div className="flex-1 min-h-0">
              <SidebarPanel industry={selectedIndustry} sectorOccupations={sectorOccupations} />
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
