import type { Metadata } from "next";
import Link from "next/link";
import { FileKey } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { BoundaryDiagram } from "@/components/product/BoundaryDiagram";
import { Card } from "@/components/ui/Card";
import { pageMetadata } from "@/lib/seo";
import { NOT_A_PASSWORD_MANAGER } from "@/lib/site";
import type { Block } from "@/content/blocks";

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description:
    "How MK VaultPass generates secrets: the Web Crypto random source, rejection sampling, the entropy model, the local-only boundary, the threat model, and the limits.",
  path: "/docs",
});

const RANDOMNESS: Block[] = [
  {
    t: "p",
    text: "Every secret is generated in your browser using `crypto.getRandomValues`, the Web Crypto API's cryptographically secure random source. It draws from the same operating-system randomness used for TLS keys. UUIDs use `crypto.randomUUID`. No general-purpose random function, the kind meant for shuffling or games, is ever used for a secret, because those are predictable by design. A test in the codebase fails the build if such a call appears anywhere in the source.",
  },
  {
    t: "h2",
    text: "Uniformity through rejection sampling",
  },
  {
    t: "p",
    text: "Turning random bytes into characters naively introduces bias. If you take a random byte from 0 to 255 and reduce it modulo a 26-letter alphabet, some letters come up slightly more often, because 256 does not divide evenly by 26. Over millions of secrets that is a real weakness. VaultPass avoids it with rejection sampling: it discards the small unfair remainder at the top of the range and draws again, so every character is exactly equally likely. A statistical test generates over a hundred thousand characters and runs a chi-squared check to guard against any future change reintroducing bias.",
  },
  {
    t: "h2",
    text: "The entropy model",
  },
  {
    t: "p",
    text: "For character-based modes, entropy is length times the base-2 logarithm of the alphabet size. For passphrases it is the number of words times the base-2 logarithm of the wordlist size; the bundled EFF large wordlist has exactly 7,776 words, so each word adds about 12.9 bits. The five-level strength scale maps bits to labels: very weak under 28, weak 28 to 49, fair 50 to 69, strong 70 to 99, and excellent at 100 and above. For pronounceable mode the entropy is estimated from the syllable model and labeled an estimate, because that mode trades some entropy for readability.",
  },
];

const THREAT_MODEL: Block[] = [
  {
    t: "p",
    text: "The product's core guarantee is that no generated secret, and no derivative of one, leaves your device. That is enforced in several layers rather than promised.",
  },
  {
    t: "ul",
    items: [
      "**Generation is client-side.** Secrets are produced by Web Crypto in your browser. The server never participates in generation.",
      "**The content security policy** allows the page to talk only to its own origin, so there is no route for a secret to be sent to a third party.",
      "**The one server route**, an optional AI question feature, is built so its input schema cannot carry a secret: a fixed set of topics plus a short, length-capped question, with secret-shaped input rejected on both the client and the server.",
      "**Analytics, when you allow them, receive only anonymous event names and counts**, never a generated value, its length tied to output, or its character set.",
    ],
  },
  {
    t: "p",
    text: "You do not have to take this on faith. Open your browser's developer tools, watch the network tab, and generate secrets: nothing leaves. The [browser crypto guide](/guides/browser-crypto-explained) and the [open source](/open-source) page explain how to confirm each layer for yourself.",
  },
];

const LIMITS: Block[] = [
  {
    t: "ul",
    items: [
      "**It is not a password manager.** It does not store, sync, or fill secrets. Save what you generate in a real password manager.",
      "**Clipboard auto-clear is best effort.** It works while the page is open and focused, and some operating-system clipboard managers keep their own history.",
      "**The common-password check is local and limited** to the bundled top-thousand list; it is not a full breach lookup.",
      "**Recovery codes are for systems you control.** VaultPass cannot register codes with a third-party service.",
      "**Opt-in history is stored in plain text** in your browser. Do not enable it on a shared machine.",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="How it works"
        lead="The mechanism behind the promise: where randomness comes from, how it stays uniform, how entropy is measured, and exactly where the boundary sits."
        trail={[{ name: "How it works", path: "/docs" }]}
      />

      <Card as="section" className="mt-8 flex items-start gap-3 border-warning/40">
        <FileKey
          size={20}
          strokeWidth={1.75}
          className="mt-0.5 shrink-0 text-warning"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-sm font-semibold text-fg">This is not a password manager</h2>
          <p className="mt-1 text-sm text-fg-muted">{NOT_A_PASSWORD_MANAGER}</p>
        </div>
      </Card>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Where randomness comes from</h2>
        <div className="mt-4">
          <Prose>
            <ContentRenderer blocks={RANDOMNESS} />
          </Prose>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">The local-only boundary</h2>
        <p className="mt-2 max-w-2xl text-fg-muted">
          This diagram shows exactly what happens on your device and the one thing that can
          optionally cross to the internet.
        </p>
        <div className="mt-6">
          <BoundaryDiagram />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Threat model</h2>
        <div className="mt-4">
          <Prose>
            <ContentRenderer blocks={THREAT_MODEL} />
          </Prose>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Limits, stated plainly</h2>
        <div className="mt-4">
          <Prose>
            <ContentRenderer blocks={LIMITS} />
          </Prose>
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <p className="text-sm text-fg-muted">
          Want the deeper version? Read{" "}
          <Link href="/guides/browser-crypto-explained" className="text-accent hover:text-accent-hover">
            browser crypto explained
          </Link>{" "}
          and{" "}
          <Link href="/guides/entropy-explained" className="text-accent hover:text-accent-hover">
            entropy explained
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
