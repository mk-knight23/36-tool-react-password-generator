/**
 * Predefined question categories for the single AI route (`/api/ai/explain`,
 * PRODUCT_SPEC §6). The `topic` enum is the only required input field. Each
 * topic carries:
 *
 * - `label`  — shown in the UI selector.
 * - `prompt` — the canonical question sent to the model when the user does not
 *   type a custom one. Never contains anything user-supplied.
 * - `fallback` — a deterministic, human-written answer used verbatim when the
 *   AI is unavailable (no gateway key / no BYOK / quota reached / network
 *   error). It is clearly labeled as the non-AI local explanation in the UI.
 *
 * There is deliberately no field on any topic (or on the request) that can
 * carry a secret. See `schema.ts` and `secret-guard.ts` for the physical and
 * defence-in-depth guarantees.
 */

export interface AiTopic {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
  readonly fallback: string;
}

export const AI_TOPICS = [
  {
    id: "password-strength",
    label: "What makes a password strong?",
    prompt:
      "In plain language, explain what actually makes a password strong, and which common beliefs about strong passwords are misleading.",
    fallback:
      "Length and unpredictability matter far more than swapping letters for symbols. A long password made of random characters, or a passphrase of several random words, is strong because there are too many possibilities to guess. Predictable tricks (Password1!, capital-then-word-then-year) add almost nothing, because attackers try those patterns first. Aim for high randomness from a generator rather than something you invented, and never reuse the same password across accounts.",
  },
  {
    id: "passphrase-vs-password",
    label: "Passphrase or password?",
    prompt:
      "Explain the trade-offs between a random-character password and a multi-word passphrase, and when someone should prefer each.",
    fallback:
      "A random-character password packs the most strength into the fewest characters, which is useful when a field has a tight length limit. A passphrase (several random words) reaches the same strength with more characters but is far easier to type and remember, which suits the handful of passwords you actually memorise, like a device login or password-manager master password. Both are strong only when the words or characters are chosen randomly by a generator, not picked by you.",
  },
  {
    id: "entropy-explained",
    label: "What is entropy / bits of strength?",
    prompt:
      "Explain what 'bits of entropy' means for a password, how to interpret the number, and roughly what values are considered weak versus strong.",
    fallback:
      "Entropy in bits measures how many equally-likely possibilities a password was drawn from: each extra bit doubles the guesses an attacker needs. As a rough guide, under 28 bits is very weak, 50-70 bits is fair, and 100+ bits is excellent for anything valuable. The figure only holds if every character or word was chosen randomly; a 'clever' human-made password has far less real entropy than its length suggests, because people are predictable.",
  },
  {
    id: "password-policies",
    label: "What makes a good password policy?",
    prompt:
      "Explain what a sensible modern password policy looks like for a team, referencing current guidance, and which old rules are now discouraged.",
    fallback:
      "Modern guidance (for example NIST 800-63B) favours a long minimum length, screening new passwords against known-breached lists, and not forcing periodic changes unless there is evidence of compromise. The old habits of mandatory 90-day rotation and rigid complexity rules tend to push people toward predictable patterns and are now discouraged. Allow long passphrases, permit all characters including spaces, and rely on length plus a breach check rather than arbitrary composition rules.",
  },
  {
    id: "policy-explanation",
    label: "Explain a specific password policy",
    prompt:
      "Explain, in plain language, what the following password policy requires, how strong passwords under it tend to be, and any weaknesses or improvements worth considering.",
    fallback:
      "A policy's real strength comes from its minimum length far more than from which character types it forces. Requiring several character classes can help, but a long minimum (say 12-16+) plus screening against breached passwords does most of the work. Very short minimums stay weak no matter how many symbol rules you add. If you set a rotation interval, prefer rotating only on suspected compromise rather than on a fixed schedule, which tends to produce predictable variations.",
  },
  {
    id: "recovery-codes",
    label: "How should I handle recovery codes?",
    prompt:
      "Explain what account recovery / backup codes are for and how to store and use them safely.",
    fallback:
      "Recovery codes are one-time backups that let you back into an account if you lose your second factor. Generate them, then store them somewhere separate from the device that holds your normal login: printed and kept physically, or saved in a password manager entry distinct from the account itself. Cross a code off once used, and regenerate the whole set if you suspect the list was seen by anyone else. Treat the list like a spare key, because anyone holding it can bypass your second factor.",
  },
  {
    id: "wifi-passwords",
    label: "How strong should a Wi-Fi password be?",
    prompt:
      "Explain how to choose a strong Wi-Fi (WPA2/WPA3) password and what length is appropriate.",
    fallback:
      "Wi-Fi passwords are a prime target for offline guessing, so length is your main defence: aim for at least 20 random characters (the WPA2 limit is 63). Because you usually type it rarely and can share it by other means, you can afford a long random value. Use WPA3 if your devices support it, change the router's default admin password too, and avoid basing the passphrase on the network name, your address, or anything else a neighbour could guess.",
  },
  {
    id: "api-tokens",
    label: "How do API tokens and secrets differ?",
    prompt:
      "Explain the common formats for API tokens and secrets (hex, base64url, prefixed keys), how their length relates to strength, and how to handle them safely.",
    fallback:
      "API tokens are usually random bytes shown as hex or base64url; a 32-byte token is 256 bits of strength, which is effectively unguessable. Prefixes like sk_live_ are just labels for humans and tools and add no strength. Keep tokens out of source code and client-side bundles, store them in environment variables or a secrets manager, scope them to the least access needed, and rotate them if one may have leaked. Length in bytes, not visual complexity, is what determines how hard a token is to guess.",
  },
  {
    id: "password-reuse",
    label: "Why does password reuse matter?",
    prompt:
      "Explain the risk of reusing passwords across accounts and what to do instead.",
    fallback:
      "When one site is breached, attackers take the leaked email-and-password pairs and try them on other services automatically (credential stuffing). If you reused that password, those other accounts fall too, no matter how strong the password was. The fix is a unique random password per account, which is only practical with a password manager to store them. VaultPass generates the unique values; a password manager remembers them for you.",
  },
  {
    id: "not-a-password-manager",
    label: "Is VaultPass a password manager?",
    prompt:
      "Explain the difference between a password generator and a password manager, and why a generator alone is not enough.",
    fallback:
      "No. VaultPass generates strong secrets in your browser, but it does not store, sync, or fill them for you, and it should not be your system of record. A password manager is what remembers your unique passwords across sites, autofills them, and syncs them between devices. Use VaultPass to create strong values, then save each one in a real password manager. Anything shown in VaultPass's optional local history is a convenience for this device only, not a vault.",
  },
] as const satisfies readonly AiTopic[];

export type AiTopicId = (typeof AI_TOPICS)[number]["id"];

export const AI_TOPIC_IDS = AI_TOPICS.map((t) => t.id) as [
  AiTopicId,
  ...AiTopicId[],
];

const TOPIC_BY_ID: Record<string, AiTopic> = Object.fromEntries(
  AI_TOPICS.map((t) => [t.id, t]),
);

export function getTopic(id: string): AiTopic | undefined {
  return TOPIC_BY_ID[id];
}

/** The topic that pairs with a structured policy object (PRODUCT_SPEC §6). */
export const POLICY_TOPIC_ID: AiTopicId = "policy-explanation";
