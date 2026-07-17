import { describe, it, expect } from "vitest";
import { pageMetadata, absoluteUrl } from "./seo";
import {
  personJsonLd,
  webApplicationJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  articleJsonLd,
  howToJsonLd,
} from "./jsonld";
import { NAV_LINKS, RESOURCE_LINKS, LEGAL_LINKS, COMPANY_LINKS } from "./nav";
import { SITE, CREATOR } from "./site";
import { cn } from "./cn";

describe("seo.pageMetadata", () => {
  it("sets the canonical to the relative path and an absolute OG url", () => {
    const meta = pageMetadata({ title: "Guides", description: "d", path: "/guides" });
    expect(meta.alternates?.canonical).toBe("/guides");
    expect(meta.openGraph?.url).toBe(`${SITE.url}/guides`);
  });

  it("suffixes the OG title with the site name and defaults to a website type", () => {
    const meta = pageMetadata({ title: "FAQ", description: "d", path: "/faq" });
    expect(meta.openGraph?.title).toBe(`FAQ · ${SITE.name}`);
    expect(meta.openGraph && "type" in meta.openGraph && meta.openGraph.type).toBe("website");
  });

  it("uses the bare origin as the OG url for the home path", () => {
    const meta = pageMetadata({ title: "Home", description: "d", path: "/" });
    expect(meta.openGraph?.url).toBe(SITE.url);
  });

  it("emits an article OG type and a noindex robots directive when requested", () => {
    const meta = pageMetadata({
      title: "Entropy",
      description: "d",
      path: "/guides/entropy-explained",
      type: "article",
      noindex: true,
    });
    expect(meta.openGraph && "type" in meta.openGraph && meta.openGraph.type).toBe("article");
    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});

describe("seo.absoluteUrl", () => {
  it("returns the origin for the home path", () => {
    expect(absoluteUrl("/")).toBe(SITE.url);
  });

  it("appends other paths to the origin", () => {
    expect(absoluteUrl("/creator")).toBe(`${SITE.url}/creator`);
  });
});

describe("jsonld builders", () => {
  it("personJsonLd describes the creator as a schema.org Person", () => {
    const ld = personJsonLd();
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe(CREATOR.name);
  });

  it("webApplicationJsonLd advertises a free security application", () => {
    const ld = webApplicationJsonLd();
    expect(ld["@type"]).toBe("WebApplication");
    expect(ld.isAccessibleForFree).toBe(true);
    expect(ld.applicationCategory).toBe("SecurityApplication");
  });

  it("breadcrumbJsonLd numbers items from 1 with absolute item urls", () => {
    const ld = breadcrumbJsonLd([
      { name: "Guides", path: "/guides" },
      { name: "Entropy", path: "/guides/entropy-explained" },
    ]);
    const items = ld.itemListElement as Array<Record<string, unknown>>;
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe(`${SITE.url}/guides/entropy-explained`);
  });

  it("faqPageJsonLd maps each entry to a Question with an accepted Answer", () => {
    const ld = faqPageJsonLd([{ question: "Is it a manager?", answer: "No." }]);
    const main = ld.mainEntity as Array<Record<string, unknown>>;
    expect(main[0]["@type"]).toBe("Question");
    expect((main[0].acceptedAnswer as Record<string, unknown>).text).toBe("No.");
  });

  it("articleJsonLd defaults dateModified to datePublished when omitted", () => {
    const ld = articleJsonLd({
      title: "T",
      description: "d",
      path: "/guides/x",
      datePublished: "2026-07-01",
    });
    expect(ld.dateModified).toBe("2026-07-01");
    expect(ld.url).toBe(`${SITE.url}/guides/x`);
  });

  it("howToJsonLd numbers each step from 1", () => {
    const ld = howToJsonLd("How", "d", [
      { name: "One", text: "a" },
      { name: "Two", text: "b" },
    ]);
    const steps = ld.step as Array<Record<string, unknown>>;
    expect(steps.map((s) => s.position)).toEqual([1, 2]);
  });
});

describe("nav data", () => {
  it("every nav and footer link is a root-relative path", () => {
    const all = [...NAV_LINKS, ...RESOURCE_LINKS, ...LEGAL_LINKS, ...COMPANY_LINKS];
    for (const link of all) expect(link.href.startsWith("/")).toBe(true);
  });

  it("exposes the checklists route in the resource links (matching the sitemap)", () => {
    expect(RESOURCE_LINKS.some((l) => l.href === "/checklists")).toBe(true);
  });

  it("includes the three legal routes", () => {
    expect(LEGAL_LINKS.map((l) => l.href).sort()).toEqual(["/cookies", "/privacy", "/terms"]);
  });
});

describe("site constants", () => {
  it("carries the exact non-negotiable creator footer sentence (STANDARDS §3)", () => {
    expect(CREATOR.footerSentence).toBe(
      "Built and maintained by Kazi Musharraf. Open source for everyone.",
    );
  });

  it("defaults the site origin to the product domain", () => {
    expect(SITE.url).toBe(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaultpass.mkazi.live");
  });
});

describe("cn", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false, "b", null, undefined, "c")).toBe("a b c");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});
