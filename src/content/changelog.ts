/**
 * Release notes. Kept honest per STANDARDS §15: entries describe work that is
 * actually in the codebase, grouped by area. Dates are ISO (YYYY-MM-DD).
 */
export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.0.0",
    date: "2026-07-17",
    title: "Local-first rebuild",
    changes: [
      "Rebuilt from the ground up as a local-first toolkit: every secret is generated in your browser with the Web Crypto API and never sent anywhere.",
      "Replaced biased and general-purpose randomness with a single crypto module using rejection sampling for uniform output, backed by a statistical chi-squared test.",
      "Added a build-failing guard that rejects any general-purpose random call in the source, so the randomness rule is enforced rather than assumed.",
      "Nine generators: password, passphrase (EFF large wordlist), pronounceable, PIN, UUID v4, random string, API token, Wi-Fi key, and recovery codes, plus bulk generation and printable recovery sheets.",
      "Local strength analyzer with an entropy estimate, pattern detection, and a bundled top-thousand common-password check, all with no network request.",
      "History is now off by default with a clear warning when enabled, reversing the earlier silent plain-text storage. One-click wipe and local export/import added.",
      "Clipboard auto-clear after copying, with the best-effort limits stated in the interface.",
      "Optional AI question feature designed so it physically cannot receive a secret, with an honest built-in fallback when it is unavailable and bring-your-own-key support.",
      "Full content set: how-it-works docs, guides, use-cases, FAQ, and legal pages, with structured data and a consent-gated analytics setup that is off by default.",
      "New design system: high-contrast light and dark themes, the entropy ring, the local-security boundary diagram, and accessibility work toward WCAG 2.2 AA.",
    ],
  },
];
