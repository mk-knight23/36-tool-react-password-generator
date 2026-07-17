import type { ContentDoc } from "@/content/types";

export const wifiPasswordGuide: ContentDoc = {
  slug: "wifi-password-guide",
  title: "How strong should a Wi-Fi password be?",
  description:
    "What makes a Wi-Fi password strong, how WPA2 and WPA3 change the risk, the 63-character limit, and how to pick one that is easy to share but hard to crack.",
  summary:
    "Home and small-office Wi-Fi keys, the offline-cracking threat, and a length that beats it.",
  category: "Practical",
  readingTime: "6 min read",
  datePublished: "2026-07-17",
  related: [
    { label: "Rotating a team Wi-Fi password", href: "/use-cases/team-wifi-rotation" },
    { label: "Generate a Wi-Fi password", href: "/generate?mode=wifi" },
    { label: "Passphrase vs password", href: "/guides/passphrase-vs-password" },
  ],
  body: () => [
    {
      t: "p",
      text: "Wi-Fi passwords face a different threat from website passwords, and it changes what strong means. A website login is guessed over the network, where rate limiting and lockouts slow an attacker to a crawl. A Wi-Fi password can be attacked offline: someone within radio range captures the handshake your device makes when it joins, then guesses against that capture on their own hardware as fast as it will go, with no server to slow them down. That is why a short, cute Wi-Fi password is weaker than it feels.",
    },
    { t: "h2", text: "WPA2, WPA3, and why length still matters" },
    {
      t: "p",
      text: "WPA2 is the encryption most home and small-office networks still use. Its main weakness is exactly the offline attack above: capture the handshake, then guess without limit. WPA3 improves this considerably by making offline guessing far harder, so each attempt costs the attacker real work. If your router and devices support WPA3, turn it on. Either way, length remains your friend, because a long random key defeats offline guessing regardless of which protocol is protecting it. On WPA2 length is doing most of the defending; on WPA3 it is the comfortable margin.",
    },
    { t: "h2", text: "A concrete target" },
    {
      t: "p",
      text: "For a home network, a 20-character random password, or a five- to six-word passphrase, is comfortably strong. Both land well past the point where offline cracking is realistic. For a business network, or anywhere the password will be shared with people who come and go, treat it like any shared secret: make it strong, plan to rotate it, and keep it long. There is a hard ceiling to know about: the WPA standard caps the pre-shared key at 63 characters, so a passphrase for Wi-Fi cannot exceed that length.",
    },
    {
      t: "note",
      text: "You do not need a 63-character monster. Past about 20 random characters or six random words, offline cracking is already off the table for any realistic attacker.",
    },
    { t: "h2", text: "Easy to share without being weak" },
    {
      t: "p",
      text: "The practical tension with Wi-Fi is that people have to type the password, sometimes on a phone, a smart TV, or a game console with an awkward on-screen keyboard. A 20-character string of random symbols is strong but miserable to enter on a TV remote. There are two good ways to keep it both strong and enterable.",
    },
    {
      t: "ul",
      items: [
        "**Use a passphrase.** Six random words are strong and far easier to read off a card and type than a symbol soup of the same strength.",
        "**Use an easy-entry character set.** The Wi-Fi generator offers a mode that avoids characters which are error-prone on TV and console keyboards. It is honest about the trade: a smaller character set means slightly less entropy per character, so it nudges the length up to compensate, and the readout shows the effect.",
      ],
    },
    { t: "h2", text: "A note on QR codes" },
    {
      t: "p",
      text: "Many people share Wi-Fi with a QR code that a phone camera reads to join automatically. It is convenient, but a Wi-Fi QR code is simply your password encoded in a machine-readable square. Anyone who photographs it has your key. MK VaultPass does not generate Wi-Fi QR codes in this version, and that is a deliberate choice rather than an oversight: a QR code encodes the secret, so it needs to be rendered with a clear local-only warning and treated with the same care as the password itself. That work is deferred so it can be done properly rather than added as an afterthought. For now, share the password as text you control, and if you do use a QR code from another tool, print it, do not post it somewhere public.",
    },
    { t: "h2", text: "Generating one locally" },
    {
      t: "p",
      text: "The [Wi-Fi generator](/generate?mode=wifi) produces a key using Web Crypto in your browser, enforces the 63-character WPA ceiling, and offers the easy-entry mode described above with an honest entropy readout. Because generation is local, the password never travels anywhere before you set it on your router, which is the whole point for a secret that protects your home network. If you are setting a network up for a small team, pair this with the [team Wi-Fi rotation](/use-cases/team-wifi-rotation) walkthrough for a routine that keeps the key strong as people join and leave.",
    },
    {
      t: "p",
      text: "The short answer to the title question: aim for around 20 random characters or six random words, enable WPA3 if you can, and pick a form you can actually share. That combination puts your network out of reach of the offline attack that Wi-Fi passwords are really up against.",
    },
  ],
};
