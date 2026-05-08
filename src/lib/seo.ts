import type { Metadata } from "next";

export const BASE_URL = "https://www.aidisruption.ca";
export const SITE_NAME = "Manitoba AI Disruption Explorer";
export const DEFAULT_DESCRIPTION =
  "A data-driven AI disruption risk assessment tool for Manitoba industries, occupations, and businesses.";

type PageMetadataInput = {
  title: string;
  description: string;
  path?: `/${string}`;
};

export function createPageMetadata({
  title,
  description,
  path = "/",
}: PageMetadataInput): Metadata {
  const url = `${BASE_URL}${path === "/" ? "" : path}`;
  const fullTitle = path === "/" ? title : `${title} - ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} social preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: `/${string}` }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
