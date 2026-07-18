# MK VaultPass — Product Specification (v2)

Product: **MK VaultPass** · Domain: `https://vaultpass.mkazi.live` · Repo: `https://github.com/mk-knight23/36-tool-react-password-generator`
Author: Kazi Musharraf. Open source (MIT). Binding contract: `/Users/mkazi/Tools/_shared/STANDARDS.md`.

## 1. Objective

A password and secret **generator toolkit** that runs 100% in the browser. Every secret is produced by Web Crypto (`crypto.getRandomValues`) on the user's device and never leaves it. The product earns trust by making that boundary visible, testable, and documented — not by claiming it.

**One-sentence positioning:** "Generate passwords, passphrases, tokens, and recovery codes locally — nothing you generate ever touches a server."

**Explicit disclaimer (must appear on `/`, `/generate`, `/docs`, `/faq`, README):** MK VaultPass is **NOT a password manager**. It does not sync, store (unless you explicitly opt in to local history), or protect secrets after generation. Use a real password manager to store what you generate.

## 2. Personas

1. **The developer** — needs API tokens, hex/base64 secrets, UUIDs, `.env` values, recovery-code sheets for a side project. Wants keyboard-first speed, bulk mode, and copy that just works. Skeptical: will open DevTools' network tab to check egress.
2. **The security-conscious professional** — needs strong passwords/passphrases for accounts, cares that generation is local and auditable, reads the "how it works" page before trusting the tool.
3. **The IT admin / team lead** — needs Wi-Fi passwords, password policies for the team, policy compliance checks, printable recovery sheets, environment-secret and key-rotation checklists.
4. **The everyday user arriving from search** — landed on a guide ("how strong should a Wi-Fi password be"); needs the tool to work instantly with safe defaults and plain-language explanation.

## 3. Non-goals (v1)

- NOT a password manager: no vault storage, no sync, no encryption-at-rest product claims.
- No accounts, no server-side persistence, no database (ADR-003).
- No browser extension, no mobile app.
- No breach-check network call in the default flow (any HIBP-style feature is out of v1 scope; the bundled top-1k common-password list covers the local check).
- No AI feature beyond the single `/api/ai/explain` route.
- No paid tier, no ads enabled (AdSense prepared but disabled per STANDARDS §7).

## 4. Page map (STANDARDS §4)

| Route | Purpose |
|---|---|
| `/` | Landing: positioning, local-security boundary diagram, live mini-generator demo, honest feature grid, NOT-a-password-manager notice |
| `/generate` | Workspace: all generator modes via segmented tabs (see §5). Deep-linkable: `/generate?mode=passphrase` |
| `/analyze` | Local analysis: entropy, strength, pattern detection, common-password check, policy compliance |
| `/policies` | Password-policy generator + validator |
| `/checklists` | Environment-secret checklist, API-key rotation checklist, security-policy templates (static content) |
| `/dashboard` | Local counts only (generations by type, session stats from IndexedDB) — honest empty state when unused |
| `/history` | Opt-in secret history (OFF by default): masked entries, reveal, notes, search, one-click wipe, shared-machine warning |
| `/settings` | History opt-in toggle, auto-clear delay, theme, sound, consent, BYOK for AI, clear/export/import local data |
| `/docs` | How it works: RNG (rejection sampling), entropy math, threat model, boundary diagram, limitations |
| `/use-cases/*` | ≥5 original: developer-api-tokens, team-wifi-rotation, recovery-code-sheets, env-secrets-hygiene, family-passphrases |
| `/guides/*` | ≥8 substantial originals (see SEO_PLAN.md at next stage), e.g. passphrase-vs-password, entropy-explained, password-policies-that-work, recovery-codes-done-right, wifi-password-guide, api-token-formats, common-password-lists, browser-crypto-explained |
| `/faq` | Honest Q&A incl. "Is this a password manager?" (No.), "Can you see my passwords?" (No — here's how to verify.) |
| `/changelog` · `/about` · `/creator` · `/open-source` · `/privacy` · `/terms` · `/cookies` · `/contact` | Per STANDARDS §3/§4 |
| `not-found.tsx`, root `error.tsx` | Custom, on-brand |

Footer on every public route, exact sentence: **"Built and maintained by Kazi Musharraf. Open source for everyone."** + GitHub, portfolio, repo links.

## 5. Features and acceptance criteria

Global invariants (apply to every generator; enforced by unit tests):

- **G1** All randomness comes from `crypto.getRandomValues` (or `crypto.randomUUID` for UUIDs). `Math.random` does not appear anywhere in `src/` outside test fixtures — enforced by a lint rule/CI grep.
- **G2** Uniform selection uses **rejection sampling** (`src/lib/crypto/random.ts`: `randomInt(maxExclusive)` discards values ≥ the largest multiple of `maxExclusive` below 2^32). A statistical unit test (chi-squared over ≥100k draws on a 26-char alphabet) guards against reintroduced bias.
- **G3** Zero network egress of secret material: no generated value, no character of it, and no derivative (hash, prefix, length+charset fingerprint) is ever included in any request. Playwright asserts zero non-navigational network requests during generation flows.
- **G4** Every output renders in the mono secret style (DESIGN_SYSTEM.md §9.3) with copy button, reveal/hide, and the copy-with-auto-clear notice (§5.12).
- **G5** Every generator is deep-linkable, keyboard-operable, and announces results to screen readers via `aria-live="polite"`.

### 5.1 Password generator
- Length 8–128 (slider + numeric input, default 20). Charset toggles: upper/lower/digits/symbols; custom "must include" and "exclude characters" rules; exclude-ambiguous option (`il1Lo0O` + user-extendable).
- AC: at least one charset required (validation with clear error); if "require each selected set" is on, output provably contains ≥1 char from each selected set without biasing (generate-then-verify with rejection, not post-hoc substitution); entropy readout updates live; regenerate ≤50ms typical.

### 5.2 Passphrase
- Bundled **EFF large wordlist (7,776 words)** as a static asset with checksum test asserting exactly 7,776 unique words. 3–10 words, separator choice (space, dash, dot, custom char), optional capitalization, optional appended digits.
- AC: entropy = words × log2(7776) (+ documented additions for options); UI states the wordlist source honestly; word picks use rejection-sampled indices.

### 5.3 Pronounceable
- Syllable-pattern generation (cv/vc/cvc… patterns selected as whole patterns, fixing the legacy bug), length 8–32, optional digits/capitalization.
- AC: 100% Web Crypto (this replaces the legacy `Math.random` path — regression test asserts the module has no `Math.random` reference); entropy estimated from the actual syllable model and labeled as an estimate; output is lowercase-pronounceable per pattern grammar.

### 5.4 PIN
- 4–12 digits, option to forbid trivial sequences (1234, 0000, repeats).
- AC: uniform digits via rejection sampling; sequence-block re-rolls the whole PIN (no bias-introducing edits); entropy shown honestly (a 4-digit PIN ≈ 13.3 bits, labeled "weak — device lockouts are what protect PINs").

### 5.5 UUID v4
- Single + bulk. AC: `crypto.randomUUID()` (fallback: getRandomValues per RFC 4122 §4.4); version/variant bits verified by unit test.

### 5.6 Random string
- Arbitrary length ≤1024 over selectable alphabets (alnum, hex, base32, base58, base64url, custom alphabet input, deduplicated).
- AC: custom alphabets validated (≥2 unique chars); rejection sampling over exact alphabet size.

### 5.7 API token
- Formats: hex (16/24/32/64 bytes), base64url, prefixed (`sk_live_`-style with user-defined prefix, checksum-free), length readout in bytes AND characters.
- AC: byte-accurate (hex token of 32 bytes = 64 chars = 256 bits); prefix excluded from entropy math; the UI never suggests these are registered/reserved prefixes.

### 5.8 Recovery codes
- N codes (default 10) in the common `xxxxx-xxxxx` format (configurable groups), rendered as a **printable sheet** (dedicated print stylesheet: mono, high contrast, checkbox per code, product-free header option for privacy, generation date).
- AC: print preview contains no nav/footer/analytics; codes never persisted unless history opt-in is on; "print" and "download .txt" both work.

### 5.9 Wi-Fi password
- WPA2/WPA3-friendly: length 16–63, avoids characters that are error-prone to type on TV/console keyboards (opt-in "easy entry" charset), QR-free in v1 (a QR encodes the secret; deferring until we can render it with a clear local-only note — decision recorded here to prevent scope creep).
- AC: output ≤63 chars (WPA2 limit) enforced; "easy entry" mode documents its reduced entropy in the readout.

### 5.10 Bulk generation
- N=2–100 of any mode; per-item copy, copy-all, download `.txt`/`.csv`.
- AC: generation is chunked so the main thread never blocks >50ms; all items obey the mode's rules; download contains exactly N lines.

### 5.11 Analysis suite (`/analyze`, 100% local)
- Entropy estimate + strength class (5 levels, driven by the entropy model appropriate to the input's structure, not naive charset math); repetition/sequence/keyboard-pattern detection (qwerty rows, alphabet runs, repeats); common-password check against a **bundled top-1k list** (exact + lowercase match); policy compliance checker (paste or pick a policy from `/policies`); plain-language recommendations.
- AC: typing in the analyzer triggers **no network requests** (Playwright-verified); the analyzer states it is heuristic ("an estimate, not a guarantee"); common-list hit always classifies as Very weak regardless of entropy.

### 5.12 Copy with auto-clear notice
- Copying any secret shows a toast: "Copied. Clearing from clipboard in 30s" with countdown; the app attempts `navigator.clipboard.writeText('')` after the delay (Settings: 15/30/60s/off).
- AC (honest limits documented in UI + docs): clearing only works while the page is open and the document is focused; OS clipboard managers may retain history — the notice says so ("best effort").

### 5.13 History (opt-in) + dashboard
- OFF by default. Enabling shows a warning dialog naming the shared-machine risk. Stored in IndexedDB, masked by default, notes, search, one-click **Wipe all** (with confirm), auto-expiry option.
- Dashboard shows only real local counts (per-mode generation counts, streaks). Honest empty states.
- AC: with history off, nothing secret is written to any storage API (verified by inspecting IndexedDB/localStorage in an e2e test); wipe leaves zero residue in IndexedDB.

### 5.14 Extra tools
- **Password-policy generator + validator** (`/policies`): compose min-length/charset/rotation/deny-list rules; export as JSON + human-readable text; validator checks a candidate against a policy locally.
- **Environment-secret checklist** and **API-key rotation checklist** (`/checklists`): interactive check-off (state in localStorage — non-secret), printable.
- **Security-policy templates**: static, honest, editable-by-copy templates (no fake compliance claims like "SOC2-ready").

## 6. AI feature (single route)

`POST /api/ai/explain` — generic security Q&A + policy explanation. Vercel AI Gateway (STANDARDS §10), model via `AI_MODEL` env.

**Secret-rejection design (physical, not advisory):**
- Request schema (zod): `{ topic: enum[...predefined question categories], question?: string (max 280 chars), policy?: structured policy object (numbers + enums only — no free-text fields) }`. There is **no field that can carry a secret**; the `question` field is length-capped and content-guarded.
- **Client-side guard** refuses to send any `question` string that looks like generated output: token-like runs (≥12 chars mixing 3+ character classes without spaces), hex/base64 runs ≥16 chars, anything matching the current or recent generation outputs (compared locally, never transmitted), or entropy-per-char above a threshold. The guard explains why it refused and never sends the flagged string anywhere.
- Server re-validates: same regex guards in the zod schema (`.refine`); requests failing them get a structured 422 that echoes nothing back.
- Rate-limited (in-memory token bucket, best-effort per instance), quota-tracked client-side, honest "AI unavailable" state with deterministic local fallback (link to relevant `/docs`/`/guides` section) + BYOK per STANDARDS §10 (mechanism chosen at build stage and documented in AI_ARCHITECTURE.md).

## 7. Privacy constraints (product-level)

1. Zero egress of secret material — architecture + tests, not promises (G3).
2. Analytics (GTM, consent-gated, default declined) may receive only: event names from the shared union, mode names, bucketed counts/durations. Never lengths of specific generated values tied to output, never charsets of a specific generation, never any generated string.
3. AI route cannot receive secrets (schema + client guard + server refine, §6).
4. History OFF by default; opt-in dialog names the risk; one-click wipe; local-only.
5. No external font/script/image origins. CSP allows `'self'` (+ GTM origins only after consent).
6. The landing page claims exactly what is true — a lesson from the legacy audit (AUDIT.md §2 finding 4). Copy must say "nothing you *generate* leaves the device", and separately disclose what analytics does when consented.
7. Print sheets and downloads are generated client-side (Blob URLs), never via server round-trip.

## 8. Five most important spec decisions

1. **Rejection sampling everywhere, tested statistically** — the legacy modulo bias and `Math.random` are the product's defining bugs; v2 makes uniformity a tested invariant (G1/G2), not a code-review hope.
2. **The AI route is physically incapable of receiving secrets** — enum-first schema, capped guarded free-text, client-side secret-shaped-string refusal, server re-validation (§6).
3. **History is opt-in with a named risk** — reverses the legacy default of silently persisting plaintext passwords (AUDIT.md §2 finding 3); dashboard/history only ever show real local data.
4. **"NOT a password manager" is a first-class product statement** — on landing, docs, FAQ, README; prevents the trust-breaking gap between copy and behavior that sank the legacy app's credibility.
5. **Next.js App Router for content + one AI route, but generation stays 100% client-side** (ADR-001) — the server renders guides and validates AI questions; it never participates in secret generation, and Playwright asserts zero egress during generation.

## 9. Definition of done (this product, per STANDARDS §14)

Build zero TS errors · vitest green (incl. statistical RNG tests, wordlist checksum, schema-guard tests) · Playwright smoke green locally (incl. zero-egress assertion) · all §4 pages with real content · every generator works end-to-end with **no** AI keys · docs complete · clean conventional commits on `rebuild/v2`. Deployment is orchestrator-owned.
