import { describe, it, expect, beforeEach, vi } from "vitest";

const KEY = "vaultpass:byok";
const QUOTA_KEY = "vaultpass:ai-quota";

// byok caches the key at module scope, so import a fresh copy per test.
async function freshByok() {
  vi.resetModules();
  window.localStorage.clear();
  return import("./byok");
}

describe("ai/byok", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reports no key by default and does not expose a value", async () => {
    const { hasByokKey, getByokSnapshot } = await freshByok();
    expect(hasByokKey()).toBe(false);
    expect(getByokSnapshot()).toBeNull();
  });

  it("saves a trimmed key, persists it, and reports it as present", async () => {
    const { saveByokKey, hasByokKey, getByokSnapshot } = await freshByok();
    saveByokKey("  vck_abc123  ");
    expect(getByokSnapshot()).toBe("vck_abc123");
    expect(hasByokKey()).toBe(true);
    expect(window.localStorage.getItem(KEY)).toBe("vck_abc123");
  });

  it("treats a whitespace-only key as clearing the stored key", async () => {
    const { saveByokKey, hasByokKey } = await freshByok();
    saveByokKey("vck_real");
    saveByokKey("   ");
    expect(hasByokKey()).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it("clearByokKey removes the key and notifies subscribers", async () => {
    const { saveByokKey, clearByokKey, subscribeByok, hasByokKey } = await freshByok();
    saveByokKey("vck_real");
    const listener = vi.fn();
    const unsubscribe = subscribeByok(listener);
    clearByokKey();
    expect(hasByokKey()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("clearAiLocalData clears both the BYOK key and the AI quota", async () => {
    const { saveByokKey, clearAiLocalData, hasByokKey } = await freshByok();
    saveByokKey("vck_real");
    window.localStorage.setItem(
      QUOTA_KEY,
      JSON.stringify({ day: new Date().toISOString().slice(0, 10), count: 5 }),
    );
    clearAiLocalData();
    expect(hasByokKey()).toBe(false);
    expect(window.localStorage.getItem(QUOTA_KEY)).toBeNull();
  });

  it("never lets the BYOK key ride along in the settings preference blob", async () => {
    const { saveByokKey } = await freshByok();
    saveByokKey("vck_real");
    // The key lives in its own storage slot, separate from vaultpass:settings.
    expect(window.localStorage.getItem("vaultpass:settings")).toBeNull();
    expect(window.localStorage.getItem(KEY)).toBe("vck_real");
  });
});
