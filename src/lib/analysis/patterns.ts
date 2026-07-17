export type PatternKind = "repetition" | "sequence" | "keyboard";

export interface PatternFinding {
  kind: PatternKind;
  label: string;
  /** The matched fragment, for display. */
  fragment: string;
}

const KEYBOARD_ROWS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1234567890",
];

/** Runs of the same character (3 or more). */
function findRepetition(value: string): PatternFinding[] {
  const found: PatternFinding[] = [];
  const re = /(.)\1{2,}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    found.push({ kind: "repetition", label: "Repeated characters", fragment: m[0] });
  }
  return found;
}

/** Ascending or descending character-code runs of length 4+. */
function findSequences(value: string): PatternFinding[] {
  const found: PatternFinding[] = [];
  const lower = value.toLowerCase();
  let i = 0;
  while (i < lower.length) {
    let asc = 1;
    let desc = 1;
    while (i + asc < lower.length && lower.charCodeAt(i + asc) === lower.charCodeAt(i + asc - 1) + 1) {
      asc++;
    }
    while (
      i + desc < lower.length &&
      lower.charCodeAt(i + desc) === lower.charCodeAt(i + desc - 1) - 1
    ) {
      desc++;
    }
    const run = Math.max(asc, desc);
    if (run >= 4) {
      found.push({
        kind: "sequence",
        label: "Sequential characters",
        fragment: value.slice(i, i + run),
      });
      i += run;
    } else {
      i++;
    }
  }
  return found;
}

/** Straight keyboard-row runs of length 4+ (forward or reverse). */
function findKeyboard(value: string): PatternFinding[] {
  const found: PatternFinding[] = [];
  const lower = value.toLowerCase();
  for (let start = 0; start < lower.length; start++) {
    for (let len = lower.length - start; len >= 4; len--) {
      const frag = lower.slice(start, start + len);
      const rev = frag.split("").reverse().join("");
      const hit = KEYBOARD_ROWS.some((row) => row.includes(frag) || row.includes(rev));
      if (hit) {
        found.push({
          kind: "keyboard",
          label: "Keyboard pattern",
          fragment: value.slice(start, start + len),
        });
        start += len - 1;
        break;
      }
    }
  }
  return found;
}

export function detectPatterns(value: string): PatternFinding[] {
  if (!value) return [];
  return [...findRepetition(value), ...findSequences(value), ...findKeyboard(value)];
}
