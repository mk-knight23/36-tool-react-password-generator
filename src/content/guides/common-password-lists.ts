import type { ContentDoc } from "@/content/types";

export const commonPasswordLists: ContentDoc = {
  slug: "common-password-lists",
  title: "Common password lists and why they matter",
  description:
    "How attackers use common-password and breach lists, why a password on one is weak no matter how long it looks, and how VaultPass checks against a local list.",
  summary:
    "The lists attackers try first, and why matching one makes any password very weak.",
  category: "Fundamentals",
  readingTime: "6 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "Password policies that work", href: "/guides/password-policies-that-work" },
    { label: "Analyze a password", href: "/analyze" },
    { label: "Entropy, explained", href: "/guides/entropy-explained" },
  ],
  body: () => [
    {
      t: "p",
      text: "Attackers rarely start by guessing passwords character by character. They start with lists: the passwords that millions of other people have already chosen. If your password is on one of those lists, its length and its mix of symbols do not save it, because the attacker is not searching the whole space, they are trying known answers first. Understanding how these lists work is the fastest way to understand why some long, complicated-looking passwords are still terrible.",
    },
    { t: "h2", text: "Where the lists come from" },
    {
      t: "p",
      text: "Two sources feed the lists. The first is breaches: when a service is compromised and its password database leaks, those real passwords get collected, cleaned up, and ranked by frequency. Over years, this has produced corpora of hundreds of millions of distinct passwords that real people actually used. The second is generation: cracking tools take a base dictionary and apply rules, appending years, swapping letters for lookalike digits, capitalizing the first letter, so `password` also becomes `Password1`, `p@ssw0rd`, `Password2026`, and thousands of other predictable variants. Both feed the same strategy: try the likely answers before the unlikely ones.",
    },
    { t: "h2", text: "Why a match makes any length weak" },
    {
      t: "p",
      text: "Entropy assumes every possibility is equally likely. Common-password lists break that assumption. `Tr0ub4dor&3` looks like it has plenty of entropy if you count characters and classes, but if a variant of it sits in a cracking ruleset, an attacker reaches it in the first few million guesses rather than the last few quintillion. This is why the [analyzer](/analyze) classifies any input that matches its common-password list as very weak regardless of the entropy the character math would suggest. A known password is a known password, and its real strength is close to zero.",
    },
    {
      t: "note",
      text: "A password's worst-case strength is set by the first list it appears on, not by how many characters or symbols it contains.",
    },
    { t: "h2", text: "Credential stuffing: the reuse multiplier" },
    {
      t: "p",
      text: "Lists get more dangerous when combined with reuse. Credential stuffing takes username-and-password pairs from one breach and tries them automatically against hundreds of other sites, betting that people reuse the same login. It works often enough to be a major cause of account takeovers. The defense is not a cleverer password; it is a different password on every site, so a leak from one place cannot open another. This is the single most valuable habit in personal security, and it is why unique generation per account matters more than squeezing out extra entropy on any one of them.",
    },
    { t: "h2", text: "How to stay off the wrong side of the list" },
    {
      t: "ul",
      items: [
        "**Generate, do not invent.** A secret drawn uniformly at random will not appear on a human-behavior list, because no human behavior produced it.",
        "**Use a unique secret per account** so a single breach cannot cascade through credential stuffing.",
        "**Check existing passwords** against a common-password list, and change any that match immediately.",
        "**Screen at the point of choice** if you run a service: reject known-bad passwords when users set them, as covered in [password policies that work](/guides/password-policies-that-work).",
      ],
    },
    { t: "h2", text: "How VaultPass checks, and its limits" },
    {
      t: "p",
      text: "MK VaultPass bundles the thousand most common passwords as a static asset and checks your input against it locally, matching both the exact string and its lowercase form so `PASSWORD` and `password` are both caught. The check runs entirely in your browser with no network request, which you can verify in your network tab. Being honest about the limit matters: a thousand entries catches the worst offenders and the classic examples, but it is far smaller than the hundreds-of-millions-strong breach corpora used by dedicated services. A pass from the local check means your password is not among the most common ones; it does not prove the password has never appeared in any breach anywhere.",
    },
    {
      t: "p",
      text: "For a stronger guarantee, a full breach-lookup service compares your password, usually via a privacy-preserving hash prefix, against a much larger dataset. VaultPass deliberately does not make that network call in its default flow, because the product's core promise is that nothing you type has to leave your device. The bundled local list gives you a meaningful check with zero egress; a dedicated breach service gives you broader coverage at the cost of a network request. Knowing which trade you are making is the point.",
    },
    {
      t: "p",
      text: "The takeaway is simple. The fastest attacks try known passwords first, so the most important thing a password can be is unknown. Generate it, keep it unique, and check the ones you already have. Paste any password into the [analyzer](/analyze) to see where it stands, locally and privately.",
    },
  ],
};
