# MK VaultPass — Test Report

Real results only (STANDARDS §15). Captured locally on **2026-07-18** on the
`rebuild/v2` branch. Environment: Node (dev machine), pnpm 11.12.0, Vitest 3.2.7,
Playwright 1.56.

Reproduce with:

```bash
pnpm typecheck
pnpm lint
pnpm test            # or: pnpm test:coverage
pnpm build
pnpm build && pnpm test:e2e
```

## 1. Typecheck — PASS

```
$ pnpm typecheck   ($ tsc --noEmit)
exit 0 (no output)
```

## 2. Lint — PASS (0 errors)

```
$ pnpm lint   ($ eslint)
0 errors.
```

The only warnings emitted locally come from `_legacy_reference/` and the
generated `coverage/` directory, both of which are gitignored and therefore
absent from a CI checkout (and lint runs before coverage is generated in CI), so
CI lint reports no problems.

## 3. Unit tests (Vitest) — PASS

```
$ pnpm test   ($ vitest run)
Test Files  23 passed (23)
     Tests  228 passed (228)
```

Test files:

| Area | File | Focus |
|---|---|---|
| crypto | `crypto/random.test.ts`, `crypto/random.branches.test.ts`, `crypto/no-math-random.test.ts` | rejection sampling + chi-squared uniformity, guard branches, UUID fallback, no-`Math.random` guard |
| generators | `generators/generators.test.ts`, `generators/generators.branches.test.ts` | all nine generators, wordlist checksum, option-validation errors |
| analysis | `analysis/analysis.test.ts`, `analysis/analysis.branches.test.ts` | entropy, patterns, strength, common-list checksum, per-rule policy |
| storage | `storage.test.ts` | history opt-in invariant, counts, CRUD, export/import |
| prefs | `settings.test.ts`, `checklist-state.test.ts`, `theme.test.ts` | reactive stores, defaults, persistence |
| utilities | `copy.test.ts`, `download.test.ts`, `metadata.test.ts`, `analytics.test.ts` | clipboard auto-clear, blob download, SEO/JSON-LD, analytics no-op gate |
| ai | `ai/schema.test.ts`, `ai/secret-guard.test.ts`, `ai/quota.test.ts`, `ai/rate-limit.test.ts`, `ai/prompt.test.ts`, `ai/byok.test.ts`, `ai/client.test.ts`, `api/ai/explain/route.test.ts` | secret-rejection, quota, rate limit, BYOK, client orchestration, route |

## 4. Coverage (Vitest v8, scoped to `src/lib/**`) — PASS

```
$ pnpm test:coverage
=============================== Coverage summary ===============================
Statements   : 96%    ( 1756/1829 )
Branches     : 87.54% ( 457/522 )
Functions    : 98.49% ( 131/133 )
Lines        : 96%    ( 1756/1829 )
================================================================================
```

Per-area (statements / branches):

| Area | Stmts | Branch |
|---|---|---|
| `lib/analysis` | 100% | 97.40% |
| `lib/generators` | 95.74% | 90.69% |
| `lib/crypto` | 94.33% | 94.87% |
| `lib/ai` | 94.66% | 85.00% |
| `lib` (root utilities) | 96.07% | 80.25% |

All core-logic modules exceed the 80% target. The remaining uncovered lines are
mostly unreachable defensive branches (for example, `storage.ts`
`navigator.storage.estimate`, which jsdom does not implement) and bounded
rejection-loop fall-throughs that are not deterministically triggerable in a
unit test.

## 5. Build — PASS

```
$ pnpm build   ($ next build)
✓ Compiled successfully
Route (app): all content routes static (○), guides/use-cases SSG (●),
/api/ai/explain dynamic (ƒ). /checklists present.
```

## 6. Playwright smoke (port 3102) — PASS

```
$ pnpm build && pnpm test:e2e
Running 6 tests using 5 workers
  ✓ [desktop-chromium] generates a password locally and shows its strength
  ✓ [desktop-chromium] keyboard: '.' regenerates a fresh secret
  ✓ [desktop-chromium] zero egress … never transmits the secret (G3)
  ✓ [mobile-chromium]  generates a password locally and shows its strength
  ✓ [mobile-chromium]  keyboard: '.' regenerates a fresh secret
  ✓ [mobile-chromium]  zero egress … never transmits the secret (G3)
  6 passed (4.7s)
```

Covers the deterministic (no-AI) primary flow on a desktop and a mobile (Pixel 7)
viewport, a keyboard regenerate pass, and the PRODUCT_SPEC G3 zero-egress
assertion (no fetch/XHR during generation; the secret never appears in any
request). The README screenshot is captured by this suite. Port 3102 is released
after the run.

## 7. Dependency audit (non-blocking report)

```
$ pnpm audit --prod
1 vulnerabilities found — Severity: 1 moderate
postcss < 8.5.10 (transitive via next), GHSA-qx2v-qp2m-jg93
```

Build-time transitive dependency, not shipped runtime code. Tracked for
resolution on the next upstream Next.js bump; recorded here rather than hidden.

## 8. Status

Locally verified: typecheck, lint, unit tests + coverage, build, and the
Playwright smoke are all green on `rebuild/v2`. Production deployment and
production verification are orchestrator-owned and out of scope for this stage.
