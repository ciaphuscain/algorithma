import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("arena: reproducible experiment from a URL, exact counts, chart, table", async ({ page }) => {
  await page.goto("/arena?alg=bubble-sort,quick-sort&dist=sorted&max=64&seed=1&reps=1");
  await expect(page.getByLabel("Bubble Sort")).toBeChecked();
  await expect(page.getByLabel("Merge Sort")).not.toBeChecked();
  await expect(page.getByLabel("Input distribution")).toHaveValue("sorted");
  await page.getByRole("button", { name: "Run experiment" }).click();

  const results = page.getByTestId("arena-results");
  await expect(results).toContainText("All 8 outputs verified");
  // Quick sort with a last-element pivot on sorted input: exactly n(n-1)/2 comparisons.
  const quick64 = page
    .getByTestId("arena-table")
    .getByRole("row")
    .filter({ hasText: "Quick Sort" })
    .filter({ hasText: /^Quick Sort64/ });
  await expect(quick64).toContainText("2,016");

  // The chart is keyboard-readable.
  const chart = page.getByRole("group", { name: /Comparisons against input size/ });
  await chart.focus();
  await page.keyboard.press("ArrowRight");
  await expect(chart).toContainText("Input size n 8:");

  await page.getByLabel("Metric").selectOption("medianMs");
  await expect(page.getByText(/Wall-clock times are medians/)).toBeVisible();

  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations.map((v) => `${v.id} (${scheme})`)).toEqual([]);
  }
});

test("studio: example traces from unregistered algorithms render; broken ones are rejected", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByLabel("Load an example").selectOption("sieve");
  await expect(page.getByTestId("studio-summary")).toContainText("studio/sieve-of-eratosthenes");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await page.getByRole("button", { name: "Step back" }).click();
  await expect(page.getByTestId("narration")).toContainText(
    "The primes up to 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.",
  );

  await page.getByLabel("Load an example").selectOption("pascal");
  await expect(page.locator('[data-kind="grid"]')).toBeVisible();

  await page.getByLabel("Load an example").selectOption("broken");
  await expect(page.getByTestId("studio-errors")).toContainText(
    'event #3: index 42 out of range for array "N"',
  );
  await expect(page.getByTestId("trace-viewer")).toHaveCount(0);

  await page.getByLabel("Trace JSON").fill("{ not json");
  await page.getByRole("button", { name: "Validate and visualize" }).click();
  await expect(page.getByTestId("studio-errors")).toContainText("Not valid JSON");
});

test("studio: an exported trace re-imports and replays identically", async ({ page }) => {
  await page.goto("/algorithms/merge-sort");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export trace (JSON)" }).click();
  const download = await downloadPromise;
  const path = await download.path();

  await page.goto("/studio");
  await page.locator('input[type="file"]').setInputFiles(path!);
  await expect(page.getByTestId("studio-summary")).toContainText("“merge-sort” v2");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await page.getByRole("button", { name: /text description/ }).click();
  await expect(page.getByTestId("text-description")).toContainText(
    "A = [3, 9, 10, 27, 38, 43, 82]",
  );
});
