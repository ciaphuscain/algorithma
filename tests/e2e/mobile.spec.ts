import { expect, test } from "@playwright/test";

test("algorithm workspace fits a phone screen without horizontal scrolling", async ({ page }) => {
  for (const path of ["/", "/algorithms/bubble-sort", "/algorithms/bfs", "/roadmap", "/explore"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
  await page.goto("/algorithms/bubble-sort");
  await page.getByRole("button", { name: "Step forward" }).click();
  await expect(page.getByTestId("narration")).toContainText("n = 5");
});
