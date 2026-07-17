import { openDB, type IDBPDatabase } from "idb";
import type { GeneratorMode } from "@/lib/generators/types";
import { GENERATOR_MODES } from "@/lib/generators/types";
import { loadSettings } from "@/lib/settings";

/**
 * Local persistence for MK VaultPass.
 *
 * - Secret history lives in IndexedDB and is ONLY written when the user has
 *   opted in (Settings → history). When history is off, `recordGeneration`
 *   makes ZERO IndexedDB writes (PRODUCT_SPEC 5.13). This reverses the legacy
 *   default of silently persisting plaintext passwords (AUDIT.md §2 finding 3).
 * - Dashboard counts are non-secret integers kept in localStorage, so the
 *   dashboard can show real local data without any secret ever being stored.
 */

const DB_NAME = "vaultpass";
const DB_VERSION = 1;
const HISTORY_STORE = "history";
const COUNTS_KEY = "vaultpass:counts";

export interface HistoryEntry {
  id: string;
  mode: GeneratorMode;
  value: string;
  entropyBits: number;
  note: string;
  createdAt: number;
}

export type ModeCounts = Record<GeneratorMode, number>;

function emptyCounts(): ModeCounts {
  return Object.fromEntries(GENERATOR_MODES.map((m) => [m, 0])) as ModeCounts;
}

// ----- Dashboard counts (localStorage, non-secret) -----

export function loadCounts(): ModeCounts {
  if (typeof window === "undefined") return emptyCounts();
  try {
    const raw = window.localStorage.getItem(COUNTS_KEY);
    if (!raw) return emptyCounts();
    return { ...emptyCounts(), ...(JSON.parse(raw) as Partial<ModeCounts>) };
  } catch {
    return emptyCounts();
  }
}

function saveCounts(counts: ModeCounts): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // ignore
  }
}

export function incrementCount(mode: GeneratorMode, by = 1): ModeCounts {
  const counts = loadCounts();
  counts[mode] = (counts[mode] ?? 0) + by;
  saveCounts(counts);
  return counts;
}

export function totalGenerations(counts: ModeCounts = loadCounts()): number {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

// ----- Secret history (IndexedDB, opt-in only) -----

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(HISTORY_STORE)) {
          const store = db.createObjectStore(HISTORY_STORE, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
      },
    });
  }
  return dbPromise;
}

function newId(): string {
  return globalThis.crypto.randomUUID();
}

/**
 * Record a generation. Increments the (non-secret) dashboard count always, but
 * writes the secret to IndexedDB ONLY when history is enabled. Returns whether a
 * history row was written.
 */
export async function recordGeneration(input: {
  mode: GeneratorMode;
  value: string;
  entropyBits: number;
}): Promise<boolean> {
  incrementCount(input.mode);

  if (!loadSettings().historyEnabled) return false;

  const db = await getDB();
  const entry: HistoryEntry = {
    id: newId(),
    mode: input.mode,
    value: input.value,
    entropyBits: input.entropyBits,
    note: "",
    createdAt: Date.now(),
  };
  await db.put(HISTORY_STORE, entry);
  return true;
}

export async function listHistory(): Promise<HistoryEntry[]> {
  const db = await getDB();
  const all = (await db.getAll(HISTORY_STORE)) as HistoryEntry[];
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateHistoryNote(id: string, note: string): Promise<void> {
  const db = await getDB();
  const entry = (await db.get(HISTORY_STORE, id)) as HistoryEntry | undefined;
  if (!entry) return;
  await db.put(HISTORY_STORE, { ...entry, note });
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(HISTORY_STORE, id);
}

export async function wipeHistory(): Promise<void> {
  const db = await getDB();
  await db.clear(HISTORY_STORE);
}

export async function historyCount(): Promise<number> {
  try {
    const db = await getDB();
    return await db.count(HISTORY_STORE);
  } catch {
    return 0;
  }
}

// ----- Export / import / clear-all -----

export interface ExportBundle {
  product: "mk-vaultpass";
  version: 1;
  exportedAt: number;
  history: HistoryEntry[];
  counts: ModeCounts;
}

export async function exportData(): Promise<ExportBundle> {
  let history: HistoryEntry[] = [];
  try {
    history = await listHistory();
  } catch {
    history = [];
  }
  return {
    product: "mk-vaultpass",
    version: 1,
    exportedAt: Date.now(),
    history,
    counts: loadCounts(),
  };
}

export async function importData(bundle: ExportBundle): Promise<void> {
  if (bundle.product !== "mk-vaultpass") {
    throw new Error("Not a MK VaultPass export file.");
  }
  if (bundle.counts) saveCounts({ ...emptyCounts(), ...bundle.counts });
  if (Array.isArray(bundle.history) && bundle.history.length > 0) {
    const db = await getDB();
    const tx = db.transaction(HISTORY_STORE, "readwrite");
    for (const entry of bundle.history) {
      await tx.store.put(entry);
    }
    await tx.done;
  }
}

export async function clearAllData(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(COUNTS_KEY);
    } catch {
      // ignore
    }
  }
  try {
    await wipeHistory();
  } catch {
    // store may not exist yet
  }
}

export interface StorageUsage {
  usageBytes: number | null;
  quotaBytes: number | null;
  historyEntries: number;
}

export async function getStorageUsage(): Promise<StorageUsage> {
  let usageBytes: number | null = null;
  let quotaBytes: number | null = null;
  if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
    try {
      const est = await navigator.storage.estimate();
      usageBytes = est.usage ?? null;
      quotaBytes = est.quota ?? null;
    } catch {
      // ignore
    }
  }
  return { usageBytes, quotaBytes, historyEntries: await historyCount() };
}
