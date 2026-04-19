import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Manitoba AI Disruption Explorer — what information is collected and how it is used.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <li><Link href="/" className="hover:underline transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li style={{ color: "var(--color-text-primary)" }}>Privacy Policy</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--color-text-primary)" }}>
        Privacy Policy
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-tertiary)" }}>Last updated: April 2026</p>

      {/* TL;DR callout — the 90% answer most visitors came for */}
      <div
        className="mb-10 p-4 rounded-lg text-sm leading-relaxed"
        style={{
          backgroundColor: "rgba(217, 119, 6, 0.08)",
          border: "1px solid rgba(217, 119, 6, 0.25)",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--color-gold)" }}>
          TL;DR
        </p>
        <p style={{ color: "var(--color-text-secondary)" }}>
          No personal data is collected. No cookies. No tracking. The calculator runs
          entirely in your browser. Standard server logs are handled by Vercel and
          Google Fonts under their own privacy policies.
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Overview</h2>
          <p>
            This Privacy Policy describes how Scott Hazlitt (&ldquo;I&rdquo;, &ldquo;me&rdquo;, or &ldquo;the operator&rdquo;)
            handles information in connection with the <strong>Manitoba AI Disruption Explorer</strong> website at{" "}
            <a href="https://www.aidisruption.ca" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: "var(--color-gold)" }}>
              aidisruption.ca
            </a>{" "}
            (the &ldquo;Site&rdquo;). This policy is intended to comply with the{" "}
            <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable Canadian privacy law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Information I collect</h2>
          <p className="mb-3">
            <strong style={{ color: "var(--color-text-primary)" }}>I collect no personal information directly.</strong> The Site
            is a read-only research and exploration tool. There are no accounts, no login, no forms that submit data to my servers,
            and no analytics or tracking scripts installed by me.
          </p>
          <p className="mb-3">
            <strong style={{ color: "var(--color-text-primary)" }}>Assessment inputs stay in your browser.</strong> When you use
            the AI Risk Calculator, your answers (business size, sector, AI readiness) are processed entirely within your browser
            and are never sent to any server or stored anywhere outside your device.
          </p>
          <p>
            <strong style={{ color: "var(--color-text-primary)" }}>No cookies are set by this Site.</strong> There are no
            tracking cookies, session cookies, or persistent cookies placed by this Site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Information collected by third-party services</h2>
          <p className="mb-3">
            The Site is hosted on <strong>Vercel</strong> (Vercel Inc., San Francisco, CA, USA). As with any web hosting provider,
            Vercel&apos;s infrastructure automatically receives standard HTTP request data when you visit the Site — this may include
            your IP address, browser type, operating system, referring URL, and the date and time of your request. This is standard
            server log data processed by Vercel as part of delivering the service.
          </p>
          <p className="mb-3">
            Vercel&apos;s handling of this data is governed by their{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: "var(--color-gold)" }}>
              Privacy Policy
            </a>. Vercel is a US-based company; your request data may be processed in the United States.
          </p>
          <p>
            The Site loads fonts from <strong>Google Fonts</strong> via Next.js font optimization. Google may receive your IP
            address as part of font delivery. Google&apos;s data practices are governed by{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: "var(--color-gold)" }}>
              Google&apos;s Privacy Policy
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>How information is used</h2>
          <p>
            I do not collect, use, sell, or disclose personal information for any purpose. All data displayed on the Site
            (occupation scores, sector data, industry statistics) is derived from publicly available academic research and
            Statistics Canada datasets — it does not contain personal information about individual visitors.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Your rights under PIPEDA</h2>
          <p className="mb-3">
            Under PIPEDA, you have the right to access personal information held about you and to request corrections.
            Because this Site collects no personal information about visitors, there is generally nothing to access or correct.
          </p>
          <p>
            If you believe the Site has inadvertently collected or published your personal information, please contact me at{" "}
            <a href="mailto:scott@scotthazlitt.ai" className="underline" style={{ color: "var(--color-gold)" }}>
              scott@scotthazlitt.ai
            </a>. I will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Contact</h2>
          <p>For privacy-related questions or concerns, contact:</p>
          <div className="mt-3 p-4 rounded-lg" style={{ background: "var(--color-surface-muted)", border: "1px solid var(--color-border)" }}>
            <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>Scott Hazlitt</p>
            <p>Manitoba, Canada</p>
            <a href="mailto:scott@scotthazlitt.ai" className="underline" style={{ color: "var(--color-gold)" }}>
              scott@scotthazlitt.ai
            </a>
          </div>
          <p className="mt-3">
            If you are not satisfied with my response, you may contact the{" "}
            <a href="https://www.priv.gc.ca/en/" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: "var(--color-gold)" }}>
              Office of the Privacy Commissioner of Canada
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Changes to this policy</h2>
          <p>
            If this policy is updated, the &ldquo;Last updated&rdquo; date at the top of this page will change.
            Continued use of the Site after any change constitutes acceptance of the updated policy.
          </p>
        </section>

      </div>
    </div>
  );
}
