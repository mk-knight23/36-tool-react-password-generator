# MK VaultPass — Analytics Plan

This describes the analytics that ship in the repo. The default state is: no
analytics. Nothing loads and nothing is sent until a user opts in on a
production build with a configured container ID. This document records how that
is enforced in code.

Binding contract: `/Users/mkazi/Tools/_shared/STANDARDS.md` §6. Related privacy
rules: `PRODUCT_SPEC.md` §7.

## 1. Three conditions, all required

Analytics is a no-op unless every one of these is true. All three are checked in
`analyticsEnabled()` in `src/lib/analytics.ts`:

1. **Production build** — `process.env.NODE_ENV === "production"`. Dev and test
   builds never emit events.
2. **Container configured** — `NEXT_PUBLIC_GTM_ID` is set. Unset means fully
   disabled, and the GTM script is never injected.
3. **Consent granted** — the locally stored `analyticsConsent` setting equals
   `"granted"`. The default is not granted.

If any condition fails, `track()` returns immediately and pushes nothing.

## 2. The consent flow

- On first visit, `ConsentBanner` (rendered in `src/app/layout.tsx`) appears with
  equal-weight Accept and Decline actions. There is no pre-ticked box and no dark
  pattern. The default, stored and unstored, is declined.
- The choice is saved locally (settings module, not a cookie set by us) and can
  be changed at any time from `/cookies` and `/settings` via `ConsentControls`.
- The GTM `<script>` is loaded by `GtmScript` only after consent is granted on a
  production build with an ID present. Declining, or later revoking, means the
  script is never added (or not added on the next load).

Because consent is stored locally and gates script injection, a user who never
accepts causes zero third-party network activity from analytics.

## 3. Event model

`src/lib/analytics.ts` exposes a single typed function:

```ts
track(event: AnalyticsEvent, params?: AnalyticsParams): void
```

`AnalyticsEvent` is the shared union from STANDARDS §6:

`tool_opened · tool_started · tool_completed · tool_failed · file_selected ·
file_processed · ai_started · ai_completed · ai_failed · result_exported ·
result_copied · result_shared · history_opened · settings_changed ·
feedback_submitted · guide_opened · quota_reached`

The union is exhaustive and typed, so a typo or an off-list event name fails the
type check rather than shipping.

## 4. Where events fire (as wired today)

| Event | Fired from | Params sent |
|---|---|---|
| `tool_opened` | `Workspace` (mount and mode switch) | `mode` |
| `tool_completed` | `Workspace`, `RecoveryPanel` | `mode`, `bulk`, `count` |
| `result_copied` | `CopyButton` | `what` (which UI control, not the value) |
| `result_exported` | `BulkList`, `RecoveryPanel` | `format` (txt/csv), `count` |
| `ai_started` | `AiExplainPanel` | `feature`, `topic` (enum) |
| `ai_completed` | `AiExplainPanel` | `feature`, `topic` |
| `ai_failed` | `AiExplainPanel` | `feature`, `reason` |
| `guide_opened` | `ArticleLayout` (via `TrackView`) | `slug` |
| `settings_changed` | `SettingsView`, `ConsentControls` | changed setting `keys` only |

Some events in the union (`tool_started`, `file_selected`, `file_processed`,
`result_shared`, `history_opened`, `feedback_submitted`, `quota_reached`) are part
of the shared cross-product vocabulary and are not all wired in VaultPass v1,
because the corresponding flows either do not exist (no file upload, no share)
or are intentionally private (history). They remain in the type union so the
data layer stays consistent across the five products.

## 5. What is never sent

The hard rule (STANDARDS §6, PRODUCT_SPEC §7): no secret material and nothing
that could reconstruct or fingerprint it leaves the device through analytics.
Concretely, event params never include:

- any generated password, passphrase, token, PIN, UUID, key, or recovery code;
- the exact length or charset of a specific generated value;
- the free-text a user typed into the analyzer or the AI question box;
- BYOK credentials or any header value;
- file names or file contents (there are no uploads in v1 anyway).

Params are limited to counts, bucketed sizes, durations, mode/feature names, and
enum topics. `AnalyticsParams` is typed as `Record<string, string | number |
boolean>`, which structurally discourages passing objects that might carry
payloads.

The AI question box is additionally protected upstream: the request schema has
no field that can carry a secret and a client guard refuses secret-shaped
strings before any network call (see `AI_ARCHITECTURE.md`). So even `ai_started`
cannot be associated with a secret.

## 6. Delivery mechanism

When enabled, `track()` pushes `{ event, ...params }` onto `window.dataLayer`,
the standard GTM data-layer contract. Tag configuration (which events forward to
which destination) lives in the GTM container, not in this codebase, so the app
ships no hard-coded destination and no measurement ID beyond the single
`NEXT_PUBLIC_GTM_ID` env var.

## 7. Verification

- Type check confirms the event union is exhaustive and params are scalar-typed.
- `analyticsEnabled()` can be exercised directly: without an ID, or outside
  production, or without granted consent, `track()` is a no-op.
- Manual check: with no consent, the network tab shows no GTM request; the
  `dataLayer` receives no pushes.

## 8. What is deliberately not done

- No first-party event store, no server-side analytics, no logging of events on
  the API route.
- No session recording, heatmaps, or any tool that captures input.
- No analytics on the print/recovery-sheet output (it is generated client-side
  and rendered without nav, footer, or scripts).
