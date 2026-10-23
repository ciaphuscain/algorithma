import type { AnyAlgorithmModule } from "./types";
import { bubbleSort } from "./sorting/bubble-sort";
import { selectionSort } from "./sorting/selection-sort";
import { heapSort } from "./sorting/heap-sort";
import { linearSearch } from "./searching/linear-search";
import { topologicalSort } from "./graph/topological-sort";
import { lcs } from "./dp/lcs";
import { knapsack } from "./dp/knapsack";
import { kmp } from "./strings/kmp";
import { bst } from "./trees/bst";
import { binaryTreeTraversals } from "./trees/traversals";
import { trie } from "./trees/trie";
import { segmentTree } from "./trees/segment-tree";
import { insertionSort } from "./sorting/insertion-sort";
import { mergeSort } from "./sorting/merge-sort";
import { quickSort } from "./sorting/quick-sort";
import { binarySearch } from "./searching/binary-search";
import { bfs } from "./graph/bfs";
import { dfs } from "./graph/dfs";
import { dijkstra } from "./graph/dijkstra";
import { editDistance } from "./dp/edit-distance";
import { lis } from "./dp/lis";
import { unionFind } from "./graph/union-find";
import { kruskal } from "./graph/kruskal";
import { prim } from "./graph/prim";
import { bellmanFord } from "./graph/bellman-ford";
import { floydWarshall } from "./graph/floyd-warshall";
import { topologicalSortDfs } from "./graph/topological-sort-dfs";
import { fenwickTree } from "./trees/fenwick-tree";
import { prefixSums } from "./arrays/prefix-sums";
import { slidingWindow } from "./arrays/sliding-window";
import { twoPointers } from "./arrays/two-pointers";
import { monotonicStack } from "./arrays/monotonic-stack";
import { monotonicQueue } from "./arrays/monotonic-queue";
import { sparseTable } from "./arrays/sparse-table";
import { kosaraju } from "./graph/kosaraju";
import { tarjanScc } from "./graph/tarjan-scc";
import { bridges } from "./graph/bridges";
import { aStar } from "./graph/a-star";
import { manacher } from "./strings/manacher";
import { ahoCorasick } from "./strings/aho-corasick";
import { suffixArray } from "./strings/suffix-array";
import { suffixTree } from "./strings/suffix-tree";
import { suffixAutomaton } from "./strings/suffix-automaton";

/**
 * Every traceable algorithm. Registering a module here is the only step needed for
 * the conformance suite (tests/unit/conformance.test.ts) and the visualizer to pick
 * it up; renderers are chosen by the structures the trace contains.
 */
export const ALGORITHM_MODULES: readonly AnyAlgorithmModule[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  linearSearch,
  binarySearch,
  bfs,
  dfs,
  dijkstra,
  topologicalSort,
  editDistance,
  lcs,
  knapsack,
  kmp,
  binaryTreeTraversals,
  bst,
  trie,
  segmentTree,
  unionFind,
  kruskal,
  prim,
  bellmanFord,
  floydWarshall,
  topologicalSortDfs,
  lis,
  fenwickTree,
  prefixSums,
  slidingWindow,
  twoPointers,
  monotonicStack,
  monotonicQueue,
  sparseTable,
  kosaraju,
  tarjanScc,
  bridges,
  aStar,
  manacher,
  ahoCorasick,
  suffixArray,
  suffixTree,
  suffixAutomaton,
];

const byId = new Map(ALGORITHM_MODULES.map((m) => [m.id, m]));

export function getModule(id: string): AnyAlgorithmModule | undefined {
  return byId.get(id);
}
