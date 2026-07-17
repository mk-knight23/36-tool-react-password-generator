import type { ContentDoc } from "@/content/types";

export const entropyExplained: ContentDoc = {
  slug: "entropy-explained",
  title: "Entropy, explained without the hand-waving",
  description:
    "What password entropy actually measures, how to compute it for passwords and passphrases, and why the number on a strength meter can lie.",
  summary:
    "The one number behind every strength meter, derived from scratch with worked examples.",
  category: "Fundamentals",
  readingTime: "7 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "Passphrase vs password", href: "/guides/passphrase-vs-password" },
    { label: "How MK VaultPass works", href: "/docs" },
    { label: "Analyze a password", href: "/analyze" },
  ],
  body: () => [
    {
      t: "p",
      text: "Entropy is the single number that strength meters try to estimate, and it is worth understanding directly rather than trusting a colored bar. Put plainly, entropy measures how many equally likely secrets the generator could have produced. More possibilities means more guesses an attacker has to try. It is measured in bits, and each extra bit doubles the number of possibilities.",
    },
    { t: "h2", text: "The formula, and why it is a logarithm" },
    {
      t: "p",
      text: "If a process can produce N equally likely outcomes, its entropy is log2(N) bits. The logarithm turns an unwieldy count into a small, addable number. Ten bits is 1,024 possibilities; 20 bits is about a million; 40 bits is about a trillion; 80 bits is roughly the number of grains of sand on Earth, squared. Because entropy is a logarithm, independent choices add. Two independent 10-bit choices give 20 bits, not 100.",
    },
    { t: "h2", text: "Passwords: length times log of the alphabet" },
    {
      t: "p",
      text: "For a password where each character is drawn independently and uniformly from an alphabet of size A, entropy is length x log2(A). The common alphabet sizes:",
    },
    {
      t: "ul",
      items: [
        "Digits only: A = 10, so log2(10) is about 3.32 bits per character.",
        "Lowercase letters: A = 26, about 4.70 bits per character.",
        "Letters and digits: A = 62, about 5.95 bits per character.",
        "All printable ASCII symbols: A = 94, about 6.55 bits per character.",
      ],
    },
    {
      t: "p",
      text: "So a 12-character password over the full 94-symbol set is 12 x 6.55, about 78 bits. A 12-character lowercase-only password is 12 x 4.70, about 56 bits. Same length, very different strength, because the alphabet is smaller. The word `uniformly` in that first sentence is load-bearing: the math only holds if every character really was equally likely, which is why the generator uses rejection sampling instead of a simple remainder.",
    },
    { t: "h2", text: "Passphrases: words times log of the wordlist" },
    {
      t: "p",
      text: "A passphrase drawn from a wordlist of W words has entropy of (number of words) x log2(W). MK VaultPass uses the EFF large wordlist, which has exactly 7,776 words, so each word contributes log2(7776), about 12.9 bits. Five words is about 64 bits, six words about 77 bits, seven words about 90 bits. Notice that the separators, capitalization, and any appended digits add only small amounts on top, and only if they too are chosen randomly. A capital letter you always put on the first word adds nothing, because it is predictable.",
    },
    { t: "h2", text: "Why the meter on other sites often lies" },
    {
      t: "p",
      text: "Naive strength meters compute length times log of the alphabet and stop there. That massively overrates a secret a human chose, because human choices are not uniform. `Password1!` uses four character classes and looks like 60-plus bits to a naive meter, but it is on every cracking list and has almost no real entropy. The formula describes the generator, not the string. If you did not generate the string with a uniform random process, the formula does not apply to it.",
    },
    {
      t: "note",
      text: "Entropy is a property of how a secret was produced, not of how the finished secret looks. A meter that only sees the final characters is guessing about the process.",
    },
    { t: "h2", text: "How the analyzer estimates entropy for existing secrets" },
    {
      t: "p",
      text: "When you paste a secret into the [analyzer](/analyze), it cannot know how you made it, so it does something more careful than the naive formula. It detects structure that reduces real entropy: repeated characters, keyboard runs like `qwerty`, sequences like `1234`, and dictionary words. It checks the input against the thousand most common passwords and flags any exact or lowercase match as very weak regardless of length. The result is labeled an estimate, because for a string whose origin is unknown, an estimate is the honest most you can offer. All of this runs in your browser with no network request.",
    },
    { t: "h2", text: "Turning bits into a decision" },
    {
      t: "p",
      text: "A rough scale for choosing targets: under 28 bits is very weak and cracked instantly; 28 to 49 bits is weak; 50 to 69 bits is fair and fine for low-value accounts; 70 to 99 bits is strong and appropriate for real accounts; 100 bits and above is excellent and beyond brute force for the foreseeable future. These bands are what drive the five-level strength scale you see across VaultPass.",
    },
    {
      t: "p",
      text: "The practical takeaway is short. Decide how much strength the job needs, then pick a length or word count that clears it using the formulas above, and let a uniform random generator do the choosing. If you want to see the numbers move in real time, open the [generator](/generate) and watch the entropy ring as you adjust the settings.",
    },
  ],
};
