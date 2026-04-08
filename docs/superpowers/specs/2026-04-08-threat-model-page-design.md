# Threat Model Page Design Spec
**Date:** 2026-04-08  
**Status:** Approved for implementation  
**URL:** `/threat-model`  
**File to create:** `src/app/threat-model/page.tsx`

---

## 1. Purpose and Context

The site's nav already contains a "Threat Model" link that currently points nowhere useful. This spec defines a long-form, research-backed page that explains *how* AI-native startups structurally outcompete traditional businesses — grounded in real company examples, independently verifiable data, and Manitoba-specific context.

**Relationship to existing pages:**
- `/threat-simulator` — stays as-is. It's the quick "see the numbers" tool (side-by-side team/cost comparisons). `/threat-model` is the "understand why" deep read. Each page links to the other.
- `/policy` — the existing research synthesis page. `/threat-model` can cross-link to it.
- `/calculator` — primary CTA at bottom of `/threat-model`.
- `/scenarios` — secondary CTA.

**Primary audience:** Manitoba small business owners and operators. Most will not know what "LLM inference costs" means. Everything must be in plain language — mechanisms explained first in plain English, then evidence, then local relevance.

---

## 2. Page Type and Architecture

**Type:** Next.js 15 Server Component (static, no data fetching)  
**All content is hard-coded prose** — no JSON data files, no dynamic queries  
**Build output:** One additional static route (`/threat-model`)

The page is **entirely self-contained** — no new shared components, no changes to existing pages except adding cross-links from `/threat-simulator` and optionally `/policy`.

---

## 3. Page Structure (top to bottom)

### 3.1 Hero Section
- Dark navy background (matches site header aesthetic)
- Eyebrow: `THREAT MODEL · 5 MECHANISMS · RESEARCH-BACKED`
- H1: "5 ways AI startups outcompete established businesses"
- Subheading: "A lean AI-native startup can now deliver more output, faster, at a fraction of the cost. Here's the research on exactly how — and what it means for Manitoba."
- One credibility stat callout: "LLM costs fell 280× in 2.5 years — the economic foundation of every mechanism on this page." (Source: Epoch AI / CloudZero)
- Breadcrumb nav: Home / Threat Model

### 3.2 Five Mechanism Sections (the backbone)
Each section follows a consistent template:

```
[Colour-coded number badge] — [Mechanism name]
Plain-English one-liner definition
────────────────────────────
[Stat callout box] — headline number, 1-line explanation, source
[Evidence paragraph] — 1-2 real company examples with actual numbers
[Mechanism explanation] — why this works structurally (2-3 sentences)
[Manitoba relevance] — which local sectors face this specific attack
[What to watch for] — one concrete signal a business owner can act on
```

#### Mechanism 01 — Price Floor Collapse
**Colour:** Red (`#DC2626`)  
**Definition:** "AI drops the cost of routine cognitive work to near zero. Tasks that required a $50/hour professional now cost fractions of a cent to automate."

**Stat callout:** LLM inference costs fell 280× in 2.5 years (2022–2025). Source: Epoch AI, CloudZero 2025 State of AI Costs. This is independently verified infrastructure pricing data — the most credible number on the page.

**Evidence — Klarna (two-act story, both acts required):**
- Act 1 (Feb 2024): AI assistant handled 2.3 million conversations in first month — equivalent workload of 700 full-time agents. Resolution time fell from 11 minutes to under 2 minutes. Projected $40M profit improvement. Source: Klarna press release, Feb 27 2024.
- Act 2 (May 2025): Customer satisfaction dropped 22%. CEO Sebastian Siemiatkowski: "cost unfortunately seems to have been a too predominant evaluation factor." Company began rehiring human agents. Source: Bloomberg, Fortune, CX Dive.
- **The conclusion:** Pure AI replacement failed — but Klarna's per-transaction customer service cost still dropped 40% (from $0.32 to $0.19). The hybrid model won. The business that ignores AI entirely loses to the hybrid firm on price.

**Manitoba sectors:** Legal, accounting, marketing agencies, customer support, bookkeeping.

**What to watch for:** A competitor quoting significantly lower rates for the same scope of work, or a new entrant offering flat-fee pricing where hourly was the norm.

---

#### Mechanism 02 — Speed Arbitrage
**Colour:** Amber (`#D97706`)  
**Definition:** "AI compresses delivery time from days or hours to minutes. The first firm to deliver gets the work."

**Stat callout:** Legal AI adoption jumped from 19% to 79% in a single year (2023→2024). Source: Clio 2024 Legal Trends Report (large-sample annual survey, high credibility).

**Evidence:**
- LegalFly: Contract review from 2 hours to 15 minutes (customer testimonial).
- LegalOn customers: 70–85% time savings on contract review (aggregated customer data).
- Aviva Insurance: Liability assessment cut by 23 days, routing accuracy +30%, customer complaints -65%, total savings £60M+ in 2024. Source: multiple news outlets — independently reported.
- Clio 2024: 74% of billable legal hours identified as potentially automatable by AI.

**Mechanism explanation:** Speed is a competitive differentiator independent of price. A client choosing between a firm that delivers contract review in 15 minutes vs. 2 days will choose speed — even at equal price. Once AI-native competitors set speed expectations, slower traditional delivery feels like a deficiency.

**Manitoba sectors:** Legal, professional services, insurance, real estate services.

**What to watch for:** Clients beginning to ask "how quickly can you turn this around?" as a primary question, or AI-augmented firms quoting same-day turnaround for work that traditionally takes days.

---

#### Mechanism 03 — Scale Without Headcount
**Colour:** Purple (`#7C3AED`)  
**Definition:** "AI-native firms grow output without growing their team. Traditional firms that must hire to scale are structurally disadvantaged."

**Stat callout:** Midjourney: ~40 employees, $300M revenue = $7.5M revenue per employee. For reference: Google averages ~$1.8M/employee. Source: Sacra, multiple outlets, 2024. Note: this is an AI product company, not a service firm — used here to illustrate the structural ceiling shift.

**Evidence:**
- 14.ai (Y Combinator, 2026): 6-person team running 24/7 customer support for multiple startups simultaneously. Source: TechCrunch, March 2026.
- Andreessen Horowitz "Unbundling the BPO" (2024): Named AI-native disruptors achieving 80%+ first-contact resolution rates on customer support — at staffing fractions of traditional BPO firms.
- Standard SaaS benchmark: $300K revenue per employee considered gold standard. Leading AI-native service firms are 3–10x above this.

**Note on the "3-person team doing work of 20" claim:** This formulation is common in VC/founder media but is not rigorously documented in peer-reviewed research. Use the revenue-per-employee data instead — it's independently verifiable and directionally consistent.

**Manitoba sectors:** Marketing agencies, bookkeeping firms, administrative support, customer support / BPO, freight brokerage.

**What to watch for:** A competitor that hasn't visibly hired growing their client base or output significantly. Or a new entrant with a very small listed team serving clients at scale.

---

#### Mechanism 04 — Junior Work at AI Quality
**Colour:** Teal (`#0891B2`)  
**Definition:** "AI now handles the structured, routine work that junior staff were hired to do — at comparable quality, instantly, without training or turnover."

**Stat callout:** 31% of Canadian workers are in jobs with high AI exposure and low complementarity — the most at-risk category. Source: Statistics Canada experimental estimates, Mehdi & Morissette, 2024. (Government statistical agency — highest credibility.)

**Evidence:**
- Casetext Co-Counsel: Described as "roughly the quality of an entry-level associate" for legal research. Source: Association of Corporate Counsel.
- Harvey AI: Matched human baseline (80.2%) on legal chronology generation tasks. Source: Harvey published benchmarks.
- Decagon: 80%+ first-contact resolution on customer support tickets. Source: a16z case study.
- Camber (healthcare claims): 80% fewer first-submission denials. Source: a16z case study.
- ABA 2024 caveat: 74.7% of legal respondents cite accuracy as a major concern. AI hallucinates citations and misapplies jurisdiction-specific standards. Human oversight required for final judgment.

**Framing:** The bar for disruption is not "AI replaces the senior partner." It's "AI replaces the junior bookkeeper's routine reconciliation work, the paralegal's first-pass research, the junior copywriter's first draft." Those are the roles that make small local service firms scalable — and they're directly in the AI crosshairs.

**Manitoba sectors:** Bookkeeping and accounting firms, law offices (paralegal work), marketing agencies (junior copywriters), administrative support, data entry and processing.

**What to watch for:** Clients doing their own first-pass research or drafting before bringing it to you — and asking you to review/improve rather than create from scratch. The value-add shifts up the stack.

---

#### Mechanism 05 — Always-On, No Overhead
**Colour:** Green (`#059669`)  
**Definition:** "An AI-native competitor is available 24 hours a day, in any language, with no sick days, overtime, or turnover — at the same cost as business hours."

**Stat callout:** Only 15% of companies previously provided true 24/7 support. Gartner forecasts $80B reduction in contact centre labour costs by 2026 from AI. Source: Gartner (via multiple outlets).

**Evidence:**
- Emma Finance case study: 1 human agent + AI handling Tier 1 overnight. Result: 124% increase in monthly support interactions, doubled customer base. Period: Feb–Oct 2025. Source: DevRev case study.
- Avoca (home services): AI voice agent handles after-hours and overflow calls for HVAC/plumbing/electrical businesses — books appointments, answers pricing questions, dispatches jobs end-to-end without human involvement.
- Klarna AI (again): Live in 23 markets, 24/7, across 35+ languages — structurally impossible with human staffing.
- 14.ai: Runs overnight support for multiple clients simultaneously.

**Manitoba context:** A Winnipeg accounting firm competing against an AI-native bookkeeping service that answers client queries at 11pm is not competing on office hours anymore. The comparison isn't "my staff vs. their staff." It's "my office hours vs. their machine that never closes."

**What to watch for:** Client expectations shifting to same-day or after-hours response as normal. Losing a client who mentions response time as a factor.

---

### 3.3 What This Means for Manitoba
**Standalone section after the 5 mechanisms.**

Three sub-components:

**The numbers (Stats Canada anchor):**
- 12% of Canadian firms now use AI — doubled year-over-year (Stats Canada, 2024–25 quarterly survey)
- Professional services (31.7%) and finance (30.6%) are the #2 and #3 sectors by AI adoption — the exact sectors competing with Manitoba's local service firms
- 57.4% of Canadian jobs classified as highly AI-exposed (Future Skills Centre, Sept 2025)
- CFIB: AI saves Canadian SMEs 1+ hour/day; returns $1.60 per dollar invested — the opportunity side of the same coin

**The Canadian company signal:**
- Spellbook (Ottawa): 4,000+ legal teams, $350M valuation, partnered with the Canadian Bar Association. The bar association is institutionalising AI legal tools. Not a fringe trend. Not American. Already inside Canadian legal practice.
- Manitoba Chambers of Commerce + Province of Manitoba: $2M joint program (Manitoba AI Pathways) to help local SMEs adopt AI. The province is already responding.
- Canadian Chamber of Commerce warning (2025–26): "Canada risks falling behind on AI adoption as businesses wait out trade uncertainty."

**The honest framing (important nuance):**
Stats Canada shows only 6% of AI-adopting Canadian firms have reduced headcount so far. The disruption isn't arriving as mass layoffs — it's arriving as margin compression and pricing pressure. Klarna's per-transaction cost fell 40% before they rehired anyone. The Clio data shows legal billing models are already shifting (flat-fee billing up 34% since 2016). The warning for a Manitoba small business owner is not "you will lose your job." It's: "a competitor using AI can undercut your price and still profit — and that window is opening now."

### 3.4 CTA Strip
Three cards:
1. **"See the cost numbers"** → `/threat-simulator` — "Side-by-side: what a 3-person AI-native team can do vs. a 20-person traditional operation"
2. **"Get your business's risk score"** → `/calculator` — "6 questions, 2 minutes. Personalised AI disruption assessment for your industry and size."
3. **"Read the full research"** → `/policy` — "Academic sources, methodology, and the Canadian policy context behind these findings."

---

## 4. Design and Styling

**Follows existing site design system exactly.** No new CSS variables, no new design tokens.

- Hero: `var(--color-navy-deep)` background, amber accent stripe, gold eyebrow text
- Mechanism sections: Alternating `var(--color-paper)` / `var(--color-paper-deep)` backgrounds for visual separation
- Colour-coded number badges: Each mechanism has its assigned colour (red, amber, purple, teal, green) used for the number badge and left-border accent only — body text stays in standard colours
- Stat callout boxes: Amber-tinted (`rgba(217, 119, 6, 0.08)`) with gold left border — same pattern as existing callouts on `/policy` and calculator results
- "What to watch for" boxes: Subtle surface treatment, no colour — neutral signal
- Source attributions: Small tertiary text, same pattern as existing source citations across the site

**Typography:** No new font styles. Uses existing `font-display` (Fraunces) for headings, `font-instrument` (Instrument Sans) for body text — matching the Tailwind utility classes configured in `layout.tsx`.

---

## 5. Content Credibility Approach

Each piece of evidence is labelled by credibility tier in the prose:
- **High credibility:** Stats Canada, Epoch AI cost data, Clio annual survey, Aviva (independently reported), Klarna press release (with the reversal noted)
- **Medium credibility:** Company case studies (Ironclad, LegalFly) — noted as vendor/customer claims, treated as directional
- **Low credibility:** The "3-person team does work of 20" claim — **not used as a citation**; replaced with the revenue-per-employee data which is independently verifiable

The Klarna two-act story is used deliberately to demonstrate editorial honesty — the page acknowledges when AI deployment failed, which makes the overall argument more credible, not less.

---

## 6. Files Changed

| File | Action | Detail |
|------|---------|--------|
| `src/app/threat-model/page.tsx` | **Create** | Full static Server Component — all content inline |
| `src/app/threat-simulator/ThreatSimulatorClient.tsx` | **Minor edit** | Add "Read the research behind this →" link to `/threat-model` at bottom of page |
| `src/lib/nav.ts` | **Edit** | Change existing `{ href: "/threat-simulator", label: "Threat Model" }` entry to `{ href: "/threat-model", label: "Threat Model" }`. Add a second entry `{ href: "/threat-simulator", label: "Threat Simulator" }` immediately after so both pages are accessible from the nav. |

No other files change. No new data files. No new types. No new shared components.

---

## 7. What Does NOT Change

- `/threat-simulator` page — content and structure unchanged (only a link added at bottom)
- All existing data files (`threat-scenarios.json`, `sector-playbooks.json`)
- All existing types in `src/types/index.ts`
- Scoring formula, composite scores, province average
- Nav label text for existing entries (except the `/threat-simulator` label changes from "Threat Model" to "Threat Simulator" per Section 6)

---

## 8. Verification Checklist

1. `npm run build` — clean build, route count increases by 1 (`/threat-model`)
2. `npx tsc --noEmit` — no TypeScript errors
3. `/threat-model` renders all 5 mechanism sections with correct colour coding
4. Stat callout boxes render with amber tint and gold border
5. "What to watch for" boxes appear at end of each section
6. Manitoba section renders with Stats Canada data correctly attributed
7. CTA strip shows 3 cards linking to `/threat-simulator`, `/calculator`, `/policy`
8. `/threat-simulator` shows new "Read the research →" link at bottom
9. All source attributions present and correctly formatted
10. No jargon visible to end user — plain language throughout
11. Mobile layout renders cleanly (single column, no horizontal overflow)
12. Nav bar shows both "Threat Model" (→ `/threat-model`) and "Threat Simulator" (→ `/threat-simulator`) as separate entries
