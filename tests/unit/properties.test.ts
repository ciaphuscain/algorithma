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
import { cross } from "@/algorithms/geometry/common";
import { grahamScan } from "@/algorithms/geometry/graham-scan";
import { closestPair } from "@/algorithms/geometry/closest-pair";
import { kdTree } from "@/algorithms/geometry/kd-tree";
import { quickselect } from "@/algorithms/randomized/quickselect";
import { mcts } from "@/algorithms/ai/mcts";
import { gradientDescent } from "@/algorithms/ml/gradient-descent";
import { paxos } from "@/algorithms/distributed/paxos";
import { raft } from "@/algorithms/distributed/raft";
import { mapReduce } from "@/algorithms/distributed/mapreduce";
import { shellSort, knuthGaps } from "@/algorithms/sorting/shell-sort";
import { countingSort } from "@/algorithms/sorting/counting-sort";
import { radixSort } from "@/algorithms/sorting/radix-sort";
import { sieve } from "@/algorithms/maths/sieve";
import { euclid } from "@/algorithms/maths/euclid";
import { hashChaining } from "@/algorithms/hashing/chaining";
import { openAddressing, probe } from "@/algorithms/hashing/open-addressing";
import { robinHood } from "@/algorithms/hashing/robin-hood";
import { cuckooHashing } from "@/algorithms/hashing/cuckoo";
import type { HashOp } from "@/algorithms/hashing/common";
import { rabinKarp } from "@/algorithms/strings/rabin-karp";
import { consistentHashing } from "@/algorithms/hashing/consistent-hashing";
import { rendezvousHashing } from "@/algorithms/hashing/rendezvous-hashing";
import { zobrist } from "@/algorithms/hashing/zobrist";
import { reverseList } from "@/algorithms/lists/reverse";
import { floydCycle } from "@/algorithms/lists/floyd-cycle";
import { mergeLists } from "@/algorithms/lists/merge-lists";
import { listTwoPointers } from "@/algorithms/lists/list-two-pointers";
import { shuntingYard } from "@/algorithms/stacks/shunting-yard";
import { rpnEval } from "@/algorithms/stacks/rpn-eval";
import { expressionTree } from "@/algorithms/stacks/expression-tree";
import { hanoi } from "@/algorithms/stacks/hanoi";
import { balancedBrackets } from "@/algorithms/stacks/balanced-brackets";
import { evalPostfix, postfixByDescent, type Op, type Token } from "@/algorithms/stacks/expr";
import { stackQueueAdapters } from "@/algorithms/queues/adapters";
import { minStack } from "@/algorithms/queues/min-stack";
import { circularQueue } from "@/algorithms/queues/circular-queue";
import { deque } from "@/algorithms/queues/deque";
import { binaryHeap } from "@/algorithms/queues/binary-heap";
import type { Op as ContainerOp } from "@/algorithms/ops";
import { avlTree } from "@/algorithms/trees/balanced/avl";
import { redBlackTree } from "@/algorithms/trees/balanced/red-black";
import { splayTree } from "@/algorithms/trees/balanced/splay";
import { treap } from "@/algorithms/trees/balanced/treap";
import { aaTree } from "@/algorithms/trees/balanced/aa";
import { scapegoatTree } from "@/algorithms/trees/balanced/scapegoat";
import { bTree } from "@/algorithms/trees/btree/btree";
import { bPlusTree } from "@/algorithms/trees/btree/bplus";
import { bStarTree, bStarLimits } from "@/algorithms/trees/btree/bstar";
import { morrisTraversal } from "@/algorithms/trees/morris";
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
  ["shell sort", shellSort],
  ["radix sort", radixSort],
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

/* ------------------------------------------------------- array techniques */

import { prefixSums } from "@/algorithms/arrays/prefix-sums";
import { slidingWindow } from "@/algorithms/arrays/sliding-window";
import { twoPointers } from "@/algorithms/arrays/two-pointers";
import { monotonicStack } from "@/algorithms/arrays/monotonic-stack";
import { monotonicQueue } from "@/algorithms/arrays/monotonic-queue";
import { sparseTable } from "@/algorithms/arrays/sparse-table";

const ranged = (maxN: number) =>
  fc.integer({ min: 1, max: maxN }).chain((n) =>
    fc.record({
      values: fc.array(fc.integer({ min: -99, max: 99 }), { minLength: n, maxLength: n }),
      queries: fc.array(
        fc
          .tuple(fc.integer({ min: 0, max: n - 1 }), fc.integer({ min: 0, max: n - 1 }))
          .map(([a, b]): [number, number] => [Math.min(a, b), Math.max(a, b)]),
        { maxLength: 6 },
      ),
    }),
  );

describe("array technique properties", () => {
  it("prefix sums: correct, and every range costs exactly two reads of P", () => {
    fc.assert(
      fc.property(ranged(16), (input) => {
        const { output, trace } = runAlgorithm(prefixSums, input, { mode: "count" });
        expect(prefixSums.check(input, output)).toBeNull();
        expect(trace.meta.counters.reads).toBe(input.values.length + 2 * input.queries.length);
      }),
    );
  });

  it("sparse table: correct, n·⌊lg n⌋-sized build, and two table reads per query", () => {
    fc.assert(
      fc.property(ranged(16), (input) => {
        const { output, trace } = runAlgorithm(sparseTable, input, { mode: "count" });
        expect(sparseTable.check(input, output)).toBeNull();
        const n = input.values.length;
        let blocks = 0;
        for (let j = 1; 2 ** j <= n; j++) blocks += n - 2 ** j + 1;
        expect(trace.meta.counters.writes).toBe(n + blocks);
        expect(trace.meta.counters.reads).toBe(2 * blocks + 2 * input.queries.length);
      }),
    );
  });

  it("sliding window: matches brute force and reads each element at most twice", () => {
    const inputs = fc.record({
      values: fc.array(fc.integer({ min: 1, max: 20 }), { minLength: 1, maxLength: 20 }),
      target: fc.integer({ min: 1, max: 150 }),
    });
    fc.assert(
      fc.property(inputs, (input) => {
        const { output, trace } = runAlgorithm(slidingWindow, input, { mode: "count" });
        expect(slidingWindow.check(input, output)).toBeNull();
        expect(trace.meta.counters.reads).toBeLessThanOrEqual(2 * input.values.length);
      }),
    );
  });

  it("two pointers: agrees with brute force within n − 1 pair checks", () => {
    const inputs = fc.record({
      values: fc
        .array(fc.integer({ min: -30, max: 30 }), { minLength: 2, maxLength: 20 })
        .map((v) => v.sort((a, b) => a - b)),
      target: fc.integer({ min: -60, max: 60 }),
    });
    fc.assert(
      fc.property(inputs, (input) => {
        const { output, trace } = runAlgorithm(twoPointers, input, { mode: "count" });
        expect(twoPointers.check(input, output)).toBeNull();
        expect(trace.meta.counters["pair checks"] ?? 0).toBeLessThanOrEqual(
          input.values.length - 1,
        );
      }),
    );
  });

  it("monotonic stack and queue: correct, with at most 2n comparisons", () => {
    const values = fc.array(fc.integer({ min: -9, max: 9 }), { minLength: 1, maxLength: 16 });
    fc.assert(
      fc.property(values, fc.integer({ min: 1, max: 16 }), (a, k0) => {
        const stack = runAlgorithm(monotonicStack, a, { mode: "count" });
        expect(monotonicStack.check(a, stack.output)).toBeNull();
        expect(stack.trace.meta.counters.comparisons).toBeLessThanOrEqual(2 * a.length - 1);
        const input = { values: a, k: Math.min(k0, a.length) };
        const queue = runAlgorithm(monotonicQueue, input, { mode: "count" });
        expect(monotonicQueue.check(input, queue.output)).toBeNull();
        expect(queue.trace.meta.counters.comparisons).toBeLessThanOrEqual(2 * a.length);
      }),
    );
  });
});

/* --------------------------------------------------------------- graphs III */

import { kosaraju } from "@/algorithms/graph/kosaraju";
import { tarjanScc } from "@/algorithms/graph/tarjan-scc";
import { bridges } from "@/algorithms/graph/bridges";
import { aStar } from "@/algorithms/graph/a-star";

describe("strongly connected components, bridges and A*", () => {
  const plainGraphs = (directed: boolean) =>
    simpleGraphs(directed, 1, 1, 8).map((g) => ({
      ...g,
      weighted: false,
      edges: g.edges.map(({ from, to }) => ({ from, to })),
    }));

  it("Kosaraju and Tarjan find the same components, in opposite topological orders", () => {
    fc.assert(
      fc.property(plainGraphs(true), (g) => {
        const k = runAlgorithm(kosaraju, g).output;
        const t = runAlgorithm(tarjanScc, g).output;
        expect(kosaraju.check(g, k)).toBeNull();
        expect(tarjanScc.check(g, t)).toBeNull();
        const norm = (cs: string[][]) => cs.map((c) => [...c].sort().join("")).sort();
        expect(norm(k.components)).toEqual(norm(t.components));
      }),
    );
  });

  it("bridges and articulation points match deletion-based brute force", () => {
    fc.assert(
      fc.property(plainGraphs(false), (g) => {
        expect(bridges.check(g, runAlgorithm(bridges, g).output)).toBeNull();
      }),
    );
  });

  it("A* returns a shortest path on random maps, never expanding more cells than are reachable", () => {
    const maps = fc
      .record({
        rows: fc.integer({ min: 1, max: 8 }),
        cols: fc.integer({ min: 2, max: 12 }),
        seed: fc.integer({ min: 0, max: 1_000_000 }),
      })
      .map(({ rows, cols, seed }) => {
        const rng = createRng(seed);
        const cells = Array.from({ length: rows }, () =>
          Array.from({ length: cols }, (): string => (rng.next() < 0.3 ? "#" : ".")),
        );
        const s = rng.int(0, rows * cols - 1);
        let goal = rng.int(0, rows * cols - 1);
        if (goal === s) goal = (s + 1) % (rows * cols);
        cells[Math.floor(s / cols)]![s % cols] = "S";
        cells[Math.floor(goal / cols)]![goal % cols] = "G";
        return { rows: cells.map((r) => r.join("")) };
      });
    fc.assert(
      fc.property(maps, (map) => {
        const out = runAlgorithm(aStar, map, { mode: "count" }).output;
        expect(aStar.check(map, out)).toBeNull();
        const free = map.rows.join("").replace(/#/g, "").length;
        expect(out.expanded).toBeLessThanOrEqual(free);
      }),
      { numRuns: 300 },
    );
  });
});

/* ------------------------------------------------------------------ strings */

import { manacher } from "@/algorithms/strings/manacher";
import { ahoCorasick } from "@/algorithms/strings/aho-corasick";
import { suffixArray } from "@/algorithms/strings/suffix-array";
import { suffixTree } from "@/algorithms/strings/suffix-tree";
import { suffixAutomaton } from "@/algorithms/strings/suffix-automaton";

describe("string algorithm properties", () => {
  const words = (alphabet: string, maxLength: number) =>
    fc
      .array(fc.constantFrom(...alphabet), { minLength: 1, maxLength })
      .map((letters) => letters.join(""));

  it("Manacher: matches brute force within 2m − 1 comparisons on the m = 2n + 1 letters of T", () => {
    fc.assert(
      fc.property(words("ab", 14), (s) => {
        const { output, trace } = runAlgorithm(manacher, s, { mode: "count" });
        expect(manacher.check(s, output)).toBeNull();
        expect(trace.meta.counters.comparisons).toBeLessThanOrEqual(2 * (2 * s.length + 1) - 1);
      }),
      { numRuns: 300 },
    );
  });

  it("Aho–Corasick: matches naive search; failure steps ≤ text length + total pattern length", () => {
    const inputs = fc.record({
      patterns: fc.uniqueArray(words("ab", 4), { minLength: 1, maxLength: 5 }),
      text: words("ab", 16),
    });
    fc.assert(
      fc.property(inputs, (input) => {
        const { output, trace } = runAlgorithm(ahoCorasick, input, { mode: "count" });
        expect(ahoCorasick.check(input, output)).toBeNull();
        const total = input.patterns.reduce((sum, p) => sum + p.length, 0);
        expect(trace.meta.counters["failure steps"] ?? 0).toBeLessThanOrEqual(
          input.text.length + total,
        );
      }),
      { numRuns: 300 },
    );
  });

  it("suffix array, suffix tree and suffix automaton agree with each other and stay within their size bounds", () => {
    fc.assert(
      fc.property(words("abc", 8), (s) => {
        const n = s.length;
        const sa = runAlgorithm(suffixArray, s, { mode: "count" }).output;
        const tree = runAlgorithm(suffixTree, s, { mode: "count" }).output;
        const dawg = runAlgorithm(suffixAutomaton, s, { mode: "count" }).output;
        expect(suffixArray.check(s, sa)).toBeNull();
        expect(suffixTree.check(s, tree)).toBeNull();
        expect(suffixAutomaton.check(s, dawg)).toBeNull();
        expect(sa.rounds).toBeLessThanOrEqual(Math.ceil(Math.log2(n)));
        // "$" sorts before every letter, so the tree's leaves read "$" first, then SA.
        expect(tree.order).toEqual([n, ...sa.sa]);
        expect(tree.nodes).toBeLessThanOrEqual(2 * (n + 1));
        expect(dawg.distinct).toBe(tree.distinct);
        expect(dawg.len.length).toBeLessThanOrEqual(Math.max(2, 2 * n - 1));
        const transitions = dawg.next.reduce((sum, m) => sum + Object.keys(m).length, 0);
        if (n >= 3) expect(transitions).toBeLessThanOrEqual(3 * n - 4);
      }),
      { numRuns: 300 },
    );
  });
});

/* ------------------------------------------------------- trees and maths II */

import { binaryLifting, liftRows } from "@/algorithms/trees/binary-lifting";
import { heavyLight } from "@/algorithms/trees/heavy-light";
import { rootTree, type TreeQueryInput } from "@/algorithms/trees/rooted";
import { matrixExponentiation } from "@/algorithms/maths/matrix-exponentiation";
import { memoVsTab } from "@/algorithms/dp/memo-vs-tab";

describe("binary lifting, heavy-light decomposition, matrix powers, memoization", () => {
  const trees = fc
    .record({
      n: fc.integer({ min: 1, max: 16 }),
      seed: fc.integer({ min: 0, max: 1_000_000 }),
    })
    .map(({ n, seed }): TreeQueryInput => {
      const rng = createRng(seed);
      const names = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
      // Mostly long, thin trees (deep lifts) mixed with bushy ones.
      const edges = names
        .slice(1)
        .map((v, i): [string, string] => [names[rng.next() < 0.6 ? i : rng.int(0, i)]!, v]);
      const pick = () => names[rng.int(0, n - 1)]!;
      const queries = Array.from({ length: 4 }, (): [string, string] => [pick(), pick()]);
      const values = Object.fromEntries(names.map((v) => [v, rng.int(-9, 9)]));
      return { edges, root: names[rng.int(0, n - 1)]!, queries, values };
    });

  it("binary lifting: LCAs match parent walking, within 3K + 1 lookups per query", () => {
    fc.assert(
      fc.property(trees, (input) => {
        const { output, trace } = runAlgorithm(binaryLifting, input, { mode: "count" });
        expect(binaryLifting.check(input, output)).toBeNull();
        const { order, depth } = rootTree(input.edges, input.root);
        const K = liftRows(Math.max(...order.map((v) => depth[v]!)));
        const build = 2 * (K - 1) * order.length;
        expect(trace.meta.counters.reads).toBeLessThanOrEqual(
          build + input.queries.length * (3 * K + 1),
        );
      }),
      { numRuns: 400 },
    );
  });

  it("heavy-light: path sums match parent walking, within 2⌊log₂ n⌋ + 1 ranges per path", () => {
    fc.assert(
      fc.property(trees, (input) => {
        const { output } = runAlgorithm(heavyLight, input, { mode: "count" });
        expect(heavyLight.check(input, output)).toBeNull();
      }),
      { numRuns: 400 },
    );
  });

  it("matrix exponentiation: F(n) mod m with ⌊log₂ n⌋ + popcount(n) multiplications", () => {
    const inputs = fc.record({
      n: fc.oneof(fc.integer({ min: 0, max: 100 }), fc.integer({ min: 0, max: 1e12 })),
      m: fc.integer({ min: 2, max: 1e6 }),
    });
    fc.assert(
      fc.property(inputs, (input) => {
        const { output } = runAlgorithm(matrixExponentiation, input, { mode: "count" });
        expect(matrixExponentiation.check(input, output)).toBeNull();
        expect(output.multiplications).toBeLessThanOrEqual(2 * Math.log2(Math.max(1, input.n)) + 1);
      }),
      { numRuns: 300 },
    );
  });

  it("memoization touches 1 + k(k + 1)/2 fewer subproblems than the table fills, for every n ≤ 12", () => {
    for (let n = 0; n <= 12; n++)
      for (let k = 0; k <= n; k++) {
        const { output } = runAlgorithm(memoVsTab, { n, k }, { mode: "count" });
        expect(memoVsTab.check({ n, k }, output)).toBeNull();
        if (k > 0 && k < n)
          expect(output.tableCells - output.memoStates).toBe(1 + (k * (k + 1)) / 2);
        else expect(output.memoStates).toBe(1);
      }
  });
});

/* ------------------------------------------------------------- number theory */

import { millerRabin } from "@/algorithms/maths/miller-rabin";
import { pollardRho } from "@/algorithms/maths/pollard-rho";
import { crt } from "@/algorithms/maths/crt";
import { ntt } from "@/algorithms/maths/ntt";
import { fft } from "@/algorithms/maths/fft";

describe("number theory properties", () => {
  const smallestFactor = (n: number) => {
    for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
    return n;
  };

  it("Miller–Rabin with bases 2–13 agrees with trial division on random odd n up to 10^9", () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 5e8 }), (k) => {
        const input = { n: 2 * k + 1, bases: [2, 3, 5, 7, 11, 13] };
        const { output } = runAlgorithm(millerRabin, input, { mode: "count" });
        expect(millerRabin.check(input, output)).toBeNull();
        expect(output.certain).toBe(true);
        expect(output.composite).toBe(smallestFactor(input.n) !== input.n);
      }),
      { numRuns: 300 },
    );
  });

  it("Pollard's rho: a proper factor, within c · p rounds (p = smallest prime factor)", () => {
    const composites = fc
      .integer({ min: 4, max: 499_999 })
      .map((k) => 2 * k + 1)
      .filter((n) => smallestFactor(n) !== n);
    fc.assert(
      fc.property(composites, fc.integer({ min: 0, max: 8 }), (n, x0) => {
        const input = { n, x0 };
        const { output } = runAlgorithm(pollardRho, input, { mode: "count" });
        expect(pollardRho.check(input, output)).toBeNull();
        expect(output.iterations).toBeLessThanOrEqual(output.c * smallestFactor(n));
      }),
      { numRuns: 300 },
    );
  });

  it("CRT: pairwise coprime moduli always have a solution modulo their product", () => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    const systems = fc
      .shuffledSubarray(primes, { minLength: 1, maxLength: 5 })
      .chain((ms) =>
        fc.tuple(...ms.map((m) => fc.integer({ min: 0, max: m - 1 }).map((a) => ({ a, m })))),
      );
    fc.assert(
      fc.property(systems, (system) => {
        const { output } = runAlgorithm(crt, system, { mode: "count" });
        expect(crt.check(system, output)).toBeNull();
        expect(output.M).toBe(system.reduce((p, { m }) => p * m, 1));
      }),
      { numRuns: 300 },
    );
    fc.assert(
      fc.property(
        fc.array(fc.tuple(fc.integer({ min: 2, max: 60 }), fc.nat()), {
          minLength: 1,
          maxLength: 5,
        }),
        (pairs) => {
          const system = pairs.map(([m, a]) => ({ a: a % m, m }));
          expect(crt.check(system, runAlgorithm(crt, system, { mode: "count" }).output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
  });

  it("NTT and FFT agree with the schoolbook product, using (N/2) log₂ N butterflies per transform", () => {
    const poly = fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 8 });
    fc.assert(
      fc.property(poly, poly, (a, b) => {
        const input = { a, b };
        const exact = runAlgorithm(ntt, input, { mode: "count" });
        const approx = runAlgorithm(fft, input, { mode: "count" });
        expect(ntt.check(input, exact.output)).toBeNull();
        expect(fft.check(input, approx.output)).toBeNull();
        expect(approx.output.product).toEqual(exact.output.product);
        const N = exact.output.N;
        expect(exact.trace.meta.counters.butterflies ?? 0).toBe(3 * (N / 2) * Math.log2(N));
      }),
      { numRuns: 300 },
    );
  });
});

/* ---------------------------------------------------------- flows, matching */

import { dinic } from "@/algorithms/graph/dinic";
import { pushRelabel } from "@/algorithms/graph/push-relabel";
import { hopcroftKarp } from "@/algorithms/graph/hopcroft-karp";
import { flowInput } from "@/algorithms/graph/flow-common";

describe("maximum flow and matching properties", () => {
  const networks = fc
    .record({ seed: fc.integer({ min: 0, max: 1_000_000 }), size: fc.integer({ min: 3, max: 10 }) })
    .map(({ seed, size }) => flowInput.random(createRng(seed), size));

  it("Dinic and push–relabel find the same maximum flow, within their phase and relabel bounds", () => {
    fc.assert(
      fc.property(networks, (input) => {
        const a = runAlgorithm(dinic, input, { mode: "count" });
        const b = runAlgorithm(pushRelabel, input, { mode: "count" });
        expect(dinic.check(input, a.output)).toBeNull();
        expect(pushRelabel.check(input, b.output)).toBeNull();
        expect(a.output.maxFlow).toBe(b.output.maxFlow);
        const V = input.nodes.length;
        expect(a.trace.meta.counters.phases ?? 0).toBeLessThanOrEqual(V - 1);
        expect(b.trace.meta.counters.relabels ?? 0).toBeLessThanOrEqual((2 * V - 1) * (V - 2));
      }),
      { numRuns: 300 },
    );
  });

  it("Hopcroft–Karp finds a maximum matching (Kuhn oracle) in at most 2√V + 2 phases", () => {
    const graphs = fc
      .record({
        seed: fc.integer({ min: 0, max: 1_000_000 }),
        size: fc.integer({ min: 2, max: 16 }),
      })
      .map(({ seed, size }) => hopcroftKarp.input.random(createRng(seed), size));
    fc.assert(
      fc.property(graphs, (input) => {
        expect(
          hopcroftKarp.check(input, runAlgorithm(hopcroftKarp, input, { mode: "count" }).output),
        ).toBeNull();
      }),
      { numRuns: 400 },
    );
  });
});

/* ------------------------------------------------------------- DP techniques */

import { heldKarp } from "@/algorithms/dp/held-karp";
import { assignmentDp } from "@/algorithms/dp/assignment-dp";
import { digitDp } from "@/algorithms/dp/digit-dp";
import { convexHullTrick } from "@/algorithms/dp/convex-hull-trick";

describe("bitmask, digit and convex-hull DP properties", () => {
  const matrices = (min: number, max: number) =>
    fc.integer({ min, max }).chain((n) =>
      fc.array(fc.array(fc.integer({ min: 0, max: 50 }), { minLength: n, maxLength: n }), {
        minLength: n,
        maxLength: n,
      }),
    );
  const choose = (n: number, k: number): number =>
    k < 0 || k > n ? 0 : k === 0 ? 1 : (choose(n - 1, k - 1) * n) / k;

  it("Held–Karp: optimal tours (brute force) with the exact number of transitions", () => {
    fc.assert(
      fc.property(matrices(2, 6), (raw) => {
        const w = raw.map((r, i) => r.map((x, j) => (i === j ? 0 : x)));
        const { output, trace } = runAlgorithm(heldKarp, w, { mode: "count" });
        expect(heldKarp.check(w, output)).toBeNull();
        const n = w.length;
        let want = n - 1;
        for (let s = 3; s <= n; s++) want += choose(n - 1, s - 1) * (s - 1) * (s - 2);
        expect(trace.meta.counters.transitions ?? 0).toBe(want);
      }),
      { numRuns: 200 },
    );
  });

  it("assignment DP: optimal (brute force) with n·2ⁿ⁻¹ transitions", () => {
    fc.assert(
      fc.property(matrices(1, 5), (cost) => {
        const { output, trace } = runAlgorithm(assignmentDp, cost, { mode: "count" });
        expect(assignmentDp.check(cost, output)).toBeNull();
        expect(trace.meta.counters.transitions ?? 0).toBe(cost.length * 2 ** (cost.length - 1));
      }),
      { numRuns: 200 },
    );
  });

  it("digit DP: matches counting every number, and never revisits a free state", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 50_000 }), fc.integer({ min: 0, max: 27 }), (N, S) => {
        const input = { N, S };
        const { output } = runAlgorithm(digitDp, input, { mode: "count" });
        expect(digitDp.check(input, output)).toBeNull();
        const L = String(N).length;
        expect(output.calls - output.memoHits).toBeLessThanOrEqual(1 + 10 * L * (S + 2));
      }),
      { numRuns: 300 },
    );
  });

  it("convex hull trick: equals the O(n²) DP with at most 3n line comparisons", () => {
    const inputs = fc
      .record({
        steps: fc.array(fc.integer({ min: 1, max: 9 }), { minLength: 1, maxLength: 11 }),
        start: fc.integer({ min: 0, max: 5 }),
        C: fc.integer({ min: 0, max: 200 }),
      })
      .map(({ steps, start, C }) => ({
        h: steps.reduce((h, s) => [...h, h[h.length - 1]! + s], [start]),
        C,
      }));
    fc.assert(
      fc.property(inputs, (input) => {
        const { output, trace } = runAlgorithm(convexHullTrick, input, { mode: "count" });
        expect(convexHullTrick.check(input, output)).toBeNull();
        expect(trace.meta.counters["line comparisons"] ?? 0).toBeLessThanOrEqual(
          3 * input.h.length,
        );
      }),
      { numRuns: 300 },
    );
  });
});

describe("geometry properties", () => {
  // Small coordinate ranges force repeated and collinear points.
  const points = (min: number, max: number, range: number) =>
    fc.array(
      fc.record({ x: fc.integer({ min: 0, max: range }), y: fc.integer({ min: 0, max: range }) }),
      { minLength: min, maxLength: max },
    );

  it("Graham scan: strictly convex, counter-clockwise, and every point inside or on it", () => {
    fc.assert(
      fc.property(fc.oneof(points(1, 40, 4), points(1, 40, 60)), (pts) => {
        const { output, trace } = runAlgorithm(grahamScan, pts, { mode: "count" });
        expect(grahamScan.check(pts, output)).toBeNull();
        const h = output.hull.map((i) => pts[i]!);
        if (h.length >= 3) {
          for (let k = 0; k < h.length; k++) {
            const [a, b, c] = [h[k]!, h[(k + 1) % h.length]!, h[(k + 2) % h.length]!];
            expect(cross(a, b, c)).toBeGreaterThan(0);
            for (const p of pts) expect(cross(a, b, p)).toBeGreaterThanOrEqual(0);
          }
        }
        // Each point is pushed once and popped at most once, each pop costing one test.
        const n = pts.length;
        expect(output.popped).toBeLessThanOrEqual(n);
        expect(trace.meta.counters["orientation tests"] ?? 0).toBeLessThanOrEqual(2 * n);
      }),
      { numRuns: 300 },
    );
  });

  it("closest pair: matches brute force, with at most 7 strip comparisons per point", () => {
    fc.assert(
      fc.property(fc.oneof(points(2, 32, 5), points(2, 32, 100)), (pts) => {
        const { output, trace } = runAlgorithm(closestPair, pts, { mode: "count" });
        expect(closestPair.check(pts, output)).toBeNull();
        expect(output.maxStrip).toBeLessThanOrEqual(7);
        // Base cases cost at most 3 per 3 points and each strip point at most 7.
        const n = pts.length;
        const depth = Math.ceil(Math.log2(n));
        expect(trace.meta.counters["distance computations"] ?? 0).toBeLessThanOrEqual(
          n + 7 * n * depth,
        );
      }),
      { numRuns: 300 },
    );
  });

  it("2-d tree: nearest point matches brute force, and the tree has ⌊log₂ n⌋ + 1 levels", () => {
    fc.assert(
      fc.property(
        fc.oneof(points(1, 26, 4), points(1, 26, 60)),
        fc.record({ x: fc.integer({ min: -10, max: 70 }), y: fc.integer({ min: -10, max: 70 }) }),
        (pts, q) => {
          const input = { points: pts, q };
          const { output } = runAlgorithm(kdTree, input, { mode: "count" });
          expect(kdTree.check(input, output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
  });

  it("2-d tree: the pruning examines fewer points than a full scan on spread-out inputs", () => {
    const grid = Array.from({ length: 25 }, (_, i) => ({
      x: (i % 5) * 10,
      y: Math.floor(i / 5) * 10,
    }));
    const { output } = runAlgorithm(kdTree, { points: grid, q: { x: 1, y: 2 } });
    expect(output.nearest).toBe(0);
    expect(output.visited).toBeLessThan(grid.length / 2);
  });
});

describe("randomized, search and optimisation properties", () => {
  it("quickselect: the k-th smallest for any seed, in at most n rounds", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -9, max: 9 }), { minLength: 1, maxLength: 40 }),
        fc.nat(),
        fc.integer({ min: 0, max: 999_999 }),
        (values, kRaw, seed) => {
          const input = { values, k: 1 + (kRaw % values.length), seed };
          const { output } = runAlgorithm(quickselect, input, { mode: "count" });
          expect(quickselect.check(input, output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
  });

  it("quickselect: about 2.85n comparisons on average for the median of 40 (below 2(1 + ln 2)n ≈ 3.39n)", () => {
    const n = 40;
    let total = 0;
    for (let seed = 0; seed < 300; seed++) {
      const rng = createRng(seed + 7);
      const values = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) {
        const j = rng.int(0, i);
        [values[i], values[j]] = [values[j]!, values[i]!];
      }
      total += runAlgorithm(quickselect, { values, k: n / 2, seed }, { mode: "count" }).trace.meta
        .counters.comparisons!;
    }
    expect(total / 300).toBeCloseTo(114, 0);
    expect(total / 300).toBeLessThan(2 * (1 + Math.LN2) * n);
  });

  it("MCTS: statistics stay consistent for any position, budget and seed", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 60 }),
        fc.integer({ min: 0, max: 999_999 }),
        (stones, iterations, seed) => {
          const input = { stones, iterations, seed };
          const { output } = runAlgorithm(mcts, input, { mode: "count" });
          expect(mcts.check(input, output)).toBeNull();
        },
      ),
      { numRuns: 200 },
    );
  });

  it("MCTS: how often the most visited move wins (the lesson's measurements)", () => {
    // Positions with 1–11 stones that are not multiples of 4 have one winning move: n mod 4.
    const rate = (iterations: number, positions: number[]) => {
      let ok = 0;
      for (const stones of positions)
        for (let seed = 0; seed < 50; seed++)
          if (
            runAlgorithm(mcts, { stones, iterations, seed }, { mode: "count" }).output.move ===
            stones % 4
          )
            ok++;
      return ok;
    };
    const winnable = [1, 2, 3, 5, 6, 7, 9, 10, 11];
    expect(rate(40, winnable)).toBe(357);
    expect(rate(150, winnable)).toBe(393);
    expect(rate(40, [7])).toBe(44);
    expect(rate(150, [7])).toBe(50);
  });

  it("gradient descent: f shrinks by at least the worse squared factor when both factors are below 1", () => {
    const num = (min: number, max: number) =>
      fc.integer({ min: min * 10, max: max * 10 }).map((v) => v / 10);
    fc.assert(
      fc.property(
        fc.record({
          a: num(0.1, 10),
          b: num(0.1, 10),
          p: num(-10, 10),
          q: num(-10, 10),
          x0: num(-10, 10),
          y0: num(-10, 10),
          eta: fc.integer({ min: 1, max: 200 }).map((v) => v / 100),
          steps: fc.integer({ min: 1, max: 50 }),
        }),
        (input) => {
          const { output } = runAlgorithm(gradientDescent, input, { mode: "count" });
          expect(gradientDescent.check(input, output)).toBeNull();
          const rho = Math.max(output.factors[0] ** 2, output.factors[1] ** 2);
          if (rho < 1)
            for (let t = 1; t < output.f.length; t++)
              expect(output.f[t]!).toBeLessThanOrEqual(rho * output.f[t - 1]! * (1 + 1e-9) + 1e-12);
        },
      ),
      { numRuns: 300 },
    );
  });
});

describe("distributed protocol properties", () => {
  const scenario = <I>(gen: (rng: ReturnType<typeof createRng>) => I) =>
    fc.integer({ min: 0, max: 2 ** 31 - 1 }).map((seed) => gen(createRng(seed)));

  it("Paxos: never two chosen values, on any schedule with losses and racing proposers", () => {
    fc.assert(
      fc.property(
        scenario((rng) => ({ ...paxos.input.random(rng, 8), loss: rng.int(0, 40) })),
        (input) => {
          const { output } = runAlgorithm(paxos, input, { mode: "count" });
          expect(paxos.check(input, output)).toBeNull();
        },
      ),
      { numRuns: 400 },
    );
  });

  it("Raft: election safety, log matching, leader completeness and state-machine safety", () => {
    fc.assert(
      fc.property(
        scenario((rng) => ({ ...raft.input.random(rng, 8), loss: rng.int(0, 30) })),
        (input) => {
          const { output } = runAlgorithm(raft, input, { mode: "count" });
          expect(raft.check(input, output)).toBeNull();
        },
      ),
      { numRuns: 400 },
    );
  });

  it("MapReduce: the same counts with or without a combiner or a failure, fewer pairs with a combiner", () => {
    fc.assert(
      fc.property(
        scenario((rng) => mapReduce.input.random(rng, 8)),
        (input) => {
          const plain = runAlgorithm(
            mapReduce,
            { ...input, combiner: false },
            { mode: "count" },
          ).output;
          const combined = runAlgorithm(
            mapReduce,
            { ...input, combiner: true },
            { mode: "count" },
          ).output;
          expect(mapReduce.check({ ...input, combiner: false }, plain)).toBeNull();
          expect(mapReduce.check({ ...input, combiner: true }, combined)).toBeNull();
          expect(combined.counts).toEqual(plain.counts);
          expect(combined.shuffled).toBeLessThanOrEqual(plain.shuffled);
        },
      ),
      { numRuns: 300 },
    );
  });
});

describe("Shell, counting and radix sort properties", () => {
  it("Shell sort: each pass leaves the array h-sorted, and shifts never exceed the inversions", () => {
    fc.assert(
      fc.property(arrays, (input) => {
        const { trace, output } = runAlgorithm(shellSort, input);
        expect(output).toEqual([...input].sort((a, b) => a - b));
        // Each shift exchanges a larger element with a smaller one h places later,
        // which removes at least one inversion.
        expect(trace.meta.counters.shifts ?? 0).toBeLessThanOrEqual(inversions(input));
        const player = new TracePlayer(trace);
        const passEnds = trace.events.flatMap((e, i) =>
          e.type === "step" && e.line === 9 ? [i + 1] : [],
        );
        const gaps = knuthGaps(input.length);
        expect(passEnds.length).toBe(gaps.length);
        passEnds.forEach((p, k) => {
          const A = player.stateAt(p).structures.A!;
          if (A.kind !== "array") throw new Error("A is not an array");
          const v = A.values as number[];
          for (let i = gaps[k]!; i < v.length; i++)
            expect(v[i - gaps[k]!]!).toBeLessThanOrEqual(v[i]!);
        });
      }),
      { numRuns: 60 },
    );
  });

  it("counting sort: no comparisons, exactly 3n + k writes", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 20 }), { minLength: 1, maxLength: 30 }),
        (input) => {
          const { trace } = runAlgorithm(countingSort, input, { mode: "count" });
          expect(trace.meta.counters.comparisons).toBe(0);
          expect(trace.meta.counters.writes).toBe(3 * input.length + Math.max(...input));
        },
      ),
    );
  });

  it("radix sort: no comparisons, d(4n + 19) writes, and pass p sorts by the last p + 1 digits", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 999 }), { minLength: 1, maxLength: 24 }),
        (input) => {
          const { trace } = runAlgorithm(radixSort, input);
          const d = String(Math.max(...input)).length;
          expect(trace.meta.counters.comparisons).toBe(0);
          expect(trace.meta.counters.writes).toBe(d * (4 * input.length + 19));
          const player = new TracePlayer(trace);
          const passStarts = trace.events.flatMap((e, i) =>
            e.type === "step" && e.line === 2 ? [i] : [],
          );
          // The state just before pass p + 1 starts (or at the end) is sorted modulo 10^(p+1).
          [...passStarts.slice(1), trace.events.length].forEach((p, k) => {
            const A = player.stateAt(p).structures.A!;
            if (A.kind !== "array") throw new Error("A is not an array");
            const keys = (A.values as number[]).map((x) => x % 10 ** (k + 1));
            for (let i = 1; i < keys.length; i++)
              expect(keys[i - 1]!).toBeLessThanOrEqual(keys[i]!);
          });
        },
      ),
      { numRuns: 60 },
    );
  });
});

/**
 * Placements into B, recovered from the trace: each write to B follows the read of the
 * input position it came from. Grouped by pass (a step on line `passLine`), if given.
 */
const placements = (
  events: readonly { type: string; s?: string; i?: number; value?: unknown; line?: number }[],
  readLine: number,
  passLine?: number,
) => {
  const passes: { slot: number; from: number; value: number }[][] = [[]];
  let from = -1;
  for (const e of events) {
    if (passLine !== undefined && e.type === "step" && e.line === passLine && passes.at(-1)!.length)
      passes.push([]);
    if (e.type === "array.read" && e.s === "A" && e.line === readLine) from = e.i!;
    if (e.type === "array.write" && e.s === "B")
      passes.at(-1)!.push({ slot: e.i!, from, value: e.value as number });
  }
  return passes;
};

/** Equal keys must keep their input order: a later slot means a later source position. */
const expectStable = (
  pass: { slot: number; from: number; value: number }[],
  key: (v: number) => number,
) => {
  const bySlot = [...pass].sort((a, b) => a.slot - b.slot);
  for (let i = 1; i < bySlot.length; i++)
    if (key(bySlot[i - 1]!.value) === key(bySlot[i]!.value))
      expect(bySlot[i - 1]!.from).toBeLessThan(bySlot[i]!.from);
};

describe("stability of counting and radix sort, read from the trace", () => {
  it("counting sort places equal values in input order", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 5 }), { minLength: 1, maxLength: 30 }),
        (input) => {
          const { trace } = runAlgorithm(countingSort, input);
          const [pass] = placements(trace.events, 5);
          expect(pass!.length).toBe(input.length);
          pass!.forEach((p) => expect(input[p.from]).toBe(p.value));
          expectStable(pass!, (v) => v);
        },
      ),
    );
  });

  it("each radix pass places equal digits in the order the previous pass left them", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 999 }), { minLength: 1, maxLength: 24 }),
        (input) => {
          const { trace } = runAlgorithm(radixSort, input);
          const passes = placements(trace.events, 6, 2);
          expect(passes.length).toBe(String(Math.max(...input)).length);
          passes.forEach((pass, p) => expectStable(pass, (v) => Math.floor(v / 10 ** p) % 10));
        },
      ),
    );
  });
});

describe("sieve and Euclid properties", () => {
  it("the sieve crosses out exactly the sum over primes p ≤ √n of ⌊(n − p²)/p⌋ + 1", () => {
    for (let n = 2; n <= 200; n++) {
      const { output } = runAlgorithm(sieve, n, { mode: "count" });
      let want = 0;
      for (const p of output.primes) if (p * p <= n) want += Math.floor((n - p * p) / p) + 1;
      expect(output.crossings, `n = ${n}`).toBe(want);
    }
  });

  it("extended Euclid: Lamé's bound (a ≥ F(k+2), b ≥ F(k+1) after k divisions) and small coefficients", () => {
    const fib = [0, 1];
    while (fib.length < 40) fib.push(fib[fib.length - 1]! + fib[fib.length - 2]!);
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1_000_000 }),
        fc.integer({ min: 1, max: 1_000_000 }),
        (a, b) => {
          const { output } = runAlgorithm(euclid, { a, b }, { mode: "count" });
          expect(euclid.check({ a, b }, output)).toBeNull();
          const k = output.divisions;
          if (a > b) {
            expect(a).toBeGreaterThanOrEqual(fib[k + 2]!);
            expect(b).toBeGreaterThanOrEqual(fib[k + 1]!);
          }
          expect(Math.abs(output.x)).toBeLessThanOrEqual(Math.max(1, b / output.gcd));
          expect(Math.abs(output.y)).toBeLessThanOrEqual(Math.max(1, a / output.gcd));
        },
      ),
    );
  });
});

describe("hash table properties", () => {
  // Workloads with many collisions: small tables, keys often from a narrow range.
  const workload = (minM: number, maxM: number) =>
    fc.record({
      m: fc.integer({ min: minM, max: maxM }),
      ops: fc.array(
        fc.record({
          kind: fc.constantFrom<HashOp["kind"]>("insert", "insert", "insert", "find", "delete"),
          key: fc.oneof(fc.integer({ min: 0, max: 40 }), fc.integer({ min: 0, max: 999 })),
        }),
        { minLength: 1, maxLength: 20 },
      ),
    });

  it("all four tables agree with a set and keep their structural invariants (oracles)", () => {
    fc.assert(
      fc.property(workload(5, 8), fc.boolean(), (input, double) => {
        for (const [mod, value] of [
          [hashChaining, input],
          [robinHood, input],
          [cuckooHashing, { ...input, m: input.m - 2 }],
          [
            openAddressing,
            { ...input, m: [5, 7, 7, 11][input.m - 5]!, probing: double ? "double" : "linear" },
          ],
        ] as const) {
          const { output } = runAlgorithm(mod as never, value as never, { mode: "count" });
          expect(
            (mod as { check: (i: unknown, o: unknown) => string | null }).check(value, output),
          ).toBeNull();
        }
      }),
      { numRuns: 300 },
    );
  });

  it("a cuckoo lookup probes at most two slots", () => {
    fc.assert(
      fc.property(
        workload(3, 8),
        fc.array(fc.integer({ min: 0, max: 999 }), { minLength: 1, maxLength: 10 }),
        (input, keys) => {
          const base = runAlgorithm(cuckooHashing, input, { mode: "count" });
          const finds: HashOp[] = keys.map((key) => ({ kind: "find", key }));
          const more = runAlgorithm(
            cuckooHashing,
            { ...input, ops: [...input.ops, ...finds] },
            { mode: "count" },
          );
          const extra =
            (more.trace.meta.counters.probes ?? 0) - (base.trace.meta.counters.probes ?? 0);
          expect(extra).toBeLessThanOrEqual(2 * keys.length);
        },
      ),
    );
  });

  it("double hashing with a prime m visits every slot", () => {
    for (const m of [5, 7, 11, 13])
      for (let k = 0; k <= 999; k++) {
        const seen = new Set(Array.from({ length: m }, (_, i) => probe("double", m, k, i)));
        expect(seen.size, `m = ${m}, k = ${k}`).toBe(m);
      }
  });
});

describe("hash function properties", () => {
  it("Rabin–Karp: n − m rolls, and characters are compared only in windows whose hash matched", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[0-3]{1,24}$/),
        fc.stringMatching(/^[0-3]{1,5}$/),
        fc.constantFrom(2, 3, 5, 7, 13, 101),
        (text, pat, q) => {
          const input = { a: text, b: pat, d: 10 as const, q };
          const { output, trace } = runAlgorithm(rabinKarp, input, { mode: "count" });
          expect(rabinKarp.check(input, output)).toBeNull();
          const windows = Math.max(0, text.length - pat.length + 1);
          expect(trace.meta.counters.rolls ?? 0).toBe(Math.max(0, windows - 1));
          expect(trace.meta.counters.comparisons).toBeLessThanOrEqual(
            (output.matches.length + output.spurious.length) * pat.length,
          );
        },
      ),
    );
  });

  const placement = fc
    .record({
      n: fc.integer({ min: 1, max: 5 }),
      keys: fc.uniqueArray(fc.stringMatching(/^[a-z][a-z0-9]{0,4}$/), {
        minLength: 1,
        maxLength: 12,
      }),
      add: fc.boolean(),
      pick: fc.nat(),
      vnodes: fc.integer({ min: 1, max: 3 }),
    })
    .map(({ n, keys, add, pick, vnodes }) => {
      const servers = ["A", "B", "C", "D", "E", "F"].slice(0, n);
      const change =
        add || n === 1
          ? { kind: "add" as const, server: ["A", "B", "C", "D", "E", "F"][n]! }
          : { kind: "remove" as const, server: servers[pick % n]! };
      return { servers, keys, change, vnodes };
    });

  it("consistent and rendezvous hashing move only the keys they must", () => {
    fc.assert(
      fc.property(placement, (input) => {
        for (const mod of [consistentHashing, rendezvousHashing]) {
          const { output } = runAlgorithm(mod, input, { mode: "count" });
          expect(mod.check(input, output)).toBeNull();
          if (input.change.kind === "remove")
            for (const k of input.keys)
              if (output.before[k] === input.change.server) expect(output.moved).toContain(k);
        }
      }),
    );
  });

  it("Zobrist: reordering each player's moves gives the same final hash", () => {
    fc.assert(
      fc.property(
        fc.shuffledSubarray([1, 2, 3, 4, 5, 6, 7, 8, 9], { minLength: 1 }),
        fc.nat(999_999),
        fc.nat(),
        (game, seed, r) => {
          const xs = game.filter((_, i) => i % 2 === 0);
          const os = game.filter((_, i) => i % 2 === 1);
          const rot = <T>(a: T[]) =>
            a.length ? [...a.slice(r % a.length), ...a.slice(0, r % a.length)] : a;
          const [x2, o2] = [rot(xs), rot([...os].reverse())];
          const other = game.map((_, i) => (i % 2 === 0 ? x2[i / 2]! : o2[(i - 1) / 2]!));
          const input = { games: [game, other], seed };
          const { output } = runAlgorithm(zobrist, input, { mode: "count" });
          expect(zobrist.check(input, output)).toBeNull();
          expect(output.hashes[0]!.at(-1)).toBe(output.hashes[1]!.at(-1));
        },
      ),
    );
  });
});

describe("linked list properties", () => {
  const list = fc.array(fc.integer({ min: -99, max: 99 }), { minLength: 1, maxLength: 10 });

  it("reversal in groups makes exactly (groups) × (k + 1) pointer assignments", () => {
    fc.assert(
      fc.property(list, fc.nat(), (values, r) => {
        const k = 1 + (r % values.length);
        const { output } = runAlgorithm(reverseList, { values, k }, { mode: "count" });
        expect(reverseList.check({ values, k }, output)).toBeNull();
        expect(output.pointerWrites).toBe(Math.floor(values.length / k) * (k + 1));
      }),
    );
  });

  it("Floyd's pointers meet within mu + lambda slow steps", () => {
    fc.assert(
      fc.property(list, fc.nat(), (values, r) => {
        const pos = r % (values.length + 1) === values.length ? -1 : r % values.length;
        const { output } = runAlgorithm(floydCycle, { values, pos }, { mode: "count" });
        expect(floydCycle.check({ values, pos }, output)).toBeNull();
        if (pos >= 0) expect(output.slowSteps).toBeLessThanOrEqual(values.length);
      }),
    );
  });

  it("merging k lists makes at most N(k - 1) comparisons and is stable", () => {
    fc.assert(
      fc.property(
        fc.array(fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }), {
          minLength: 2,
          maxLength: 4,
        }),
        (raw) => {
          const lists = raw.map((l) => [...l].sort((a, b) => a - b));
          const { output, trace } = runAlgorithm(mergeLists, { lists }, { mode: "count" });
          expect(mergeLists.check({ lists }, output)).toBeNull();
          const N = lists.reduce((a, l) => a + l.length, 0);
          expect(trace.meta.counters.comparisons).toBeLessThanOrEqual(N * (lists.length - 1));
        },
      ),
    );
  });

  it("rotating by a multiple of the length changes nothing; removing then counts n - 1 nodes", () => {
    fc.assert(
      fc.property(list, fc.integer({ min: 0, max: 9 }), (values, m) => {
        const rot = runAlgorithm(
          listTwoPointers,
          { values, op: { kind: "rotate", k: m * values.length } },
          { mode: "count" },
        );
        expect(rot.output.values).toEqual(values);
        const n = 1 + (m % values.length);
        const rem = runAlgorithm(
          listTwoPointers,
          { values, op: { kind: "remove", n } },
          { mode: "count" },
        );
        expect(rem.output.values.length).toBe(values.length - 1);
      }),
    );
  });
});

describe("stack application properties", () => {
  type E = { v: number } | { op: "+" | "-" | "*"; l: E; r: E };
  const expr: fc.Arbitrary<E> = fc.letrec<{ e: E }>((tie) => ({
    e: fc.oneof(
      { depthSize: "small", withCrossShrink: true },
      fc.integer({ min: 0, max: 20 }).map((v) => ({ v })),
      fc.record({ op: fc.constantFrom<"+" | "-" | "*">("+", "-", "*"), l: tie("e"), r: tie("e") }),
    ),
  })).e;
  const size = (e: E): number => ("v" in e ? 1 : 1 + size(e.l) + size(e.r));
  const infix = (e: E): Token[] =>
    "v" in e ? [e.v] : ["(", ...infix(e.l), e.op, ...infix(e.r), ")"];
  const postfix = (e: E): Token[] => ("v" in e ? [e.v] : [...postfix(e.l), ...postfix(e.r), e.op]);
  const prefix = (e: E): Token[] => ("v" in e ? [e.v] : [e.op, ...prefix(e.l), ...prefix(e.r)]);
  const value = (e: E): number =>
    "v" in e
      ? e.v
      : e.op === "+"
        ? value(e.l) + value(e.r)
        : e.op === "-"
          ? value(e.l) - value(e.r)
          : value(e.l) * value(e.r);
  const small = expr.filter((e) => size(e) <= 9 && Math.abs(value(e)) < 1e9);

  it("shunting-yard, postfix and prefix evaluation and the expression tree agree on every expression", () => {
    fc.assert(
      fc.property(small, (e) => {
        const inf = infix(e);
        if (inf.length > 19) return;
        const sy = runAlgorithm(shuntingYard, inf, { mode: "count" }).output;
        expect(sy.postfix).toEqual(postfix(e));
        expect(
          runAlgorithm(rpnEval, { tokens: postfix(e), notation: "postfix" }, { mode: "count" })
            .output.value,
        ).toBe(value(e));
        expect(
          runAlgorithm(rpnEval, { tokens: prefix(e), notation: "prefix" }, { mode: "count" }).output
            .value,
        ).toBe(value(e));
        const tree = runAlgorithm(expressionTree, inf, { mode: "count" }).output;
        expect(tree.value).toBe(value(e));
        expect(evalPostfix(sy.postfix)).toBe(value(e));
      }),
      { numRuns: 300 },
    );
  });

  it("shunting-yard matches recursive descent on unparenthesised chains of all five operators", () => {
    // Without parentheses, only precedence and associativity decide the grouping.
    const chain = fc
      .tuple(
        fc.integer({ min: 1, max: 9 }),
        fc.array(
          fc.tuple(fc.constantFrom<Op>("+", "-", "*", "/", "^"), fc.integer({ min: 1, max: 9 })),
          { minLength: 1, maxLength: 9 },
        ),
      )
      .map(([first, rest]): Token[] => [first, ...rest.flat()]);
    fc.assert(
      fc.property(chain, (tokens) => {
        const { output } = runAlgorithm(shuntingYard, tokens, { mode: "count" });
        expect(output.postfix).toEqual(postfixByDescent(tokens));
      }),
      { numRuns: 300 },
    );
  });

  it("Tower of Hanoi: disk k moves exactly 2^(n-k) times", () => {
    for (let n = 1; n <= 6; n++) {
      const { output } = runAlgorithm(hanoi, n, { mode: "count" });
      const moved = new Array(n + 1).fill(0);
      const pegs: number[][] = [Array.from({ length: n }, (_, i) => n - i), [], []];
      for (const [f, t] of output.moves) {
        const d = pegs[f]!.pop()!;
        moved[d]++;
        pegs[t]!.push(d);
      }
      for (let k = 1; k <= n; k++) expect(moved[k], `n = ${n}, disk ${k}`).toBe(2 ** (n - k));
    }
  });

  it("brackets are balanced exactly when pair deletion empties them", () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[()[\]{}a]{1,30}$/), (text) => {
        const { output } = runAlgorithm(balancedBrackets, text, { mode: "count" });
        expect(balancedBrackets.check(text, output)).toBeNull();
      }),
      { numRuns: 300 },
    );
  });
});

describe("queue, deque and heap properties", () => {
  // Random operation sequences: insertions carry a small value (repeats are common).
  const ops = (insert: string[], other: string[], max = 16) =>
    fc.array(
      fc.oneof(
        fc.record({ name: fc.constantFrom(...insert), value: fc.integer({ min: 0, max: 9 }) }),
        fc.record({ name: fc.constantFrom(...other) }),
      ),
      { minLength: 1, maxLength: max },
    ) as fc.Arbitrary<ContainerOp[]>;

  it("every container matches its plain-array model on random operation sequences", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<"queue" | "stack">("queue", "stack"),
        ops(["enqueue", "push"], ["dequeue", "front", "pop", "top"]),
        (build, raw) => {
          const names =
            build === "queue"
              ? {
                  enqueue: "enqueue",
                  push: "enqueue",
                  dequeue: "dequeue",
                  pop: "dequeue",
                  front: "front",
                  top: "front",
                }
              : {
                  enqueue: "push",
                  push: "push",
                  dequeue: "pop",
                  pop: "pop",
                  front: "top",
                  top: "top",
                };
          const value = {
            build,
            ops: raw.map((o) => ({ ...o, name: names[o.name as keyof typeof names] })),
          };
          const { output } = runAlgorithm(stackQueueAdapters, value, { mode: "count" });
          expect(stackQueueAdapters.check(value, output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
    fc.assert(
      fc.property(
        fc.constantFrom<"min" | "max">("min", "max"),
        ops(["push"], ["pop", "top", "extreme"]),
        (track, raw) => {
          const value = {
            track,
            ops: raw.map((o) => (o.name === "extreme" ? { name: track } : o)),
          };
          const { output } = runAlgorithm(minStack, value, { mode: "count" });
          expect(minStack.check(value, output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 8 }),
        fc.constantFrom<"reject" | "overwrite">("reject", "overwrite"),
        ops(["enqueue"], ["dequeue", "front"]),
        (capacity, whenFull, list) => {
          const value = { capacity, whenFull, ops: list };
          const { output } = runAlgorithm(circularQueue, value, { mode: "count" });
          expect(circularQueue.check(value, output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
    fc.assert(
      fc.property(
        ops(["pushFront", "pushBack"], ["popFront", "popBack", "front", "back"]),
        (list) => {
          const { output } = runAlgorithm(deque, list, { mode: "count" });
          expect(deque.check(list, output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
    fc.assert(
      fc.property(
        fc.constantFrom<"min" | "max">("min", "max"),
        ops(["insert"], ["extract", "peek"]),
        (kind, list) => {
          const value = { kind, ops: list };
          const { output } = runAlgorithm(binaryHeap, value, { mode: "count" });
          expect(binaryHeap.check(value, output)).toBeNull();
        },
      ),
      { numRuns: 300 },
    );
  });

  it("a binary heap returns any multiset in sorted order (heap sort by inserts and extracts)", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 99 }), { minLength: 1, maxLength: 8 }),
        (xs) => {
          const value = {
            kind: "min" as const,
            ops: [
              ...xs.map((x) => ({ name: "insert", value: x })),
              ...xs.map(() => ({ name: "extract" })),
            ],
          };
          const { output } = runAlgorithm(binaryHeap, value, { mode: "count" });
          expect(output.results.slice(xs.length)).toEqual([...xs].sort((a, b) => a - b));
        },
      ),
      { numRuns: 300 },
    );
  });

  it("a min stack's auxiliary stack stays at one value for strictly increasing pushes", () => {
    const value = {
      track: "min" as const,
      ops: Array.from({ length: 10 }, (_, i) => ({ name: "push", value: i * 3 })),
    };
    expect(runAlgorithm(minStack, value, { mode: "count" }).output.auxPeak).toBe(1);
  });
});

describe("balanced search tree properties", () => {
  const setOps = fc.array(
    fc.record({
      name: fc.constantFrom("insert", "insert", "delete", "search"),
      value: fc.integer({ min: 0, max: 24 }),
    }),
    { minLength: 1, maxLength: 20 },
  ) as fc.Arbitrary<ContainerOp[]>;
  const modules = [avlTree, redBlackTree, splayTree, treap, aaTree, scapegoatTree] as const;

  it("every balanced tree keeps its invariant after every operation of a random sequence", () => {
    for (const m of modules) {
      fc.assert(
        fc.property(setOps, (list) => {
          // Checking each prefix checks the invariant after every single operation.
          for (let i = 1; i <= list.length; i++) {
            const prefix = list.slice(0, i);
            const { output } = runAlgorithm(m as never, prefix, { mode: "count" });
            expect(
              (m.check as (a: unknown, b: unknown) => string | null)(prefix, output),
              `${m.id} after ${i}`,
            ).toBeNull();
          }
        }),
        { numRuns: 60 },
      );
    }
  });

  it("every balanced tree survives deleting all its keys in random order", () => {
    // Random sequences rarely delete a node with two children; this always does.
    const keysThenOrder = fc
      .uniqueArray(fc.integer({ min: 0, max: 40 }), { minLength: 2, maxLength: 12 })
      .chain((keys) =>
        fc.tuple(fc.constant(keys), fc.shuffledSubarray(keys, { minLength: keys.length })),
      );
    for (const m of modules) {
      fc.assert(
        fc.property(keysThenOrder, ([keys, order]) => {
          const list: ContainerOp[] = keys.map((value) => ({ name: "insert", value }));
          for (const value of order) {
            list.push({ name: "delete", value });
            const { output } = runAlgorithm(m as never, list, { mode: "count" });
            expect(
              (m.check as (a: unknown, b: unknown) => string | null)(list, output),
              `${m.id}`,
            ).toBeNull();
          }
        }),
        { numRuns: 80 },
      );
    }
  });

  it("AVL and red-black trees stay logarithmic on sorted inserts, where a plain BST degenerates", () => {
    const sorted = Array.from({ length: 20 }, (_, i) => ({ name: "insert", value: i }));
    const avl = runAlgorithm(avlTree, sorted, { mode: "count" }).output;
    const rb = runAlgorithm(redBlackTree, sorted, { mode: "count" }).output;
    // AVL: height < 1.4405 log2(n + 2) − 0.3277; red-black: height ≤ 2 log2(n + 1).
    expect(avl.height).toBeLessThanOrEqual(Math.floor(1.4405 * Math.log2(22) - 0.3277));
    expect(rb.height).toBeLessThanOrEqual(Math.floor(2 * Math.log2(21)));
  });

  it("Morris traversal gives the same in-order as the recursive traversal and restores the tree", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 10_000 }), (seed) => {
        const tree = morrisTraversal.input.random(createRng(seed), 12);
        const morris = runAlgorithm(morrisTraversal, tree, { mode: "count" }).output;
        const rec = runAlgorithm(binaryTreeTraversals, tree, { mode: "count" }).output;
        expect(morris.inorder).toEqual(rec.inorder);
      }),
      { numRuns: 200 },
    );
  });
});

describe("B-tree properties", () => {
  it("B-trees keep their invariants under random inserts, deletes and searches, for t = 2 and 3", () => {
    const list = fc.array(
      fc.record({
        name: fc.constantFrom("insert", "insert", "insert", "delete", "search"),
        value: fc.integer({ min: 0, max: 30 }),
      }),
      { minLength: 1, maxLength: 24 },
    ) as fc.Arbitrary<ContainerOp[]>;
    fc.assert(
      fc.property(fc.constantFrom(2, 3), list, (size, ops) => {
        const value = { size, ops };
        const { output } = runAlgorithm(bTree, value, { mode: "count" });
        expect(bTree.check(value, output)).toBeNull();
      }),
      { numRuns: 300 },
    );
  });

  it("B-trees survive deleting every key in random order", () => {
    const plan = fc
      .uniqueArray(fc.integer({ min: 0, max: 60 }), { minLength: 4, maxLength: 14 })
      .chain((keys) =>
        fc.tuple(fc.constant(keys), fc.shuffledSubarray(keys, { minLength: keys.length })),
      );
    fc.assert(
      fc.property(fc.constantFrom(2, 3), plan, (size, [keys, order]) => {
        const ops: ContainerOp[] = [
          ...keys.map((value) => ({ name: "insert", value })),
          ...order.map((value) => ({ name: "delete", value })),
        ];
        const value = { size, ops };
        const { output } = runAlgorithm(bTree, value, { mode: "count" });
        expect(bTree.check(value, output)).toBeNull();
        expect(output.tree).toBeNull();
      }),
      { numRuns: 200 },
    );
  });

  it("B-trees delete every key correctly from trees built in several insertion orders", () => {
    // Exhaustive and deterministic: reaches the case where both children around an
    // internal key are rich enough to give a predecessor or successor.
    const orders = (n: number) => {
      const up = Array.from({ length: n }, (_, i) => i + 1);
      const outside = up.flatMap((_, i) => (i % 2 ? [] : [up[i >> 1]!, up[n - 1 - (i >> 1)]!]));
      return [
        up,
        [...up].reverse(),
        [...new Set(outside)].concat(up).filter((v, i, a) => a.indexOf(v) === i),
      ];
    };
    for (const size of [2, 3])
      for (let n = 1; n <= 16; n++)
        for (const order of orders(n))
          for (let k = 1; k <= n; k++) {
            const ops: ContainerOp[] = [
              ...order.map((value) => ({ name: "insert", value })),
              { name: "delete", value: k },
            ];
            const value = { size, ops };
            const { output } = runAlgorithm(bTree, value, { mode: "count" });
            expect(bTree.check(value, output), `t=${size} n=${n} delete ${k}`).toBeNull();
          }
  });

  it("B* trees keep non-root nodes at least two-thirds full under random inserts", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(3, 4, 5),
        fc.uniqueArray(fc.integer({ min: 0, max: 99 }), { minLength: 1, maxLength: 24 }),
        (size, keys) => {
          const value = { size, ops: keys.map((v) => ({ name: "insert", value: v })) };
          const { output } = runAlgorithm(bStarTree, value, { mode: "count" });
          expect(bStarTree.check(value, output)).toBeNull();
          const { min } = bStarLimits(size);
          const walk = (n: typeof output.tree, root: boolean): void => {
            if (!n) return;
            if (!root) expect(n.keys.length).toBeGreaterThanOrEqual(min);
            n.children.forEach((c) => walk(c, false));
          };
          walk(output.tree, true);
        },
      ),
      { numRuns: 300 },
    );
  });

  it("B+ trees survive deleting every key in random order, keeping the leaf chain", () => {
    const plan = fc
      .uniqueArray(fc.integer({ min: 0, max: 60 }), { minLength: 4, maxLength: 16 })
      .chain((keys) =>
        fc.tuple(fc.constant(keys), fc.shuffledSubarray(keys, { minLength: keys.length })),
      );
    fc.assert(
      fc.property(fc.constantFrom(3, 4), plan, (size, [keys, order]) => {
        const ops: ContainerOp[] = keys.map((value) => ({ name: "insert", value }));
        for (const value of order) {
          ops.push({ name: "delete", value });
          const v = { size, ops: [...ops] };
          const { output } = runAlgorithm(bPlusTree, v, { mode: "count" });
          expect(bPlusTree.check(v, output)).toBeNull();
        }
      }),
      { numRuns: 120 },
    );
  });

  it("B+ trees agree with bottom-up insertion and keep a sorted leaf chain", () => {
    const list = fc.array(
      fc.record({
        name: fc.constantFrom("insert", "insert", "insert", "delete", "search", "scan"),
        value: fc.integer({ min: 0, max: 40 }),
      }),
      { minLength: 1, maxLength: 24 },
    ) as fc.Arbitrary<ContainerOp[]>;
    fc.assert(
      fc.property(fc.constantFrom(3, 4), list, (size, ops) => {
        const value = { size, ops };
        const { output } = runAlgorithm(bPlusTree, value, { mode: "count" });
        expect(bPlusTree.check(value, output)).toBeNull();
        expect(output.leaves).toEqual([...output.leaves].sort((a, b) => a - b));
      }),
      { numRuns: 300 },
    );
  });
});
