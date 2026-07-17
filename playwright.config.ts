import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright smoke configuration for MK VaultPass.
 *
 * - Runs on port 3102 ONLY (per the build contract).
 * - Exercises the deterministic (no-AI) primary flow on a desktop and a mobile
 *   viewport, including a keyboard pass and the PRODUCT_SPEC G3 zero-egress
 *   assertion.
 * - The web server is `next start`, so a production build must exist first
 *   (`pnpm build`). CI builds before invoking Playwright.
 */
const PORT = 3102;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
