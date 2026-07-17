import { describe, it, expect } from "vitest";
import {
  randomInt,
  randomString,
  secureShuffle,
  randomBytes,
  randomHex,
  randomUUID,
  pick,
  randomChar,
} from "./random";

describe("randomInt", () => {
  it("stays within [0, maxExclusive)", () => {
    // 128k draws across ranges 1..64. Bounds/integer violations are collected
    // and asserted once at the end — calling expect() per draw is both slow and
    // unnecessary, since a single counter-example is enough to fail the test.
    let violations = 0;
    for (let m = 1; m <= 64; m++) {
      for (let i = 0; i < 2000; i++) {
        const v = randomInt(m);
        if (v < 0 || v >= m || !Number.isInteger(v)) violations++;
      }
    }
    expect(violations).toBe(0);
  });

  it("always returns 0 for maxExclusive === 1", () => {
    for (let i = 0; i < 100; i++) expect(randomInt(1)).toBe(0);
  });

  it("rejects invalid ranges", () => {
    expect(() => randomInt(0)).toThrow(RangeError);
    expect(() => randomInt(-3)).toThrow(RangeError);
    expect(() => randomInt(1.5)).toThrow(RangeError);
    expect(() => randomInt(2 ** 32 + 1)).toThrow(RangeError);
  });

  // Chi-squared goodness-of-fit: a 26-symbol alphabet, ~10k expected per bin.
  // Real modulo bias would inflate the statistic far past the threshold.
  it("is uniform over a 26-symbol range (chi-squared, 260k draws)", () => {
    const bins = 26;
    const draws = 260_000;
    const counts = new Array<number>(bins).fill(0);
    for (let i = 0; i < draws; i++) counts[randomInt(bins)]++;

    const expected = draws / bins;
    let chiSq = 0;
    for (const c of counts) {
      const d = c - expected;
      chiSq += (d * d) / expected;
    }
    // df = 25; chi-squared critical value at p = 0.001 is ~52.62.
    expect(chiSq).toBeLessThan(55);
  });

  // A range that does NOT divide 2^32 (2^32 % 7 === 4) is exactly where the
  // legacy `% chars.length` bias would show up. Rejection sampling must not.
  it("is uniform over a range that does not divide 2^32 (range 7)", () => {
    const bins = 7;
    const draws = 700_000;
    const counts = new Array<number>(bins).fill(0);
    for (let i = 0; i < draws; i++) counts[randomInt(bins)]++;

    const expected = draws / bins;
    let chiSq = 0;
    for (const c of counts) {
      const d = c - expected;
      chiSq += (d * d) / expected;
    }
    // df = 6; critical value at p = 0.001 is ~22.46.
    expect(chiSq).toBeLessThan(30);
  });
});

describe("pick / randomChar / randomString", () => {
  it("pick returns a member of the array", () => {
    const arr = ["a", "b", "c", "d"];
    for (let i = 0; i < 500; i++) expect(arr).toContain(pick(arr));
  });

  it("pick throws on empty", () => {
    expect(() => pick([])).toThrow(RangeError);
  });

  it("randomChar returns a character from the alphabet", () => {
    const alpha = "XYZ";
    for (let i = 0; i < 500; i++) expect(alpha).toContain(randomChar(alpha));
  });

  it("randomString has the requested length and only alphabet chars", () => {
    const alpha = "abc123";
    const s = randomString(alpha, 200);
    expect(s.length).toBe(200);
    for (const ch of s) expect(alpha).toContain(ch);
  });

  it("randomString handles length 0", () => {
    expect(randomString("abc", 0)).toBe("");
  });
});

describe("secureShuffle", () => {
  it("preserves all elements (is a permutation)", () => {
    const original = Array.from({ length: 50 }, (_, i) => i);
    const shuffled = secureShuffle(original);
    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(original);
  });

  it("does not mutate the input", () => {
    const original = [1, 2, 3, 4, 5];
    const snapshot = [...original];
    secureShuffle(original);
    expect(original).toEqual(snapshot);
  });
});

describe("bytes / hex / uuid", () => {
  it("randomBytes returns the requested length", () => {
    expect(randomBytes(0)).toHaveLength(0);
    expect(randomBytes(32)).toHaveLength(32);
  });

  it("randomHex length is 2n and lowercase hex", () => {
    const h = randomHex(16);
    expect(h).toHaveLength(32);
    expect(h).toMatch(/^[0-9a-f]+$/);
  });

  it("randomUUID matches RFC 4122 v4 shape", () => {
    const uuid = randomUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("randomUUID values are unique across a sample", () => {
    const set = new Set<string>();
    for (let i = 0; i < 5000; i++) set.add(randomUUID());
    expect(set.size).toBe(5000);
  });
});
