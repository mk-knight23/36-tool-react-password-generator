/**
 * Static checklist and template content for /checklists. Item ids are stable and
 * globally unique so a checked-off state can persist in localStorage (non-secret
 * UI state only). Copy is honest and specific per STANDARDS §9.
 */
export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

export const CHECKLISTS: Checklist[] = [
  {
    id: "env-secrets",
    title: "Environment secret hygiene",
    description:
      "Work through this when adding secrets to a project or reviewing an existing one.",
    items: [
      { id: "env-1", text: "Each secret is a distinct, randomly generated value, not reused across services." },
      { id: "env-2", text: "The environment file is in .gitignore before the first commit." },
      { id: "env-3", text: "A .env.example lists every variable name with blank or placeholder values." },
      { id: "env-4", text: "No secret is hardcoded in source, tests, or CI configuration." },
      { id: "env-5", text: "Deployed secrets live in the host's secret store, not a plaintext file." },
      { id: "env-6", text: "Read access to each secret is limited to the service that needs it." },
      { id: "env-7", text: "Any secret ever committed to git has been rotated, not just deleted." },
      { id: "env-8", text: "Logs and error reports are checked so they do not print secret values." },
    ],
  },
  {
    id: "api-key-rotation",
    title: "API key rotation",
    description:
      "Follow in order when rotating a key so there is no downtime and no lingering access.",
    items: [
      { id: "rot-1", text: "Confirm the reason for rotation (departure, exposure, incident, or policy)." },
      { id: "rot-2", text: "Generate the replacement key and record where it will be stored." },
      { id: "rot-3", text: "Add the new key to the secret store alongside the old one." },
      { id: "rot-4", text: "Deploy so the service accepts the new key." },
      { id: "rot-5", text: "Verify the new key works in the running environment." },
      { id: "rot-6", text: "Revoke the old key only after the new one is confirmed working." },
      { id: "rot-7", text: "Update any documentation, teammates, or dependent systems that referenced the key." },
      { id: "rot-8", text: "Note the rotation date and the next review, if any." },
    ],
  },
];

export interface PolicyTemplate {
  id: string;
  title: string;
  description: string;
  body: string;
}

/**
 * Editable-by-copy templates. Deliberately plain and honest: no fake compliance
 * claims (no "SOC2-ready" or similar) per PRODUCT_SPEC §5.14.
 */
export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "personal-password",
    title: "Personal password practice",
    description: "A short set of habits for your own accounts.",
    body: [
      "1. Use a unique password for every account. Never reuse one.",
      "2. Prefer a password manager to store long random passwords you do not memorise.",
      "3. Use a memorable passphrase (5+ random words) only for the few secrets you type by hand.",
      "4. Turn on two-factor authentication wherever it is offered, and store backup codes offline.",
      "5. Change a password only when you have a reason to (a breach or exposure), not on a schedule.",
    ].join("\n"),
  },
  {
    id: "team-password",
    title: "Team password baseline",
    description: "A starting point for a small team. Adapt to your own needs.",
    body: [
      "- Minimum length: 12 characters for standard accounts, 14+ for admin and service accounts.",
      "- Allow at least 64 characters, spaces, and all printable symbols. Never block paste.",
      "- Screen new passwords against a known-breached-password list; reject matches.",
      "- Require multi-factor authentication on all accounts.",
      "- Rotate credentials on evidence of compromise or on staff departure, not on a fixed calendar.",
      "- Store shared secrets in a team password manager, not in chat or documents.",
    ].join("\n"),
  },
  {
    id: "incident-response",
    title: "Credential exposure response",
    description: "What to do the moment a secret leaks.",
    body: [
      "1. Treat the secret as compromised the instant it is exposed, even if you are unsure.",
      "2. Rotate the affected credential immediately using the rotation checklist above.",
      "3. Revoke the old value once the replacement is confirmed working.",
      "4. Check logs for use of the exposed credential during the exposure window.",
      "5. Review how it leaked and fix the cause (a committed file, a shared channel, a misconfigured log).",
      "6. Record what happened and what changed, so the next response is faster.",
    ].join("\n"),
  },
];
