import { randomUUID } from "@/lib/crypto/random";
import { type GenerationResult } from "./types";

/** A v4 UUID carries 122 bits of randomness (6 bits fixed for version/variant). */
export const UUID_ENTROPY_BITS = 122;

export function generateUuid(): GenerationResult {
  return {
    value: randomUUID(),
    entropyBits: UUID_ENTROPY_BITS,
    entropyEstimated: false,
  };
}
