import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  clearSettings,
  getSettingsSnapshot,
  subscribeSettings,
  type Settings,
} from "./settings";

describe("settings", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSettings();
  });

  describe("loadSettings", () => {
    it("returns the defaults when nothing is stored", () => {
      // Arrange
      window.localStorage.clear();
      // Act
      const loaded = loadSettings();
      // Assert
      expect(loaded).toEqual(DEFAULT_SETTINGS);
    });

    it("defaults history OFF and consent unset (the legacy silent-plaintext reversal)", () => {
      expect(DEFAULT_SETTINGS.historyEnabled).toBe(false);
      expect(DEFAULT_SETTINGS.analyticsConsent).toBe("unset");
    });

    it("merges stored partial settings over the defaults", () => {
      // Arrange
      window.localStorage.setItem(
        "vaultpass:settings",
        JSON.stringify({ historyEnabled: true }),
      );
      // Act
      const loaded = loadSettings();
      // Assert
      expect(loaded.historyEnabled).toBe(true);
      expect(loaded.autoClearDelay).toBe(DEFAULT_SETTINGS.autoClearDelay);
    });

    it("falls back to the defaults when the stored JSON is corrupt", () => {
      // Arrange
      window.localStorage.setItem("vaultpass:settings", "{not json");
      // Act & Assert
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("saveSettings", () => {
    it("persists to localStorage and round-trips through loadSettings", () => {
      // Arrange
      const next: Settings = {
        historyEnabled: true,
        autoClearDelay: 60,
        sound: true,
        analyticsConsent: "granted",
      };
      // Act
      saveSettings(next);
      // Assert
      expect(loadSettings()).toEqual(next);
    });
  });

  describe("clearSettings", () => {
    it("removes the stored settings and resets the snapshot to defaults", () => {
      // Arrange
      saveSettings({ ...DEFAULT_SETTINGS, historyEnabled: true });
      // Act
      clearSettings();
      // Assert
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
      expect(getSettingsSnapshot()).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("reactive store", () => {
    it("notifies current subscribers and stops after unsubscribe", () => {
      // Arrange
      const listener = vi.fn();
      const unsubscribe = subscribeSettings(listener);
      // Act
      saveSettings({ ...DEFAULT_SETTINGS, sound: true });
      // Assert
      expect(listener).toHaveBeenCalledTimes(1);
      expect(getSettingsSnapshot().sound).toBe(true);

      // Act again after unsubscribe
      unsubscribe();
      saveSettings({ ...DEFAULT_SETTINGS, sound: false });
      // Assert
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("returns a reference-stable snapshot between reads with no write in between", () => {
      const a = getSettingsSnapshot();
      const b = getSettingsSnapshot();
      expect(a).toBe(b);
    });
  });
});
