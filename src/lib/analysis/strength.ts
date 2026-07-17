export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface Strength {
  level: StrengthLevel;
  label: string;
}

export const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  0: "Very weak",
  1: "Weak",
  2: "Fair",
  3: "Strong",
  4: "Excellent",
};

/**
 * Map entropy bits to one of five levels (DESIGN_SYSTEM.md §2.3). A
 * common-password hit is always Very weak regardless of entropy.
 */
export function classifyStrength(entropyBits: number, commonHit = false): Strength {
  if (commonHit || entropyBits < 28) return { level: 0, label: STRENGTH_LABELS[0] };
  if (entropyBits < 50) return { level: 1, label: STRENGTH_LABELS[1] };
  if (entropyBits < 70) return { level: 2, label: STRENGTH_LABELS[2] };
  if (entropyBits < 100) return { level: 3, label: STRENGTH_LABELS[3] };
  return { level: 4, label: STRENGTH_LABELS[4] };
}
