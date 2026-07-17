import type { ContentDoc } from "@/content/types";
import { passphraseVsPassword } from "./passphrase-vs-password";
import { entropyExplained } from "./entropy-explained";
import { passwordPoliciesThatWork } from "./password-policies-that-work";
import { recoveryCodesDoneRight } from "./recovery-codes-done-right";
import { wifiPasswordGuide } from "./wifi-password-guide";
import { apiTokenFormats } from "./api-token-formats";
import { commonPasswordLists } from "./common-password-lists";
import { browserCryptoExplained } from "./browser-crypto-explained";

/** All guides, in the order shown on the guides index page. */
export const GUIDES: ContentDoc[] = [
  passphraseVsPassword,
  entropyExplained,
  browserCryptoExplained,
  commonPasswordLists,
  passwordPoliciesThatWork,
  apiTokenFormats,
  wifiPasswordGuide,
  recoveryCodesDoneRight,
];

export function getGuide(slug: string): ContentDoc | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export const GUIDE_SLUGS: string[] = GUIDES.map((guide) => guide.slug);
