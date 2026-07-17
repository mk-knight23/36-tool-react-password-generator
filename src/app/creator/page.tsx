import type { Metadata } from "next";
import { Github, Globe } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { JsonLd } from "@/components/content/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { personJsonLd } from "@/lib/jsonld";
import { CREATOR } from "@/lib/site";
import type { Block } from "@/content/blocks";

export const metadata: Metadata = pageMetadata({
  title: "Creator",
  description:
    "MK VaultPass is built and maintained by Kazi Musharraf, an AI engineer, full-stack developer, and open-source builder.",
  path: "/creator",
});

const BLOCKS: Block[] = [
  {
    t: "p",
    text: "MK VaultPass is built and maintained by Kazi Musharraf, an AI engineer and full-stack developer who builds and open-sources practical tools. This project is one of a set of small, focused products made to be genuinely useful and fully inspectable rather than impressive-looking demos.",
  },
  { t: "h2", text: "Approach" },
  {
    t: "p",
    text: "The through-line across these projects is honesty about what software actually does. For a security tool that means the privacy claims are enforced in code and provable in your browser, the strength numbers reflect real entropy, and the limits are written down plainly. No invented testimonials, no fake usage counts, no marketing that outruns the behavior.",
  },
  { t: "h2", text: "Elsewhere" },
  {
    t: "p",
    text: `The source for this project and others lives on GitHub, and there is more work at the portfolio site. Both are linked below and in the footer of every page.`,
  },
];

export default function CreatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <JsonLd data={personJsonLd()} />
      <PageHeader
        title={CREATOR.name}
        lead={CREATOR.role}
        trail={[{ name: "Creator", path: "/creator" }]}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={CREATOR.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg hover:bg-surface-sunken"
        >
          <Github size={16} strokeWidth={1.75} aria-hidden="true" />
          GitHub
        </a>
        <a
          href={CREATOR.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg hover:bg-surface-sunken"
        >
          <Globe size={16} strokeWidth={1.75} aria-hidden="true" />
          Portfolio
        </a>
      </div>

      <div className="mt-10">
        <Prose>
          <ContentRenderer blocks={BLOCKS} />
        </Prose>
      </div>
    </div>
  );
}
