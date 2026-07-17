import type { Metadata } from "next";
import { Github, Scale } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { Card } from "@/components/ui/Card";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import type { Block } from "@/content/blocks";

export const metadata: Metadata = pageMetadata({
  title: "Open source",
  description:
    "MK VaultPass is open source under the MIT license. Read the code, run it yourself, and verify every privacy claim on the site.",
  path: "/open-source",
});

const BLOCKS: Block[] = [
  {
    t: "p",
    text: "MK VaultPass is open source under the MIT license. Open source is not a badge here; it is the mechanism that makes the privacy claims meaningful. Anything this site says about how secrets are generated and where they go can be checked against the code, and you are encouraged to do exactly that.",
  },
  { t: "h2", text: "What to look at first" },
  {
    t: "p",
    text: "If you want to audit the security-critical parts, a short reading list gets you most of the way:",
  },
  {
    t: "ul",
    items: [
      "**The random source and sampling** live in the crypto module. Confirm that generation uses `crypto.getRandomValues` and that `randomInt` uses rejection sampling rather than a plain remainder.",
      "**The no-general-purpose-random guard** is a test that scans the source and fails the build if a general-purpose random call appears. It is the enforcement behind the claim.",
      "**The statistical uniformity test** generates over a hundred thousand characters and runs a chi-squared check, guarding against reintroduced bias.",
      "**The AI route and its schema** show that the one server endpoint cannot receive a secret: a fixed topic set plus a short, guarded question, validated on both sides.",
      "**The content security policy** in the Next.js config restricts network connections to the site's own origin.",
    ],
  },
  { t: "h2", text: "Run it yourself" },
  {
    t: "p",
    text: "The repository includes everything needed to run the app locally with a standard install, build, and start. Because generation is client-side, you can then do the definitive check: open developer tools, watch the network tab, and generate secrets. Nothing leaves. That is the whole promise, verifiable on your own machine in a couple of minutes.",
  },
  { t: "h2", text: "Contributing" },
  {
    t: "p",
    text: "Issues and pull requests are welcome on GitHub. Bug reports that come with a way to reproduce them are especially useful, and security reports should go privately by email first, as described on the [contact](/contact) page. If you fork the project, the MIT license lets you use and modify it freely.",
  },
];

export default function OpenSourcePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Open source"
        lead="Read the code, run it yourself, and confirm every claim on this site. That is what open source is for here."
        trail={[{ name: "Open source", path: "/open-source" }]}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <Github size={24} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-fg">Source repository</h2>
          <p className="text-sm text-fg-muted">
            The full source, issues, and history are on GitHub.
          </p>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
          >
            View on GitHub
          </a>
        </Card>
        <Card className="flex flex-col gap-3">
          <Scale size={24} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-fg">MIT license</h2>
          <p className="text-sm text-fg-muted">
            Use, copy, modify, and distribute it freely under the MIT license. Copyright 2026
            Kazi Musharraf.
          </p>
          <a
            href={`${SITE.repo}/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
          >
            Read the license
          </a>
        </Card>
      </div>

      <div className="mt-10">
        <Prose>
          <ContentRenderer blocks={BLOCKS} />
        </Prose>
      </div>
    </div>
  );
}
