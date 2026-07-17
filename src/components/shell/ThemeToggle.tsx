"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  type ThemeMode,
} from "@/lib/theme";
import { cn } from "@/lib/cn";

const OPTIONS: Array<{ mode: ThemeMode; label: string; Icon: typeof Sun }> = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "system", label: "System", Icon: Monitor },
];

const THEME_EVENT = "vaultpass:theme-change";

/** Subscribe to theme changes from this tab (custom event) and other tabs. */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

/**
 * Tri-state theme toggle (light / dark / system). The current mode is read from
 * localStorage via useSyncExternalStore so it stays correct across tabs and
 * needs no post-mount setState (which would fight hydration).
 */
export function ThemeToggle() {
  const mode = useSyncExternalStore<ThemeMode>(
    subscribe,
    getStoredTheme,
    () => "system",
  );

  // When on "system", follow the OS preference live. This only touches the DOM
  // attribute, never React state.
  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const choose = (next: ThemeMode) => {
    setStoredTheme(next);
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-sunken p-0.5"
    >
      {OPTIONS.map(({ mode: m, label, Icon }) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => choose(m)}
            aria-pressed={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            className={cn(
              "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm",
              "transition-colors duration-fast ease-enter",
              active ? "bg-surface text-accent shadow-1" : "text-fg-muted hover:text-fg",
            )}
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
