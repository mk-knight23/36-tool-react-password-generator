import { describe, it, expect, beforeEach, vi } from "vitest";

const KEY = "vaultpass:checklists";

// checklist-state keeps a module-level cache, so each test imports a fresh copy
// after resetting modules for full isolation. `loadWith` seeds localStorage
// first so the fresh module reads that state on its first snapshot.
async function freshModule() {
  vi.resetModules();
  window.localStorage.clear();
  return import("./checklist-state");
}

async function loadWith(seed: string) {
  vi.resetModules();
  window.localStorage.clear();
  window.localStorage.setItem(KEY, seed);
  return import("./checklist-state");
}

describe("checklist-state", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("getCheckedSnapshot", () => {
    it("starts empty when nothing is stored", async () => {
      const { getCheckedSnapshot, EMPTY_CHECKED } = await freshModule();
      expect(getCheckedSnapshot()).toEqual(EMPTY_CHECKED);
    });

    it("loads only the ids stored as true, ignoring other values", async () => {
      const { getCheckedSnapshot } = await loadWith(
        JSON.stringify({ a: true, b: false, c: "yes", d: true }),
      );
      expect(getCheckedSnapshot()).toEqual({ a: true, d: true });
    });

    it("returns empty when the stored value is corrupt JSON", async () => {
      const { getCheckedSnapshot } = await loadWith("{not json");
      expect(getCheckedSnapshot()).toEqual({});
    });
  });

  describe("toggleChecked", () => {
    it("adds an id on first toggle and removes it on the second", async () => {
      const { toggleChecked, getCheckedSnapshot } = await freshModule();
      // Act
      toggleChecked("env-1");
      // Assert
      expect(getCheckedSnapshot()).toEqual({ "env-1": true });
      // Act again
      toggleChecked("env-1");
      // Assert the key is removed (map stays minimal), not set to false
      expect(getCheckedSnapshot()).toEqual({});
    });

    it("persists the ticked ids to localStorage", async () => {
      const { toggleChecked } = await freshModule();
      toggleChecked("rot-1");
      expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual({ "rot-1": true });
    });

    it("notifies current subscribers and stops after unsubscribe", async () => {
      const { toggleChecked, subscribeChecked } = await freshModule();
      const listener = vi.fn();
      const unsubscribe = subscribeChecked(listener);
      toggleChecked("x");
      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
      toggleChecked("y");
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("resetChecked", () => {
    it("clears only the ids belonging to the given checklist", async () => {
      const { toggleChecked, resetChecked, getCheckedSnapshot } = await freshModule();
      toggleChecked("list-a-1");
      toggleChecked("list-a-2");
      toggleChecked("list-b-1");
      // Act
      resetChecked(["list-a-1", "list-a-2"]);
      // Assert
      expect(getCheckedSnapshot()).toEqual({ "list-b-1": true });
    });

    it("does not notify when none of the ids were ticked", async () => {
      const { resetChecked, subscribeChecked } = await freshModule();
      const listener = vi.fn();
      subscribeChecked(listener);
      resetChecked(["never-set"]);
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
