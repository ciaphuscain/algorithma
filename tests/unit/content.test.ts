import { execFileSync } from "node:child_process";
import katex from "katex";
import { describe, expect, it } from "vitest";
import { contentHash, fnv1a64, reviewState } from "@/content/review";
import { getModule } from "@/algorithms/registry";
import {
  ENTRIES,
  entryForItem,
  getEntry,
  searchCatalog,
  searchCurriculum,
} from "@/content/catalog";
import { curriculumItem } from "@/content/curriculum";
import { getDomain } from "@/content/domains";
import type { AlgorithmEntry, Block } from "@/content/types";
import { grade } from "@/lib/grading";

function hasPython(): boolean {
  try {
    execFileSync("python3", ["--version"]);
    return true;
  } catch {
    return false;
  }
}

/** Every piece of text in an entry that may contain inline $TeX$. */
function texts(entry: AlgorithmEntry): string[] {
  const fromBlock = (b: Block): string[] => {
    switch (b.kind) {
      case "p":
      case "heading":
      case "callout":
        return [b.text];
      case "list":
        return b.items;
      case "table":
        return [...b.head, ...b.rows.flat()];
      case "math":
      case "code":
        return [];
    }
  };
  return [
    entry.problem.input,
    entry.problem.output,
    entry.complexity.note ?? "",
    ...entry.properties.map((p) => p.value),
    ...Object.values(entry.levels).flat().flatMap(fromBlock),
    ...entry.practice.flatMap((q) => [
      q.prompt,
      q.explanation,
      ...q.hints,
      ...(q.kind === "mcq" ? [...q.options, ...Object.values(q.distractors ?? {})] : []),
    ]),
    ...Object.values(entry.exam).flatMap((v) =>
      typeof v === "string"
        ? [v]
        : Array.isArray(v)
          ? v.flatMap((x) => (typeof x === "string" ? [x] : "q" in x ? [x.q, x.a] : x.outline))
          : [],
    ),
  ];
}

describe.each(ENTRIES.map((e) => [e.slug, e] as const))("entry %s", (_slug, entry) => {
  it("has consistent metadata", () => {
    expect(getDomain(entry.domain)).toBeDefined();
    expect(entry.slug).toMatch(/^[a-z0-9-]+$/);
    for (const n of entry.curriculum) expect(curriculumItem(n)).toBeDefined();
    if (entry.visualizer) expect(getModule(entry.visualizer)).toBeDefined();
    for (const level of Object.values(entry.levels)) expect(level.length).toBeGreaterThan(0);
    expect(entry.references.length).toBeGreaterThan(0);
  });

  it("only uses TeX that KaTeX can render", () => {
    const tex = [
      ...texts(entry).flatMap((t) => [...t.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]!)),
      ...Object.values(entry.levels)
        .flat()
        .flatMap((b) => (b.kind === "math" ? [b.tex] : [])),
      entry.complexity.time.best,
      entry.complexity.time.average,
      entry.complexity.time.worst,
      entry.complexity.space,
    ];
    for (const t of tex)
      expect(() => katex.renderToString(t, { throwOnError: true }), t).not.toThrow();
  });

  it("has well-formed practice questions", () => {
    const ids = new Set<string>();
    for (const q of entry.practice) {
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);
      if (q.kind === "mcq") {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
        expect(grade(q, { kind: "mcq", choice: q.answer }).correct).toBe(true);
        for (const k of Object.keys(q.distractors ?? {})) expect(Number(k)).not.toBe(q.answer);
      } else {
        expect(grade(q, { kind: "numeric", value: String(q.answer) }).correct).toBe(true);
      }
    }
  });

  it.each(
    entry.implementations
      .filter((i) => i.language === "javascript")
      .map((i) => [i.entry, i] as const),
  )("JavaScript implementation %s passes its tests", (_name, impl) => {
    const fn = new Function(`${impl.code}\nreturn ${impl.entry};`)() as (
      ...args: unknown[]
    ) => unknown;
    for (const t of impl.tests) expect(fn(...structuredClone(t.args))).toEqual(t.expected);
  });

  it
    .skipIf(!hasPython())
    .each(
      entry.implementations
        .filter((i) => i.language === "python")
        .map((i) => [i.entry, i] as const),
    )("Python implementation %s passes its tests", (_name, impl) => {
    const harness = `${impl.code}
import json, sys
cases = json.loads(sys.stdin.read())
print(json.dumps([${impl.entry}(*c["args"]) for c in cases]))
`;
    const out = execFileSync("python3", ["-I", "-c", harness], {
      input: JSON.stringify(impl.tests),
      encoding: "utf8",
    });
    expect(JSON.parse(out)).toEqual(impl.tests.map((t) => t.expected));
  });
});

describe("catalog search", () => {
  const slugs = (f: Parameters<typeof searchCatalog>[0]) => searchCatalog(f).map((e) => e.slug);

  it("finds entries by name, alias and tag", () => {
    // The bubble-sort variants match too, but the entry named Bubble Sort ranks first.
    expect(slugs({ query: "bubble" })[0]).toBe("bubble-sort");
    expect(slugs({ query: "bubble" }).sort()).toEqual([
      "bubble-sort",
      "cocktail-shaker-sort",
      "comb-sort",
      "odd-even-sort",
      "optimized-bubble-sort",
    ]);
    // Level-order traversal, Dinic and Hopcroft–Karp are tagged "bfs" too, but the
    // algorithm named BFS ranks first.
    const bfsHits = slugs({ query: "BFS" });
    expect(bfsHits[0]).toBe("bfs");
    expect([...bfsHits].sort()).toEqual(["bfs", "dinic", "hopcroft-karp", "tree-traversals"]);
    expect(slugs({ query: "levenshtein" })).toEqual(["edit-distance"]);
    expect(slugs({ query: "shortest path" })).toEqual(expect.arrayContaining(["bfs", "dijkstra"]));
    expect(slugs({ query: "stable sort" }).sort()).toEqual([
      "binary-insertion-sort",
      "block-sort",
      "bottom-up-merge-sort",
      "bubble-sort",
      "cocktail-shaker-sort",
      "counting-sort",
      "gnome-sort",
      "insertion-sort",
      "merge-sort",
      "merge-sorted-lists",
      "natural-merge-sort",
      "odd-even-sort",
      "optimized-bubble-sort",
      "radix-sort",
      "tim-sort",
      "tree-sort",
    ]);
  });

  it("requires every term to match", () => {
    expect(searchCatalog({ query: "bubble graph" })).toEqual([]);
  });

  it("filters by complexity bound and domain", () => {
    expect(slugs({ maxWorst: "n log n" }).sort()).toEqual([
      "a-star",
      "aa-tree",
      "aho-corasick",
      "american-flag-sort",
      "avl-tree",
      "b-plus-tree",
      "b-star-tree",
      "b-tree",
      "balanced-brackets",
      "bfs",
      "binary-heap",
      "binary-lifting",
      "binary-search",
      "binomial-heap",
      "bottom-up-merge-sort",
      "boyer-moore-majority",
      "bridges-articulation",
      "bst",
      "circular-queue",
      "closest-pair",
      "consistent-hashing",
      "convex-hull-trick",
      "copy-random-list",
      "counting-sort",
      "crt",
      "cuckoo-hashing",
      "deque",
      "dfs",
      "difference-array",
      "dijkstra",
      "dutch-national-flag",
      "euclid",
      "exponential-search",
      "expression-tree",
      "fenwick-tree",
      "fft",
      "fibonacci-heap",
      "fibonacci-search",
      "fisher-yates",
      "floyd-cycle",
      "floyd-find-duplicate",
      "graham-scan",
      "hash-chaining",
      "heap-sort",
      "heavy-light",
      "interpolation-search",
      "intro-sort",
      "jump-search",
      "kadane",
      "kd-tree",
      "kmp",
      "kosaraju",
      "kruskal",
      "lazy-segment-tree",
      "leftist-heap",
      "lfu-cache",
      "linear-search",
      "lis",
      "list-two-pointers",
      "lru-cache",
      "manacher",
      "mapreduce",
      "matrix-exponentiation",
      "merge-sort",
      "merge-sorted-lists",
      "miller-rabin",
      "min-stack",
      "monotonic-queue",
      "monotonic-stack",
      "morris-traversal",
      "msd-radix-sort",
      "natural-merge-sort",
      "ntt",
      "open-addressing",
      "pairing-heap",
      "patience-sort",
      "patricia-trie",
      "postfix-evaluation",
      "prefix-sums",
      "prefix-xor",
      "prim",
      "queue-using-stacks",
      "radix-sort",
      "radix-tree",
      "recursive-binary-search",
      "red-black-tree",
      "rendezvous-hashing",
      "reservoir-sampling",
      "reverse-linked-list",
      "robin-hood-hashing",
      "scapegoat-tree",
      "segment-tree",
      "sentinel-search",
      "shunting-yard",
      "skew-heap",
      "skip-list",
      "sliding-window",
      "smooth-sort",
      "sparse-table",
      "splay-tree",
      "suffix-array",
      "suffix-automaton",
      "suffix-tree",
      "tarjan-scc",
      "ternary-search",
      "ternary-search-tree",
      "tim-sort",
      "topological-sort",
      "topological-sort-dfs",
      "tournament-sort",
      "treap",
      "tree-traversals",
      "trie",
      "two-pointers",
      "uniform-binary-search",
      "union-find",
      "weak-heap-sort",
      "zobrist-hashing",
    ]);
    expect(slugs({ maxWorst: "log n" }).sort()).toEqual([
      "aa-tree",
      "avl-tree",
      "b-plus-tree",
      "b-star-tree",
      "b-tree",
      "binary-heap",
      "binary-search",
      "binomial-heap",
      "circular-queue",
      "consistent-hashing",
      "crt",
      "cuckoo-hashing",
      "euclid",
      "exponential-search",
      "fenwick-tree",
      "fibonacci-search",
      "lazy-segment-tree",
      "leftist-heap",
      "lfu-cache",
      "lru-cache",
      "matrix-exponentiation",
      "miller-rabin",
      "min-stack",
      "recursive-binary-search",
      "red-black-tree",
      "segment-tree",
      "ternary-search",
      "uniform-binary-search",
      "union-find",
      "zobrist-hashing",
    ]);
    expect(slugs({ domain: "searching-sorting" }).sort()).toEqual([
      "american-flag-sort",
      "bead-sort",
      "binary-insertion-sort",
      "binary-search",
      "bingo-sort",
      "block-sort",
      "bogo-sort",
      "bottom-up-merge-sort",
      "bubble-sort",
      "bucket-sort",
      "cocktail-shaker-sort",
      "comb-sort",
      "counting-sort",
      "cycle-sort",
      "double-selection-sort",
      "dual-pivot-quick-sort",
      "exponential-search",
      "fibonacci-search",
      "flash-sort",
      "gnome-sort",
      "heap-sort",
      "insertion-sort",
      "interpolation-search",
      "intro-sort",
      "jump-search",
      "library-sort",
      "linear-search",
      "merge-sort",
      "msd-radix-sort",
      "natural-merge-sort",
      "odd-even-sort",
      "optimized-bubble-sort",
      "pancake-sort",
      "patience-sort",
      "quick-sort",
      "radix-sort",
      "recursive-binary-search",
      "selection-sort",
      "sentinel-search",
      "shell-sort",
      "sleep-sort",
      "smooth-sort",
      "strand-sort",
      "ternary-search",
      "three-way-quick-sort",
      "tim-sort",
      "tournament-sort",
      "tree-sort",
      "uniform-binary-search",
      "weak-heap-sort",
    ]);
  });

  it("links curriculum items, including duplicates, to entries", () => {
    expect(entryForItem(11)?.slug).toBe("bubble-sort");
    expect(entryForItem(201)?.slug).toBe("bfs");
    expect(entryForItem(330)?.slug).toBe("edit-distance"); // duplicate of #276
    expect(entryForItem(1)?.slug).toBe("linear-search");
    expect(entryForItem(208)?.slug).toBe("bellman-ford");
    expect(entryForItem(173)?.slug).toBe("fenwick-tree"); // duplicate of #61
    expect(entryForItem(317)?.slug).toBe("suffix-tree"); // Ukkonen's construction
    expect(entryForItem(345)?.slug).toBe("manacher"); // duplicate of #328
    expect(entryForItem(247)?.slug).toBe("binary-lifting"); // LCA, duplicate of #188
    expect(entryForItem(249)?.slug).toBe("heavy-light"); // duplicate of #190
    expect(entryForItem(252)?.slug).toBe("memoization-tabulation");
    expect(entryForItem(371)?.slug).toBe("miller-rabin");
    expect(entryForItem(393)?.slug).toBe("ntt");
    expect(entryForItem(235)?.slug).toBe("dinic");
    expect(entryForItem(237)?.slug).toBe("hopcroft-karp");
    expect(entryForItem(296)?.slug).toBe("held-karp");
    expect(entryForItem(300)?.slug).toBe("convex-hull-trick");
    expect(entryForItem(406)?.slug).toBe("graham-scan");
    expect(entryForItem(410)?.slug).toBe("closest-pair");
    expect(entryForItem(418)?.slug).toBe("kd-tree"); // KD-tree search, duplicate of #177
    expect(entryForItem(427)?.slug).toBe("quickselect");
    expect(entryForItem(455)?.slug).toBe("mcts");
    expect(entryForItem(496)?.slug).toBe("gradient-descent");
    expect(entryForItem(461)?.slug).toBe("mapreduce");
    expect(entryForItem(466)?.slug).toBe("paxos");
    expect(entryForItem(467)?.slug).toBe("raft");
    expect(entryForItem(218)).toBeUndefined(); // Borůvka: planned
    expect(getEntry("nope")).toBeUndefined();
  });

  it("every related link points to a published entry, and no entry claims a curriculum item twice", () => {
    const claimed = new Map<number, string>();
    for (const e of ENTRIES) {
      for (const r of e.related) expect(getEntry(r), `${e.slug} → ${r}`).toBeDefined();
      for (const n of e.curriculum) {
        expect(claimed.get(n), `#${n}`).toBeUndefined();
        claimed.set(n, e.slug);
      }
    }
  });

  it("searches the curriculum roadmap", () => {
    expect(searchCurriculum("dijkstra").map((i) => i.number)).toEqual([207, 212, 215]);
    expect(searchCurriculum("")).toHaveLength(600);
  });
});

describe("worked examples agree with the engine", () => {
  it("bubble sort on [5, 1, 4, 2, 8]: 10 comparisons, 4 swaps, sorted after pass 2", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const { trace } = runAlgorithm(getModule("bubble-sort")!, [5, 1, 4, 2, 8]);
    expect(trace.meta.counters).toMatchObject({ comparisons: 10, swaps: 4 });
    // Find the state just after the "pass 2 complete" mark (second sorted mark).
    const player = new TracePlayer(trace);
    const markPositions = trace.events.flatMap((e, i) => (e.type === "array.mark" ? [i + 1] : []));
    const afterPass = (k: number) => {
      const s = player.stateAt(markPositions[k - 1]!).structures.A!;
      return s.kind === "array" ? s.values : [];
    };
    expect(afterPass(1)).toEqual([1, 4, 2, 5, 8]);
    expect(afterPass(2)).toEqual([1, 2, 4, 5, 8]);
  });

  it("BFS example: distances and dequeue order from the lesson table", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const module = getModule("bfs")!;
    const parsed = module.input.parse({ edges: "A-B, A-C, B-D, C-D, D-E, C-F", source: "A" });
    if (!parsed.ok) throw new Error(parsed.errors.join());
    const { output } = runAlgorithm(module, parsed.value);
    expect(output.dist).toEqual({ A: 0, B: 1, C: 1, D: 2, E: 3, F: 2 });
    expect(output.order).toEqual(["A", "B", "C", "D", "F", "E"]);
    expect(output.parent.D).toBe("B");
  });

  it("insertion sort on [5, 2, 4, 6, 1, 3]: 9 shifts, 14 writes, 12 comparisons", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { trace } = runAlgorithm(getModule("insertion-sort")!, [5, 2, 4, 6, 1, 3]);
    expect(trace.meta.counters).toMatchObject({ comparisons: 12, writes: 14 });
  });

  it("quick sort partition example ends with [2, 1, 3, 4, 7, 5, 6, 8]", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const { trace } = runAlgorithm(getModule("quick-sort")!, [2, 8, 7, 1, 3, 5, 6, 4]);
    const firstFinal = trace.events.findIndex(
      (e) => e.type === "array.mark" && e.mark === "sorted",
    );
    const A = new TracePlayer(trace).stateAt(firstFinal + 1).structures.A!;
    expect(A.kind === "array" && A.values).toEqual([2, 1, 3, 4, 7, 5, 6, 8]);
  });

  it("quick sort average comparisons equal 2(n+1)H_n − 4n over all permutations", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const permutations = (a: number[]): number[][] =>
      a.length <= 1
        ? [a]
        : a.flatMap((x, i) =>
            permutations([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]),
          );
    for (let n = 1; n <= 7; n++) {
      const perms = permutations(Array.from({ length: n }, (_, i) => i));
      const total = perms.reduce(
        (sum, p) =>
          sum +
          runAlgorithm(getModule("quick-sort")!, p, { mode: "count" }).trace.meta.counters
            .comparisons!,
        0,
      );
      let h = 0;
      for (let k = 1; k <= n; k++) h += 1 / k;
      expect(total / perms.length).toBeCloseTo(2 * (n + 1) * h - 4 * n, 9);
    }
  });

  it("binary search examples: 3 comparisons to find 23; unsorted input misses 3", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const module = getModule("binary-search")!;
    const found = runAlgorithm(module, {
      values: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      target: 23,
    });
    expect(found.output).toBe(5);
    expect(found.trace.meta.counters.comparisons).toBe(3);
    // The practice question deliberately violates the precondition, so bypass the parser.
    expect(runAlgorithm(module, { values: [9, 1, 5, 3, 7], target: 3 }).output).toBe(-1);
    expect(runAlgorithm(module, { values: [4, 9, 15, 22, 30, 41, 57], target: 30 }).output).toBe(4);
  });

  it("DFS example: discovery/finish times from the lesson table", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const module = getModule("dfs")!;
    const parsed = module.input.parse({ edges: "A-B, A-C, B-D, C-D, D-E, C-F", source: "A" });
    if (!parsed.ok) throw new Error(parsed.errors.join());
    const { output, trace } = runAlgorithm(module, parsed.value);
    expect(output.disc).toEqual({ A: 1, B: 2, C: 4, D: 3, E: 8, F: 5 });
    expect(output.fin).toEqual({ A: 12, B: 11, C: 7, D: 10, E: 9, F: 6 });
    const back = trace.events.filter((e) => e.type === "graph.edge" && e.status === "back");
    expect(back).toHaveLength(1);
  });

  it("Dijkstra example: distances and settle order from the lesson table", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const module = getModule("dijkstra")!;
    const { output } = runAlgorithm(
      module,
      module.input.presets.find((p) => p.id === "classic")!.value,
    );
    expect(output.dist).toEqual({ A: 0, B: 3, C: 2, D: 8, E: 10, F: 13 });
    expect(output.settled).toEqual(["A", "C", "B", "D", "E", "F"]);
    const trap = runAlgorithm(
      module,
      module.input.presets.find((p) => p.id === "greedy-trap")!.value,
    );
    expect(trap.output.dist.T).toBe(3);
  });

  it("edit distance: the cat → cart table and the practice answers", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const module = getModule("edit-distance")!;
    const { trace, output } = runAlgorithm(module, { a: "cat", b: "cart" });
    const D = new TracePlayer(trace).finalState().structures.D!;
    expect(D.kind === "grid" && D.cells).toEqual([
      [0, 1, 2, 3, 4],
      [1, 0, 1, 2, 3],
      [2, 1, 0, 1, 2],
      [3, 2, 1, 1, 1],
    ]);
    expect(output.operations).toEqual(["keep c", "keep a", "insert r", "keep t"]);
    expect(runAlgorithm(module, { a: "flaw", b: "lawn" }).output.distance).toBe(2);
    expect(runAlgorithm(module, { a: "kitten", b: "sitting" }).output.distance).toBe(3);
    expect(runAlgorithm(module, { a: "sunday", b: "saturday" }).output.distance).toBe(3);
  });

  it("linear search: 5 comparisons to find 4, 7 to miss 5", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const m = getModule("linear-search")!;
    const hit = runAlgorithm(m, { values: [7, 3, 9, 1, 4, 8, 2], target: 4 });
    expect([hit.output, hit.trace.meta.counters.comparisons]).toEqual([4, 5]);
    const miss = runAlgorithm(m, { values: [7, 3, 9, 1, 4, 8, 2], target: 5 });
    expect([miss.output, miss.trace.meta.counters.comparisons]).toEqual([-1, 7]);
  });

  it("selection sort on [64, 25, 12, 22, 11]: 10 comparisons, 3 swaps", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { trace } = runAlgorithm(getModule("selection-sort")!, [64, 25, 12, 22, 11]);
    expect(trace.meta.counters).toMatchObject({ comparisons: 10, swaps: 3 });
  });

  it("heap sort: heap after building and after each extraction", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const { trace } = runAlgorithm(getModule("heap-sort")!, [4, 10, 3, 5, 1]);
    const player = new TracePlayer(trace);
    const values = (p: number) => {
      const A = player.stateAt(p).structures.A!;
      return A.kind === "array" ? A.values : [];
    };
    const builtAt = trace.events.findIndex((e) => e.type === "step" && e.line === 3);
    expect(values(builtAt + 1)).toEqual([10, 5, 3, 4, 1]);
    // Snapshot just before each extraction swap (line 4).
    const swaps = trace.events.flatMap((e, i) =>
      e.type === "array.swap" && e.line === 4 ? [i] : [],
    );
    expect(swaps.slice(1).map((i) => values(i))).toEqual([
      [5, 4, 3, 1, 10],
      [4, 1, 3, 5, 10],
      [3, 1, 4, 5, 10],
    ]);
  });

  it("topological sort examples: course order and cycle detection", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const m = getModule("topological-sort")!;
    const courses = runAlgorithm(m, m.input.presets.find((p) => p.id === "courses")!.value).output;
    expect(courses).toEqual({ order: ["A", "B", "C", "D", "E", "F"], hasCycle: false });
    const cyclic = runAlgorithm(m, m.input.presets.find((p) => p.id === "cycle")!.value).output;
    expect(cyclic).toEqual({ order: ["A"], hasCycle: true });
  });

  it("LCS examples", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const m = getModule("lcs")!;
    expect(runAlgorithm(m, { a: "ABCBDAB", b: "BDCABA" }).output).toEqual({
      length: 4,
      subsequence: "BCBA",
    });
    expect(runAlgorithm(m, { a: "AGGTAB", b: "GXTXAYB" }).output.length).toBe(4);
  });

  it("knapsack: the lesson's table, best value and greedy counterexample", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const m = getModule("knapsack")!;
    const { trace, output } = runAlgorithm(m, {
      weights: [1, 3, 4, 5],
      values: [1, 4, 5, 7],
      capacity: 7,
    });
    const K = new TracePlayer(trace).finalState().structures.K!;
    expect(K.kind === "grid" && K.cells).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 4, 5, 5, 5, 5],
      [0, 1, 1, 4, 5, 6, 6, 9],
      [0, 1, 1, 4, 5, 7, 8, 9],
    ]);
    expect(output).toEqual({ best: 9, chosen: [1, 2] });
    expect(
      runAlgorithm(m, { weights: [5, 4, 3], values: [10, 7, 6], capacity: 7 }).output.best,
    ).toBe(13);
  });

  it("KMP examples: prefix functions and matches", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const m = getModule("kmp")!;
    expect(runAlgorithm(m, { a: "ababcabcabababd", b: "ababd" }).output).toEqual({
      matches: [10],
      lps: [0, 0, 1, 2, 0],
    });
    expect(runAlgorithm(m, { a: "aabaaab", b: "aabaaab" }).output.lps).toEqual([
      0, 1, 0, 1, 2, 2, 3,
    ]);
    expect(runAlgorithm(m, { a: "abababa", b: "aba" }).output.matches).toEqual([0, 2, 4]);
    expect(runAlgorithm(m, { a: "aaaaab", b: "aaa" }).output.matches).toEqual([0, 1, 2]);
  });

  it("tree lessons: BST example, traversals table, trie counts, segment-tree sums", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    expect(
      runAlgorithm(getModule("bst")!, {
        insert: [50, 30, 70, 20, 40, 60, 80],
        search: [60, 35],
        remove: [20, 30, 50],
      }).output,
    ).toEqual({ inorder: [40, 60, 70, 80], found: [true, false], removed: [true, true, true] });
    expect(
      runAlgorithm(getModule("bst")!, { insert: [1, 2, 3, 4, 5, 6, 7], search: [], remove: [] })
        .trace.meta.counters.comparisons,
    ).toBe(21);
    expect(runAlgorithm(getModule("tree-traversals")!, [1, 2, 3, 4, 5, null, 6]).output).toEqual({
      preorder: [1, 2, 4, 5, 3, 6],
      inorder: [4, 2, 5, 1, 3, 6],
      postorder: [4, 5, 2, 6, 3, 1],
      levelorder: [1, 2, 3, 4, 5, 6],
    });
    expect(
      runAlgorithm(getModule("trie")!, {
        words: ["car", "cart", "care", "cat", "dog"],
        search: ["car", "ca", "dot"],
        prefixes: ["ca", "do", "z"],
      }).output,
    ).toEqual({ found: [true, false, false], prefixFound: [true, true, false], nodes: 10 });
    expect(
      runAlgorithm(getModule("trie")!, {
        words: ["to", "tea", "ten", "in"],
        search: [],
        prefixes: [],
      }).output.nodes,
    ).toBe(8);
    expect(
      runAlgorithm(getModule("segment-tree")!, {
        values: [5, 8, 6, 3, 2, 7, 2, 6],
        ops: [
          { kind: "sum", l: 2, r: 5 },
          { kind: "set", i: 3, value: 10 },
          { kind: "sum", l: 0, r: 7 },
        ],
      }).output.sums,
    ).toEqual([18, 46]);
  });

  it("graph and sequence lessons: every worked-example table matches the traced run", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };
    /** The state just before the first event whose vars match `vars`. */
    const stateBefore = (trace: ReturnType<typeof run>["trace"], vars: Record<string, unknown>) => {
      const at = trace.events.findIndex((e) =>
        Object.entries(vars).every(([k, v]) => e.vars?.[k] === v),
      );
      expect(at).toBeGreaterThan(0);
      return new TracePlayer(trace).stateAt(at);
    };

    // Union-find: parent arrays before and after find(7), and ranks.
    const uf = run("union-find", "rank");
    expect(uf.output).toMatchObject({
      answers: [0],
      parent: [0, 0, 0, 2, 0, 4, 0, 0],
      rank: [3, 0, 1, 0, 2, 0, 1, 0],
    });
    const beforeFind = stateBefore(uf.trace, { op: "find 7" }).structures.P;
    expect(beforeFind?.kind === "array" && beforeFind.values).toEqual([0, 0, 0, 2, 0, 4, 4, 6]);

    // Kruskal and Prim: the same 39-weight tree, in the orders of the two tables.
    expect(run("kruskal", "classic").output).toEqual({
      edges: [
        ["A", "D", 5],
        ["C", "E", 5],
        ["D", "F", 6],
        ["A", "B", 7],
        ["B", "E", 7],
        ["E", "G", 9],
      ],
      total: 39,
    });
    const pr = run("prim", "classic");
    expect(pr.output.edges.map(([a, b]: string[]) => `${a}${b}`)).toEqual([
      "AD",
      "DF",
      "AB",
      "BE",
      "EC",
      "EG",
    ]);
    expect(pr.trace.meta.counters.extractions).toBe(11);

    // Bellman–Ford: the distance table after rounds 1 and 2, and the early stop.
    const bf = run("bellman-ford", "negative");
    const annotations = (round: number) => {
      const g = stateBefore(bf.trace, { round }).structures.G;
      return g?.kind === "graph" ? g.annotations : {};
    };
    expect(annotations(2)).toEqual({ S: "d=0", A: "d=2", B: "d=5", C: "d=2", D: "d=5" });
    expect(annotations(3)).toEqual({ S: "d=0", A: "d=2", B: "d=5", C: "d=0", D: "d=3" });
    expect(bf.output).toMatchObject({ rounds: 3, negativeCycle: false });
    expect(bf.trace.meta.counters.relaxations).toBe(7);

    // Floyd–Warshall: the final matrix.
    expect(run("floyd-warshall", "classic").output.dist).toEqual([
      [0, -1, -2, 0],
      [4, 0, 2, 4],
      [5, 1, 0, 2],
      [3, -1, 1, 0],
    ]);

    // DFS topological sort: the order, and the watch placed first.
    expect(run("topological-sort-dfs", "courses").output.order).toEqual([
      "B",
      "D",
      "A",
      "C",
      "E",
      "F",
    ]);
    expect(run("topological-sort-dfs", "clothes").output.order.indexOf("Wch")).toBe(0);

    // LIS: the subsequence, comparisons and final tails.
    const l = run("lis", "classic");
    expect(l.output).toEqual({ length: 4, indices: [2, 4, 5, 7], sequence: [2, 3, 7, 18] });
    expect(l.trace.meta.counters.comparisons).toBe(10);
    const tails = new TracePlayer(l.trace).finalState().structures.T;
    expect(tails?.kind === "array" && tails.values.slice(0, 4)).toEqual([2, 3, 7, 18]);

    // Fenwick tree: T after the O(n) build, the sums, and T after "add 3 4".
    const fw = run("fenwick-tree", "classic");
    const built = stateBefore(fw.trace, { op: "sum 6" }).structures.T;
    expect(built?.kind === "array" && built.values).toEqual([null, 5, 7, 9, 13, 5, 25, 10, 41]);
    expect(fw.output.sums).toEqual([38, 47]);
    const after = new TracePlayer(fw.trace).finalState().structures.T;
    expect(after?.kind === "array" && [after.values[3], after.values[4], after.values[8]]).toEqual([
      13, 17, 45,
    ]);
    expect(fw.trace.meta.counters["nodes visited"]).toBe(9);
  });

  it("array technique lessons: worked examples and practice answers match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, input: unknown) => runAlgorithm(getModule(id)!, input);

    const prefix = run("prefix-sums", {
      values: [3, 1, 4, 1, 5, 9, 2, 6],
      queries: [
        [2, 5],
        [0, 7],
        [6, 6],
        [3, 6],
      ],
    }).output;
    expect(prefix.prefix).toEqual([0, 3, 4, 8, 9, 14, 23, 25, 31]);
    expect(prefix.sums).toEqual([19, 31, 2, 17]); // 17 is the practice answer

    const window = run("sliding-window", { values: [2, 3, 1, 2, 4, 3], target: 7 });
    expect(window.output).toEqual({ length: 2, start: 4 });
    expect(window.trace.meta.counters.reads).toBe(11);
    expect(run("sliding-window", { values: [1, 2, 3, 4, 5], target: 11 }).output.length).toBe(3);

    const pair = run("two-pointers", { values: [1, 3, 4, 6, 8, 10, 13], target: 13 });
    expect(pair.output).toEqual([1, 5]);
    expect(pair.trace.meta.counters["pair checks"]).toBe(3);

    const stack = run("monotonic-stack", [73, 74, 75, 71, 69, 72, 76, 73]);
    expect(stack.output).toEqual([74, 75, 76, 72, 72, 76, null, null]);
    expect(stack.trace.meta.counters.comparisons).toBe(10);
    expect(run("monotonic-stack", [2, 1, 2, 4, 3]).output[1]).toBe(2);

    const queue = run("monotonic-queue", { values: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 });
    expect(queue.output).toEqual([3, 3, 5, 5, 6, 7]);
    expect(queue.trace.meta.counters.comparisons).toBe(10);
    expect(run("monotonic-queue", { values: [4, 2, 12, 3], k: 2 }).output.at(-1)).toBe(12);

    const sparse = run("sparse-table", {
      values: [5, 2, 4, 7, 6, 3, 1, 2],
      queries: [
        [0, 4],
        [3, 6],
        [2, 3],
      ],
    });
    expect(sparse.output.table).toEqual([
      [5, 2, 4, 7, 6, 3, 1, 2],
      [2, 2, 4, 6, 3, 1, 1, null],
      [2, 2, 3, 1, 1, null, null, null],
      [1, null, null, null, null, null, null, null],
    ]);
    expect(sparse.output.answers).toEqual([2, 1, 4]);
    expect(sparse.trace.meta.counters.comparisons).toBe(16);
  });

  it("connectivity and A* lessons: worked examples and practice answers match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const { graphPreset } = await import("@/algorithms/inputs");
    const preset = (id: string, presetId: string) =>
      getModule(id)!.input.presets.find((p) => p.id === presetId)!.value;
    const directed = {
      directed: true,
      weighted: false,
      limits: { maxNodes: 20, maxEdges: 40 },
      withSource: false,
    };
    const undirected = { ...directed, directed: false };

    const k = runAlgorithm(getModule("kosaraju")!, preset("kosaraju", "classic"));
    expect(k.output.components).toEqual([
      ["G", "H"],
      ["A", "C", "B"],
      ["D", "F", "E"],
    ]);
    const g = new TracePlayer(k.trace).finalState().structures.G;
    const finishes = g?.kind === "graph" ? g.annotations : {};
    expect(["C", "F", "E", "D", "B", "A", "H", "G"].map((v) => finishes[v])).toEqual([
      "f1",
      "f2",
      "f3",
      "f4",
      "f5",
      "f6",
      "f7",
      "f8",
    ]);
    expect(
      runAlgorithm(getModule("kosaraju")!, graphPreset("A->B, B->C, C->A, C->D", "", directed))
        .output.components,
    ).toHaveLength(2);

    expect(
      runAlgorithm(getModule("tarjan-scc")!, preset("tarjan-scc", "classic")).output.components,
    ).toEqual([
      ["F", "E", "D"],
      ["C", "B", "A"],
      ["H", "G"],
    ]);

    const b = runAlgorithm(
      getModule("bridges-articulation")!,
      preset("bridges-articulation", "classic"),
    );
    expect(b.output).toEqual({
      bridges: [
        ["D", "E"],
        ["C", "D"],
      ],
      articulation: ["C", "D", "E"],
    });
    const bg = new TracePlayer(b.trace).finalState().structures.G;
    const lows = bg?.kind === "graph" ? bg.annotations : {};
    expect(["A", "B", "C", "D", "E", "F", "G"].map((v) => lows[v])).toEqual([
      "0/0",
      "1/0",
      "2/0",
      "3/3",
      "4/4",
      "5/4",
      "6/4",
    ]);
    const tree = graphPreset("A-B, B-C, C-D, D-E, E-F, F-G, G-H, H-I", "", undirected);
    expect(runAlgorithm(getModule("bridges-articulation")!, tree).output.bridges).toHaveLength(8);

    const a = runAlgorithm(getModule("a-star")!, preset("a-star", "classic"));
    expect(a.output.length).toBe(11);
    expect(a.output.expanded).toBe(17);
    expect(preset("a-star", "classic").rows.join("").replace(/#/g, "").length).toBe(33);
    expect(runAlgorithm(getModule("a-star")!, preset("a-star", "trap")).output.length).toBe(5);
  });

  it("string lessons: worked examples and practice answers match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };
    const writes = (
      trace: { events: { type: string; s?: string; value?: unknown }[] },
      s: string,
    ) => trace.events.filter((e) => e.type === "array.write" && e.s === s).map((e) => e.value);

    const m = run("manacher", "classic");
    expect(m.output.palindrome).toBe("abacaba");
    expect([1, 3, 5, 7, 9, 11, 13, 15].map((i) => m.output.radii[i])).toEqual([
      1, 3, 1, 7, 1, 3, 1, 1,
    ]);
    expect(m.trace.meta.counters.comparisons).toBe(23);
    const centres = m.trace.events.flatMap((e) =>
      e.vars && "C" in e.vars ? [`${e.vars.C}, ${e.vars.R}`] : [],
    );
    expect(centres).toEqual(["0, 0", "1, 2", "3, 6", "7, 14", "15, 16"]);
    expect(Math.max(...run("manacher", "even").output.radii)).toBe(2);

    const a = run("aho-corasick", "classic");
    expect(a.output.matches).toEqual([
      { word: "she", start: 1 },
      { word: "he", start: 2 },
      { word: "hers", start: 2 },
    ]);
    expect(a.output.fail).toEqual({
      h: "",
      s: "",
      he: "",
      hi: "",
      sh: "h",
      her: "",
      his: "s",
      she: "he",
      hers: "s",
    });
    expect(a.trace.meta.counters["failure steps"]).toBe(1);
    expect(run("aho-corasick", "overlap").output.matches).toHaveLength(9);

    const sa = run("suffix-array", "classic");
    expect(sa.output).toEqual({ sa: [5, 3, 1, 0, 4, 2], rounds: 2 });
    const ranks = writes(sa.trace, "rank");
    expect([ranks.slice(0, 6), ranks.slice(6, 12), ranks.slice(12)]).toEqual([
      [1, 0, 2, 0, 2, 0],
      [2, 1, 3, 1, 3, 0],
      [3, 2, 5, 1, 4, 0],
    ]);
    const grid = new TracePlayer(sa.trace).finalState().structures.R;
    expect(grid?.kind === "grid" ? grid.cells.map((row) => row[2]) : []).toEqual([
      "(0, -1)",
      "(1, 0)",
      "(1, 1)",
      "(2, 3)",
      "(3, -1)",
      "(3, 3)",
    ]);
    expect(run("suffix-array", "repeat").output.rounds).toBe(3);

    const st = run("suffix-tree", "classic");
    expect(st.output).toEqual({ order: [6, 5, 3, 1, 0, 4, 2], nodes: 11, distinct: 15 });
    const tree = new TracePlayer(st.trace).finalState().structures.T;
    const labels = (id: string) =>
      tree?.kind === "tree"
        ? tree.nodes[id]!.children.map((c) => String(tree.nodes[c!]!.value))
        : [];
    expect(labels("root")).toEqual(["$", "a", "banana$", "na"]);
    const inner = tree?.kind === "tree" ? tree.nodes.root!.children : [];
    expect(labels(inner[1]!)).toEqual(["$", "na"]);
    expect(labels(inner[3]!)).toEqual(["$", "na$"]);

    const sam = run("suffix-automaton", "classic");
    expect(sam.output.len).toEqual([0, 1, 2, 3, 4, 1, 5, 2]);
    expect(sam.output.link).toEqual([-1, 0, 5, 7, 5, 0, 7, 0]);
    expect(sam.output.terminal).toEqual([0, 6, 7]);
    expect(sam.output.distinct).toBe(12);
    expect(run("suffix-automaton", "repeat").output.len).toHaveLength(5);
  });

  it("tree and maths lessons: worked examples and practice answers match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };

    const bl = run("binary-lifting", "classic");
    expect(bl.output.lca).toEqual(["B", "E", "A"]);
    expect(["E", "I", "J", "L"].map((v) => bl.output.up[v])).toEqual([
      ["B", "A", "A"],
      ["G", "E", "A"],
      ["I", "G", "B"],
      ["K", "F", "A"],
    ]);
    expect(["D", "F", "G", "H"].map((v) => bl.output.up[v])).toEqual([
      ["B", "A", "A"],
      ["C", "A", "A"],
      ["E", "B", "A"],
      ["E", "B", "A"],
    ]);
    expect(run("binary-lifting", "path").output.up.J).toHaveLength(4);

    const hl = run("heavy-light", "classic");
    expect(hl.output.sums).toEqual([17, 41, 7]);
    expect(hl.output.ranges).toEqual([2, 3, 1]);
    expect(new Set(Object.values(hl.output.head))).toEqual(new Set(["A", "H", "D", "C"]));
    const hs = new TracePlayer(hl.trace).finalState().structures;
    expect(hs.N?.kind === "array" ? hs.N.values : []).toEqual([
      "A",
      "B",
      "E",
      "G",
      "I",
      "J",
      "H",
      "D",
      "C",
      "F",
      "K",
      "L",
    ]);
    expect(hs.B?.kind === "array" ? hs.B.values : []).toEqual([3, 1, 5, 2, 5, 3, 6, 1, 4, 9, 5, 8]);

    const mx = run("matrix-exponentiation", "classic");
    expect(mx.output).toEqual({
      value: 55,
      result: [
        [89, 55],
        [55, 34],
      ],
      multiplications: 5,
    });
    const squares = mx.trace.events
      .filter((e) => e.type === "grid.write" && e.s === "M")
      .map((e) => (e as { value: unknown }).value);
    expect([4, 8, 12].map((i) => squares.slice(i, i + 4))).toEqual([
      [2, 1, 1, 1],
      [5, 3, 3, 2],
      [34, 21, 21, 13],
    ]);
    expect(run("matrix-exponentiation", "power").output.multiplications).toBe(7);

    const small = run("memoization-tabulation", "small");
    expect(small.output).toEqual({
      value: 6,
      calls: 9,
      memoStates: 8,
      tableCells: 12,
      naiveCalls: 11,
    });
    expect(small.trace.meta.counters["memo hits"]).toBe(1);
    const memo = new TracePlayer(small.trace).finalState().structures.memo;
    expect(
      memo?.kind === "grid" ? memo.cells.map((row) => row.map((x) => x ?? ".").join(" ")) : [],
    ).toEqual([". . .", "1 1 .", "1 2 1", ". 3 3", ". . 6"]);
    const classic = run("memoization-tabulation", "classic").output;
    expect([classic.calls, classic.naiveCalls]).toEqual([19, 39]);
  });

  it("number theory lessons: worked examples and practice answers match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };
    type Trace = {
      events: { type: string; s?: string; structure?: unknown; vars?: Record<string, unknown> }[];
    };
    const created = (trace: Trace, name: string) =>
      (
        trace.events.find((e) => e.type === "structure.create" && e.s === name)?.structure as {
          values: unknown[];
        }
      ).values;

    const carmichael = run("miller-rabin", "carmichael");
    expect(carmichael.output.rows).toEqual([[263, 166, 67, 1]]);
    expect(carmichael.output.witness).toBe(2);
    expect(carmichael.trace.events.find((e) => e.vars && "d" in e.vars)?.vars).toMatchObject({
      d: 35,
      s: 4,
    });
    expect(run("miller-rabin", "liar").output).toMatchObject({
      composite: false,
      rows: [[1]],
      certain: false,
    });
    expect(run("miller-rabin", "pseudoprime").output.witness).toBe(11);

    const rho = run("pollard-rho", "classic");
    const rhoGrid = new TracePlayer(rho.trace).finalState().structures.R;
    expect(rhoGrid?.kind === "grid" ? rhoGrid.cells : []).toEqual([
      [5, 26, 21, 1],
      [26, 7474, 7448, 1],
      [677, 871, 194, 97],
    ]);
    const retry = run("pollard-rho", "retry");
    expect(retry.output).toEqual({ factor: 5, c: 2, iterations: 5 });
    const retryGrid = new TracePlayer(retry.trace).finalState().structures.R;
    const firstAttempt =
      retryGrid?.kind === "grid"
        ? retryGrid.cells.filter((_, i) => retryGrid.rowHeaders![i]!.startsWith("c=1"))
        : [];
    expect(firstAttempt.at(-1)?.[3]).toBe(25);

    const sunzi = run("crt", "classic");
    const crtGrid = new TracePlayer(sunzi.trace).finalState().structures.S;
    expect(crtGrid?.kind === "grid" ? crtGrid.cells : []).toEqual([
      [2, 3, 1, 2, 2, 3],
      [3, 5, 1, 2, 8, 15],
      [2, 7, 1, 1, 23, 105],
    ]);
    expect(run("crt", "shared").output).toEqual({ x: 23, M: 30 });
    expect(run("crt", "none").output.x).toBeNull();

    const exact = run("ntt", "classic");
    const ns = new TracePlayer(exact.trace).finalState().structures;
    expect(ns.A?.kind === "array" ? ns.A.values : []).toEqual([6, 825076915, 2, 173167434]);
    expect(ns.B?.kind === "array" ? ns.B.values : []).toEqual([9, 565325767, 998244352, 432918594]);
    expect(created(exact.trace, "C")).toEqual([54, 173167418, 998244351, 825076899]);
    expect(exact.output.product).toEqual([4, 13, 22, 15]);
    const degree5 = runAlgorithm(getModule("ntt")!, {
      a: [1, 1, 1, 1, 1, 1],
      b: [1, 1, 1, 1, 1, 1],
    });
    expect(degree5.output.N).toBe(16);

    const approx = run("fft", "classic");
    const fs = new TracePlayer(approx.trace).finalState().structures;
    expect(fs.A?.kind === "array" ? fs.A.values : []).toEqual(["6", "−2−2i", "2", "−2+2i"]);
    expect(fs.B?.kind === "array" ? fs.B.values : []).toEqual(["9", "4−5i", "−1", "4+5i"]);
    expect(created(approx.trace, "C")).toEqual(["54", "−18+2i", "−2", "−18−2i"]);
    expect(approx.output.maxError).toBeLessThan(1e-15);
    expect(run("ntt", "full").trace.meta.counters.butterflies).toBe(3 * 12);
  });

  it("flow and matching lessons: worked examples and practice answers match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };
    const notes = (trace: { events: { note?: string }[] }) =>
      trace.events.flatMap((e) => (e.note ? [e.note] : []));

    const d = run("dinic", "classic");
    expect(d.output.maxFlow).toBe(23);
    expect(d.output.cut).toEqual(["A", "B", "D", "S"]);
    expect(d.trace.meta.counters.phases).toBe(2);
    expect(notes(d.trace).filter((n) => n.startsWith("Augment"))).toEqual([
      "Augment 12 along S → A → C → T.",
      "Augment 4 along S → B → D → T.",
      "Augment 7 along S → B → D → C → T.",
    ]);
    expect(
      notes(d.trace)
        .filter((n) => n.startsWith("Phase"))
        .map((n) => n.slice(0, 26)),
    ).toEqual(["Phase 1: t is at level 3. ", "Phase 2: t is at level 4. "]);

    const pr = run("push-relabel", "undo");
    expect(pr.output.maxFlow).toBe(2);
    expect(notes(pr.trace).filter((n) => n.startsWith("Push"))).toEqual([
      "Push 1 from S to A.",
      "Push 1 from S to B.",
      "Push 1 from A to B.",
      "Push 1 from B to T.",
      "Push 1 from B to A (cancelling flow on the edge back).",
      "Push 1 from A to T.",
    ]);
    const relabels = pr.trace.events.filter(
      (e) =>
        e.type === "graph.annotate" &&
        (e as { note?: string }).note?.startsWith("No edge goes downhill"),
    );
    expect(
      relabels.map(
        (e) => (e as { node: string; text: string }).node + (e as { text: string }).text,
      ),
    ).toEqual(["Ah1 e1", "Bh1 e2", "Bh2 e1"]);
    expect(run("push-relabel", "classic").output.maxFlow).toBe(23);

    const hk = run("hopcroft-karp", "classic");
    expect(hk.output).toEqual({
      size: 5,
      matching: [
        ["A", "2"],
        ["B", "1"],
        ["C", "3"],
        ["D", "4"],
        ["E", "5"],
      ],
      phases: 2,
    });
    expect(notes(hk.trace).filter((n) => n.startsWith("Augmenting path"))).toEqual([
      "Augmenting path from A: A–1 (with the matched edges between them).",
      "Augmenting path from C: C–2 (with the matched edges between them).",
      "Augmenting path from D: D–3 (with the matched edges between them).",
      "Augmenting path from E: E–4 (with the matched edges between them).",
      "Augmenting path from B: B–1, A–2, C–3, D–4, E–5 (with the matched edges between them).",
    ]);
  });

  it("bitmask, digit and convex-hull DP lessons: worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };
    const rows = (trace: ConstructorParameters<typeof TracePlayer>[0], name: string) => {
      const g = new TracePlayer(trace).finalState().structures[name];
      return g?.kind === "grid"
        ? Object.fromEntries(g.rowHeaders!.map((h, i) => [h, g.cells[i]]))
        : {};
    };

    const tsp = run("held-karp", "classic");
    expect(tsp.output).toEqual({ cost: 21, tour: [0, 2, 3, 1, 0] });
    const t = rows(tsp.trace, "dp");
    expect(t["{A,B,C}"]).toEqual([null, 16, 8, null]);
    expect(t["{A,B,D}"]).toEqual([null, 13, null, 6]);
    expect(t["{A,C,D}"]).toEqual([null, null, 22, 17]);
    expect(t["{A,B,C,D}"]).toEqual([null, 20, 18, 16]);
    expect(Object.keys(t)).toHaveLength(8);

    const asg = run("assignment-dp", "classic");
    expect(asg.output).toEqual({ cost: 13, job: [1, 0, 2, 3] });
    const a = rows(asg.trace, "dp");
    expect([a["{2}"], a["{1,2}"], a["{1,2,3}"], a["{1,2,3,4}"]]).toEqual([
      [2, 2],
      [8, 1],
      [9, 3],
      [13, 4],
    ]);
    expect(asg.trace.meta.counters.transitions).toBe(32);
    expect(run("assignment-dp", "greedy").output.cost).toBe(5);

    const dd = run("digit-dp", "classic");
    expect(dd.output.count).toBe(33);
    const m = rows(dd.trace, "memo");
    expect(m["pos 1"]!.slice(8)).toEqual([9, 10, 9]);
    expect(m["pos 2"]).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]);
    expect(run("digit-dp", "round").output.count).toBe(10);

    const cht = run("convex-hull-trick", "classic");
    expect(cht.output).toEqual({ dp: [0, 7, 10, 15, 20], popsFront: 1, popsBack: 1 });
    const notes = cht.trace.events.flatMap((e) => (e.note ? [e.note] : []));
    expect(notes.filter((n) => n.startsWith("Jump from stone")).map((n) => n.slice(0, 17))).toEqual(
      ["Jump from stone 0", "Jump from stone 0", "Jump from stone 0", "Jump from stone 2"],
    );
    expect(notes.some((n) => n.startsWith("Line 1 lies above the envelope of lines 0 and 2"))).toBe(
      true,
    );
  });

  it("geometry lessons: worked examples and practice answers match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };
    const notes = (trace: { events: { note?: string }[] }) =>
      trace.events.flatMap((e) => (e.note ? [e.note] : []));

    const hull = run("graham-scan", "classic");
    expect(hull.output).toEqual({ hull: [0, 1, 3, 4, 5], popped: 6 });
    expect(hull.trace.meta.counters["orientation tests"]).toBe(14);
    const pushes = hull.trace.events.flatMap((e) => (e.type === "seq.push" ? [e.value] : []));
    expect(pushes).toEqual([0, 2, 1, 7, 3, 9, 10, 6, 4, 8, 5]);
    const turns = hull.trace.events.flatMap((e) =>
      e.type === "step" && e.vars?.["cross product"] !== undefined ? [e.vars["cross product"]] : [],
    );
    expect(turns).toEqual([0, 24, -16, 40, 12, 14, -4, 8, -16, -4, 28, 24, -9, 28]);
    expect(run("graham-scan", "grid").output.hull).toHaveLength(4);

    const cp = run("closest-pair", "classic");
    expect(cp.output).toMatchObject({ pair: [2, 7], d2: 5 });
    expect(cp.trace.meta.counters["distance computations"]).toBe(23);
    const halves = notes(cp.trace).filter((n) => n.startsWith("Best inside the halves"));
    expect(halves).toEqual([
      "Best inside the halves: √117 ≈ 10.82. A closer pair must straddle x = 12.",
      "Best inside the halves: √185 ≈ 13.60. A closer pair must straddle x = 31.",
      "Best inside the halves: √98 ≈ 9.90. A closer pair must straddle x = 21.",
    ]);
    const strips = notes(cp.trace).filter((n) => n.includes("of the split line"));
    expect(strips.map((n) => n.split(" ")[0])).toEqual(["6", "6", "6"]);
    const pts = getModule("closest-pair")!.input.presets[0]!.value as { x: number; y: number }[];
    expect((pts.length * (pts.length - 1)) / 2).toBe(66);

    const kd = run("kd-tree", "classic");
    expect(kd.output).toEqual({ nearest: 4, d2: 2, visited: 3, height: 3 });
    const kdNotes = notes(kd.trace);
    expect(kdNotes.filter((n) => n.includes("nearest so far")).map((n) => n.slice(0, 1))).toEqual([
      "F",
      "E",
    ]);
    expect(kdNotes.some((n) => n.startsWith("Skip the subtree under B"))).toBe(true);
    expect(run("kd-tree", "prune").output).toMatchObject({ visited: 5, height: 4 });
    // The lesson's worst case: points around a circle centred on q are all measured.
    const circle = [
      [5, 0],
      [-5, 0],
      [0, 5],
      [0, -5],
      [3, 4],
      [-3, 4],
      [3, -4],
      [-3, -4],
      [4, 3],
      [-4, 3],
      [4, -3],
      [-4, -3],
    ].map(([x, y]) => ({ x: x! + 10, y: y! + 10 }));
    const ring = runAlgorithm(getModule("kd-tree")!, { points: circle, q: { x: 10, y: 10 } });
    expect(ring.output.visited).toBe(12);
  });

  it("randomized, search and optimisation lessons: worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };

    const qs = run("quickselect", "classic");
    expect(qs.output).toEqual({ value: 5, rounds: 6 });
    expect(qs.trace.meta.counters.comparisons).toBe(33);
    const pivots = qs.trace.events.flatMap((e) =>
      e.note?.startsWith("Round") ? [e.note.split("= ")[1]] : [],
    );
    expect(pivots).toEqual(["8.", "7.", "1.", "2.", "4.", "5."]);
    expect(run("quickselect", "duplicates").output.rounds).toBe(1);

    expect(run("mcts", "classic").output).toMatchObject({
      move: 3,
      visits: [11, 7, 22],
      wins: [5, 2, 16],
    });
    expect(run("mcts", "unlucky").output).toMatchObject({
      move: 1,
      visits: [19, 5, 16],
      wins: [15, 1, 12],
    });
    expect(run("mcts", "longer").output).toMatchObject({ move: 3, visits: [34, 9, 107] });
    expect(run("mcts", "losing").output.move).toBeGreaterThan(0);

    const gd = run("gradient-descent", "classic");
    expect(gd.output.path.slice(0, 5)).toEqual([
      [-6, 5],
      [-2, 3],
      [0, 2],
      [1, 1.5],
      [1.5, 1.25],
    ]);
    expect(gd.output.f.slice(0, 5)).toEqual([80, 20, 5, 1.25, 0.3125]);
    expect(
      run("gradient-descent", "zigzag").output.factors.map((f: number) => Number(f.toFixed(2))),
    ).toEqual([-0.8, 0.82]);
    expect(run("gradient-descent", "diverge").output.factors[0]).toBeCloseTo(-1.2, 12);
    expect(run("gradient-descent", "slow").output.factors[0]).toBeCloseTo(0.96, 12);
  });

  it("distributed lessons: worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };
    const notes = (trace: { events: { note?: string }[] }) =>
      trace.events.flatMap((e) => (e.note ? [e.note] : []));

    const mr = run("mapreduce", "classic");
    expect(mr.output.counts).toEqual([
      ["a", 2],
      ["and", 1],
      ["cat", 2],
      ["dog", 2],
      ["mat", 1],
      ["on", 1],
      ["sat", 2],
      ["the", 3],
    ]);
    expect(mr.output.shuffled).toBe(14);
    const G = new TracePlayer(mr.trace).finalState().structures.G;
    expect(G?.kind === "grid" && G.cells).toEqual([
      [3, 3],
      [2, 1],
      [2, 3],
    ]);
    expect(
      Object.entries(mr.output.reducerOf)
        .filter(([, r]) => r === 0)
        .map(([w]) => w)
        .sort(),
    ).toEqual(["cat", "dog", "mat", "sat"]);
    expect(run("mapreduce", "combiner").output.shuffled).toBe(12);
    expect(run("mapreduce", "failure").output.reassigned).toBe(1);

    const px = run("paxos", "duel").output;
    expect(px.chosen).toBe("Y");
    expect(
      px.accepts.map((a: { acceptor: number; ballot: number; value: string; time: number }) => [
        a.acceptor + 1,
        a.ballot,
        a.value,
        a.time,
      ]),
    ).toEqual([
      [3, 3, "X", 4],
      [1, 4, "Y", 9],
      [3, 4, "Y", 9],
      [2, 4, "Y", 10],
      [2, 7, "Y", 15],
      [1, 7, "Y", 17],
      [3, 7, "Y", 17],
    ]);
    expect(
      px.decisions.map((d: { proposer: number; time: number }) => [d.proposer + 1, d.time]),
    ).toEqual([
      [2, 11],
      [1, 19],
    ]);

    const leaders = (id: string) =>
      run("raft", id).output.leaders.map((l: { term: number; server: number; time: number }) => [
        l.term,
        l.server + 1,
        l.time,
      ]);
    const classic = run("raft", "classic");
    expect(leaders("classic")).toEqual([[1, 2, 16]]);
    expect(Math.max(...classic.output.commits.map((c: { time: number }) => c.time))).toBe(47);
    expect(classic.output.logs.every((l: string[]) => l.join() === "1:x=1,1:y=2")).toBe(true);
    expect(leaders("failover")).toEqual([
      [1, 3, 20],
      [2, 1, 59],
    ]);
    expect(
      run("raft", "failover").output.logs.every((l: string[]) => l.join() === "1:x=1,2:y=2"),
    ).toBe(true);
    const over = run("raft", "overwrite");
    expect(leaders("overwrite")).toEqual([
      [1, 3, 16],
      [2, 2, 59],
      [3, 1, 60],
    ]);
    expect(over.output.logs[0].join()).toBe("1:c1,1:c2,1:c3,3:c5");
    expect(notes(over.trace)).toContain(
      "S1 commits up to entry 4: a majority (2 of 3) store it (3 entries at once).",
    );
    const fig8 = run("raft", "figure8");
    expect(leaders("figure8")).toEqual([
      [1, 2, 15],
      [3, 3, 46],
      [4, 2, 53],
      [6, 3, 94],
    ]);
    expect(fig8.output.leaders[2].log).toEqual(["1:c1", "1:c2"]);
    expect(fig8.output.logs.every((l: string[]) => l.join() === "3:c3,3:c4")).toBe(true);
    expect(fig8.output.commitIndex).toEqual([0, 0, 0]);

    const noop = run("raft", "figure8-noop");
    expect(leaders("figure8-noop")).toEqual([
      [1, 2, 15],
      [4, 2, 53],
      [6, 3, 95],
    ]);
    const all = "1:no-op,1:c1,1:c2,4:no-op,4:c3,4:c4,6:no-op";
    expect(noop.output.logs.every((l: string[]) => l.join() === all)).toBe(true);
    expect(noop.output.commitIndex).toEqual([7, 7, 7]);
    expect(
      noop.output.commits
        .filter((c: { server: number; time: number }) => c.server === 1 && c.time === 62)
        .map((c: { index: number }) => c.index),
    ).toEqual([2, 3, 4, 5, 6]);

    const cut = run("raft", "partition");
    expect(leaders("partition")).toEqual([
      [1, 2, 15],
      [2, 5, 46],
    ]);
    expect(cut.output.logs.every((l: string[]) => l.join() === "1:x=1,2:z=3")).toBe(true);
    const cutNotes = notes(cut.trace);
    expect(cutNotes).toContain(
      "The client sends y=2 to the leader S2, which appends it at index 2 in term 1.",
    );
    expect(cutNotes).toContain("S5 commits up to entry 2: a majority (3 of 5) store it.");
    expect(cut.output.commits.filter((c: { entry: string }) => c.entry === "1:y=2")).toEqual([]);
  });

  it("sorting and number-theory lessons (batch O): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { TracePlayer } = await import("@/engine/player");
    type Ev = { type: string; line?: number; note?: string; s?: string };
    const run = (id: string, value: unknown) => runAlgorithm(getModule(id)!, value);
    const preset = (id: string, presetId: string) =>
      getModule(id)!.input.presets.find((p) => p.id === presetId)!.value;
    const inv = (a: number[]) =>
      a.reduce((n, x, i) => n + a.slice(i + 1).filter((y) => y < x).length, 0);
    const arrayAt = (trace: { events: Ev[] }, at: number, name: string) => {
      const st = new TracePlayer(trace as never).stateAt(at).structures[name]!;
      if (st.kind !== "array") throw new Error(`${name} is not an array`);
      return st.values;
    };

    // Shell sort
    const shellIn = preset("shell-sort", "classic") as number[];
    const shell = run("shell-sort", shellIn);
    expect(shell.trace.meta.counters.shifts).toBe(25);
    expect(shell.trace.meta.counters.comparisons).toBe(43);
    expect(inv(shellIn)).toBe(55);
    const events = shell.trace.events as Ev[];
    const firstPassEnd = events.findIndex((e) => e.type === "step" && e.line === 9);
    const before = events.slice(0, firstPassEnd);
    expect(before.filter((e) => e.type === "array.write" && e.line === 7).length).toBe(12);
    expect(before.filter((e) => e.type === "array.compare").length).toBe(18);
    expect(events.filter((e) => e.type === "array.compare").length).toBe(43);
    expect(arrayAt(shell.trace, firstPassEnd + 1, "A")).toEqual([
      7, 4, 18, 28, 30, 17, 25, 53, 47, 69, 95, 86, 62, 83,
    ]);
    const shellRev = run("shell-sort", preset("shell-sort", "reversed"));
    expect(shellRev.trace.meta.counters.shifts).toBe(132);
    expect(inv(preset("shell-sort", "reversed") as number[])).toBe(780);

    // Counting sort
    const cs = run("counting-sort", preset("counting-sort", "classic"));
    const csEvents = cs.trace.events as Ev[];
    const totalsStart = csEvents.findIndex((e) => e.line === 4);
    const placeStart = csEvents.findIndex((e) => e.line === 5);
    expect(arrayAt(cs.trace, totalsStart, "C")).toEqual([2, 0, 2, 3, 0, 1]);
    expect(arrayAt(cs.trace, placeStart, "C")).toEqual([2, 2, 4, 7, 7, 8]);
    expect(cs.output).toEqual([0, 0, 2, 2, 3, 3, 3, 5]);
    expect(cs.trace.meta.counters.writes).toBe(29);

    // Radix sort: the array after each pass
    const passes = (id: string) => {
      const r = run("radix-sort", preset("radix-sort", id));
      const ev = r.trace.events as Ev[];
      const ends = ev.flatMap((e, i) =>
        e.type === "array.write" && e.s === "A" && e.note?.startsWith("A is now sorted")
          ? [i + 1]
          : [],
      );
      return { r, states: ends.map((i) => arrayAt(r.trace, i, "A")) };
    };
    const rc = passes("classic");
    expect(rc.states).toEqual([
      [720, 355, 436, 457, 657, 329, 839],
      [720, 329, 436, 839, 355, 457, 657],
      [329, 355, 436, 457, 657, 720, 839],
    ]);
    expect(rc.r.trace.meta.counters.writes).toBe(141);
    expect(passes("mixed").states.slice(0, 2)).toEqual([
      [170, 90, 802, 2, 24, 45, 75, 66],
      [802, 2, 24, 45, 66, 170, 75, 90],
    ]);

    // Sieve
    const s30 = run("sieve", 30);
    expect(s30.output.primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(s30.output.crossings).toBe(24);
    expect(
      (s30.trace.events as Ev[]).filter((e) => e.note?.includes("already crossed")).length,
    ).toBe(5);
    const s100 = run("sieve", 100);
    expect([s100.output.primes.length, s100.output.crossings]).toEqual([25, 104]);
    const s120 = run("sieve", 120);
    const sieving = (s120.trace.events as Ev[]).filter(
      (e) => e.line === 4 && e.note?.includes("is prime"),
    );
    expect(sieving.at(-1)!.note).toMatch(/^7 is still a candidate/);

    // Extended Euclid
    const e1 = run("euclid", { a: 240, b: 46 });
    const table = new TracePlayer(e1.trace).stateAt(e1.trace.events.length).structures.E!;
    if (table.kind !== "grid") throw new Error("E is not a grid");
    expect(table.cells).toEqual([
      [null, 240, 1, 0],
      [null, 46, 0, 1],
      [5, 10, 1, -5],
      [4, 6, -4, 21],
      [1, 4, 5, -26],
      [1, 2, -9, 47],
      [2, 0, 23, -120],
    ]);
    expect(e1.output).toEqual({ gcd: 2, x: -9, y: 47, divisions: 5 });
    const inverse = run("euclid", { a: 3120, b: 17 }).output;
    expect([inverse.x, inverse.y, ((inverse.y % 3120) + 3120) % 3120]).toEqual([2, -367, 2753]);
    expect(run("euclid", { a: 252, b: 105 }).output.gcd).toBe(21);
    expect(
      [
        [89, 55],
        [99, 98],
        [96, 64],
        [97, 2],
      ].map(([a, b]) => run("euclid", { a, b }).output.divisions),
    ).toEqual([9, 2, 2, 2]);
  });
  it("hash-function lessons (batch Q): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { ringShares, ringPosition } = await import("@/algorithms/hashing/consistent-hashing");
    const { hash32 } = await import("@/algorithms/hashing/placement");
    const { score } = await import("@/algorithms/hashing/rendezvous-hashing");
    const run = (id: string, presetId: string) => {
      const m = getModule(id)!;
      return runAlgorithm(m, m.input.presets.find((p) => p.id === presetId)!.value);
    };

    // Rabin–Karp
    const rk = run("rabin-karp", "classic");
    expect(rk.output.windowHashes).toEqual([8, 9, 3, 11, 0, 1, 7, 8, 4, 5, 10, 11, 7, 9, 11]);
    expect([rk.output.patternHash, rk.output.matches, rk.output.spurious]).toEqual([7, [6], [12]]);
    expect([rk.trace.meta.counters.comparisons, rk.trace.meta.counters.rolls]).toEqual([6, 14]);
    const small = run("rabin-karp", "small-q").output;
    expect([small.matches.length, small.spurious.length]).toEqual([0, 7]);
    expect(run("rabin-karp", "letters").output.matches).toEqual([0, 7]);

    // Consistent hashing
    expect(["A", "B", "C", "D", "date"].map(ringPosition)).toEqual([316, 58, 270, 142, 133]);
    const ch = run("consistent-hashing", "classic").output;
    const count = (o: Record<string, string>, s: string) =>
      Object.values(o).filter((x) => x === s).length;
    expect(["A", "B", "C"].map((s) => count(ch.before, s))).toEqual([2, 1, 5]);
    expect([ch.moved, count(ch.after!, "C")]).toEqual([["date"], 4]);
    expect(run("consistent-hashing", "remove").output.moved).toEqual([
      "apple",
      "fig",
      "kiwi",
      "pear",
    ]);
    const pct = (x: Record<string, number>) =>
      Object.values(x).map((d) => Math.round((d / 360) * 100));
    expect(pct(ringShares(["A", "B", "C"], 1))).toEqual([13, 28, 59]);
    expect(pct(ringShares(["A", "B", "C"], 3))[2]).toBe(3);
    // Shares on a full 32-bit ring, by number of positions per server.
    const shares32 = (v: number) => {
      const all = ["A", "B", "C"]
        .flatMap((s) =>
          Array.from({ length: v }, (_, i) => ({ s, d: hash32(i === 0 ? s : `${s}#${i}`) })),
        )
        .sort((a, b) => a.d - b.d);
      const sh: Record<string, number> = { A: 0, B: 0, C: 0 };
      all.forEach((p, i) => {
        const prev = all[(i - 1 + all.length) % all.length]!;
        sh[p.s]! += (p.d - prev.d + 2 ** 32) % 2 ** 32;
      });
      return Object.values(sh).map((x) => Math.round((x / 2 ** 32) * 100));
    };
    expect([shares32(1), shares32(100), shares32(1000)]).toEqual([
      [56, 26, 18],
      [37, 31, 32],
      [33, 34, 33],
    ]);

    // Rendezvous hashing
    expect(["A", "B", "C", "D"].map((s) => score("kiwi", s))).toEqual([636, 266, 803, 302]);
    expect(["A", "B", "C", "D"].map((s) => score("lime", s))).toEqual([14, 359, 545, 616]);
    expect(run("rendezvous-hashing", "classic").output.moved).toEqual(["kiwi"]);
    expect(run("rendezvous-hashing", "add").output.moved).toEqual(["lime"]);

    // Zobrist hashing
    const z = run("zobrist-hashing", "classic").output;
    const hex = (h: number[]) => h.map((x) => x.toString(16).padStart(4, "0"));
    expect(z.hashes.map(hex)).toEqual([
      ["8da7", "827a", "c968"],
      ["4b12", "44cf", "c968"],
      ["8da7", "0542", "0642"],
    ]);
    expect(z.repeats.map((r: { sameBoard: boolean }) => r.sameBoard)).toEqual([true, true]);
  });

  it("linked-list lessons (batch R): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, value: unknown) => runAlgorithm(getModule(id)!, value).output as never;
    type Rev = { values: number[]; pointerWrites: number };
    const r1: Rev = run("reverse-linked-list", { values: [1, 2, 3, 4, 5], k: 5 });
    const r2: Rev = run("reverse-linked-list", { values: [1, 2, 3, 4, 5], k: 2 });
    const r3: Rev = run("reverse-linked-list", { values: [10, 20, 30, 40, 50, 60, 70, 80], k: 3 });
    expect([r1.values, r1.pointerWrites]).toEqual([[5, 4, 3, 2, 1], 6]);
    expect([r2.values, r2.pointerWrites]).toEqual([[2, 1, 4, 3, 5], 6]);
    expect([r3.values, r3.pointerWrites]).toEqual([[30, 20, 10, 60, 50, 40, 70, 80], 8]);
    expect(
      (run("reverse-linked-list", { values: [1, 2, 3, 4, 5, 6, 7], k: 3 }) as Rev).values,
    ).toEqual([3, 2, 1, 6, 5, 4, 7]);
    expect(
      (run("reverse-linked-list", { values: [1, 2, 3, 4, 5, 6, 7, 8, 9], k: 4 }) as Rev)
        .pointerWrites,
    ).toBe(10);

    type Cyc = { meet: number; start: number; slowSteps: number };
    const c1: Cyc = run("floyd-cycle", { values: [3, 1, 4, 1, 5, 9, 2, 6], pos: 2 });
    expect([c1.slowSteps, c1.meet, c1.start]).toEqual([6, 6, 2]);
    const c2: Cyc = run("floyd-cycle", { values: [1, 2, 3, 4, 5], pos: 0 });
    expect([c2.slowSteps, c2.meet]).toEqual([5, 0]);
    expect((run("floyd-cycle", { values: [1, 2, 3, 4, 5, 6], pos: -1 }) as Cyc).slowSteps).toBe(2);
    expect((run("floyd-cycle", { values: [1, 2, 3, 4, 5, 6, 7], pos: 4 }) as Cyc).slowSteps).toBe(
      6,
    );

    const m1 = runAlgorithm(getModule("merge-sorted-lists")!, {
      lists: [
        [1, 2, 4],
        [1, 3, 4],
      ],
    });
    const m2 = runAlgorithm(getModule("merge-sorted-lists")!, {
      lists: [
        [1, 4, 5],
        [1, 3, 4],
        [2, 6],
      ],
    });
    expect([
      (m1.output as { values: number[] }).values,
      m1.trace.meta.counters.comparisons,
    ]).toEqual([[1, 1, 2, 3, 4, 4], 5]);
    expect(m2.trace.meta.counters.comparisons).toBe(13);
    const m3 = runAlgorithm(getModule("merge-sorted-lists")!, {
      lists: [
        [1, 2, 3, 4],
        [5, 6, 7, 8, 9],
      ],
    });
    expect(m3.trace.meta.counters.comparisons).toBeLessThanOrEqual(8);

    type TP = { values: number[]; palindrome: boolean | null };
    const tp = (values: number[], op: unknown) =>
      runAlgorithm(getModule("list-two-pointers")!, { values, op });
    const pal = tp([1, 2, 3, 2, 1], { kind: "palindrome" });
    expect([(pal.output as TP).palindrome, pal.trace.meta.counters.comparisons]).toEqual([true, 2]);
    expect((tp([1, 2, 3, 3, 1], { kind: "palindrome" }).output as TP).palindrome).toBe(false);
    const rem = tp([1, 2, 3, 4, 5], { kind: "remove", n: 2 });
    expect([(rem.output as TP).values, rem.trace.meta.counters.moves]).toEqual([[1, 2, 3, 5], 8]);
    expect((tp([1, 2, 3, 4, 5], { kind: "rotate", k: 7 }).output as TP).values).toEqual([
      4, 5, 1, 2, 3,
    ]);
    expect((tp([1, 2, 3, 4, 5], { kind: "rotate", k: 12 }).output as TP).values).toEqual([
      4, 5, 1, 2, 3,
    ]);
    expect((tp([10, 20, 30, 40, 50], { kind: "remove", n: 3 }).output as TP).values).toEqual([
      10, 20, 40, 50,
    ]);

    const cr = runAlgorithm(getModule("copy-random-list")!, {
      values: [7, 13, 11, 10, 1],
      random: [null, 0, 4, 2, 0],
    });
    expect((cr.output as { random: unknown[] }).random).toEqual([null, 0, 4, 2, 0]);
    expect(cr.trace.meta.counters.copies).toBe(5);
  });

  it("range query lessons (batch AJ): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, value: unknown) => runAlgorithm(getModule(id)!, value);
    const lazy = run("lazy-segment-tree", {
      values: [5, 8, 6, 3, 2, 7, 2, 6],
      ops: [
        { kind: "add", l: 2, r: 6, d: 3 },
        { kind: "sum", l: 0, r: 3 },
        { kind: "add", l: 0, r: 7, d: -1 },
        { kind: "sum", l: 4, r: 5 },
      ],
    });
    expect(lazy.output).toEqual({ sums: [28, 13], total: 46 });
    expect(lazy.trace.meta.counters).toMatchObject({ pushes: 2, "nodes visited": 18 });
    const sq = run("sqrt-decomposition", {
      values: [5, 8, 6, 3, 2, 7, 2, 6],
      ops: [
        { kind: "sum", l: 2, r: 5 },
        { kind: "set", i: 3, value: 10 },
        { kind: "sum", l: 0, r: 7 },
      ],
    });
    expect([sq.output.sums, sq.trace.meta.counters.reads]).toEqual([[18, 46], 15]);
    const value = {
      values: [1, 2, 1, 3, 2, 2, 4, 1, 3],
      queries: [
        [0, 4],
        [6, 8],
        [1, 3],
        [2, 7],
        [4, 5],
      ],
    };
    const mo = run("mo-algorithm", value);
    expect(mo.output).toEqual({ answers: [3, 3, 3, 4, 1], order: [2, 0, 3, 4, 1] });
    expect(mo.trace.meta.counters.moves).toBe(21);
    expect(run("offline-distinct-queries", value).output).toEqual({
      answers: [3, 3, 3, 4, 1],
      order: [2, 0, 4, 3, 1],
    });
  });

  it("array technique lessons (batch AI): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, value: unknown) => runAlgorithm(getModule(id)!, value);
    const diff = run("difference-array", {
      values: [3, 1, 4, 1, 5, 9, 2, 6],
      updates: [
        [1, 4, 5],
        [3, 7, -2],
        [0, 2, 10],
      ],
    });
    expect(diff.output).toEqual([13, 16, 19, 4, 8, 7, 0, 4]);
    expect(
      run("difference-array", {
        values: [0, 0, 0, 0, 0, 0],
        updates: [
          [0, 3, 1],
          [2, 5, 1],
          [1, 2, 1],
        ],
      }).output,
    ).toEqual([1, 2, 3, 2, 1, 1]);
    expect(run("kadane", [-2, 1, -3, 4, -1, 2, 1, -5, 4]).output).toEqual({
      sum: 6,
      start: 3,
      end: 6,
    });
    expect(run("kadane", [-8, -3, -6, -2, -5, -4]).output).toMatchObject({ sum: -2 });
    const flag = run("dutch-national-flag", [2, 0, 2, 1, 1, 0, 1, 2, 0]);
    expect(flag.trace.meta.counters).toMatchObject({ steps: 9, swaps: 4 });
    expect(flag.trace.events.at(-1)?.vars).toMatchObject({ lo: 3, mid: 6, hi: 5 });
    expect(run("boyer-moore-majority", [2, 2, 1, 1, 1, 2, 2]).output).toBe(2);
    const none = run("boyer-moore-majority", [3, 1, 3, 2, 1, 2]);
    expect([none.output, none.trace.events.at(-1)?.vars?.candidate]).toEqual([null, 1]);
    const fy = run("fisher-yates", { values: [1, 2, 3, 4, 5, 6], seed: 7 });
    expect([fy.output, fy.trace.meta.counters.swaps]).toEqual([[5, 2, 3, 4, 6, 1], 2]);
    const rs = run("reservoir-sampling", {
      values: [11, 22, 33, 44, 55, 66, 77, 88, 99, 9],
      k: 3,
      seed: 7,
    });
    expect(rs.output).toEqual({ sample: [55, 22, 33], positions: [4, 1, 2] });
    expect(rs.trace.meta.counters.replacements).toBe(2);
    const dup = run("floyd-find-duplicate", [1, 3, 4, 2, 2]);
    expect([dup.output, dup.trace.meta.counters.moves]).toEqual([2, 18]);
    const px = run("prefix-xor", {
      values: [5, 3, 12, 9, 6, 7, 1, 14],
      queries: [
        [1, 4],
        [0, 7],
        [2, 3],
      ],
    });
    expect(px.output).toEqual({ prefix: [0, 5, 6, 10, 3, 5, 2, 3, 13], xors: [0, 13, 5] });
  });

  it("block, bead, sleep and bogo sort lessons (batch AH): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, value: unknown) => runAlgorithm(getModule(id)!, value);
    const block = run("block-sort", [2, 5, 7, 11, 13, 1, 3, 6, 8, 12]);
    expect(block.trace.meta.counters).toMatchObject({ rotations: 5, comparisons: 29 });
    expect(run("bead-sort", [3, 1, 4, 1, 5]).output).toEqual([1, 1, 3, 4, 5]);
    const sleep = run("sleep-sort", [20, 5, 12, 0, 8]);
    expect([sleep.output, sleep.trace.events.at(-1)?.vars?.time]).toEqual([[0, 5, 8, 12, 20], 20]);
    expect(
      run("bogo-sort", { values: [3, 1, 4, 2], seed: 7 }).trace.events.at(-1)?.vars?.shuffles,
    ).toBe(3);
    expect(
      run("bogo-sort", { values: [1, 2, 3], seed: 1 }).trace.events.at(-1)?.vars?.shuffles,
    ).toBe(0);
  });

  it("specialized sorting lessons (batch AG): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const c = (id: string, value: number[]) => {
      const r = runAlgorithm(getModule(id)!, value);
      return { ...r.trace.meta.counters, ...(r.trace.events.at(-1)?.vars ?? {}) } as Record<
        string,
        number
      >;
    };
    expect(c("tim-sort", [1, 3, 5, 7, 9, 8, 6, 4, 2, 0, 10, 11, 12, 13])).toMatchObject({
      merges: 2,
      comparisons: 32,
    });
    expect(c("tim-sort", [1, 2, 3, 4, 5, 6, 7, 8])).toMatchObject({ comparisons: 7 });
    expect(c("tim-sort", [9, 8, 7, 6, 5, 4, 3, 2]).merges ?? 0).toBe(0);
    const up16 = Array.from({ length: 16 }, (_, i) => i + 1);
    expect(c("intro-sort", up16)).toMatchObject({ partitions: 8, heapsorts: 1 });
    expect(c("intro-sort", [12, 3, 15, 7, 9, 1, 14, 5, 11, 2, 8, 16, 4, 13, 6, 10])).toMatchObject({
      partitions: 4,
      "insertion sorts": 5,
    });
    expect(c("tree-sort", [50, 30, 70, 20, 40, 60, 80, 35, 65, 30]).comparisons).toBe(20);
    expect(c("tree-sort", [1, 2, 3, 4, 5, 6, 7, 8]).comparisons).toBe(28);
    expect(c("pancake-sort", [3, 6, 1, 8, 2, 7, 4, 5]).flips).toBe(11);
    expect(c("pancake-sort", [9, 8, 7, 6, 5, 4, 3, 2]).flips).toBe(1);
    expect(c("strand-sort", [3, 1, 5, 4, 2, 6, 9, 7, 8]).strands).toBe(3);
    expect(c("strand-sort", [9, 8, 7, 6, 5, 4, 3, 2]).strands).toBe(8);
    expect(c("american-flag-sort", [512, 507, 519, 503, 98, 511, 534, 5])).toMatchObject({
      calls: 5,
      swaps: 11,
    });
  });

  it("heap and distribution sorting lessons (batch AF): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const c = (id: string, value: number[]) => {
      const r = runAlgorithm(getModule(id)!, value);
      return { ...r.trace.meta.counters, ...(r.trace.events.at(-1)?.vars ?? {}) } as Record<
        string,
        number
      >;
    };
    const sorted8 = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(c("weak-heap-sort", sorted8).comparisons).toBe(17);
    expect(c("weak-heap-sort", [9, 8, 7, 6, 5, 4, 3, 2]).comparisons).toBe(19);
    expect(c("smooth-sort", sorted8)).toMatchObject({ comparisons: 17, swaps: 0 });
    expect(c("heap-sort", [1, 2, 3, 4, 5, 6, 7])).toMatchObject({ comparisons: 21, swaps: 16 });
    expect(c("smooth-sort", [9, 8, 7, 6, 5, 4, 3, 2])).toMatchObject({
      comparisons: 34,
      swaps: 18,
    });
    expect(c("tournament-sort", [5, 9, 2, 7, 4, 8, 1, 6]).comparisons).toBe(17);
    expect(c("msd-radix-sort", [512, 507, 519, 503, 98, 511, 534, 5]).calls).toBe(5);
    expect(c("msd-radix-sort", [170, 45, 75, 90, 802, 24, 2, 66]).calls).toBe(2);
    expect(c("bucket-sort", [78, 17, 39, 26, 72, 94, 21, 12, 23, 68])).toMatchObject({
      comparisons: 3,
      swaps: 1,
    });
    expect(c("bucket-sort", [41, 44, 40, 47, 43, 42, 3, 95]).comparisons).toBe(11);
    expect(c("flash-sort", [42, 7, 88, 15, 63, 29, 94, 51, 3, 76, 34, 60])).toMatchObject({
      classes: 5,
      comparisons: 37,
    });
  });

  it("insertion and divide-and-conquer sorting lessons (batch AE): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const c = (id: string, value: number[]) => {
      const r = runAlgorithm(getModule(id)!, value);
      return { ...r.trace.meta.counters, ...(r.trace.events.at(-1)?.vars ?? {}) } as Record<
        string,
        number
      >;
    };
    const rev = [9, 8, 7, 6, 5, 4, 3, 2];
    expect(c("binary-insertion-sort", rev)).toMatchObject({ comparisons: 17, shifts: 28 });
    expect(c("insertion-sort", [8, 7, 6, 5, 4, 3, 2, 1]).comparisons).toBe(28);
    expect(c("binary-insertion-sort", [1, 2, 3, 4, 5, 6, 7, 8]).comparisons).toBe(13);
    const shelf = [47, 12, 85, 3, 61, 29, 74, 18, 90, 55];
    expect(c("library-sort", shelf)).toMatchObject({ comparisons: 21, shifts: 8, rebalances: 4 });
    expect(c("library-sort", rev).shifts).toBe(21);
    expect(c("patience-sort", [7, 2, 8, 1, 3, 4, 10, 6, 9, 5]).piles).toBe(5);
    expect(c("patience-sort", rev).piles).toBe(1);
    expect(c("patience-sort", [1, 2, 3, 4, 5, 6, 7, 8]).piles).toBe(8);
    expect(c("natural-merge-sort", [3, 7, 9, 2, 5, 8, 1, 4, 6])).toMatchObject({
      merges: 2,
      comparisons: 19,
      passes: 2,
    });
    expect(c("natural-merge-sort", [1, 2, 3, 4, 5, 6, 7, 8])).toMatchObject({
      comparisons: 7,
      passes: 0,
    });
    expect(c("bottom-up-merge-sort", [5, 1, 4, 2, 8])).toMatchObject({
      merges: 4,
      comparisons: 9,
      passes: 3,
    });
    expect(c("dual-pivot-quick-sort", [24, 8, 42, 75, 29, 77, 38, 57, 13, 3])).toMatchObject({
      partitions: 4,
      comparisons: 26,
      swaps: 7,
    });
    expect(c("three-way-quick-sort", [4, 9, 4, 4, 1, 9, 4, 1, 4, 9])).toMatchObject({
      partitions: 3,
      comparisons: 12,
    });
  });

  it("elementary sorting lessons (batch AD): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const c = (id: string, value: number[]) => {
      const r = runAlgorithm(getModule(id)!, value);
      return { ...r.trace.meta.counters, ...(r.trace.events.at(-1)?.vars ?? {}) } as Record<
        string,
        number
      >;
    };
    expect(c("optimized-bubble-sort", [1, 2, 3, 4, 5, 6, 7, 8]).comparisons).toBe(7);
    expect(c("optimized-bubble-sort", [1, 2, 3, 5, 4, 6, 7, 8]).comparisons).toBe(10);
    expect(c("optimized-bubble-sort", [5, 1, 4, 2, 8])).toMatchObject({
      comparisons: 7,
      passes: 3,
    });
    expect(c("bubble-sort", [5, 1, 4, 2, 8]).comparisons).toBe(10);
    expect(c("cocktail-shaker-sort", [2, 3, 4, 5, 6, 7, 8, 1])).toMatchObject({
      rounds: 2,
      comparisons: 18,
      swaps: 7,
    });
    const turtles = [5, 6, 7, 8, 9, 10, 4, 3, 2, 1];
    expect(c("comb-sort", turtles)).toMatchObject({ passes: 6, comparisons: 41, swaps: 12 });
    const { inversions } = await import("@/algorithms/sorting/common");
    expect(inversions(turtles)).toBe(30);
    expect(c("odd-even-sort", [5, 1, 4, 2, 8])).toMatchObject({ phases: 6, swaps: 4 });
    expect(c("odd-even-sort", [9, 8, 7, 6, 5, 4, 3, 2])).toMatchObject({ phases: 10, swaps: 28 });
    expect(c("gnome-sort", [34, 2, 10, -9])).toMatchObject({ comparisons: 11, swaps: 5 });
    expect(c("double-selection-sort", [9, 3, 7, 1, 5]).swaps).toBe(3);
    expect(c("bingo-sort", [3, 1, 3, 2, 1, 3, 2, 1, 2, 3])).toMatchObject({ passes: 2, swaps: 5 });
    expect(c("cycle-sort", [5, 1, 4, 2, 8]).writes).toBe(3);
  });

  it("searching lessons (batch AC): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const basic = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    const run = (id: string, value: unknown) => {
      const r = runAlgorithm(getModule(id)!, value);
      return { out: r.output as number, c: r.trace.meta.counters };
    };
    expect(run("sentinel-search", { values: [7, 3, 9, 1, 4, 8, 2], target: 5 })).toMatchObject({
      out: -1,
      c: { comparisons: 8 },
    });
    expect(run("sentinel-search", { values: [7, 3, 9, 1, 4, 8, 2], target: 4 }).c.comparisons).toBe(
      5,
    );
    expect(run("recursive-binary-search", { values: basic, target: 23 })).toMatchObject({
      out: 5,
      c: { calls: 3, comparisons: 3 },
    });
    expect(run("recursive-binary-search", { values: basic, target: 40 }).c.calls).toBe(5);
    expect(run("ternary-search", { values: [1, 4, 9, 15, 22, 18, 12, 7, 2] })).toMatchObject({
      out: 4,
      c: { comparisons: 4 },
    });
    const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    expect(run("interpolation-search", { values: tens, target: 70 })).toMatchObject({
      out: 6,
      c: { comparisons: 1 },
    });
    expect(
      run("interpolation-search", { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 999], target: 9 }),
    ).toMatchObject({ out: 8, c: { comparisons: 9 } });
    expect(run("exponential-search", { values: basic, target: 23 })).toMatchObject({
      out: 5,
      c: { comparisons: 8 },
    });
    const twenty = [1, 3, 4, 6, 9, 11, 14, 17, 20, 22, 25, 29, 31, 34, 38, 41, 45, 48, 52, 57];
    expect(run("exponential-search", { values: twenty, target: 6 }).c.comparisons).toBe(5);
    const fib16 = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];
    expect(run("jump-search", { values: fib16, target: 55 })).toMatchObject({
      out: 10,
      c: { comparisons: 6 },
    });
    expect(
      run("fibonacci-search", {
        values: [10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100],
        target: 85,
      }),
    ).toMatchObject({ out: 8, c: { comparisons: 4 } });
    const { deltaTable } = await import("@/algorithms/searching/uniform-binary-search");
    expect(deltaTable(10).slice(1)).toEqual([5, 3, 1, 1, 0]);
    expect(run("uniform-binary-search", { values: basic, target: 23 })).toMatchObject({
      out: 5,
      c: { comparisons: 4 },
    });
    expect(run("uniform-binary-search", { values: basic, target: 40 }).out).toBe(-1);
  });

  it("skip list and cache lessons (batch AB): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { ops } = await import("@/algorithms/trees/balanced/common");
    const { cacheOps } = await import("@/algorithms/caches/common");
    const skip = (text: string) => {
      const r = runAlgorithm(getModule("skip-list")!, ops(text));
      const o = r.output as { results: string[]; towers: { key: number; height: number }[] };
      return { ...o, cmp: r.trace.meta.counters.comparisons ?? 0 };
    };
    const built = skip("i30 i10 i50 i70 i20 i60 i40 i80");
    expect(built.towers.map((x) => x.height)).toEqual([2, 3, 2, 4, 2, 3, 2, 4]);
    const s60 = skip("i30 i10 i50 i70 i20 i60 i40 i80 s60");
    const s45 = skip("i30 i10 i50 i70 i20 i60 i40 i80 s45");
    expect([s60.results.at(-1), s60.cmp - built.cmp]).toEqual(["found", 6]);
    expect([s45.results.at(-1), s45.cmp - built.cmp]).toEqual(["missing", 5]);

    const lruOps = "p1:10 p2:20 g1 p3:30 g2 p4:40 g1 g3 g4";
    const lru = (n: number) =>
      runAlgorithm(getModule("lru-cache")!, {
        capacity: 2,
        ops: cacheOps(lruOps).slice(0, n),
      }).output as { results: unknown[]; order: string[] };
    expect(lru(9).results).toEqual([
      "stored",
      "stored",
      10,
      "evict 2",
      "miss",
      "evict 1",
      "miss",
      30,
      40,
    ]);
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => lru(n).order.join(" "))).toEqual([
      "1:10",
      "1:10 2:20",
      "2:20 1:10",
      "1:10 3:30",
      "1:10 3:30",
      "3:30 4:40",
      "3:30 4:40",
      "4:40 3:30",
      "3:30 4:40",
    ]);
    const scan = runAlgorithm(getModule("lru-cache")!, {
      capacity: 3,
      ops: cacheOps("g1 p1:1 g2 p2:2 g3 p3:3 g4 p4:4 g1 p1:1 g2 p2:2 g3 p3:3 g4 p4:4"),
    }).output as { misses: number };
    expect(scan.misses).toBe(8);

    type B = { freq: number; entries: string[] }[];
    const show = (b: B) => b.map((x) => `${x.freq}×: ${x.entries.join(" ")}`).join("; ");
    const lfuOps = cacheOps("p1:10 p2:20 g1 p3:30 g2 g3 p4:40 g1 g3 g4");
    const lfu = (n: number) =>
      runAlgorithm(getModule("lfu-cache")!, { capacity: 2, ops: lfuOps.slice(0, n) }).output as {
        results: unknown[];
        buckets: B;
      };
    expect([2, 3, 4, 6, 7, 10].map((n) => show(lfu(n).buckets))).toEqual([
      "1×: 1:10 2:20",
      "1×: 2:20; 2×: 1:10",
      "1×: 3:30; 2×: 1:10",
      "2×: 1:10 3:30",
      "1×: 4:40; 2×: 3:30",
      "2×: 4:40; 3×: 3:30",
    ]);
    expect(lfu(10).results).toEqual([
      "stored",
      "stored",
      10,
      "evict 2",
      "miss",
      30,
      "evict 1",
      "miss",
      30,
      40,
    ]);
    const contrast = cacheOps("p1:1 g1 g1 g1 p2:2 g2 p3:3");
    const evicted = (id: string) =>
      (
        runAlgorithm(getModule(id)!, { capacity: 2, ops: contrast }).output as {
          results: unknown[];
        }
      ).results.at(-1);
    expect([evicted("lfu-cache"), evicted("lru-cache")]).toEqual(["evict 2", "evict 1"]);
  });

  it("trie lessons (batch AA): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { wordOps } = await import("@/algorithms/trees/tries/words");
    const { showRadix } = await import("@/algorithms/trees/tries/radix");
    const { showPatricia } = await import("@/algorithms/trees/tries/patricia");
    const { showTst } = await import("@/algorithms/trees/tries/tst");
    const { ops } = await import("@/algorithms/trees/balanced/common");
    const radix = (text: string) => {
      const o = runAlgorithm(getModule("radix-tree")!, wordOps(text)).output as never as {
        tree: never;
        results: string[];
        splits: number;
        merges: number;
      };
      return { ...o, shape: showRadix(o.tree) };
    };
    const words = ["romane", "romanus", "romulus", "rubens", "ruber", "rubicon"];
    const grow = (n: number) =>
      radix(
        words
          .slice(0, n)
          .map((w) => `+${w}`)
          .join(" "),
      );
    expect([1, 2, 3, 4, 5, 6].map((n) => grow(n).shape)).toEqual([
      "·(romane*)",
      "·(roman(e* us*))",
      "·(rom(an(e* us*) ulus*))",
      "·(r(om(an(e* us*) ulus*) ubens*))",
      "·(r(om(an(e* us*) ulus*) ube(ns* r*)))",
      "·(r(om(an(e* us*) ulus*) ub(e(ns* r*) icon*)))",
    ]);
    expect(grow(6).splits).toBe(5);
    // 11 nodes besides the root; a plain trie of the same words has 22.
    expect(grow(6).shape.match(/[a-z]+/g)!.length).toBe(11);
    const plain = runAlgorithm(getModule("trie")!, { words, search: [], prefixes: [] });
    expect((plain.output as { nodes: number }).nodes - 1).toBe(22);
    expect(radix(`${words.map((w) => `+${w}`).join(" ")} ?rom ^rom`).results.slice(6)).toEqual([
      "missing",
      "found",
    ]);
    expect(radix("+car +cart +care +cat +dog -cart").shape).toBe("·(ca(r*(e*) t*) dog*)");
    const merged = radix("+car +cart +care +cat +dog -cart -car");
    expect([merged.shape, merged.merges]).toEqual(["·(ca(re* t*) dog*)", 1]);

    const pat = (text: string) => {
      const r = runAlgorithm(getModule("patricia-trie")!, ops(text));
      const o = r.output as { tree: never; results: string[] };
      return { ...o, shape: showPatricia(o.tree), bits: r.trace.meta.counters["bit tests"] ?? 0 };
    };
    const keys = "i19 i23 i82 i81 i40 i63".split(" ");
    expect([1, 2, 3, 4, 5, 6].map((n) => pat(keys.slice(0, n).join(" ")).shape)).toEqual([
      "19",
      "[4](19 23)",
      "[0]([4](19 23) 82)",
      "[0]([4](19 23) [5](81 82))",
      "[0]([1]([4](19 23) 40) [5](81 82))",
      "[0]([1]([4](19 23) [2](40 63)) [5](81 82))",
    ]);
    const built = pat(keys.join(" "));
    const s60 = pat(`${keys.join(" ")} s60`);
    expect([s60.results.at(-1), s60.bits - built.bits]).toEqual(["missing", 3]);

    const tst = (text: string) => {
      const r = runAlgorithm(getModule("ternary-search-tree")!, wordOps(text));
      const o = r.output as { tree: never; results: string[]; nodes: number };
      return { ...o, shape: showTst(o.tree), cmp: r.trace.meta.counters.comparisons ?? 0 };
    };
    const tw = "+cat +cup +at +as +he +us +i".split(" ");
    expect([1, 2, 3, 4, 5, 6, 7].map((n) => tst(tw.slice(0, n).join(" ")).nodes)).toEqual([
      3, 5, 7, 8, 10, 12, 13,
    ]);
    const all = tst(tw.join(" "));
    const cup = tst(`${tw.join(" ")} ?cup`);
    expect(cup.cmp - all.cmp).toBe(4);
    expect(tst(`${tw.join(" ")} ?cup ?cu ^cu ?it`).results.slice(7)).toEqual([
      "found",
      "missing",
      "found",
      "missing",
    ]);
    expect(tst("+a +b +c +d +e").shape).toBe("a*(>b*(>c*(>d*(>e*))))");

    const st = (text: string, patterns: string[]) =>
      runAlgorithm(getModule("suffix-trie")!, { text, patterns }).output as {
        nodes: number;
        occurrences: number[][];
      };
    const banana = st("banana", ["ana", "nab", "a"]);
    expect(banana).toEqual({ nodes: 23, occurrences: [[1, 3], [], [1, 3, 5]] });
    // New nodes per suffix of banana$, counted from the trace.
    const perSuffix: number[] = [];
    for (const e of runAlgorithm(getModule("suffix-trie")!, { text: "banana", patterns: [] }).trace
      .events) {
      if (e.type === "step" && e.note?.startsWith("Insert suffix")) perSuffix.push(0);
      else if (e.type === "tree.add" && perSuffix.length) perSuffix[perSuffix.length - 1]!++;
    }
    expect(perSuffix).toEqual([7, 6, 5, 1, 1, 1, 1]);
    expect(st("abc", []).nodes).toBe(11);
  });

  it("forest heap lessons (batch Z): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { heapOps, showForest } = await import("@/algorithms/heaps/forest");
    const run = (id: string, text: string) => {
      const r = runAlgorithm(getModule(id)!, heapOps(text));
      const o = r.output as {
        forest: never;
        results: unknown[];
        links?: number;
        cuts?: number;
        melds?: number;
      };
      return { ...o, shape: showForest(o.forest) };
    };
    const ins = "i8 i3 i12 i5 i9 i1 i7 i4".split(" ");
    const after = (n: number) => run("binomial-heap", ins.slice(0, n).join(" "));
    expect([1, 2, 3, 4, 6, 7, 8].map((n) => after(n).shape)).toEqual([
      "8",
      "3(8)",
      "12 3(8)",
      "3(5(12) 8)",
      "1(9) 3(5(12) 8)",
      "7 1(9) 3(5(12) 8)",
      "1(3(5(12) 8) 4(7) 9)",
    ]);
    expect(after(8).links).toBe(7);
    expect(run("binomial-heap", "i8 i3 i12 i5 i9 i1 i7 i4 x").links).toBe(7);
    expect(run("binomial-heap", "i8 i3 i12 i5 i9 i1 i7 i4 x x").links).toBe(9);

    const lazy = run("fibonacci-heap", "i7 i3 i9 i5 i1 i8 i6 i4 x");
    expect([lazy.shape, lazy.links]).toEqual(["4 6(8) 3[min](7 5(9))", 4]);
    const base = "i70 i30 i90 i50 i10 i80 i60 i40 i20 x";
    expect(run("fibonacci-heap", base)).toMatchObject({
      shape: "20[min](40 60(80) 30(70 50(90)))",
      links: 7,
    });
    expect(run("fibonacci-heap", `${base} d70:5`).shape).toBe(
      "20(40 60(80) 30[marked](50(90))) 5[min]",
    );
    const cascade = run("fibonacci-heap", `${base} d70:5 d90:3 d50:1`);
    expect([cascade.shape, cascade.cuts]).toEqual(["20(40 60(80)) 5 3 1[min] 30", 4]);

    expect(run("pairing-heap", "i5 i8 i3 i9 i7 i6 i4 i2").shape).toBe("2(3(4 6 7 9 5(8)))");
    expect(run("pairing-heap", "i5 i8 i3 i9 i7 i6 i4 i2 x").shape).toBe("3(4 6 7 9 5(8))");
    const two = run("pairing-heap", "i5 i8 i3 i9 i7 i6 i4 i2 x x");
    expect([two.shape, two.melds]).toEqual(["4(5(7(9) 8) 6)", 11]);
  });

  it("meldable heap lessons (batch Y): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    type S = { key: number; left: S | null; right: S | null } | null;
    const show = (s: S): string =>
      s ? (s.left || s.right ? `${s.key}(${show(s.left)}, ${show(s.right)})` : `${s.key}`) : "·";
    const all = "i5 i9 i2 i7 i1 i8 i3 x x p"
      .split(" ")
      .map((w) =>
        w === "x"
          ? { name: "extract" }
          : w === "p"
            ? { name: "peek" }
            : { name: "insert", value: Number(w.slice(1)) },
      );
    const at = (id: string, n: number) =>
      show((runAlgorithm(getModule(id)!, all.slice(0, n)).output as { tree: S }).tree);
    expect([2, 3, 4, 6, 7, 8, 9].map((n) => at("leftist-heap", n))).toEqual([
      "5(9, ·)",
      "2(5(9, ·), ·)",
      "2(5(9, ·), 7)",
      "1(2(5(9, ·), 7), 8)",
      "1(2(5(9, ·), 7), 3(8, ·))",
      "2(3(8, 7), 5(9, ·))",
      "3(5(9, 7), 8)",
    ]);
    expect([2, 3, 4, 5, 6, 7, 8, 9].map((n) => at("skew-heap", n))).toEqual([
      "5(9, ·)",
      "2(5(9, ·), ·)",
      "2(7, 5(9, ·))",
      "1(2(7, 5(9, ·)), ·)",
      "1(8, 2(7, 5(9, ·)))",
      "1(2(3(5(9, ·), ·), 7), 8)",
      "2(7(8, ·), 3(5(9, ·), ·))",
      "3(7(8, ·), 5(9, ·))",
    ]);
    for (const id of ["leftist-heap", "skew-heap"]) {
      const r = runAlgorithm(getModule(id)!, all);
      const o = r.output as { results: unknown[]; pathNodes: number };
      expect([o.results.slice(7), o.pathNodes, r.trace.meta.counters.comparisons]).toEqual([
        [1, 2, 3],
        11,
        11,
      ]);
    }
  });

  it("B-tree lessons (batch W): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { bOps, showShape } = await import("@/algorithms/trees/btree/common");
    const run = (id: string, size: number, text: string, ops?: unknown) => {
      const r = runAlgorithm(getModule(id)!, { size, ops: ops ?? bOps(text) });
      const o = r.output as {
        tree: never;
        height: number;
        results: string[];
        splits: number;
        merges?: number;
      };
      return { ...o, shape: showShape(o.tree) };
    };
    const grow = run("b-tree", 2, "i10 i20 i30 i40 i50 i60 i70 i80 i90");
    expect([grow.shape, grow.height, grow.splits]).toEqual([
      "[40]([20]([10],[30]),[60]([50],[70 80 90]))",
      3,
      4,
    ]);
    expect(run("b-tree", 2, "i10 i20 i30 i40").shape).toBe("[20]([10],[30 40])");
    expect(run("b-tree", 2, "i10 i20 i30 i40 i50 i60").shape).toBe("[20 40]([10],[30],[50 60])");
    expect(run("b-tree", 2, "i10 i20 i30 i40 i50 i60 i70 i80").shape).toBe(
      "[20 40 60]([10],[30],[50],[70 80])",
    );
    const t3 = run("b-tree", 3, "i5 i15 i25 i35 i45 i55 i65 i75 i85 i95 i3 i8");
    expect([t3.height, t3.splits]).toEqual([2, 2]);
    const del = run("b-tree", 2, "i10 i20 i30 i40 i50 i60 i70 i80 i90 d60 d70 d10 d50 d20");
    expect([del.shape, del.merges]).toEqual(["[80]([30 40],[90])", 3]);
    expect(run("b-tree", 2, "i10 i20 i30 i40 i5").shape).toBe("[20]([5 10],[30 40])");
    expect(run("b-tree", 2, "i10 i20 i30 i40 i5 d20").shape).toBe("[10]([5],[30 40])");

    const scanOps = (text: string) =>
      text.split(" ").map((w) => ({
        name: { i: "insert", s: "search", r: "scan" }[w[0] as "i"],
        value: Number(w.slice(1)),
      }));
    const bp = run("b-plus-tree", 3, "", scanOps("i10 i20 i30 i40 i50 i60 i70 i80 r35"));
    expect([bp.shape, bp.splits, bp.results.at(-1)]).toEqual([
      "[30 50 70]([10 20],[30 40],[50 60],[70 80])",
      3,
      "40 50 60 70 80",
    ]);
    expect(run("b-plus-tree", 3, "", scanOps("i10 i20 i30 i40")).shape).toBe(
      "[30]([10 20],[30 40])",
    );
    expect(run("b-plus-tree", 3, "", scanOps("i10 i20 i30 i40 i50 i60")).shape).toBe(
      "[30 50]([10 20],[30 40],[50 60])",
    );
    const bpDel = run("b-plus-tree", 3, "", [
      ...scanOps("i10 i20 i30 i40 i50 i60 i70 i80"),
      ...[30, 40, 10, 80, 70].map((value) => ({ name: "delete", value })),
    ]);
    expect([bpDel.shape, (bpDel as unknown as { merges: number }).merges]).toEqual([
      "[20 50 60]",
      3,
    ]);

    const star = (size: number, text: string) =>
      run("b-star-tree", size, text) as unknown as {
        shape: string;
        shifts: number;
        splits: number;
      };
    expect(star(3, "i10 i20 i30 i40").shape).toBe("[10 20 30 40]");
    expect(star(3, "i10 i20 i30 i40 i50").shape).toBe("[30]([10 20],[40 50])");
    expect(star(3, "i10 i20 i30 i40 i50 i60 i70").shape).toBe("[40]([10 20 30],[50 60 70])");
    const s80 = star(3, "i10 i20 i30 i40 i50 i60 i70 i80");
    expect([s80.shape, s80.shifts, s80.splits]).toEqual(["[30 60]([10 20],[40 50],[70 80])", 1, 2]);
    const m5 = star(5, "i5 i10 i15 i20 i25 i30 i35 i40 i45 i50 i55 i60 i65 i70 i75 i80");
    expect([m5.shifts, m5.splits]).toEqual([4, 3]);
  });

  it("AA and scapegoat lessons (batch V): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { ops } = await import("@/algorithms/trees/balanced/common");
    const { depthLimit } = await import("@/algorithms/trees/balanced/scapegoat");
    type S = { key: number; tag?: string; left: S | null; right: S | null } | null;
    const show = (s: S): string =>
      s ? `${s.key}${s.tag ? `[${s.tag}]` : ""}(${show(s.left)},${show(s.right)})` : "·";
    const run = (id: string, text: string) => {
      const r = runAlgorithm(getModule(id)!, ops(text));
      return {
        out: r.output as { tree: S; height: number; rebuilds?: number },
        rotations: r.trace.meta.counters.rotations,
      };
    };
    const aa = run("aa-tree", "i1 i2 i3 i4 i5 i6 i7");
    expect([show(aa.out.tree), aa.rotations]).toEqual([
      "4[L3](2[L2](1[L1](·,·),3[L1](·,·)),6[L2](5[L1](·,·),7[L1](·,·)))",
      4,
    ]);
    expect(show(run("aa-tree", "i1 i2 i3 i4 i5 i6 i7 d1").out.tree)).toBe(
      "4[L2](2[L1](·,3[L1](·,·)),6[L2](5[L1](·,·),7[L1](·,·)))",
    );
    const sg = run("scapegoat-tree", "i1 i2 i3 i4 i5 i6 i7 i8 i9 i10");
    expect([sg.out.height, sg.out.rebuilds]).toEqual([6, 2]);
    const sgDel = run("scapegoat-tree", "i50 i30 i70 i20 i40 i60 i80 d20 d30 d40 s70");
    expect([show(sgDel.out.tree), sgDel.out.height, sgDel.out.rebuilds]).toEqual([
      "70(60(50(·,·),·),80(·,·))",
      3,
      1,
    ]);
    expect([depthLimit(5), depthLimit(9), depthLimit(10), depthLimit(20), depthLimit(100)]).toEqual(
      [3, 5, 5, 7, 11],
    );
  });

  it("balanced tree lessons (batch U): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const { ops } = await import("@/algorithms/trees/balanced/common");
    type S = { key: number; tag?: string; left: S | null; right: S | null } | null;
    const show = (s: S): string =>
      s ? `${s.key}${s.tag ? `[${s.tag}]` : ""}(${show(s.left)},${show(s.right)})` : "·";
    const run = (id: string, text: string) => {
      const r = runAlgorithm(getModule(id)!, ops(text));
      const o = r.output as { tree: S; height: number; results: string[] };
      return {
        tree: show(o.tree),
        height: o.height,
        results: o.results,
        rotations: r.trace.meta.counters.rotations,
      };
    };

    const avl = run("avl-tree", "i10 i20 i30 i40 i50 i60 i70");
    expect([avl.tree, avl.height, avl.rotations]).toEqual([
      "40[h=3](20[h=2](10[h=1](·,·),30[h=1](·,·)),60[h=2](50[h=1](·,·),70[h=1](·,·)))",
      3,
      4,
    ]);
    expect(run("avl-tree", "i30 i10 i20").tree).toBe("20[h=2](10[h=1](·,·),30[h=1](·,·))");
    const avlDel = run("avl-tree", "i50 i30 i70 i20 i40 i60 i80 i10 d60 d70 d80 s20");
    expect([avlDel.tree.startsWith("30["), avlDel.height]).toEqual([true, 3]);

    const rb = run("red-black-tree", "i10 i20 i30 i40 i50 i60 i70 i80");
    expect([rb.tree, rb.height, rb.rotations]).toEqual([
      "40[black](20[red](10[black](·,·),30[black](·,·)),60[red](50[black](·,·),70[black](·,80[red](·,·))))",
      4,
      4,
    ]);
    expect(run("red-black-tree", "i41 i38 i31 i12 i19 i8 d8 d12 d19 d31 s38").tree).toBe(
      "38[black](·,41[red](·,·))",
    );

    expect(run("splay-tree", "i10 i20 i30 i40 i50 i60 i70").height).toBe(7);
    expect(run("splay-tree", "i10 i20 i30 i40 i50 i60 i70 s10")).toMatchObject({ height: 5 });
    expect(run("splay-tree", "i10 i20 i30 i40 i50 i60 i70 s10 s40")).toMatchObject({
      height: 4,
      tree: "40(10(·,20(·,30(·,·))),60(50(·,·),70(·,·)))",
    });
    expect(run("splay-tree", "i5 i3 i8 i1 i4 i7 i9 d5").tree).toBe(
      "4(1(·,3(·,·)),8(7(·,·),9(·,·)))",
    );

    const tr = run("treap", "i1 i2 i3 i4 i5 i6 i7 i8 i9 i10");
    expect([tr.height, tr.rotations]).toEqual([4, 6]);
    expect(tr.tree.startsWith("5[p=6](3[p=33]")).toBe(true);

    const morris = (levels: (number | null)[]) => {
      const r = runAlgorithm(getModule("morris-traversal")!, levels);
      return [
        (r.output as { inorder: number[] }).inorder,
        (r.output as { threads: number }).threads,
        (r.output as { moves: number }).moves,
      ];
    };
    expect(morris([1, 2, 3, 4, 5, null, 6])).toEqual([[4, 2, 5, 1, 3, 6], 2, 14]);
    expect(morris([5, 4, null, 3, null, 2])[0]).toEqual([2, 3, 4, 5]);
  });

  it("queue and heap lessons (batch T): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, fields: Record<string, string>) => {
      const m = getModule(id)!;
      const p = m.input.parse(fields);
      if (!p.ok) throw new Error(p.errors.join());
      return runAlgorithm(m, p.value).output as never;
    };

    type Ad = { results: unknown[]; contents: number[]; transfers: number };
    const q: Ad = run("queue-using-stacks", {
      build: "queue",
      ops: "enqueue 1, enqueue 2, enqueue 3, dequeue, enqueue 4, dequeue, dequeue, front, dequeue, dequeue",
    });
    expect([q.results.filter((r) => r !== "ok"), q.transfers]).toEqual([
      [1, 2, 3, 4, 4, "empty"],
      4,
    ]);
    const q2: Ad = run("queue-using-stacks", {
      build: "queue",
      ops: "enqueue 1, enqueue 2, dequeue, enqueue 3, dequeue, dequeue",
    });
    expect(q2.transfers).toBe(3);
    const s: Ad = run("queue-using-stacks", {
      build: "stack",
      ops: "push 1, push 2, push 3, pop, push 4, top, pop, pop",
    });
    expect([s.results.filter((r) => r !== "ok"), s.contents, s.transfers]).toEqual([
      [3, 4, 4, 2],
      [1],
      5,
    ]);
    expect(
      (run("queue-using-stacks", { build: "stack", ops: "push 1, push 2, push 3, push 4" }) as Ad)
        .transfers,
    ).toBe(6);

    type Ms = { results: unknown[]; aux: number[]; auxPeak: number };
    const ms: Ms = run("min-stack", {
      track: "min",
      ops: "push 5, push 3, push 7, push 3, min, pop, min, pop, pop, min",
    });
    expect([ms.results.filter((r) => r !== "ok"), ms.auxPeak]).toEqual([[3, 3, 3, 7, 3, 5], 3]);
    expect(
      (run("min-stack", { track: "min", ops: "push 4, push 6, push 2, push 2, push 8" }) as Ms).aux,
    ).toEqual([4, 2, 2]);
    expect(
      (run("min-stack", { track: "max", ops: "push 2, push 9, push 4, max, pop, pop, max" }) as Ms)
        .results,
    ).toEqual(["ok", "ok", "ok", 9, 4, 9, 2]);

    type Cq = { results: unknown[]; contents: number[]; head: number };
    const cq: Cq = run("circular-queue", {
      capacity: "4",
      whenFull: "reject",
      ops: "enqueue 1, enqueue 2, enqueue 3, dequeue, dequeue, enqueue 4, enqueue 5, enqueue 6, enqueue 7, dequeue, front",
    });
    expect([cq.results.filter((r) => r !== "ok"), cq.contents, cq.head]).toEqual([
      [1, 2, "full", 3, 4],
      [4, 5, 6],
      3,
    ]);
    const ow: Cq = run("circular-queue", {
      capacity: "3",
      whenFull: "overwrite",
      ops: "enqueue 10, enqueue 20, enqueue 30, enqueue 40, enqueue 50, dequeue, dequeue, dequeue, dequeue",
    });
    expect(ow.results.slice(3)).toEqual(["overwrote", "overwrote", 30, 40, 50, "empty"]);
    // The practice question: capacity 5, head 3, count 4 -> next slot 2.
    const p5: Cq = run("circular-queue", {
      capacity: "5",
      whenFull: "reject",
      ops: "enqueue 1, enqueue 2, enqueue 3, dequeue, dequeue, dequeue, enqueue 4, enqueue 5, enqueue 6, enqueue 7",
    });
    expect([p5.head, p5.contents.length]).toEqual([3, 4]);

    type Dq = {
      results: unknown[];
      contents: number[];
      capacity: number;
      head: number;
      copies: number;
    };
    const dq: Dq = run("deque", {
      ops: "pushBack 1, pushBack 2, pushFront 0, pushFront 9, pushBack 3, popFront, popBack, front, back",
    });
    expect([
      dq.results.filter((r) => r !== "ok"),
      dq.contents,
      dq.capacity,
      dq.head,
      dq.copies,
    ]).toEqual([[9, 3, 0, 2], [0, 1, 2], 8, 1, 6]);
    const nine: Dq = run("deque", {
      ops: Array.from({ length: 9 }, (_, i) => `pushBack ${i}`).join(", "),
    });
    expect([nine.copies, nine.capacity]).toEqual([14, 16]);
    expect(
      (
        run("deque", {
          ops: "pushBack 5, pushFront 4, popBack, pushFront 3, popBack, pushFront 2, back",
        }) as Dq
      ).contents,
    ).toEqual([2, 3]);

    type Hp = { results: unknown[]; heap: number[]; comparisons: number };
    const h: Hp = run("binary-heap", {
      kind: "min",
      ops: "insert 5, insert 3, insert 8, insert 1, insert 9, insert 2, extract, extract, peek, extract",
    });
    expect([h.results.filter((r) => r !== "ok"), h.heap, h.comparisons]).toEqual([
      [1, 2, 3, 3],
      [5, 9, 8],
      14,
    ]);
    const six: Hp = run("binary-heap", {
      kind: "min",
      ops: "insert 5, insert 3, insert 8, insert 1, insert 9, insert 2",
    });
    expect(six.heap).toEqual([1, 3, 2, 5, 9, 8]);
    const hm: Hp = run("binary-heap", {
      kind: "max",
      ops: "insert 20, insert 50, insert 10, extract, insert 40, insert 30, extract, extract",
    });
    expect([hm.results.filter((r) => r !== "ok"), hm.comparisons]).toEqual([[50, 40, 30], 9]);
  });

  it("stack lessons (batch S): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, value: unknown) => runAlgorithm(getModule(id)!, value);
    const parse = (id: string, fields: Record<string, string>) => {
      const p = getModule(id)!.input.parse(fields);
      if (!p.ok) throw new Error(p.errors.join());
      return p.value;
    };

    type Br = { balanced: boolean; errorAt: number | null; reason: string };
    const b1 = run("balanced-brackets", "{[()()]}");
    expect([(b1.output as Br).balanced, b1.trace.meta.counters.comparisons]).toEqual([true, 4]);
    const b2 = run("balanced-brackets", "([)]");
    expect([(b2.output as Br).errorAt, b2.trace.meta.counters.comparisons]).toEqual([2, 1]);
    expect(run("balanced-brackets", "((a+b)*[c-d]").output).toMatchObject({
      balanced: false,
      errorAt: 0,
      reason: "left open",
    });
    expect((run("balanced-brackets", "f(a[i],{x:1})").output as Br).balanced).toBe(true);
    expect((run("balanced-brackets", "[(])").output as Br).errorAt).toBe(2);

    type Sy = { postfix: (string | number)[]; maxStack: number };
    const postfix = (expr: string) => {
      const r = run("shunting-yard", parse("shunting-yard", { expr }));
      return [
        (r.output as Sy).postfix.join(" "),
        (r.output as Sy).maxStack,
        r.trace.meta.counters.comparisons,
      ];
    };
    expect(postfix("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3")).toEqual(["3 4 2 * 1 5 - 2 3 ^ ^ / +", 4, 5]);
    expect(postfix("8 - 3 - 2")[0]).toBe("8 3 - 2 -");
    expect(postfix("(1+2)*(3+4)")[0]).toBe("1 2 + 3 4 + *");
    expect(postfix("2 * (3 + 4) - 5")[0]).toBe("2 3 4 + * 5 -");
    expect(postfix("1 + 2 * 3 ^ 4")[1]).toBe(3);

    type Ev = { value: number; maxStack: number };
    const evaluate = (tokens: string, notation: string) => {
      const r = run("postfix-evaluation", parse("postfix-evaluation", { tokens, notation }));
      return [(r.output as Ev).value, (r.output as Ev).maxStack, r.trace.meta.counters.operations];
    };
    expect(evaluate("5 1 2 + 4 * + 3 -", "postfix")).toEqual([14, 3, 4]);
    expect(evaluate("- + 5 * + 1 2 4 3", "prefix")).toEqual([14, 4, 4]);
    expect(evaluate("2 3 2 ^ ^", "postfix")[0]).toBe(512);
    expect(evaluate("6 2 3 + -", "postfix")[0]).toBe(1);
    expect(evaluate("* - 9 4 + 1 1", "prefix")[0]).toBe(10);
    expect(evaluate("8 2 /", "postfix")[0]).toBe(4);
    expect(evaluate("1 2 + 3 + 4 +", "postfix")[1]).toBe(2);
    expect(evaluate("1 2 3 4 + + +", "postfix")[1]).toBe(4);

    type Et = { value: number; infix: string; height: number };
    const tree = (expr: string) =>
      run("expression-tree", parse("expression-tree", { expr })).output as Et;
    expect(tree("(3 + 4) * (5 - 2)")).toMatchObject({
      value: 21,
      infix: "((3 + 4) * (5 - 2))",
      height: 2,
    });
    expect(tree("2 + 3 * 4 - 6 / 2")).toMatchObject({
      value: 11,
      infix: "((2 + (3 * 4)) - (6 / 2))",
      height: 3,
    });
    expect(tree("2 ^ 3 ^ 2")).toMatchObject({ value: 512, infix: "(2 ^ (3 ^ 2))" });
    expect(tree("2 * 3 + 4").infix).toBe("((2 * 3) + 4)");

    const P = ["A", "B", "C"];
    const moves = (n: number) =>
      (run("tower-of-hanoi", n).output as { moves: [number, number][] }).moves.map(
        ([f, t]) => `${P[f]}${P[t]}`,
      );
    expect(moves(3)).toEqual(["AC", "AB", "CB", "AC", "BA", "BC", "AC"]);
    expect(moves(4)).toHaveLength(15);
    expect(moves(1)).toEqual(["AC"]);
    expect(moves(5)).toHaveLength(31);
    // The largest of 4 disks moves on move 8 (A to C), and nowhere else.
    expect(moves(4)[7]).toBe("AC");
  });

  it("hashing lessons (batch P): worked examples match the engine", async () => {
    const { runAlgorithm } = await import("@/algorithms/run");
    const run = (id: string, value: unknown) => runAlgorithm(getModule(id)!, value);
    const preset = (id: string, presetId: string) =>
      getModule(id)!.input.presets.find((p) => p.id === presetId)!.value as {
        m: number;
        ops: unknown[];
      };
    const probes = (id: string, value: { ops: unknown[] }) =>
      run(id, value).trace.meta.counters.probes ?? 0;
    // Probes made by operation i alone: run the prefixes with and without it.
    const probesOf = (id: string, value: { ops: unknown[] }, i: number) =>
      probes(id, { ...value, ops: value.ops.slice(0, i + 1) }) -
      (i === 0 ? 0 : probes(id, { ...value, ops: value.ops.slice(0, i) }));

    // Separate chaining
    const ch = preset("hash-chaining", "classic");
    const chOut = run("hash-chaining", ch).output;
    expect(chOut.buckets).toEqual([[700], [50, 92], [], [73, 101], [], [], [76]]);
    expect([7, 8, 10].map((i) => probesOf("hash-chaining", ch, i))).toEqual([3, 3, 2]);
    expect(probes("hash-chaining", ch)).toBe(14);
    expect(run("hash-chaining", preset("hash-chaining", "same-bucket")).output.buckets[3]).toEqual([
      3, 8, 13, 18, 23, 28,
    ]);

    // Open addressing: linear vs double hashing on the same keys
    const lin = preset("open-addressing", "classic");
    const dbl = preset("open-addressing", "double");
    expect(run("open-addressing", lin).output.slots).toEqual([
      22,
      33,
      44,
      12,
      23,
      5,
      16,
      null,
      null,
      null,
      null,
    ]);
    expect(run("open-addressing", dbl).output.slots).toEqual([
      22,
      12,
      null,
      null,
      33,
      44,
      5,
      null,
      16,
      23,
      null,
    ]);
    expect([probesOf("open-addressing", lin, 8), probesOf("open-addressing", dbl, 8)]).toEqual([
      3, 2,
    ]);
    expect([probes("open-addressing", lin), probes("open-addressing", dbl)]).toEqual([21, 20]);
    const tomb = run("open-addressing", preset("open-addressing", "tombstone"));
    expect(tomb.output.slots).toEqual([null, null, null, 10, 31, 24, null]);
    expect(tomb.output.results[4]).toBe("found");
    expect(run("open-addressing", preset("open-addressing", "full")).output.results.at(-1)).toBe(
      "full",
    );

    // Robin Hood vs plain linear probing on 13, 1, 12, 23, 34
    const rh = preset("robin-hood-hashing", "classic");
    const rhRun = run("robin-hood-hashing", rh);
    expect(rhRun.output.slots.slice(0, 7)).toEqual([null, 1, 12, 23, 34, 13, null]);
    expect(rhRun.output.dist.slice(0, 7)).toEqual([null, 0, 1, 2, 3, 3, null]);
    expect(rhRun.trace.meta.counters.swaps).toBe(3);
    expect(probesOf("robin-hood-hashing", rh, 5)).toBe(5);
    const linSame = { m: 11, probing: "linear", ops: rh.ops.slice(0, 6) };
    const linOut = run("open-addressing", linSame).output.slots as (number | null)[];
    expect(linOut.slice(0, 7)).toEqual([null, 1, 13, 12, 23, 34, null]);
    const linDist = linOut.flatMap((k, s) => (k === null ? [] : [s - (k % 11)]));
    const rhDist = (rhRun.output.dist as (number | null)[]).flatMap((d) => (d === null ? [] : [d]));
    expect([linDist.reduce((a, b) => a + b), Math.max(...linDist)]).toEqual([9, 4]);
    expect([rhDist.reduce((a, b) => a + b), Math.max(...rhDist)]).toEqual([9, 3]);
    expect(probesOf("open-addressing", linSame, 5)).toBe(6);

    // Cuckoo hashing
    const ck = preset("cuckoo-hashing", "classic");
    const ckRun = run("cuckoo-hashing", ck);
    expect(ckRun.output.t1).toEqual([null, null, null, 52, null, null, null]);
    expect(ckRun.output.t2).toEqual([3, null, 17, 24, null, null, null]);
    expect(ckRun.trace.meta.counters.evictions).toBe(4);
    expect(probesOf("cuckoo-hashing", ck, 6)).toBe(2);
    const cy = preset("cuckoo-hashing", "cycle");
    const cyRun = run("cuckoo-hashing", cy);
    expect(cyRun.output.results).toEqual(["inserted", "inserted", "failed", "missing", "inserted"]);
    const before =
      run("cuckoo-hashing", { ...cy, ops: cy.ops.slice(0, 2) }).trace.meta.counters.evictions ?? 0;
    const after =
      run("cuckoo-hashing", { ...cy, ops: cy.ops.slice(0, 3) }).trace.meta.counters.evictions ?? 0;
    expect(after - before).toBe(6);
  });
});

describe("expert review records", () => {
  it("review records are well formed, and every reviewed entry has one", () => {
    for (const e of ENTRIES) {
      for (const r of e.review.records ?? []) {
        expect(r.reviewer.trim(), e.slug).not.toBe("");
        expect(r.scope.trim(), e.slug).not.toBe("");
        expect(r.date, e.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(r.contentHash, e.slug).toMatch(/^[0-9a-f]{16}$/);
      }
      // A reviewed entry needs a record; if edited since, it shows "Changed since expert review".
      if (e.review.status === "reviewed")
        expect(["reviewed", "stale"], e.slug).toContain(reviewState(e).kind);
    }
  });

  it("detects edits made after a review", () => {
    const base = structuredClone(getEntry("bfs")!);
    expect(reviewState(base).kind).toBe("unreviewed");
    const reviewed = {
      ...base,
      review: {
        status: "reviewed" as const,
        note: "test",
        records: [
          {
            reviewer: "Test Reviewer",
            date: "2026-01-01",
            scope: "everything",
            contentHash: contentHash(base),
          },
        ],
      },
    };
    expect(reviewState(reviewed).kind).toBe("reviewed");
    // Version, date and review metadata are not part of the reviewed content.
    expect(reviewState({ ...reviewed, version: 9, updated: "2027-01-01" }).kind).toBe("reviewed");
    expect(reviewState({ ...reviewed, summary: `${base.summary} Edited.` }).kind).toBe("stale");
    const reordered = {
      ...reviewed,
      problem: { output: base.problem.output, input: base.problem.input },
    };
    expect(reviewState(reordered).kind).toBe("reviewed");
    expect(contentHash(getEntry("bfs")!)).not.toBe(contentHash(getEntry("dfs")!));
  });

  it("hashes text stably (FNV-1a test vectors)", () => {
    expect(fnv1a64("")).toBe("cbf29ce484222325");
    expect(fnv1a64("a")).toBe("af63dc4c8601ec8c");
    expect(fnv1a64("foobar")).toBe("85944171f73967e8");
  });
});
