// Navigation structure — flat links for nav bar and footer.

export type NavLink = { href: string; label: string };

export type NavEntry = { type: "link"; href: string; label: string; primary?: boolean };

export const NAV_ENTRIES: NavEntry[] = [
  { type: "link", href: "/calculator",       label: "Calculator",        primary: true },
  { type: "link", href: "/explorer",         label: "Explore" },
  { type: "link", href: "/threat-model",     label: "Understand" },
  { type: "link", href: "/threat-simulator", label: "Threat Simulator" },
  { type: "link", href: "/about",            label: "About" },
];

// Flat list — used by the footer in layout.tsx
export const NAV_LINKS: NavLink[] = NAV_ENTRIES.map(({ href, label }) => ({ href, label }));
