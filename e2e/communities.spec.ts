import { test, expect } from "@playwright/test";

/**
 * Communities route smoke tests. Auth-gated routes redirect anonymous visitors;
 * the signed-in flow runs only when a real local Supabase stack is configured.
 */
test("communities page requires sign-in", async ({ page }) => {
  await page.goto("/communities");
  await expect(page).toHaveURL(/\/login/);
});

test("community detail page requires sign-in", async ({ page }) => {
  await page.goto("/communities/cordial-hq");
  await expect(page).toHaveURL(/\/login/);
});

const hasLocalStack =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("127.0.0.1") &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes("placeholder");

test.describe("communities (local stack)", () => {
  test.skip(!hasLocalStack, "Requires a running local Supabase stack");

  test("member can browse communities list and open a community home", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel(/email address/i).fill("member@local.test");
    await page.getByLabel(/^password$/i).fill("password123");
    await page.getByRole("button", { name: /^log in$/i }).click();

    await page.goto("/communities");
    await expect(
      page.getByRole("heading", { name: /^communities$/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /cordial hq/i })).toBeVisible();

    await page.getByRole("link", { name: /cordial hq/i }).click();
    await expect(page).toHaveURL(/\/communities\/cordial-hq$/);
    await expect(
      page.getByRole("heading", { name: /cordial hq/i }),
    ).toBeVisible();
    await expect(page.getByText(/community home/i)).toBeVisible();
  });
});
