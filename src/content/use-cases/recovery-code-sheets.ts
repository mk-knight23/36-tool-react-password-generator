import type { ContentDoc } from "@/content/types";

export const recoveryCodeSheets: ContentDoc = {
  slug: "recovery-code-sheets",
  title: "Printable recovery-code sheets",
  description:
    "How to produce a clean, offline, printable sheet of backup codes with a checkbox beside each one and no site chrome, for your own systems and backups.",
  summary:
    "A tidy offline sheet of backup codes you can file in a drawer and cross off as you use them.",
  category: "Practical",
  readingTime: "4 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "Recovery codes done right", href: "/guides/recovery-codes-done-right" },
    { label: "Generate recovery codes", href: "/generate?mode=recovery" },
  ],
  body: () => [
    {
      t: "p",
      text: "There is a specific, useful artifact that most tools make surprisingly hard to produce: a clean sheet of backup codes, printed on paper, with a box to tick beside each one, and nothing else on the page. Not a screenshot cluttered with browser chrome, not a note in an app on the same phone you are backing up. A physical sheet you can put in a drawer. This is what the recovery-code sheet is for.",
    },
    { t: "h2", text: "The situation" },
    {
      t: "p",
      text: "You want offline backup codes for a system you control, or a tidy printed set to keep alongside other important papers. You care that the printout is legible, that it has no distracting page furniture, and that the codes were generated on your device rather than fetched from somewhere.",
    },
    { t: "h2", text: "Producing the sheet" },
    {
      t: "ol",
      items: [
        "Open the [recovery-code generator](/generate?mode=recovery). Choose how many codes you want, ten is a sensible default, and the grouping format, such as `xxxxx-xxxxx`.",
        "Generate. The codes are produced in your browser with Web Crypto and never sent anywhere.",
        "Choose print. The print view shows the codes only: high-contrast monospace, a checkbox beside each code, and a date line, with the site navigation, footer, and any notices removed.",
        "If you would rather the paper not announce what it is for, turn on the option to leave the product name off before printing.",
        "Prefer a file? Download the set as plain text instead and store it in an encrypted location.",
      ],
    },
    {
      t: "note",
      text: "Write the service or system name on the sheet yourself, in pen. Keeping the label off the digital file and on the paper means a downloaded copy does not advertise what it unlocks.",
    },
    { t: "h2", text: "An honest note on what these codes are for" },
    {
      t: "p",
      text: "This generator produces well-formatted random codes for systems where you control the verification side: your own application, a local backup scheme, or a printed set you register yourself. It cannot register codes with a third-party service. When your bank or email provider gives you backup codes, those are generated on their servers and only their copy counts. Use this tool to generate codes for your own systems and to print a clean sheet; use the service's own codes for the service's account, and file them the same careful way.",
    },
    { t: "h2", text: "Storing the result" },
    {
      t: "p",
      text: "A printed sheet earns its keep only if it is somewhere you will find it and somewhere separate from your everyday devices. A drawer at home or a small safe covers the common case of a lost phone. Keep it away from the device that holds your primary second factor, cross off each code as you spend it, and generate a fresh set when you are running low. The [recovery codes done right](/guides/recovery-codes-done-right) guide goes further on how many to keep and when to refresh.",
    },
  ],
};
