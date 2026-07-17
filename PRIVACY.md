# MK VaultPass — Privacy

Last reviewed: 2026-07-17. Contact: kazi@reprime.com.

This document describes exactly what the product does with data. It is written to
match the code, not to reassure. Where a protection is best-effort, it says so.

## The one-line version

Nothing you generate leaves your device. There is no server database. Analytics
is off until you opt in, and even then it can only receive event names, mode
names, and bucketed counts — never a generated value.

## 1. Generated secrets

- Passwords, passphrases, PINs, tokens, UUIDs, strings, recovery codes, and
  Wi-Fi passwords are produced in your browser by the Web Crypto API.
- No generated value, no fragment of one, and no derivative (hash, prefix,
  length-plus-charset fingerprint) is included in any network request. The
  default Content-Security-Policy is `connect-src 'self'`, and the Playwright
  smoke test asserts that generating fires no fetch/XHR and that the secret never
  appears in any request (PRODUCT_SPEC G3).

## 2. History (opt-in, local only)

- Off by default. Turning it on shows a warning that names the shared-machine
  risk. When on, entries are stored in your browser's IndexedDB only.
- With history off, nothing secret is written to any storage API. You can add
  notes, delete single entries, or wipe everything at any time.

## 3. Analytics

- Google Tag Manager is used only if `NEXT_PUBLIC_GTM_ID` is configured, only in
  production, and only after you accept on the consent banner (default:
  declined). The GTM script does not load until then.
- Permitted event data: event names from a fixed union, generator mode names, and
  bucketed counts and durations. Never sent: passwords, tokens, keys, any
  generated string, the length of a specific generated value tied to its output,
  the charset of a specific generation, file names, or BYOK credentials.
- You can change or withdraw consent at `/cookies` or `/settings`.

## 4. The AI explainer

- The single AI route (`POST /api/ai/explain`) is built so it cannot receive a
  secret. Its request has a required topic (an enum), an optional length-capped
  `question`, and an optional structured policy object made only of numbers and
  enums. There is no free-text field that could hold a secret.
- A client-side guard refuses to send any question that looks like generated
  output (token-like runs, long hex/base64, high per-character entropy) before
  any network call. The server re-validates and rejects with a structured error
  that echoes nothing back.
- If you supply your own key (BYOK), it is stored only in your browser, sent only
  as the `x-byok-key` header to this app's own route, never logged, never stored
  server-side, and excluded from the export bundle.

## 5. Cookies and local storage

- No tracking cookies are set by default. The app stores small non-secret
  preferences in localStorage (theme, settings, consent choice, dashboard
  counts, ticked checklist items) and opt-in history in IndexedDB. See
  `DATABASE.md`.

## 6. Third parties and network origins

- No external fonts, scripts, images, or style origins are loaded. Fonts are
  system stacks. The only third-party origins the CSP can ever allow are Google
  Tag Manager and Google Analytics, and only when analytics is configured and
  consented; even then, no generated secret is sent to them.

## 7. Your control

Clear individual history entries, wipe all history, or use "Clear all data" in
Settings to remove counts and history together. Clearing your browser's storage
removes everything the product ever wrote. There is nothing stored on any server
to request or delete.
