# MK VaultPass — Security

Last reviewed: 2026-07-17.

## Responsible disclosure

If you find a security issue, please email **kazi@reprime.com** with steps to
reproduce. Please do not open a public issue for a suspected vulnerability, and
please give a reasonable window to fix before any disclosure. There is no bug
bounty; credit is offered with thanks.

## Threat model summary

The product's core asset is the **secret material generated in the browser**. The
primary threat is any path by which a generated value could leave the device or
be persisted without consent. Everything below serves that model.

### What the product defends against

- **Weak or biased randomness.** All randomness is Web Crypto
  (`crypto.getRandomValues` / `crypto.randomUUID`). `Math.random` appears nowhere
  in `src/` (a unit test enforces this). Uniform selection uses rejection
  sampling; a chi-squared test over 260k+ draws guards against modulo bias.
- **Secret egress.** Default CSP `connect-src 'self'` means the browser can only
  contact this origin. The Playwright smoke asserts zero fetch/XHR during
  generation and that the secret never appears in a request (G3).
- **Silent persistence.** History is off by default; nothing secret is written to
  storage unless the user opts in (verified in `storage.test.ts`).
- **Secrets reaching the AI route.** The request schema has no field that can
  carry a secret; a client-side guard refuses secret-shaped questions before any
  network call; the server re-validates with the same guards and returns a
  structured 422 that echoes nothing.

### Out of scope / honest limits

- **Clipboard auto-clear is best effort.** It only works while the page is open
  and focused, and OS-level clipboard-history tools may still retain a copy. The
  UI says so.
- **In-memory rate limiting is best effort per instance.** It is a courtesy
  guard on the AI route, not a distributed limiter.
- **A compromised device or browser extension** can read anything on the page.
  The product cannot defend against a hostile local environment.
- **Pronounceable-mode entropy is a labelled estimate**, not an exact-uniform
  figure.

## HTTP security headers

Set in `next.config.ts` for every route:

- **Content-Security-Policy** — `default-src 'self'`; `object-src 'none'`;
  `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`;
  `connect-src 'self'` by default. `script-src`/`style-src` allow `'unsafe-inline'`
  (Next.js bootstrap + the inline no-flash theme script + Tailwind inline
  styles); `'unsafe-eval'` is not allowed in the production runtime. GTM/GA
  origins are appended to `script-src`/`connect-src`/`img-src` only when
  `NEXT_PUBLIC_GTM_ID` is set, and the script itself still loads only after
  consent.
- **Strict-Transport-Security** — `max-age=63072000; includeSubDomains; preload`.
- **X-Content-Type-Options** — `nosniff`.
- **X-Frame-Options** — `DENY`.
- **Referrer-Policy** — `strict-origin-when-cross-origin`.
- **Permissions-Policy** — camera, microphone, geolocation, payment, usb, and
  interest-cohort all disabled.
- **Cross-Origin-Opener-Policy** — `same-origin`.

## API route hardening (`POST /api/ai/explain`)

- Zod-validated input with an enum-first schema and a length-capped, guarded
  `question` field.
- Per-IP in-memory token-bucket rate limit (best-effort per instance).
- No sensitive logging; structured error responses that leak nothing.
- BYOK key is read from a request header, never logged, never stored server-side.

## Secret management

- No secrets are hardcoded. AI credentials come from `AI_GATEWAY_API_KEY` (server
  env), a per-request BYOK header, or Vercel OIDC on deploy. Every variable is
  documented in `.env.example`. Only `.env.example` is committed.

## Dependency & secret scanning

- CI runs a **gitleaks** secret scan and a non-blocking `pnpm audit --prod`
  report on every push and pull request.
- Known at last review: one **moderate** transitive advisory
  (`postcss` < 8.5.10, pulled in by `next`, GHSA-qx2v-qp2m-jg93). It affects a
  build-time dependency, not the shipped runtime, and is tracked for resolution
  when the upstream Next.js release bumps it. Recorded here per the honesty
  standard rather than hidden.
