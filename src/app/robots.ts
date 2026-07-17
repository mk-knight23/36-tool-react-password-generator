import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * robots.txt (STANDARDS §5). Everything is indexable; the only disallowed path
 * is the API route, which returns no crawlable content. Points crawlers at the
 * sitemap, built from the same origin as the canonical URLs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
