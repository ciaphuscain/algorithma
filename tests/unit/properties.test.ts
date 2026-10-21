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
import { heapSort } from "@/algorithms/sorting/heap-sort";
import { selectionSort } from "@/algorithms/sorting/selection-sort";
import { kmp } from "@/algorithms/strings/kmp";
import { lcs } from "@/algorithms/dp/lcs";
import { knapsack } from "@/algorithms/dp/knapsack";
import { topologicalSort } from "@/algorithms/graph/topological-sort";

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
  ["selection sort", selectionSort],
  ["heap sort", heapSort],
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

/* -------------------------------------------------------------- strings / DP */

const ab = (max: number, min = 0) =>
  fc.string({ unit: fc.constantFrom("a", "b"), minLength: min, maxLength: max });

describe("KMP properties", () => {
  it("finds exactly the occurrences a naive scan finds, in at most 2n + 2(m − 1) comparisons", () => {
    fc.assert(
      fc.property(ab(24, 1), ab(8, 1), (text, pat) => {
        const { output, trace } = runAlgorithm(kmp, { a: text, b: pat }, { mode: "count" });
        expect(kmp.check({ a: text, b: pat }, output)).toBeNull();
        expect(trace.meta.counters.comparisons).toBeLessThanOrEqual(
          2 * text.length + 2 * (pat.length - 1),
        );
      }),
      { numRuns: 300 },
    );
  });
});

describe("LCS properties", () => {
  it("is symmetric, bounded by the shorter string, and agrees with the oracle", () => {
    fc.assert(
      fc.property(words, words, (a, b) => {
        const x = runAlgorithm(lcs, { a, b }, { mode: "count" }).output;
        const y = runAlgorithm(lcs, { a: b, b: a }, { mode: "count" }).output;
        expect(x.length).toBe(y.length);
        expect(x.length).toBeLessThanOrEqual(Math.min(a.length, b.length));
        expect(lcs.check({ a, b }, x)).toBeNull();
        // Edit distance without substitutions = m + n − 2·LCS ≥ Levenshtein distance.
        expect(a.length + b.length - 2 * x.length).toBeGreaterThanOrEqual(dist(a, b));
      }),
    );
  });
});

describe("knapsack properties", () => {
  it("matches brute force and never decreases with more capacity", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }).chain((n) =>
          fc.record({
            weights: fc.array(fc.integer({ min: 1, max: 10 }), { minLength: n, maxLength: n }),
            values: fc.array(fc.integer({ min: 0, max: 30 }), { minLength: n, maxLength: n }),
            capacity: fc.integer({ min: 0, max: 14 }),
          }),
        ),
        (k) => {
          const a = runAlgorithm(knapsack, k, { mode: "count" }).output;
          expect(knapsack.check(k, a)).toBeNull();
          const b = runAlgorithm(
            knapsack,
            { ...k, capacity: k.capacity + 1 },
            { mode: "count" },
          ).output;
          expect(b.best).toBeGreaterThanOrEqual(a.best);
        },
      ),
    );
  });
});

describe("topological sort properties", () => {
  it("orders every DAG completely with all edges pointing forward", () => {
    // Edges only from lower to higher index guarantee a DAG.
    const dags = fc.integer({ min: 1, max: 10 }).chain((n) => {
      const ids = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
      const pairs = ids.flatMap((a, i) => ids.slice(i + 1).map((b) => [a, b] as const));
      return fc.record({
        ids: fc.constant(ids),
        edges: pairs.length ? fc.subarray(pairs) : fc.constant([] as (readonly [string, string])[]),
      });
    });
    fc.assert(
      fc.property(dags, ({ ids, edges }) => {
        const e = edges.map(([from, to]) => ({ from, to }));
        const g = {
          directed: true,
          weighted: false,
          nodes: layoutGraph(ids, e, { iterations: 5 }),
          edges: e,
          source: ids[0]!,
        };
        const { output } = runAlgorithm(topologicalSort, g);
        expect(output.hasCycle).toBe(false);
        expect(output.order).toHaveLength(ids.length);
        expect(topologicalSort.check(g, output)).toBeNull();
      }),
    );
  });

  it("reports a cycle whenever one edge closes a loop", () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 8 }), (n) => {
        const ids = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
        const e = ids.map((a, i) => ({ from: a, to: ids[(i + 1) % n]! }));
        const g = {
          directed: true,
          weighted: false,
          nodes: layoutGraph(ids, e, { iterations: 5 }),
          edges: e,
          source: "A",
        };
        const { output } = runAlgorithm(topologicalSort, g);
        expect(output.hasCycle).toBe(true);
        expect(output.order).toEqual([]);
      }),
    );
  });
});

/* -------------------------------------------------------------------- trees */

import { bst } from "@/algorithms/trees/bst";
import { segmentTree } from "@/algorithms/trees/segment-tree";
import { binaryTreeTraversals } from "@/algorithms/trees/traversals";
import { trie } from "@/algorithms/trees/trie";
import type { TreeStructure } from "@/engine/protocol";
import { createRng } from "@/lib/random";

const keys = fc.array(fc.integer({ min: -20, max: 20 }), { maxLength: 15 });

describe("BST properties", () => {
  it("behaves like a set, and the search-tree order holds at every intermediate step", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -20, max: 20 }), { minLength: 1, maxLength: 15 }),
        keys,
        keys,
        (ins, sea, rem) => {
          const input = { insert: ins, search: sea.slice(0, 5), remove: rem.slice(0, 5) };
          const { output, trace } = runAlgorithm(bst, input);
          expect(bst.check(input, output)).toBeNull();
          const player = new TracePlayer(trace);
          for (let p = 0; p <= player.length; p += Math.max(1, Math.floor(player.length / 40))) {
            const T = player.stateAt(p).structures.T as TreeStructure;
            const ok = (id: string | null, lo: number, hi: number): boolean => {
              if (id === null) return true;
              const v = T.nodes[id]!.value as number;
              return (
                v >= lo &&
                v <= hi &&
                ok(T.nodes[id]!.children[0] ?? null, lo, v) &&
                ok(T.nodes[id]!.children[1] ?? null, v, hi)
              );
            };
            expect(ok(T.root, -Infinity, Infinity)).toBe(true);
          }
        },
      ),
      { numRuns: 60 },
    );
  });
});

describe("segment tree properties", () => {
  it("answers range sums correctly and visits at most 4 nodes per level per query", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -9, max: 9 }), { minLength: 1, maxLength: 16 }).chain((values) =>
          fc.record({
            values: fc.constant(values),
            ops: fc.array(
              fc
                .integer({ min: 0, max: values.length - 1 })
                .chain((l) =>
                  fc
                    .integer({ min: l, max: values.length - 1 })
                    .map((r) => ({ kind: "sum" as const, l, r })),
                ),
              { minLength: 1, maxLength: 1 },
            ),
          }),
        ),
        (input) => {
          const { output, trace } = runAlgorithm(segmentTree, input, { mode: "count" });
          expect(segmentTree.check(input, output)).toBeNull();
          const height = Math.ceil(Math.log2(input.values.length)) + 1;
          expect(trace.meta.counters["nodes visited"]).toBeLessThanOrEqual(4 * height);
        },
      ),
    );
  });
});

describe("traversal and trie properties", () => {
  it("traversals agree with the oracle on arbitrary tree shapes", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 1, max: 15 }),
        (seed, size) => {
          const tree = binaryTreeTraversals.input.random(createRng(seed), size);
          const { output } = runAlgorithm(binaryTreeTraversals, tree);
          expect(binaryTreeTraversals.check(tree, output)).toBeNull();
          expect([...output.inorder].sort((a, b) => a - b)).toEqual(
            [...output.preorder].sort((a, b) => a - b),
          );
        },
      ),
    );
  });

  it("trie answers match a set of words and its prefixes", () => {
    const w = fc.string({ unit: fc.constantFrom("a", "b", "c"), minLength: 1, maxLength: 5 });
    fc.assert(
      fc.property(
        fc.array(w, { minLength: 1, maxLength: 8 }),
        fc.array(w, { maxLength: 4 }),
        (words, queries) => {
          const input = { words, search: queries, prefixes: queries };
          expect(trie.check(input, runAlgorithm(trie, input).output)).toBeNull();
        },
      ),
    );
  });
});

/* ----------------------------------------------- graphs II, LIS and Fenwick */

import { bellmanFord } from "@/algorithms/graph/bellman-ford";
import { floydWarshall } from "@/algorithms/graph/floyd-warshall";
import { kruskal } from "@/algorithms/graph/kruskal";
import { prim } from "@/algorithms/graph/prim";
import { topologicalSortDfs } from "@/algorithms/graph/topological-sort-dfs";
import { unionFind, type UnionFindOp } from "@/algorithms/graph/union-find";
import { lis } from "@/algorithms/dp/lis";
import { fenwickTree, type FenwickOp } from "@/algorithms/trees/fenwick-tree";

/** Random simple graphs on vertices A, B, … with integer weights in [min, max]. */
const simpleGraphs = (directed: boolean, min: number, max: number, maxNodes = 8) =>
  fc.integer({ min: 1, max: maxNodes }).chain((n) => {
    const ids = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
    const pairs = ids.flatMap((a, i) =>
      ids.flatMap((b, j) => ((directed ? i !== j : i < j) ? [[a, b] as const] : [])),
    );
    return fc
      .record({
        chosen: pairs.length
          ? fc.subarray(pairs)
          : fc.constant([] as (readonly [string, string])[]),
        weights: fc.array(fc.integer({ min, max }), {
          minLength: pairs.length,
          maxLength: pairs.length,
        }),
      })
      .map(({ chosen, weights }): GraphInputValue => {
        const edges = chosen.map(([from, to], i) => ({ from, to, weight: weights[i]! }));
        return {
          directed,
          weighted: true,
          nodes: layoutGraph(ids, edges, { iterations: 5 }),
          edges,
          source: ids[0]!,
        };
      });
  });

describe("minimum spanning tree properties", () => {
  it("Kruskal and Prim agree on the weight of the start vertex's tree", () => {
    fc.assert(
      fc.property(simpleGraphs(false, -9, 9), (g) => {
        const k = runAlgorithm(kruskal, { ...g, source: g.nodes[0]!.id }).output;
        const p = runAlgorithm(prim, g).output;
        expect(kruskal.check(g, k)).toBeNull();
        expect(prim.check(g, p)).toBeNull();
        // On a connected graph both span everything, so the totals coincide.
        if (k.edges.length === g.nodes.length - 1) expect(p.total).toBe(k.total);
      }),
    );
  });

  it("adding a constant to every weight does not change Kruskal's choice", () => {
    fc.assert(
      fc.property(simpleGraphs(false, 0, 9), fc.integer({ min: 1, max: 20 }), (g, c) => {
        const shifted = { ...g, edges: g.edges.map((e) => ({ ...e, weight: e.weight! + c })) };
        const a = runAlgorithm(kruskal, g).output.edges.map(([u, v]) => `${u}-${v}`);
        const b = runAlgorithm(kruskal, shifted).output.edges.map(([u, v]) => `${u}-${v}`);
        expect(b).toEqual(a);
      }),
    );
  });
});

describe("shortest path properties (Bellman–Ford, Floyd–Warshall)", () => {
  it("Bellman–Ford equals Dijkstra when no weight is negative", () => {
    fc.assert(
      fc.property(simpleGraphs(false, 0, 9), (g) => {
        const both = g.edges.flatMap((e) => [e, { from: e.to, to: e.from, weight: e.weight }]);
        const directed = { ...g, directed: true, edges: both };
        const bf = runAlgorithm(bellmanFord, directed).output;
        expect(bf.negativeCycle).toBe(false);
        expect(bf.dist).toEqual(runAlgorithm(dijkstra, g).output.dist);
      }),
    );
  });

  it("each Floyd–Warshall row equals Bellman–Ford from that vertex", () => {
    fc.assert(
      fc.property(simpleGraphs(true, -3, 9, 6), (g) => {
        const fw = runAlgorithm(floydWarshall, g).output;
        expect(floydWarshall.check(g, fw)).toBeNull();
        if (fw.negativeCycle) return;
        fw.ids.forEach((s, i) => {
          const bf = runAlgorithm(bellmanFord, { ...g, source: s }).output;
          expect(fw.ids.map((v) => bf.dist[v])).toEqual(fw.dist[i]);
        });
      }),
    );
  });
});

describe("union-find properties", () => {
  it("agrees with naive connectivity, and ranks stay at most log2 of the set size", () => {
    const ops = (n: number) =>
      fc.array(
        fc.oneof(
          fc.record({ kind: fc.constant("union" as const), a: fc.nat(n - 1), b: fc.nat(n - 1) }),
          fc.record({ kind: fc.constant("find" as const), a: fc.nat(n - 1) }),
          fc.record({
            kind: fc.constant("connected" as const),
            a: fc.nat(n - 1),
            b: fc.nat(n - 1),
          }),
        ),
        { minLength: 1, maxLength: 12 },
      );
    const inputs = fc
      .integer({ min: 2, max: 12 })
      .chain((n) => fc.record({ n: fc.constant(n), ops: ops(n) as fc.Arbitrary<UnionFindOp[]> }));
    fc.assert(
      fc.property(inputs, (input) => {
        const { output } = runAlgorithm(unionFind, input);
        expect(unionFind.check(input, output)).toBeNull();
        for (const r of output.rank) expect(2 ** r).toBeLessThanOrEqual(input.n);
      }),
    );
  });
});

describe("DFS topological sort properties", () => {
  it("agrees with Kahn's algorithm on whether a cycle exists", () => {
    fc.assert(
      fc.property(simpleGraphs(true, 1, 1, 7), (g) => {
        const plain = {
          ...g,
          weighted: false,
          edges: g.edges.map(({ from, to }) => ({ from, to })),
        };
        const dfsOut = runAlgorithm(topologicalSortDfs, plain).output;
        expect(topologicalSortDfs.check(plain, dfsOut)).toBeNull();
        expect(dfsOut.hasCycle).toBe(runAlgorithm(topologicalSort, plain).output.hasCycle);
      }),
    );
  });
});

describe("LIS properties", () => {
  it("matches the O(n²) oracle; strictly increasing input is its own LIS", () => {
    const values = fc.array(fc.integer({ min: -20, max: 20 }), { minLength: 1, maxLength: 16 });
    fc.assert(
      fc.property(values, (a) => {
        const out = runAlgorithm(lis, a).output;
        expect(lis.check(a, out)).toBeNull();
        const strict = [...new Set(a)].sort((x, y) => x - y);
        expect(runAlgorithm(lis, strict).output.length).toBe(strict.length);
      }),
    );
  });

  it("uses at most n·⌈log2(n + 1)⌉ comparisons", () => {
    const values = fc.array(fc.integer({ min: -99, max: 99 }), { minLength: 1, maxLength: 16 });
    fc.assert(
      fc.property(values, (a) => {
        const { counters } = runAlgorithm(lis, a, { mode: "count" }).trace.meta;
        expect(counters.comparisons ?? 0).toBeLessThanOrEqual(
          a.length * Math.ceil(Math.log2(a.length + 1)),
        );
      }),
    );
  });
});

describe("Fenwick tree properties", () => {
  it("matches naive sums and touches at most ⌊log2 n⌋ + 1 entries per prefix walk or update", () => {
    const inputs = fc.integer({ min: 1, max: 16 }).chain((n) =>
      fc.record({
        values: fc.array(fc.integer({ min: -99, max: 99 }), { minLength: n, maxLength: n }),
        ops: fc.array(
          fc.oneof(
            fc.record({
              kind: fc.constant("add" as const),
              i: fc.integer({ min: 1, max: n }),
              x: fc.integer({ min: -9, max: 9 }),
            }),
            fc
              .tuple(fc.integer({ min: 1, max: n }), fc.integer({ min: 1, max: n }))
              .map(([x, y]) => ({ kind: "sum" as const, l: Math.min(x, y), r: Math.max(x, y) })),
          ),
          { maxLength: 6 },
        ) as fc.Arbitrary<FenwickOp[]>,
      }),
    );
    fc.assert(
      fc.property(inputs, (input) => {
        const { output, trace } = runAlgorithm(fenwickTree, input, { mode: "count" });
        expect(fenwickTree.check(input, output)).toBeNull();
        const walks = input.ops.reduce((k, o) => k + (o.kind === "sum" && o.l > 1 ? 2 : 1), 0);
        const bound = walks * (Math.floor(Math.log2(input.values.length)) + 1);
        expect(trace.meta.counters["nodes visited"] ?? 0).toBeLessThanOrEqual(bound);
      }),
    );
  });
});
