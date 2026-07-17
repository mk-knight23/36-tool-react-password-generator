import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { track } from "./analytics";

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

function setConsent(consent: "granted" | "declined" | "unset") {
  window.localStorage.setItem(
    "vaultpass:settings",
    JSON.stringify({
      historyEnabled: false,
      autoClearDelay: 30,
      sound: false,
      analyticsConsent: consent,
    }),
  );
}

function dataLayer(): Array<Record<string, unknown>> | undefined {
  return (window as DataLayerWindow).dataLayer;
}

describe("analytics (consent-gated no-op)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    (window as DataLayerWindow).dataLayer = undefined;
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is a no-op outside production even with a GTM id and granted consent", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-XXXX");
    setConsent("granted");
    track("tool_completed", { mode: "password" });
    expect(dataLayer()).toBeUndefined();
  });

  it("is a no-op in production when no GTM id is configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "");
    setConsent("granted");
    track("tool_completed");
    expect(dataLayer()).toBeUndefined();
  });

  it("is a no-op in production with a GTM id but without granted consent", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-XXXX");
    setConsent("declined");
    track("tool_completed");
    expect(dataLayer()).toBeUndefined();
  });

  it("pushes the event only when production + GTM id + granted consent all hold", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-XXXX");
    setConsent("granted");
    track("tool_completed", { mode: "password", ms: 12 });
    expect(dataLayer()).toEqual([{ event: "tool_completed", mode: "password", ms: 12 }]);
  });

  it("appends subsequent events to the same dataLayer array", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-XXXX");
    setConsent("granted");
    track("tool_opened");
    track("guide_opened", { slug: "entropy-explained" });
    expect(dataLayer()).toHaveLength(2);
    expect(dataLayer()![1]).toMatchObject({ event: "guide_opened", slug: "entropy-explained" });
  });
});
