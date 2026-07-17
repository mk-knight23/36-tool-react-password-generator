import type { Metadata } from "next";
import { DocPage } from "@/components/content/DocPage";
import { pageMetadata } from "@/lib/seo";
import type { Block } from "@/content/blocks";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Why MK VaultPass exists: a local-first secret generator that proves its privacy claims instead of asking you to trust them, rebuilt from an earlier version.",
  path: "/about",
});

const BLOCKS: Block[] = [
  {
    t: "p",
    text: "MK VaultPass is a small tool with a specific opinion: a password generator should generate everything on your device, and it should be able to prove that rather than ask you to believe it. Most online generators give you a strong-looking string and no way to know what happened to it. This one is built so you can open your network tab and watch nothing leave.",
  },
  { t: "h2", text: "Why it exists" },
  {
    t: "p",
    text: "This is a v2 rebuild of an earlier password generator. The earlier version had the two flaws that quietly undermine a lot of security tools: it used a general-purpose random function for some outputs, which is predictable and wrong for secrets, and it silently saved generated passwords in plain text. The rebuild treats those as the defining bugs to fix. Every secret now comes from the browser's cryptographic random source with rejection sampling for uniformity, proven by a statistical test in the codebase, and history is off by default and clearly labeled when you turn it on.",
  },
  { t: "h2", text: "What it is, and is not" },
  {
    t: "p",
    text: "It is a generator toolkit: passwords, passphrases, pronounceable words, PINs, UUIDs, random strings, API tokens, Wi-Fi keys, and recovery codes, plus a local strength analyzer, a policy builder, and printable sheets. It is not a password manager. It does not store, sync, or fill your secrets, and it says so on the landing page, in the docs, and in the FAQ, because the gap between what a tool claims and what it does is exactly where trust breaks.",
  },
  { t: "h2", text: "How it is built" },
  {
    t: "p",
    text: "The site is a Next.js application, but generation is entirely client-side; the server only renders content pages and validates the one optional AI question feature, which is designed so it cannot receive a secret. There is no database and no account system, because the product genuinely does not need them. The whole thing is open source under the MIT license, so the claims on this site are checkable line by line. See [how it works](/docs) for the mechanism and [open source](/open-source) for how to audit it.",
  },
  { t: "h2", text: "Who makes it" },
  {
    t: "p",
    text: "MK VaultPass is built and maintained by Kazi Musharraf as an open-source project. There is no company behind it, no team, no funding round, and no usage numbers to quote, and this page will never invent any. It is one engineer's tool, kept honest on purpose. You can read more on the [creator](/creator) page.",
  },
];

export default function AboutPage() {
  return (
    <DocPage
      title="About MK VaultPass"
      lead="A local-first secret generator that proves its privacy claims instead of asking you to trust them."
      trail={[{ name: "About", path: "/about" }]}
      blocks={BLOCKS}
    />
  );
}
