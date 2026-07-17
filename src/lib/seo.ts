import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/**
 * Per-page metadata builder (STANDARDS §5). Sets a unique title/description, a
 * canonical URL relative to `metadataBase` (declared in the root layout), and
 * matching OpenGraph + Twitter fields. The OG/Twitter image comes from the
 * file-based `src/app/opengraph-image.tsx`, which Next applies to every route,
 * so we deliberately do not set `images` here.
 */
export interface PageMetaInput {
  title: string;
  description: string;
  /** Absolute path beginning with "/". Drives the canonical URL. */
  path: string;
  /** OpenGraph type; "article" for guides/use-cases, "website" otherwise. */
  type?: "website" | "article";
  /** Marks the page non-indexable (used for none — kept for completeness). */
  noindex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
}: PageMetaInput): Metadata {
  const ogTitle = `${title} · ${SITE.name}`;
  const url = path === "/" ? SITE.url : `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE.name,
      title: ogTitle,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Absolute URL for a path, using the configured site origin. */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE.url : `${SITE.url}${path}`;
}
