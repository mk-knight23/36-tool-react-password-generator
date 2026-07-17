import type { ContentDoc } from "@/content/types";

export const passwordPoliciesThatWork: ContentDoc = {
  slug: "password-policies-that-work",
  title: "Password policies that work (and the ones that backfire)",
  description:
    "Modern password-policy advice grounded in current guidance: length over complexity, screen against known-breached passwords, and stop forced rotation.",
  summary:
    "What to require, what to drop, and how to write a policy people will actually follow.",
  category: "For teams",
  readingTime: "7 min read",
  datePublished: "2026-07-17",
  howTo: {
    name: "Write a workable password policy",
    description:
      "A short sequence for drafting a password policy that improves security without pushing people toward workarounds.",
    steps: [
      {
        name: "Set a length floor",
        text: "Require at least 12 characters for standard accounts and 14 or more for administrative ones. Length is the single biggest lever.",
      },
      {
        name: "Allow long secrets and all characters",
        text: "Permit at least 64 characters and accept spaces and every printable symbol so passphrases and password managers work.",
      },
      {
        name: "Screen against known-breached lists",
        text: "Reject passwords that appear in common-password or breach corpora instead of forcing character-class rules.",
      },
      {
        name: "Stop scheduled rotation",
        text: "Drop calendar-based expiry; rotate only on evidence of compromise.",
      },
    ],
  },
  related: [
    { label: "Common password lists and why they matter", href: "/guides/common-password-lists" },
    { label: "Build and validate a policy", href: "/policies" },
    { label: "Entropy, explained", href: "/guides/entropy-explained" },
  ],
  body: () => [
    {
      t: "p",
      text: "Most password rules were written for a threat model that no longer matches how accounts actually get broken into. The classic mix of forced complexity and monthly expiry made passwords harder for people and barely harder for attackers. Current guidance from bodies like NIST has moved decisively toward length, screening, and stability. This guide covers what to require, what to remove, and how to phrase it so people comply instead of routing around it.",
    },
    { t: "h2", text: "Require length, not character-class gymnastics" },
    {
      t: "p",
      text: "Length is the biggest lever you have. A 14-character secret drawn from a small alphabet still beats an 8-character one stuffed with symbols. Set a floor of at least 12 characters for normal accounts and 14 or more for administrators and service accounts. Resist the urge to also demand one uppercase, one digit, and one symbol. Those rules push people toward predictable patterns like a capital at the front and a bang at the end, which cracking tools expect. If you want a strength target instead of a rule of thumb, aim for roughly 75 bits of entropy for standard accounts.",
    },
    { t: "h2", text: "Allow long inputs and every character" },
    {
      t: "p",
      text: "A policy that improves security has to permit the tools that produce strong secrets. That means accepting at least 64 characters, allowing spaces so passphrases work, and accepting every printable symbol rather than silently stripping some. Never truncate a submitted password, and never block pasting. Blocking paste breaks password managers and pushes people toward shorter, memorable, weaker secrets. These are small backend choices that quietly decide whether your users can be secure at all.",
    },
    { t: "h2", text: "Screen against known-bad passwords" },
    {
      t: "p",
      text: "The highest-value check is not a complexity rule; it is a deny-list. When a user sets a password, compare it against a corpus of common and previously breached passwords and reject matches. This blocks the passwords attackers try first, which is where credential-stuffing gets its wins. VaultPass ships a bundled top-thousand common-password list and checks against it locally in the [analyzer](/analyze); production systems typically use a much larger breach corpus. Either way, the principle is the same: stop the guessable ones at the moment they are chosen.",
    },
    { t: "h2", text: "Stop forcing scheduled rotation" },
    {
      t: "p",
      text: "Mandatory 30-, 60-, or 90-day password changes are one of the most counterproductive habits still in place. When people are forced to change a password on a schedule, they make small predictable edits, incrementing a trailing number or shifting a symbol, which an attacker who has one version can often guess. Rotate credentials when there is evidence of compromise, when someone leaves, or when a shared secret has been exposed. Not on a calendar.",
    },
    {
      t: "note",
      text: "Rotation on evidence, not on schedule. A forced monthly change usually produces a weaker sequence of passwords than leaving a strong one in place.",
    },
    { t: "h2", text: "Lean on the controls that actually stop attacks" },
    {
      t: "ul",
      items: [
        "**Multi-factor authentication** blocks the large majority of account takeovers even when a password leaks. It is worth more than any password rule.",
        "**Rate limiting and lockout** on login endpoints turn online guessing from feasible into pointless.",
        "**Breach monitoring** lets you rotate exactly the credentials that need it, when they need it.",
        "**A password manager** lets people keep a unique strong secret per site without memorizing anything.",
      ],
    },
    { t: "h2", text: "Write it so people can follow it" },
    {
      t: "p",
      text: "A policy nobody reads changes nothing. Keep it to a page. State the length floor, say that passphrases and password managers are encouraged, explain the deny-list in one sentence, and give a concrete example of an acceptable secret. Tell people where to generate one. Explain the reasoning briefly, because a rule people understand is a rule they keep.",
    },
    {
      t: "p",
      text: "You can draft and test the mechanical parts on the [policies page](/policies): compose length and character requirements, export the rules as JSON and readable text, and paste a candidate password to check it against the policy locally. Pair that with the [checklists](/checklists) for rollout, and you have a policy that raises the floor without making security something people try to escape.",
    },
  ],
};
