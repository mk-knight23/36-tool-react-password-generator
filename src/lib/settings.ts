/**
 * Small, non-secret preferences. Per STANDARDS §1, localStorage is used only for
 * tiny prefs; secret history lives in IndexedDB (src/lib/storage.ts) and is never
 * touched unless the user opts in.
 */

export type AutoClearDelay = 0 | 15 | 30 | 60; // seconds; 0 = off
export type ConsentState = "unset" | "granted" | "declined";

export interface Settings {
  /** OFF by default — the reversal of the legacy silent-plaintext behaviour. */
  historyEnabled: boolean;
  autoClearDelay: AutoClearDelay;
  sound: boolean;
  analyticsConsent: ConsentState;
}

export const DEFAULT_SETTINGS: Settings = {
  historyEnabled: false,
  autoClearDelay: 30,
  sound: false,
  analyticsConsent: "unset",
};

const KEY = "vaultpass:settings";

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  notifySettings(settings);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable (private mode); preferences simply do not persist.
  }
}

export function clearSettings(): void {
  notifySettings({ ...DEFAULT_SETTINGS });
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/**
 * Reactive snapshot store so client components can read settings with
 * `useSyncExternalStore` (hydration-safe, no setState-in-effect). The cache is
 * the single source the React tree observes; writers call `saveSettings`, which
 * updates it and notifies subscribers.
 */
let settingsCache: Settings | null = null;
const settingsListeners = new Set<() => void>();

function notifySettings(next: Settings): void {
  settingsCache = next;
  settingsListeners.forEach((listener) => listener());
}

export function getSettingsSnapshot(): Settings {
  if (settingsCache === null) settingsCache = loadSettings();
  return settingsCache;
}

export function subscribeSettings(callback: () => void): () => void {
  settingsListeners.add(callback);
  return () => {
    settingsListeners.delete(callback);
  };
}
