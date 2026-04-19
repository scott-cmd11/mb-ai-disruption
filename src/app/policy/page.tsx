import type { Metadata } from "next";
import Link from "next/link";
import { RelatedLinks } from "@/components/RelatedLinks";

export const metadata: Metadata = {
  title: "Research Context",
  description:
    "A synthesis of Canadian and international research on AI workforce disruption, applied to Manitoba's economy.",
};

const BIBLIOGRAPHY = [
  {
    source: "Future Skills Centre \u2014 Canada\u2019s Workforce in Transition",
    description:
      "57.4% AI exposure, competing/augmenting classification",
    year: "Sept 2025",
    url: "https://fsc-ccf.ca/wp-content/uploads/2025/09/canadas-workforce-in-transition_sept2025.pdf",
  },
  {
    source:
      "Conference Board of Canada \u2014 Understanding the Influence of AI on Employment",
    description: "Task-level exposure index, J-curve projections",
    year: "Jan 2026",
    url: "https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf",
  },
  {
    source: "The Dais / FSC \u2014 Right Brain, Left Brain, AI Brain",
    description:
      "Exposure-complementarity framework for 506 NOC occupations",
    year: "Jan 2025",
    url: "https://fsc-ccf.ca/wp-content/uploads/2025/01/Right-Brain-Left-Brain-AI-Brain-Report_The-Dais_FSC.pdf",
  },
  {
    source:
      "Future Skills Centre \u2014 Building a Resilient Workforce (Impact Report)",
    description: "Program outcomes, 300+ skills projects",
    year: "2025",
    url: "https://fsc-ccf.ca/wp-content/uploads/2025/08/FSC-Impact-Report-EN-FINAL.pdf",
  },
  {
    source:
      "Policy Exchange \u2014 Government in the Age of Superintelligence",
    description:
      "UK policy perspective, skills revaluation, retraining recommendations",
    year: "2025",
    url: "https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf",
  },
] as const;

export default function PolicyPage() {
  return (
    <>
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <li>
            <Link
              href="/"
              className="hover:text-[var(--color-text-primary)] transition-colors"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--color-text-primary)]">Research Context</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
        What Canadian AI disruption research says
      </h1>
      <p className="mt-3 text-[var(--color-text-secondary)] leading-relaxed">
        A plain-English synthesis of the headline findings from FSC, the Conference
        Board of Canada, The Dais, Policy Exchange, and OpenAI — filtered for what
        actually changes the Manitoba picture.
      </p>

      {/* Exploratory notice */}
      <div
        className="mt-6 mb-6 p-4 rounded-lg text-sm leading-relaxed"
        style={{
          backgroundColor: "rgba(217, 119, 6, 0.08)",
          border: "1px solid rgba(217, 119, 6, 0.25)",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--color-gold)" }}>
          Research synthesis
        </p>
        <p style={{ color: "var(--color-text-secondary)" }}>
          This page synthesizes findings from peer-reviewed and government-funded
          research. It is not policy advice.
        </p>
      </div>

      {/* On this page — jump links */}
      <nav
        aria-label="On this page"
        className="mb-8 p-4 rounded-lg"
        style={{
          backgroundColor: "var(--color-surface-muted)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          className="text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          On this page
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm" role="list">
          {[
            { href: "#canadian-picture-heading", label: "The Canadian picture" },
            { href: "#competing-heading", label: "Competing vs working with AI" },
            { href: "#timeline-heading", label: "Disruption timeline" },
            { href: "#jobs-heading", label: "Jobs that change and grow" },
            { href: "#policy-heading", label: "What policymakers hear" },
            { href: "#sources-heading", label: "Sources" },
          ].map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "var(--color-accent)" }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Section 1: The Canadian picture */}
      <section className="mt-10" aria-labelledby="canadian-picture-heading">
        <h2
          id="canadian-picture-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          The Canadian picture
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            57.4% of Canadian jobs are classified as highly AI-exposed. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2025/09/canadas-workforce-in-transition_sept2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Future Skills Centre, Canada&rsquo;s Workforce in Transition, Sept 2025
            </a>
            )
          </p>
          <p>
            53% of tasks across all occupations are performable by current AI.
            (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Conference Board of Canada, Understanding the Influence of AI on
              Employment, Jan 2026, p.4
            </a>
            )
          </p>
          <p>
            Canadian AI adoption grew from 3.7% (2021) to 6.8% (2023) nationally.
            (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2025/01/Right-Brain-Left-Brain-AI-Brain-Report_The-Dais_FSC.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              The Dais/FSC, Right Brain Left Brain AI Brain, Jan 2025
            </a>
            )
          </p>
          <p>
            Manitoba sits at approximately 2%, significantly below the national
            average. (Source:{" "}
            <a
              href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3310082501"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Statistics Canada CSBC
            </a>
            )
          </p>
          <p>
            Industry exposure rankings by AI task concentration: Agriculture
            76.3%, Utilities 66.4%, Professional Services 64.6%, Mining 64.2%,
            Manufacturing 58.6%, Finance &amp; Insurance 57.7% &mdash; down to
            Accommodation &amp; Food at 26.0%. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Conference Board of Canada, 2026
            </a>
            )
          </p>
        </div>
      </section>

      {/* Section 2: Competing with AI vs working with AI */}
      <section className="mt-10" aria-labelledby="competing-heading">
        <h2
          id="competing-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Competing with AI vs working with AI
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            The FSC 4-quadrant framework, building on the IMF complementarity
            methodology by Pizzinelli et al., classifies workers by two axes: how
            much AI can do their tasks (exposure), and whether AI assists or
            replaces them (complementarity).
          </p>
          <p>
            27% of Canadian workers are in high-exposure, high-complementarity
            roles where AI assists them. 29% are in high-exposure,
            low-complementarity roles where AI competes with them. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2025/01/Right-Brain-Left-Brain-AI-Brain-Report_The-Dais_FSC.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              The Dais/FSC, Right Brain Left Brain AI Brain, 2025
            </a>
            )
          </p>
          <p>
            <strong className="text-[var(--color-text-primary)]">
              High-exposure, high-complementarity examples:
            </strong>{" "}
            physicians, engineers, senior managers, nurses. Key skills: planning,
            leadership, coaching, critical thinking.
          </p>
          <p>
            <strong className="text-[var(--color-text-primary)]">
              High-exposure, low-complementarity examples:
            </strong>{" "}
            administrative assistants, auditors, accountants. Key skills:
            accounting, data analysis, information filing, proofreading. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2025/01/Right-Brain-Left-Brain-AI-Brain-Report_The-Dais_FSC.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              The Dais/FSC, Right Brain Left Brain AI Brain, 2025
            </a>
            )
          </p>
        </div>
      </section>

      {/* Section 3: The disruption timeline */}
      <section className="mt-10" aria-labelledby="timeline-heading">
        <h2
          id="timeline-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          The disruption timeline
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            The Conference Board of Canada projects a J-curve: approximately
            535,000 jobs lost by 2030, followed by a net gain of 555,000 jobs by
            2045 as productivity benefits materialize. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Conference Board of Canada, 2026
            </a>
            )
          </p>
          <p>
            Policy Exchange identifies three preparation windows: 1&ndash;2 years to
            design reforms, 3&ndash;5 years to implement major changes, and 5+ years
            of continuous adaptation. (Source:{" "}
            <a
              href="https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Policy Exchange, Government in the Age of Superintelligence, 2025
            </a>
            )
          </p>
          <p>
            Goldman Sachs estimates that two-thirds of jobs have significant AI
            exposure, and that generative AI could substitute a quarter of current
            tasks. (Cited in:{" "}
            <a
              href="https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Policy Exchange, 2025
            </a>
            )
          </p>
          <p>
            The UK government estimates 30% of the workforce could be automated
            within 20 years. One in three people already believe AI could do their
            job within five years. (Cited in:{" "}
            <a
              href="https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Policy Exchange, 2025
            </a>
            )
          </p>
        </div>
      </section>

      {/* Section 4: Which jobs change, which jobs grow */}
      <section className="mt-10" aria-labelledby="jobs-heading">
        <h2
          id="jobs-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Which jobs change, which jobs grow
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            Steepest job posting declines between 2022 and 2024: web designers
            &minus;97.9%, information services &minus;55.6%, authors/writers
            &minus;56.2%, desktop publishing &minus;74%, customer service
            &minus;54.2%. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2025/09/canadas-workforce-in-transition_sept2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              FSC, Canada&rsquo;s Workforce in Transition, 2025
            </a>
            )
          </p>
          <p>
            Fastest-growing AI-augmented roles over the same period: conductors
            and composers +43.4%, early childhood educators +22.6%, dentists
            +25.6%, nursing supervisors +18.7%. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2025/09/canadas-workforce-in-transition_sept2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              FSC, 2025
            </a>
            )
          </p>
          <p>
            Policy Exchange argues for a &ldquo;skills revaluation&rdquo;: roles dismissed
            as low-skilled are more accurately described as low-paid. Physical
            touch, emotional intelligence, and interpersonal skills will command
            increasing premiums as cognitive work is automated. (Source:{" "}
            <a
              href="https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Policy Exchange, 2025
            </a>
            )
          </p>
          <p>
            OpenAI&rsquo;s Industrial Policy paper projects that AI infrastructure
            buildout &mdash; data centres, power grids, cooling systems &mdash;
            will require approximately 20% more skilled trades workers than
            currently exist, including electricians, mechanics, ironworkers,
            carpenters, and plumbers.
          </p>
        </div>
      </section>

      {/* Section 5: What policymakers are being told */}
      <section className="mt-10" aria-labelledby="policy-heading">
        <h2
          id="policy-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          What policymakers are being told
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            Researchers recommend building national capacity to retrain 250,000
            workers annually &mdash; proportional to Manitoba, that is approximately
            25,000 workers per year. (Source:{" "}
            <a
              href="https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Policy Exchange, 2025
            </a>
            )
          </p>
          <p>
            Universal basic income discussions are entering the mainstream policy
            conversation, alongside working-hours reforms such as the 3.5-day
            work week. (Source:{" "}
            <a
              href="https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Policy Exchange, 2025
            </a>
            )
          </p>
          <p>
            Canada has funded 300+ active skills projects, with growing emphasis
            on employer-worker co-investment models. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2025/08/FSC-Impact-Report-EN-FINAL.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              FSC Impact Report, 2025
            </a>
            )
          </p>
          <p>
            Services-based industries &mdash; accommodation, education, retail &mdash;
            gain proportionally less from AI productivity gains, and will require
            different transition strategies than knowledge-work sectors. (Source:{" "}
            <a
              href="https://fsc-ccf.ca/wp-content/uploads/2026/03/understanding-the-Influence-of-ai-on-employment_jan2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Conference Board, 2026
            </a>
            )
          </p>
          <p>
            Policy Exchange identifies an &ldquo;automation taboo&rdquo;: governments
            tend to suppress open discussion of AI-driven job displacement due
            to political sensitivity, which delays preparation at exactly the
            moment it is most needed. (Source:{" "}
            <a
              href="https://policyexchange.org.uk/wp-content/uploads/Government-in-the-Age-of-Super-Intelligence-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Policy Exchange, 2025
            </a>
            )
          </p>
        </div>
      </section>

      {/* Section 6: Sources */}
      <section className="mt-10" aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2"
        >
          Sources
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-primary)] w-64">
                  Source
                </th>
                <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-primary)]">
                  Description
                </th>
                <th className="text-left py-2 font-medium text-[var(--color-text-primary)] w-24">
                  Year
                </th>
              </tr>
            </thead>
            <tbody>
              {BIBLIOGRAPHY.map((row) => (
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
                    {row.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer CTA */}
      <div
        className="mt-10 p-5 rounded border border-[var(--color-border)] bg-[var(--color-surface-muted)]"
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          <Link
            href="/calculator"
            className="text-[var(--color-accent)] hover:underline font-medium"
          >
            See how these findings apply to your sector &rarr;
          </Link>
        </p>
      </div>

      {/* Back to home */}
      <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
        <Link
          href="/"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          &larr; Back to home
        </Link>
      </div>
    </div>

    <RelatedLinks
      links={[
        {
          href: "/explorer",
          label: "Industry explorer",
          description:
            "See how the research translates into risk scores for all 20 Manitoba sectors.",
        },
        {
          href: "/scenarios",
          label: "Scenarios",
          description:
            "Compare four futures — baseline, rapid adoption, leaders, and laggards.",
        },
        {
          href: "/about",
          label: "Methodology",
          description:
            "The data sources, formula, and modifiers behind the composite scores.",
        },
      ]}
    />
    </>
  );
}
