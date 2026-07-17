import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Card } from "@/components/ui/Card";
import { pageMetadata } from "@/lib/seo";
import { USE_CASES } from "@/content/use-cases";

export const metadata: Metadata = pageMetadata({
  title: "Use-cases",
  description:
    "Real jobs people bring to MK VaultPass: API tokens for a side project, rotating office Wi-Fi, printable recovery-code sheets, env-secret hygiene, and family passphrases.",
  path: "/use-cases",
});

export default function UseCasesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Use-cases"
        lead="Concrete situations and the workflow that fits each one. Each page is honest about where the tool helps and where it stops."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {USE_CASES.map((useCase) => (
          <Card
            key={useCase.slug}
            className="relative flex flex-col gap-2 transition-shadow duration-fast ease-enter hover:shadow-2"
          >
            <span className="text-xs font-medium uppercase tracking-[0.06em] text-fg-faint">
              {useCase.category}
            </span>
            <h2 className="text-lg font-semibold text-fg">
              <Link
                href={`/use-cases/${useCase.slug}`}
                className="after:absolute after:inset-0"
              >
                {useCase.title}
              </Link>
            </h2>
            <p className="text-sm text-fg-muted">{useCase.summary}</p>
            <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-fg-faint">
              <Clock size={14} strokeWidth={1.75} aria-hidden="true" />
              {useCase.readingTime}
            </span>
          </Card>
        ))}
      </div>

      <section className="mt-12 border-t border-border pt-8">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
        >
          Read the guides
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
