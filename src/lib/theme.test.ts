import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  THEME_KEY,
  getStoredTheme,
  setStoredTheme,
  resolveTheme,
  systemPrefersDark,
  applyTheme,
  THEME_NO_FLASH_SCRIPT,
} from "./theme";

describe("theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getStoredTheme", () => {
    it("defaults to system when nothing is stored", () => {
      expect(getStoredTheme()).toBe("system");
    });

    it("returns the stored value for a valid mode", () => {
      window.localStorage.setItem(THEME_KEY, "dark");
      expect(getStoredTheme()).toBe("dark");
    });

    it("ignores an invalid stored value and returns system", () => {
      window.localStorage.setItem(THEME_KEY, "neon");
      expect(getStoredTheme()).toBe("system");
    });
  });

  describe("setStoredTheme", () => {
    it("persists the chosen mode", () => {
      setStoredTheme("light");
      expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
    });
  });

  describe("resolveTheme", () => {
    it("returns the explicit mode unchanged for light and dark", () => {
      expect(resolveTheme("light")).toBe("light");
      expect(resolveTheme("dark")).toBe("dark");
    });

    it("resolves system to dark when the OS prefers dark", () => {
      vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
      expect(resolveTheme("system")).toBe("dark");
    });

    it("resolves system to light when the OS does not prefer dark", () => {
      vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
      expect(resolveTheme("system")).toBe("light");
    });
  });

  describe("systemPrefersDark", () => {
    it("reflects the prefers-color-scheme media query result", () => {
      vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
      expect(systemPrefersDark()).toBe(true);
    });
  });

  describe("applyTheme", () => {
    it("sets the resolved data-theme attribute on the document element", () => {
      applyTheme("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
  });

  describe("THEME_NO_FLASH_SCRIPT", () => {
    it("references the storage key, sets data-theme, and pulls in no external deps", () => {
      expect(THEME_NO_FLASH_SCRIPT).toContain(THEME_KEY);
      expect(THEME_NO_FLASH_SCRIPT).toContain("data-theme");
      expect(THEME_NO_FLASH_SCRIPT).not.toContain("import");
    });
  });
});
