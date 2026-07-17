import type { Metadata } from "next";
import { DocPage } from "@/components/content/DocPage";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, LAST_UPDATED } from "@/lib/site";
import type { Block } from "@/content/blocks";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description:
    "The plain-language terms for using MK VaultPass, a free and open-source local secret generator provided as-is under the MIT license.",
  path: "/terms",
});

const BLOCKS: Block[] = [
  {
    t: "p",
    text: "These terms cover your use of MK VaultPass. They are short and plain on purpose. By using the tool you agree to what follows. If you do not agree, do not use it.",
  },
  { t: "h2", text: "What the tool is" },
  {
    t: "p",
    text: "MK VaultPass is a free, open-source utility that generates passwords and other secrets entirely in your browser. It is not a password manager and does not store, sync, or safeguard your secrets after you generate them. You are responsible for storing what you generate somewhere appropriate, such as a real password manager.",
  },
  { t: "h2", text: "Provided as-is" },
  {
    t: "p",
    text: "The software is provided as-is, without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. This is the standard MIT license disclaimer, and it means what it says: while the tool is built carefully and its methods are documented and tested, no guarantee is made that it is free of defects or fit for any specific security requirement you may have.",
  },
  { t: "h2", text: "Limitation of liability" },
  {
    t: "p",
    text: "To the maximum extent permitted by law, the author is not liable for any claim, damages, or other liability arising from the software or its use. You use the tool at your own discretion and risk, and you are responsible for how you use the secrets it produces.",
  },
  { t: "h2", text: "Acceptable use" },
  {
    t: "ul",
    items: [
      "Use the tool for lawful purposes only.",
      "Do not use it to attempt to access systems or accounts you are not authorized to access.",
      "Do not attempt to disrupt the site for other users or to misuse the optional AI question feature.",
    ],
  },
  { t: "h2", text: "The optional AI feature" },
  {
    t: "p",
    text: "The Analyze page offers an optional feature that answers general security questions and is subject to a fair-use rate limit. It provides general information, not professional security advice, and it is designed so it cannot receive your secrets. Availability is not guaranteed, and the tool falls back to a built-in explanation when the feature is unavailable.",
  },
  { t: "h2", text: "License" },
  {
    t: "p",
    text: "MK VaultPass is released under the MIT license. You are free to use, copy, modify, and distribute it under that license's terms. See the [open source](/open-source) page for the source repository and the full license text.",
  },
  { t: "h2", text: "Changes and contact" },
  {
    t: "p",
    text: `These terms may change; the updated date at the top reflects the latest revision. Questions can go to ${CONTACT_EMAIL} or through the project's GitHub issues, linked from the [contact](/contact) page.`,
  },
];

export default function TermsPage() {
  return (
    <DocPage
      title="Terms of use"
      lead="Free, open source, and provided as-is under the MIT license. The plain-language version follows."
      trail={[{ name: "Terms", path: "/terms" }]}
      updated={LAST_UPDATED}
      blocks={BLOCKS}
    />
  );
}
