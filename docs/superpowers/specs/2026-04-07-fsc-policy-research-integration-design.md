# FSC & Policy Research Integration

**Date**: 2026-04-07
**Status**: Draft
**Scope**: Add Canadian research context, complementarity framework, J-curve timeline, and policy synthesis page

---

## Context

The Manitoba AI Disruption Explorer currently scores 68 occupations and 20 sectors using four academic datasets (Frey & Osborne, Felten-Raj-Seamans AIOE, Eloundou et al. LLM exposure, StatsCan adoption data). Five new research sources strengthen the site's credibility and add a Canadian policy lens:

### Source References

| ID | Source | Author/Publisher | Date | URL | Key Contribution |
|----|--------|-----------------|------|-----|------------------|
| S1 | Canada's Workforce in Transition | Conference Board of Canada / FSC | Sept 2025 | https://fsc-ccf.ca/wp-content/uploads/2025/09/canadas-workforce-in-transition_sept2025.pdf | 57.4% Canadian jobs highly AI-exposed; competing vs augmenting classification; job posting trend data |
| S2 | Understanding the Influence of AI on Employment | Conference Board of Canada / FSC | Jan 2026 | https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf | Canadian task-level AI exposure index by NAICS; 3-phase framework (exposure -> productivity -> likelihood); J-curve employment projections (-535K by 2030, +555K by 2045) |
| S3 | Right Brain, Left Brain, AI Brain | The Dais at TMU / FSC | Jan 2025 | https://fsc-ccf.ca/wp-content/uploads/2025/01/Right-Brain-Left-Brain-AI-Brain-Report_The-Dais_FSC.pdf | Exposure-complementarity framework for 506 Canadian NOC occupations, building on the IMF's complementarity methodology (Pizzinelli et al.); 4-quadrant classification (HE-HC, HE-LC, LE-HC, LE-LC); Canadian AI adoption 3.7% to 6.8% (2021-2023) |
| S4 | Building a Resilient Workforce (Impact Report) | Future Skills Centre | 2025 | https://fsc-ccf.ca/wp-content/uploads/2025/08/FSC-Impact-Report-EN-FINAL.pdf | FSC program outcomes; 300+ skills projects across Canada; policy framing for workforce transition |
| S5 | Government in the Age of Superintelligence | Policy Exchange (UK) | 2025 | https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf | UK policy think-tank perspective; "skills revaluation" thesis (low-skilled = low-paid, not low-value); Goldman Sachs 2/3 jobs exposed stat; 250K annual retraining recommendation; infrastructure buildout counter-signal for trades |

---

## What Changes

### Data Layer

**`src/types/index.ts`**

Add to `Occupation` interface:

```typescript
/** AI complementarity: "high" = AI assists the worker, "low" = AI competes with the worker. From FSC framework building on IMF methodology (S3). */
aiComplementarity?: "high" | "low";
```

**`public/data/occupations.json`**

Add `aiComplementarity` field to all 68 occupations. Classification criteria (derived from S3):

- **"high"** (AI-augmenting): Occupation tasks primarily involve judgment, creativity, interpersonal interaction, physical touch, responsibility for safety/health outcomes. AI enhances the worker's productivity but cannot replace the human element. Examples: physicians, engineers, senior managers, teachers, nurses, social workers, trades workers.
- **"low"** (AI-competing): Occupation tasks are primarily routine, rule-based, data-processing, or templated content creation. AI can perform core tasks with limited need for human judgment. Examples: administrative assistants, accountants, data entry clerks, editors, graphic designers, lab technicians.

No changes to composite scores, tier thresholds, or the scoring formula.

---

### Tier 1A: Canadian Context Callout (Calculator Results)

**File**: `src/app/calculator/ResultsClient.tsx`
**Location**: After the RLI Reality Check callout (line ~773). Insertion order in the results flow: ... -> RLI Callout -> **Canadian Context (1A)** -> **J-Curve (2D)** -> Cost Convergence Chart -> Actions
**Condition**: Show when `playbook && industry` (same guard as RLI callout, using the `Industry` object prop, not the `industryName` string)

**Content**:

```
Eyebrow: "Canadian context"
Headline: "How Canada's workforce compares"

Three stat cards in a row:
- "57.4%" — "of Canadian jobs are classified as highly exposed to AI" — Source: S1
- "53%" — "of all tasks across Canadian occupations could be performed by current AI" — Source: S2, Key Findings section, p.4: "Over half of tasks performed (53 per cent) across all occupations in Canada could be performed by current artificial intelligence technologies."
- "~2% vs 6.8%" — "Manitoba AI adoption rate vs national average. One of the widest gaps in Canada." — Sources: StatsCan CSBC + S3

Body text:
"Your score reflects Manitoba's unique position: high theoretical exposure combined with very low current adoption, meaning disruption is ahead of you, not behind you."

Source line:
"Sources: Future Skills Centre (2025), Conference Board of Canada (2026), Statistics Canada CSBC"
```

**Design**: Same card style as the RLI callout — `rounded-sm border p-5`, paper-deep background, navy accent.

---

### Tier 1B: Competing/Augmenting Label (Occupation Detail Panel)

**File**: `src/app/occupation/OccupationClient.tsx`
**Location**: In the detail panel, below the "Overall Risk Score" number and risk tier badge
**Condition**: Show when `selected.aiComplementarity` is defined

**Content**:

- If `"high"`: Badge text **"AI-augmenting"**, green-tinted (`--color-risk-low` family), with subtitle: "AI is more likely to assist workers in this role than replace them (FSC, 2025)"
- If `"low"`: Badge text **"AI-competing"**, amber-tinted (`--color-gold` family), with subtitle: "AI can perform many core tasks in this role with limited human involvement (FSC, 2025)"

**Design**: Small inline badge + one-line description. No layout changes to the panel.

---

### Tier 1C: About Page Data Sources

**File**: `src/app/about/page.tsx`
**Location**: Add to `DATA_SOURCES` array

Three new entries:

```typescript
{
  source: "Future Skills Centre — Canada's Workforce in Transition",
  description:
    "Classifies 57.4% of Canadian jobs as highly AI-exposed, split between AI-competing roles (where AI automates core tasks) and AI-augmenting roles (where AI enhances human capabilities). Analyzes 19 million job postings to track shifting demand. AI-augmenting roles grew 2.9% in 2024, outpacing AI-competing roles at 1.6%.",
  vintage: "Sept 2025",
  url: "https://fsc-ccf.ca/wp-content/uploads/2025/09/canadas-workforce-in-transition_sept2025.pdf",
},
{
  source: "Conference Board of Canada — Understanding the Influence of AI on Employment",
  description:
    "Canadian task-level AI exposure index covering 501 NOC occupations and 304 NAICS industries. Uses a 3-phase framework: exposure, productivity gains, and automation likelihood. Projects a short-term employment dip of 535,000 jobs by 2030, followed by a long-term gain of 555,000 jobs by 2045 as productivity benefits materialize.",
  vintage: "Jan 2026",
  url: "https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf",
},
{
  source: "The Dais / FSC — Right Brain, Left Brain, AI Brain",
  description:
    "Exposure-complementarity framework classifying 506 Canadian NOC occupations into four quadrants based on AI exposure and whether AI assists or replaces workers. 56% of Canadian workers are in occupations with higher AI exposure. Used as the basis for the AI-augmenting and AI-competing labels shown in occupation detail panels.",
  vintage: "Jan 2025",
  url: "https://fsc-ccf.ca/wp-content/uploads/2025/01/Right-Brain-Left-Brain-AI-Brain-Report_The-Dais_FSC.pdf",
},
```

Also add S5 (Policy Exchange) to DATA_SOURCES:

```typescript
{
  source: "Policy Exchange — Government in the Age of Superintelligence",
  description:
    "UK policy think-tank report examining workforce transformation, skills revaluation, and government preparedness for AI disruption. Projects large-scale labour market dislocation across white-collar sectors, recommends national retraining capacity of 250,000 workers annually, and argues that roles dismissed as 'low-skilled' are actually 'low-paid' and will command increasing premiums as cognitive work is automated.",
  vintage: "2025",
  url: "https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf",
},
```

Note: S4 (FSC Impact Report 2025) is intentionally omitted from the About page DATA_SOURCES because it is a program outcomes report, not a research dataset used in scoring or classification. It is cited only on the `/policy` page bibliography.

Also add to the Limitations section:

```
"The AI-augmenting/AI-competing classification is derived from the FSC complementarity framework (S3, building on IMF methodology by Pizzinelli et al.) applied to Canadian NOC codes. This is a binary simplification of a continuous measure. Some occupations near the threshold could reasonably be classified either way. The classification reflects the current generation of AI tools and may shift as capabilities evolve."
```

---

### Tier 2D: J-Curve Section (Calculator Results)

**File**: `src/app/calculator/ResultsClient.tsx`
**Location**: Immediately after the Canadian Context callout (Tier 1A), before the cost convergence chart. See explicit ordering in Tier 1A above.
**Condition**: Show when `playbook && industry` (same guard — the `Industry` object prop)

**Content**:

```
Eyebrow: "Employment outlook"
Headline: "The disruption timeline"

Visual: A minimal inline timeline with two data points:
  Left marker: "2030" — "-535,000 jobs" — "Short-term dip as businesses adopt AI"
  Right marker: "2045" — "+555,000 jobs" — "Long-term gain from productivity growth"
  A connecting line/arrow between them, colored from risk-high to risk-low

Body text:
"The Conference Board of Canada projects a short-term employment dip as businesses reduce workforce in favour of AI, followed by long-term job creation from productivity gains. The cost-convergence curve below models this same pattern for your sector."

Source line:
"Source: Conference Board of Canada, Understanding the Influence of AI on Employment (2026). Full-adoption scenario using the MOST macroeconomic model."
```

**Design**: Same section heading style as other results sections. The timeline visual is a simple horizontal bar with two positioned markers, not a full chart library.

---

### Tier 2E: Complementarity Quadrant (Occupation Page)

**File**: `src/app/occupation/OccupationClient.tsx`
**Location**: New section above the card grid, below the search/filter controls
**Toggled by**: A new toolbar button "Quadrant view" / "Card view" to switch between the two views

**Content**:

A 2x2 scatter quadrant:
- **X-axis**: Composite risk score (0-100), divided at 50 into "Lower exposure" (left) and "Higher exposure" (right)
- **Y-axis**: Complementarity, divided into "AI assists you" (top, high) and "AI competes with you" (bottom, low)
- **Each dot**: One occupation, sized uniformly (~8px), colored by risk tier (green/amber/red)
- **Quadrant labels**:
  - Top-right (HE-HC): "High exposure, AI assists" — 27% of Canadian workers (S3)
  - Bottom-right (HE-LC): "High exposure, AI competes" — 29% of Canadian workers (S3)
  - Top-left (LE-HC): "Lower exposure, AI assists"
  - Bottom-left (LE-LC): "Lower exposure, less impact"
- **Missing data fallback**: Occupations without `aiComplementarity` defined are excluded from the quadrant view (dot not rendered). The card grid view always shows all occupations regardless. After the data migration, all 68 occupations will have the field populated, but the optional typing is preserved for forward-compatibility with new occupations added later.
- **Interaction**: Clicking a dot selects it, shows the occupation name in a tooltip, and scrolls to/highlights the corresponding card in the card grid. Hover shows occupation name.
- **Filters**: Respects the same sector/tier/search filters as the card grid

**Design**: Light background, thin border grid lines. Quadrant backgrounds use very subtle tints (risk-high-bg for bottom-right, risk-low-bg for top-left). Max height ~300px. Responsive: on mobile (<640px), hide the quadrant view entirely and only show the card view.

**Source attribution**: Small text below the quadrant: "Framework: FSC exposure-complementarity model (building on IMF methodology by Pizzinelli et al.). Right Brain, Left Brain, AI Brain (The Dais, 2025)"

---

### Tier 3F: Canadian Policy Context Page (`/policy`)

**Files**: Create `src/app/policy/page.tsx` (Server Component)

**Nav**: Add `{ href: "/policy", label: "Research" }` to `src/lib/nav.ts` in the `NAV_LINKS` array, between "Threat Model" and "About" (second-to-last item). `NavMenu.tsx` reads from this array dynamically and requires no direct editing

**Structure**:

```
Breadcrumb: Home / Research Context

H1: "What the research says"
Subtitle: "A synthesis of Canadian and international research on AI workforce disruption, applied to Manitoba's economy."

Exploratory notice (same style as About page):
"This page synthesizes findings from peer-reviewed and government-funded research. It is not policy advice."

Section 1: "The Canadian picture"
- 57.4% of Canadian jobs classified as highly AI-exposed (S1)
- 53% of tasks across all occupations performable by current AI (S2)
- Canada AI adoption: 3.7% (2021) to 6.8% (2023) nationally (S3)
- Manitoba at ~2%, significantly below national average (StatsCan CSBC)
- Industry exposure rankings from S2: Agriculture 76.3%, Utilities 66.4%, Professional Services 64.6%, Mining 64.2%, down to Accommodation & Food 26.0%
Source attribution for each stat.

Section 2: "Competing with AI vs working with AI"
- The FSC 4-quadrant framework from S3 (building on IMF complementarity methodology by Pizzinelli et al.)
- 27% of Canadian workers in HE-HC (AI assists), 29% in HE-LC (AI competes)
- Examples of each from the site's own occupation data
- Skills that distinguish augmented roles: planning, leadership, coaching, critical thinking (S3)
- Skills in competing roles: accounting, data analysis, information filing, proofreading (S3)
Source attribution for each claim.

Section 3: "The disruption timeline"
- Conference Board J-curve: -535,000 by 2030, +555,000 by 2045 (S2)
- Policy Exchange preparation windows: 1-2yr design reforms, 3-5yr major changes, 5yr+ continuous adaptation (S5)
- Goldman Sachs: two-thirds of jobs exposed, generative AI could substitute a quarter (cited in S5)
- UK government estimate: 30% of workforce automated in 20 years (cited in S5)
- One in three people think AI could do their job within five years (cited in S5)
Source attribution for each stat.

Section 4: "Which jobs change, which jobs grow"
- FSC steepest job posting declines (S1): web designers -97.9%, information services -55.6%, authors/writers -56.2%, desktop publishing -74%, customer service -54.2%
- FSC fastest-growing AI-augmented roles (S1): conductors/composers +43.4%, ECEs +22.6%, dentists +25.6%, nursing supervisors +18.7%
- Policy Exchange "skills revaluation" (S5): roles dismissed as "low-skilled" are actually "low-paid" — physical touch, emotional intelligence, interpersonal skills will command increasing premiums as cognitive work gets automated
- OpenAI Industrial Policy (already on site): AI infrastructure buildout requires ~20% more trades workers
Source attribution for each claim.

Section 5: "What policymakers are being told"
- Policy Exchange (S5): capacity to retrain 250,000 workers annually nationally; proportional for Manitoba (~25,000)
- Policy Exchange (S5): UBI discussions entering mainstream; working hours reforms (3.5-day week)
- FSC (S4): 300+ skills projects across Canada; emphasis on employer-worker co-investment in training
- Conference Board (S2): services-based industries (accommodation, education, retail) gain less from AI — need different transition strategies than knowledge-economy sectors
- Policy Exchange (S5): "The automation taboo" — governments suppress the automation conversation due to political sensitivity
Source attribution for each claim.

Section 6: "Sources"
Full bibliography table with all 5 sources (S1-S5) plus the site's existing data sources.
Each entry: title, author, date, URL, and one-line description of how it's used on this site.

Footer CTA: "See how these findings apply to your sector" -> /calculator
```

**Design**: Follows the About page pattern — semantic sections with `h2` headings, `border-b` dividers, `text-sm text-secondary` body copy. No interactive components. Static content only.

---

## What Does NOT Change

- Composite score formula, weights, tier thresholds
- Existing occupation scores or risk tiers
- Heatmap, threat simulator, or scenarios pages
- Calculator input flow or scoring logic
- Any existing component behaviour

---

## New Files

| File | Type |
|------|------|
| `src/app/policy/page.tsx` | Server Component (static) |

## Modified Files

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add `aiComplementarity` to `Occupation` |
| `public/data/occupations.json` | Add `aiComplementarity` to 68 entries |
| `src/app/calculator/ResultsClient.tsx` | Add Canadian Context callout + J-Curve section |
| `src/app/occupation/OccupationClient.tsx` | Add competing/augmenting badge + quadrant view toggle |
| `src/app/about/page.tsx` | Add 4 data sources (3 FSC + 1 Policy Exchange) + limitation note |
| `src/lib/nav.ts` | Add "Research" nav link between "Threat Model" and "About" |

## No New npm Dependencies

---

## Verification

1. `npm run build` — clean, no TS errors
2. `/calculator` — run assessment, confirm Canadian Context callout and J-Curve section appear with correct source attributions
3. `/occupation` — click any card, confirm augmenting/competing badge shows with FSC source citation
4. `/occupation` — toggle to quadrant view, confirm dots are positioned correctly, clicking selects occupation
5. `/about` — confirm 3 new FSC sources appear in data sources table with correct URLs
6. `/policy` — confirm all 5 sections render, all statistics have source attributions, all URLs are clickable
7. Nav menu shows "Research" link between "Threat Model" and "About"
8. Mobile: quadrant view hidden on <640px, all other additions stack cleanly at 375px
