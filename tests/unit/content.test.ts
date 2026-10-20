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
  it("finds entries by name, alias and tag", () => {
    expect(searchCatalog({ query: "bubble" }).map((e) => e.slug)).toEqual(["bubble-sort"]);
    expect(searchCatalog({ query: "BFS" }).map((e) => e.slug)).toEqual(["bfs"]);
    expect(searchCatalog({ query: "shortest path" }).map((e) => e.slug)).toContain("bfs");
    expect(searchCatalog({ query: "stable sort" }).map((e) => e.slug)).toEqual(["bubble-sort"]);
  });

  it("requires every term to match", () => {
    expect(searchCatalog({ query: "bubble graph" })).toEqual([]);
  });

  it("filters by complexity bound and domain", () => {
    expect(searchCatalog({ maxWorst: "n log n" }).map((e) => e.slug)).toEqual(["bfs"]);
    expect(searchCatalog({ domain: "searching-sorting" }).map((e) => e.slug)).toEqual([
      "bubble-sort",
    ]);
  });

  it("links curriculum items, including duplicates, to entries", () => {
    expect(entryForItem(11)?.slug).toBe("bubble-sort");
    expect(entryForItem(201)?.slug).toBe("bfs");
    expect(entryForItem(1)).toBeUndefined();
    expect(getEntry("nope")).toBeUndefined();
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
});
