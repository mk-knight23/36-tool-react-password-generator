/**
 * Persisted checklist check-off state (PRODUCT_SPEC §5.14). This is non-secret UI
 * state only — a map of checklist-item id to true — kept in localStorage per
 * STANDARDS §1 (localStorage is for tiny prefs; secrets never go here). No item
 * text or generated value is stored, only which stable ids are ticked.
 *
 * Exposes a reactive snapshot/subscribe pair so client components read it with
 * `useSyncExternalStore` (hydration-safe, no setState-in-effect), mirroring the
 * settings and counts stores.
 */

export type CheckedMap = Readonly<Record<string, boolean>>;

export const EMPTY_CHECKED: CheckedMap = Object.freeze({});

const KEY = "vaultpass:checklists";

function load(): CheckedMap {
  if (typeof window === "undefined") return EMPTY_CHECKED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_CHECKED;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return EMPTY_CHECKED;
    const out: Record<string, boolean> = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value === true) out[id] = true;
    }
    return out;
  } catch {
    return EMPTY_CHECKED;
  }
}

let cache: CheckedMap | null = null;
const listeners = new Set<() => void>();

function persist(next: CheckedMap): void {
  cache = next;
  listeners.forEach((listener) => listener());
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode); state simply does not persist.
  }
}

export function getCheckedSnapshot(): CheckedMap {
  if (cache === null) cache = load();
  return cache;
}

export function subscribeChecked(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/** Toggle one item. Unchecking removes the key so the map stays minimal. */
export function toggleChecked(id: string): void {
  const current = getCheckedSnapshot();
  const next: Record<string, boolean> = { ...current };
  if (next[id]) delete next[id];
  else next[id] = true;
  persist(next);
}

/** Clear the ticks for a specific set of item ids (a single checklist). */
export function resetChecked(ids: readonly string[]): void {
  const current = getCheckedSnapshot();
  const next: Record<string, boolean> = { ...current };
  let changed = false;
  for (const id of ids) {
    if (next[id]) {
      delete next[id];
      changed = true;
    }
  }
  if (changed) persist(next);
}
