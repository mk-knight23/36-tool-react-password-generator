import type { ContentDoc } from "@/content/types";

export const passphraseVsPassword: ContentDoc = {
  slug: "passphrase-vs-password",
  title: "Passphrase vs password: which should you use?",
  description:
    "A practical comparison of random passwords and word-based passphrases, with the entropy math, where each one fits, and how to generate both locally.",
  summary:
    "When a string of random characters beats a set of random words, and when it does not.",
  category: "Fundamentals",
  readingTime: "6 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "Entropy, explained without the hand-waving", href: "/guides/entropy-explained" },
    { label: "Generate a passphrase", href: "/generate?mode=passphrase" },
    { label: "Analyze a password", href: "/analyze" },
  ],
  body: () => [
    {
      t: "p",
      text: "A password is a short string of characters. A passphrase is a handful of random words. Both can be strong, and both can be weak. The difference that matters is not which style looks more serious, but how much genuine randomness went into building it and whether you can actually use the result. This guide walks through both, shows the math, and points to where each one earns its place.",
    },
    { t: "h2", text: "What actually makes either one strong" },
    {
      t: "p",
      text: "Strength comes from entropy: the number of equally likely values the secret could have been. A secret is only as strong as the process that generated it. `correct horse battery staple` is famous, but if you picked those four words yourself, they are not random and the strength estimate does not hold. The words have to be drawn uniformly at random from a known list, and the characters in a password have to be drawn uniformly from a known alphabet. MK VaultPass does exactly that with Web Crypto and rejection sampling, so the entropy readout you see is honest. See [entropy, explained](/guides/entropy-explained) for the full derivation.",
    },
    {
      t: "p",
      text: "Here is the short version. For a random character password, entropy is length times the base-2 logarithm of the alphabet size. A 16-character password over the 94 printable ASCII symbols is about 16 x 6.55, roughly 105 bits. For a passphrase, entropy is the number of words times the base-2 logarithm of the wordlist size. VaultPass ships the EFF large wordlist of 7,776 words, so each word adds about 12.9 bits. A five-word passphrase is about 64 bits; a seven-word passphrase is about 90 bits.",
    },
    { t: "h2", text: "The trade you are really making" },
    {
      t: "p",
      text: "Character passwords pack more entropy per character, so they are shorter for the same strength. Passphrases are longer but far easier to read aloud, type on a phone or a TV remote, and copy from a screen without mistakes. The right choice depends on where the secret has to live.",
    },
    {
      t: "ul",
      items: [
        "**Use a random password** when a machine stores it for you and you rarely type it: website logins saved in a password manager, database credentials, service accounts. Length is cheap when you never key it in by hand.",
        "**Use a passphrase** when a human has to type or say it: a laptop login, a disk-encryption key, a Wi-Fi password read out to guests, a master password for your password manager. Fewer typos, less frustration, and still strong if you use enough words.",
      ],
    },
    { t: "h2", text: "How many words or characters is enough" },
    {
      t: "p",
      text: "A useful floor for anything that protects real accounts is around 75 to 80 bits. That maps to roughly a 12-character random password or a six-word passphrase. For a master password or a disk key that guards everything else, go higher: six or seven words, or a 16-character password. Do not overthink the top end. Once you are past about 100 bits, brute force is not the weak link anymore; phishing, reused secrets, and malware are.",
    },
    {
      t: "note",
      text: "A four-word passphrase is about 52 bits. That is fine for low-stakes throwaway accounts, but treat it as the minimum, not the target, for anything you care about.",
    },
    { t: "h2", text: "Common mistakes that cancel out the math" },
    {
      t: "ul",
      items: [
        "Choosing the words yourself. Human-picked words cluster around common themes and are far more guessable than the count suggests. Let the tool draw them.",
        "Substituting characters to look clever, like turning an o into a zero. Attackers know every substitution; it adds almost nothing.",
        "Reusing the same strong secret across sites. One breach then unlocks all of them. Strength does not survive reuse.",
        "Padding a weak base with a trailing 1 or a bang. The entropy is in the base, not the decoration.",
      ],
    },
    { t: "h2", text: "Generate and check both, locally" },
    {
      t: "p",
      text: "You do not have to trust a description. Open the [generator](/generate), switch between the password and passphrase modes, and watch the entropy ring update as you change length, word count, and separators. Everything runs in your browser through Web Crypto; nothing you generate is sent anywhere. If you already have a secret and want a second opinion, paste it into the [analyzer](/analyze) to see an entropy estimate, pattern warnings, and a check against the thousand most common passwords, again entirely on your device.",
    },
    {
      t: "p",
      text: "The honest summary: passphrases and passwords are two shapes of the same idea. Pick the shape that fits where the secret has to be used, give it enough randomness to clear the bar for its job, and never reuse it. The style matters far less than the process behind it.",
    },
  ],
};
