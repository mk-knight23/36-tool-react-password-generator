import { describe, it, expect, afterEach } from "vitest";
import { randomBytes, randomChar, randomString, randomUUID } from "./random";

describe("random.ts guard branches", () => {
  it("randomBytes rejects a negative count", () => {
    expect(() => randomBytes(-1)).toThrow(RangeError);
  });

  it("randomBytes rejects a non-integer count", () => {
    expect(() => randomBytes(2.5)).toThrow(RangeError);
  });

  it("randomChar rejects an empty alphabet", () => {
    expect(() => randomChar("")).toThrow(RangeError);
  });

  it("randomString rejects a negative length", () => {
    expect(() => randomString("abc", -4)).toThrow(RangeError);
  });

  it("randomString rejects a positive length over an empty alphabet", () => {
    expect(() => randomString("", 5)).toThrow(RangeError);
  });
});

describe("randomUUID fallback (no crypto.randomUUID available)", () => {
  const realCrypto = globalThis.crypto;

  afterEach(() => {
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: realCrypto,
    });
  });

  it("builds an RFC 4122 v4 UUID from raw bytes when randomUUID is missing", () => {
    // Replace crypto with one that only exposes getRandomValues, forcing the
    // byte-assembly fallback path (version/variant bits set by hand).
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: {
        getRandomValues: (arr: Uint8Array) => realCrypto.getRandomValues(arr),
      },
    });

    const uuid = randomUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});
