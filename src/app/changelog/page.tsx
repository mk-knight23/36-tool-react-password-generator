import type { Metadata } from "next";
import { PageHeader } from "@/components/content/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { pageMetadata } from "@/lib/seo";
import { CHANGELOG } from "@/content/changelog";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Release notes for MK VaultPass, describing what actually shipped in each version of the local-first secret generator.",
  path: "/changelog",
});

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Changelog"
        lead="What actually shipped, version by version. No roadmap promises dressed up as releases."
        trail={[{ name: "Changelog", path: "/changelog" }]}
      />

      <div className="mt-10 flex flex-col gap-12">
        {CHANGELOG.map((entry) => (
          <section key={entry.version}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-mono text-2xl font-semibold text-fg">
                v{entry.version}
              </h2>
              <Badge tone="accent">{entry.title}</Badge>
              <span className="text-sm text-fg-muted">{formatDate(entry.date)}</span>
            </div>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-fg-muted">
              {entry.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
