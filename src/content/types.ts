import type { ReactNode } from "react";
import type { HowToStep } from "@/lib/jsonld";

/** A related internal link shown at the foot of a content page. */
export interface RelatedLink {
  label: string;
  href: string;
}

/** Optional HowTo block → HowTo JSON-LD + a rendered step list. */
export interface HowToBlock {
  name: string;
  description: string;
  steps: HowToStep[];
}

/**
 * A long-form content document (guide or use-case). Body is a render function
 * returning prose JSX so each article stays fully typed and server-rendered
 * (no MDX/markdown runtime dependency — YAGNI).
 */
export interface ContentDoc {
  slug: string;
  /** Page <title> and h1. */
  title: string;
  /** Meta description + OG description (~150 chars, unique). */
  description: string;
  /** One-line summary for index cards. */
  summary: string;
  /** Grouping label for index pages. */
  category: string;
  /** e.g. "6 min read". */
  readingTime: string;
  /** ISO date (YYYY-MM-DD). */
  datePublished: string;
  dateModified?: string;
  howTo?: HowToBlock;
  related?: RelatedLink[];
  body: () => ReactNode;
}
