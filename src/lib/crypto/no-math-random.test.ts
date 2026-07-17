import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Product-defining invariant (PRODUCT_SPEC.md G1, AUDIT.md §2 finding 1):
 * `Math.random` must not appear anywhere in `src/` outside test files. All
 * randomness goes through src/lib/crypto/random.ts (Web Crypto + rejection
 * sampling). This test is the in-repo half of the guard; CI also greps.
 */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...walk(full));
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("no Math.random in src", () => {
  it("finds zero references to Math.random outside test files", () => {
    const srcDir = join(process.cwd(), "src");
    const offenders: string[] = [];
    for (const file of walk(srcDir)) {
      if (/\.test\.(ts|tsx|js|jsx)$/.test(file)) continue;
      const content = readFileSync(file, "utf8");
      // Strip block and line comments so prose that names the banned API (this
      // module documents why it is banned) does not trip the check — only real
      // code references count.
      const code = content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "");
      if (/Math\.random/.test(code)) {
        offenders.push(file.replace(process.cwd() + "/", ""));
      }
    }
    expect(offenders).toEqual([]);
  });
});
