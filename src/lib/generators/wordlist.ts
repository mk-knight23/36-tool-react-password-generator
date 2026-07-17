import words from "@/data/eff-large-wordlist.json";

/**
 * The EFF "large" wordlist (7,776 words), the same list the EFF publishes for
 * diceware passphrases. Bundled as a static asset — no network fetch. A unit
 * test asserts the exact count and uniqueness so the entropy math stays honest
 * (legacy AUDIT.md §2 finding 6: the old list was a hand-rolled ~100 words).
 */
export const EFF_LARGE_WORDLIST: readonly string[] = words as string[];

export const EFF_WORDLIST_SIZE = EFF_LARGE_WORDLIST.length;
