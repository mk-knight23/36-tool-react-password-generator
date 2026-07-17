import type { ContentDoc } from "@/content/types";

export const apiTokenFormats: ContentDoc = {
  slug: "api-token-formats",
  title: "API token formats: hex, base64url, and prefixed keys",
  description:
    "A developer's guide to token formats: how many bytes you need, why base64url beats plain base64 in URLs, and what a prefix like sk_live_ is really for.",
  summary:
    "Byte counts, encodings, and prefixes for the tokens you generate in real projects.",
  category: "For developers",
  readingTime: "7 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "API tokens for a side project", href: "/use-cases/developer-api-tokens" },
    { label: "Generate an API token", href: "/generate?mode=token" },
    { label: "Environment secret hygiene", href: "/use-cases/env-secrets-hygiene" },
  ],
  body: () => [
    {
      t: "p",
      text: "When you need a token for an API, a webhook signature, a session id, or a password-reset link, the question is not which format looks most professional but how many bytes of randomness you need and how the token will travel. Get the byte count right and the encoding is mostly a matter of where the token has to fit. This guide covers the three formats developers reach for most and when each one makes sense.",
    },
    { t: "h2", text: "Think in bytes, then choose an encoding" },
    {
      t: "p",
      text: "A token's strength is the number of random bytes behind it, not the length of the string you see. One byte is 8 bits. A 16-byte token is 128 bits of entropy, a 24-byte token is 192 bits, and a 32-byte token is 256 bits. For most API keys and session tokens, 128 bits is already comfortably beyond brute force; 256 bits is a common choice when you want a wide margin or need to match a cryptographic key size. Encoding then decides how those bytes are written down: the same 32 random bytes can appear as 64 hex characters or as 43 base64url characters. Same strength, different length.",
    },
    { t: "h2", text: "Hex: simple and unambiguous" },
    {
      t: "p",
      text: "Hexadecimal writes each byte as two characters from `0-9` and `a-f`. It is the most universally safe encoding: it survives URLs, headers, filenames, JSON, and shell commands without escaping, and it is case-insensitive in practice. The cost is length, since hex is exactly twice the byte count in characters. A 32-byte hex token is 64 characters. Reach for hex when you want zero surprises and length is not a concern, for example database seed values, internal service tokens, or anything a human might have to copy by eye.",
    },
    { t: "h2", text: "base64url: compact and URL-safe" },
    {
      t: "p",
      text: "Base64 packs three bytes into four characters, so it is about a third shorter than hex. Plain base64, though, uses `+`, `/`, and `=`, which have special meaning in URLs and filenames and have to be escaped. Base64url is the variant that swaps `+` and `/` for `-` and `_` and drops the padding, so the result drops straight into a URL, a cookie, or a path segment with no escaping. Use base64url when the token rides in a link or a URL and you want it as short as possible, for example email-verification links, magic-login tokens, or public share ids.",
    },
    {
      t: "note",
      text: "If a token will ever appear in a URL, prefer base64url over plain base64. It avoids a whole category of encoding bugs where a + or / gets mangled in transit.",
    },
    { t: "h2", text: "Prefixed keys: the sk_live_ pattern" },
    {
      t: "p",
      text: "Modern APIs often issue keys that begin with a short human-readable prefix, like `sk_live_` or `ghp_`. The prefix is not part of the secret and adds nothing to entropy. Its job is operational. A prefix tells a human, and a secret scanner, what the key is and where it belongs at a glance: `sk_live_` versus `sk_test_` signals production versus test, and a distinctive prefix lets automated scanners spot a leaked key in a commit or a log and flag it before it is abused. When you generate a prefixed token, keep the random part strong on its own; the prefix is a label, not a lock.",
    },
    { t: "h2", text: "Practical defaults" },
    {
      t: "ul",
      items: [
        "**General API key or session token:** 32 bytes, hex or base64url. 256 bits is plenty and future-proof.",
        "**Token in a URL:** base64url, 16 to 32 bytes depending on how short you need it.",
        "**Webhook signing secret:** 32 bytes, hex, stored as an environment variable on both sides.",
        "**Public-facing id that must not be guessable:** 16 bytes base64url is compact and unguessable.",
        "**Human-typed short-lived code:** consider a grouped format instead of a raw token so people can read it back.",
      ],
    },
    { t: "h2", text: "Generating tokens you can trust" },
    {
      t: "p",
      text: "The [API-token generator](/generate?mode=token) produces hex at 16, 24, 32, or 64 bytes, base64url, and prefixed tokens with your own prefix, and it shows the length in both bytes and characters so you can see exactly how much entropy you are getting. It excludes the prefix from the entropy math, because the prefix is not secret, and it never implies that a prefix is registered or reserved; it is just the label you chose. Every token is generated in your browser with Web Crypto and rejection sampling, so the bytes are uniform and nothing leaves the page.",
    },
    {
      t: "p",
      text: "One habit worth keeping regardless of format: a generated token is a live credential the moment it exists. Put it straight into a secret store or an environment variable, never into source control, and rotate it if it is ever exposed. The [environment secret hygiene](/use-cases/env-secrets-hygiene) walkthrough covers that side of the job.",
    },
  ],
};
