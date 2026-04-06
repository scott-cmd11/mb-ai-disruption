# Full Enhancement Pass: Occupation, Heatmap, Threat Simulator, Richer Results

**Date:** 2026-04-04
**Status:** Draft
**Scope:** 4 new features + mobile nav + navigation updates

---

## Context

The Manitoba AI Disruption Explorer has 5 working pages (Home, Calculator, Explorer, Scenarios, About) but the `/occupation` route in the nav is a 404. The underlying research recommends several additional tools (Lean Startup Threat Simulator, Task Vulnerability Heatmap, sector-specific action playbooks) that would make the site comprehensive. This spec covers building all four features plus a mobile hamburger menu.

**Existing data assets:**
- `public/data/industries.json` — 20 NAICS sectors with employment, GDP, adoption, risk scores, key employers
- `public/data/occupations.json` — 49 NOC occupations with freyOsborne, aioeScore, llmExposure, compositeScore, taskCategories (8 types), naicsSectors
- `src/lib/data.ts` — Query functions (getIndustries, getOccupations, getOccupationsBySector, etc.)
- `src/lib/scoring.ts` — Scoring engine, recommendation generation
- `src/types/index.ts` — Industry, Occupation, AssessmentResult, TaskCategory types

---

## Phase A: Occupation Deep-Dive (`/occupation`)

### Purpose
Fill the 404 gap. Let users search and explore all 49 tracked Manitoba occupations with detailed risk breakdowns.

### Files to Create
| File | Type | Purpose |
|------|------|---------|
| `src/app/occupation/page.tsx` | Server Component | Metadata, data loading, passes occupations + industries to client |
| `src/app/occupation/OccupationClient.tsx` | Client Component | Search, filter, sort, detail panel |

### Page Layout

**Hero:** Dark navy, same pattern as other pages. Title: "Occupation Risk Explorer". Subtitle: "Search 49 Manitoba occupations. See task-level AI exposure scores."

**Controls bar:** Search input (type-ahead, `toLowerCase().includes()`) + sector dropdown filter + tier radio filter (All/High/Medium/Low) + sort select (Risk Score desc / Employment desc / A-Z).

**Occupation list:** Card grid or table rows. Each card shows:
- Occupation short title
- Composite score (number + small bar)
- Risk tier badge
- MB employment count
- 1-2 task category pills

**Detail panel:** Clicking a card opens a detail panel (sidebar right on desktop >=1024px, full-width slide-up on mobile).

Detail panel contents:
1. **Header:** Full title, NOC code, risk tier badge
2. **Three component score bars:**
   - Frey & Osborne (automation probability)
   - AIOE (AI-specific exposure)
   - LLM Exposure (generative AI impact)
   - Each: label + horizontal bar + numeric score. Bar color = tier color of that component score.
3. **Composite score:** Large number + half-donut gauge (reuse `ScoreGauge` pattern from `ResultsClient.tsx`)
4. **Task categories:** Full set of pills with labels
5. **Found in sectors:** Chips for each naicsSectors entry, looked up to shortName from industries. Clickable → `/explorer` (not implemented as link initially, just display).
6. **Manitoba employment:** Formatted number
7. **Related occupations:** Up to 5 occupations sharing at least one sector AND within +-15 points compositeScore. Shown as clickable mini-cards.
8. **Score confidence:** Small note showing `scoreConfidence` value. Map type literals to display labels: `"published"` → "Published data", `"derived"` → "Derived estimate", `"estimated"` → "Estimated". The type values are lowercase strings per `src/types/index.ts` line 20.

### Data Flow
```
page.tsx (server)
  → getOccupations() → 49 occupations
  → getIndustries() → 20 industries (for sector name lookup)
  → <OccupationClient occupations={...} industries={...} />

OccupationClient (client)
  → useState: searchQuery, sectorFilter, tierFilter, sortMode, selectedNocCode
  → useMemo: filtered + sorted list
  → Detail panel reads selected occupation from filtered list
```

### Reused Patterns
- Hero section: same structure as `/scenarios/page.tsx` lines 76-158
- Risk tier badges: `.badge-high`, `.badge-medium`, `.badge-low` from `globals.css`
- Score bars: `.risk-bar-high`, `.risk-bar-medium`, `.risk-bar-low` from `globals.css`
- Breadcrumb nav: same pattern as scenarios page

---

## Phase B: Task Vulnerability Heatmap (`/heatmap`)

### Purpose
Visual matrix showing which task types are most exposed in which sectors. Answers "where exactly does AI hit hardest?"

### Files to Create
| File | Type | Purpose |
|------|------|---------|
| `src/app/heatmap/page.tsx` | Server Component | Computes 8x20 matrix at build time, passes to client |
| `src/app/heatmap/HeatmapClient.tsx` | Client Component | Interactive grid with click-to-drill popovers |

### Matrix Computation (server-side in page.tsx)

```typescript
// For each (taskCategory, sector) pair:
// 1. Find occupations where naicsSectors includes this sector
//    AND taskCategories includes this category
// 2. Compute employment-weighted average compositeScore
// 3. If no matching occupations, cell value = null (gray)

interface HeatmapCell {
  taskCategory: TaskCategory;
  naicsCode: string;
  score: number | null;       // weighted average, 0-100
  tier: RiskTier | null;
  occupationCount: number;    // how many occupations contribute
  drivingOccupations: Array<{ nocCode: string; shortTitle: string; compositeScore: number }>;
}
```

**Multi-category occupations:** When an occupation spans multiple task categories (e.g., both `data_processing` and `content_creation`), it contributes its FULL employment count to EACH matching cell. This is correct because we're measuring "how many workers in this sector are exposed to AI via this task type" — a worker who does both data processing and content creation is exposed via both channels.

Result: `HeatmapCell[][]` — 8 rows x 20 columns = 160 cells.

### Grid Layout

**Rows (8):** data_processing, content_creation, customer_service, physical_manual, decision_making, creative_design, coordination, technical_analysis. Display with friendly labels.

**Columns (20):** All NAICS sectors sorted by sectorRiskScore descending (highest risk left).

**Cell rendering:**
- Background color on 5-stop scale: `#F0FDF4` (score 0-20) → `#FEF9C3` (20-40) → `#FED7AA` (40-60) → `#FECACA` (60-80) → `#FCA5A5` (80-100). Null cells = `#F1F5F9` gray.
- Cell contains the numeric score (small, centered).
- On hover: darker border + tooltip with "Task × Sector: score (N occupations)".
- On click: popover showing the driving occupations with their individual scores.

**Responsiveness:**
- Desktop: full grid, horizontal scroll if needed
- Mobile: sticky first column (task names), horizontal scroll for sector columns

**Legend:** Color scale bar below the grid with score ranges.

### Data Flow
```
page.tsx (server)
  → getOccupations(), getIndustries()
  → computeHeatmapMatrix(occupations, industries) → HeatmapCell[][]
  → <HeatmapClient matrix={...} industries={...} taskLabels={...} />
```

---

## Phase C: Lean Startup Threat Simulator (`/threat-simulator`)

### Purpose
Show business owners how a lean, AI-native competitor could undercut their business type. Side-by-side cost/output comparison.

### Files to Create
| File | Type | Purpose |
|------|------|---------|
| `public/data/threat-scenarios.json` | Static data | 5 hardcoded threat comparison scenarios |
| `src/app/threat-simulator/page.tsx` | Server Component | Loads scenarios, metadata |
| `src/app/threat-simulator/ThreatSimulatorClient.tsx` | Client Component | Scenario picker + two-column comparison |

### Data Structure (`threat-scenarios.json`)

```json
[
  {
    "id": "marketing-agency",
    "label": "B2B Marketing Agency",
    "icon": "megaphone",
    "relevantNaicsCodes": ["54"],
    "traditional": {
      "teamSize": 18,
      "roles": ["Account Executives", "SDRs", "Copywriters", "Analysts", "Designers"],
      "annualCost": 850000,
      "output": "15,000 leads/year",
      "costPerUnit": 56.67,
      "unitLabel": "cost per lead"
    },
    "aiNative": {
      "teamSize": 3,
      "roles": ["Founder/Strategist", "AI Orchestrator", "Client Lead"],
      "annualCost": 120000,
      "output": "22,000 leads/year",
      "costPerUnit": 5.45,
      "unitLabel": "cost per lead"
    },
    "keyInsight": "85% lower operational cost with 47% more output. The AI-native agency achieves hyper-personalized outreach at scale.",
    "source": "Compiled from industry benchmarks and AI-native startup financial disclosures (2025-2026)"
  }
]
```

**5 scenarios** (from research Table 2):
1. B2B Marketing Agency
2. Outsourced Bookkeeping / CAS
3. Specialized Legal Review
4. Freight Brokerage
5. Customer Support / BPO

### Standalone Page Layout

**Hero:** Same dark navy pattern. Title: "Lean AI Startup Threat Model". Subtitle: "See how a 3-person AI-native team competes with your traditional business."

**Scenario picker:** 5 cards in a row (like scenario tabs on `/scenarios`). Each shows label + icon + "vs X staff" teaser.

**Comparison panel:** Two columns side-by-side:

| Traditional | AI-Native |
|------------|-----------|
| Team size: 18 | Team size: 3 |
| Roles listed | Roles listed |
| Annual cost: $850K | Annual cost: $120K |
| Output: 15K leads | Output: 22K leads |
| Cost/lead: $56.67 | Cost/lead: $5.45 |

Visual: Traditional column tinted with a subtle red/warm background. AI-native column tinted green/cool. Large delta callouts between columns: "-83% cost", "+47% output".

**Key insight:** Callout card below comparison with the insight text.

**Bottom CTA:** "See your sector's full risk profile →" linking to calculator.

### Calculator Embed (in ResultsClient.tsx)

After the existing recommendations section, add a new section:

```
─── Competitive Threat Preview ───────────────────────
[If user's naicsCode matches a scenario's relevantNaicsCodes]

"In your sector, a lean AI-native competitor could look like this:"

[Condensed two-column card: team size + annual cost + key metric only]
[Link: "See full threat model →" → /threat-simulator#scenario-id]
```

If no scenario matches the user's sector, this section is omitted.

**NAICS code matching:** Some industries use hyphenated codes (`"31-33"`, `"44-45"`, `"48-49"`). The `relevantNaicsCodes` array should use the exact same string format as `industries.json`. Matching uses exact string equality via `relevantNaicsCodes.includes(input.naicsCode)`, which works because both sides use the same NAICS code strings. Do NOT use prefix matching or range parsing.

---

## Phase D: Richer Calculator Results

### Purpose
Replace generic recommendations with sector-specific action playbooks from the research, and add underestimation warnings.

### Files to Create
| File | Type | Purpose |
|------|------|---------|
| `public/data/sector-playbooks.json` | Static data | 20 sector-specific playbooks |

### Data Structure (`sector-playbooks.json`)

```json
[
  {
    "naicsCode": "54",
    "sectorLabel": "Professional Services",
    "actions12Month": [
      "Deploy AI for document review and research tasks",
      "Establish data governance and security protocols",
      "Audit current billable-hour revenue model for vulnerability"
    ],
    "actions1to3Year": [
      "Transition entirely to fixed-fee or outcome-based pricing",
      "Build proprietary data assets for internal AI agent training",
      "Redesign staffing: shift from pyramid to obelisk model"
    ],
    "biggestMistake": "Continuing to rely on junior billable hours for revenue while AI commoditizes the work those hours produce.",
    "strategicPriority": "Reorienting human capital toward high-value strategic advisory and trust-based relationships.",
    "underestimationRisk": {
      "reason": "Firms believe regulatory complexity and client trust are unassailable moats.",
      "gettingWrong": "Underestimating AI's ability to execute audit, contract drafting, and marketing at higher accuracy and lower cost.",
      "consequence": "Total loss of competitive pricing power; client defection to leaner models.",
      "urgency": "Critical"
    }
  }
]
```

All 20 sectors get entries. Research Tables 3 and 5 provide data for the highest-risk sectors. Lower-risk sectors (Construction, Healthcare clinical) get lighter entries.

### New Sections in ResultsClient.tsx

**Section 1: Action Roadmap** (after existing recommendations)
- Two-column timeline: "Next 12 Months" (left) and "1-3 Years" (right)
- Each column: numbered action items
- Below: "Biggest mistake to avoid" in a red-bordered callout
- Below that: "Strategic priority" in a navy callout

**Section 2: Underestimation Warning** (after action roadmap)
- Amber-bordered card with warning icon
- "Why [sector] businesses underestimate the threat"
- Reason + what they're getting wrong + likely consequence
- Urgency badge (Critical / High / Moderate)

### Data Flow
```
calculator/page.tsx (confirmed Server Component — exports metadata, uses async)
  → load sector-playbooks.json + threat-scenarios.json
  → pass playbooks + scenarios to CalculatorClient alongside existing industries/occupations
  → CalculatorClient passes matched playbook + threat scenario to ResultsClient
  → ResultsClient renders new sections
```

---

## Phase N: Mobile Hamburger Menu

### Purpose
Nav has 7 items (Calculator, Explorer, Occupations, Scenarios, Heatmap, Threat Model, About). Flat nav works on desktop; needs hamburger collapse on mobile.

### Modified File
`src/app/layout.tsx`

### Approach
- Desktop (>=768px): Flat nav as-is, all 7 items visible
- Mobile (<768px): Hamburger button (three lines) replaces nav items. Tapping opens a slide-down overlay with nav items stacked vertically.
- State: `useState<boolean>(false)` for menu open/close
- Animation: `max-height` transition or `transform: translateY` for slide-down
- Accessibility: `aria-expanded`, `aria-controls`, focus trap within open menu
- The header component needs `"use client"` — extract nav into a `NavMenu` client component, keep the rest of layout as server component

### Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/app/layout.tsx` | Modify | Remove inline nav, import NavMenu; keep as Server Component (preserves `metadata` export) |
| `src/components/NavMenu.tsx` | Create | `"use client"` component owning `NAV_LINKS`, hamburger toggle, mobile menu |

**Important:** `NAV_LINKS` must move INTO `NavMenu.tsx` (or a shared `src/lib/nav.ts`), NOT stay in `layout.tsx`. The layout must remain a Server Component to preserve the `metadata` export. If `layout.tsx` gains `"use client"`, Next.js silently ignores `metadata` and SEO breaks with no build error.

---

## Navigation Updates

Update `NAV_LINKS` in `layout.tsx`:
```typescript
const NAV_LINKS = [
  { href: "/calculator",        label: "Calculator" },
  { href: "/explorer",          label: "Explorer" },
  { href: "/occupation",        label: "Occupations" },
  { href: "/scenarios",         label: "Scenarios" },
  { href: "/heatmap",           label: "Heatmap" },
  { href: "/threat-simulator",  label: "Threat Model" },
  { href: "/about",             label: "About" },
] as const;
```

---

## New Types (add to `src/types/index.ts`)

```typescript
// Threat simulator
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

// Sector playbooks
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
}

// Heatmap
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
```

---

## New Data Query Functions (add to `src/lib/data.ts`)

```typescript
export function getThreatScenarios(): ThreatScenario[];
export function getThreatScenarioByNaics(naicsCode: string): ThreatScenario | undefined;
export function getSectorPlaybooks(): SectorPlaybook[];
export function getSectorPlaybook(naicsCode: string): SectorPlaybook | undefined;
```

---

## Build Order

1. **Mobile Nav** — small, self-contained, unblocks nav for all new pages
2. **Phase A: Occupation** — fills the 404, straightforward data display
3. **Phase D: Richer Results** — new data file + ResultsClient additions
4. **Phase C: Threat Simulator** — new page + calculator embed (touches ResultsClient after Phase D)
5. **Phase B: Heatmap** — most complex server-side computation, built last

---

## Files Summary

### New Files (9)
| File | Type |
|------|------|
| `src/components/NavMenu.tsx` | Client Component |
| `src/app/occupation/page.tsx` | Server Component |
| `src/app/occupation/OccupationClient.tsx` | Client Component |
| `src/app/heatmap/page.tsx` | Server Component |
| `src/app/heatmap/HeatmapClient.tsx` | Client Component |
| `src/app/threat-simulator/page.tsx` | Server Component |
| `src/app/threat-simulator/ThreatSimulatorClient.tsx` | Client Component |
| `public/data/threat-scenarios.json` | Static Data |
| `public/data/sector-playbooks.json` | Static Data |

### Modified Files (5)
| File | Changes |
|------|---------|
| `src/types/index.ts` | Add ThreatScenario, SectorPlaybook, HeatmapCell types |
| `src/lib/data.ts` | Add query functions for new data files |
| `src/app/layout.tsx` | Update NAV_LINKS, extract nav to NavMenu |
| `src/app/calculator/page.tsx` | Load playbook + threat data, pass to client |
| `src/app/calculator/ResultsClient.tsx` | Add playbook section, threat preview, underestimation callout |

### No New npm Dependencies
All features built with existing stack (React, Next.js, Tailwind, CSS custom properties). No Recharts, no D3 — all visualizations use HTML/CSS bars, grids, and inline SVG.

---

## Verification

After each phase:
1. `npm run build` passes with 0 TypeScript errors
2. All new pages render at their routes
3. Interactive features work (search, filter, click-to-expand)
4. Mobile layout is usable (hamburger menu, responsive grids)
5. WCAG checks: contrast ratios, keyboard navigation, screen reader labels
6. Calculator results show new playbook sections when sector has playbook data
7. Threat simulator embed appears in calculator results for matching sectors
