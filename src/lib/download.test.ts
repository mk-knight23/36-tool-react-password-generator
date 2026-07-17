import { describe, it, expect, afterEach, vi } from "vitest";
import { downloadText, toTxt, toCsv } from "./download";

describe("download", () => {
  describe("toTxt", () => {
    it("puts one value per line and ends with a trailing newline", () => {
      expect(toTxt(["a", "b", "c"])).toBe("a\nb\nc\n");
    });

    it("returns just a newline for an empty list", () => {
      expect(toTxt([])).toBe("\n");
    });
  });

  describe("toCsv", () => {
    it("quotes every cell and doubles internal quotes", () => {
      const csv = toCsv(["code", "note"], [["ab12", 'has "quote"']]);
      expect(csv).toBe('"code","note"\n"ab12","has ""quote"""\n');
    });

    it("keeps a value containing a comma intact inside quotes", () => {
      const csv = toCsv(["v"], [["a,b"]]);
      expect(csv).toContain('"a,b"');
    });

    it("renders the header even when there are no rows", () => {
      expect(toCsv(["one", "two"], [])).toBe('"one","two"\n');
    });
  });

  describe("downloadText", () => {
    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it("creates a blob URL, clicks a download anchor, and revokes the URL", () => {
      // Arrange — jsdom does not implement the object-URL API, so stub it.
      const createObjectURL = vi.fn(() => "blob:mock");
      const revokeObjectURL = vi.fn();
      URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
      URL.revokeObjectURL = revokeObjectURL as unknown as typeof URL.revokeObjectURL;
      const click = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});
      vi.useFakeTimers();

      // Act
      downloadText("codes.txt", "a\nb\n");

      // Assert
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
      expect(document.querySelector("a")).toBeNull(); // anchor removed after click
      vi.runAllTimers();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    });
  });
});
