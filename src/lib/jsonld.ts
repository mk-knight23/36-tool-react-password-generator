import { SITE, CREATOR } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Structured-data builders (STANDARDS §5). Each returns a plain JSON-LD object
 * rendered via <JsonLd>. Kept as pure functions so they can be unit-tested and
 * reused across routes without duplicating schema literals.
 */

type JsonLdObject = Record<string, unknown>;

export function personJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: CREATOR.name,
    url: CREATOR.portfolio,
    jobTitle: "AI Engineer, Full-Stack Developer",
    sameAs: [CREATOR.github, CREATOR.portfolio],
    knowsAbout: [
      "web security",
      "cryptography",
      "password generation",
      "front-end engineering",
    ],
  };
}

export function webApplicationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    author: { "@type": "Person", name: CREATOR.name, url: CREATOR.portfolio },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqPageJsonLd(entries: FaqEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export interface ArticleJsonLdInput {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}

export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleJsonLdInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "en",
    author: { "@type": "Person", name: CREATOR.name, url: CREATOR.portfolio },
    publisher: { "@type": "Person", name: CREATOR.name, url: CREATOR.portfolio },
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export function howToJsonLd(
  name: string,
  description: string,
  steps: HowToStep[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
