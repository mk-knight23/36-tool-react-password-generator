import { describe, it, expect, beforeEach, vi } from "vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";

const SETTINGS_KEY = "vaultpass:settings";

function setHistoryEnabled(enabled: boolean) {
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({
      historyEnabled: enabled,
      autoClearDelay: 30,
      sound: false,
      analyticsConsent: "unset",
    }),
  );
}

// storage.ts caches the IDB connection and the counts snapshot at module scope,
// so each test gets a fresh module and a fresh in-memory IndexedDB.
async function freshStorage() {
  vi.resetModules();
  return import("./storage");
}

describe("storage", () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory();
    window.localStorage.clear();
  });

  describe("dashboard counts (localStorage, non-secret)", () => {
    it("starts every mode at zero", async () => {
      const { loadCounts, totalGenerations } = await freshStorage();
      expect(totalGenerations(loadCounts())).toBe(0);
    });

    it("increments a mode and totals across all modes", async () => {
      const { incrementCount, totalGenerations } = await freshStorage();
      incrementCount("password");
      incrementCount("password");
      incrementCount("pin");
      expect(totalGenerations()).toBe(3);
    });

    it("notifies counts subscribers and updates the snapshot", async () => {
      const { incrementCount, subscribeCounts, getCountsSnapshot } = await freshStorage();
      const listener = vi.fn();
      subscribeCounts(listener);
      incrementCount("uuid");
      expect(listener).toHaveBeenCalledTimes(1);
      expect(getCountsSnapshot().uuid).toBe(1);
    });

    it("ignores corrupt stored counts and falls back to empty", async () => {
      window.localStorage.setItem("vaultpass:counts", "{broken");
      const { loadCounts, totalGenerations } = await freshStorage();
      expect(totalGenerations(loadCounts())).toBe(0);
    });
  });

  describe("recordGeneration — the history opt-in invariant (PRODUCT_SPEC 5.13)", () => {
    it("with history OFF, increments the count but writes NO secret to IndexedDB", async () => {
      setHistoryEnabled(false);
      const { recordGeneration, totalGenerations, historyCount } = await freshStorage();
      const wrote = await recordGeneration({
        mode: "password",
        value: "s3cr3t-value",
        entropyBits: 80,
      });
      expect(wrote).toBe(false);
      expect(totalGenerations()).toBe(1);
      expect(await historyCount()).toBe(0);
    });

    it("with history ON, writes an entry retrievable via listHistory", async () => {
      setHistoryEnabled(true);
      const { recordGeneration, listHistory } = await freshStorage();
      const wrote = await recordGeneration({
        mode: "passphrase",
        value: "correct horse battery",
        entropyBits: 64,
      });
      expect(wrote).toBe(true);
      const rows = await listHistory();
      expect(rows).toHaveLength(1);
      expect(rows[0].value).toBe("correct horse battery");
      expect(rows[0].mode).toBe("passphrase");
    });
  });

  describe("history CRUD (opt-in)", () => {
    it("updates a note without altering the stored secret", async () => {
      setHistoryEnabled(true);
      const { recordGeneration, listHistory, updateHistoryNote } = await freshStorage();
      await recordGeneration({ mode: "pin", value: "482913", entropyBits: 20 });
      const [entry] = await listHistory();
      await updateHistoryNote(entry.id, "router PIN");
      const [updated] = await listHistory();
      expect(updated.note).toBe("router PIN");
      expect(updated.value).toBe("482913");
    });

    it("deletes a single entry", async () => {
      setHistoryEnabled(true);
      const { recordGeneration, listHistory, deleteHistoryEntry, historyCount } =
        await freshStorage();
      await recordGeneration({ mode: "uuid", value: "id-1", entropyBits: 122 });
      await recordGeneration({ mode: "uuid", value: "id-2", entropyBits: 122 });
      const rows = await listHistory();
      await deleteHistoryEntry(rows[0].id);
      expect(await historyCount()).toBe(1);
    });

    it("wipes every entry, leaving zero residue", async () => {
      setHistoryEnabled(true);
      const { recordGeneration, wipeHistory, historyCount } = await freshStorage();
      await recordGeneration({ mode: "token", value: "tok", entropyBits: 128 });
      await wipeHistory();
      expect(await historyCount()).toBe(0);
    });
  });

  describe("export / import / clear", () => {
    it("exports counts and history, then imports them back after a wipe", async () => {
      setHistoryEnabled(true);
      const store = await freshStorage();
      await store.recordGeneration({ mode: "pin", value: "1234", entropyBits: 13 });
      const bundle = await store.exportData();
      expect(bundle.product).toBe("mk-vaultpass");
      expect(bundle.history).toHaveLength(1);

      await store.clearAllData();
      expect(await store.listHistory()).toHaveLength(0);
      expect(store.totalGenerations(store.loadCounts())).toBe(0);

      await store.importData(bundle);
      expect(await store.listHistory()).toHaveLength(1);
      expect(store.loadCounts().pin).toBe(1);
    });

    it("rejects a bundle that is not a VaultPass export", async () => {
      const { importData } = await freshStorage();
      await expect(
        importData({
          product: "something-else",
        } as unknown as import("./storage").ExportBundle),
      ).rejects.toThrow(/VaultPass/);
    });

    it("clearAllData removes counts and wipes history together", async () => {
      setHistoryEnabled(true);
      const { recordGeneration, clearAllData, loadCounts, historyCount, totalGenerations } =
        await freshStorage();
      await recordGeneration({ mode: "wifi", value: "wifi-pass", entropyBits: 100 });
      await clearAllData();
      expect(totalGenerations(loadCounts())).toBe(0);
      expect(await historyCount()).toBe(0);
    });
  });

  describe("getStorageUsage", () => {
    it("reports the history entry count and null usage when estimate is unavailable", async () => {
      setHistoryEnabled(true);
      const { recordGeneration, getStorageUsage } = await freshStorage();
      await recordGeneration({ mode: "string", value: "abc", entropyBits: 30 });
      const usage = await getStorageUsage();
      expect(usage.historyEntries).toBe(1);
      // jsdom has no navigator.storage.estimate; module returns null gracefully.
      expect(usage.usageBytes === null || typeof usage.usageBytes === "number").toBe(true);
    });
  });
});
