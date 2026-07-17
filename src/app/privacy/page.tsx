import type { Metadata } from "next";
import { DocPage } from "@/components/content/DocPage";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, LAST_UPDATED } from "@/lib/site";
import type { Block } from "@/content/blocks";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "MK VaultPass generates secrets entirely in your browser. Nothing you generate leaves your device. This page explains exactly what is and is not collected.",
  path: "/privacy",
});

const BLOCKS: Block[] = [
  {
    t: "p",
    text: "This policy describes how MK VaultPass handles data. The short version is that the product is built so there is very little to handle: secrets are generated in your browser and never sent anywhere, there are no accounts, and there is no server-side database. The detail below is here so you can verify that rather than take it on trust.",
  },
  { t: "h2", text: "What never leaves your device" },
  {
    t: "p",
    text: "Every password, passphrase, token, PIN, UUID, Wi-Fi key, and recovery code is produced locally using the browser's Web Crypto API. No generated value, and no derivative of one such as a hash, prefix, or length-and-charset fingerprint, is ever included in any network request. You can confirm this by opening your browser's developer tools, watching the network tab, and generating secrets: nothing leaves.",
  },
  { t: "h2", text: "What is stored, and where" },
  {
    t: "ul",
    items: [
      "**Preferences** (theme, clipboard auto-clear delay, sound, analytics choice) are stored in this browser's local storage. They are small, non-secret settings.",
      "**Generation counts** for the dashboard are stored locally in this browser and contain only per-mode totals, never the secrets themselves.",
      "**Opt-in history** is off by default. If you turn it on, generated secrets are stored in this browser's IndexedDB in plain text so you can look them up. Nothing is stored when history is off. You can wipe history in one click.",
      "**A bring-your-own AI key**, if you choose to add one, is stored only in this browser and is never included in exports or analytics.",
    ],
  },
  {
    t: "p",
    text: "All of this lives on your device. Clearing your browser data removes it, and there is no server copy to recover. You can export or delete everything from the [Settings](/settings) page at any time.",
  },
  { t: "h2", text: "Analytics" },
  {
    t: "p",
    text: "Analytics are disabled by default and load only if you explicitly allow them, in production, with an analytics id configured. When enabled they use Google Tag Manager and receive only anonymous event names from a fixed list and coarse parameters such as feature names, bucketed counts, and durations. They never receive any generated secret, its length tied to a specific output, its character set, a file name, or a bring-your-own key. You can change your choice on the [cookies](/cookies) page or in [Settings](/settings). See the [cookies page](/cookies) for the specifics.",
  },
  { t: "h2", text: "The optional AI question feature" },
  {
    t: "p",
    text: "The Analyze page offers an optional feature that answers general security questions. It is built so it cannot receive a secret: the request is a fixed topic plus a short, length-capped question, and anything that looks like a generated secret is rejected before it is sent, on both your browser and the server. The password you analyze is never part of an AI request. When the feature is unavailable, the tool falls back to a built-in explanation with no network call.",
  },
  { t: "h2", text: "No third-party content origins" },
  {
    t: "p",
    text: "The site loads no external fonts, scripts, images, or stylesheets. Its content security policy allows the page to talk only to its own origin (plus analytics origins if and only if you enable analytics). This removes a common route by which third parties observe visitors.",
  },
  { t: "h2", text: "Children" },
  {
    t: "p",
    text: "MK VaultPass is a general-purpose utility and is not directed at children. It collects no personal information from anyone, including children.",
  },
  { t: "h2", text: "Changes and contact" },
  {
    t: "p",
    text: `If this policy changes, the updated date at the top will change with it. Questions about privacy can go to ${CONTACT_EMAIL} or through the project's GitHub issues, linked from the [contact](/contact) page.`,
  },
];

export default function PrivacyPage() {
  return (
    <DocPage
      title="Privacy"
      lead="Secrets are generated in your browser and never sent anywhere. Here is exactly what is and is not collected."
      trail={[{ name: "Privacy", path: "/privacy" }]}
      updated={LAST_UPDATED}
      blocks={BLOCKS}
    />
  );
}
