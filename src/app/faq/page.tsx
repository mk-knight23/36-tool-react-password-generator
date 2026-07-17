import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { JsonLd } from "@/components/content/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/jsonld";
import { toPlainText } from "@/content/blocks";
import { FAQ_ITEMS } from "@/content/faq";

export const metadata: Metadata = pageMetadata({
  title: "Frequently asked questions",
  description:
    "Honest answers about MK VaultPass: whether it is a password manager, whether your secrets stay local, how randomness works, and what analytics collect.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <JsonLd
        data={faqPageJsonLd(
          FAQ_ITEMS.map((item) => ({
            question: item.question,
            answer: toPlainText(item.answer),
          })),
        )}
      />
      <PageHeader
        title="Frequently asked questions"
        lead="Straight answers, including the ones a security tool should not dodge: no, it is not a password manager, and no, it cannot see what you generate."
        trail={[{ name: "FAQ", path: "/faq" }]}
      />

      <div className="mt-10 flex flex-col divide-y divide-border border-y border-border">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-lg font-medium text-fg [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                size={20}
                strokeWidth={1.75}
                aria-hidden="true"
                className="shrink-0 text-fg-muted transition-transform duration-base ease-enter group-open:rotate-180"
              />
            </summary>
            <div className="pb-4">
              <Prose>
                <ContentRenderer blocks={[{ t: "p", text: item.answer }]} />
              </Prose>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
