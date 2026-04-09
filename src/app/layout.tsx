import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { NavMenu } from "@/components/NavMenu";
import { ShareButtons } from "@/components/ShareButtons";
import { NAV_LINKS } from "@/lib/nav";

// ── Fonts ─────────────────────────────────────────────────────────────────────
// Fraunces: distinctive variable display font — used for headings
// Instrument Sans: refined modern sans-serif — used for body/UI text
// preload: false — prevents build-time Google Fonts network requests

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["WONK", "opsz", "SOFT"],
  display: "swap",
  preload: false,
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

// ── Metadata ──────────────────────────────────────────────────────────────────

const BASE_URL = "https://www.aicanadapulse.ca";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Manitoba AI Disruption Explorer",
    template: "%s — Manitoba AI Disruption Explorer",
  },
  description:
    "A data-driven risk assessment tool for Manitoba industries and occupations. Understand how AI may affect your business, sector, and workforce.",
  keywords: ["AI disruption", "Manitoba", "labour market", "automation risk", "NAICS", "NOC"],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Manitoba AI Disruption Explorer",
    title: "Manitoba AI Disruption Explorer",
    description:
      "How exposed is your business to AI disruption? A data-driven risk assessment for Manitoba industries and occupations.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manitoba AI Disruption Explorer",
    description:
      "How exposed is your business to AI disruption? A data-driven risk assessment for Manitoba industries and occupations.",
    images: ["/opengraph-image"],
  },
};

// ── Layout ────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable}`}
    >
      <body>
        {/* ── Skip link — first focusable element ──────────────────────── */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-40"
          style={{ backgroundColor: "var(--color-navy-deep)" }}
        >
          {/* Amber top accent stripe — 3px, aria-hidden */}
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-light) 50%, var(--color-gold) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">

              {/* Wordmark */}
              <Link
                href="/"
                aria-label="Manitoba AI Disruption Explorer — home"
                className="focus-inverse group flex flex-col justify-center py-4 leading-none"
              >
                <span
                  className="text-[0.6rem] font-bold tracking-[0.3em] uppercase"
                  style={{ color: "var(--color-gold)" }}
                >
                  Manitoba
                </span>
                <span
                  className="font-display text-[1.1rem] font-bold"
                  style={{ color: "var(--color-text-inverse)", letterSpacing: "-0.01em" }}
                >
                  AI Disruption Explorer
                </span>
              </Link>

              {/* Main navigation — desktop flat + mobile hamburger */}
              <NavMenu />
            </div>
          </div>
        </header>

        {/* ── Exploratory notice ─────────────────────────────────────────── */}
        <div
          role="note"
          aria-label="Exploratory tool notice"
          className="w-full px-4 py-2 text-center text-xs"
          style={{
            backgroundColor: "rgba(217, 119, 6, 0.1)",
            borderBottom: "1px solid rgba(217, 119, 6, 0.2)",
            color: "var(--color-text-secondary)",
          }}
        >
          <span className="font-semibold" style={{ color: "var(--color-gold)" }}>Work in progress.</span>{" "}
          Exploratory tool — scores are modelled estimates from published academic data, not predictions or professional advice.{" "}
          <a href="/about" className="underline hover:opacity-80 transition-opacity" style={{ color: "var(--color-gold)" }}>
            Methodology &amp; limitations →
          </a>
          <span className="mx-2 opacity-30" aria-hidden="true">·</span>
          <span style={{ color: "var(--color-text-tertiary)" }}>Last updated: April 2026</span>
        </div>

        {/* ── Main ───────────────────────────────────────────────────────── */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer
          aria-label="Site footer"
          style={{ backgroundColor: "var(--color-navy-deep)" }}
        >
          {/* Amber top accent stripe */}
          <div
            className="h-px w-full"
            style={{ backgroundColor: "rgba(217, 119, 6, 0.3)" }}
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

            {/* Footer grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-4">

              {/* Brand column */}
              <div className="sm:col-span-2 lg:col-span-2">
                <p
                  className="text-[0.6rem] font-bold tracking-[0.3em] uppercase"
                  style={{ color: "var(--color-gold)" }}
                >
                  Manitoba
                </p>
                <p
                  className="font-display text-lg font-bold mt-0.5"
                  style={{ color: "var(--color-text-inverse)", letterSpacing: "-0.01em" }}
                >
                  AI Disruption Explorer
                </p>
                <p
                  className="mt-3 text-sm leading-relaxed max-w-sm"
                  style={{ color: "rgba(248, 250, 252, 0.55)" }}
                >
                  Data-driven AI disruption risk assessment for Manitoba industries,
                  occupations, and businesses. Built on peer-reviewed academic research.
                </p>

                {/* Share buttons */}
                <div className="mt-4">
                  <p
                    className="text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-2"
                    style={{ color: "rgba(248, 250, 252, 0.4)" }}
                  >
                    Share this tool
                  </p>
                  <ShareButtons />
                </div>
              </div>

              {/* Quick links */}
              <nav aria-label="Footer navigation">
                <p
                  className="text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-3"
                  style={{ color: "rgba(248, 250, 252, 0.4)" }}
                >
                  Explore
                </p>
                <ul className="space-y-2" role="list">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm transition-colors hover:underline focus-inverse"
                        style={{ color: "rgba(248, 250, 252, 0.6)" }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Data sources */}
              <div>
                <p
                  className="text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-3"
                  style={{ color: "rgba(248, 250, 252, 0.4)" }}
                >
                  Data Sources
                </p>
                <ul className="space-y-2 text-sm" style={{ color: "rgba(248, 250, 252, 0.5)" }} role="list">
                  <li>Statistics Canada Census 2021</li>
                  <li>Automation research (Frey &amp; Osborne, 2013)</li>
                  <li>AI occupation exposure index (Felten et al.)</li>
                  <li>Manitoba Bureau of Statistics</li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              className="mt-10 pt-6 border-t flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <p className="text-xs" style={{ color: "rgba(248, 250, 252, 0.35)" }}>
                © {new Date().getFullYear()} Scott Hazlitt — Independent exploratory project. Scores measure relative AI disruption exposure, not certainty of outcome.{" "}
                Built with{" "}
                <a
                  href="https://claude.ai/code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  style={{ color: "rgba(248, 250, 252, 0.45)" }}
                >
                  Claude Code
                </a>
                .
              </p>
              <nav className="flex items-center gap-4" aria-label="Legal">
                <Link
                  href="/about"
                  className="text-xs underline underline-offset-2 transition-opacity hover:opacity-80 focus-inverse"
                  style={{ color: "rgba(248, 250, 252, 0.45)" }}
                >
                  Methodology →
                </Link>
                <Link
                  href="/privacy"
                  className="text-xs underline underline-offset-2 transition-opacity hover:opacity-80 focus-inverse"
                  style={{ color: "rgba(248, 250, 252, 0.45)" }}
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-xs underline underline-offset-2 transition-opacity hover:opacity-80 focus-inverse"
                  style={{ color: "rgba(248, 250, 252, 0.45)" }}
                >
                  Terms
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
