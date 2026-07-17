import type { ReactNode } from "react";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import type { Block } from "@/content/blocks";
import type { Crumb } from "@/lib/jsonld";

interface DocPageProps {
  title: string;
  lead?: string;
  /** Trail below Home; the current page should be the last entry. */
  trail?: Crumb[];
  /** ISO date shown as "Last updated ..." meta. */
  updated?: string;
  /** Prose content as typed blocks. Use `children` for custom layouts instead. */
  blocks?: Block[];
  children?: ReactNode;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/**
 * Standard single-column layout for shorter static pages (legal, about,
 * open-source). Renders a header with optional breadcrumb and updated date, then
 * either typed blocks or arbitrary children inside the prose scope.
 */
export function DocPage({ title, lead, trail, updated, blocks, children }: DocPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title={title}
        lead={lead}
        trail={trail}
        meta={updated ? <span>Last updated {formatDate(updated)}</span> : undefined}
      />
      <div className="mt-10">
        <Prose>{blocks ? <ContentRenderer blocks={blocks} /> : children}</Prose>
      </div>
    </div>
  );
}
