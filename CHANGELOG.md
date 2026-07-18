# Changelog

All notable changes to MK VaultPass are recorded here. Entries describe work that
is actually in the codebase (STANDARDS §15). Dates are ISO (YYYY-MM-DD). This
project follows [Semantic Versioning](https://semver.org/).

## [2.1.0] — 2026-07-18

### Focused Product Transformation
- **Homepage Integration**: Embedded the client-side `Workspace` directly on the homepage.
- **Auto-generation on Mount**: Auto-generate a secure password as soon as the user opens the page.
- **Basic Mode Layout**: Simplified default interface showing only password length, strength metrics, and copy/regenerate.
- **Collapsible Advanced Options**: Grouped alternative generator modes (PIN, Wi-Fi, UUID, etc.) and bulk options inside a collapsible Settings section.
- **Post-Copy Instructions**: Added visual reminder to save the generated password in a dedicated manager after copying.
- **Layout and Navigation refinement**: Split header menu links and added a link to the GitHub repository.

## [2.0.0] — 2026-07-17

Local-first rebuild. A complete rewrite of the legacy password generator into a
zero-egress, browser-only secret generator toolkit.

### Added

- Nine generators — password, passphrase (bundled EFF large wordlist, 7,776
  words), pronounceable, PIN, UUID v4, random string, API token, Wi-Fi key, and
  recovery codes — plus bulk generation and printable recovery sheets.
- Local strength analyzer: entropy estimate, pattern detection (repetition,
  sequences, keyboard runs), and a bundled top-1,000 common-password check, all
  with no network request.
- Password-policy builder and validator, interactive checklists, an opt-in local
  history, and a dashboard that shows only real local counts.
- Optional AI explainer (`POST /api/ai/explain`) designed so it cannot receive a
  secret, with an honest built-in fallback and bring-your-own-key support.
- Full content set: how-it-works docs, 8 guides, 5 use-cases, a 14-entry FAQ, and
  legal pages, with JSON-LD structured data and a consent-gated analytics setup
  that is off by default.
- Design system with high-contrast light and dark themes, the entropy-ring and
  local-security-boundary metaphors, and accessibility work toward WCAG 2.2 AA.
- Test suite: 228 Vitest unit tests (including statistical RNG, wordlist and
  common-list checksums, the history opt-in invariant, and AI schema/guard
  tests) and a Playwright smoke suite on port 3102 with a zero-egress assertion.
- CI pipeline: typecheck, lint, unit tests with coverage, build, gitleaks secret
  scan, a non-blocking production audit, and a non-blocking Playwright job.

### Changed

- Replaced biased and general-purpose randomness with a single Web Crypto module
  using rejection sampling, backed by a chi-squared statistical test.
- History is now off by default with a clear warning when enabled, reversing the
  earlier silent plaintext storage. Added one-click wipe and local export/import.
- Copying a secret now schedules a best-effort clipboard auto-clear, with its
  limits stated plainly in the interface.

### Fixed

- Pronounceable mode now selects whole syllable patterns instead of a single
  character (often a space), fixing the broken legacy output.
- Corrected the `LICENSE` copyright holder to Kazi Musharraf.

### Security

- Default Content-Security-Policy is `connect-src 'self'`; added HSTS, nosniff,
  frame-deny, Referrer-Policy, Permissions-Policy, and COOP headers.
- Added a build-failing guard that rejects any general-purpose random call in the
  source, so the randomness rule is enforced rather than assumed.
