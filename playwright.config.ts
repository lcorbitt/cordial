import { defineConfig, devices } from "@playwright/test";

const isCi = !!process.env.CI;
const ciUsesPrebuilt = isCi && process.env.E2E_PREBUILT === "true";

/**
 * Playwright config for end-to-end and accessibility tests.
 *
 * - Local: `npm run test:e2e` starts the dev server (fast iteration).
 * - Local prod build: `npm run test:e2e:ci` runs `build && start` (CI-like).
 * - Local GHA parity: `npm run test:e2e:prebuilt` after `npm run build`.
 * - GitHub Actions: verify uploads `.next`; e2e downloads it and only runs
 *   `next start` (see `.github/workflows/ci.yml`).
 *
 * Ensure port 3000 is free or already running your intended stack before e2e.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  reporter: isCi ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: isCi
    ? {
        command: ciUsesPrebuilt
          ? "npm run start"
          : "npm run build && npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: false,
        timeout: ciUsesPrebuilt ? 120_000 : 300_000,
      }
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
