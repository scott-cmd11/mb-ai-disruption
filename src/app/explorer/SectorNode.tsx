"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Industry } from "@/types";
import type { SortMode } from "./graphLayout";

export interface SectorNodeData {
  industry: Industry;
  size: number;
  isSelected: boolean;
  isFiltered: boolean;
  sortMode: SortMode;
  [key: string]: unknown; // required by React Flow's Node generic
}

const TIER_BORDER = {
  low:    "var(--color-risk-low)",
  medium: "var(--color-risk-medium)",
  high:   "var(--color-risk-high)",
};

const TIER_BG = {
  low:    "var(--color-risk-low-bg)",
  medium: "var(--color-risk-medium-bg)",
  high:   "var(--color-risk-high-bg)",
};

function SectorNodeInner({ data }: NodeProps) {
  const { industry, size, isSelected, isFiltered } = data as SectorNodeData;
  const tier = industry.riskTier;
  const borderColor = TIER_BORDER[tier];

  const fontSize = size < 96 ? 8 : size < 120 ? 9 : size < 140 ? 10 : 11;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: isSelected
          ? `3px solid var(--color-navy)`
          : `2px solid ${borderColor}`,
        backgroundColor: isSelected ? TIER_BG[tier] : "var(--color-paper)",
        boxShadow: isSelected
          ? `0 0 0 4px var(--color-navy), 0 0 0 7px var(--color-gold), 0 4px 16px rgba(0,0,0,0.15)`
          : `0 2px 6px rgba(0,0,0,0.08)`,
        opacity: isFiltered ? 0.2 : 1,
        transition: "opacity 0.2s ease, box-shadow 0.15s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Risk tier top band */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: 4,
          backgroundColor: borderColor,
          borderRadius: "0 0 4px 4px",
        }}
      />

      {/* Sector name */}
      <span
        style={{
          fontSize,
          fontFamily: "var(--font-body)",
          color: "var(--color-text-primary)",
          textAlign: "center",
          lineHeight: 1.25,
          padding: "0 10px",
          marginTop: 6,
        }}
      >
        {industry.shortName}
      </span>

      {/* Risk score */}
      <span
        style={{
          fontSize: fontSize - 1,
          fontFamily: "var(--font-mono)",
          color: borderColor,
          marginTop: 3,
          fontWeight: 600,
        }}
      >
        {industry.sectorRiskScore}
      </span>

      {/* Invisible handles for edge routing */}
      <Handle type="target" position={Position.Left}  style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="target" position={Position.Top}   style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}

export const SectorNode = memo(SectorNodeInner);
