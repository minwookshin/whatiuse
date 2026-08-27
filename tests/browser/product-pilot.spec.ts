import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/#product-pilot");
  await expect(page.getByRole("heading", { level: 1, name: "Data" })).toBeVisible({ timeout: 15_000 });
});

test("Data documentation omits composed product examples", async ({ page }) => {
  await expect(page.locator(".pilot-workspace")).toHaveCount(0);
  await expect(page.locator(".whatiuse-data-recipe")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Issues Workspace" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Customer Directory" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Audit Log" })).toHaveCount(0);
});

test("Data documentation keeps the product contract and install path", async ({ page }) => {
  await expect(page.getByRole("table", { name: "whatiuse Data product primitives" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Composition contract" })).toBeVisible();
  await expect(page.getByText("@whatiuse/whatiuse-data", { exact: false })).toBeVisible();
});
