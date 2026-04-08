// Navigation structure — grouped for desktop/mobile nav, flat for footer.

export type NavLink = { href: string; label: string };

export type NavEntry =
  | { type: "link"; href: string; label: string; primary?: boolean }
  | { type: "group"; label: string; items: NavLink[] };

export const NAV_ENTRIES: NavEntry[] = [
  {
    type: "link",
    href: "/calculator",
    label: "Calculator",
    primary: true,
  },
  {
    type: "group",
    label: "Explore",
    items: [
      { href: "/explorer", label: "Industries" },
      { href: "/occupation", label: "Occupations" },
      { href: "/scenarios", label: "Scenarios" },
      { href: "/heatmap", label: "Heatmap" },
    ],
  },
  {
    type: "group",
    label: "Research",
    items: [
      { href: "/threat-model", label: "Threat Model" },
      { href: "/threat-simulator", label: "Threat Simulator" },
      { href: "/policy", label: "Full Research" },
    ],
  },
  {
    type: "link",
    href: "/about",
    label: "About",
  },
];

// Flat list — used by the footer in layout.tsx (must stay exported as NAV_LINKS)
export const NAV_LINKS: NavLink[] = NAV_ENTRIES.flatMap((entry) =>
  entry.type === "group"
    ? entry.items
    : [{ href: entry.href, label: entry.label }]
);
