"use client";

import { useEffect, useState } from "react";
import type { Industry, Occupation } from "@/types";

// Lazy import to avoid SSR — React Flow accesses browser APIs at import time
let ExplorerClientModule: typeof import("./ExplorerClient") | null = null;

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
    return <div style={{ height: "calc(100vh - 57px)", backgroundColor: "var(--color-paper-deep)" }} />;
  }

  return <Client industries={industries} occupations={occupations} />;
}
