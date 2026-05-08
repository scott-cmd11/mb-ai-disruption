import type { MetadataRoute } from "next";

const BASE_URL = "https://www.aidisruption.ca";
const LAST_UPDATED = new Date("2026-05-08");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/calculator`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/occupation`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/explorer`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/heatmap`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/scenarios`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/threat-model`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/threat-simulator`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/policy`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: LAST_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: LAST_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];
}
