import { execFileSync } from "node:child_process";
import katex from "katex";
import { describe, expect, it } from "vitest";
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
    expect(slugs({ query: "BFS" })).toEqual(["bfs"]);
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
      "bfs",
      "binary-search",
      "dfs",
      "dijkstra",
      "merge-sort",
    ]);
    expect(slugs({ maxWorst: "log n" })).toEqual(["binary-search"]);
    expect(slugs({ domain: "searching-sorting" }).sort()).toEqual([
      "binary-search",
      "bubble-sort",
      "insertion-sort",
      "merge-sort",
      "quick-sort",
    ]);
  });

  it("links curriculum items, including duplicates, to entries", () => {
    expect(entryForItem(11)?.slug).toBe("bubble-sort");
    expect(entryForItem(201)?.slug).toBe("bfs");
    expect(entryForItem(330)?.slug).toBe("edit-distance"); // duplicate of #276
    expect(entryForItem(1)).toBeUndefined();
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
});
