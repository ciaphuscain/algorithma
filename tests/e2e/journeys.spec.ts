import { expect, test, type Page } from "@playwright/test";

const narration = (page: Page) => page.getByTestId("narration");
const stepForward = (page: Page) => page.getByRole("button", { name: "Step forward" }).click();
const stepBack = (page: Page) => page.getByRole("button", { name: "Step back" }).click();

async function showDescription(page: Page) {
  const toggle = page.getByRole("button", { name: /text description/ });
  if ((await toggle.getAttribute("aria-pressed")) !== "true") await toggle.click();
  return page.getByTestId("text-description");
}

test("beginner journey: discover Bubble Sort, run custom input, step both ways", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start with Bubble Sort" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Bubble Sort" })).toBeVisible();

  await page.getByLabel("Array", { exact: true }).fill("3, 1, 2");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(narration(page)).toContainText("Initial state");

  await stepForward(page);
  await expect(narration(page)).toContainText("n = 3");
  await stepForward(page);
  await stepForward(page);
  await expect(narration(page)).toContainText("Compare A[0] = 3 with A[1] = 1");
  await expect(page.locator('.pseudo li[aria-current="step"]')).toContainText("if A[j] > A[j + 1]");
  await stepForward(page);
  await expect(narration(page)).toContainText("3 > 1, so swap them");
  await expect(await showDescription(page)).toContainText("A = [1, 3, 2]");

  // Backward stepping restores the exact earlier state.
  await stepBack(page);
  await expect(narration(page)).toContainText("Compare A[0] = 3 with A[1] = 1");
  await expect(page.getByTestId("text-description")).toContainText("A = [3, 1, 2]");

  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("text-description")).toContainText("A = [1, 2, 3]");
  await expect(page.getByTestId("result")).toContainText("Sorted: [1, 2, 3]");
  await expect(page.getByTestId("result")).toContainText("Verified by an independent checker");
  await expect(page.getByTestId("counters")).toContainText("3comparisons");
});

test("invalid input is rejected with an explanation", async ({ page }) => {
  await page.goto("/algorithms/bubble-sort");
  const field = page.getByLabel("Array", { exact: true });
  await field.fill("4, x, 2");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText('"x" is not a whole number');
  await expect(field).toHaveAttribute("aria-invalid", "true");
  await field.fill(Array.from({ length: 41 }, (_, i) => i).join(","));
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("at most 40");
});

test("keyboard controls drive playback", async ({ page }) => {
  await page.goto("/algorithms/bubble-sort");
  await page.getByRole("button", { name: "Play" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".controls__pos")).toHaveText("2 / 25");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".controls__pos")).toHaveText("1 / 25");
  await page.keyboard.press("End");
  await expect(page.locator(".controls__pos")).toHaveText("25 / 25");
  await page.keyboard.press("Home");
  await expect(page.locator(".controls__pos")).toHaveText("0 / 25");
});

test("play runs to completion and stops", async ({ page }) => {
  await page.goto("/algorithms/bubble-sort");
  await page.getByLabel("Speed").selectOption("32");
  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".controls__pos")).toHaveText("25 / 25");
});

test("BFS: same viewer, different structures; custom graph and validation", async ({ page }) => {
  await page.goto("/algorithms/bfs");
  await expect(page.locator('[data-kind="graph"]')).toBeVisible();
  await expect(page.locator('[data-kind="sequence"]')).toBeVisible();

  await page.getByRole("textbox", { name: "Edges" }).fill("A-B, B-C, X");
  await page.getByLabel("Start node").fill("A");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await page.getByRole("button", { name: "Jump to end" }).click();
  const description = await showDescription(page);
  await expect(description).toContainText("C (d=2)");
  await expect(description).toContainText("unreachable: X (d=∞)");
  await expect(page.getByTestId("result")).toContainText("Verified by an independent checker");

  await page.getByLabel("Start node").fill("Z");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText('Start node "Z" is not in the graph');
});

test("learn tab reveals depth progressively with rendered maths", async ({ page }) => {
  await page.goto("/algorithms/bubble-sort#learn");
  await expect(page.getByText("Level 1 of 5 · Intuition")).toBeVisible();
  await page.getByRole("button", { name: /Mathematics/ }).click();
  await expect(page.getByText("Level 4 of 5 · Mathematics")).toBeVisible();
  await expect(page.locator(".katex").first()).toBeVisible();
});

test("practice gives feedback, hints and explanations", async ({ page }) => {
  await page.goto("/algorithms/bubble-sort#practice");
  const q = page.getByTestId("question-bubble-comparisons");
  await q.getByRole("button", { name: "Show a hint" }).click();
  await expect(q).toContainText("Hint 1");
  await q.getByLabel("Your answer").fill("10");
  await q.getByRole("button", { name: "Check answer" }).click();
  await expect(q.getByTestId("feedback")).toContainText("Not quite");
  await q.getByLabel("Your answer").fill("15");
  await q.getByRole("button", { name: "Check answer" }).click();
  await expect(q.getByTestId("feedback")).toContainText("Correct");

  const mcq = page.getByTestId("question-bubble-first-pass");
  await mcq.getByLabel("[1, 2, 4, 5, 8]").check();
  await mcq.getByRole("button", { name: "Check answer" }).click();
  await expect(mcq.getByTestId("feedback")).toContainText("fully sorted array");

  // Progress appears on the home page.
  await page.goto("/");
  await expect(page.getByText("questions answered correctly")).toBeVisible();
  await expect(page.getByRole("link", { name: /Continue\s*Bubble Sort/ })).toBeVisible();
});

test("exam notes and code tabs", async ({ page }) => {
  await page.goto("/algorithms/bfs#exam");
  await expect(page.getByTestId("exam-notes")).toContainText("10-mark answer");
  await page.getByRole("tab", { name: "Code" }).click();
  await expect(page.getByText("from collections import deque")).toBeVisible();
  await page.getByRole("button", { name: "JavaScript" }).click();
  await expect(page.getByText("function bfs(adj, s)")).toBeVisible();
  await expect(page.getByText(/Tested on \d+ cases/)).toBeVisible();
});

test("explore search and filters, shareable via URL", async ({ page }) => {
  await page.goto("/explore");
  await page.getByLabel("Search").fill("shortest path");
  await expect(page.getByTestId("results")).toContainText("Breadth-First Search");
  await expect(page.getByTestId("results")).not.toContainText("Bubble Sort");
  await expect(page).toHaveURL(/query=shortest/);
  await page.getByLabel("Search").fill("");
  await page.getByLabel("Worst-case time at most").selectOption("n log n");
  await expect(page.getByTestId("result-count")).toContainText("13 interactive entries");
  await page.goto("/explore?domain=searching-sorting");
  await expect(page.getByTestId("results")).toContainText("Bubble Sort");
  await expect(page.getByTestId("results")).not.toContainText("Breadth-First");
});

test("roadmap lists the curriculum honestly", async ({ page }) => {
  await page.goto("/roadmap");
  await page.getByLabel("Search the curriculum").fill("bellman");
  const bellman = page.locator('[data-number="208"]');
  await expect(bellman).toContainText("Planned");
  await expect(bellman).toContainText("Tier 2");
  await page.getByLabel("Search the curriculum").fill("dijkstra");
  await expect(page.locator('[data-number="207"]')).toContainText("Available");
  await page.getByLabel("Search the curriculum").fill("sollin");
  await expect(page.locator('[data-number="220"]')).toContainText("Same as #218");
  await page.getByLabel("Search the curriculum").fill("");
  await page.getByLabel("Status").selectOption("available");
  await expect(page.getByTestId("roadmap-count")).toContainText("Showing 27 of 600");
  await page.locator('[data-number="11"]').getByRole("link", { name: "Bubble Sort" }).click();
  await expect(page).toHaveURL(/\/algorithms\/bubble-sort/);
});

test("unknown algorithm returns 404", async ({ page }) => {
  const response = await page.goto("/algorithms/does-not-exist");
  expect(response?.status()).toBe(404);
});

test("grid renderer: edit distance fills the DP table and traces back", async ({ page }) => {
  await page.goto("/algorithms/edit-distance");
  await page.getByLabel("From (a)").fill("cat");
  await page.getByLabel("To (b)").fill("cart");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator('[data-kind="grid"]')).toBeVisible();
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText(
    "Distance 1: keep c, keep a, insert r, keep t",
  );
  await expect(page.locator(".grid-view td.cell--path")).toHaveCount(5);
});

test("priority-queue renderer: Dijkstra settles vertices by distance", async ({ page }) => {
  await page.goto("/algorithms/dijkstra");
  await expect(page.locator('[data-kind="sequence"]')).toContainText("Priority queue");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("A: 0, B: 3, C: 2, D: 8, E: 10, F: 13");
  const negative = page.getByRole("textbox", { name: "Edges" });
  await negative.fill("A-B:-2");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("below the minimum 0");
});

test("tree renderer: BST inserts, searches and deletes with a successor", async ({ page }) => {
  await page.goto("/algorithms/bst");
  const tree = page.locator('[data-kind="tree"]');
  await expect(tree).toBeVisible();
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(tree.locator("[data-node]")).toHaveCount(4);
  await expect(page.getByTestId("result")).toContainText("In-order: 40, 60, 70, 80");
  await page.getByLabel("Then delete").fill("");
  await page.getByLabel("Insert, in order").fill("1, 2, 3, 4");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(tree.locator("[data-node]")).toHaveCount(4);
  await page.getByLabel("Insert, in order").fill("1, 2, 300");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("99");
});

test("every catalogue entry renders its visualizer without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  for (const slug of [
    "linear-search",
    "binary-search",
    "bubble-sort",
    "selection-sort",
    "insertion-sort",
    "merge-sort",
    "quick-sort",
    "heap-sort",
    "bfs",
    "dfs",
    "dijkstra",
    "topological-sort",
    "edit-distance",
    "lcs",
    "knapsack",
    "kmp",
    "tree-traversals",
    "bst",
    "trie",
    "segment-tree",
  ]) {
    await page.goto(`/algorithms/${slug}`);
    await page.getByRole("button", { name: "Jump to end" }).click();
    await expect(page.getByTestId("result"), slug).toContainText(
      "Verified by an independent checker",
    );
  }
  expect(errors).toEqual([]);
});
