import type { ContentDoc } from "@/content/types";

export const developerApiTokens: ContentDoc = {
  slug: "developer-api-tokens",
  title: "Generating API tokens for a side project",
  description:
    "A developer's workflow for producing hex, base64url, and prefixed tokens for a side project, and keeping them out of source control.",
  summary:
    "Hex, base64url, and prefixed tokens for real projects, generated locally and kept out of git.",
  category: "For developers",
  readingTime: "5 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "API token formats explained", href: "/guides/api-token-formats" },
    { label: "Environment secret hygiene", href: "/use-cases/env-secrets-hygiene" },
    { label: "Generate an API token", href: "/generate?mode=token" },
  ],
  body: () => [
    {
      t: "p",
      text: "You are wiring up a side project on a Friday night. The webhook needs a signing secret, the admin API needs a key, and the seed script wants a couple of random ids. You could paste a snippet from a search result into a random online generator, but you have no idea what that site does with the bytes it hands back. This is the everyday case MK VaultPass is built for: producing real credentials fast, locally, with no reason to wonder where they went.",
    },
    { t: "h2", text: "The situation" },
    {
      t: "p",
      text: "A single developer, a handful of secrets, and a strong preference for keyboard speed over ceremony. You want tokens that are strong by default, in a format that fits where each one lives, and you want to confirm nothing left your machine. You are the kind of person who opens the network tab to check.",
    },
    { t: "h2", text: "A workflow that fits" },
    {
      t: "ol",
      items: [
        "Open the [API-token generator](/generate?mode=token) and pick 32 bytes for the webhook signing secret. That is 256 bits, comfortably beyond brute force. Copy it; the copy notice offers to clear your clipboard after a delay so it does not linger.",
        "Switch the format to base64url for a token that will appear in a URL, such as a share link or a verification link, so it needs no escaping.",
        "For the admin API key, turn on a prefix like `sk_live_` so you can tell it apart from a test key at a glance and so secret scanners can spot it if it ever leaks. The prefix is a label and is excluded from the entropy math.",
        "Drop each value straight into your `.env.local`, never into a committed file, and move on.",
      ],
    },
    {
      t: "note",
      text: "The byte-and-character readout shows both lengths at once, so you can see that a 32-byte hex token is 64 characters and confirm you are getting the entropy you asked for.",
    },
    { t: "h2", text: "Why generate locally for this" },
    {
      t: "p",
      text: "A token is a live credential the instant it exists. Generating it on a third-party server means, in the worst case, that server saw your production signing secret before you did. VaultPass sidesteps the question entirely by generating in your browser with Web Crypto and rejection sampling, so the bytes are uniform and the value never travels. You can prove it: open developer tools, watch the network tab, and generate a dozen tokens. Nothing leaves.",
    },
    { t: "h2", text: "Where this stops" },
    {
      t: "p",
      text: "VaultPass generates the token; it does not manage it. It will not store your keys, rotate them on a schedule, or inject them into a deployment. That is deliberate, and it is the honest boundary of a generator. Once you have a token, put it in a real secret store or your host's environment settings, keep it out of git, and rotate it if it is ever exposed. The [environment secret hygiene](/use-cases/env-secrets-hygiene) walkthrough covers that side, and the [API token formats](/guides/api-token-formats) guide goes deeper on choosing byte counts and encodings.",
    },
  ],
};
