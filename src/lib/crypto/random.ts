/**
 * The single source of randomness for MK VaultPass.
 *
 * Every secret in the product flows through this module. Two invariants make it
 * the fix for the legacy product's defining bugs (AUDIT.md §2 findings 1 & 2):
 *
 *   1. Cryptographic randomness ONLY. All entropy comes from
 *      `crypto.getRandomValues` (Web Crypto). `Math.random` is never used for
 *      anything secret and must not appear anywhere in `src/` (CI grep + a unit
 *      test enforce this).
 *
 *   2. Uniform selection via REJECTION SAMPLING. The legacy code did
 *      `array[i] % chars.length`, which biases toward the first
 *      `2^32 % chars.length` characters whenever the range is not a power of two.
 *      `randomInt` instead discards any draw at or above the largest multiple of
 *      `maxExclusive` below 2^32, so `x % maxExclusive` is provably uniform.
 *      A chi-squared statistical test guards against regressions.
 */

const UINT32_RANGE = 2 ** 32; // 4294967296

function webcrypto(): Crypto {
  const c = globalThis.crypto;
  if (!c || typeof c.getRandomValues !== "function") {
    throw new Error(
      "Web Crypto is unavailable in this environment. MK VaultPass requires crypto.getRandomValues.",
    );
  }
  return c;
}

// Batched entropy pool: refill 256 uint32s per getRandomValues call so bulk
// generation stays off the slow path while still using only Web Crypto.
const POOL_SIZE = 256;
const pool = new Uint32Array(POOL_SIZE);
let poolIndex = POOL_SIZE; // force a refill on first use

function nextUint32(): number {
  if (poolIndex >= pool.length) {
    webcrypto().getRandomValues(pool);
    poolIndex = 0;
  }
  return pool[poolIndex++];
}

/**
 * Uniform integer in [0, maxExclusive) via rejection sampling.
 * @throws if maxExclusive is not an integer in [1, 2^32].
 */
export function randomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
    throw new RangeError(
      `randomInt: maxExclusive must be an integer in [1, 2^32], got ${maxExclusive}`,
    );
  }
  if (maxExclusive === 1) return 0;

  // Largest multiple of maxExclusive that fits in the uint32 range. Draws at or
  // above this limit are rejected so the accepted region is an exact multiple of
  // maxExclusive, giving a bias-free modulo.
  const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
  let x = nextUint32();
  while (x >= limit) {
    x = nextUint32();
  }
  return x % maxExclusive;
}

/** Uniformly pick one element from a non-empty array. */
export function pick<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new RangeError("pick: cannot pick from an empty array");
  }
  return items[randomInt(items.length)];
}

/** Uniformly pick one character from a non-empty alphabet string. */
export function randomChar(alphabet: string): string {
  if (alphabet.length === 0) {
    throw new RangeError("randomChar: alphabet must not be empty");
  }
  return alphabet.charAt(randomInt(alphabet.length));
}

/** Build a string of `length` characters, each uniformly drawn from `alphabet`. */
export function randomString(alphabet: string, length: number): string {
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError(`randomString: length must be a non-negative integer, got ${length}`);
  }
  if (length > 0 && alphabet.length === 0) {
    throw new RangeError("randomString: alphabet must not be empty");
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet.charAt(randomInt(alphabet.length));
  }
  return out;
}

/** Cryptographically secure Fisher-Yates shuffle, returning a new array. */
export function secureShuffle<T>(items: readonly T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

/** `n` cryptographically random bytes. */
export function randomBytes(n: number): Uint8Array {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`randomBytes: n must be a non-negative integer, got ${n}`);
  }
  const bytes = new Uint8Array(n);
  if (n > 0) webcrypto().getRandomValues(bytes);
  return bytes;
}

/** Lowercase hex string of `n` random bytes (length = 2n). */
export function randomHex(n: number): string {
  const bytes = randomBytes(n);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

/** RFC 4122 v4 UUID. Uses crypto.randomUUID when available, else builds one. */
export function randomUUID(): string {
  const c = webcrypto();
  if (typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  // Fallback per RFC 4122 §4.4: 16 random bytes with version/variant bits set.
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10x
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) hex.push(bytes[i].toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}
