/** Generator mode identifiers, also used as deep-link `?mode=` values. */
export type GeneratorMode =
  | "password"
  | "passphrase"
  | "pronounceable"
  | "pin"
  | "uuid"
  | "string"
  | "token"
  | "recovery"
  | "wifi";

export const GENERATOR_MODES: GeneratorMode[] = [
  "password",
  "passphrase",
  "pronounceable",
  "pin",
  "uuid",
  "string",
  "token",
  "recovery",
  "wifi",
];

/**
 * The result of one generation.
 * - `entropyBits` is the information content of the generation model.
 * - `entropyEstimated` is true when the value is not uniformly random over a
 *   flat alphabet (pronounceable mode), so the number is a labelled estimate.
 */
export interface GenerationResult {
  value: string;
  entropyBits: number;
  entropyEstimated: boolean;
}

/** Entropy of `length` independent uniform draws from an alphabet of `size`. */
export function uniformEntropyBits(size: number, length: number): number {
  if (size <= 1 || length <= 0) return 0;
  return Math.log2(size) * length;
}
