import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Card } from "@/components/ui/Card";
import { pageMetadata } from "@/lib/seo";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = pageMetadata({
  title: "Guides",
  description:
    "Plain-language guides to passwords, passphrases, entropy, API tokens, Wi-Fi keys, recovery codes, and how local generation works.",
  path: "/guides",
});

/** Groups guides by their category, preserving registry order within each. */
function byCategory() {
  const groups = new Map<string, typeof GUIDES>();
  for (const guide of GUIDES) {
    const existing = groups.get(guide.category) ?? [];
    existing.push(guide);
    groups.set(guide.category, existing);
  }
  return [...groups.entries()];
}

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Guides"
        lead="How passwords, passphrases, and secrets actually work, written to be read once and understood. No filler, no fear-selling."
      />
      <div className="mt-10 flex flex-col gap-10">
        {byCategory().map(([category, guides]) => (
          <section key={category}>
            <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-fg-faint">
              {category}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {guides.map((guide) => (
                <Card
                  key={guide.slug}
                  className="relative flex flex-col gap-2 transition-shadow duration-fast ease-enter hover:shadow-2"
                >
                  <h3 className="text-lg font-semibold text-fg">
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="after:absolute after:inset-0"
                    >
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-fg-muted">{guide.summary}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-fg-faint">
                    <Clock size={14} strokeWidth={1.75} aria-hidden="true" />
                    {guide.readingTime}
                  </span>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-12 border-t border-border pt-8">
        <Link
          href="/use-cases"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
        >
          See real use-cases
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
