import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility audits for the public pages. Our audience makes WCAG 2.1 AA a
 * hard requirement, so we fail the build on serious or critical violations.
 */
const pages: Array<{
  path: string;
  ready: { role: "heading"; name: RegExp } | { label: RegExp };
}> = [
  { path: "/", ready: { role: "heading", name: /welcome to cordial/i } },
  { path: "/login", ready: { label: /email address/i } },
  { path: "/signup", ready: { label: /email address/i } },
  { path: "/forgot-password", ready: { label: /email address/i } },
];

for (const { path, ready } of pages) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);

    if ("role" in ready) {
      await expect(
        page.getByRole(ready.role, { name: ready.name }),
      ).toBeVisible();
    } else {
      await expect(page.getByLabel(ready.label)).toBeVisible();
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
