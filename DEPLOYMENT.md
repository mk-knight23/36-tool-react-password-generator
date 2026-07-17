# MK VaultPass — Deployment

Target: **https://vaultpass.mkazi.live** (Vercel). Deployment is orchestrator-
owned; squad agents build and verify locally but do not deploy or attach the
domain (STANDARDS §0, §14).

## Platform

Standard Next.js App Router application. It deploys to Vercel with no custom
server and no database. There is no server-side state to provision.

## Environment variables

All are optional; the deterministic core product works with none set. Configure
in the Vercel project settings (see `.env.example` for the annotated list).

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Build | Set to `https://vaultpass.mkazi.live` in production so canonicals/OG/sitemap are correct. |
| `NEXT_PUBLIC_GTM_ID` | Build | Leave unset to keep analytics fully off. Setting it also widens the CSP to allow GTM/GA, but the script still loads only after consent. |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | Build | Keep `false` (no publisher id exists). |
| `AI_GATEWAY_API_KEY` | Server | Optional. On Vercel, OIDC can provide gateway auth instead, so this can stay unset. |
| `AI_MODEL` / `AI_MODEL_QUALITY` | Server | Gateway model slugs; change here without code edits. |

The AI route resolves auth as: per-request BYOK header → `AI_GATEWAY_API_KEY` →
Vercel OIDC. With none available it returns `ai_unavailable` and the client shows
the built-in non-AI explanation.

## Pre-deploy checklist

Run locally and confirm green before promoting:

```bash
pnpm install --frozen-lockfile
pnpm typecheck        # exit 0
pnpm lint             # 0 errors
pnpm test             # 228 passed
pnpm build            # compiles; routes generated
pnpm build && pnpm test:e2e   # Playwright smoke on port 3102, 6 passed
```

These same steps run in CI (`.github/workflows/ci.yml`). Confirm the CI run is
green on `rebuild/v2` before any production promotion.

## Deploy

1. Confirm the correct repository and branch.
2. Ensure production env vars are set (at minimum `NEXT_PUBLIC_SITE_URL`).
3. Build via Vercel (the platform runs `pnpm build`).
4. Verify the preview URL before promoting to production.
5. Attach the `vaultpass.mkazi.live` domain (orchestrator step; the account note
   in STANDARDS §0 applies — deploy to `*.vercel.app` first).

## Production verification

After deploy, verify on the live URL:

- The generator works end-to-end with no AI key (deterministic path).
- Response headers include the CSP (`connect-src 'self'` when GTM is unset), HSTS,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, Referrer-Policy,
  Permissions-Policy, and COOP.
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/humans.txt`, and
  `/.well-known/security.txt` resolve, and canonicals use the production origin.
- The OG image renders and metadata is correct on a few routes.
- The consent banner defaults to declined and no analytics script loads before
  acceptance.
- Mobile and desktop layouts, keyboard shortcuts, and the print recovery sheet
  behave as expected.

## Rollback

Redeploy the previous known-good deployment from the Vercel dashboard, or push a
revert commit and let CI/Vercel rebuild. There is no database migration and no
persistent server state, so rollback is a single redeploy with no data
considerations.
