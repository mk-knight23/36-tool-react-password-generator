# MK VaultPass — AI Architecture

Scope: the single AI feature permitted by PRODUCT_SPEC §6 — a security Q&A and
policy explainer at `POST /api/ai/explain`. Everything else in VaultPass
(generation, analysis, history, dashboard) is fully local and does not use AI.

The overriding constraint is VaultPass's core promise: **nothing you generate
leaves your device.** The AI route is designed so it is *physically* unable to
receive a secret, degrades honestly when unavailable, and never becomes a
dependency for the tool to work.

## 1. Route

`POST /api/ai/explain` (`src/app/api/ai/explain/route.ts`), Node runtime,
`force-dynamic`. Request/response contract in `src/lib/ai/schema.ts`.

Pipeline per request:

1. **Rate limit** — best-effort in-memory token bucket keyed by client IP
   (`src/lib/ai/rate-limit.ts`): burst 12, refill ~20/min. Per-instance only;
   documented as best-effort because serverless runs multiple isolated
   instances. On exceed → `429 rate_limited` with `Retry-After`.
2. **Parse + validate** — `explainRequestSchema.safeParse`. A `strictObject`
   rejects any unknown/smuggled field. A secret-shaped `question` is refused
   with `422 secret_rejected`; other invalid input → `400 invalid_request`.
3. **Availability** — if no gateway credential is resolvable (BYOK header, env
   key, or Vercel OIDC) → `503 ai_unavailable`. The client then renders the
   deterministic local fallback.
4. **Model selection** — `AI_MODEL` (default `anthropic/claude-haiku-4.5`) for
   most topics; `AI_MODEL_QUALITY` (default `anthropic/claude-sonnet-4-5`) for
   the `policy-explanation` topic. Slugs are env config, not code.
5. **Generate** — `generateText({ model, system, prompt, maxOutputTokens: 700,
   temperature: 0.4, abortSignal: req.signal })` from the `ai` package (AI SDK
   v6). Gateway model strings are used directly; no provider package is wired.
6. **Respond** — `{ answer, source: "ai", model }` on success; structured,
   input-free errors otherwise.

### Verified SDK usage (AI SDK v6, `ai@6`)

- Env / OIDC auth: `generateText({ model: "anthropic/claude-haiku-4.5", prompt })`
  — the gateway resolves the model string; auth comes from `AI_GATEWAY_API_KEY`
  or Vercel OIDC.
- BYOK: `createGateway({ apiKey })(modelId)` builds a gateway bound to the
  user's key for that one call. `createGateway`/`generateText` are re-exported
  from `ai`; `GatewayProviderSettings.apiKey` is the documented field.

## 2. Secret rejection (physical, not advisory)

Three independent layers, defence in depth:

1. **Schema shape** (`schema.ts`) — `topic` is an enum; `policy` is a
   `strictObject` of numbers and booleans only. There is **no field** that can
   carry a secret except `question`, which is capped at 280 characters.
2. **Shared guard** (`secret-guard.ts`) — `looksLikeSecret()` runs on the client
   *before* any request is sent, and again on the server inside the schema's
   `.refine`. It flags hex runs (≥16), base64/random-string runs (≥16, mixed
   classes), mixed-class tokens (≥12, ≥3 classes), generated passphrases
   (word segments joined by `-._`), and any whitespace-free value ≥24 chars.
   The module has no imports/IO so both sides run identical logic.
3. **No echo** — refusals and errors never include the offending value, and the
   route never logs request bodies, questions, or credentials.

The password typed into the Analyze page is never passed to this route; the
panel only sends the chosen topic and an optional general question.

## 3. Degraded state (honest, always usable)

The tool never depends on AI. When the AI is unavailable — no credential
(`ai_unavailable`), quota spent, rate limited, network error — `requestExplain`
(`src/lib/ai/client.ts`) returns the topic's **deterministic, human-written
fallback** from `src/lib/ai/topics.ts`, and the UI labels it "Built-in
explanation" with a one-line note stating why AI was not used. AI answers are
labeled "AI answer" with the resolved model slug. There is never a fabricated
or unlabeled AI result.

## 4. BYOK — chosen mechanism (STANDARDS §10)

VaultPass uses the **`x-byok-key` request header to our own route** (not
client-direct-to-gateway). Rationale: it keeps `connect-src 'self'` intact (the
browser still only talks to this origin), so the zero-egress CSP posture is
unchanged, while letting a user pay for their own calls.

- The key is entered in Settings and stored in `localStorage` under
  `vaultpass:byok` (`src/lib/ai/byok.ts`), isolated from `vaultpass:settings`.
- It is sent **only** as the `x-byok-key` header to `/api/ai/explain`, used to
  build a per-call gateway, and then discarded. It is never logged, never
  persisted server-side, never echoed, never sent to any third party directly.
- It is excluded from Analytics and from the Export bundle (`exportData` only
  serializes history + counts), and is removed by "Clear all data"
  (`clearAiLocalData`).
- With a BYOK key set, the client-side daily quota is bypassed (those calls are
  on the user's own account); the server rate limiter still applies.

## 5. Quotas

Anonymous, client-tracked daily counter (`src/lib/ai/quota.ts`,
`vaultpass:ai-quota`, default 20/day) shown as a "N/limit left today"
indicator. It is a courtesy cap for the shared instance; the authoritative
limit is the server rate limiter. Reaching the cap falls back to the built-in
explanation and (where analytics is consented) emits `quota_reached`/`ai_failed`
with counts only — never any question text.

## 6. Analytics

Only shared-union events with non-sensitive params are emitted:
`ai_started` / `ai_completed` (with `feature`, `topic`) and `ai_failed` (with a
`reason`). No question text, no answer text, no key, no generated value ever
reaches analytics (STANDARDS §6, PRODUCT_SPEC §7).

## 7. Files

| File | Role |
|---|---|
| `src/app/api/ai/explain/route.ts` | The route: limit → validate → availability → generate |
| `src/lib/ai/schema.ts` | Zod contract; physical secret rejection (`strictObject`) |
| `src/lib/ai/secret-guard.ts` | Shared secret-shape detector (client + server) |
| `src/lib/ai/topics.ts` | Topic enum, prompts, deterministic fallbacks |
| `src/lib/ai/prompt.ts` | Builds the system + user prompt from validated input |
| `src/lib/ai/rate-limit.ts` | Best-effort in-memory token bucket |
| `src/lib/ai/quota.ts` | Client daily quota (reactive store) |
| `src/lib/ai/byok.ts` | BYOK key store (isolated; excluded from export) |
| `src/lib/ai/client.ts` | Client request helper (guard, quota, cancel, fallback) |
| `src/components/ai/AiExplainPanel.tsx` | UI on `/analyze` |

## 8. Testing

Unit tests cover the security-critical logic: `secret-guard.test.ts` (secret
shapes vs. real questions), `schema.test.ts` (enum/strictObject/guard/length),
`rate-limit.test.ts`, `prompt.test.ts` (policy rendering), `quota.test.ts`. The
route's degraded path is verified at runtime (no credential → `503
ai_unavailable`). A Playwright zero-egress assertion for AI flows is tracked
with the broader e2e job (PRODUCT_SPEC G3).
