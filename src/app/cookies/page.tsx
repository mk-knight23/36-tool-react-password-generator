import type { Metadata } from "next";
import { PageHeader } from "@/components/content/PageHeader";
import { Prose } from "@/components/content/Prose";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { ConsentControls } from "@/components/analytics/ConsentControls";
import { pageMetadata } from "@/lib/seo";
import type { Block } from "@/content/blocks";

export const metadata: Metadata = pageMetadata({
  title: "Cookies and analytics",
  description:
    "MK VaultPass uses no advertising or tracking cookies. Analytics are off by default and load only if you allow them. Change your choice here.",
  path: "/cookies",
});

const INTRO: Block[] = [
  {
    t: "p",
    text: "MK VaultPass sets no advertising or cross-site tracking cookies. It stores a small local preference to remember your analytics choice, and it loads analytics only if you allow them. This page explains the specifics and lets you change your mind at any time.",
  },
];

const DETAIL: Block[] = [
  { t: "h2", text: "What is stored by default" },
  {
    t: "p",
    text: "By default, the only thing kept is a local preference recording whether you have allowed analytics, along with your other settings such as theme. These live in this browser's local storage, are not cookies sent to a server, and are used only to make the site behave the way you left it. No analytics or advertising scripts load in this default state.",
  },
  { t: "h2", text: "Analytics, only if you allow them" },
  {
    t: "p",
    text: "If you allow analytics, the site loads Google Tag Manager, but only in production and only with an analytics id configured. Tag Manager may then set its own cookies to measure anonymous usage. Even then, the data is limited to event names from a fixed list and coarse parameters such as feature names, bucketed counts, and durations. It never includes any secret you generate, its length tied to a specific output, its character set, a file name, or a bring-your-own AI key.",
  },
  { t: "h2", text: "No ads" },
  {
    t: "p",
    text: "There is no advertising on the site. Ad support is prepared in the codebase but disabled, and no ad script loads. If that ever changes, this page and the [privacy policy](/privacy) will be updated first.",
  },
  { t: "h2", text: "Changing your choice" },
  {
    t: "p",
    text: "Use the controls above, or the Analytics section in [Settings](/settings), to switch between allowing and declining at any time. Declining stops analytics from loading; if analytics were previously loaded in this session, declining takes full effect on the next page load. Clearing your browser data resets the choice.",
  },
];

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Cookies and analytics"
        lead="No ad or tracking cookies. Analytics are off unless you allow them, and it is safe to leave them declined."
        trail={[{ name: "Cookies", path: "/cookies" }]}
        meta={<span>Last updated July 17, 2026</span>}
      />
      <div className="mt-8">
        <Prose>
          <ContentRenderer blocks={INTRO} />
        </Prose>
      </div>
      <div className="mt-6">
        <ConsentControls />
      </div>
      <div className="mt-8">
        <Prose>
          <ContentRenderer blocks={DETAIL} />
        </Prose>
      </div>
    </div>
  );
}
