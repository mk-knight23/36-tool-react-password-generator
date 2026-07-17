import commonList from "@/data/common-passwords.json";

const COMMON = commonList as string[];
const COMMON_SET = new Set(COMMON);

export const COMMON_PASSWORD_COUNT = COMMON.length;

/**
 * Check a candidate against the bundled top-1,000 common-password list.
 * Exact and lowercase match, all local — no network request (PRODUCT_SPEC 5.11).
 */
export function isCommonPassword(value: string): boolean {
  if (!value) return false;
  return COMMON_SET.has(value) || COMMON_SET.has(value.toLowerCase());
}
