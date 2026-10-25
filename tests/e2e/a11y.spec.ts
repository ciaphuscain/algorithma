import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Automated checks catch only part of WCAG; they complement, not replace, manual review.
for (const path of [
  "/",
  "/explore",
  "/roadmap",
  "/progress",
  "/algorithms/aho-corasick",
  "/algorithms/bubble-sort",
  "/algorithms/bfs",
  "/algorithms/bfs#exam",
  "/algorithms/kruskal#code",
  "/algorithms/merge-sort",
  "/algorithms/heap-sort",
  "/algorithms/binary-search",
  "/algorithms/dfs",
  "/algorithms/dijkstra",
  "/algorithms/edit-distance",
  "/algorithms/topological-sort",
  "/algorithms/knapsack",
  "/algorithms/kmp",
  "/algorithms/bst",
  "/algorithms/trie",
  "/algorithms/union-find",
  "/algorithms/floyd-warshall",
  "/algorithms/monotonic-queue",
  "/algorithms/sparse-table",
  "/algorithms/a-star",
  "/algorithms/bridges-articulation",
  "/algorithms/suffix-tree",
  "/algorithms/suffix-automaton",
  "/algorithms/binary-lifting",
  "/algorithms/memoization-tabulation",
  "/algorithms/miller-rabin",
  "/algorithms/fft",
  "/algorithms/dinic",
  "/algorithms/hopcroft-karp",
  "/algorithms/held-karp",
  "/algorithms/digit-dp",
  "/algorithms/graham-scan",
  "/algorithms/kd-tree",
  "/algorithms/mcts",
  "/algorithms/gradient-descent",
  "/algorithms/paxos",
  "/algorithms/raft",
  "/arena",
  "/studio",
]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`no detectable WCAG A/AA violations on ${path} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const summary = results.violations.map(
        (v) =>
          `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes
            .slice(0, 2)
            .map((n) => n.target.join(" "))
            .join(" | ")}`,
      );
      expect(summary).toEqual([]);
    });
  }
}
