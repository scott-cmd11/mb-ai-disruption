import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for the Manitoba AI Disruption Explorer, including disclaimer, permitted use, and governing law.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <li><Link href="/" className="hover:underline transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li style={{ color: "var(--color-text-primary)" }}>Terms of Use</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--color-text-primary)" }}>
        Terms of Use
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--color-text-tertiary)" }}>Last updated: April 2026</p>

      <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>

        {/* Important notice box */}
        <div className="p-4 rounded-lg" style={{ background: "rgba(217, 119, 6, 0.08)", border: "1px solid rgba(217, 119, 6, 0.3)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--color-gold)" }}>Independent personal project</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            This Site is a free tool built by Scott Hazlitt as a personal project. It is not affiliated with the Government
            of Manitoba, any federal department, Statistics Canada, or any employer or industry association. No personal
            data is collected. Scores are modelled estimates — not predictions, guarantees, or professional advice of any kind.
          </p>
        </div>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Acceptance of terms</h2>
          <p>
            By accessing or using the <strong>Manitoba AI Disruption Explorer</strong> at{" "}
            <a href="https://mb-ai-disruption.vercel.app" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: "var(--color-gold)" }}>
              mb-ai-disruption.vercel.app
            </a>{" "}
            (the &ldquo;Site&rdquo;), you agree to these Terms of Use. If you do not agree, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Informational and exploratory purposes only</h2>
          <p className="mb-3">
            All content on this Site is provided for <strong>general informational and exploratory purposes only</strong>.
            Risk scores, disruption timelines, and sector assessments are modelled estimates derived from published academic
            research. They are intended to stimulate thinking and awareness — not to serve as authoritative, definitive,
            or actionable guidance.
          </p>
          <p>
            Nothing on this Site constitutes employment advice, legal advice, financial advice, investment advice, or
            professional advice of any kind. Do not make employment, business, or policy decisions based solely on
            information from this Site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>About the scores</h2>
          <p className="mb-3">
            Composite risk scores are derived from three peer-reviewed datasets (Frey &amp; Osborne 2013, Felten-Raj-Seamans 2021,
            Eloundou et al. 2023) combined with Statistics Canada sector data. These scores measure relative AI disruption
            <em> exposure</em> — not certainty of job loss, business failure, or any specific outcome.
          </p>
          <p>
            The Cost Curve projections and disruption timelines on the calculator results page are illustrative scenarios
            based on sector parameters and published AI adoption research. They are not empirical forecasts and should not
            be interpreted as predictions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Data sources and licences</h2>
          <p className="mb-3">
            This Site uses publicly available datasets from Statistics Canada (Statistics Canada Open Licence),
            peer-reviewed academic publications, and open-source research repositories. Attribution is provided
            on the{" "}
            <Link href="/about" className="underline" style={{ color: "var(--color-gold)" }}>
              About &amp; Methodology
            </Link>{" "}
            page.
          </p>
          <p>
            Statistics Canada data is reproduced and distributed on an &ldquo;as is&rdquo; basis with the permission of
            Statistics Canada. Users are forbidden to copy the data and redisseminate it in an original or modified form
            for commercial purposes without the prior written permission of Statistics Canada.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Permitted use</h2>
          <p className="mb-3">You may use the Site for lawful purposes including research, education, journalism, and general awareness. You may not:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use automated scrapers or bots to overload the Site&apos;s infrastructure</li>
            <li>Represent Site outputs as official government, Statistics Canada, or academic findings</li>
            <li>Use the Site in any manner that violates applicable Canadian law</li>
            <li>Remove or obscure attribution notices when republishing derived material</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>No warranty</h2>
          <p>
            The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranty of any kind,
            express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose,
            accuracy, completeness, or non-infringement. The operator does not guarantee that the Site will be error-free,
            uninterrupted, or free of harmful components.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Scott Hazlitt shall not be liable for any direct, indirect,
            incidental, special, or consequential damages arising out of or related to your use of, or inability to use,
            the Site or its content — even if advised of the possibility of such damages. This includes, without limitation,
            any reliance placed on the accuracy or completeness of the scores or projections displayed.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Governing law</h2>
          <p>
            These Terms of Use are governed by and construed in accordance with the laws of Manitoba
            and the applicable federal laws of Canada, without regard to conflict of law principles. Any disputes arising
            under these terms shall be subject to the exclusive jurisdiction of the courts of Manitoba.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Changes to these terms</h2>
          <p>
            These terms may be updated from time to time. The &ldquo;Last updated&rdquo; date at the top of this page will reflect
            any changes. Continued use of the Site after an update constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Contact</h2>
          <p>
            Questions about these Terms of Use may be directed to{" "}
            <a href="mailto:scott@scotthazlitt.ai" className="underline" style={{ color: "var(--color-gold)" }}>
              scott@scotthazlitt.ai
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
