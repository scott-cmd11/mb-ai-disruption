// Static graph layout for the Manitoba Industry Explorer.
// No React or @xyflow imports — safe to use server-side and client-side.

export interface GraphNodeLayout {
  id: string;       // naicsCode (string, e.g. "31-33")
  cx: number;       // logical center x (1400px space)
  cy: number;       // logical center y (800px space)
}

export interface GraphEdgeLayout {
  id: string;
  source: string;   // naicsCode
  target: string;   // naicsCode
}

// ── Node positions ────────────────────────────────────────────────────────────
// Logical center coordinates. React Flow position = { x: cx - size/2, y: cy - size/2 }.

export const GRAPH_NODES: GraphNodeLayout[] = [
  // Goods / primary — left column
  { id: "11",    cx: 120,  cy: 300 }, // Agriculture
  { id: "21",    cx: 120,  cy: 460 }, // Mining & Oil
  { id: "23",    cx: 120,  cy: 620 }, // Construction

  // Goods processing — center-left
  { id: "31-33", cx: 290,  cy: 380 }, // Manufacturing

  // Infrastructure — top
  { id: "22",    cx: 240,  cy: 120 }, // Utilities
  { id: "51",    cx: 480,  cy: 100 }, // Information

  // Distribution — mid
  { id: "41",    cx: 460,  cy: 300 }, // Wholesale Trade
  { id: "48-49", cx: 620,  cy: 460 }, // Transportation

  // Services hub — center
  { id: "52",    cx: 740,  cy: 220 }, // Finance & Insurance
  { id: "54",    cx: 760,  cy: 380 }, // Professional Services
  { id: "55",    cx: 760,  cy: 540 }, // Corporate Management
  { id: "56",    cx: 620,  cy: 640 }, // Administrative Support

  // Consumer — right
  { id: "44-45", cx: 960,  cy: 360 }, // Retail Trade
  { id: "72",    cx: 960,  cy: 540 }, // Accommodation & Food

  // Far right
  { id: "53",    cx: 960,  cy: 180 }, // Real Estate
  { id: "71",    cx: 1140, cy: 460 }, // Arts & Entertainment
  { id: "81",    cx: 1140, cy: 620 }, // Other Services

  // Civic / bottom
  { id: "61",    cx: 400,  cy: 740 }, // Education
  { id: "62",    cx: 560,  cy: 700 }, // Health Care
  { id: "91",    cx: 720,  cy: 740 }, // Public Administration
];

// ── Edges ─────────────────────────────────────────────────────────────────────

export const GRAPH_EDGES: GraphEdgeLayout[] = [
  { id: "e1",  source: "11",    target: "31-33" }, // Agriculture → Manufacturing
  { id: "e2",  source: "11",    target: "41"    }, // Agriculture → Wholesale
  { id: "e3",  source: "21",    target: "31-33" }, // Mining → Manufacturing
  { id: "e4",  source: "31-33", target: "41"    }, // Manufacturing → Wholesale
  { id: "e5",  source: "31-33", target: "48-49" }, // Manufacturing → Transport
  { id: "e6",  source: "41",    target: "44-45" }, // Wholesale → Retail
  { id: "e7",  source: "48-49", target: "44-45" }, // Transport → Retail
  { id: "e8",  source: "23",    target: "53"    }, // Construction → Real Estate
  { id: "e9",  source: "51",    target: "52"    }, // Information → Finance
  { id: "e10", source: "51",    target: "54"    }, // Information → Professional Svcs
  { id: "e11", source: "54",    target: "52"    }, // Professional → Finance
  { id: "e12", source: "54",    target: "55"    }, // Professional → Corporate Mgmt
  { id: "e13", source: "56",    target: "52"    }, // Admin → Finance
  { id: "e14", source: "56",    target: "54"    }, // Admin → Professional
  { id: "e15", source: "56",    target: "62"    }, // Admin → Health Care
  { id: "e16", source: "56",    target: "91"    }, // Admin → Public Admin
  { id: "e17", source: "61",    target: "62"    }, // Education → Health workforce
  { id: "e18", source: "61",    target: "91"    }, // Education → Public Admin
  { id: "e19", source: "62",    target: "91"    }, // Health → Public Admin funding
  { id: "e20", source: "52",    target: "53"    }, // Finance → Real Estate (mortgages)
  { id: "e21", source: "55",    target: "31-33" }, // Corporate → Manufacturing
  { id: "e22", source: "71",    target: "72"    }, // Arts → Accommodation (tourism)
  { id: "e23", source: "72",    target: "44-45" }, // Accommodation → Retail
  { id: "e24", source: "81",    target: "44-45" }, // Other Services → Retail
];

// ── Size constants ────────────────────────────────────────────────────────────

export const EMP_MIN = 8_000;    // Corporate Management (lowest)
export const EMP_MAX = 105_000;  // Health Care (highest)
export const GDP_MIN = 0.012;    // Corporate Management
export const GDP_MAX = 0.115;    // Real Estate
export const RISK_MIN = 28;      // Construction
export const RISK_MAX = 72;      // Information
export const SIZE_MIN = 76;
export const SIZE_MAX = 156;

export type SortMode = "risk" | "employment" | "gdp";
export type TierFilter = "all" | "high" | "medium" | "low";

export function computeNodeSize(
  mbEmployment: number,
  mbGdpShare: number,
  sectorRiskScore: number,
  sortMode: SortMode,
): number {
  let t: number;
  switch (sortMode) {
    case "employment":
      t = (mbEmployment - EMP_MIN) / (EMP_MAX - EMP_MIN);
      break;
    case "gdp":
      t = (mbGdpShare - GDP_MIN) / (GDP_MAX - GDP_MIN);
      break;
    case "risk":
    default:
      t = (sectorRiskScore - RISK_MIN) / (RISK_MAX - RISK_MIN);
      break;
  }
  t = Math.min(1, Math.max(0, t));
  return Math.round(SIZE_MIN + t * (SIZE_MAX - SIZE_MIN));
}

// Hex colors for edges/minimap (CSS vars not accessible outside browser)
export const TIER_HEX = {
  low:    "#2A6540",
  medium: "#B07A28",
  high:   "#8B2020",
} as const;
