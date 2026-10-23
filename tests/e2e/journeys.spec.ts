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
  await expect(page.getByLabel("JavaScript implementation")).toContainText("function bfs(adj, s)");
  await expect(page.getByText(/Tested on \d+ cases/)).toBeVisible();
  // The e2e build enables the runner, pre-filled with the same code and a call.
  await expect(page.locator("#runner-code")).toHaveValue(
    /function bfs\(adj, s\)[\s\S]*console\.log\(bfs\(/,
  );
});

test("explore search and filters, shareable via URL", async ({ page }) => {
  await page.goto("/explore");
  await page.getByLabel("Search").fill("shortest path");
  await expect(page.getByTestId("results")).toContainText("Breadth-First Search");
  await expect(page.getByTestId("results")).not.toContainText("Bubble Sort");
  await expect(page).toHaveURL(/query=shortest/);
  await page.getByLabel("Search").fill("");
  await page.getByLabel("Worst-case time at most").selectOption("n log n");
  await expect(page.getByTestId("result-count")).toContainText("45 interactive entries");
  await page.goto("/explore?domain=searching-sorting");
  await expect(page.getByTestId("results")).toContainText("Bubble Sort");
  await expect(page.getByTestId("results")).not.toContainText("Breadth-First");
});

test("roadmap lists the curriculum honestly", async ({ page }) => {
  await page.goto("/roadmap");
  await page.getByLabel("Search the curriculum").fill("bellman");
  const bellman = page.locator('[data-number="208"]');
  await expect(bellman).toContainText("Available");
  await expect(bellman).toContainText("Tier 2");
  await page.getByLabel("Search the curriculum").fill("boruvka");
  await expect(page.locator('[data-number="218"]')).toContainText("Planned");
  await page.getByLabel("Search the curriculum").fill("dijkstra");
  await expect(page.locator('[data-number="207"]')).toContainText("Available");
  await page.getByLabel("Search the curriculum").fill("sollin");
  await expect(page.locator('[data-number="220"]')).toContainText("Same as #218");
  await page.getByLabel("Search the curriculum").fill("");
  await page.getByLabel("Status").selectOption("available");
  await expect(page.getByTestId("roadmap-count")).toContainText("Showing 82 of 600");
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

test("union-find moves subtrees; Bellman–Ford reports a negative cycle", async ({ page }) => {
  await page.goto("/algorithms/union-find");
  const forest = page.locator('[data-kind="tree"]');
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(forest.locator("[data-node]")).toHaveCount(9);
  await expect(page.getByTestId("result")).toContainText("1 set; answers: 0");
  await page.getByLabel("Operations").fill("union 0 1, find 9");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("numbered 0–7");

  await page.goto("/algorithms/bellman-ford");
  await page.getByLabel("Directed edges").fill("S->A:1, A->B:2, B->C:-4, C->A:1");
  await page.getByLabel("Start node").fill("S");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("negative cycle");
});

test("deque renderer: the monotonic queue shows both ends and the window maxima", async ({
  page,
}) => {
  await page.goto("/algorithms/monotonic-queue");
  const deque = page.locator('[data-kind="sequence"]');
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(deque).toContainText("front");
  await expect(deque).toContainText("back");
  await expect(page.getByTestId("result")).toContainText("Window maxima: 3, 3, 5, 5, 6, 7");
  await page.getByLabel("Window size k").fill("9");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("between 1 and 8");
});

test("A* on a grid map, and highlighted bridges and cut vertices", async ({ page }) => {
  await page.goto("/algorithms/a-star");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText(
    "Shortest path: 11 moves; expanded 17 cells",
  );
  await expect(page.locator(".grid-view td.cell--path")).toHaveCount(12);
  await page.getByLabel("Map", { exact: true }).fill("S.#\n.#G");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("No path");
  await page.getByLabel("Map", { exact: true }).fill("S..\n..X");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText('Unknown map character "X"');

  await page.goto("/algorithms/bridges-articulation");
  await page.getByRole("button", { name: "Jump to end" }).click();
  const drawing = page.locator('svg[aria-label^="Graph"]');
  await expect(drawing.locator(".g-node--highlight")).toHaveCount(3);
  await expect(drawing.locator(".g-edge--highlight")).toHaveCount(2);
  await expect(page.getByText("highlighted (long dashes)")).toBeVisible();
});

test("string algorithms: dictionary matches, a suffix tree with long edge labels, input checks", async ({
  page,
}) => {
  await page.goto("/algorithms/aho-corasick");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("Matches: she@1, he@2, hers@2");

  await page.goto("/algorithms/suffix-tree");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("11 nodes");
  const tree = page.locator('svg[aria-label^="Tree"]');
  await expect(tree.getByText("banana$", { exact: true })).toBeVisible();
  await expect(tree.locator("rect")).not.toHaveCount(0);

  await page.goto("/algorithms/manacher");
  await page.getByLabel("Text").fill("Abc");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("lowercase letters a–z only");
});

test("tree queries reject non-trees; memoization and tabulation side by side", async ({ page }) => {
  await page.goto("/algorithms/binary-lifting");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("LCAs: B, E, A");
  await page.getByLabel("Tree edges").fill("A-B, B-C, C-A");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("need exactly 2 edges");

  await page.goto("/algorithms/memoization-tabulation");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText(
    "top-down: 15 subproblems, 19 calls; bottom-up: 22 cells",
  );
  await expect(page.getByRole("table", { name: "Table Top-down: memo[a][b]" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Table Bottom-up: table[a][b]" })).toBeVisible();
});

test("number theory: a strong liar, a prime refused for factoring, contradictory congruences", async ({
  page,
}) => {
  await page.goto("/algorithms/miller-rabin");
  await page
    .getByLabel("Load an example")
    .selectOption({ label: "2047 with base 2 only (a strong liar)" });
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("Probably prime");

  await page.goto("/algorithms/pollard-rho");
  await page.getByLabel("n (composite, to factor)").fill("101");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("101 is prime");

  await page.goto("/algorithms/crt");
  await page.getByLabel("Congruences x ≡ a (mod m)").fill("1 mod 4, 2 mod 6");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("No solution");
});

test("flows and matchings: a maximum flow with its cut, and input checks", async ({ page }) => {
  await page.goto("/algorithms/dinic");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("Maximum flow 23; cut {A, B, D, S}");
  await page.getByLabel("Sink").fill("S");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("The sink must differ from the source");

  await page.goto("/algorithms/hopcroft-karp");
  await page.getByLabel("Edges (left-right)").fill("A-1, 1-B");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText('"1" appears on both sides');
});

test("DP techniques: an optimal tour, and checks on matrices and heights", async ({ page }) => {
  await page.goto("/algorithms/held-karp");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("Tour A → C → D → B → A, length 21");
  await page.getByLabel("Distances (row = from, column = to)").fill("0 1 2\n1 0");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("the matrix must be 2 × 2");

  await page.goto("/algorithms/convex-hull-trick");
  await page.getByLabel("Stone heights (strictly increasing)").fill("1, 3, 3");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("strictly increasing");
});

test("geometry: a hull on the plane, and checks on point lists", async ({ page }) => {
  await page.goto("/algorithms/graham-scan");
  await expect(page.locator('[data-kind="plane"]')).toBeVisible();
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText(
    "Hull corners 0, 1, 3, 4, 5 (5); 6 popped",
  );
  await expect(page.getByLabel("Plane legend")).toContainText("in the answer");

  await page.goto("/algorithms/closest-pair");
  await page.getByLabel("Points (x,y pairs)").fill("3,4");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("Give 2–32 points; got 1");

  await page.goto("/algorithms/kd-tree");
  await page.getByRole("button", { name: "Jump to end" }).click();
  await expect(page.getByTestId("result")).toContainText("Nearest: E (distance² 2)");
  await expect(page.locator('[data-kind="tree"]')).toBeVisible();
  await page.getByLabel("Query point q").fill("1,2,3");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".alert--error")).toContainText("Every point needs both an x and a y");
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
    "union-find",
    "kruskal",
    "prim",
    "bellman-ford",
    "floyd-warshall",
    "topological-sort-dfs",
    "lis",
    "fenwick-tree",
    "prefix-sums",
    "sliding-window",
    "two-pointers",
    "monotonic-stack",
    "monotonic-queue",
    "sparse-table",
    "kosaraju",
    "tarjan-scc",
    "bridges-articulation",
    "a-star",
    "manacher",
    "aho-corasick",
    "suffix-array",
    "suffix-tree",
    "suffix-automaton",
    "binary-lifting",
    "heavy-light",
    "matrix-exponentiation",
    "memoization-tabulation",
    "miller-rabin",
    "pollard-rho",
    "crt",
    "ntt",
    "fft",
    "dinic",
    "push-relabel",
    "hopcroft-karp",
    "held-karp",
    "assignment-dp",
    "digit-dp",
    "convex-hull-trick",
    "graham-scan",
    "closest-pair",
    "kd-tree",
  ]) {
    await page.goto(`/algorithms/${slug}`);
    await page.getByRole("button", { name: "Jump to end" }).click();
    await expect(page.getByTestId("result"), slug).toContainText(
      "Verified by an independent checker",
    );
  }
  expect(errors).toEqual([]);
});
