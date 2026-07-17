import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import type { Crumb } from "@/lib/jsonld";

interface PageHeaderProps {
  title: string;
  lead?: string;
  /** Trail below Home; omit for top-level pages that need no breadcrumb. */
  trail?: Crumb[];
  /** Small meta row (e.g. reading time, updated date) shown under the lead. */
  meta?: ReactNode;
}

/**
 * Standard header for content pages: optional breadcrumb, an h1, a lead
 * paragraph, and an optional meta row. Keeps the top of every content route
 * visually consistent (WCAG 2.2 §3.2.3 Consistent Navigation).
 */
export function PageHeader({ title, lead, trail, meta }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      {trail ? <Breadcrumbs trail={trail} /> : null}
      <h1 className="text-4xl font-bold tracking-tight text-fg">{title}</h1>
      {lead ? <p className="max-w-2xl text-lg text-fg-muted">{lead}</p> : null}
      {meta ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
          {meta}
        </div>
      ) : null}
    </header>
  );
}
