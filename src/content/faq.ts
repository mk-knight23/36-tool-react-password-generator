/**
 * FAQ entries. Answers use the inline syntax from blocks.ts (links, code, bold)
 * for display; the FAQPage JSON-LD uses a stripped plain-text version. Every
 * answer is honest per STANDARDS §9 — limits stated plainly, no overclaiming.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is MK VaultPass a password manager?",
    answer:
      "No. It generates passwords, passphrases, tokens, and recovery codes; it does not store, sync, or fill them for you. There is no vault. Save what you generate in a real password manager. Keeping this line clear is the whole point: a tool that generates is not a tool that stores, and mixing the two is how trust breaks.",
  },
  {
    question: "Can you see the passwords I generate?",
    answer:
      "No, and you can verify it rather than trust it. Every secret is produced in your browser with the Web Crypto API, and nothing you generate is sent anywhere. Open your browser's developer tools, switch to the network tab, and generate as many secrets as you like: you will see the page load once and then nothing further leave. The [how it works](/docs) page explains the boundary in detail.",
  },
  {
    question: "Do I need an account or internet connection?",
    answer:
      "No account, ever. After the page has loaded once, generation needs no network at all, because it runs entirely in your browser. You can disconnect and keep generating.",
  },
  {
    question: "How is the randomness generated?",
    answer:
      "Through `crypto.getRandomValues`, the browser's cryptographically secure random source, combined with rejection sampling so every character is exactly equally likely. General-purpose random functions, the kind meant for shuffling or games, are never used for secrets, and a test fails the build if such a call ever appears in the source. See [browser crypto explained](/guides/browser-crypto-explained).",
  },
  {
    question: "Are my generated secrets stored anywhere?",
    answer:
      "Only if you turn on history yourself, and it is off by default. When history is off, nothing you generate is written to any storage. When you turn it on, a warning explains that secrets will be saved in this browser in plain text, and you can wipe them in one click at any time.",
  },
  {
    question: "What is the strength or entropy number telling me?",
    answer:
      "It is the number of bits of entropy: roughly, how many equally likely secrets the generator could have produced. Each extra bit doubles the possibilities. Under 28 bits is very weak, 70 to 99 is strong, and 100 or more is excellent. The [entropy guide](/guides/entropy-explained) works through the math.",
  },
  {
    question: "Can the AI feature see my password?",
    answer:
      "No. The optional AI question feature is built so it physically cannot receive a secret: its input is a fixed set of topics plus a short, length-capped question field, and both your browser and the server reject anything that looks like a generated secret before it is sent. The password you analyze is never part of an AI request.",
  },
  {
    question: "Does the analyzer send my password to a breach-check service?",
    answer:
      "No. The analyzer checks your input against a bundled list of the thousand most common passwords entirely in your browser, with no network request. That catches the worst offenders but is smaller than a full breach corpus, so a pass means your password is not among the most common ones, not that it has never appeared in any breach. This trade is deliberate: nothing you type has to leave your device. See [common password lists](/guides/common-password-lists).",
  },
  {
    question: "Can VaultPass register recovery codes with my bank or email?",
    answer:
      "No. It generates well-formatted random codes for systems where you control the verification side, and it prints a clean offline sheet. Third-party services like banks and email providers generate their own codes on their servers; use theirs for their accounts, and use VaultPass for your own systems and for producing a tidy printed sheet.",
  },
  {
    question: "Why is there a 63-character limit on Wi-Fi passwords?",
    answer:
      "That is the WPA standard's cap on the pre-shared key, not a VaultPass choice. The generator enforces it so you cannot create a key your router will reject. You do not need to reach it; around 20 random characters or six random words already defeats offline cracking. See the [Wi-Fi guide](/guides/wifi-password-guide).",
  },
  {
    question: "Is it really free, and is the code open?",
    answer:
      "Yes to both. MK VaultPass is free and open source under the MIT license. You can read the code, run it yourself, and confirm every claim on this page. The [open source](/open-source) page explains how to audit it and what to look for.",
  },
  {
    question: "Does the site use tracking or ads?",
    answer:
      "Analytics are off unless you allow them, and even then they receive only anonymous event names and counts, never any generated secret. Ads are prepared in the codebase but disabled, and no ad script loads. You can review and change your choices on the [cookies](/cookies) page or in Settings.",
  },
  {
    question: "What happens if I clear my browser data?",
    answer:
      "Your preferences, any opt-in history, and generation counts are stored locally in this browser, so clearing site data removes them. Since nothing is stored on a server, there is nothing to recover and nothing left behind elsewhere. Export your data first from Settings if you want to keep a copy.",
  },
];
