import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { JsonLd } from "@/components/content/JsonLd";
import { AdSlot } from "@/components/content/AdSlot";
import { TrackView } from "@/components/content/TrackView";
import { Card } from "@/components/ui/Card";
import { articleJsonLd, howToJsonLd } from "@/lib/jsonld";
import type { ContentDoc } from "@/content/types";
import type { Crumb } from "@/lib/jsonld";

interface ArticleLayoutProps {
  doc: ContentDoc;
  /** Base section path, e.g. "/guides" or "/use-cases". */
  basePath: string;
  /** Section label for the breadcrumb, e.g. "Guides". */
  sectionLabel: string;
  /** Analytics event fired on mount. */
  trackEvent?: "guide_opened" | "tool_opened";
}

/**
 * Shared renderer for a long-form content document (guide or use-case): header
 * with breadcrumb and meta, optional HowTo steps, the prose body, related links,
 * and Article/HowTo/Breadcrumb JSON-LD. Kept in one place so both sections stay
 * visually and structurally identical.
 */
export function ArticleLayout({
  doc,
  basePath,
  sectionLabel,
  trackEvent = "guide_opened",
}: ArticleLayoutProps) {
  const path = `${basePath}/${doc.slug}`;
  const trail: Crumb[] = [
    { name: sectionLabel, path: basePath },
    { name: doc.title, path },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <TrackView event={trackEvent} params={{ slug: doc.slug }} />
      <JsonLd
        data={articleJsonLd({
          title: doc.title,
          description: doc.description,
          path,
          datePublished: doc.datePublished,
          dateModified: doc.dateModified,
        })}
      />
      {doc.howTo ? (
        <JsonLd data={howToJsonLd(doc.howTo.name, doc.howTo.description, doc.howTo.steps)} />
      ) : null}

      <PageHeader
        title={doc.title}
        lead={doc.description}
        trail={trail}
        meta={
          <>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.75} aria-hidden="true" />
              {doc.readingTime}
            </span>
            <span aria-hidden="true">·</span>
            <span>{doc.category}</span>
          </>
        }
      />

      <div className="mt-10">
        <Prose>
          <ContentRenderer blocks={doc.body()} />
        </Prose>
      </div>

      {doc.howTo ? (
        <Card as="section" className="mt-10">
          <h2 className="text-xl font-semibold text-fg">{doc.howTo.name}</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {doc.howTo.steps.map((step, index) => (
              <li key={step.name} className="flex gap-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-sm text-accent"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{step.name}</p>
                  <p className="mt-0.5 text-sm text-fg-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      <div className="mt-10">
        <AdSlot slot={`${basePath.slice(1)}-inline`} />
      </div>

      {doc.related && doc.related.length > 0 ? (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.06em] text-fg-faint">
            <ShieldCheck size={16} strokeWidth={1.75} aria-hidden="true" />
            Keep reading
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {doc.related.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
                >
                  {link.label}
                  <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
