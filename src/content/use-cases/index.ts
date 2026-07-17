import type { ContentDoc } from "@/content/types";
import { developerApiTokens } from "./developer-api-tokens";
import { teamWifiRotation } from "./team-wifi-rotation";
import { recoveryCodeSheets } from "./recovery-code-sheets";
import { envSecretsHygiene } from "./env-secrets-hygiene";
import { familyPassphrases } from "./family-passphrases";

/** All use-cases, in the order shown on the use-cases index page. */
export const USE_CASES: ContentDoc[] = [
  developerApiTokens,
  envSecretsHygiene,
  teamWifiRotation,
  recoveryCodeSheets,
  familyPassphrases,
];

export function getUseCase(slug: string): ContentDoc | undefined {
  return USE_CASES.find((useCase) => useCase.slug === slug);
}

export const USE_CASE_SLUGS: string[] = USE_CASES.map((useCase) => useCase.slug);
