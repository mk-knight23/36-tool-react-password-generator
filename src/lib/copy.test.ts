import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { copyToClipboard, scheduleClipboardClear, armClipboardAutoClear } from "./copy";

describe("copy", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    vi.spyOn(document, "hasFocus").mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("copyToClipboard", () => {
    it("writes the text and reports success", async () => {
      const ok = await copyToClipboard("hunter2");
      expect(ok).toBe(true);
      expect(writeText).toHaveBeenCalledWith("hunter2");
    });

    it("returns false when the clipboard write rejects", async () => {
      writeText.mockRejectedValueOnce(new Error("denied"));
      const ok = await copyToClipboard("x");
      expect(ok).toBe(false);
    });
  });

  describe("scheduleClipboardClear", () => {
    it("returns a no-op canceller and schedules nothing when the delay is zero", async () => {
      vi.useFakeTimers();
      const cancel = scheduleClipboardClear(0);
      await vi.advanceTimersByTimeAsync(120_000);
      expect(writeText).not.toHaveBeenCalledWith("");
      expect(() => cancel()).not.toThrow();
    });

    it("wipes the clipboard after the delay when the document is focused", async () => {
      vi.useFakeTimers();
      scheduleClipboardClear(30);
      await vi.advanceTimersByTimeAsync(30_000);
      expect(writeText).toHaveBeenCalledWith("");
    });

    it("does not wipe when the document is not focused (honest best-effort limit)", async () => {
      vi.useFakeTimers();
      vi.mocked(document.hasFocus).mockReturnValue(false);
      scheduleClipboardClear(15);
      await vi.advanceTimersByTimeAsync(15_000);
      expect(writeText).not.toHaveBeenCalledWith("");
    });

    it("can be cancelled before the wipe fires", async () => {
      vi.useFakeTimers();
      const cancel = scheduleClipboardClear(30);
      cancel();
      await vi.advanceTimersByTimeAsync(30_000);
      expect(writeText).not.toHaveBeenCalledWith("");
    });
  });

  describe("armClipboardAutoClear", () => {
    it("returns 0 and schedules nothing when auto-clear is disabled", async () => {
      vi.useFakeTimers();
      expect(armClipboardAutoClear(0)).toBe(0);
      await vi.advanceTimersByTimeAsync(60_000);
      expect(writeText).not.toHaveBeenCalledWith("");
    });

    it("cancels the previous pending wipe when re-armed so a fresh copy is not cleared early", async () => {
      vi.useFakeTimers();
      const first = vi.fn();
      const second = vi.fn();
      expect(armClipboardAutoClear(30, first)).toBe(30);
      // Re-arm before the first fires — the first wipe must be cancelled.
      expect(armClipboardAutoClear(30, second)).toBe(30);
      await vi.advanceTimersByTimeAsync(30_000);
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });
  });
});
