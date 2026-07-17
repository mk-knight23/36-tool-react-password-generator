# MK VaultPass

A password and secret **generator** that runs entirely in your browser. Every
value it produces is made on your device with the Web Crypto API and never
leaves it. The point of the product is to make that boundary visible, testable,
and documented rather than merely claimed.

**MK VaultPass is not a password manager.** It does not sync, and it does not
store what you generate unless you explicitly turn on local history. Save what
you generate in a real password manager.

- Production: https://vaultpass.mkazi.live
- Repository: https://github.com/mk-knight23/36-tool-react-password-generator
- License: MIT

![The MK VaultPass generator producing a 129-bit password with a live entropy ring and strength meter](docs/screenshots/generate.png)

_Screenshot captured by the Playwright smoke test (`e2e/smoke.spec.ts`)._

## What it does

Nine generators, all local:

- **Password** — length 8–128, per-set toggles, "must include" and "exclude"
  rules, exclude-ambiguous, and an optional guarantee of one character per set
  (satisfied by rejection, never by biased splicing).
- **Passphrase** — the bundled EFF large wordlist (7,776 words), 3–10 words,
  separators, capitalization, appended digits.
- **Pronounceable** — whole-syllable patterns (fixes the legacy bug that picked a
  single character, often a space); entropy is a labelled estimate.
- **PIN** — 4–12 digits with optional trivial-sequence rejection; entropy is
  reported honestly (a 4-digit PIN is weak; device lockout is the real defence).
- **UUID v4**, **random string** (named or custom alphabets), **API token**
  (hex / base64url / prefixed), **recovery codes** (printable sheet), and
  **Wi-Fi password** (WPA2/WPA3-aware, ≤63 chars).

Plus a local **analyzer** (entropy, patterns, common-password check, policy
compliance), a **policy builder/validator**, interactive **checklists**, an
opt-in local **history** and **dashboard**, and a single AI explainer route that
is designed so it cannot receive a secret.

## Why the boundary holds

- All randomness comes from `crypto.getRandomValues` / `crypto.randomUUID`.
  `Math.random` appears nowhere in `src/` (enforced by a unit test).
- Uniform selection uses rejection sampling. A chi-squared test over 260k+ draws
  guards against reintroduced modulo bias.
- The default Content-Security-Policy is `connect-src 'self'`, so the browser can
  only talk back to this origin. The Playwright smoke asserts zero fetch/XHR
  during generation and that the secret never appears in any request (G3).
- The AI route's request schema has no field that can carry a secret; a
  client-side guard refuses secret-shaped questions before any network call, and
  the server re-validates.

See `PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `SECURITY.md`, and `PRIVACY.md`.

## Tech stack

Next.js (App Router, `src/`), TypeScript strict, Tailwind CSS v4,
`lucide-react`, Zod for API validation, `idb` for the opt-in history store,
Vitest + Testing Library for unit tests, Playwright for the smoke suite.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

The core product needs no environment variables and no API keys.

## Environment variables

Copy `.env.example` to `.env.local`. Every variable is optional.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical/OG/sitemap origin | `https://vaultpass.mkazi.live` |
| `NEXT_PUBLIC_GTM_ID` | GTM container id; unset ⇒ analytics fully off | unset |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | Ad slot flag (prepared, off) | `false` |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key for the AI route | unset |
| `AI_MODEL` / `AI_MODEL_QUALITY` | Gateway model slugs | `anthropic/claude-haiku-4.5` / `…sonnet-4-5` |

With none set, generation, analysis, policies, checklists, history, and the
dashboard all work; the AI route degrades to its built-in non-AI explanations.

## Testing

```bash
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint
pnpm test             # vitest run (228 tests)
pnpm test:coverage    # vitest run --coverage
pnpm build            # next build
pnpm build && pnpm test:e2e   # Playwright smoke on port 3102
```

Latest local results and coverage are recorded in `TEST_REPORT.md`.

## Architecture, at a glance

Generation is 100% client-side. The server renders content (guides, use-cases,
docs) and hosts one AI route (`POST /api/ai/explain`) that validates input and
cannot receive secrets. There is no database and no server-side data storage;
the only persistence is in the visitor's browser (IndexedDB for opt-in history,
localStorage for tiny non-secret preferences). Details in `ARCHITECTURE.md`,
`AI_ARCHITECTURE.md`, and `DATABASE.md`.

## Deployment

Deploys to Vercel as a standard Next.js App Router app. Security headers ship via
`next.config.ts`. See `DEPLOYMENT.md` for the checklist and the production
verification steps. Deployment is orchestrator-owned; squad agents do not deploy.

## Privacy

Nothing you generate leaves your device. Analytics is consent-gated and off by
default, and may only ever receive event names, mode names, and bucketed
counts/durations — never a generated value. Full detail in `PRIVACY.md`.

## Roadmap

- QR rendering for Wi-Fi passwords (local-only, with a clear note).
- Optional local breach-check tooling beyond the bundled common-password list.
- Additional export formats for recovery sheets.

These are intentionally out of v1 scope (see `PRODUCT_SPEC.md` §3).

## Author

Built and maintained by **Kazi Musharraf** — AI Engineer, Full-Stack Developer,
Open-Source Builder.

- GitHub: https://github.com/mk-knight23
- Portfolio: https://www.mkazi.live

## License

MIT © 2026 Kazi Musharraf. See `LICENSE`.
