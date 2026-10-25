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
    expect(slugs({ query: "bubble" })).toEqual(["bubble-sort"]);
    // Level-order traversal, Dinic and Hopcroft–Karp are tagged "bfs" too, but the
    // algorithm named BFS ranks first.
    const bfsHits = slugs({ query: "BFS" });
    expect(bfsHits[0]).toBe("bfs");
    expect([...bfsHits].sort()).toEqual(["bfs", "dinic", "hopcroft-karp", "tree-traversals"]);
    expect(slugs({ query: "levenshtein" })).toEqual(["edit-distance"]);
    expect(slugs({ query: "shortest path" })).toEqual(expect.arrayContaining(["bfs", "dijkstra"]));
    expect(slugs({ query: "stable sort" }).sort()).toEqual([
      "bubble-sort",
      "insertion-sort",
      "merge-sort",
    ]);
  });

  it("requires every term to match", () => {
    expect(searchCatalog({ query: "bubble graph" })).toEqual([]);
  });

  it("filters by complexity bound and domain", () => {
    expect(slugs({ maxWorst: "n log n" }).sort()).toEqual([
      "a-star",
      "aho-corasick",
      "bfs",
      "binary-lifting",
      "binary-search",
      "bridges-articulation",
      "bst",
      "closest-pair",
      "convex-hull-trick",
      "crt",
      "dfs",
      "dijkstra",
      "fenwick-tree",
      "fft",
      "graham-scan",
      "heap-sort",
      "heavy-light",
      "kd-tree",
      "kmp",
      "kosaraju",
      "kruskal",
      "linear-search",
      "lis",
      "manacher",
      "mapreduce",
      "matrix-exponentiation",
      "merge-sort",
      "miller-rabin",
      "monotonic-queue",
      "monotonic-stack",
      "ntt",
      "prefix-sums",
      "prim",
      "segment-tree",
      "sliding-window",
      "sparse-table",
      "suffix-array",
      "suffix-automaton",
      "suffix-tree",
      "tarjan-scc",
      "topological-sort",
      "topological-sort-dfs",
      "tree-traversals",
      "trie",
      "two-pointers",
      "union-find",
    ]);
    expect(slugs({ maxWorst: "log n" }).sort()).toEqual([
      "binary-search",
      "crt",
      "fenwick-tree",
      "matrix-exponentiation",
      "miller-rabin",
      "segment-tree",
      "union-find",
    ]);
    expect(slugs({ domain: "searching-sorting" }).sort()).toEqual([
      "binary-search",
      "bubble-sort",
      "heap-sort",
      "insertion-sort",
      "linear-search",
      "merge-sort",
      "quick-sort",
      "selection-sort",
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
