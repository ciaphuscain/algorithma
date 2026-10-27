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
import { binaryLifting } from "./trees/binary-lifting";
import { heavyLight } from "./trees/heavy-light";
import { matrixExponentiation } from "./maths/matrix-exponentiation";
import { memoVsTab } from "./dp/memo-vs-tab";
import { millerRabin } from "./maths/miller-rabin";
import { pollardRho } from "./maths/pollard-rho";
import { crt } from "./maths/crt";
import { ntt } from "./maths/ntt";
import { fft } from "./maths/fft";
import { dinic } from "./graph/dinic";
import { pushRelabel } from "./graph/push-relabel";
import { hopcroftKarp } from "./graph/hopcroft-karp";
import { heldKarp } from "./dp/held-karp";
import { assignmentDp } from "./dp/assignment-dp";
import { digitDp } from "./dp/digit-dp";
import { convexHullTrick } from "./dp/convex-hull-trick";
import { grahamScan } from "./geometry/graham-scan";
import { closestPair } from "./geometry/closest-pair";
import { kdTree } from "./geometry/kd-tree";
import { quickselect } from "./randomized/quickselect";
import { mcts } from "./ai/mcts";
import { gradientDescent } from "./ml/gradient-descent";
import { mapReduce } from "./distributed/mapreduce";
import { paxos } from "./distributed/paxos";
import { raft } from "./distributed/raft";
import { shellSort } from "./sorting/shell-sort";
import { countingSort } from "./sorting/counting-sort";
import { radixSort } from "./sorting/radix-sort";
import { sieve } from "./maths/sieve";
import { euclid } from "./maths/euclid";
import { hashChaining } from "./hashing/chaining";
import { openAddressing } from "./hashing/open-addressing";
import { robinHood } from "./hashing/robin-hood";
import { cuckooHashing } from "./hashing/cuckoo";
import { rabinKarp } from "./strings/rabin-karp";
import { consistentHashing } from "./hashing/consistent-hashing";
import { rendezvousHashing } from "./hashing/rendezvous-hashing";
import { zobrist } from "./hashing/zobrist";
import { reverseList } from "./lists/reverse";
import { floydCycle } from "./lists/floyd-cycle";
import { mergeLists } from "./lists/merge-lists";
import { listTwoPointers } from "./lists/list-two-pointers";
import { copyRandom } from "./lists/copy-random";
import { balancedBrackets } from "./stacks/balanced-brackets";
import { shuntingYard } from "./stacks/shunting-yard";
import { rpnEval } from "./stacks/rpn-eval";
import { expressionTree } from "./stacks/expression-tree";
import { hanoi } from "./stacks/hanoi";
import { stackQueueAdapters } from "./queues/adapters";
import { minStack } from "./queues/min-stack";
import { circularQueue } from "./queues/circular-queue";
import { deque } from "./queues/deque";
import { binaryHeap } from "./queues/binary-heap";
import { avlTree } from "./trees/balanced/avl";
import { redBlackTree } from "./trees/balanced/red-black";
import { splayTree } from "./trees/balanced/splay";
import { treap } from "./trees/balanced/treap";
import { morrisTraversal } from "./trees/morris";
import { aaTree } from "./trees/balanced/aa";
import { scapegoatTree } from "./trees/balanced/scapegoat";
import { bTree } from "./trees/btree/btree";
import { bPlusTree } from "./trees/btree/bplus";
import { bStarTree } from "./trees/btree/bstar";
import { leftistHeap, skewHeap } from "./heaps/meldable";
import { binomialHeap } from "./heaps/binomial";
import { fibonacciHeap } from "./heaps/fibonacci";
import { pairingHeap } from "./heaps/pairing";
import { radixTree } from "./trees/tries/radix";
import { patriciaTrie } from "./trees/tries/patricia";
import { ternarySearchTree } from "./trees/tries/tst";
import { suffixTrie } from "./trees/tries/suffix-trie";
import { skipList } from "./lists/skip-list";
import { lruCache } from "./caches/lru";
import { lfuCache } from "./caches/lfu";
import { sentinelSearch } from "./searching/sentinel-search";
import { recursiveBinarySearch } from "./searching/recursive-binary-search";
import { ternarySearch } from "./searching/ternary-search";
import { interpolationSearch } from "./searching/interpolation-search";
import { exponentialSearch } from "./searching/exponential-search";
import { jumpSearch } from "./searching/jump-search";
import { fibonacciSearch } from "./searching/fibonacci-search";
import { uniformBinarySearch } from "./searching/uniform-binary-search";
import { optimizedBubbleSort } from "./sorting/optimized-bubble-sort";
import { cocktailShakerSort } from "./sorting/cocktail-shaker-sort";
import { combSort } from "./sorting/comb-sort";
import { oddEvenSort } from "./sorting/odd-even-sort";
import { gnomeSort } from "./sorting/gnome-sort";
import { doubleSelectionSort } from "./sorting/double-selection-sort";
import { bingoSort } from "./sorting/bingo-sort";
import { cycleSort } from "./sorting/cycle-sort";
import { binaryInsertionSort } from "./sorting/binary-insertion-sort";
import { librarySort } from "./sorting/library-sort";
import { patienceSort } from "./sorting/patience-sort";
import { naturalMergeSort, bottomUpMergeSort } from "./sorting/merge-variants";
import { dualPivotQuickSort, threeWayQuickSort } from "./sorting/quick-variants";
import { weakHeapSort, smoothSort, tournamentSort } from "./sorting/heap-variants";
import { msdRadixSort, bucketSort, flashSort } from "./sorting/distribution-variants";
import {
  timSort,
  introSort,
  treeSort,
  pancakeSort,
  strandSort,
  americanFlagSort,
} from "./sorting/specialized";
import { blockSort, beadSort, sleepSort, bogoSort } from "./sorting/novelty";
import { differenceArray } from "./arrays/difference-array";
import { kadane } from "./arrays/kadane";
import { dutchFlag } from "./arrays/dutch-flag";
import { majorityVote } from "./arrays/majority-vote";
import { fisherYates, reservoirSampling } from "./arrays/random-sampling";
import { findDuplicate } from "./arrays/find-duplicate";
import { prefixXor } from "./arrays/prefix-xor";

/**
 * Every traceable algorithm. Registering a module here is the only step needed for
 * the conformance suite (tests/unit/conformance.test.ts) and the visualizer to pick
 * it up; renderers are chosen by the structures the trace contains.
 */
export const ALGORITHM_MODULES: readonly AnyAlgorithmModule[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  shellSort,
  countingSort,
  radixSort,
  hashChaining,
  openAddressing,
  robinHood,
  cuckooHashing,
  consistentHashing,
  rendezvousHashing,
  zobrist,
  rabinKarp,
  reverseList,
  floydCycle,
  mergeLists,
  listTwoPointers,
  copyRandom,
  balancedBrackets,
  shuntingYard,
  rpnEval,
  expressionTree,
  hanoi,
  stackQueueAdapters,
  minStack,
  circularQueue,
  deque,
  binaryHeap,
  avlTree,
  redBlackTree,
  splayTree,
  treap,
  morrisTraversal,
  aaTree,
  scapegoatTree,
  bTree,
  bPlusTree,
  bStarTree,
  leftistHeap,
  skewHeap,
  binomialHeap,
  fibonacciHeap,
  pairingHeap,
  radixTree,
  patriciaTrie,
  ternarySearchTree,
  suffixTrie,
  skipList,
  lruCache,
  lfuCache,
  sentinelSearch,
  recursiveBinarySearch,
  ternarySearch,
  interpolationSearch,
  exponentialSearch,
  jumpSearch,
  fibonacciSearch,
  uniformBinarySearch,
  optimizedBubbleSort,
  cocktailShakerSort,
  combSort,
  oddEvenSort,
  gnomeSort,
  doubleSelectionSort,
  bingoSort,
  cycleSort,
  binaryInsertionSort,
  librarySort,
  patienceSort,
  naturalMergeSort,
  bottomUpMergeSort,
  dualPivotQuickSort,
  threeWayQuickSort,
  weakHeapSort,
  smoothSort,
  tournamentSort,
  msdRadixSort,
  bucketSort,
  flashSort,
  timSort,
  introSort,
  treeSort,
  pancakeSort,
  strandSort,
  americanFlagSort,
  blockSort,
  beadSort,
  sleepSort,
  bogoSort,
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
  differenceArray,
  kadane,
  dutchFlag,
  majorityVote,
  reservoirSampling,
  fisherYates,
  findDuplicate,
  prefixXor,
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
  binaryLifting,
  heavyLight,
  matrixExponentiation,
  memoVsTab,
  millerRabin,
  pollardRho,
  euclid,
  sieve,
  crt,
  ntt,
  fft,
  dinic,
  pushRelabel,
  hopcroftKarp,
  heldKarp,
  assignmentDp,
  digitDp,
  convexHullTrick,
  grahamScan,
  closestPair,
  kdTree,
  quickselect,
  mcts,
  gradientDescent,
  mapReduce,
  paxos,
  raft,
];

const byId = new Map(ALGORITHM_MODULES.map((m) => [m.id, m]));

export function getModule(id: string): AnyAlgorithmModule | undefined {
  return byId.get(id);
}
