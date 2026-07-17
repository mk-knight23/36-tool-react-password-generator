/**
 * Bring-your-own-key (BYOK) storage for the AI feature (STANDARDS §10).
 *
 * The key is the user's own Vercel AI Gateway key. It is stored only in this
 * browser's localStorage, sent only as the `x-byok-key` header to our own AI
 * route (never to any third party directly), and:
 *
 * - never included in analytics,
 * - never included in the export bundle (storage.ts exports history + counts
 *   only, so it cannot leak through Export),
 * - cleared by "Clear all data" (see `clearAiLocalData`).
 *
 * It is deliberately kept in its own key, separate from `vaultpass:settings`,
 * so it never rides along with other preferences.
 */
import { clearAiQuota } from "@/lib/ai/quota";

const KEY = "vaultpass:byok";

let cache: string | null | undefined;
const listeners = new Set<() => void>();

function read(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function getByokSnapshot(): string | null {
  if (cache === undefined) cache = read();
  return cache;
}

/** Whether a BYOK key is currently set (does not expose the value). */
export function hasByokKey(): boolean {
  return Boolean(getByokSnapshot());
}

export function subscribeByok(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify(value: string | null): void {
  cache = value;
  listeners.forEach((l) => l());
}

export function saveByokKey(key: string): void {
  const trimmed = key.trim();
  if (typeof window !== "undefined") {
    try {
      if (trimmed) window.localStorage.setItem(KEY, trimmed);
      else window.localStorage.removeItem(KEY);
    } catch {
      // ignore — key simply is not persisted in this session
    }
  }
  notify(trimmed || null);
}

export function clearByokKey(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  notify(null);
}

/** Remove all AI-related local data (BYOK key + daily quota). */
export function clearAiLocalData(): void {
  clearByokKey();
  clearAiQuota();
}
