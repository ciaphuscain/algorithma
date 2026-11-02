import { CURRICULUM_ITEMS, DUPLICATES, type CurriculumItem } from "./curriculum";
import type { DomainId } from "./domains";
import type { AlgorithmEntry, ComplexityClass, Difficulty } from "./types";
import { bfsEntry } from "./entries/bfs";
import { binarySearchEntry } from "./entries/binary-search";
import { bubbleSortEntry } from "./entries/bubble-sort";
import { dfsEntry } from "./entries/dfs";
import { dijkstraEntry } from "./entries/dijkstra";
import { editDistanceEntry } from "./entries/edit-distance";
import { insertionSortEntry } from "./entries/insertion-sort";
import { mergeSortEntry } from "./entries/merge-sort";
import { quickSortEntry } from "./entries/quick-sort";
import { heapSortEntry } from "./entries/heap-sort";
import { kmpEntry } from "./entries/kmp";
import { knapsackEntry } from "./entries/knapsack";
import { lcsEntry } from "./entries/lcs";
import { linearSearchEntry } from "./entries/linear-search";
import { selectionSortEntry } from "./entries/selection-sort";
import { topologicalSortEntry } from "./entries/topological-sort";
import { bstEntry } from "./entries/bst";
import { segmentTreeEntry } from "./entries/segment-tree";
import { treeTraversalsEntry } from "./entries/tree-traversals";
import { trieEntry } from "./entries/trie";
import { unionFindEntry } from "./entries/union-find";
import { kruskalEntry } from "./entries/kruskal";
import { primEntry } from "./entries/prim";
import { bellmanFordEntry } from "./entries/bellman-ford";
import { floydWarshallEntry } from "./entries/floyd-warshall";
import { topologicalSortDfsEntry } from "./entries/topological-sort-dfs";
import { lisEntry } from "./entries/lis";
import { fenwickTreeEntry } from "./entries/fenwick-tree";
import { prefixSumsEntry } from "./entries/prefix-sums";
import { slidingWindowEntry } from "./entries/sliding-window";
import { twoPointersEntry } from "./entries/two-pointers";
import { monotonicStackEntry } from "./entries/monotonic-stack";
import { monotonicQueueEntry } from "./entries/monotonic-queue";
import { sparseTableEntry } from "./entries/sparse-table";
import { kosarajuEntry } from "./entries/kosaraju";
import { tarjanSccEntry } from "./entries/tarjan-scc";
import { bridgesArticulationEntry } from "./entries/bridges-articulation";
import { aStarEntry } from "./entries/a-star";
import { manacherEntry } from "./entries/manacher";
import { ahoCorasickEntry } from "./entries/aho-corasick";
import { suffixArrayEntry } from "./entries/suffix-array";
import { suffixTreeEntry } from "./entries/suffix-tree";
import { suffixAutomatonEntry } from "./entries/suffix-automaton";
import { binaryLiftingEntry } from "./entries/binary-lifting";
import { heavyLightEntry } from "./entries/heavy-light";
import { matrixExponentiationEntry } from "./entries/matrix-exponentiation";
import { memoizationTabulationEntry } from "./entries/memoization-tabulation";
import { millerRabinEntry } from "./entries/miller-rabin";
import { pollardRhoEntry } from "./entries/pollard-rho";
import { crtEntry } from "./entries/crt";
import { nttEntry } from "./entries/ntt";
import { fftEntry } from "./entries/fft";
import { dinicEntry } from "./entries/dinic";
import { pushRelabelEntry } from "./entries/push-relabel";
import { hopcroftKarpEntry } from "./entries/hopcroft-karp";
import { heldKarpEntry } from "./entries/held-karp";
import { assignmentDpEntry } from "./entries/assignment-dp";
import { digitDpEntry } from "./entries/digit-dp";
import { convexHullTrickEntry } from "./entries/convex-hull-trick";
import { grahamScanEntry } from "./entries/graham-scan";
import { closestPairEntry } from "./entries/closest-pair";
import { kdTreeEntry } from "./entries/kd-tree";
import { quickselectEntry } from "./entries/quickselect";
import { mctsEntry } from "./entries/mcts";
import { gradientDescentEntry } from "./entries/gradient-descent";
import { mapReduceEntry } from "./entries/mapreduce";
import { paxosEntry } from "./entries/paxos";
import { raftEntry } from "./entries/raft";
import { shellSortEntry } from "./entries/shell-sort";
import { countingSortEntry } from "./entries/counting-sort";
import { radixSortEntry } from "./entries/radix-sort";
import { sieveEntry } from "./entries/sieve";
import { euclidEntry } from "./entries/euclid";
import { hashChainingEntry } from "./entries/hash-chaining";
import { openAddressingEntry } from "./entries/open-addressing";
import { robinHoodHashingEntry } from "./entries/robin-hood-hashing";
import { cuckooHashingEntry } from "./entries/cuckoo-hashing";
import { rabinKarpEntry } from "./entries/rabin-karp";
import { consistentHashingEntry } from "./entries/consistent-hashing";
import { rendezvousHashingEntry } from "./entries/rendezvous-hashing";
import { zobristHashingEntry } from "./entries/zobrist-hashing";
import { reverseLinkedListEntry } from "./entries/reverse-linked-list";
import { floydCycleEntry } from "./entries/floyd-cycle";
import { mergeSortedListsEntry } from "./entries/merge-sorted-lists";
import { listTwoPointersEntry } from "./entries/list-two-pointers";
import { copyRandomListEntry } from "./entries/copy-random-list";
import { balancedBracketsEntry } from "./entries/balanced-brackets";
import { shuntingYardEntry } from "./entries/shunting-yard";
import { postfixEvaluationEntry } from "./entries/postfix-evaluation";
import { expressionTreeEntry } from "./entries/expression-tree";
import { towerOfHanoiEntry } from "./entries/tower-of-hanoi";
import { queueUsingStacksEntry } from "./entries/queue-using-stacks";
import { minStackEntry } from "./entries/min-stack";
import { circularQueueEntry } from "./entries/circular-queue";
import { dequeEntry } from "./entries/deque";
import { binaryHeapEntry } from "./entries/binary-heap";
import { binomialHeapEntry } from "./entries/binomial-heap";
import { fibonacciHeapEntry } from "./entries/fibonacci-heap";
import { pairingHeapEntry } from "./entries/pairing-heap";
import { radixTreeEntry } from "./entries/radix-tree";
import { patriciaTrieEntry } from "./entries/patricia-trie";
import { ternarySearchTreeEntry } from "./entries/ternary-search-tree";
import { suffixTrieEntry } from "./entries/suffix-trie";
import { skipListEntry } from "./entries/skip-list";
import { lruCacheEntry } from "./entries/lru-cache";
import { lfuCacheEntry } from "./entries/lfu-cache";
import { sentinelSearchEntry } from "./entries/sentinel-search";
import { recursiveBinarySearchEntry } from "./entries/recursive-binary-search";
import { ternarySearchEntry } from "./entries/ternary-search";
import { interpolationSearchEntry } from "./entries/interpolation-search";
import { exponentialSearchEntry } from "./entries/exponential-search";
import { jumpSearchEntry } from "./entries/jump-search";
import { fibonacciSearchEntry } from "./entries/fibonacci-search";
import { uniformBinarySearchEntry } from "./entries/uniform-binary-search";
import { optimizedBubbleSortEntry } from "./entries/optimized-bubble-sort";
import { cocktailShakerSortEntry } from "./entries/cocktail-shaker-sort";
import { combSortEntry } from "./entries/comb-sort";
import { oddEvenSortEntry } from "./entries/odd-even-sort";
import { gnomeSortEntry } from "./entries/gnome-sort";
import { doubleSelectionSortEntry } from "./entries/double-selection-sort";
import { bingoSortEntry } from "./entries/bingo-sort";
import { cycleSortEntry } from "./entries/cycle-sort";
import { binaryInsertionSortEntry } from "./entries/binary-insertion-sort";
import { librarySortEntry } from "./entries/library-sort";
import { patienceSortEntry } from "./entries/patience-sort";
import { naturalMergeSortEntry } from "./entries/natural-merge-sort";
import { bottomUpMergeSortEntry } from "./entries/bottom-up-merge-sort";
import { dualPivotQuickSortEntry } from "./entries/dual-pivot-quick-sort";
import { threeWayQuickSortEntry } from "./entries/three-way-quick-sort";
import { weakHeapSortEntry } from "./entries/weak-heap-sort";
import { smoothSortEntry } from "./entries/smooth-sort";
import { tournamentSortEntry } from "./entries/tournament-sort";
import { msdRadixSortEntry } from "./entries/msd-radix-sort";
import { bucketSortEntry } from "./entries/bucket-sort";
import { flashSortEntry } from "./entries/flash-sort";
import { timSortEntry } from "./entries/tim-sort";
import { introSortEntry } from "./entries/intro-sort";
import { treeSortEntry } from "./entries/tree-sort";
import { pancakeSortEntry } from "./entries/pancake-sort";
import { strandSortEntry } from "./entries/strand-sort";
import { americanFlagSortEntry } from "./entries/american-flag-sort";
import { blockSortEntry } from "./entries/block-sort";
import { beadSortEntry } from "./entries/bead-sort";
import { sleepSortEntry } from "./entries/sleep-sort";
import { bogoSortEntry } from "./entries/bogo-sort";
import { differenceArrayEntry } from "./entries/difference-array";
import { kadaneEntry } from "./entries/kadane";
import { dutchNationalFlagEntry } from "./entries/dutch-national-flag";
import { boyerMooreMajorityEntry } from "./entries/boyer-moore-majority";
import { fisherYatesEntry } from "./entries/fisher-yates";
import { reservoirSamplingEntry } from "./entries/reservoir-sampling";
import { floydFindDuplicateEntry } from "./entries/floyd-find-duplicate";
import { prefixXorEntry } from "./entries/prefix-xor";
import { lazySegmentTreeEntry } from "./entries/lazy-segment-tree";
import { sqrtDecompositionEntry } from "./entries/sqrt-decomposition";
import { moAlgorithmEntry } from "./entries/mo-algorithm";
import { offlineDistinctQueriesEntry } from "./entries/offline-distinct-queries";
import { sweepLineEntry } from "./entries/sweep-line";
import { coordinateCompressionEntry } from "./entries/coordinate-compression";
import { cartesianTreeEntry } from "./entries/cartesian-tree";
import { bloomFilterEntry } from "./entries/bloom-filter";
import { countingBloomFilterEntry } from "./entries/counting-bloom-filter";
import { cuckooFilterEntry } from "./entries/cuckoo-filter";
import { countMinSketchEntry } from "./entries/count-min-sketch";
import { hyperLogLogEntry } from "./entries/hyperloglog";
import { minHashEntry } from "./entries/minhash";
import { perfectHashingEntry } from "./entries/perfect-hashing";
import { universalHashingEntry } from "./entries/universal-hashing";
import { fibonacciDpEntry } from "./entries/fibonacci-dp";
import { climbingStairsEntry } from "./entries/climbing-stairs";
import { minCostClimbingStairsEntry } from "./entries/min-cost-climbing-stairs";
import { houseRobberEntry } from "./entries/house-robber";
import { houseRobberIiEntry } from "./entries/house-robber-ii";
import { unboundedKnapsackEntry } from "./entries/unbounded-knapsack";
import { coinChangeMinEntry } from "./entries/coin-change-min";
import { coinChangeWaysEntry } from "./entries/coin-change-ways";
import { matrixChainEntry } from "./entries/matrix-chain-multiplication";
import { uniquePathsEntry } from "./entries/unique-paths";
import { minimumPathSumEntry } from "./entries/minimum-path-sum";
import { differenceConstraintsEntry } from "./entries/difference-constraints";
import { binaryLiftingArraysEntry } from "./entries/binary-lifting-arrays";
import { naiveStringMatchingEntry } from "./entries/naive-string-matching";
import { zAlgorithmEntry } from "./entries/z-algorithm";
import { binaryExponentiationEntry } from "./entries/binary-exponentiation";
import { iterativeDfsEntry } from "./entries/iterative-dfs";
import { bidirectionalBfsEntry } from "./entries/bidirectional-bfs";
import { longestCommonSubstringEntry } from "./entries/longest-common-substring";
import { longestPalindromicSubsequenceEntry } from "./entries/longest-palindromic-subsequence";
import { quotientFilterEntry } from "./entries/quotient-filter";
import { softHeapEntry } from "./entries/soft-heap";
import { ropeEntry } from "./entries/rope";
import { gapBufferEntry } from "./entries/gap-buffer";
import { huffmanTreeEntry } from "./entries/huffman-tree";
import { intervalTreeEntry } from "./entries/interval-tree";
import { eulerTourEntry } from "./entries/euler-tour";
import { iddfsEntry } from "./entries/iddfs";
import { johnsonsAlgorithmEntry } from "./entries/johnsons-algorithm";
import { leftistHeapEntry } from "./entries/leftist-heap";
import { skewHeapEntry } from "./entries/skew-heap";
import { morrisTraversalEntry } from "./entries/morris-traversal";
import { avlTreeEntry } from "./entries/avl-tree";
import { redBlackTreeEntry } from "./entries/red-black-tree";
import { splayTreeEntry } from "./entries/splay-tree";
import { treapEntry } from "./entries/treap";
import { aaTreeEntry } from "./entries/aa-tree";
import { scapegoatTreeEntry } from "./entries/scapegoat-tree";
import { bTreeEntry } from "./entries/b-tree";
import { bPlusTreeEntry } from "./entries/b-plus-tree";
import { bStarTreeEntry } from "./entries/b-star-tree";

import { twoSatViaSccEntry } from "./entries/2-sat-via-scc";
import { adamOptimizerEntry } from "./entries/adam-optimizer";
import { aesEncryptionEntry } from "./entries/aes-encryption";
import { aksPrimalityTestEntry } from "./entries/aks-primality-test";
import { aliensTrickLagrangianRelaxationWqsBinarySearchEntry } from "./entries/aliens-trick-lagrangian-relaxation-wqs-binary-search";
import { alphaBetaPruningEntry } from "./entries/alpha-beta-pruning";
import { andrewSMonotoneChainEntry } from "./entries/andrew-s-monotone-chain";
import { antColonyOptimizationEntry } from "./entries/ant-colony-optimization";
import { ariesRecoveryEntry } from "./entries/aries-recovery";
import { arithmeticCodingEntry } from "./entries/arithmetic-coding";
import { asymmetricNumeralSystemsAnsEntry } from "./entries/asymmetric-numeral-systems-ans";
import { backpropagationEntry } from "./entries/backpropagation";
import { ballTreeEntry } from "./entries/ball-tree";
import { bbrCongestionControlEntry } from "./entries/bbr-congestion-control";
import { beamSearchEntry } from "./entries/beam-search";
import { beliefPropagationEntry } from "./entries/belief-propagation";
import { bentleyOttmannAlgorithmEntry } from "./entries/bentley-ottmann-algorithm";
import { berlekampMasseyEntry } from "./entries/berlekamp-massey";
import { bidirectionalDijkstraEntry } from "./entries/bidirectional-dijkstra";
import { binaryGcdSteinSAlgorithmEntry } from "./entries/binary-gcd-stein-s-algorithm";
import { binomialCoefficientDpEntry } from "./entries/binomial-coefficient-dp";
import { bipartiteMatchingViaFlowEntry } from "./entries/bipartite-matching-via-flow";
import { bisectionMethodEntry } from "./entries/bisection-method";
import { bitonicSortEntry } from "./entries/bitonic-sort";
import { bloomJoinEntry } from "./entries/bloom-join";
import { blossomAlgorithmEntry } from "./entries/blossom-algorithm";
import { boothSAlgorithmLexicographicallyMinimumRotationEntry } from "./entries/booth-s-algorithm-lexicographically-minimum-rotation";
import { borVkaSAlgorithmEntry } from "./entries/bor-vka-s-algorithm";
import { borderArrayEntry } from "./entries/border-array";
import { boyerMooreEntry } from "./entries/boyer-moore";
import { boyerMooreHorspoolEntry } from "./entries/boyer-moore-horspool";
import { branchAndBoundEntry } from "./entries/branch-and-bound";
import { branchAndCutEntry } from "./entries/branch-and-cut";
import { brokenProfileDpEntry } from "./entries/broken-profile-dp";
import { bufferReplacementClockAlgorithmEntry } from "./entries/buffer-replacement-clock-algorithm";
import { bullyLeaderElectionAlgorithmEntry } from "./entries/bully-leader-election-algorithm";
import { burrowsWheelerTransformBwtEntry } from "./entries/burrows-wheeler-transform-bwt";
import { burstBalloonsEntry } from "./entries/burst-balloons";
import { calendarQueueEntry } from "./entries/calendar-queue";
import { catalanNumbersEntry } from "./entries/catalan-numbers";
import { cdqDivideAndConquerEntry } from "./entries/cdq-divide-and-conquer";
import { centroidDecompositionEntry } from "./entries/centroid-decomposition";
import { chacha20Entry } from "./entries/chacha20";
import { chandyLamportSnapshotAlgorithmEntry } from "./entries/chandy-lamport-snapshot-algorithm";
import { cherryPickupEntry } from "./entries/cherry-pickup";
import { choleskyDecompositionEntry } from "./entries/cholesky-decomposition";
import { chordDhtEntry } from "./entries/chord-dht";
import { christofidesAlgorithmApproximateTspEntry } from "./entries/christofides-algorithm-approximate-tsp";
import { chromaticPolynomialExactColoringEntry } from "./entries/chromatic-polynomial-exact-coloring";
import { cityhashEntry } from "./entries/cityhash";
import { commentzWalterEntry } from "./entries/commentz-walter";
import { concurrentSkipListEntry } from "./entries/concurrent-skip-list";
import { conjugateGradientEntry } from "./entries/conjugate-gradient";
import { connectedComponentsEntry } from "./entries/connected-components";
import { convexPolygonIntersectionEntry } from "./entries/convex-polygon-intersection";
import { costBasedQueryOptimizationSelingerEntry } from "./entries/cost-based-query-optimization-selinger";
import { coverTreeEntry } from "./entries/cover-tree";
import { crc32Entry } from "./entries/crc32";
import { crdtsGCounterOrSetRgaEntry } from "./entries/crdts-g-counter-or-set-rga";
import { cycleDetectionDirectedEntry } from "./entries/cycle-detection-directed";
import { cycleDetectionUndirectedEntry } from "./entries/cycle-detection-undirected";
import { damerauLevenshteinDistanceEntry } from "./entries/damerau-levenshtein-distance";
import { decisionTreeLearningId3C45CartEntry } from "./entries/decision-tree-learning-id3-c4-5-cart";
import { deflateEntry } from "./entries/deflate";
import { delaunayTriangulationEntry } from "./entries/delaunay-triangulation";
import { derangementsEntry } from "./entries/derangements";
import { desEntry } from "./entries/des";
import { determinantComputationEntry } from "./entries/determinant-computation";
import { dfaConstructionEntry } from "./entries/dfa-construction";
import { dialSAlgorithmEntry } from "./entries/dial-s-algorithm";
import { diameterOfTreeEntry } from "./entries/diameter-of-tree";
import { diffieHellmanKeyExchangeEntry } from "./entries/diffie-hellman-key-exchange";
import { diffusionModelSamplingDdpmEntry } from "./entries/diffusion-model-sampling-ddpm";
import { directedAcyclicWordGraphDawgEntry } from "./entries/directed-acyclic-word-graph-dawg";
import { distanceBetweenTwoPointsEntry } from "./entries/distance-between-two-points";
import { distanceFromPointToLineEntry } from "./entries/distance-from-point-to-line";
import { divideAndConquerDpOptimizationEntry } from "./entries/divide-and-conquer-dp-optimization";
import { dixonSFactorizationEntry } from "./entries/dixon-s-factorization";
import { dominatorTreeLengauerTarjanEntry } from "./entries/dominator-tree-lengauer-tarjan";
import { doubleHashingEntry } from "./entries/double-hashing";
import { dpOnBrokenLinesConnectivityDpEntry } from "./entries/dp-on-broken-lines-connectivity-dp";
import { dsaturEntry } from "./entries/dsatur";
import { dungeonGameEntry } from "./entries/dungeon-game";
import { dynamicConnectivityOfflineDivideConquerEntry } from "./entries/dynamic-connectivity-offline-divide-conquer";
import { dynamicTreeEntry } from "./entries/dynamic-tree";
import { ed25519Entry } from "./entries/ed25519";
import { edmondsArborescenceChuLiuEdmondsEntry } from "./entries/edmonds-arborescence-chu-liu-edmonds";
import { edmondsKarpEntry } from "./entries/edmonds-karp";
import { ellipticCurveDiffieHellmanEcdhEntry } from "./entries/elliptic-curve-diffie-hellman-ecdh";
import { ellipticCurveDigitalSignatureAlgorithmEcdsaEntry } from "./entries/elliptic-curve-digital-signature-algorithm-ecdsa";
import { eulerSTheoremEntry } from "./entries/euler-s-theorem";
import { eulerSTotientFunctionEntry } from "./entries/euler-s-totient-function";
import { eulerTourTreeEntry } from "./entries/euler-tour-tree";
import { expectationMaximizationEntry } from "./entries/expectation-maximization";
import { expectimaxEntry } from "./entries/expectimax";
import { extendibleHashingEntry } from "./entries/extendible-hashing";
import { externalMergeSortEntry } from "./entries/external-merge-sort";
import { failureFunctionEntry } from "./entries/failure-function";
import { fastModularExponentiationEntry } from "./entries/fast-modular-exponentiation";
import { fermatFactorizationEntry } from "./entries/fermat-factorization";
import { fermatPrimalityTestEntry } from "./entries/fermat-primality-test";
import { finiteElementMethod1d2dEntry } from "./entries/finite-element-method-1d-2d";
import { flashattentionEntry } from "./entries/flashattention";
import { fleurySAlgorithmEntry } from "./entries/fleury-s-algorithm";
import { fmIndexFullTextSearchEntry } from "./entries/fm-index-full-text-search";
import { fordFulkersonEntry } from "./entries/ford-fulkerson";
import { fractionalKnapsackGreedyDpComparisonEntry } from "./entries/fractional-knapsack-greedy-dp-comparison";
import { gaussianEliminationEntry } from "./entries/gaussian-elimination";
import { gaussianMixtureModelsEntry } from "./entries/gaussian-mixture-models";
import { generalWeightedMatchingEntry } from "./entries/general-weighted-matching";
import { geneticAlgorithmEntry } from "./entries/genetic-algorithm";
import { gibbsSamplingEntry } from "./entries/gibbs-sampling";
import { gomoryHuTreeEntry } from "./entries/gomory-hu-tree";
import { gossipProtocolEntry } from "./entries/gossip-protocol";
import { graceHashJoinEntry } from "./entries/grace-hash-join";
import { gramSchmidtOrthogonalizationEntry } from "./entries/gram-schmidt-orthogonalization";
import { greedySetCoverApproximationEntry } from "./entries/greedy-set-cover-approximation";
import { groupKnapsackEntry } from "./entries/group-knapsack";
import { groverSSearchEntry } from "./entries/grover-s-search";
import { halfPlaneIntersectionEntry } from "./entries/half-plane-intersection";
import { hamiltonianBacktrackingEntry } from "./entries/hamiltonian-backtracking";
import { hamiltonianMonteCarloEntry } from "./entries/hamiltonian-monte-carlo";
import { hammingCodesEntry } from "./entries/hamming-codes";
import { hammingDistanceEntry } from "./entries/hamming-distance";
import { hiddenMarkovModelsForwardBackwardEntry } from "./entries/hidden-markov-models-forward-backward";
import { hierholzerSAlgorithmEntry } from "./entries/hierholzer-s-algorithm";
import { hillClimbingEntry } from "./entries/hill-climbing";
import { hmacEntry } from "./entries/hmac";
import { hungarianAlgorithmEntry } from "./entries/hungarian-algorithm";
import { hybridLogicalClocksEntry } from "./entries/hybrid-logical-clocks";
import { inclusionExclusionPrincipleEntry } from "./entries/inclusion-exclusion-principle";
import { integerPartitionDpEntry } from "./entries/integer-partition-dp";
import { interiorPointMethodsEntry } from "./entries/interior-point-methods";
import { inverseFftEntry } from "./entries/inverse-fft";
import { iterativeDeepeningAEntry } from "./entries/iterative-deepening-a";
import { jaroSimilarityEntry } from "./entries/jaro-similarity";
import { jaroWinklerDistanceEntry } from "./entries/jaro-winkler-distance";
import { jarvisMarchGiftWrappingEntry } from "./entries/jarvis-march-gift-wrapping";
import { johnsonSElementaryCyclesEntry } from "./entries/johnson-s-elementary-cycles";
import { kMeansClusteringEntry } from "./entries/k-means-clustering";
import { kNigSTheoremConstructionEntry } from "./entries/k-nig-s-theorem-construction";
import { kShortestPathsEntry } from "./entries/k-shortest-paths";
import { kademliaDhtEntry } from "./entries/kademlia-dht";
import { kalmanFilterEntry } from "./entries/kalman-filter";
import { karatsubaMultiplicationEntry } from "./entries/karatsuba-multiplication";
import { kargerSMinimumCutAlgorithmEntry } from "./entries/karger-s-minimum-cut-algorithm";
import { kasaiAlgorithmLcpArrayEntry } from "./entries/kasai-algorithm-lcp-array";
import { kirchhoffMatrixTreeCountingEntry } from "./entries/kirchhoff-matrix-tree-counting";
import { kitamasaMethodEntry } from "./entries/kitamasa-method";
import { knuthOptimizationEntry } from "./entries/knuth-optimization";
import { kyberPostQuantumKeyExchangeEntry } from "./entries/kyber-post-quantum-key-exchange";
import { lBfgsEntry } from "./entries/l-bfgs";
import { lamportClocksEntry } from "./entries/lamport-clocks";
import { lasVegasAlgorithmEntry } from "./entries/las-vegas-algorithm";
import { ldpcDecodingBeliefPropagationEntry } from "./entries/ldpc-decoding-belief-propagation";
import { leastCommonMultipleLcmEntry } from "./entries/least-common-multiple-lcm";
import { lexicographicRankAlgorithmEntry } from "./entries/lexicographic-rank-algorithm";
import { liChaoTreeEntry } from "./entries/li-chao-tree";
import { lineSegmentIntersectionEntry } from "./entries/line-segment-intersection";
import { lineSweepForClosestPairEntry } from "./entries/line-sweep-for-closest-pair";
import { linearHashingEntry } from "./entries/linear-hashing";
import { linearSieveEntry } from "./entries/linear-sieve";
import { linkCutTreeEntry } from "./entries/link-cut-tree";
import { localSearchEntry } from "./entries/local-search";
import { lockFreeQueueEntry } from "./entries/lock-free-queue";
import { longestCommonSubstringSuffixArrayMethodEntry } from "./entries/longest-common-substring-suffix-array-method";
import { longestPalindromicSubstringEntry } from "./entries/longest-palindromic-substring";
import { longestRepeatedSubstringEntry } from "./entries/longest-repeated-substring";
import { louvainCommunityDetectionEntry } from "./entries/louvain-community-detection";
import { lsmTreeLogStructuredMergeTreeEntry } from "./entries/lsm-tree-log-structured-merge-tree";
import { luDecompositionEntry } from "./entries/lu-decomposition";
import { lucasTheoremEntry } from "./entries/lucas-theorem";
import { lyndonFactorizationDuvalSAlgorithmEntry } from "./entries/lyndon-factorization-duval-s-algorithm";
import { lz77Entry } from "./entries/lz77";
import { lz78Entry } from "./entries/lz78";
import { lzwEntry } from "./entries/lzw";
import { matrixExponentiationForLinearRecurrencesEntry } from "./entries/matrix-exponentiation-for-linear-recurrences";
import { matrixInversionEntry } from "./entries/matrix-inversion";
import { matrixRankEntry } from "./entries/matrix-rank";
import { maximumCliqueBronKerboschEntry } from "./entries/maximum-clique-bron-kerbosch";
import { maximumIndependentSetOnTreeEntry } from "./entries/maximum-independent-set-on-tree";
import { meetInTheMiddleEntry } from "./entries/meet-in-the-middle";
import { mergeSortTreeEntry } from "./entries/merge-sort-tree";
import { mergeStonesEntry } from "./entries/merge-stones";
import { merkleAntiEntropyRepairEntry } from "./entries/merkle-anti-entropy-repair";
import { merkleTreeConstructionEntry } from "./entries/merkle-tree-construction";
import { metropolisHastingsMcmcEntry } from "./entries/metropolis-hastings-mcmc";
import { michaelScottQueueEntry } from "./entries/michael-scott-queue";
import { minCostFlowCycleCancelingEntry } from "./entries/min-cost-flow-cycle-canceling";
import { minCostMaxFlowSuccessiveShortestPathsEntry } from "./entries/min-cost-max-flow-successive-shortest-paths";
import { minimaxEntry } from "./entries/minimax";
import { modularAdditionEntry } from "./entries/modular-addition";
import { modularDivisionEntry } from "./entries/modular-division";
import { modularInverseEntry } from "./entries/modular-inverse";
import { modularMultiplicationEntry } from "./entries/modular-multiplication";
import { monteCarloAlgorithmEntry } from "./entries/monte-carlo-algorithm";
import { moveToFrontTransformEntry } from "./entries/move-to-front-transform";
import { multigridMethodsEntry } from "./entries/multigrid-methods";
import { multipleKnapsackEntry } from "./entries/multiple-knapsack";
import { murmurhashEntry } from "./entries/murmurhash";
import { mvccMultiVersionConcurrencyControlEntry } from "./entries/mvcc-multi-version-concurrency-control";
import { newtonRaphsonMethodEntry } from "./entries/newton-raphson-method";
import { newtonSMethodForOptimizationEntry } from "./entries/newton-s-method-for-optimization";
import { octreeEntry } from "./entries/octree";
import { oddEvenMergeSortEntry } from "./entries/odd-even-merge-sort";
import { operationalTransformationEntry } from "./entries/operational-transformation";
import { optimalBinarySearchTreeEntry } from "./entries/optimal-binary-search-tree";
import { orderStatisticTreeEntry } from "./entries/order-statistic-tree";
import { orientationTestCcwTestEntry } from "./entries/orientation-test-ccw-test";
import { pagerankEntry } from "./entries/pagerank";
import { palindromePartitioningEntry } from "./entries/palindrome-partitioning";
import { palindromicTreeEertreeEntry } from "./entries/palindromic-tree-eertree";
import { parallelBfsEntry } from "./entries/parallel-bfs";
import { parallelBinarySearchEntry } from "./entries/parallel-binary-search";
import { parallelDfsEntry } from "./entries/parallel-dfs";
import { parallelFftEntry } from "./entries/parallel-fft";
import { parallelMatrixMultiplicationEntry } from "./entries/parallel-matrix-multiplication";
import { parallelMergeSortEntry } from "./entries/parallel-merge-sort";
import { parallelPrefixSumScanEntry } from "./entries/parallel-prefix-sum-scan";
import { parallelQuicksortEntry } from "./entries/parallel-quicksort";
import { particleFilterEntry } from "./entries/particle-filter";
import { particleSwarmOptimizationEntry } from "./entries/particle-swarm-optimization";
import { partitionEqualSubsetSumEntry } from "./entries/partition-equal-subset-sum";
import { pascalSTriangleEntry } from "./entries/pascal-s-triangle";
import { pathCompressionEntry } from "./entries/path-compression";
import { pbftPracticalByzantineFaultToleranceEntry } from "./entries/pbft-practical-byzantine-fault-tolerance";
import { pcaEntry } from "./entries/pca";
import { persistentDsuRollbackDsuEntry } from "./entries/persistent-dsu-rollback-dsu";
import { persistentQueueEntry } from "./entries/persistent-queue";
import { persistentSegmentTreeEntry } from "./entries/persistent-segment-tree";
import { persistentStackEntry } from "./entries/persistent-stack";
import { pieceTableEntry } from "./entries/piece-table";
import { planarityTestingBoyerMyrvoldEntry } from "./entries/planarity-testing-boyer-myrvold";
import { pointInConvexPolygonEntry } from "./entries/point-in-convex-polygon";
import { pointInPolygonRayCastingEntry } from "./entries/point-in-polygon-ray-casting";
import { pointOnSegmentTestEntry } from "./entries/point-on-segment-test";
import { policyGradientReinforceEntry } from "./entries/policy-gradient-reinforce";
import { poly1305Entry } from "./entries/poly1305";
import { polygonAreaShoelaceFormulaEntry } from "./entries/polygon-area-shoelace-formula";
import { polygonTriangulationEntry } from "./entries/polygon-triangulation";
import { polynomialRollingHashEntry } from "./entries/polynomial-rolling-hash";
import { primeFactorizationEntry } from "./entries/prime-factorization";
import { profileDpEntry } from "./entries/profile-dp";
import { proximalPolicyOptimizationPpoEntry } from "./entries/proximal-policy-optimization-ppo";
import { qLearningDqnEntry } from "./entries/q-learning-dqn";
import { qrDecompositionEntry } from "./entries/qr-decomposition";
import { quadTreeEntry } from "./entries/quad-tree";
import { quantumFourierTransformEntry } from "./entries/quantum-fourier-transform";
import { quickhullEntry } from "./entries/quickhull";
import { rTreeEntry } from "./entries/r-tree";
import { rabinFingerprintEntry } from "./entries/rabin-fingerprint";
import { randomizedIncrementalConvexHullEntry } from "./entries/randomized-incremental-convex-hull";
import { randomizedKruskalEntry } from "./entries/randomized-kruskal";
import { randomizedPrimSAlgorithmEntry } from "./entries/randomized-prim-s-algorithm";
import { randomizedQuicksortEntry } from "./entries/randomized-quicksort";
import { rangeTreeEntry } from "./entries/range-tree";
import { reedSolomonCodesEntry } from "./entries/reed-solomon-codes";
import { regexBacktrackingAlgorithmEntry } from "./entries/regex-backtracking-algorithm";
import { regularExpressionMatchingDpEntry } from "./entries/regular-expression-matching-dp";
import { removeBoxesEntry } from "./entries/remove-boxes";
import { reverseDeleteAlgorithmEntry } from "./entries/reverse-delete-algorithm";
import { rotatingCalipersEntry } from "./entries/rotating-calipers";
import { rsaEncryptionEntry } from "./entries/rsa-encryption";
import { rsaKeyGenerationEntry } from "./entries/rsa-key-generation";
import { runLengthEncodingEntry } from "./entries/run-length-encoding";
import { rungeKuttaRk4Entry } from "./entries/runge-kutta-rk4";
import { scaledDotProductAttentionEntry } from "./entries/scaled-dot-product-attention";
import { schNhageStrassenMultiplicationEntry } from "./entries/sch-nhage-strassen-multiplication";
import { schnorrSignaturesEntry } from "./entries/schnorr-signatures";
import { secantMethodEntry } from "./entries/secant-method";
import { segmentedSieveEntry } from "./entries/segmented-sieve";
import { sequenceAlignmentNeedlemanWunschEntry } from "./entries/sequence-alignment-needleman-wunsch";
import { sha1Entry } from "./entries/sha-1";
import { sha2Entry } from "./entries/sha-2";
import { sha3Entry } from "./entries/sha-3";
import { shamirSecretSharingEntry } from "./entries/shamir-secret-sharing";
import { shorSAlgorithmEntry } from "./entries/shor-s-algorithm";
import { shortestCommonSupersequenceEntry } from "./entries/shortest-common-supersequence";
import { simplexMethodEntry } from "./entries/simplex-method";
import { simulatedAnnealingEntry } from "./entries/simulated-annealing";
import { singularValueDecompositionEntry } from "./entries/singular-value-decomposition";
import { siphashEntry } from "./entries/siphash";
import { slopeTrickEntry } from "./entries/slope-trick";
import { smallToLargeMergingDsuOnTreeEntry } from "./entries/small-to-large-merging-dsu-on-tree";
import { smallestEnclosingCircleWelzlSAlgorithmEntry } from "./entries/smallest-enclosing-circle-welzl-s-algorithm";
import { snapshotIsolationEntry } from "./entries/snapshot-isolation";
import { solovayStrassenTestEntry } from "./entries/solovay-strassen-test";
import { spaceOptimizedDpEntry } from "./entries/space-optimized-dp";
import { spfaShortestPathFasterAlgorithmEntry } from "./entries/spfa-shortest-path-faster-algorithm";
import { stateCompressionDpEntry } from "./entries/state-compression-dp";
import { stateMachineDpEntry } from "./entries/state-machine-dp";
import { steinerTreeDpDreyfusWagnerEntry } from "./entries/steiner-tree-dp-dreyfus-wagner";
import { stochasticGradientDescentSgdEntry } from "./entries/stochastic-gradient-descent-sgd";
import { stoerWagnerMinimumCutEntry } from "./entries/stoer-wagner-minimum-cut";
import { stringInterleavingDpEntry } from "./entries/string-interleaving-dp";
import { stronglyConnectedComponentsGabowEntry } from "./entries/strongly-connected-components-gabow";
import { suffixArraySaIsLinearAlgorithmEntry } from "./entries/suffix-array-sa-is-linear-algorithm";
import { sumOverSubsetsSosDpEntry } from "./entries/sum-over-subsets-sos-dp";
import { sundayAlgorithmEntry } from "./entries/sunday-algorithm";
import { swimMembershipProtocolEntry } from "./entries/swim-membership-protocol";
import { tabuSearchEntry } from "./entries/tabu-search";
import { tcpCongestionControlRenoCubicEntry } from "./entries/tcp-congestion-control-reno-cubic";
import { thompsonNfaConstructionEntry } from "./entries/thompson-nfa-construction";
import { threePhaseCommitEntry } from "./entries/three-phase-commit";
import { tokenBucketRateLimitingEntry } from "./entries/token-bucket-rate-limiting";
import { toomCookMultiplicationEntry } from "./entries/toom-cook-multiplication";
import { transformerForwardBackwardPassEntry } from "./entries/transformer-forward-backward-pass";
import { treeDpEntry } from "./entries/tree-dp";
import { treeIsomorphismAhuEntry } from "./entries/tree-isomorphism-ahu";
import { treeMatchingDpEntry } from "./entries/tree-matching-dp";
import { treiberStackEntry } from "./entries/treiber-stack";
import { trialDivisionEntry } from "./entries/trial-division";
import { tripleDesEntry } from "./entries/triple-des";
import { twoPhaseCommitEntry } from "./entries/two-phase-commit";
import { twoPhaseLockingEntry } from "./entries/two-phase-locking";
import { uniquePathsIiEntry } from "./entries/unique-paths-ii";
import { unrolledLinkedListEntry } from "./entries/unrolled-linked-list";
import { variationalInferenceEntry } from "./entries/variational-inference";
import { vectorClocksEntry } from "./entries/vector-clocks";
import { vertexCoverApproximationEntry } from "./entries/vertex-cover-approximation";
import { viterbiDecodingEntry } from "./entries/viterbi-decoding";
import { voronoiDiagramFortuneSAlgorithmEntry } from "./entries/voronoi-diagram-fortune-s-algorithm";
import { vpTreeEntry } from "./entries/vp-tree";
import { waitFreeQueueEntry } from "./entries/wait-free-queue";
import { waveletTreeEntry } from "./entries/wavelet-tree";
import { welshPowellEntry } from "./entries/welsh-powell";
import { wheelFactorizationEntry } from "./entries/wheel-factorization";
import { wildcardPatternMatchingEntry } from "./entries/wildcard-pattern-matching";
import { wuManberEntry } from "./entries/wu-manber";
import { xTreeEntry } from "./entries/x-tree";
import { xorLinkedListEntry } from "./entries/xor-linked-list";
import { xxhashEntry } from "./entries/xxhash";
import { yenSAlgorithmEntry } from "./entries/yen-s-algorithm";

/** All published entries. Order here is the default display order. */
export const ENTRIES: readonly AlgorithmEntry[] = [
  linearSearchEntry,
  binarySearchEntry,
  prefixSumsEntry,
  twoPointersEntry,
  slidingWindowEntry,
  monotonicStackEntry,
  monotonicQueueEntry,
  bubbleSortEntry,
  selectionSortEntry,
  insertionSortEntry,
  shellSortEntry,
  countingSortEntry,
  radixSortEntry,
  hashChainingEntry,
  openAddressingEntry,
  robinHoodHashingEntry,
  cuckooHashingEntry,
  consistentHashingEntry,
  rendezvousHashingEntry,
  zobristHashingEntry,
  rabinKarpEntry,
  reverseLinkedListEntry,
  floydCycleEntry,
  mergeSortedListsEntry,
  listTwoPointersEntry,
  copyRandomListEntry,
  balancedBracketsEntry,
  shuntingYardEntry,
  postfixEvaluationEntry,
  expressionTreeEntry,
  towerOfHanoiEntry,
  queueUsingStacksEntry,
  minStackEntry,
  circularQueueEntry,
  dequeEntry,
  binaryHeapEntry,
  binomialHeapEntry,
  fibonacciHeapEntry,
  pairingHeapEntry,
  radixTreeEntry,
  patriciaTrieEntry,
  ternarySearchTreeEntry,
  suffixTrieEntry,
  skipListEntry,
  lruCacheEntry,
  lfuCacheEntry,
  sentinelSearchEntry,
  recursiveBinarySearchEntry,
  ternarySearchEntry,
  interpolationSearchEntry,
  exponentialSearchEntry,
  jumpSearchEntry,
  fibonacciSearchEntry,
  uniformBinarySearchEntry,
  optimizedBubbleSortEntry,
  cocktailShakerSortEntry,
  combSortEntry,
  oddEvenSortEntry,
  gnomeSortEntry,
  doubleSelectionSortEntry,
  bingoSortEntry,
  cycleSortEntry,
  binaryInsertionSortEntry,
  librarySortEntry,
  patienceSortEntry,
  naturalMergeSortEntry,
  bottomUpMergeSortEntry,
  dualPivotQuickSortEntry,
  threeWayQuickSortEntry,
  weakHeapSortEntry,
  smoothSortEntry,
  tournamentSortEntry,
  msdRadixSortEntry,
  bucketSortEntry,
  flashSortEntry,
  timSortEntry,
  introSortEntry,
  treeSortEntry,
  pancakeSortEntry,
  strandSortEntry,
  americanFlagSortEntry,
  blockSortEntry,
  beadSortEntry,
  sleepSortEntry,
  bogoSortEntry,
  differenceArrayEntry,
  kadaneEntry,
  dutchNationalFlagEntry,
  boyerMooreMajorityEntry,
  fisherYatesEntry,
  reservoirSamplingEntry,
  floydFindDuplicateEntry,
  prefixXorEntry,
  lazySegmentTreeEntry,
  sqrtDecompositionEntry,
  moAlgorithmEntry,
  offlineDistinctQueriesEntry,
  sweepLineEntry,
  coordinateCompressionEntry,
  cartesianTreeEntry,
  bloomFilterEntry,
  countingBloomFilterEntry,
  cuckooFilterEntry,
  countMinSketchEntry,
  hyperLogLogEntry,
  minHashEntry,
  perfectHashingEntry,
  universalHashingEntry,
  fibonacciDpEntry,
  climbingStairsEntry,
  minCostClimbingStairsEntry,
  houseRobberEntry,
  houseRobberIiEntry,
  unboundedKnapsackEntry,
  coinChangeMinEntry,
  coinChangeWaysEntry,
  matrixChainEntry,
  uniquePathsEntry,
  minimumPathSumEntry,
  differenceConstraintsEntry,
  binaryLiftingArraysEntry,
  naiveStringMatchingEntry,
  zAlgorithmEntry,
  binaryExponentiationEntry,
  iterativeDfsEntry,
  bidirectionalBfsEntry,
  longestCommonSubstringEntry,
  longestPalindromicSubsequenceEntry,
  quotientFilterEntry,
  softHeapEntry,
  ropeEntry,
  gapBufferEntry,
  huffmanTreeEntry,
  intervalTreeEntry,
  eulerTourEntry,
  iddfsEntry,
  johnsonsAlgorithmEntry,
  leftistHeapEntry,
  skewHeapEntry,
  morrisTraversalEntry,
  avlTreeEntry,
  redBlackTreeEntry,
  splayTreeEntry,
  treapEntry,
  scapegoatTreeEntry,
  aaTreeEntry,
  bTreeEntry,
  bPlusTreeEntry,
  bStarTreeEntry,
  mergeSortEntry,
  quickSortEntry,
  heapSortEntry,
  bfsEntry,
  dfsEntry,
  dijkstraEntry,
  bellmanFordEntry,
  floydWarshallEntry,
  aStarEntry,
  topologicalSortEntry,
  topologicalSortDfsEntry,
  kosarajuEntry,
  tarjanSccEntry,
  bridgesArticulationEntry,
  dinicEntry,
  pushRelabelEntry,
  hopcroftKarpEntry,
  unionFindEntry,
  kruskalEntry,
  primEntry,
  memoizationTabulationEntry,
  editDistanceEntry,
  lcsEntry,
  lisEntry,
  knapsackEntry,
  heldKarpEntry,
  assignmentDpEntry,
  digitDpEntry,
  convexHullTrickEntry,
  grahamScanEntry,
  closestPairEntry,
  kdTreeEntry,
  quickselectEntry,
  mctsEntry,
  gradientDescentEntry,
  mapReduceEntry,
  paxosEntry,
  raftEntry,
  kmpEntry,
  ahoCorasickEntry,
  manacherEntry,
  suffixArrayEntry,
  suffixTreeEntry,
  suffixAutomatonEntry,
  treeTraversalsEntry,
  bstEntry,
  trieEntry,
  segmentTreeEntry,
  fenwickTreeEntry,
  sparseTableEntry,
  binaryLiftingEntry,
  heavyLightEntry,
  matrixExponentiationEntry,
  millerRabinEntry,
  pollardRhoEntry,
  euclidEntry,
  sieveEntry,
  crtEntry,
  fftEntry,
  nttEntry,
  twoSatViaSccEntry,
  adamOptimizerEntry,
  aesEncryptionEntry,
  aksPrimalityTestEntry,
  aliensTrickLagrangianRelaxationWqsBinarySearchEntry,
  alphaBetaPruningEntry,
  andrewSMonotoneChainEntry,
  antColonyOptimizationEntry,
  ariesRecoveryEntry,
  arithmeticCodingEntry,
  asymmetricNumeralSystemsAnsEntry,
  backpropagationEntry,
  ballTreeEntry,
  bbrCongestionControlEntry,
  beamSearchEntry,
  beliefPropagationEntry,
  bentleyOttmannAlgorithmEntry,
  berlekampMasseyEntry,
  bidirectionalDijkstraEntry,
  binaryGcdSteinSAlgorithmEntry,
  binomialCoefficientDpEntry,
  bipartiteMatchingViaFlowEntry,
  bisectionMethodEntry,
  bitonicSortEntry,
  bloomJoinEntry,
  blossomAlgorithmEntry,
  boothSAlgorithmLexicographicallyMinimumRotationEntry,
  borVkaSAlgorithmEntry,
  borderArrayEntry,
  boyerMooreEntry,
  boyerMooreHorspoolEntry,
  branchAndBoundEntry,
  branchAndCutEntry,
  brokenProfileDpEntry,
  bufferReplacementClockAlgorithmEntry,
  bullyLeaderElectionAlgorithmEntry,
  burrowsWheelerTransformBwtEntry,
  burstBalloonsEntry,
  calendarQueueEntry,
  catalanNumbersEntry,
  cdqDivideAndConquerEntry,
  centroidDecompositionEntry,
  chacha20Entry,
  chandyLamportSnapshotAlgorithmEntry,
  cherryPickupEntry,
  choleskyDecompositionEntry,
  chordDhtEntry,
  christofidesAlgorithmApproximateTspEntry,
  chromaticPolynomialExactColoringEntry,
  cityhashEntry,
  commentzWalterEntry,
  concurrentSkipListEntry,
  conjugateGradientEntry,
  connectedComponentsEntry,
  convexPolygonIntersectionEntry,
  costBasedQueryOptimizationSelingerEntry,
  coverTreeEntry,
  crc32Entry,
  crdtsGCounterOrSetRgaEntry,
  cycleDetectionDirectedEntry,
  cycleDetectionUndirectedEntry,
  damerauLevenshteinDistanceEntry,
  decisionTreeLearningId3C45CartEntry,
  deflateEntry,
  delaunayTriangulationEntry,
  derangementsEntry,
  desEntry,
  determinantComputationEntry,
  dfaConstructionEntry,
  dialSAlgorithmEntry,
  diameterOfTreeEntry,
  diffieHellmanKeyExchangeEntry,
  diffusionModelSamplingDdpmEntry,
  directedAcyclicWordGraphDawgEntry,
  distanceBetweenTwoPointsEntry,
  distanceFromPointToLineEntry,
  divideAndConquerDpOptimizationEntry,
  dixonSFactorizationEntry,
  dominatorTreeLengauerTarjanEntry,
  doubleHashingEntry,
  dpOnBrokenLinesConnectivityDpEntry,
  dsaturEntry,
  dungeonGameEntry,
  dynamicConnectivityOfflineDivideConquerEntry,
  dynamicTreeEntry,
  ed25519Entry,
  edmondsArborescenceChuLiuEdmondsEntry,
  edmondsKarpEntry,
  ellipticCurveDiffieHellmanEcdhEntry,
  ellipticCurveDigitalSignatureAlgorithmEcdsaEntry,
  eulerSTheoremEntry,
  eulerSTotientFunctionEntry,
  eulerTourTreeEntry,
  expectationMaximizationEntry,
  expectimaxEntry,
  extendibleHashingEntry,
  externalMergeSortEntry,
  failureFunctionEntry,
  fastModularExponentiationEntry,
  fermatFactorizationEntry,
  fermatPrimalityTestEntry,
  finiteElementMethod1d2dEntry,
  flashattentionEntry,
  fleurySAlgorithmEntry,
  fmIndexFullTextSearchEntry,
  fordFulkersonEntry,
  fractionalKnapsackGreedyDpComparisonEntry,
  gaussianEliminationEntry,
  gaussianMixtureModelsEntry,
  generalWeightedMatchingEntry,
  geneticAlgorithmEntry,
  gibbsSamplingEntry,
  gomoryHuTreeEntry,
  gossipProtocolEntry,
  graceHashJoinEntry,
  gramSchmidtOrthogonalizationEntry,
  greedySetCoverApproximationEntry,
  groupKnapsackEntry,
  groverSSearchEntry,
  halfPlaneIntersectionEntry,
  hamiltonianBacktrackingEntry,
  hamiltonianMonteCarloEntry,
  hammingCodesEntry,
  hammingDistanceEntry,
  hiddenMarkovModelsForwardBackwardEntry,
  hierholzerSAlgorithmEntry,
  hillClimbingEntry,
  hmacEntry,
  hungarianAlgorithmEntry,
  hybridLogicalClocksEntry,
  inclusionExclusionPrincipleEntry,
  integerPartitionDpEntry,
  interiorPointMethodsEntry,
  inverseFftEntry,
  iterativeDeepeningAEntry,
  jaroSimilarityEntry,
  jaroWinklerDistanceEntry,
  jarvisMarchGiftWrappingEntry,
  johnsonSElementaryCyclesEntry,
  kMeansClusteringEntry,
  kNigSTheoremConstructionEntry,
  kShortestPathsEntry,
  kademliaDhtEntry,
  kalmanFilterEntry,
  karatsubaMultiplicationEntry,
  kargerSMinimumCutAlgorithmEntry,
  kasaiAlgorithmLcpArrayEntry,
  kirchhoffMatrixTreeCountingEntry,
  kitamasaMethodEntry,
  knuthOptimizationEntry,
  kyberPostQuantumKeyExchangeEntry,
  lBfgsEntry,
  lamportClocksEntry,
  lasVegasAlgorithmEntry,
  ldpcDecodingBeliefPropagationEntry,
  leastCommonMultipleLcmEntry,
  lexicographicRankAlgorithmEntry,
  liChaoTreeEntry,
  lineSegmentIntersectionEntry,
  lineSweepForClosestPairEntry,
  linearHashingEntry,
  linearSieveEntry,
  linkCutTreeEntry,
  localSearchEntry,
  lockFreeQueueEntry,
  longestCommonSubstringSuffixArrayMethodEntry,
  longestPalindromicSubstringEntry,
  longestRepeatedSubstringEntry,
  louvainCommunityDetectionEntry,
  lsmTreeLogStructuredMergeTreeEntry,
  luDecompositionEntry,
  lucasTheoremEntry,
  lyndonFactorizationDuvalSAlgorithmEntry,
  lz77Entry,
  lz78Entry,
  lzwEntry,
  matrixExponentiationForLinearRecurrencesEntry,
  matrixInversionEntry,
  matrixRankEntry,
  maximumCliqueBronKerboschEntry,
  maximumIndependentSetOnTreeEntry,
  meetInTheMiddleEntry,
  mergeSortTreeEntry,
  mergeStonesEntry,
  merkleAntiEntropyRepairEntry,
  merkleTreeConstructionEntry,
  metropolisHastingsMcmcEntry,
  michaelScottQueueEntry,
  minCostFlowCycleCancelingEntry,
  minCostMaxFlowSuccessiveShortestPathsEntry,
  minimaxEntry,
  modularAdditionEntry,
  modularDivisionEntry,
  modularInverseEntry,
  modularMultiplicationEntry,
  monteCarloAlgorithmEntry,
  moveToFrontTransformEntry,
  multigridMethodsEntry,
  multipleKnapsackEntry,
  murmurhashEntry,
  mvccMultiVersionConcurrencyControlEntry,
  newtonRaphsonMethodEntry,
  newtonSMethodForOptimizationEntry,
  octreeEntry,
  oddEvenMergeSortEntry,
  operationalTransformationEntry,
  optimalBinarySearchTreeEntry,
  orderStatisticTreeEntry,
  orientationTestCcwTestEntry,
  pagerankEntry,
  palindromePartitioningEntry,
  palindromicTreeEertreeEntry,
  parallelBfsEntry,
  parallelBinarySearchEntry,
  parallelDfsEntry,
  parallelFftEntry,
  parallelMatrixMultiplicationEntry,
  parallelMergeSortEntry,
  parallelPrefixSumScanEntry,
  parallelQuicksortEntry,
  particleFilterEntry,
  particleSwarmOptimizationEntry,
  partitionEqualSubsetSumEntry,
  pascalSTriangleEntry,
  pathCompressionEntry,
  pbftPracticalByzantineFaultToleranceEntry,
  pcaEntry,
  persistentDsuRollbackDsuEntry,
  persistentQueueEntry,
  persistentSegmentTreeEntry,
  persistentStackEntry,
  pieceTableEntry,
  planarityTestingBoyerMyrvoldEntry,
  pointInConvexPolygonEntry,
  pointInPolygonRayCastingEntry,
  pointOnSegmentTestEntry,
  policyGradientReinforceEntry,
  poly1305Entry,
  polygonAreaShoelaceFormulaEntry,
  polygonTriangulationEntry,
  polynomialRollingHashEntry,
  primeFactorizationEntry,
  profileDpEntry,
  proximalPolicyOptimizationPpoEntry,
  qLearningDqnEntry,
  qrDecompositionEntry,
  quadTreeEntry,
  quantumFourierTransformEntry,
  quickhullEntry,
  rTreeEntry,
  rabinFingerprintEntry,
  randomizedIncrementalConvexHullEntry,
  randomizedKruskalEntry,
  randomizedPrimSAlgorithmEntry,
  randomizedQuicksortEntry,
  rangeTreeEntry,
  reedSolomonCodesEntry,
  regexBacktrackingAlgorithmEntry,
  regularExpressionMatchingDpEntry,
  removeBoxesEntry,
  reverseDeleteAlgorithmEntry,
  rotatingCalipersEntry,
  rsaEncryptionEntry,
  rsaKeyGenerationEntry,
  runLengthEncodingEntry,
  rungeKuttaRk4Entry,
  scaledDotProductAttentionEntry,
  schNhageStrassenMultiplicationEntry,
  schnorrSignaturesEntry,
  secantMethodEntry,
  segmentedSieveEntry,
  sequenceAlignmentNeedlemanWunschEntry,
  sha1Entry,
  sha2Entry,
  sha3Entry,
  shamirSecretSharingEntry,
  shorSAlgorithmEntry,
  shortestCommonSupersequenceEntry,
  simplexMethodEntry,
  simulatedAnnealingEntry,
  singularValueDecompositionEntry,
  siphashEntry,
  slopeTrickEntry,
  smallToLargeMergingDsuOnTreeEntry,
  smallestEnclosingCircleWelzlSAlgorithmEntry,
  snapshotIsolationEntry,
  solovayStrassenTestEntry,
  spaceOptimizedDpEntry,
  spfaShortestPathFasterAlgorithmEntry,
  stateCompressionDpEntry,
  stateMachineDpEntry,
  steinerTreeDpDreyfusWagnerEntry,
  stochasticGradientDescentSgdEntry,
  stoerWagnerMinimumCutEntry,
  stringInterleavingDpEntry,
  stronglyConnectedComponentsGabowEntry,
  suffixArraySaIsLinearAlgorithmEntry,
  sumOverSubsetsSosDpEntry,
  sundayAlgorithmEntry,
  swimMembershipProtocolEntry,
  tabuSearchEntry,
  tcpCongestionControlRenoCubicEntry,
  thompsonNfaConstructionEntry,
  threePhaseCommitEntry,
  tokenBucketRateLimitingEntry,
  toomCookMultiplicationEntry,
  transformerForwardBackwardPassEntry,
  treeDpEntry,
  treeIsomorphismAhuEntry,
  treeMatchingDpEntry,
  treiberStackEntry,
  trialDivisionEntry,
  tripleDesEntry,
  twoPhaseCommitEntry,
  twoPhaseLockingEntry,
  uniquePathsIiEntry,
  unrolledLinkedListEntry,
  variationalInferenceEntry,
  vectorClocksEntry,
  vertexCoverApproximationEntry,
  viterbiDecodingEntry,
  voronoiDiagramFortuneSAlgorithmEntry,
  vpTreeEntry,
  waitFreeQueueEntry,
  waveletTreeEntry,
  welshPowellEntry,
  wheelFactorizationEntry,
  wildcardPatternMatchingEntry,
  wuManberEntry,
  xTreeEntry,
  xorLinkedListEntry,
  xxhashEntry,
  yenSAlgorithmEntry,
];

const bySlug = new Map(ENTRIES.map((e) => [e.slug, e]));
const byCurriculum = new Map<number, AlgorithmEntry>();
for (const e of ENTRIES) for (const n of e.curriculum) byCurriculum.set(n, e);

export function getEntry(slug: string): AlgorithmEntry | undefined {
  return bySlug.get(slug);
}

/** The entry covering curriculum item `n`, following duplicates to the canonical item. */
export function entryForItem(n: number): AlgorithmEntry | undefined {
  return byCurriculum.get(DUPLICATES[n] ?? n);
}

export interface CatalogFilters {
  query?: string;
  domain?: DomainId | "";
  difficulty?: Difficulty | "";
  /** Keep entries whose worst case grows no faster than this class. */
  maxWorst?: ComplexityClass | "";
  visualOnly?: boolean;
}

const WORST_ORDER: ComplexityClass[] = [
  "1",
  "log n",
  "n",
  "n + m",
  "n log n",
  "n^2",
  "n^3",
  "2^n",
  "other",
];

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+*]+/g, " ")
    .trim();

/**
 * Score an entry against a free-text query. Every query term must match somewhere;
 * matches in the name or aliases weigh more than matches in tags or the summary.
 * Returns 0 for no match.
 */
export function scoreEntry(entry: AlgorithmEntry, query: string): number {
  const terms = normalise(query).split(" ").filter(Boolean);
  if (terms.length === 0) return 1;
  const fields: [string, number][] = [
    [normalise([entry.name, ...entry.aliases].join(" ")), 10],
    [normalise(entry.tags.join(" ")), 5],
    [normalise(`${entry.subcategory} ${entry.domain}`), 3],
    [normalise(`${entry.summary} ${entry.problem.input} ${entry.problem.output}`), 1],
  ];
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const [text, weight] of fields) {
      const words = text.split(" ");
      if (words.includes(term)) best = Math.max(best, weight * 2);
      else if (words.some((w) => w.startsWith(term))) best = Math.max(best, weight);
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

export function searchCatalog(filters: CatalogFilters): AlgorithmEntry[] {
  const maxIndex = filters.maxWorst ? WORST_ORDER.indexOf(filters.maxWorst) : Infinity;
  return ENTRIES.map((entry) => ({ entry, score: scoreEntry(entry, filters.query ?? "") }))
    .filter(({ entry, score }) => {
      if (score === 0) return false;
      if (filters.domain && entry.domain !== filters.domain) return false;
      if (filters.difficulty && entry.difficulty !== filters.difficulty) return false;
      if (filters.visualOnly && !entry.visualizer) return false;
      if (WORST_ORDER.indexOf(entry.complexity.worstClass) > maxIndex) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);
}

/** Curriculum items matching a query, for the roadmap view. */
export function searchCurriculum(query: string): CurriculumItem[] {
  const terms = normalise(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [...CURRICULUM_ITEMS];
  return CURRICULUM_ITEMS.filter((item) => {
    const text = normalise(
      `${item.name} ${item.note ?? ""} ${item.section} ${item.partTitle} ${item.number}`,
    );
    return terms.every((t) => text.split(" ").some((w) => w.startsWith(t)));
  });
}

export function curriculumStatus(item: CurriculumItem): "available" | "planned" {
  return entryForItem(item.number) ? "available" : "planned";
}
