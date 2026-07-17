import type { ContentDoc } from "@/content/types";

export const browserCryptoExplained: ContentDoc = {
  slug: "browser-crypto-explained",
  title: "Browser crypto explained: how local generation actually works",
  description:
    "What crypto.getRandomValues is, why it is safe for secrets, why general-purpose randomness is not, and how rejection sampling avoids modulo bias.",
  summary:
    "The Web Crypto API, the bias trap most generators fall into, and how to verify egress yourself.",
  category: "For developers",
  readingTime: "8 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "How MK VaultPass works", href: "/docs" },
    { label: "Entropy, explained", href: "/guides/entropy-explained" },
    { label: "Open source and how to audit it", href: "/open-source" },
  ],
  body: () => [
    {
      t: "p",
      text: "The claim behind MK VaultPass is that every secret is generated in your browser and never sent anywhere. That claim rests on a browser feature called the Web Crypto API and on one careful detail about how random numbers are turned into characters. This guide explains both, so that the promise is something you can understand and check rather than something you have to take on faith.",
    },
    { t: "h2", text: "The right source of randomness" },
    {
      t: "p",
      text: "Every modern browser exposes `crypto.getRandomValues`, part of the Web Crypto API. You hand it an array and it fills the array with cryptographically secure random bytes drawn from the operating system's random source, the same source used for TLS keys and other security-critical work. This is the correct primitive for generating secrets. There is also `crypto.randomUUID`, a convenience that produces a random version-4 UUID directly, which VaultPass uses for its UUID mode.",
    },
    {
      t: "p",
      text: "It is worth being clear about what not to use. Every language ships a general-purpose random number generator meant for things like shuffling a list, picking a sample, or animating a game. Those generators are fast and predictable by design: given a little output, an attacker can often reconstruct their internal state and predict every value they will produce next. That is fine for a dice roll and disqualifying for a password. VaultPass never uses a general-purpose generator for any secret, and a test in the codebase fails the build if such a call ever appears in the source, so the rule is enforced rather than merely intended.",
    },
    { t: "h2", text: "The bias trap: why you cannot just take a remainder" },
    {
      t: "p",
      text: "Here is the subtle part that trips up many home-grown generators. Suppose you want a random letter from a 26-letter alphabet. You have a random byte, a number from 0 to 255. The obvious move is to take the remainder after dividing by 26. It works, but it is biased. There are 256 possible byte values, and 256 does not divide evenly by 26. The values 0 through 25 each get mapped to by ten different bytes, but a few low letters get mapped to by eleven. The result: some letters come up slightly more often than others. Over one password you would never notice. Across millions of generated secrets it is a real, measurable weakness, and it shrinks the effective key space.",
    },
    {
      t: "p",
      text: "The fix is called rejection sampling. Instead of forcing every byte to a letter, you throw away the small unfair remainder at the top of the range and draw again. Concretely, you find the largest multiple of your alphabet size that fits under the maximum, and if a draw lands above that cutoff you discard it and pull a fresh one. What remains maps perfectly evenly onto the alphabet, so every character is exactly equally likely. The cost is that you occasionally draw a second time, which is invisible in practice.",
    },
    {
      t: "code",
      code: "// The idea behind randomInt(maxExclusive):\n//  1. draw a 32-bit value from crypto.getRandomValues\n//  2. compute the largest multiple of maxExclusive below 2^32\n//  3. if the draw is at or above that limit, reject and draw again\n//  4. otherwise return draw % maxExclusive  (now perfectly uniform)",
    },
    {
      t: "note",
      text: "Uniformity is not a nice-to-have. A biased generator quietly reduces how many secrets are actually possible, which is the same as reducing entropy. Rejection sampling is what makes the entropy readout truthful.",
    },
    { t: "h2", text: "How VaultPass proves it stays even" },
    {
      t: "p",
      text: "Claiming uniformity is easy; testing it is what counts. The codebase includes a statistical test that generates well over a hundred thousand characters over a 26-letter alphabet and runs a chi-squared test on the distribution. If a future change reintroduced bias, that test would catch the skew and fail. It is a guardrail against the exact class of bug that this section describes, kept in the repository so anyone can read it. You can find the reasoning summarized on the [how it works](/docs) page.",
    },
    { t: "h2", text: "Verifying the no-egress claim yourself" },
    {
      t: "p",
      text: "The strongest part of a local tool is that you do not have to believe it. You can watch. Open your browser's developer tools, switch to the network tab, and generate as many secrets as you like. You will see the page load once and then nothing further leave while you generate, because there is no code that sends a generated value, or any derivative of it, to a server. The content security policy is set so the page can only talk back to its own origin, and the one server route that exists, an optional AI question feature, is built so its input schema physically cannot carry a secret. The [open source](/open-source) page explains how to read the code and confirm all of this for yourself.",
    },
    {
      t: "p",
      text: "That is the whole mechanism. A secure random source built into your browser, a sampling method that keeps every character equally likely, a test that proves it, and a network boundary you can inspect. No part of it requires trusting a marketing claim, which is exactly how a security tool should be built.",
    },
  ],
};
