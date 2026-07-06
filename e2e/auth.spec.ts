import { test, expect } from "@playwright/test";

/**
 * Smoke test of the public auth surface. Verifies navigation and that the login
 * form renders with accessible, labeled fields. Full signup -> verify -> login
 * flows require a running Supabase instance and run in the integration suite.
 */
test("landing page links to login and signup", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /welcome to cordial/i }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: /^log in$/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/login$/);
});

test("login form exposes labeled fields", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByLabel(/email address/i)).toBeVisible();
  await expect(page.getByLabel(/^password$/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: /continue with google/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /continue with microsoft/i }),
  ).toBeVisible();
});
