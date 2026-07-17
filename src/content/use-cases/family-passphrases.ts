import type { ContentDoc } from "@/content/types";

export const familyPassphrases: ContentDoc = {
  slug: "family-passphrases",
  title: "Memorable passphrases for family accounts",
  description:
    "How to make strong passphrases that a non-technical family member can actually remember and type, for the handful of accounts they log into by hand.",
  summary:
    "Strong secrets a family member can remember and type, for the few passwords they key in by hand.",
  category: "Everyday",
  readingTime: "5 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "Passphrase vs password", href: "/guides/passphrase-vs-password" },
    { label: "Generate a passphrase", href: "/generate?mode=passphrase" },
    { label: "Common password lists", href: "/guides/common-password-lists" },
  ],
  body: () => [
    {
      t: "p",
      text: "Most accounts should live in a password manager with a long random secret nobody memorizes. But there is always a short list that a person actually has to remember and type by hand: the phone or laptop login, the password manager's own master password, maybe the email account that everything else recovers through. For a family member who is not going to enjoy typing a string of symbols, a passphrase is the kindest strong option, and this walkthrough is about producing one they will actually keep.",
    },
    { t: "h2", text: "The situation" },
    {
      t: "p",
      text: "You are the person friends and family ask for help. A relative needs a handful of passwords they can remember without writing them on a sticky note, that are genuinely strong, and that they can type on a phone without wanting to throw it. You want to set them up once and not be back next month.",
    },
    { t: "h2", text: "Why a passphrase, not a clever password" },
    {
      t: "p",
      text: "A random passphrase is four to six words drawn at random from a large list, like `harbor-cactus-velvet-ninth-cobalt`. It is strong because the words are chosen by chance, not by a person, and it is memorable because human brains hold onto words far better than they hold onto `X7$mq2!`. The catch that people get wrong is picking the words themselves, which quietly destroys the strength, because self-chosen words cluster around favorites and follow guessable themes. Let the generator draw them; that is the whole point.",
    },
    { t: "h2", text: "Setting one up" },
    {
      t: "ol",
      items: [
        "Open the [passphrase generator](/generate?mode=passphrase) and set it to five words for an everyday account, or six for the master password that protects everything else.",
        "Choose a separator that is easy to type, like a dash or a space, and skip appended digits and forced capitals unless a site demands them, since they add little and hurt memorability.",
        "Generate a few and let your relative pick one that happens to stick. There is no security cost to choosing among random options; each one is equally strong.",
        "Have them type it a couple of times right away to build the muscle memory, and store a copy in the family password manager as a backup for the accounts that are not the manager itself.",
      ],
    },
    {
      t: "note",
      text: "Five random words is strong enough for everyday accounts and easy to learn in a day. Save six words for the one or two passwords that guard everything else.",
    },
    { t: "h2", text: "Common worries, answered plainly" },
    {
      t: "ul",
      items: [
        "**Is a passphrase really as strong as symbols?** Yes, when it has enough random words. Five words from a large list is stronger than most people's symbol passwords and far easier to type.",
        "**What if they forget it?** For everyday accounts, keep a copy in the family password manager. For the master password, a written copy kept somewhere safe at home is a reasonable backup.",
        "**Can I reuse a good one?** No. One passphrase per account that matters, so a leak in one place cannot spread. Reuse is the mistake that undoes all the effort.",
      ],
    },
    { t: "h2", text: "Where VaultPass fits" },
    {
      t: "p",
      text: "VaultPass generates the passphrase, locally and with honest strength numbers, and prints or displays it so you can help someone set it up in person. It does not store the passphrase or manage the account. For the accounts your family will not type by hand, pair this with a real password manager holding long random secrets; for the few they must remember, a generated passphrase is the humane, strong choice.",
    },
  ],
};
