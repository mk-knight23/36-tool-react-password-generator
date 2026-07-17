"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_SETTINGS,
  getSettingsSnapshot,
  subscribeSettings,
  type Settings,
} from "@/lib/settings";
import {
  EMPTY_COUNTS,
  getCountsSnapshot,
  subscribeCounts,
  type ModeCounts,
} from "@/lib/storage";

/**
 * Client-only reactive reads. Each uses `useSyncExternalStore` so the value is
 * correct across tabs and after hydration without a setState-in-effect (the
 * same approach as the theme toggle).
 */

export function useSettings(): Settings {
  return useSyncExternalStore(subscribeSettings, getSettingsSnapshot, () => DEFAULT_SETTINGS);
}

export function useCounts(): ModeCounts {
  return useSyncExternalStore(subscribeCounts, getCountsSnapshot, () => EMPTY_COUNTS);
}

const emptySubscribe = () => () => {};

/**
 * True once the component has hydrated on the client. Lets a component defer
 * rendering browser-only, non-deterministic content (random previews, IndexedDB
 * reads) until after the server markup has been matched.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
