// Navigation links — shared between layout.tsx (server) and NavMenu.tsx (client).
// Kept in a plain TS module (no "use client") so both can import safely.

export const NAV_LINKS = [
  { href: "/calculator",       label: "Calculator" },
  { href: "/explorer",         label: "Explorer" },
  { href: "/occupation",       label: "Occupations" },
  { href: "/scenarios",        label: "Scenarios" },
  { href: "/heatmap",          label: "Heatmap" },
  { href: "/threat-simulator", label: "Threat Model" },
  { href: "/about",            label: "About" },
] as const;
