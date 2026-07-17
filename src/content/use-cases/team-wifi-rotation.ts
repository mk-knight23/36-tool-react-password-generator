import type { ContentDoc } from "@/content/types";

export const teamWifiRotation: ContentDoc = {
  slug: "team-wifi-rotation",
  title: "Rotating a team or office Wi-Fi password",
  description:
    "A simple routine for an office manager to rotate the shared Wi-Fi password when people join and leave, with a strong key that is still easy to share.",
  summary:
    "A repeatable way to rotate the shared office Wi-Fi key without locking everyone out.",
  category: "For teams",
  readingTime: "5 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "How strong should a Wi-Fi password be?", href: "/guides/wifi-password-guide" },
    { label: "Generate a Wi-Fi password", href: "/generate?mode=wifi" },
    { label: "API-key rotation checklist", href: "/checklists" },
  ],
  body: () => [
    {
      t: "p",
      text: "A shared Wi-Fi password has a quiet problem: everyone who has ever had it still has it. The contractor from last spring, the intern who left in June, the guest who joined for an afternoon. None of them forgot it, because nobody forgets a Wi-Fi password. The fix is not a stronger one-time key; it is a habit of rotating the key on a schedule that matches how people come and go.",
    },
    { t: "h2", text: "The situation" },
    {
      t: "p",
      text: "An office manager or team lead owns a network that a rotating set of people use. The password needs to be strong enough to resist the offline attack that Wi-Fi keys really face, easy enough to read off a card and type on a phone or a TV, and cheap enough to change that changing it is not a dreaded event.",
    },
    { t: "h2", text: "A rotation routine" },
    {
      t: "ol",
      items: [
        "Pick a trigger. A good default is to rotate whenever someone with access leaves, and on a fixed cadence otherwise, such as once a quarter. Rotate on events, not just the calendar.",
        "Generate a new key on the [Wi-Fi generator](/generate?mode=wifi). For a network people type by hand, a six-word passphrase or the easy-entry character mode keeps it strong without becoming a chore to enter.",
        "Set the new key on the router and, if you can, keep the old one live for a short overlap window so devices can be updated without a support scramble.",
        "Share it deliberately. Put it on a printed card at the desk or send it through your normal internal channel, not on a sticky note on the router itself.",
        "Note the date you changed it so the next rotation is not a guess.",
      ],
    },
    {
      t: "note",
      text: "Rotating on departure is the high-value move. It is the difference between a network only current people can use and one that a long tail of former visitors can still join.",
    },
    { t: "h2", text: "Keeping it strong and shareable" },
    {
      t: "p",
      text: "The tension with any shared secret is that convenience and strength pull in opposite directions. A passphrase resolves most of it: six random words are strong against offline cracking and far easier to relay than a string of symbols. If you prefer a character password, the generator's easy-entry mode avoids characters that are painful to type on TV and console keyboards, and it is honest that a smaller character set means it nudges the length up to keep the strength. Remember the standard caps the key at 63 characters, which is far more than you need.",
    },
    { t: "h2", text: "Where this stops" },
    {
      t: "p",
      text: "VaultPass generates the key and prints or exports it; it does not push the password to your router, manage devices, or track who has which version. For a small office that is fine, because rotation is a two-minute manual task. For a larger environment where you need per-user access and central control, that is a job for enterprise Wi-Fi with individual credentials rather than a single shared key. If your rotation touches other shared secrets too, the [checklists](/checklists) page has a reusable rotation checklist you can work through each time.",
    },
  ],
};
