# MK VaultPass — Architecture

Binding contract: `/Users/mkazi/Tools/_shared/STANDARDS.md`. Product spec:
`PRODUCT_SPEC.md`. Design system: `DESIGN_SYSTEM.md`.

## 1. Shape of the system

MK VaultPass is a Next.js App Router application. It has three responsibilities,
and they are deliberately kept apart:

1. **Client-side generation.** Every secret is produced in the browser by
   `src/lib/crypto/random.ts` (Web Crypto). The server never participates in
   generation and never sees a generated value.
2. **Server-rendered content.** Landing, docs, guides, use-cases, legal, and the
   tool shells are rendered by React Server Components and mostly statically
   generated.
3. **One AI route.** `POST /api/ai/explain` answers predefined security
   questions. Its request schema has no field that can carry a secret.

There is no database and no server-side data storage (ADR-003). The only
persistence is in the visitor's own browser.

## 2. Architecture decisions (ADRs)

- **ADR-001 — App Router for content, generation stays client-side.** The server
  renders SEO content and validates AI questions; it never generates or receives
  secrets. Playwright asserts zero egress during generation (G3).
- **ADR-002 — Rejection sampling everywhere, tested statistically.** The legacy
  product's defining bugs were `Math.random` and modulo bias. v2 makes
  uniformity a tested invariant (`random.test.ts` chi-squared), not a review
  hope.
- **ADR-003 — No server database in v1.** All state that exists is local-first
  and genuinely browser-scoped. See `DATABASE.md` for the rationale.
- **ADR-004 — The AI route is physically incapable of receiving a secret.**
  Enum-first schema, a length-capped and content-guarded free-text field, a
  client-side secret-shape refusal, and a server-side re-validation.
- **ADR-005 — History is opt-in with a named risk.** Reverses the legacy default
  of silently persisting plaintext passwords.

## 3. Directory map

```
src/
  app/                 Routes (App Router). Server components + one API route.
    api/ai/explain/    The single AI route (zod + rate limit + secret refine).
    generate/ analyze/ policies/ checklists/ dashboard/ history/ settings/
    docs/ faq/ guides/ use-cases/ (content) + legal + about/creator/etc.
    sitemap.ts robots.ts opengraph-image.tsx  (SEO, file-based)
  components/          UI. `product/` (secret output, entropy ring, boundary),
                       `workspace/` (generator), `ui/` (primitives), `shell/`,
                       `content/`, `analytics/`, `ai/`.
  lib/
    crypto/random.ts   The single source of randomness (Web Crypto only).
    generators/        Nine pure generators + charsets + wordlist asset loader.
    analysis/          Entropy, patterns, common-password, strength, policy.
    ai/                schema, secret-guard, topics, quota, rate-limit, client, byok.
    storage.ts         IndexedDB (opt-in history) + localStorage counts.
    settings.ts theme.ts analytics.ts copy.ts download.ts checklist-state.ts
    seo.ts jsonld.ts site.ts nav.ts   (metadata + config)
  data/                Bundled EFF wordlist + top-1k common passwords (JSON).
  content/             Guides, use-cases, FAQ, checklists, changelog data.
e2e/                   Playwright smoke (port 3102).
```

## 4. Generation data flow

```
User adjusts options / presses Generate
      │  (all in the browser; no network)
      ▼
Workspace.tsx → src/lib/generators/<mode>.ts
      │
      ├─ randomInt / randomString (rejection sampling, Web Crypto)
      ▼
GenerationResult { value, entropyBits, entropyEstimated }
      │
      ├─ rendered in <SecretOutput> (mono, mask/reveal, copy, aria-live)
      ├─ entropy → classifyStrength → <EntropyRing> / <StrengthBar>
      └─ recordGeneration():
             increment non-secret count (localStorage, always)
             write secret to IndexedDB ONLY if history is opted in
```

No step in this flow issues a network request. That is what the G3 Playwright
assertion verifies.

## 5. Client state

Three small reactive stores follow the same pattern so client components can read
them with `useSyncExternalStore` (hydration-safe, no setState-in-effect): a
cached snapshot plus a subscriber set, refreshed by the single writer.

- `settings.ts` — history opt-in, auto-clear delay, sound, analytics consent.
- `storage.ts` — per-mode generation counts (non-secret).
- `checklist-state.ts` — which checklist items are ticked (ids only).
- `ai/quota.ts` and `ai/byok.ts` — daily AI courtesy counter and the BYOK key.

Theme is applied pre-hydration by a tiny inline no-flash script
(`theme.ts:THEME_NO_FLASH_SCRIPT`).

## 6. Server surface

- **Rendering.** Content routes are statically generated (`○`), guides and
  use-cases via `generateStaticParams` (`●`). Only `POST /api/ai/explain` is
  dynamic (`ƒ`).
- **AI route.** zod input → per-IP token-bucket rate limit (in-memory,
  best-effort per instance) → client-tracked quota → gateway model string via the
  Vercel AI SDK v6 → typed response. Auth resolves BYOK header → server env key →
  Vercel OIDC. When no credential is available it returns `ai_unavailable` and
  the client renders the deterministic built-in explanation. See
  `AI_ARCHITECTURE.md`.
- **Security headers.** Set in `next.config.ts` for every route: CSP (default
  `connect-src 'self'`), HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  Referrer-Policy, Permissions-Policy, COOP. See `SECURITY.md`.

## 7. Testing strategy

- **Unit (Vitest, jsdom).** All core lib logic: generators, analysis, crypto
  (including statistical uniformity), storage (history opt-in invariant),
  settings, analytics no-op gate, clipboard, download, AI schema/guard/quota/
  rate-limit/client, and the SEO/JSON-LD builders. Coverage in `TEST_REPORT.md`.
- **E2E (Playwright, port 3102).** The deterministic primary flow on a desktop
  and a mobile viewport, a keyboard pass, and the G3 zero-egress assertion.
- **CI.** `.github/workflows/ci.yml`: typecheck, lint, vitest+coverage, build,
  gitleaks, a non-blocking prod audit, and a non-blocking Playwright job.
