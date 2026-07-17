"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  systemPrefersDark,
  type ThemeMode,
} from "@/lib/theme";
import { cn } from "@/lib/cn";

const OPTIONS: Array<{ mode: ThemeMode; label: string; Icon: typeof Sun }> = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "system", label: "System", Icon: Monitor },
];

/** Tri-state theme toggle (light / dark / system), persisted in localStorage. */
export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(getStoredTheme());
    setMounted(true);
  }, []);

  // Keep the DOM in sync with the OS when the user is on "system".
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
    setMode(next);
    setStoredTheme(next);
    applyTheme(next);
  };

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-sunken p-0.5"
    >
      {OPTIONS.map(({ mode: m, label, Icon }) => {
        const active = mounted && mode === m;
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
              active
                ? "bg-surface text-accent shadow-1"
                : "text-fg-muted hover:text-fg",
            )}
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

/** Suppress the flash-of-unstyled fallback: the effective theme is set by an
 * inline script before hydration; this reads it once on mount for parity. */
export function currentResolvedTheme(): "light" | "dark" {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
  }
  return systemPrefersDark() ? "dark" : "light";
}
