export const SITE = {
  name: "MK VaultPass",
  tagline: "Local password & secret generator",
  description:
    "Generate passwords, passphrases, tokens, and recovery codes entirely in your browser. Nothing you generate ever touches a server. MK VaultPass is not a password manager.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaultpass.mkazi.live",
  repo: "https://github.com/mk-knight23/36-tool-react-password-generator",
} as const;

export const CREATOR = {
  name: "Kazi Musharraf",
  role: "AI Engineer · Full-Stack Developer · Open-Source Builder",
  github: "https://github.com/mk-knight23",
  portfolio: "https://www.mkazi.live",
  // Exact, non-negotiable footer sentence (STANDARDS §3).
  footerSentence: "Built and maintained by Kazi Musharraf. Open source for everyone.",
} as const;

export const NOT_A_PASSWORD_MANAGER =
  "MK VaultPass is not a password manager. It generates secrets; it does not sync or store them for you. Save what you generate in a real password manager.";
