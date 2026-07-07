import { test, expect } from "@playwright/test";

/**
 * Admin community management smoke tests.
 * CI uses placeholder keys, so local-stack describes are skipped there.
 */
test("admin communities page requires sign-in", async ({ page }) => {
  await page.goto("/admin/communities");
  await expect(page).toHaveURL(/\/login/);
});

test("invite accept page is reachable without sign-in", async ({ page }) => {
  await page.goto("/invite/accept?token=invalid-token");
  await expect(
    page.getByRole("heading", {
      name: /accept your invitation|invitation not available/i,
    }),
  ).toBeVisible();
});

const hasLocalStack =
  !process.env.CI &&
  (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("127.0.0.1") ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("localhost")) &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes("placeholder");

test.describe("admin communities (local stack)", () => {
  test.skip(
    !hasLocalStack,
    process.env.CI
      ? "Skipped in CI (no Supabase stack)"
      : "Requires a running local Supabase stack",
  );

  test("admin can create a community and see it in the list", async ({
    page,
  }) => {
    const slug = `test-community-${Date.now()}`;

    await page.goto("/login");
    await page.getByLabel(/email address/i).fill("admin@local.test");
    await page.getByLabel(/^password$/i).fill("password123");
    await page.getByRole("button", { name: /^log in$/i }).click();

    await page.goto("/admin/communities");
    await expect(
      page.getByRole("heading", { name: /^communities$/i }),
    ).toBeVisible();

    await page.getByLabel(/^name$/i).fill("Test Community");
    await page.getByLabel(/^slug$/i).fill(slug);
    await page.getByRole("button", { name: /create community/i }).click();

    await expect(page).toHaveURL(new RegExp(`/communities/${slug}$`));
    await expect(
      page.getByRole("heading", { name: /test community/i }),
    ).toBeVisible();
  });
});
