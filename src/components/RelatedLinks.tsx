import Link from "next/link";

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

type RelatedLinksProps = {
  links: readonly RelatedLink[];
  eyebrow?: string;
  heading?: string;
};

// Shared related-links strip shown at the bottom of orphan routes that aren't
// in the top nav. Restores internal link equity and gives users a next step
// without cluttering the global header.

export function RelatedLinks({
  links,
  eyebrow = "Continue exploring",
  heading = "Related pages",
}: RelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <section
      aria-label="Related pages"
      className="border-t"
      style={{
        backgroundColor: "var(--color-surface-muted)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
          style={{ color: "var(--color-gold)" }}
        >
          {eyebrow}
        </p>
        <h2
          className="font-display text-xl font-bold mb-6"
          style={{ color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}
        >
          {heading}
        </h2>
        <ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {links.map(({ href, label, description }) => (
            <li key={href}>
              <Link
                href={href}
                className="block h-full rounded-lg border p-5 transition-all hover:shadow-sm focus-default"
                style={{
                  backgroundColor: "var(--color-paper)",
                  borderColor: "var(--color-border)",
                }}
              >
                <p
                  className="font-semibold text-sm mb-1 inline-flex items-center gap-1.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {label}
                  <span
                    aria-hidden="true"
                    style={{ color: "var(--color-gold)" }}
                  >
                    →
                  </span>
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
