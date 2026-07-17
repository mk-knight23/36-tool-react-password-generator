import type { ContentDoc } from "@/content/types";

export const recoveryCodesDoneRight: ContentDoc = {
  slug: "recovery-codes-done-right",
  title: "Recovery codes done right",
  description:
    "How two-factor backup codes work, how many you need, where to keep them, and how to print a clean offline sheet you can actually find later.",
  summary:
    "The backup that saves you when your phone is lost, and how to store it so it is there when you need it.",
  category: "Practical",
  readingTime: "6 min read",
  datePublished: "2026-07-17",
  howTo: {
    name: "Generate and store recovery codes",
    description:
      "Produce a set of one-time backup codes and store them so they survive a lost phone.",
    steps: [
      {
        name: "Generate a set",
        text: "Create ten codes in the standard grouped format using the recovery-code generator.",
      },
      {
        name: "Print an offline sheet",
        text: "Use the printable sheet, which prints codes only with no site chrome, and write the service name on it yourself.",
      },
      {
        name: "Store it physically",
        text: "Keep the sheet somewhere separate from your phone and laptop, such as a drawer at home or a safe.",
      },
      {
        name: "Cross one off as you use it",
        text: "Each code works once. Tick it off the sheet and regenerate the set when you are running low.",
      },
    ],
  },
  related: [
    { label: "Recovery-code sheets for a small team", href: "/use-cases/recovery-code-sheets" },
    { label: "Generate recovery codes", href: "/generate?mode=recovery" },
  ],
  body: () => [
    {
      t: "p",
      text: "Recovery codes are the backup key to your two-factor authentication. When you lose your phone, break it, or wipe it, they are what get you back into your account instead of a slow, uncertain support ticket. Most people generate them once, screenshot them into a photo library, and never think about them again, which is exactly how they end up unreachable at the worst moment. This guide covers what they are, how many to keep, and how to store them so they are there when the phone is not.",
    },
    { t: "h2", text: "What a recovery code actually is" },
    {
      t: "p",
      text: "When you turn on two-factor authentication, most services offer a set of one-time backup codes, usually around ten. Each one substitutes for your authenticator app or security key a single time. Use one to log in and it is spent; the rest still work. They exist precisely for the case where your normal second factor is unavailable, so their whole value is being reachable when your primary device is not.",
    },
    { t: "h2", text: "Where people store them wrong" },
    {
      t: "ul",
      items: [
        "**In a screenshot on the same phone** that holds the authenticator app. Lose or break the phone and both factors vanish together.",
        "**In an email to yourself**, where anyone who reads your inbox can read them and where they sit in plain text on someone else's server.",
        "**In a note synced to the cloud** without a second thought about who else can reach that account.",
        "**Nowhere**, because the setup screen was dismissed in a hurry and the codes were never saved at all.",
      ],
    },
    {
      t: "note",
      text: "The one place recovery codes must not live is the same device that holds your primary second factor. If both die together, the backup was never a backup.",
    },
    { t: "h2", text: "A storage approach that holds up" },
    {
      t: "p",
      text: "Treat recovery codes like a spare key to your house. You want at least one copy that is offline and physically separate from your everyday devices. A printed sheet in a drawer at home, or in a small safe, covers the common failure of a lost or stolen phone. If you use a password manager, storing the codes there as a secure note is reasonable too, as long as that vault is itself protected by a strong master password and its own second factor that does not depend on the same phone. Two copies in two different places is the sweet spot: enough redundancy to survive one loss, few enough that you can keep track of them.",
    },
    { t: "h2", text: "How many, and when to refresh" },
    {
      t: "p",
      text: "Ten codes is the common default and is plenty for personal use, because you only reach for one when your normal second factor is missing. Keep an eye on how many remain. When you are down to two or three, generate a fresh set on the service and replace your stored sheet, then destroy the old one so a spent list cannot cause confusion later. Most services invalidate the previous set when you generate a new one, which is what you want.",
    },
    { t: "h2", text: "Generating a clean sheet with MK VaultPass" },
    {
      t: "p",
      text: "The [recovery-code generator](/generate?mode=recovery) produces a set in the familiar grouped format, for example `k4m9x-2rt7p`, with the number of codes and the grouping configurable. It is worth being clear about what this tool does and does not do. It generates well-formatted random codes using Web Crypto, entirely on your device, which is genuinely useful for local backups, printed offline sheets, and any place where you control the verification side. It does not, and cannot, register codes with a third-party service like your bank or email provider; those services generate their own codes on their end. Use this generator for your own systems and for producing a tidy sheet; use the service's own codes for the service's own account.",
    },
    {
      t: "p",
      text: "The printable sheet is designed for exactly this job. It prints the codes in a high-contrast monospace layout with a checkbox beside each one and a date line, and it deliberately strips the site navigation, footer, and any other page chrome so the printout is just the codes. There is an option to leave the product name off entirely, so a sheet you leave in a drawer does not announce what it is for. You can also download the set as a plain text file. Whichever you choose, the codes are produced in your browser and never sent anywhere, which you can confirm by watching your network tab while you generate.",
    },
    {
      t: "p",
      text: "Recovery codes are boring right up until the day they save you. Spend five minutes now: generate a set, print or file it somewhere separate from your phone, and note when to refresh it. Future-you, standing in front of a locked account with a dead phone, will be grateful.",
    },
  ],
};
