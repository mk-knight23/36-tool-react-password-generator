import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { LAST_UPDATED } from "@/lib/site";
import { GUIDES } from "@/content/guides";
import { USE_CASES } from "@/content/use-cases";

/**
 * XML sitemap (STANDARDS §5). Lists every indexable route with a coarse change
 * frequency and priority. Guide/use-case entries derive their lastModified from
 * the article's own date so re-published content re-surfaces to crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(LAST_UPDATED);

  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/generate"), lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/analyze"), lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/policies"), lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/checklists"), lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/docs"), lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/guides"), lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/use-cases"), lastModified: updated, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/faq"), lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/changelog"), lastModified: updated, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/about"), lastModified: updated, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/creator"), lastModified: updated, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/open-source"), lastModified: updated, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/dashboard"), lastModified: updated, changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl("/history"), lastModified: updated, changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl("/settings"), lastModified: updated, changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/cookies"), lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/contact"), lastModified: updated, changeFrequency: "yearly", priority: 0.4 },
  ];

  const guides: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(guide.dateModified ?? guide.datePublished),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const useCases: MetadataRoute.Sitemap = USE_CASES.map((useCase) => ({
    url: absoluteUrl(`/use-cases/${useCase.slug}`),
    lastModified: new Date(useCase.dateModified ?? useCase.datePublished),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...core, ...guides, ...useCases];
}
