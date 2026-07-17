import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json-summary", "html"],
      reportsDirectory: "./coverage",
      // Focus coverage on the tested core logic; exclude presentational React,
      // route files, static content data, and type-only modules.
      include: ["src/lib/**"],
      exclude: [
        "src/lib/**/*.test.ts",
        "src/lib/client-hooks.ts",
        "src/lib/**/index.ts",
      ],
    },
  },
});
