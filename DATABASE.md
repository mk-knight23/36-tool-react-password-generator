# MK VaultPass — Data & Storage

## No server database in v1 (ADR-003)

MK VaultPass has **no server-side database and no server-side file storage.**
This is a deliberate architectural decision, not a gap.

The product generates secrets in the browser and, by design, never transmits
them. A server datastore would exist only to hold data the product intentionally
refuses to collect. Adding one would create a place for secrets to leak, expand
the attack surface, and contradict the product's central promise. There is no
requirement in the spec that a server database would satisfy, so none is used.

If a future feature genuinely needs server state (for example, shared team
policy templates that are explicitly non-secret), it will be introduced with its
own ADR, its own threat model, and an explicit statement of what it stores.

## What is stored, and where

All persistence is in the visitor's own browser.

### IndexedDB — opt-in secret history

- Database `vaultpass`, version 1, object store `history` (keyPath `id`, index on
  `createdAt`). Implemented in `src/lib/storage.ts` via the `idb` package.
- **Off by default.** `recordGeneration` writes a history row only when
  `settings.historyEnabled` is true. With history off it makes zero IndexedDB
  writes — verified by `src/lib/storage.test.ts`
  ("with history OFF … writes NO secret to IndexedDB").
- Entry shape: `{ id, mode, value, entropyBits, note, createdAt }`.
- The user can add notes, delete single entries, and wipe everything
  (`wipeHistory`). `clearAllData` wipes history and clears counts together.

### localStorage — tiny non-secret preferences

Small keys only, never a secret:

| Key | Contents |
|---|---|
| `vaultpass:settings` | history opt-in, auto-clear delay, sound, analytics consent |
| `vaultpass:counts` | per-mode generation counts (integers) for the dashboard |
| `vaultpass:checklists` | ids of ticked checklist items (booleans) |
| `vaultpass:theme` | `light` / `dark` / `system` |
| `vaultpass:byok` | the user's own AI Gateway key, if they set one |
| `vaultpass:ai-quota` | `{ day, count }` daily AI courtesy counter |

The dashboard shows only these real local counts, with honest empty states. No
sample or fake data is ever displayed.

## Export / import

`exportData` produces a JSON bundle `{ product, version, exportedAt, history,
counts }` assembled entirely client-side and downloaded via a Blob URL.
`importData` validates the `product` tag before merging. The BYOK key and the AI
quota are intentionally excluded from the export bundle, so a shared export can
never leak the key.

## Retention & deletion

Everything is on the user's device and under the user's control. "Clear all data"
in Settings removes counts and wipes history; clearing browser storage removes
everything the product ever wrote. There is nothing to delete on any server
because nothing is stored on any server.
