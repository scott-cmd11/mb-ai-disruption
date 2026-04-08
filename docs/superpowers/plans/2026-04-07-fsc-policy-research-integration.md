# FSC & Policy Research Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate five Canadian/international research sources into the Manitoba AI Disruption Explorer — adding a complementarity data field, contextual callouts in calculator results, augmenting/competing badges on occupations, a quadrant visualization, and a new /policy research synthesis page.

**Architecture:** Data-first approach. Task 1 adds the `aiComplementarity` field to the type system and all 68 occupation records. Tasks 2-5 add UI components that consume this field. Task 6 creates the standalone /policy page. Task 7 adds the nav link. Each task produces a clean build and a commit.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, static JSON data. No new npm dependencies.

**Spec:** `docs/superpowers/specs/2026-04-07-fsc-policy-research-integration-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/types/index.ts` | Modify | Add `aiComplementarity` to `Occupation` interface |
| `public/data/occupations.json` | Modify | Add `aiComplementarity` to all 68 records |
| `src/app/calculator/ResultsClient.tsx` | Modify | Add `CanadianContextCallout` and `JCurveTimeline` components |
| `src/app/occupation/OccupationClient.tsx` | Modify | Add complementarity badge in detail panel + quadrant view toggle |
| `src/app/about/page.tsx` | Modify | Add 4 data sources + 1 limitation bullet |
| `src/lib/nav.ts` | Modify | Add "Research" nav link |
| `src/app/policy/page.tsx` | Create | Static research synthesis page |

---

### Task 1: Data Layer — Add `aiComplementarity` to types and occupation data

**Files:**
- Modify: `src/types/index.ts:82` (after `anthropicUsageIntensity`)
- Modify: `public/data/occupations.json` (all 68 entries)

- [ ] **Step 1: Add the field to the Occupation interface**

In `src/types/index.ts`, after line 82 (`anthropicUsageIntensity?: number;`), add:

```typescript
  /** AI complementarity: "high" = AI assists the worker, "low" = AI competes with the worker. From FSC framework building on IMF methodology (S3). */
  aiComplementarity?: "high" | "low";
```

- [ ] **Step 2: Add `aiComplementarity` to all 68 occupations in `occupations.json`**

Use a script to add the field. Classification rules derived from FSC "Right Brain, Left Brain, AI Brain" (S3):

- **"low"** (AI-competing) — tasks are primarily routine, rule-based, data-processing, or templated content. AI can perform core tasks with limited human judgment:
  - `14200` Data entry clerks
  - `13100` Administrative assistants
  - `12200` Bookkeepers
  - `11102` Financial analysts
  - `13102` Payroll administrators
  - `64410` Customer service representatives
  - `64409` Call centre agents
  - `11110` Accountants and auditors
  - `51120` Editors
  - `51110` Journalists
  - `14301` Dispatchers
  - `13312` Property managers
  - `32120` Medical lab technologists
  - `12104` Purchasing agents
  - `64100` Shelf stockers and order fillers
  - `44100` Paralegals
  - `63101` Insurance adjusters
  - `13110` Medical secretaries
  - `52110` Graphic designers
  - `21221` Statisticians & actuaries
  - `13201` Shippers and receivers
  - `75203` Material handlers
  - `43204` Border services officers
  - `10022` Marketing managers

- **"high"** (AI-augmenting) — tasks primarily involve judgment, creativity, interpersonal interaction, physical touch, or responsibility for safety/health. AI enhances but cannot replace the human:
  - `12202` Insurance agents
  - `21232` Software developers
  - `22220` Network technicians
  - `41101` Lawyers
  - `21300` Civil engineers
  - `11200` HR managers
  - `22302` Construction estimators
  - `62010` Retail salespersons
  - `65200` Food counter attendants
  - `65310` Security guards
  - `75110` Truck drivers
  - `86102` Agricultural equipment operators
  - `72400` Electricians
  - `72020` Carpenters
  - `72106` Welders
  - `73200` Heavy equipment operators
  - `31102` Family physicians
  - `31301` Registered nurses
  - `32101` Licensed practical nurses
  - `41200` Social workers
  - `41210` Elementary teachers
  - `41220` Secondary school teachers
  - `42201` College instructors
  - `21211` Biologists and scientists
  - `63200` Equipment assemblers
  - `84120` Farm supervisors
  - `52120` Manufacturing engineers
  - `90010` Production supervisors
  - `92100` Aircraft mechanics
  - `62200` Chefs
  - `62020` Cooks
  - `44200` Police officers
  - `43100` Government policy managers
  - `62101` Real estate agents
  - `72200` Plumbers
  - `31302` Nurse practitioners
  - `74100` Hairstylists & barbers
  - `33102` Personal support workers
  - `32111` Dental hygienists
  - `42202` Early childhood educators
  - `41300` Counsellors
  - `22301` Avionics technicians
  - `32112` Medical radiation technologists
  - `41402` Social policy researchers

Write a Node script `scripts/add-complementarity.js`:

```javascript
const fs = require("fs");
const path = require("path");

const LOW = new Set([
  "14200","13100","12200","11102","13102","64410","64409","11110",
  "51120","51110","14301","13312","32120","12104","64100","44100",
  "63101","13110","52110","21221","13201","75203","43204","10022"
]);

const filePath = path.join(__dirname, "..", "public", "data", "occupations.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

let highCount = 0, lowCount = 0;
for (const occ of data) {
  if (LOW.has(occ.nocCode)) {
    occ.aiComplementarity = "low";
    lowCount++;
  } else {
    occ.aiComplementarity = "high";
    highCount++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
console.log(`Done: ${highCount} high, ${lowCount} low, ${data.length} total`);
```

Run: `node scripts/add-complementarity.js`
Expected: `Done: 44 high, 24 low, 68 total`

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Clean build, no TS errors.

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts public/data/occupations.json scripts/add-complementarity.js
git commit -m "feat: add aiComplementarity field to all 68 occupations

Classifies each occupation as AI-augmenting (high) or AI-competing
(low) based on the FSC/IMF exposure-complementarity framework.
44 high, 24 low."
```

---

### Task 2: Canadian Context Callout (Calculator Results)

**Files:**
- Modify: `src/app/calculator/ResultsClient.tsx` (insert after line 773, before line 775)

- [ ] **Step 1: Add `CanadianContextCallout` component**

Add this function component above the `ResultsClient` export (after `RLICallout`, around line 504):

```tsx
function CanadianContextCallout() {
  return (
    <div
      className="rounded-sm border p-5 mb-6"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper-deep)" }}
    >
      <p
        className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-2"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Canadian context
      </p>
      <p className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
        How Canada&apos;s workforce compares
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div>
          <p className="font-display text-2xl font-bold" style={{ color: "var(--color-navy)" }}>57.4%</p>
          <p className="text-[0.65rem] leading-tight mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            of Canadian jobs classified as highly exposed to AI
          </p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold" style={{ color: "var(--color-navy)" }}>53%</p>
          <p className="text-[0.65rem] leading-tight mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            of all tasks across Canadian occupations performable by current AI
          </p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold" style={{ color: "var(--color-navy)" }}>~2%<span className="text-base font-normal" style={{ color: "var(--color-text-tertiary)" }}> vs 6.8%</span></p>
          <p className="text-[0.65rem] leading-tight mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            Manitoba AI adoption rate vs national average
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
        Your score reflects Manitoba&apos;s unique position: high theoretical exposure
        combined with very low current adoption, meaning disruption is ahead of you,
        not behind you.
      </p>
      <p className="text-[0.6rem] mt-2" style={{ color: "var(--color-text-tertiary)" }}>
        Sources:{" "}
        <a href="https://fsc-ccf.ca/wp-content/uploads/2025/09/canadas-workforce-in-transition_sept2025.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Future Skills Centre (2025)</a>,{" "}
        <a href="https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Conference Board of Canada (2026)</a>,{" "}
        Statistics Canada CSBC
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Insert into the results flow**

After the RLI callout (line 773: `{playbook && industry && <RLICallout />}`), add:

```tsx
      {/* Canadian Context Callout */}
      {playbook && industry && <CanadianContextCallout />}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add src/app/calculator/ResultsClient.tsx
git commit -m "feat: add Canadian Context callout to calculator results

Shows 57.4% AI exposure, 53% task automation, and MB vs national
adoption gap. Sources: FSC (2025), Conference Board (2026), StatsCan."
```

---

### Task 3: J-Curve Timeline (Calculator Results)

**Files:**
- Modify: `src/app/calculator/ResultsClient.tsx` (insert after `CanadianContextCallout`)

- [ ] **Step 1: Add `JCurveTimeline` component**

Add after `CanadianContextCallout`:

```tsx
function JCurveTimeline() {
  return (
    <div
      className="rounded-sm border p-6 sm:p-8 mb-6"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <SectionHeading label="Employment outlook" heading="The disruption timeline" />

      {/* Timeline visual */}
      <div className="relative flex items-center justify-between mb-6 px-4">
        {/* Left marker: 2030 */}
        <div className="text-center z-10">
          <p className="font-display text-lg font-bold" style={{ color: "var(--color-risk-high)" }}>2030</p>
          <p className="font-mono text-sm font-bold" style={{ color: "var(--color-risk-high)" }}>-535,000</p>
          <p className="text-[0.6rem] max-w-[120px] mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Short-term dip as businesses adopt AI
          </p>
        </div>

        {/* Connecting line */}
        <div className="flex-1 mx-4 h-1 rounded-full" style={{ background: "linear-gradient(90deg, var(--color-risk-high), var(--color-risk-low))" }} />

        {/* Right marker: 2045 */}
        <div className="text-center z-10">
          <p className="font-display text-lg font-bold" style={{ color: "var(--color-risk-low)" }}>2045</p>
          <p className="font-mono text-sm font-bold" style={{ color: "var(--color-risk-low)" }}>+555,000</p>
          <p className="text-[0.6rem] max-w-[120px] mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Long-term gain from productivity growth
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
        The Conference Board of Canada projects a short-term employment dip as
        businesses reduce workforce in favour of AI, followed by long-term job creation
        from productivity gains. The cost-convergence curve below models this same
        pattern for your sector.
      </p>
      <p className="text-[0.6rem] mt-2" style={{ color: "var(--color-text-tertiary)" }}>
        Source:{" "}
        <a
          href="https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          Conference Board of Canada, Understanding the Influence of AI on Employment (2026)
        </a>. Full-adoption scenario using the MOST macroeconomic model.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Insert into results flow**

After the `CanadianContextCallout` render (added in Task 2), before the Cost Curve:

```tsx
      {/* J-Curve Timeline */}
      {playbook && industry && <JCurveTimeline />}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add src/app/calculator/ResultsClient.tsx
git commit -m "feat: add J-Curve employment timeline to calculator results

Shows Conference Board projection: -535K jobs by 2030, +555K by 2045.
Visual gradient timeline from risk-high to risk-low."
```

---

### Task 4: Competing/Augmenting Badge (Occupation Detail Panel)

**Files:**
- Modify: `src/app/occupation/OccupationClient.tsx` (insert after the Overall Risk Score block, around line 505)

- [ ] **Step 1: Add the complementarity badge**

After the closing `</div>` of the "Overall Risk Score" block (line 505), add:

```tsx
            {/* 3b. AI complementarity badge */}
            {selected.aiComplementarity && (
              <div className="mb-5 text-center">
                <span
                  className="inline-block text-[0.65rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-sm border"
                  style={{
                    color: selected.aiComplementarity === "high" ? "var(--color-risk-low)" : "var(--color-gold)",
                    borderColor: selected.aiComplementarity === "high" ? "var(--color-risk-low)" : "var(--color-gold)",
                    backgroundColor: selected.aiComplementarity === "high" ? "var(--color-risk-low-bg)" : "rgba(217, 119, 6, 0.08)",
                  }}
                >
                  {selected.aiComplementarity === "high" ? "AI-augmenting" : "AI-competing"}
                </span>
                <p className="text-[0.6rem] mt-1.5 leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                  {selected.aiComplementarity === "high"
                    ? "AI is more likely to assist workers in this role than replace them (FSC, 2025)"
                    : "AI can perform many core tasks in this role with limited human involvement (FSC, 2025)"}
                </p>
              </div>
            )}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/app/occupation/OccupationClient.tsx
git commit -m "feat: add AI-augmenting/competing badge to occupation detail panel

Green badge for high-complementarity occupations (AI assists),
amber badge for low-complementarity (AI competes). Source: FSC 2025."
```

---

### Task 5: About Page — Add Data Sources and Limitation

**Files:**
- Modify: `src/app/about/page.tsx` (lines 85-88 for DATA_SOURCES, lines ~373-387 for limitations)

- [ ] **Step 1: Add 4 new entries to DATA_SOURCES array**

Before the closing `] as const;` (line 88), add these entries:

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
  {
    source: "Policy Exchange — Government in the Age of Superintelligence",
    description:
      "UK policy think-tank report examining workforce transformation, skills revaluation, and government preparedness for AI disruption. Projects large-scale labour market dislocation across white-collar sectors, recommends national retraining capacity of 250,000 workers annually, and argues that roles dismissed as 'low-skilled' are actually 'low-paid' and will command increasing premiums as cognitive work is automated.",
    vintage: "2025",
    url: "https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf",
  },
```

- [ ] **Step 2: Add limitation bullet**

In the limitations `<ul>` (after the MIT Iceberg bullet, around line 387), add:

```tsx
          <li>
            <strong className="text-[var(--color-text-primary)]">
              AI-augmenting/AI-competing classification is a binary simplification.
            </strong>{" "}
            Derived from the FSC complementarity framework (building on IMF methodology
            by Pizzinelli et al.) applied to Canadian NOC codes. Some occupations near
            the threshold could reasonably be classified either way. The classification
            reflects the current generation of AI tools and may shift as capabilities evolve.
          </li>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add FSC and Policy Exchange sources to About page

4 new data sources: FSC Workforce in Transition, Conference Board AI
Employment, Dais Right Brain/Left Brain, Policy Exchange Superintelligence.
Plus complementarity limitation note."
```

---

### Task 6: Complementarity Quadrant View (Occupation Page)

**Files:**
- Modify: `src/app/occupation/OccupationClient.tsx`

- [ ] **Step 1: Add view toggle state**

In the component state declarations (around line 64), add:

```tsx
  const [viewMode, setViewMode] = useState<"cards" | "quadrant">("cards");
```

- [ ] **Step 2: Add toggle buttons to the toolbar**

In the toolbar area (after the sort/filter controls), add view toggle buttons:

```tsx
          {/* View toggle — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setViewMode("cards")}
              className="px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors"
              style={{
                backgroundColor: viewMode === "cards" ? "var(--color-navy)" : "var(--color-paper-deep)",
                color: viewMode === "cards" ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
                borderColor: viewMode === "cards" ? "var(--color-navy)" : "var(--color-border)",
              }}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("quadrant")}
              className="px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors"
              style={{
                backgroundColor: viewMode === "quadrant" ? "var(--color-navy)" : "var(--color-paper-deep)",
                color: viewMode === "quadrant" ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
                borderColor: viewMode === "quadrant" ? "var(--color-navy)" : "var(--color-border)",
              }}
            >
              Quadrant
            </button>
          </div>
```

- [ ] **Step 3: Add the quadrant component**

Above the `OccupationClient` export, add a `ComplementarityQuadrant` component:

```tsx
function ComplementarityQuadrant({
  occupations,
  selectedNocCode,
  onSelect,
}: {
  occupations: Occupation[];
  selectedNocCode: string | null;
  onSelect: (nocCode: string) => void;
}) {
  // Filter to occupations with complementarity data
  const plotted = occupations.filter((o) => o.aiComplementarity);

  return (
    <div className="mb-8">
      <div
        className="relative rounded-sm border overflow-hidden"
        style={{
          borderColor: "var(--color-border)",
          height: 300,
        }}
      >
        {/* Quadrant labels */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none z-0">
          <div className="flex items-start justify-start p-3" style={{ backgroundColor: "rgba(42, 101, 64, 0.03)" }}>
            <span className="text-[0.55rem] uppercase tracking-wide font-bold" style={{ color: "var(--color-text-tertiary)" }}>
              Lower exposure, AI assists
            </span>
          </div>
          <div className="flex items-start justify-end p-3" style={{ backgroundColor: "rgba(42, 101, 64, 0.06)" }}>
            <span className="text-[0.55rem] uppercase tracking-wide font-bold text-right" style={{ color: "var(--color-risk-low)" }}>
              High exposure, AI assists<br />
              <span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}>27% of Canadian workers</span>
            </span>
          </div>
          <div className="flex items-end justify-start p-3" style={{ backgroundColor: "rgba(217, 119, 6, 0.02)" }}>
            <span className="text-[0.55rem] uppercase tracking-wide font-bold" style={{ color: "var(--color-text-tertiary)" }}>
              Lower exposure, less impact
            </span>
          </div>
          <div className="flex items-end justify-end p-3" style={{ backgroundColor: "rgba(220, 38, 38, 0.04)" }}>
            <span className="text-[0.55rem] uppercase tracking-wide font-bold text-right" style={{ color: "var(--color-risk-high)" }}>
              High exposure, AI competes<br />
              <span style={{ color: "var(--color-text-tertiary)", fontWeight: 400 }}>29% of Canadian workers</span>
            </span>
          </div>
        </div>

        {/* Axis lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: "var(--color-border)" }} />

        {/* Dots */}
        {plotted.map((occ) => {
          const x = occ.compositeScore; // 0-100 maps to left-right
          const yBase = occ.aiComplementarity === "high" ? 25 : 75; // top half vs bottom half
          // Add jitter within the half to avoid overlap
          const jitter = ((parseInt(occ.nocCode, 10) % 40) - 20) * 0.5;
          const y = Math.max(5, Math.min(95, yBase + jitter));
          const isSelected = occ.nocCode === selectedNocCode;
          const tierColor =
            occ.riskTier === "high" ? "var(--color-risk-high)"
            : occ.riskTier === "medium" ? "var(--color-risk-medium)"
            : "var(--color-risk-low)";

          return (
            <button
              key={occ.nocCode}
              onClick={() => onSelect(occ.nocCode)}
              title={`${occ.shortTitle} (${occ.compositeScore})`}
              className="absolute rounded-full transition-all duration-200 z-10"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                width: isSelected ? 14 : 8,
                height: isSelected ? 14 : 8,
                backgroundColor: tierColor,
                border: isSelected ? "2px solid var(--color-navy)" : "1px solid rgba(255,255,255,0.6)",
                boxShadow: isSelected ? "0 0 0 3px rgba(11, 25, 41, 0.2)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Axis labels */}
      <div className="flex justify-between mt-1 text-[0.55rem]" style={{ color: "var(--color-text-tertiary)" }}>
        <span>← Lower exposure</span>
        <span>Higher exposure →</span>
      </div>

      {/* Source */}
      <p className="text-[0.5rem] mt-2" style={{ color: "var(--color-text-tertiary)" }}>
        Framework: FSC exposure-complementarity model (building on IMF methodology by Pizzinelli et al.).{" "}
        <em>Right Brain, Left Brain, AI Brain</em> (The Dais, 2025)
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Conditionally render quadrant or cards**

Wrap the existing card grid in a condition. Where the card grid currently renders (the `<div className="grid ...">` with occupation cards), wrap it:

```tsx
{viewMode === "quadrant" ? (
  <ComplementarityQuadrant
    occupations={filtered}
    selectedNocCode={selectedNocCode}
    onSelect={setSelectedNocCode}
  />
) : (
  /* existing card grid JSX stays here */
)}
```

The card grid always remains the default. On mobile (<640px), the quadrant toggle button is hidden (`hidden sm:flex`), so only cards show.

**Note:** The spec mentions "scrolls to/highlights the corresponding card in the card grid" on dot click. Since views are exclusive (quadrant OR cards), clicking a dot instead updates `selectedNocCode` which opens the right-side detail panel — a functionally equivalent interaction. Scroll-to-card is not applicable when the card grid is not rendered.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 6: Commit**

```bash
git add src/app/occupation/OccupationClient.tsx
git commit -m "feat: add complementarity quadrant view to occupation page

2x2 scatter plot showing occupations by exposure (x) and AI
complementarity (y). Toggle between card and quadrant views.
Hidden on mobile. Source: FSC/IMF framework."
```

---

### Task 7: Research Synthesis Page (`/policy`)

**Files:**
- Create: `src/app/policy/page.tsx`
- Modify: `src/lib/nav.ts` (add "Research" link)

- [ ] **Step 1: Add nav link**

In `src/lib/nav.ts`, add before the "About" entry:

```typescript
  { href: "/policy",          label: "Research" },
```

So the array becomes:
```typescript
export const NAV_LINKS = [
  { href: "/calculator",       label: "Calculator" },
  { href: "/explorer",         label: "Explorer" },
  { href: "/occupation",       label: "Occupations" },
  { href: "/scenarios",        label: "Scenarios" },
  { href: "/heatmap",          label: "Heatmap" },
  { href: "/threat-simulator", label: "Threat Model" },
  { href: "/policy",           label: "Research" },
  { href: "/about",            label: "About" },
] as const;
```

- [ ] **Step 2: Create the policy page**

Create `src/app/policy/page.tsx` as a Server Component. This is a long static page following the About page pattern. The full content is specified in the design spec sections 1-6. Key requirements:

- Every statistic has an inline source attribution
- All source URLs are clickable `<a>` links with `target="_blank" rel="noopener noreferrer"`
- Uses the same design tokens as the About page: `h2` with `border-b`, `text-sm text-secondary` body, section spacing via `mt-10`
- Includes the exploratory notice callout
- Ends with a full bibliography table (all 5 sources S1-S5 plus existing site sources)
- Footer CTA links to `/calculator`
- Metadata: `title: "Research Context"`, description summarizing the page

The page is entirely static prose — no client components, no data fetching.

Refer to the spec `docs/superpowers/specs/2026-04-07-fsc-policy-research-integration-design.md` sections "Tier 3F" for exact section headings, content, and stat attributions.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Clean build with new `/policy` route.

- [ ] **Step 4: Commit**

```bash
git add src/lib/nav.ts src/app/policy/page.tsx
git commit -m "feat: add /policy research synthesis page

Static page synthesizing FSC, Conference Board, and Policy Exchange
research on AI workforce disruption, applied to Manitoba. Includes
Canadian stats, J-curve timeline, job growth/decline data, skills
revaluation thesis, and policy recommendations. Full bibliography."
```

---

### Task 8: Final Verification

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: Clean build, all routes present including `/policy`.

- [ ] **Step 2: Grep verification**

Verify no source references are missing attribution:

```bash
grep -r "FSC" src/app --include="*.tsx" -l
grep -r "Conference Board" src/app --include="*.tsx" -l
grep -r "Policy Exchange" src/app --include="*.tsx" -l
```

Expected: Matches in `ResultsClient.tsx`, `OccupationClient.tsx`, `about/page.tsx`, `policy/page.tsx`.

- [ ] **Step 3: Mobile check**

Verify quadrant toggle is hidden on mobile:
```bash
grep "hidden sm:flex" src/app/occupation/OccupationClient.tsx
```

Expected: Match found for the view toggle buttons.

- [ ] **Step 4: Commit (if any fixes needed)**

Only if verification reveals issues. Otherwise, no commit needed.
