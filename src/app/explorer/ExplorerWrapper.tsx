"use client";

import { useEffect, useState } from "react";
import type { Industry, Occupation } from "@/types";

// Lazy import to avoid SSR — React Flow accesses browser APIs at import time
let ExplorerClientModule: typeof import("./ExplorerClient") | null = null;

function ExplorerLoadingFallback({ industries }: { industries: Industry[] }) {
  const ranked = [...industries]
    .sort((a, b) => b.sectorRiskScore - a.sectorRiskScore)
    .slice(0, 6);

  return (
    <section
      aria-labelledby="explorer-loading-heading"
      className="min-h-[calc(100vh-57px)] border-b"
      style={{ backgroundColor: "var(--color-paper)", borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div
          className="border-y py-4"
          style={{ borderColor: "var(--color-text-primary)" }}
        >
          <p
            className="text-[0.6rem] font-bold uppercase tracking-[0.24em]"
            style={{ color: "var(--color-gold)" }}
          >
            Manitoba industry atlas
          </p>
          <h1
            id="explorer-loading-heading"
            className="mt-2 font-display text-3xl font-black leading-tight sm:text-5xl"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
          >
            Explore AI disruption risk by Manitoba industry.
          </h1>
          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            The interactive sector map is loading. Below are the highest-exposure
            sectors so the page remains useful for search, sharing, and slower devices.
          </p>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {ranked.map((industry, index) => (
            <li
              key={industry.naicsCode}
              className="border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-[0.58rem] font-bold uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    #{String(index + 1).padStart(2, "0")} / NAICS {industry.naicsCode}
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {industry.shortName}
                  </p>
                </div>
                <p
                  className="font-mono text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {industry.sectorRiskScore}
                </p>
              </div>
              <div
                className="mt-3 h-1.5 overflow-hidden"
                style={{ backgroundColor: "var(--color-border)" }}
                aria-hidden="true"
              >
                <div
                  className={`h-full risk-bar-${industry.riskTier}`}
                  style={{ width: `${industry.sectorRiskScore}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ExplorerWrapper({
  industries,
  occupations,
}: {
  industries: Industry[];
  occupations: Occupation[];
}) {
  const [Client, setClient] = useState<React.ComponentType<{
    industries: Industry[];
    occupations: Occupation[];
  }> | null>(null);

  useEffect(() => {
    import("./ExplorerClient").then((mod) => {
      setClient(() => mod.ExplorerClient);
    });
  }, []);

  if (!Client) {
    return <ExplorerLoadingFallback industries={industries} />;
  }

  return <Client industries={industries} occupations={occupations} />;
}
