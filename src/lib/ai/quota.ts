/**
 * Client-tracked anonymous daily quota for AI answers (STANDARDS §10). This is a
 * courtesy limit shown to the user; the real enforcement is the server rate
 * limiter (rate-limit.ts). Stored as a tiny non-secret preference in
 * localStorage and exposed as a reactive store so the UI can show usage.
 */

export const AI_DAILY_LIMIT = 20;

const KEY = "vaultpass:ai-quota";

export interface AiQuota {
  /** Local calendar day (YYYY-MM-DD) the count applies to. */
  day: string;
  used: number;
  limit: number;
  remaining: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Stored {
  day: string;
  count: number;
}

function readStored(): Stored {
  const day = today();
  if (typeof window === "undefined") return { day, count: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { day, count: 0 };
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (parsed.day !== day || typeof parsed.count !== "number") {
      return { day, count: 0 };
    }
    return { day, count: Math.max(0, Math.floor(parsed.count)) };
  } catch {
    return { day, count: 0 };
  }
}

function toQuota(stored: Stored): AiQuota {
  const used = Math.min(stored.count, AI_DAILY_LIMIT);
  return {
    day: stored.day,
    used,
    limit: AI_DAILY_LIMIT,
    remaining: Math.max(0, AI_DAILY_LIMIT - stored.count),
  };
}

let cache: AiQuota | null = null;
const listeners = new Set<() => void>();

function refresh(stored: Stored): void {
  cache = toQuota(stored);
  listeners.forEach((l) => l());
}

export function getAiQuotaSnapshot(): AiQuota {
  if (cache === null || cache.day !== today()) {
    cache = toQuota(readStored());
  }
  return cache;
}

export const EMPTY_AI_QUOTA: AiQuota = {
  day: "",
  used: 0,
  limit: AI_DAILY_LIMIT,
  remaining: AI_DAILY_LIMIT,
};

export function subscribeAiQuota(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function canUseAi(): boolean {
  return getAiQuotaSnapshot().remaining > 0;
}

/** Record one AI use and persist it. Returns the updated quota. */
export function recordAiUse(): AiQuota {
  const stored = readStored();
  const next: Stored = { day: stored.day, count: stored.count + 1 };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Preference simply does not persist (private mode).
    }
  }
  refresh(next);
  return cache!;
}

export function clearAiQuota(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  refresh({ day: today(), count: 0 });
}
