# MK VaultPass — Rebuild Audit (v2)

Audit source: `/Users/mkazi/Tools/_shared/audits/36-tool-react-password-generator.json` (Agent A, evidence-based).
Spot-checked by Agent B on 2026-07-17 against the working tree at commit `e5acdba` — every claim checked below was confirmed in code.

## 1. What this repo actually is

Despite the repo name (`36-tool-react-password-generator`), the legacy app is a **Vue 3 + Vite** static SPA (~2,600 LOC in `src/`), styled as a retro CRT terminal, deployed at `https://36-tool-vaultpass-secure-password-g.vercel.app/`. Three generation modes (random / pronounceable / passphrase), batch generation, HIBP breach check, localStorage history, keyboard shortcuts.

## 2. Critical findings (must fix in v2)

| # | Finding | Evidence | Spot-checked |
|---|---------|----------|:---:|
| 1 | `Math.random()` inside secret generation | `src/composables/usePronounceable.ts:23` (pair chance) and `:51` (charset choice) | ✅ confirmed |
| 2 | Modulo bias in **all** generators (`array[i] % chars.length`) | `useGenerator.ts:47`, `usePassphrase.ts:31`, `usePronounceable.ts:12` | ✅ confirmed (useGenerator.ts:47, usePronounceable.ts:12) |
| 3 | Plaintext passwords persisted to localStorage **by default** (`vault-history`, 50 entries, exportable unencrypted) | `src/stores/vaultStore.ts` (`useLocalStorage('vault-history')` + `addToHistory`) | ✅ confirmed |
| 4 | Trust-breaking copy: hero says "No data transmitted. No storage." while every generation sends a SHA-1 prefix to `api.pwnedpasswords.com` and stores plaintext history | `src/App.vue:82-84,101-104` vs `backendService.ts:30`, `vaultStore.ts` | — (trusted) |
| 5 | Correlated randomness: same random value reused for appended digit and capitalization index | `usePassphrase.ts:38-41` | — (trusted) |
| 6 | "EFF wordlist" comment is false — hand-rolled ~100-word list with duplicates (~6.6 bits/word vs EFF's 12.9); passphrase strength materially overstated | `usePassphrase.ts:3-19` | — (trusted) |
| 7 | Strength meter formula assumes uniform random characters — invalid for passphrase/pronounceable modes | `useStrength.ts:9-15` | — (trusted) |
| 8 | Google Fonts loaded from external CDNs on a privacy-positioned tool | `index.html:8-10`, `style.css:2` | — (trusted) |
| 9 | No CSP / security headers on the actual deploy target (only in unused `firebase.json`) | `vercel.json`, `netlify.toml` | — (trusted) |

**v2 consequences (binding):** all secret generation uses `crypto.getRandomValues` with **rejection sampling** (no modulo on non-power-of-two ranges); bundle the real EFF large wordlist; history strictly **opt-in**, documented as a shared-machine risk, one-click wipe; HIBP-style checks (if kept) opt-in with explicit disclosure; no external font CDNs; security headers in `next.config.ts`.

## 3. Broken functionality found

- **Settings panel unreachable**: `App.vue openSettings()` only plays a sound; `settingsStore.toggleHelp` has zero callers — the entire panel is dead UI in production.
- **Toasts never render**: `useToast()` creates a fresh local ref per call (no module singleton); ToastContainer renders a permanently empty array. "Password copied!" never appears for live users.
- **Pronounceable syllable logic buggy**: `randomChar('cv vc cvc vcc ccv')` picks ONE character (possibly a space) instead of one of five patterns — output is not the intended pronounceable structure.
- **Two conflicting theme systems** acting on different state (settings store vs `useDark` on body with inverted semantics).
- **Fake stats**: visit/generation/copy counters shown in the (unreachable) panel never increment — `recordVisit` etc. have zero callers.
- **Placeholder tests**: `src/test/password.test.ts` imports zero app code; real coverage of crypto logic is 0%.
- **Ghost Tailwind classes**: `text-retro-gray` / `bg-retro-black` etc. used throughout but defined nowhere — silently produce no CSS.
- **False docs**: `docs/endpoints.md` documents a `/api/health` endpoint that doesn't exist; README claims "100/100 score", "69-Agent Opencode Collective".
- **Unimplemented shortcuts** advertised in the settings panel (`ctrl+/`, `ctrl+s`).

## 4. Worth preserving (copied to `_legacy_reference/`, gitignored)

| Asset | Why |
|---|---|
| `services/backendService.ts` | HIBP k-anonymity implementation (SHA-1 via `crypto.subtle`, 5-char prefix) is genuinely well-built; weak-pattern analyzer + recommendations engine are portable pure TS |
| `composables/useGenerator.ts` | `crypto.getRandomValues` core + charset config + exclude-similar (port after fixing modulo bias) |
| `composables/useStrength.ts` | Entropy calculation — valid for random mode only |
| `composables/usePassphrase.ts`, `usePronounceable.ts` | Algorithm shape reference (both need RNG fixes) |
| `composables/useAudio.ts` | Dependency-free Web Audio UI sounds |
| `composables/useKeyboard.ts` | Clean shortcut handling with input-focus guards |
| `components/AuditLog.vue` | UX patterns: masked history, inline notes, search + filters |
| `components/GeneratorCore.vue` | Batch generation UX (quantity slider, per-item copy, copy-all, download) |
| `styles/style.css` | Legacy retro-terminal design system (see ADR-002 below — NOT the v2 direction) |
| `types/index.ts` | `PasswordConfig` / `PasswordStrength` / `GeneratedHistory` types |
| `config/firebase.json` | Security-headers pattern to port into `next.config.ts` |

## 5. Other risks recorded

- 7 GitHub workflows including autonomous "evolution" bots that commit to `main` — must be disabled/removed before productizing (unreviewed automated commits).
- `docs/` contains ~30 AI-generated marketing files (fake API docs, scripts) — purge in rebuild.
- Duplicate deploy configs (root + `deployment/` + `firebase.json` + `netlify.toml` + Dockerfile) — actual target is Vercel.
- Repo identity confusion: named "react", built in Vue, deployed under a third name.

## 6. Tool availability (STANDARDS §0 fallbacks)

- **Graphify** ❌ not installed → used direct repository inspection + the Agent A audit JSON instead of graph queries.
- **Humanizer** ❌ not installed → all public copy passes the manual voice audit in STANDARDS §9, independently re-checked at QA.
- **RALPH** ❌ not installed → iterative verify loops (typecheck/test/build/browser) used instead.
- Available and used: Superpowers ✅, **UI UX Pro Max ✅** (`ui-ux-pro-max` skill ran for this design system — output adapted, see DESIGN_SYSTEM.md §1), gstack ✅.

## 7. Architecture Decision Records

### ADR-001 — Rebuild on Next.js App Router (orchestrator decision, binding)

**Decision:** MK VaultPass v2 is rebuilt on Next.js (App Router, `src/`, TypeScript strict, Tailwind v4) per the shared STANDARDS contract, like all five products in this portfolio wave.

**The audit's dissenting recommendation (recorded honestly):** Agent A recommended **against** migration — keep the Vue 3 + Vite static SPA. Its reasoning: a statically-hosted SPA is the strongest trust story for a local-only secrets tool (no server ever touches secrets, auditable static bundle); the legacy app builds green; every real defect is a wiring/logic bug fixable in hours; SEO applies only to the marketing shell. It judged Next.js unnecessary "either way."

**Why the orchestrator overrode it:** the v2 product spec is materially bigger than the audited app. It requires (a) server-rendered public content hubs — 8+ guides, 5+ use-cases, docs, FAQ with per-page metadata and JSON-LD, where the audit itself notes the live SPA serves "zero SEO-visible content"; (b) a serverless AI route (`/api/ai/explain`) with server-side zod validation and rate limiting, which a static SPA cannot host; (c) portfolio-level stack standardization across five products (a trigger the audit itself conceded as the one defensible migration reason).

**Preserving the audit's core concern:** the trust story survives because the architecture enforces it — all secret generation runs client-side via Web Crypto; no secret ever appears in a request body; the single AI route's schema physically cannot receive secret material (see PRODUCT_SPEC.md §7). This boundary is documented, diagrammed in the UI, and tested.

### ADR-002 — New visual identity (departure from legacy retro-CRT)

The audit called the retro-terminal design "a distinctive, memorable visual identity worth keeping." The orchestrator's visual direction for MK VaultPass is instead **high-trust, precise, minimal, strong contrast** (vault mechanisms, entropy ring, security-boundary diagram, restrained glass). Rationale: the retro-CRT aesthetic reads as a toy/novelty; a security product competing on trust needs an identity that signals engineering precision. The legacy CSS is preserved in `_legacy_reference/styles/` if the retro look is ever wanted as an easter-egg theme. Dissent recorded; direction is binding.

### ADR-003 — No server database in v1

All persistence is local (IndexedDB via `idb`, localStorage for tiny prefs). Secret history is opt-in, local-only, wipeable. Rationale in DATABASE.md (next stage). This also keeps the zero-egress guarantee auditable.
