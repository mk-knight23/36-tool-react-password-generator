import { test, expect, type Request } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SCREENSHOT_DIR = path.join(process.cwd(), "docs", "screenshots");

test.describe("MK VaultPass — primary flow (deterministic, no AI keys)", () => {
  test("generates a password locally and shows its strength", async ({ page }, testInfo) => {
    await page.goto("/generate");

    const generate = page.getByRole("button", { name: /generate/i }).first();
    await expect(generate).toBeVisible();

    await generate.click();

    const secret = page.locator("output").first();
    await expect(secret).toBeVisible();
    const value = (await secret.textContent())?.trim() ?? "";
    // Default password length is 20; assert a non-trivial secret was produced.
    expect(value.length).toBeGreaterThanOrEqual(12);

    // Strength meter (role=meter) is shown with a bits readout, on every viewport.
    const meter = page.getByRole("meter");
    await expect(meter).toBeVisible();
    await expect(page.getByText(/\d+ bits/).first()).toBeVisible();

    // Capture the README screenshot once, from the desktop project only.
    if (testInfo.project.name === "desktop-chromium") {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "generate.png"),
        fullPage: false,
      });
    }
  });

  test("keyboard: '.' regenerates a fresh secret", async ({ page }) => {
    await page.goto("/generate");
    await page.getByRole("button", { name: /generate/i }).first().click();

    const secret = page.locator("output").first();
    await expect(secret).toBeVisible();
    const first = (await secret.textContent())?.trim();

    // Focus is on the Generate button (not an input), so the "." shortcut fires.
    await page.keyboard.press(".");

    await expect
      .poll(async () => (await secret.textContent())?.trim())
      .not.toBe(first);
  });

  test("zero egress: generating fires no fetch/XHR and never transmits the secret (G3)", async ({
    page,
  }) => {
    await page.goto("/generate");
    await page.waitForLoadState("networkidle");

    const observed: Array<{ url: string; type: string; post: string | null }> = [];
    const onRequest = (req: Request) =>
      observed.push({ url: req.url(), type: req.resourceType(), post: req.postData() });
    page.on("request", onRequest);

    await page.getByRole("button", { name: /generate/i }).first().click();
    const secret = page.locator("output").first();
    await expect(secret).toBeVisible();
    const value = (await secret.textContent())?.trim() ?? "";

    // Allow any stray request a moment to surface, then stop listening.
    await page.waitForTimeout(500);
    page.off("request", onRequest);

    // No data request (fetch/xhr) is made while generating — generation is
    // entirely local Web Crypto.
    const dataRequests = observed.filter((r) => r.type === "fetch" || r.type === "xhr");
    expect(dataRequests, JSON.stringify(dataRequests, null, 2)).toEqual([]);

    // The generated secret (or any fragment of it) never appears in a request.
    expect(value.length).toBeGreaterThan(0);
    for (const req of observed) {
      expect(req.url).not.toContain(value);
      if (req.post) expect(req.post).not.toContain(value);
    }
  });
});
