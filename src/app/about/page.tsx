import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & Methodology",
  description:
    "How the Manitoba AI Disruption Explorer calculates composite risk scores — data sources, formula, limitations, and methodology decisions.",
};

const DATA_SOURCES = [
  {
    source: "Frey & Osborne (2013)",
    description:
      "702 US occupations rated for automation probability using a Gaussian process classifier. The foundational dataset for occupation-level automation risk.",
    vintage: "2013",
    url: "https://www.oxfordmartin.ox.ac.uk/downloads/academic/The_Future_of_Employment.pdf",
  },
  {
    source: "Felten, Raj & Seamans — AIOE Index",
    description:
      "AI Occupational Exposure index linking AI patent applications to O*NET occupational task descriptions. Captures AI-specific exposure, distinct from general automation.",
    vintage: "2021",
    url: "https://github.com/feltenmark/AIOE",
  },
  {
    source: "Eloundou et al. (2023) — GPTs are GPTs",
    description:
      "Occupation-level LLM exposure dataset published by OpenAI researchers. Human-annotated beta scores (0–1) covering 923 O*NET-SOC occupations, mapped to Canadian NOC codes via the Brookfield Institute crosswalk. The human_rating_beta column — direct LLM substitution plus half-weight tool-augmentation exposure — is used as the llmExposure component.",
    vintage: "2023",
    url: "https://github.com/openai/GPTs-are-GPTs",
  },
  {
    source: "Brookfield Institute NOC Crosswalk",
    description:
      "Maps US SOC occupation codes to Canadian NOC 2021 codes. Required because Frey & Osborne and AIOE use SOC; Canadian employment data uses NOC.",
    vintage: "2019–2021",
    url: "https://brookfieldinstitute.ca",
  },
  {
    source: "Statistics Canada — Census 2021",
    description:
      "Manitoba employment counts by NOC occupation. The primary source for how many Manitobans work in each occupation.",
    vintage: "2021",
    url: "https://www12.statcan.gc.ca/census-recensement/2021/",
  },
  {
    source: "Statistics Canada — Canadian Survey on Business Conditions (CSBC)",
    description:
      "Provincial AI adoption rates by industry sector. Table 33-10-0825-01 provides Manitoba-specific AI adoption figures, showing Manitoba at approximately 2% — significantly below the national average of 12% as of Q2 2025. Used for the industryAdoptionGap component.",
    vintage: "Q2 2024–Q2 2025",
    url: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3310082501",
  },
  {
    source: "Manitoba Bureau of Statistics — GDP by Industry",
    description:
      "Manitoba GDP shares by NAICS sector. Provides the economic weight context alongside employment counts.",
    vintage: "2022–23",
    url: "https://www.gov.mb.ca/mbs/",
  },
  {
    source: "Anthropic Economic Index (2026)",
    description:
      "Tracks actual Claude usage patterns across occupations, sampled from real interactions (Feb 5-12, 2026). Unlike the other sources which measure theoretical AI capability, this index measures what AI is doing in practice — based on 94GB of Claude conversation data categorized by the Clio privacy-preserving analysis tool. Displayed as supplementary context in occupation detail panels; not included in the composite score formula due to SOC major-group granularity (22 groups vs. 923 individual occupations in the other datasets).",
    vintage: "Q1 2026 (quarterly updates)",
    url: "https://huggingface.co/datasets/Anthropic/EconomicIndex",
  },
  {
    source: "Remote Labor Index — remotelabor.ai (2025)",
    description:
      "Benchmarks actual autonomous AI agent performance on 240 real paid freelance projects across 23 Upwork skill categories, tested with 358 freelancers. Measures what frontier AI agents actually complete end-to-end today (0.83%–4.17%), providing real-world calibration for the theoretical exposure scores in this tool. Used as a contextual callout in calculator results to ground the gap between capability and deployment. Not incorporated into the composite score formula.",
    vintage: "Feb–Mar 2025",
    url: "https://www.remotelabor.ai/",
  },
  {
    source: "OpenAI — Industrial Policy for the Intelligence Age (2026)",
    description:
      "Policy paper projecting that AI infrastructure buildout (data centres, power grids, cooling systems) will require approximately 20% more skilled trades workers — electricians, mechanics, ironworkers, carpenters, plumbers — than currently exist. Used as a counter-exposure signal on trades occupations in the explorer: low AI displacement risk combined with rising infrastructure demand. Not a research dataset; cited as a policy reference only.",
    vintage: "April 2026",
    url: "https://openai.com/index/industrial-policy-for-the-intelligence-age/",
  },
  {
    source: "MIT Project Iceberg (2024)",
    description:
      "Maps 13,000+ deployed AI tools against 32,000+ skills across 923 O*NET occupations (151 million workers) to produce an Iceberg Index: the percentage of an occupation's wage value where AI has demonstrated capability. Key finding: visible tech-sector disruption is just 2.2% of the U.S. labour market's wage value, while hidden white-collar and administrative exposure is 11.7% — five times larger and geographically distributed across all states. Referenced as a methodological context source; not incorporated into composite scores because occupation-level Index values are not published as a downloadable dataset.",
    vintage: "2024",
    url: "https://iceberg.mit.edu/",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <li>
            <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--color-text-primary)]">About &amp; Methodology</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
        About &amp; Methodology
      </h1>
      <p className="mt-3 text-[var(--color-text-secondary)] leading-relaxed">
        This page explains how the Manitoba AI Disruption Explorer calculates composite
        risk exposure scores, where the data comes from, what the scores mean, and what
        they cannot tell you.
      </p>

      {/* Exploratory notice */}
      <div
        className="mt-6 mb-8 p-4 rounded-lg text-sm leading-relaxed"
        style={{
          backgroundColor: "rgba(217, 119, 6, 0.08)",
          border: "1px solid rgba(217, 119, 6, 0.25)",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--color-gold)" }}>
          Exploratory research tool
        </p>
        <p style={{ color: "var(--color-text-secondary)" }}>
          This site is an independent, exploratory project. Risk scores are modelled estimates derived
          from peer-reviewed academic datasets — not predictions, and not professional employment, legal,
          or business advice. See{" "}
          <a href="/terms" className="underline" style={{ color: "var(--color-gold)" }}>
            Terms of Use
          </a>{" "}
          for full disclaimers.
        </p>
      </div>

      {/* Overview */}
      <section className="mt-10" aria-labelledby="overview-heading">
        <h2
          id="overview-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Overview
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            The Manitoba AI Disruption Explorer is an independent research tool built to
            help Manitoba business owners, workers, and policymakers understand the
            relative AI disruption exposure of industries and occupations in the province.
          </p>
          <p>
            The tool synthesizes four peer-reviewed or publicly available datasets into a
            single composite score for each occupation and sector. Scores are
            pre-computed at build time and stored as static data — no AI or LLM is
            involved in generating scores at runtime.
          </p>
          <p>
            Manitoba was chosen because it has a distinctive economic profile — large
            insurance and financial services sector headquartered in Winnipeg, significant
            aerospace manufacturing, a large public sector, and an agricultural economy —
            that creates an interesting cross-section of AI disruption risk profiles.
          </p>
        </div>
      </section>

      {/* Data Sources */}
      <section className="mt-10" aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Data Sources
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-primary)] w-56">
                  Source
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-primary)]">
                  Description
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-primary)] w-20">
                  Vintage
                </th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map((row) => (
                <tr
                  key={row.source}
                  className="border-b border-[var(--color-border)] last:border-0 align-top"
                >
                  <td className="py-3 pr-4 text-[var(--color-text-primary)] font-medium">
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      {row.source}
                    </a>
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-text-secondary)] leading-relaxed">
                    {row.description}
                  </td>
                  <td className="py-3 text-[var(--color-text-secondary)]">
                    {row.vintage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Score Formula */}
      <section className="mt-10" aria-labelledby="formula-heading">
        <h2
          id="formula-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Score Formula
        </h2>

        <div className="mt-4 rounded border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-4 font-mono text-sm text-[var(--color-text-primary)] space-y-1 overflow-x-auto">
          <p>compositeScore =</p>
          <p className="pl-6">(freyOsborne × 0.30)</p>
          <p className="pl-4">+ (aioe × 0.30)</p>
          <p className="pl-4">+ (llmExposure × 0.25)</p>
          <p className="pl-4">+ (industryAdoptionGap × 0.15)</p>
          <p className="mt-3">adjustedScore =</p>
          <p className="pl-6">compositeScore × sizeMultiplier × adoptionModifier</p>
        </div>

        <div className="mt-4 space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <div>
            <strong className="text-[var(--color-text-primary)]">freyOsborne (weight: 30%)</strong>
            <p className="mt-1">
              The Frey &amp; Osborne (2013) automation probability for the closest
              matching occupation, converted to a 0–100 scale. Reflects the probability
              that an occupation&rsquo;s tasks could be automated by computerisation
              over roughly a 10–20 year horizon.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">aioe (weight: 30%)</strong>
            <p className="mt-1">
              The Felten-Raj-Seamans AI Occupational Exposure index, normalized to 0–100.
              Measures how much of an occupation&rsquo;s task content corresponds to
              capabilities demonstrated in recent AI patent applications. More
              AI-specific than Frey &amp; Osborne.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">llmExposure (weight: 25%)</strong>
            <p className="mt-1">
              The human-annotated <code className="text-xs bg-[var(--color-surface-muted)] px-1 py-0.5 rounded">human_rating_beta</code> score
              from the Eloundou et al. (2023) published dataset, normalised to 0–100.
              Measures the fraction of an occupation&rsquo;s tasks exposed to direct LLM
              substitution (E1) plus half-weight tool-augmented exposure (E2). Covers 923
              O*NET-SOC occupations; mapped to Canadian NOC codes via the Brookfield
              Institute crosswalk.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">industryAdoptionGap (weight: 15%)</strong>
            <p className="mt-1">
              The gap between maximum possible AI adoption (100%) and the sector&rsquo;s
              current adoption rate. A high gap means the sector has not yet adopted AI
              broadly, indicating that AI-driven disruption is ahead of, not behind, the
              current workforce.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded border border-[var(--color-border)] px-5 py-4 text-sm space-y-3">
          <p className="font-medium text-[var(--color-text-primary)]">Business size modifiers</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[var(--color-text-secondary)] font-mono">
            <span>Micro (&lt;5 employees)</span><span>× 1.10</span>
            <span>Small (5–49)</span><span>× 1.00</span>
            <span>Medium (50–199)</span><span>× 0.95</span>
            <span>Large (200+)</span><span>× 0.90</span>
          </div>
          <p className="font-medium text-[var(--color-text-primary)] mt-2">AI adoption modifiers</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[var(--color-text-secondary)] font-mono">
            <span>Already using AI</span><span>× 0.70</span>
            <span>Exploring AI tools</span><span>× 0.85</span>
            <span>Not considering AI</span><span>× 1.00</span>
          </div>
        </div>

        <div className="mt-4 rounded border border-[var(--color-border)] px-5 py-4 text-sm space-y-1">
          <p className="font-medium text-[var(--color-text-primary)]">Risk tier thresholds</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[var(--color-text-secondary)] font-mono mt-2">
            <span className="text-[var(--color-risk-low)]">Low exposure</span>
            <span>Score &lt; 35</span>
            <span className="text-[var(--color-risk-medium)]">Medium exposure</span>
            <span>35 ≤ Score ≤ 65</span>
            <span className="text-[var(--color-risk-high)]">High exposure</span>
            <span>Score &gt; 65</span>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="mt-10" aria-labelledby="limitations-heading">
        <h2
          id="limitations-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Limitations
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-[var(--color-text-primary)]">
              Frey &amp; Osborne predates LLMs.
            </strong>{" "}
            The 2013 paper was written before GPT, diffusion models, and modern generative
            AI existed. It likely underestimates disruption risk for knowledge-work
            occupations. We partially compensate with the llmExposure component, but the
            underlying dataset remains a product of its era.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">
              National AI adoption rates used as Manitoba proxy.
            </strong>{" "}
            No province-specific AI adoption survey exists. Manitoba may lag national
            averages in some sectors (particularly due to firm size distribution and
            distance from technology hubs) or lead in others (aerospace).
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">
              Composite scores are relative, not predictive.
            </strong>{" "}
            A score of 72 does not mean 72% of jobs in that sector will be lost. It means
            that sector scores in the 72nd percentile of AI disruption exposure relative
            to others. Actual employment outcomes depend on labour market conditions,
            regulation, adoption rates, and adaptation.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">
              O*NET-to-NOC crosswalk covers 45 of 49 occupations directly.
            </strong>{" "}
            Four occupations (College Instructors, Biological Scientists, Equipment
            Assemblers, Shelf Stockers) use averaged scores from the nearest O*NET
            category groupings rather than a single exact match. Their{" "}
            <code className="text-xs bg-[var(--color-surface-muted)] px-1 py-0.5 rounded">scoreConfidence</code>{" "}
            is still marked &ldquo;published&rdquo; as the underlying scores are real data,
            but the crosswalk introduces slightly more noise for these occupations.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">
              SOC-to-NOC crosswalk introduces noise.
            </strong>{" "}
            Frey &amp; Osborne and AIOE use US Standard Occupational Classification
            codes. The Brookfield Institute crosswalk maps these to Canadian NOC codes,
            but the mapping is not always one-to-one. Some NOC occupations combine
            multiple SOC categories; scores for these are averaged.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">
              Small-sector estimates carry higher uncertainty.
            </strong>{" "}
            Sectors with fewer than 10,000 Manitoba employees (e.g., Mining &amp; Oil,
            Corporate Management) have fewer reference occupations, making sector-level
            score aggregation noisier.
          </li>
          <li>
            <strong>Anthropic Economic Index data is at the SOC major-group level</strong> — all occupations within a group (e.g., all &ldquo;Computer and Mathematical&rdquo; occupations) receive the same usage intensity value. Shown as supplementary context only; not incorporated into composite scores.
          </li>
          <li>
            <strong>Remote Labor Index reflects a point-in-time snapshot.</strong>{" "}
            The 0.83%–4.17% autonomous completion range is from a Feb–Mar 2025 benchmark
            across 23 Upwork categories. AI agent capability is improving rapidly; this
            figure should be treated as a lower-bound calibration anchor, not a permanent
            ceiling.
          </li>
          <li>
            <strong>MIT Iceberg occupation scores are not yet incorporated.</strong>{" "}
            The Iceberg Index covers 923 O*NET occupations using 32,000+ skills mapped against
            13,000+ deployed AI tools. Its key insight — that visible tech disruption (2.2% of
            wage value) is dwarfed by hidden white-collar exposure (11.7%) — is referenced in
            the methodology but individual occupation Index values are not published as a
            downloadable dataset, so they cannot be added to the composite score formula.
          </li>
        </ul>
      </section>

      {/* Methodology decisions */}
      <section className="mt-10" aria-labelledby="decisions-heading">
        <h2
          id="decisions-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Methodology Decisions
        </h2>
        <div className="mt-4 space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <div>
            <strong className="text-[var(--color-text-primary)]">
              Why four components?
            </strong>
            <p className="mt-1">
              Each component captures a different dimension of AI-related risk. Frey &amp;
              Osborne measures task routineness. AIOE measures demonstrated AI capability
              overlap. LLM exposure captures the generative AI wave specifically. The
              adoption gap captures timing — a sector with high exposure but low current
              adoption is at acute near-term risk, not just theoretical risk.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">
              Why these weights (30/30/25/15)?
            </strong>
            <p className="mt-1">
              Frey &amp; Osborne and AIOE are given equal weight as the two most
              established academic measures. LLM exposure is weighted slightly lower
              because the scores are estimated rather than published. Adoption gap is
              weighted lowest because it is a sector-level proxy rather than an
              occupation-specific measure.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">
              Why are business size modifiers applied after the composite?
            </strong>
            <p className="mt-1">
              Micro-businesses (&lt;5 employees) tend to have less access to AI tools and
              less organizational capacity to manage AI transitions, increasing their
              effective risk. Large businesses have more resources to adapt and to absorb
              workforce changes, reducing their effective risk. These modifiers adjust the
              composite score to reflect business context without changing the underlying
              occupational data.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">
              Why is &ldquo;already using AI&rdquo; a 0.70 modifier?
            </strong>
            <p className="mt-1">
              Businesses already using AI tools have de facto begun their transition.
              Their effective exposure to disruption from AI adoption is lower because
              they are driving the change rather than being surprised by it. The 30%
              reduction reflects this first-mover advantage, not immunity.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">
              Capability vs. deployment gap
            </strong>
            <p className="mt-1">
              All four composite score components measure theoretical AI capability exposure —
              what AI <em>could</em> automate, based on task and skill overlap. Real-world
              deployment lags significantly behind theoretical capability. The Remote Labor
              Index (2025) found that frontier AI agents complete just 0.83%–4.17% of
              complex professional projects end-to-end without human intervention. The
              composite scores in this tool reflect the destination of the disruption curve,
              not its current position. The cost convergence charts in the calculator
              results are explicitly modelled as a 24-month trajectory, not an instantaneous
              shift.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">
              The &ldquo;iceberg&rdquo; framing: visible vs. hidden exposure
            </strong>
            <p className="mt-1">
              MIT Project Iceberg (2024) found that visible tech-sector AI disruption
              represents just 2.2% of total U.S. labour market wage value — while hidden
              white-collar and administrative exposure is 11.7%, five times larger, spread
              across manufacturing, financial services, logistics, and healthcare administration
              in every state. This tool&apos;s occupation and industry scores capture both
              the visible layer (software, engineering, creative roles) and the larger hidden
              layer (administrative, coordination, office support). The Iceberg research was
              independently validated against the Anthropic Economic Index with 69% geographic
              agreement and 85% accuracy in predicting occupational transitions.
            </p>
          </div>
          <div>
            <strong className="text-[var(--color-text-primary)]">
              Why the Anthropic Economic Index is display-only
            </strong>
            <p className="mt-1">
              The Anthropic Economic Index (March 2026) measures actual Claude usage patterns
              across 22 SOC major occupational groups — a 2026-vintage real-world signal.
              Adding it to the composite formula at 15–25% weight would flatten
              within-group differentiation: Software Developers and Network Technicians
              would both become &ldquo;Computer and Mathematical = same score,&rdquo; which is
              methodologically dishonest for a precision tool. It is shown as supplementary
              context in occupation detail panels instead, with a note about the
              group-level granularity.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-10" aria-labelledby="contact-heading">
        <h2
          id="contact-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Flag a Data Issue
        </h2>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          If you notice an occupation score that appears incorrect, a Manitoba employer
          missing from a sector, or a data source that has been updated since our vintage
          year, please open an issue on the project repository or contact the maintainer
          directly. We prioritize corrections that affect high-employment occupations or
          flagship Manitoba sectors.
        </p>
      </section>

      {/* Back to top */}
      <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
        <Link
          href="/"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
