/**
 * Property-based tests. Example-based conformance checks show behaviour on chosen
 * inputs; these search the input space (fast-check shrinks any failure to a minimal
 * counterexample). Passing them is empirical evidence, not a proof of correctness.
 */
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { bfs } from "@/algorithms/graph/bfs";
import { bubbleSort } from "@/algorithms/sorting/bubble-sort";
import { runAlgorithm } from "@/algorithms/run";
import type { GraphInputValue } from "@/algorithms/inputs";
import { layoutGraph } from "@/lib/graph-layout";
import { TracePlayer } from "@/engine/player";

const arrays = fc.array(fc.integer({ min: -999, max: 999 }), { minLength: 1, maxLength: 40 });

describe("bubble sort properties", () => {
  it("output is ordered and a permutation of the input", () => {
    fc.assert(
      fc.property(arrays, (input) => {
        const { output } = runAlgorithm(bubbleSort, input);
        for (let i = 1; i < output.length; i++)
          expect(output[i - 1]!).toBeLessThanOrEqual(output[i]!);
        expect([...output].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
      }),
    );
  });

  it("comparisons are exactly n(n−1)/2 and swaps equal the inversion count", () => {
    fc.assert(
      fc.property(arrays, (input) => {
        const { trace } = runAlgorithm(bubbleSort, input, { mode: "count" });
        const n = input.length;
        let inversions = 0;
        for (let i = 0; i < n; i++)
          for (let j = i + 1; j < n; j++) if (input[i]! > input[j]!) inversions++;
        expect(trace.meta.counters.comparisons).toBe((n * (n - 1)) / 2);
        expect(trace.meta.counters.swaps).toBe(inversions);
      }),
    );
  });

  it("every intermediate state is a permutation of the input (no element is lost mid-animation)", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 20 }), { minLength: 1, maxLength: 12 }),
        (input) => {
          const { trace } = runAlgorithm(bubbleSort, input);
          const player = new TracePlayer(trace);
          const sorted = [...input].sort((a, b) => a - b);
          for (let p = 0; p <= player.length; p++) {
            const A = player.stateAt(p).structures.A!;
            if (A.kind !== "array") throw new Error("A is not an array");
            expect([...(A.values as number[])].sort((a, b) => a - b)).toEqual(sorted);
          }
        },
      ),
      { numRuns: 50 },
    );
  });
});

const graphs: fc.Arbitrary<GraphInputValue> = fc
  .integer({ min: 1, max: 12 })
  .chain((n) => {
    const ids = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
    const pairs = ids.flatMap((a, i) => ids.slice(i + 1).map((b) => [a, b] as const));
    return fc.record({
      ids: fc.constant(ids),
      edges: pairs.length ? fc.subarray(pairs) : fc.constant([] as (readonly [string, string])[]),
      source: fc.constantFrom(...ids),
    });
  })
  .map(({ ids, edges, source }) => {
    const e = edges.map(([from, to]) => ({ from, to }));
    return {
      directed: false,
      weighted: false,
      nodes: layoutGraph(ids, e, { iterations: 5 }),
      edges: e,
      source,
    };
  });

describe("BFS properties", () => {
  it("distances satisfy the edge constraint |d(u) − d(v)| ≤ 1 and reachability is symmetric", () => {
    fc.assert(
      fc.property(graphs, (g) => {
        const { output } = runAlgorithm(bfs, g);
        expect(output.dist[g.source]).toBe(0);
        for (const { from, to } of g.edges) {
          const a = output.dist[from]!;
          const b = output.dist[to]!;
          // In an undirected graph, an edge never joins a reachable and an unreachable vertex.
          expect(a === null).toBe(b === null);
          if (a !== null && b !== null) expect(Math.abs(a - b)).toBeLessThanOrEqual(1);
        }
        expect(bfs.check(g, output)).toBeNull();
      }),
    );
  });

  it("dequeues every reachable vertex exactly once", () => {
    fc.assert(
      fc.property(graphs, (g) => {
        const { output } = runAlgorithm(bfs, g);
        const reachable = Object.entries(output.dist)
          .filter(([, d]) => d !== null)
          .map(([v]) => v);
        expect([...output.order].sort()).toEqual(reachable.sort());
      }),
    );
  });
});

/* ---------------------------------------------------------------- all sorts */

import { insertionSort } from "@/algorithms/sorting/insertion-sort";
import { mergeSort } from "@/algorithms/sorting/merge-sort";
import { quickSort } from "@/algorithms/sorting/quick-sort";
import { binarySearch } from "@/algorithms/searching/binary-search";
import { dfs } from "@/algorithms/graph/dfs";
import { dijkstra } from "@/algorithms/graph/dijkstra";
import { editDistance } from "@/algorithms/dp/edit-distance";

const inversions = (a: number[]) => {
  let count = 0;
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++) if (a[i]! > a[j]!) count++;
  return count;
};

describe.each([
  ["bubble sort", bubbleSort],
  ["insertion sort", insertionSort],
  ["merge sort", mergeSort],
  ["quick sort", quickSort],
] as const)("%s mark semantics", (_name, sort) => {
  it("a position marked 'sorted' already holds its final value, and keeps it", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 30 }), { minLength: 1, maxLength: 14 }),
        (input) => {
          const { trace } = runAlgorithm(sort, input);
          const final = [...input].sort((a, b) => a - b);
          const player = new TracePlayer(trace);
          for (let p = 0; p <= player.length; p++) {
            const A = player.stateAt(p).structures.A!;
            if (A.kind !== "array") throw new Error("A is not an array");
            A.marks.forEach((m, i) => {
              if (m === "sorted") expect(A.values[i], `position ${i} at step ${p}`).toBe(final[i]);
            });
            expect(A.marks.filter((m) => m === "pivot").length).toBeLessThanOrEqual(1);
          }
        },
      ),
      { numRuns: 40 },
    );
  });
});

describe("operation-count properties", () => {
  it("insertion sort writes = inversions + (n − 1)", () => {
    fc.assert(
      fc.property(arrays, (input) => {
        const { trace } = runAlgorithm(insertionSort, input, { mode: "count" });
        expect(trace.meta.counters.writes).toBe(inversions(input) + input.length - 1);
      }),
    );
  });

  it("merge sort makes at most n⌈log₂ n⌉ comparisons", () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1, maxLength: 32 }), (input) => {
        const { trace } = runAlgorithm(mergeSort, input, { mode: "count" });
        const n = input.length;
        expect(trace.meta.counters.comparisons).toBeLessThanOrEqual(n * Math.ceil(Math.log2(n)));
      }),
    );
  });

  it("quick sort (Lomuto, last pivot) makes exactly n(n−1)/2 comparisons on sorted input", () => {
    for (let n = 1; n <= 40; n++) {
      const input = Array.from({ length: n }, (_, i) => i);
      const { trace } = runAlgorithm(quickSort, input, { mode: "count" });
      expect(trace.meta.counters.comparisons).toBe((n * (n - 1)) / 2);
    }
  });

  it("binary search makes at most ⌊log₂ n⌋ + 1 comparisons and is correct", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -50, max: 50 }), { minLength: 1, maxLength: 40 }),
        fc.integer({ min: -60, max: 60 }),
        (raw, target) => {
          const values = [...raw].sort((a, b) => a - b);
          const { output, trace } = runAlgorithm(binarySearch, { values, target });
          expect(trace.meta.counters.comparisons).toBeLessThanOrEqual(
            Math.floor(Math.log2(values.length)) + 1,
          );
          expect(binarySearch.check({ values, target }, output)).toBeNull();
        },
      ),
    );
  });
});

/* ----------------------------------------------------------- weighted graphs */

const weightedGraphs: fc.Arbitrary<GraphInputValue> = fc
  .integer({ min: 1, max: 10 })
  .chain((n) => {
    const ids = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
    const pairs = ids.flatMap((a, i) => ids.slice(i + 1).map((b) => [a, b] as const));
    return fc.record({
      ids: fc.constant(ids),
      edges: pairs.length
        ? fc
            .subarray(pairs)
            .chain((sub) =>
              fc.tuple(
                ...sub.map((p) => fc.tuple(fc.constant(p), fc.integer({ min: 0, max: 20 }))),
              ),
            )
        : fc.constant([] as [readonly [string, string], number][]),
      source: fc.constantFrom(...ids),
    });
  })
  .map(({ ids, edges, source }) => {
    const e = edges.map(([[from, to], weight]) => ({ from, to, weight }));
    return {
      directed: false,
      weighted: true,
      nodes: layoutGraph(ids, e, { iterations: 5 }),
      edges: e,
      source,
    };
  });

describe("graph search properties", () => {
  it("Dijkstra agrees with Bellman–Ford and satisfies the triangle inequality on every edge", () => {
    fc.assert(
      fc.property(weightedGraphs, (g) => {
        const { output } = runAlgorithm(dijkstra, g);
        expect(dijkstra.check(g, output)).toBeNull();
        for (const { from, to, weight } of g.edges) {
          const [a, b] = [output.dist[from]!, output.dist[to]!];
          if (a !== null && b !== null) {
            expect(b).toBeLessThanOrEqual(a + weight!);
            expect(a).toBeLessThanOrEqual(b + weight!);
          }
        }
      }),
    );
  });

  it("DFS discovery/finish intervals satisfy the parenthesis theorem", () => {
    fc.assert(
      fc.property(graphs, (g) => {
        const { output } = runAlgorithm(dfs, g);
        expect(dfs.check(g, output)).toBeNull();
        const found = Object.keys(output.disc).filter((v) => output.disc[v] !== null);
        for (const u of found)
          for (const v of found) {
            if (u === v) continue;
            const [du, fu, dv, fv] = [
              output.disc[u]!,
              output.fin[u]!,
              output.disc[v]!,
              output.fin[v]!,
            ];
            const disjoint = fu < dv || fv < du;
            const nested = (du < dv && fv < fu) || (dv < du && fu < fv);
            expect(disjoint || nested).toBe(true);
          }
      }),
    );
  });
});

/* -------------------------------------------------------------- edit distance */

const words = fc.string({ unit: fc.constantFrom("a", "b", "c", "d"), maxLength: 8 });
const dist = (a: string, b: string) =>
  runAlgorithm(editDistance, { a, b }, { mode: "count" }).output.distance;

describe("edit distance is a metric", () => {
  it("identity, symmetry, bounds", () => {
    fc.assert(
      fc.property(words, words, (a, b) => {
        const d = dist(a, b);
        expect(d === 0).toBe(a === b);
        expect(d).toBe(dist(b, a));
        expect(d).toBeGreaterThanOrEqual(Math.abs(a.length - b.length));
        expect(d).toBeLessThanOrEqual(Math.max(a.length, b.length));
      }),
    );
  });

  it("triangle inequality", () => {
    fc.assert(
      fc.property(words, words, words, (a, b, c) => {
        expect(dist(a, c)).toBeLessThanOrEqual(dist(a, b) + dist(b, c));
      }),
      { numRuns: 60 },
    );
  });
});
