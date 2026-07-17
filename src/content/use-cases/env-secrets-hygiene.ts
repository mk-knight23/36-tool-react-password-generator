import type { ContentDoc } from "@/content/types";

export const envSecretsHygiene: ContentDoc = {
  slug: "env-secrets-hygiene",
  title: "Environment secret hygiene",
  description:
    "Practical habits for generating, storing, and rotating the secrets in your .env files so a leak stays small and recovery is quick.",
  summary:
    "Generate, store, and rotate the secrets behind your apps so one leak does not become many.",
  category: "For developers",
  readingTime: "5 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "API token formats explained", href: "/guides/api-token-formats" },
    { label: "Generating API tokens", href: "/use-cases/developer-api-tokens" },
    { label: "Environment secret checklist", href: "/checklists" },
  ],
  body: () => [
    {
      t: "p",
      text: "Every project accumulates a small pile of secrets: a database URL with a password in it, an API key or two, a signing secret, maybe an SMTP credential. They usually live in an environment file, and the difference between a minor incident and a bad week is whether you treated them with a little discipline from the start. This walkthrough covers the habits that keep a leak small and recovery fast.",
    },
    { t: "h2", text: "The situation" },
    {
      t: "p",
      text: "You are running one or more applications with real credentials in environment variables. You want the values to be strong, out of source control, easy to replace, and you want to know exactly what to do on the day one of them leaks.",
    },
    { t: "h2", text: "Generate strong, distinct values" },
    {
      t: "p",
      text: "Start by not reusing secrets across services. A shared signing secret means one leak compromises everything that trusts it. Generate a distinct value for each purpose on the [API-token generator](/generate?mode=token): 32 bytes of hex is a solid default for signing secrets and internal keys. Because generation is local, the value is never seen by anyone but you before it goes into your secret store. Give each secret a clear name in your environment file so future-you knows what each one unlocks.",
    },
    { t: "h2", text: "Keep them out of git" },
    {
      t: "ul",
      items: [
        "Add your environment file to `.gitignore` before the first commit, not after, since a secret committed once lives in history even after you delete it.",
        "Commit a `.env.example` with the variable names and blank or placeholder values, so collaborators know what is needed without seeing the real values.",
        "If a secret ever lands in a commit, treat it as leaked: rotate it, do not just remove the line. Rewriting history is not enough once it has been pushed.",
      ],
    },
    {
      t: "note",
      text: "A secret that was committed and then deleted is still in the repository history and any clone or fork of it. The only safe response is to rotate the value, not to remove the line.",
    },
    { t: "h2", text: "Store them where they belong" },
    {
      t: "p",
      text: "For local development, an ignored environment file is fine. For anything deployed, use your host's secret settings or a dedicated secret manager rather than shipping a plaintext file. Limit who and what can read each secret to only what needs it. A key that only the payment service uses should not be readable by every part of the system.",
    },
    { t: "h2", text: "Rotate on evidence, and know the drill" },
    {
      t: "p",
      text: "Do not rotate secrets on a nervous calendar; rotate when there is a reason. A contributor leaves, a laptop is lost, a value shows up in a log, a dependency is compromised. When that happens you want the steps to be muscle memory: generate a replacement, update the secret store, deploy, confirm the new value works, then revoke the old one. Doing it in that order avoids downtime. The [environment secret checklist](/checklists) turns this into a list you can actually follow under pressure.",
    },
    { t: "h2", text: "Where VaultPass fits" },
    {
      t: "p",
      text: "VaultPass generates the strong, distinct values this workflow depends on, locally and verifiably. It is not a secret manager and does not store, distribute, or rotate anything for you. Think of it as the part of the job that makes the raw material trustworthy; the storing and rotating is yours, and the habits above are what make it reliable.",
    },
  ],
};
