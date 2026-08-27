import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/#analytics");
  await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible({ timeout: 15_000 });
});

test("Analytics documentation omits composed product examples", async ({ page }) => {
  await expect(page.locator(".whatiuse-analytics-gallery")).toHaveCount(0);
  await expect(page.locator(".whatiuse-analytics-recipe")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "SaaS Overview" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Usage & Adoption" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Conversion & Retention" })).toHaveCount(0);
});

test("Analytics documentation keeps the product contract and install path", async ({ page }) => {
  await expect(page.getByRole("table", { name: "whatiuse Analytics product primitives" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Composition contract" })).toBeVisible();
  await expect(page.getByText("@whatiuse/whatiuse-analytics", { exact: false })).toBeVisible();
});
