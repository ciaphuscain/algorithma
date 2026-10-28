import type { DomainId } from "./domains";

/**
 * The 600-algorithm curriculum, as supplied by the project owner. It is a roadmap:
 * an item has interactive content only when a catalogue entry claims its number
 * (see catalog.ts). Nothing here is presented as a lesson on its own.
 *
 * Item text is "Name" or "Name|one-line note". Numbers are assigned in order and
 * verified by tests/unit/curriculum.test.ts.
 */
interface SectionSource {
  title: string;
  domain: DomainId;
  items: string[];
}

interface PartSource {
  id: string;
  title: string;
  sections: SectionSource[];
}

const PARTS: PartSource[] = [
  {
    id: "I",
    title: "Searching & Sorting",
    sections: [
      {
        title: "Searching",
        domain: "searching-sorting",
        items: [
          "Linear Search",
          "Sentinel Linear Search",
          "Binary Search",
          "Recursive Binary Search",
          "Ternary Search",
          "Interpolation Search",
          "Exponential Search",
          "Jump Search",
          "Fibonacci Search",
          "Uniform Binary Search",
        ],
      },
      {
        title: "Elementary Sorting",
        domain: "searching-sorting",
        items: [
          "Bubble Sort",
          "Optimized Bubble Sort",
          "Cocktail Shaker Sort",
          "Comb Sort",
          "Odd-Even Sort",
          "Gnome Sort",
          "Selection Sort",
          "Double Selection Sort",
          "Bingo Sort",
          "Cycle Sort",
        ],
      },
      {
        title: "Insertion-based Sorting",
        domain: "searching-sorting",
        items: [
          "Insertion Sort",
          "Binary Insertion Sort",
          "Shell Sort",
          "Library Sort",
          "Patience Sort",
        ],
      },
      {
        title: "Divide & Conquer Sorting",
        domain: "searching-sorting",
        items: [
          "Merge Sort",
          "Natural Merge Sort",
          "Bottom-Up Merge Sort",
          "Quick Sort",
          "Dual Pivot Quick Sort",
          "Three-way Quick Sort",
        ],
      },
      {
        title: "Heap-based Sorting",
        domain: "searching-sorting",
        items: ["Heap Sort", "Weak Heap Sort", "Smooth Sort", "Tournament Sort"],
      },
      {
        title: "Distribution Sorting",
        domain: "searching-sorting",
        items: [
          "Counting Sort",
          "Radix Sort (LSD)",
          "Radix Sort (MSD)",
          "Bucket Sort",
          "Flash Sort",
        ],
      },
      {
        title: "Specialized Sorting",
        domain: "searching-sorting",
        items: [
          "TimSort",
          "IntroSort",
          "Block Sort",
          "American Flag Sort",
          "Strand Sort",
          "Tree Sort",
          "Pancake Sort",
          "Bead Sort",
          "Sleep Sort|Educational only: relies on timer scheduling, not a practical sort.",
          "Bogo Sort|Educational only: unbounded expected running time is the point.",
        ],
      },
    ],
  },
  {
    id: "II",
    title: "Arrays, Prefix Sums & Hashing",
    sections: [
      {
        title: "Array Techniques",
        domain: "arrays-hashing",
        items: [
          "Prefix Sum",
          "Difference Array",
          "Kadane's Algorithm",
          "Sliding Window",
          "Two Pointers",
          "Dutch National Flag",
          "Boyer-Moore Majority Vote",
          "Reservoir Sampling",
          "Fisher-Yates Shuffle",
          "Cycle Detection (Floyd)",
        ],
      },
      {
        title: "Range Query Structures",
        domain: "arrays-hashing",
        items: [
          "Binary Indexed Tree",
          "Segment Tree",
          "Lazy Segment Tree",
          "Sparse Table",
          "Sqrt Decomposition",
          "Mo's Algorithm",
        ],
      },
      {
        title: "Hash Tables",
        domain: "arrays-hashing",
        items: [
          "Hash Table Chaining",
          "Open Addressing",
          "Double Hashing",
          "Robin Hood Hashing",
          "Cuckoo Hashing",
          "Perfect Hashing",
          "Universal Hashing",
        ],
      },
      {
        title: "Probabilistic Data Structures",
        domain: "arrays-hashing",
        items: [
          "Bloom Filter",
          "Counting Bloom Filter",
          "Quotient Filter",
          "Cuckoo Filter",
          "Count-Min Sketch",
          "HyperLogLog",
          "MinHash",
        ],
      },
      {
        title: "Hash Functions",
        domain: "arrays-hashing",
        items: [
          "Rolling Hash",
          "Polynomial Hash",
          "Zobrist Hash",
          "Consistent Hashing",
          "Rendezvous Hashing",
          "CRC32",
          "MurmurHash",
          "xxHash",
          "CityHash",
          "SipHash",
        ],
      },
      {
        title: "Further Array Techniques",
        domain: "arrays-hashing",
        items: [
          "Prefix XOR",
          "Difference Constraints",
          "Sweep Line (arrays)",
          "Offline Query Processing",
          "Coordinate Compression",
          "Binary Lifting on Arrays",
          "Cartesian Tree Construction",
          "Sliding Window Maximum",
          "Monotonic Queue",
          "Monotonic Stack",
        ],
      },
    ],
  },
  {
    id: "III",
    title: "Linked Lists, Stacks & Queues",
    sections: [
      {
        title: "Linked Lists",
        domain: "linear-structures",
        items: [
          "Reverse Linked List",
          "Reverse in K Groups",
          "Detect Cycle",
          "Find Cycle Start",
          "Merge Two Lists",
          "Merge K Lists",
          "Palindrome Linked List",
          "Rotate List",
          "Remove Nth Node",
          "Copy Random Pointer",
        ],
      },
      {
        title: "Stacks & Queues",
        domain: "linear-structures",
        items: [
          "Stack Using Queues",
          "Queue Using Stacks",
          "Min Stack",
          "Max Stack",
          "Monotonic Stack",
          "Balanced Parentheses",
          "Infix to Postfix",
          "Postfix Evaluation",
          "Prefix Evaluation",
          "Expression Tree",
          "Shunting Yard Algorithm",
          "Tower of Hanoi",
          "Circular Queue",
          "Deque",
          "Priority Queue",
        ],
      },
      {
        title: "Heaps",
        domain: "linear-structures",
        items: [
          "Binary Heap",
          "Binomial Heap",
          "Fibonacci Heap",
          "Pairing Heap",
          "Leftist Heap",
          "Skew Heap",
          "Soft Heap",
          "Calendar Queue",
        ],
      },
      {
        title: "Concurrent Structures",
        domain: "linear-structures",
        items: ["Lock-Free Queue", "Michael-Scott Queue", "Treiber Stack", "Wait-Free Queue"],
      },
      {
        title: "Persistent & Text Structures",
        domain: "linear-structures",
        items: [
          "Persistent Stack",
          "Persistent Queue",
          "Rope",
          "Gap Buffer",
          "Piece Table",
          "Unrolled Linked List",
          "XOR Linked List",
        ],
      },
      {
        title: "Lists, Buffers & Caches",
        domain: "linear-structures",
        items: [
          "Skip List",
          "Concurrent Skip List",
          "Circular Buffer",
          "Ring Buffer",
          "Cache Replacement (LRU)",
          "LFU Cache",
        ],
      },
    ],
  },
  {
    id: "IV",
    title: "Trees",
    sections: [
      {
        title: "Binary Trees & BSTs",
        domain: "trees",
        items: [
          "Binary Tree Traversal",
          "Morris Traversal",
          "BST Search",
          "BST Insert",
          "BST Delete",
        ],
      },
      {
        title: "Balanced Search Trees",
        domain: "trees",
        items: [
          "AVL Tree",
          "Red-Black Tree",
          "Splay Tree",
          "Treap",
          "Scapegoat Tree",
          "AA Tree",
          "B Tree",
          "B+ Tree",
          "B* Tree",
        ],
      },
      {
        title: "Tries",
        domain: "trees",
        items: [
          "Trie",
          "Compressed Trie",
          "Patricia Trie",
          "Radix Tree",
          "Ternary Search Tree",
          "Suffix Trie",
        ],
      },
      {
        title: "Special-purpose Trees",
        domain: "trees",
        items: [
          "Huffman Tree",
          "Expression Tree",
          "Fenwick Tree",
          "Segment Tree",
          "Interval Tree",
          "Order Statistic Tree",
        ],
      },
      {
        title: "Spatial & Metric Trees",
        domain: "trees",
        items: [
          "KD Tree",
          "Quad Tree",
          "Octree",
          "R Tree",
          "R* Tree",
          "X Tree",
          "VP Tree",
          "Ball Tree",
          "Cover Tree",
        ],
      },
      {
        title: "Tree Techniques",
        domain: "trees",
        items: [
          "Cartesian Tree",
          "Binary Lifting",
          "Lowest Common Ancestor",
          "Euler Tour",
          "Heavy-Light Decomposition",
          "Centroid Decomposition",
          "Link-Cut Tree",
          "Euler Tour Tree",
          "Persistent Segment Tree",
          "Wavelet Tree",
          "Merge Sort Tree",
          "Li Chao Tree",
          "Suffix Tree",
          "Dynamic Tree",
          "Tree DP",
        ],
      },
    ],
  },
  {
    id: "V",
    title: "Graph Algorithms",
    sections: [
      {
        title: "Graph Traversal",
        domain: "graphs",
        items: [
          "Breadth-First Search (BFS)|Finds shortest paths in unweighted graphs.",
          "Depth-First Search (DFS)|Foundation for many graph algorithms.",
          "Iterative DFS|DFS using an explicit stack.",
          "Recursive DFS|Standard recursive implementation.",
          "Bidirectional BFS|Searches from both ends simultaneously.",
          "Iterative Deepening DFS (IDDFS)|Combines DFS memory usage with BFS completeness.",
        ],
      },
      {
        title: "Shortest Paths",
        domain: "graphs",
        items: [
          "Dijkstra's Algorithm|Shortest paths with non-negative weights.",
          "Bellman-Ford Algorithm|Handles negative edge weights.",
          "Floyd-Warshall Algorithm|All-pairs shortest paths.",
          "Johnson's Algorithm|All-pairs shortest paths on sparse graphs.",
          "A* Search|Heuristic shortest path.",
          "Bidirectional Dijkstra|Faster point-to-point shortest path.",
          "Yen's Algorithm|K shortest simple paths.",
          "K Shortest Paths|General algorithms for multiple shortest paths.",
          "Dial's Algorithm|Dijkstra optimisation for small integer weights.",
        ],
      },
      {
        title: "Minimum Spanning Trees",
        domain: "graphs",
        items: [
          "Kruskal's Algorithm",
          "Prim's Algorithm",
          "Borůvka's Algorithm",
          "Reverse Delete Algorithm",
          "Sollin's Algorithm",
        ],
      },
      {
        title: "Connectivity",
        domain: "graphs",
        items: [
          "Union-Find (Disjoint Set Union)",
          "Union by Rank",
          "Path Compression",
          "Connected Components",
          "Strongly Connected Components (Kosaraju)",
          "Strongly Connected Components (Tarjan)",
          "Strongly Connected Components (Gabow)",
        ],
      },
      {
        title: "Topological Ordering",
        domain: "graphs",
        items: ["Topological Sort (DFS)", "Kahn's Algorithm"],
      },
      {
        title: "Cycle Detection",
        domain: "graphs",
        items: [
          "Cycle Detection (Undirected)",
          "Cycle Detection (Directed)",
          "Floyd's Cycle Finding",
        ],
      },
      {
        title: "Network Flow",
        domain: "graphs",
        items: ["Ford-Fulkerson", "Edmonds-Karp", "Dinic's Algorithm", "Push-Relabel"],
      },
      {
        title: "Matchings",
        domain: "graphs",
        items: ["Hopcroft-Karp", "Hungarian Algorithm", "Blossom Algorithm"],
      },
      { title: "Graph Coloring", domain: "graphs", items: ["Welsh-Powell", "DSATUR"] },
      {
        title: "Euler & Hamiltonian Paths",
        domain: "graphs",
        items: ["Hierholzer's Algorithm", "Fleury's Algorithm", "Hamiltonian Backtracking"],
      },
      {
        title: "Advanced Graph Algorithms",
        domain: "graphs",
        items: [
          "Tarjan's Bridge Algorithm",
          "Tarjan's Articulation Point Algorithm",
          "Lowest Common Ancestor (Binary Lifting on Trees)",
          "Centroid Decomposition",
          "Heavy-Light Decomposition",
          "SPFA (Shortest Path Faster Algorithm)",
        ],
      },
    ],
  },
  {
    id: "VI",
    title: "Dynamic Programming",
    sections: [
      {
        title: "DP Fundamentals",
        domain: "dynamic-programming",
        items: [
          "Memoization (Top-Down DP)|Recursive solution with caching.",
          "Tabulation (Bottom-Up DP)|Iterative approach building solutions from the smallest subproblems.",
          "Space-Optimized DP|Reduces memory, e.g. from O(n²) to O(n) or O(1), where possible.",
          "State Compression DP|Compresses DP state using bitmasks or other encodings.",
          "State Machine DP|Models problems as transitions between states (e.g. stock trading).",
        ],
      },
      {
        title: "Beginner DP Problems",
        domain: "dynamic-programming",
        items: [
          "Fibonacci DP",
          "Climbing Stairs",
          "Min Cost Climbing Stairs",
          "House Robber",
          "House Robber II",
        ],
      },
      {
        title: "Knapsack Family",
        domain: "dynamic-programming",
        items: [
          "0/1 Knapsack",
          "Unbounded Knapsack",
          "Fractional Knapsack (Greedy + DP comparison)",
          "Multiple Knapsack",
          "Group Knapsack",
        ],
      },
      {
        title: "Coin Problems",
        domain: "dynamic-programming",
        items: [
          "Coin Change (Minimum Coins)",
          "Coin Change II (Number of Ways)",
          "Integer Partition DP",
        ],
      },
      {
        title: "Sequence DP",
        domain: "dynamic-programming",
        items: [
          "Longest Increasing Subsequence (O(n²))",
          "Longest Increasing Subsequence (Patience Sorting, O(n log n))",
          "Longest Common Subsequence (LCS)",
          "Longest Common Substring",
          "Longest Palindromic Subsequence",
          "Longest Palindromic Substring",
          "Shortest Common Supersequence",
        ],
      },
      {
        title: "Edit Distance Family",
        domain: "dynamic-programming",
        items: [
          "Edit Distance (Levenshtein Distance)",
          "Damerau–Levenshtein Distance",
          "Sequence Alignment (Needleman–Wunsch)",
        ],
      },
      {
        title: "Matrix DP",
        domain: "dynamic-programming",
        items: [
          "Matrix Chain Multiplication",
          "Minimum Path Sum",
          "Unique Paths",
          "Unique Paths II",
          "Triangle Minimum Path Sum",
        ],
      },
      {
        title: "Grid DP",
        domain: "dynamic-programming",
        items: ["Maximal Square", "Cherry Pickup", "Dungeon Game"],
      },
      {
        title: "Partition DP",
        domain: "dynamic-programming",
        items: ["Partition Equal Subset Sum", "Palindrome Partitioning", "Burst Balloons"],
      },
      {
        title: "Interval DP",
        domain: "dynamic-programming",
        items: ["Optimal Binary Search Tree", "Merge Stones", "Remove Boxes"],
      },
      {
        title: "Tree DP",
        domain: "dynamic-programming",
        items: ["Diameter of Tree", "Maximum Independent Set on Tree", "Tree Matching DP"],
      },
      {
        title: "Bitmask DP",
        domain: "dynamic-programming",
        items: [
          "Traveling Salesman Problem (Held–Karp Algorithm)",
          "Assignment Problem (Bitmask DP)",
        ],
      },
      {
        title: "Advanced DP",
        domain: "dynamic-programming",
        items: [
          "Digit DP|Counts or optimises over numbers by processing digits under constraints.",
          "Profile DP|Uses bitmasks to represent row/column states; common in tiling problems.",
          "Convex Hull Trick DP Optimization|Speeds up certain DP recurrences from O(n²) to O(n log n) or O(n).",
        ],
      },
    ],
  },
  {
    id: "VII",
    title: "String Algorithms",
    sections: [
      {
        title: "Basic Pattern Matching",
        domain: "strings",
        items: [
          "Naive String Matching|Compare the pattern at every position.",
          "Knuth–Morris–Pratt (KMP)|Linear-time matching using the prefix-function (LPS) array.",
          "Rabin–Karp|Rolling-hash-based matching.",
          "Boyer–Moore|Skips comparisons using bad-character and good-suffix rules.",
          "Boyer–Moore–Horspool|Simplified Boyer–Moore.",
          "Sunday Algorithm|Shifts using the character just after the current window.",
        ],
      },
      {
        title: "Prefix & Border Algorithms",
        domain: "strings",
        items: [
          "Z Algorithm|Length of the longest substring starting at each position that matches a prefix.",
          "Prefix Function (π Function)|Used in KMP preprocessing.",
          "Failure Function|Alternative formulation of KMP preprocessing.",
          "Border Array|Longest proper prefix that is also a suffix.",
        ],
      },
      {
        title: "Rolling Hashing",
        domain: "strings",
        items: ["Polynomial Rolling Hash", "Double Hashing", "Rabin Fingerprint"],
      },
      {
        title: "Suffix Structures",
        domain: "strings",
        items: [
          "Suffix Array (Doubling Algorithm)",
          "Suffix Array (SA-IS Linear Algorithm)",
          "Kasai Algorithm (LCP Array)",
          "Suffix Tree (Ukkonen's Algorithm)",
          "Suffix Automaton",
          "Directed Acyclic Word Graph (DAWG)",
        ],
      },
      {
        title: "Trie-Based Algorithms",
        domain: "strings",
        items: [
          "Trie Construction",
          "Compressed Trie",
          "Patricia Trie",
          "Radix Trie",
          "Ternary Search Tree",
        ],
      },
      {
        title: "Multi-Pattern Matching",
        domain: "strings",
        items: ["Aho–Corasick", "Wu–Manber", "Commentz–Walter"],
      },
      {
        title: "Palindrome Algorithms",
        domain: "strings",
        items: ["Manacher's Algorithm", "Palindromic Tree (Eertree)"],
      },
      {
        title: "Edit & Similarity",
        domain: "strings",
        items: [
          "Levenshtein Distance",
          "Damerau–Levenshtein Distance",
          "Hamming Distance",
          "Jaro Similarity",
          "Jaro–Winkler Distance",
        ],
      },
      {
        title: "Compression-Related",
        domain: "compression",
        items: [
          "Burrows–Wheeler Transform (BWT)",
          "Move-to-Front Transform",
          "Run-Length Encoding",
        ],
      },
      {
        title: "Parsing & Matching",
        domain: "compilers",
        items: ["Thompson NFA Construction", "DFA Construction", "Regex Backtracking Algorithm"],
      },
      {
        title: "Advanced String Algorithms",
        domain: "strings",
        items: [
          "Booth's Algorithm (Lexicographically Minimum Rotation)",
          "Lyndon Factorization (Duval's Algorithm)",
          "Longest Repeated Substring",
          "Longest Common Substring (Suffix Array Method)",
          "Longest Palindromic Substring (Manacher)",
          "Lexicographic Rank Algorithm",
          "String Interleaving DP",
          "Wildcard Pattern Matching",
          "Regular Expression Matching (DP)",
          "FM-Index (Full-Text Search)",
        ],
      },
    ],
  },
  {
    id: "VIII",
    title: "Number Theory & Mathematics",
    sections: [
      {
        title: "Basic Number Theory",
        domain: "number-theory",
        items: [
          "Euclidean Algorithm (GCD)",
          "Extended Euclidean Algorithm",
          "Binary GCD (Stein's Algorithm)",
          "Least Common Multiple (LCM)",
          "Modular Addition",
          "Modular Multiplication",
          "Modular Division",
          "Fast Modular Exponentiation",
          "Binary Exponentiation",
          "Matrix Exponentiation",
        ],
      },
      {
        title: "Prime Algorithms",
        domain: "number-theory",
        items: [
          "Trial Division",
          "Sieve of Eratosthenes",
          "Linear Sieve",
          "Segmented Sieve",
          "Wheel Factorization",
        ],
      },
      {
        title: "Factorization",
        domain: "number-theory",
        items: [
          "Prime Factorization",
          "Pollard's Rho",
          "Fermat Factorization",
          "Dixon's Factorization",
        ],
      },
      {
        title: "Primality Testing",
        domain: "number-theory",
        items: [
          "Fermat Primality Test",
          "Miller–Rabin Primality Test",
          "Solovay–Strassen Test",
          "AKS Primality Test",
        ],
      },
      {
        title: "Modular Arithmetic",
        domain: "number-theory",
        items: [
          "Euler's Totient Function",
          "Euler's Theorem",
          "Chinese Remainder Theorem",
          "Modular Inverse",
          "Lucas Theorem",
        ],
      },
      {
        title: "Combinatorics",
        domain: "number-theory",
        items: [
          "Pascal's Triangle",
          "Binomial Coefficient DP",
          "Catalan Numbers",
          "Inclusion–Exclusion Principle",
          "Derangements",
        ],
      },
      {
        title: "Numerical Algorithms",
        domain: "number-theory",
        items: [
          "Newton–Raphson Method",
          "Bisection Method",
          "Secant Method",
          "Gaussian Elimination",
          "LU Decomposition",
          "Cholesky Decomposition",
          "QR Decomposition",
        ],
      },
      {
        title: "FFT & Polynomial Algorithms",
        domain: "number-theory",
        items: [
          "Fast Fourier Transform (FFT)",
          "Inverse FFT",
          "Number Theoretic Transform (NTT)",
          "Karatsuba Multiplication",
          "Toom–Cook Multiplication",
          "Schönhage–Strassen Multiplication",
        ],
      },
      {
        title: "Linear Algebra",
        domain: "number-theory",
        items: [
          "Matrix Inversion",
          "Determinant Computation",
          "Matrix Rank",
          "Gram–Schmidt Orthogonalization",
        ],
      },
    ],
  },
  {
    id: "IX",
    title: "Computational Geometry",
    sections: [
      {
        title: "Basic Geometry",
        domain: "geometry",
        items: [
          "Orientation Test (CCW Test)|Whether three points make a clockwise, counter-clockwise or collinear turn.",
          "Line Segment Intersection|Tests whether two line segments intersect.",
          "Point on Segment Test",
          "Distance Between Two Points",
          "Distance from Point to Line",
        ],
      },
      {
        title: "Convex Hull",
        domain: "geometry",
        items: [
          "Graham Scan",
          "Jarvis March (Gift Wrapping)",
          "Andrew's Monotone Chain",
          "QuickHull",
        ],
      },
      {
        title: "Closest Pair Problems",
        domain: "geometry",
        items: ["Closest Pair of Points (Divide & Conquer)"],
      },
      {
        title: "Polygon Algorithms",
        domain: "geometry",
        items: [
          "Point in Polygon (Ray Casting)",
          "Point in Convex Polygon",
          "Polygon Area (Shoelace Formula)",
          "Polygon Triangulation",
          "Convex Polygon Intersection",
        ],
      },
      {
        title: "Sweep Line Algorithms",
        domain: "geometry",
        items: ["Bentley–Ottmann Algorithm", "Line Sweep for Closest Pair"],
      },
      {
        title: "Spatial Data Structures",
        domain: "geometry",
        items: [
          "KD-Tree Search",
          "Range Tree",
          "Interval Tree Search",
          "Voronoi Diagram (Fortune's Algorithm)",
          "Delaunay Triangulation",
        ],
      },
      {
        title: "Miscellaneous Geometry",
        domain: "geometry",
        items: [
          "Rotating Calipers",
          "Smallest Enclosing Circle (Welzl's Algorithm)",
          "Half-Plane Intersection",
        ],
      },
    ],
  },
  {
    id: "X",
    title: "Randomized Algorithms",
    sections: [
      {
        title: "Randomized Algorithms",
        domain: "randomized",
        items: [
          "Randomized QuickSort",
          "Randomized QuickSelect",
          "Reservoir Sampling",
          "Fisher–Yates Shuffle",
          "Monte Carlo Algorithm",
          "Las Vegas Algorithm",
          "Randomized Binary Search Tree (Treap)",
          "Skip List Randomization",
          "Randomized Incremental Convex Hull",
          "Karger's Minimum Cut Algorithm",
          "Randomized Prim's Algorithm",
          "Randomized Kruskal",
          "Simulated Annealing",
          "Genetic Algorithm",
          "Particle Swarm Optimization",
        ],
      },
    ],
  },
  {
    id: "XI",
    title: "Approximation & Optimization",
    sections: [
      {
        title: "Approximation & Local Search",
        domain: "optimization",
        items: [
          "Greedy Set Cover Approximation",
          "Vertex Cover Approximation",
          "Christofides Algorithm (Approximate TSP)",
          "Branch and Bound",
          "Branch and Cut",
          "Local Search",
          "Hill Climbing",
          "Tabu Search",
          "Ant Colony Optimization",
          "Beam Search",
          "Iterative Deepening A*",
        ],
      },
      {
        title: "Game-Tree Search",
        domain: "ai-search",
        items: ["Minimax", "Alpha–Beta Pruning", "Expectimax", "Monte Carlo Tree Search (MCTS)"],
      },
    ],
  },
  {
    id: "XII",
    title: "Parallel & Distributed Algorithms",
    sections: [
      {
        title: "Parallel Algorithms",
        domain: "parallel",
        items: [
          "Parallel Prefix Sum (Scan)",
          "Parallel Merge Sort",
          "Parallel QuickSort",
          "Bitonic Sort",
          "Odd–Even Merge Sort",
          "MapReduce",
          "Parallel BFS",
          "Parallel DFS",
          "Parallel Matrix Multiplication",
          "Parallel FFT",
        ],
      },
      {
        title: "Distributed Systems",
        domain: "distributed",
        items: [
          "Paxos Consensus",
          "Raft Consensus",
          "Gossip Protocol",
          "Chandy–Lamport Snapshot Algorithm",
          "Bully Leader Election Algorithm",
        ],
      },
    ],
  },
  {
    id: "XIII",
    title: "Cryptography & Security",
    sections: [
      {
        title: "Cryptography & Security",
        domain: "cryptography",
        items: [
          "RSA Key Generation",
          "RSA Encryption",
          "Diffie–Hellman Key Exchange",
          "Elliptic Curve Diffie–Hellman (ECDH)",
          "Elliptic Curve Digital Signature Algorithm (ECDSA)",
          "AES Encryption",
          "DES",
          "Triple DES",
          "ChaCha20",
          "Poly1305",
          "SHA-1",
          "SHA-2",
          "SHA-3",
          "HMAC",
          "Merkle Tree Construction",
        ],
      },
    ],
  },
  {
    id: "XIV",
    title: "External Memory & Databases",
    sections: [
      {
        title: "External Memory & Databases",
        domain: "databases",
        items: [
          "External Merge Sort",
          "B-Tree Insertion",
          "B+ Tree Search",
          "LSM Tree (Log-Structured Merge Tree)",
          "Buffer Replacement (LRU)",
          "Buffer Replacement (Clock Algorithm)",
          "Extendible Hashing",
          "Linear Hashing",
          "Bloom Join",
          "Grace Hash Join",
        ],
      },
    ],
  },
  {
    id: "XV",
    title: "Machine Learning & AI",
    sections: [
      {
        title: "Machine Learning & AI",
        domain: "machine-learning",
        items: [
          "Gradient Descent",
          "Stochastic Gradient Descent (SGD)",
          "Backpropagation",
          "K-Means Clustering",
          "Decision Tree Learning (ID3/C4.5/CART)",
        ],
      },
    ],
  },
  {
    id: "XVI",
    title: "Advanced Graphs & Flows",
    sections: [
      {
        title: "Advanced Flows & Cuts",
        domain: "graphs",
        items: [
          "Min-Cost Max-Flow (Successive Shortest Paths)",
          "Min-Cost Flow (Cycle Canceling)",
          "Gomory–Hu Tree",
          "Stoer–Wagner Minimum Cut",
          "Edmonds' Arborescence (Chu–Liu/Edmonds)",
          "Dominator Tree (Lengauer–Tarjan)",
          "2-SAT via SCC",
          "Bipartite Matching via Flow",
          "Kőnig's Theorem Construction",
          "General Weighted Matching",
        ],
      },
      {
        title: "Structural & Network Analysis",
        domain: "graphs",
        items: [
          "Johnson's Elementary Cycles",
          "Kirchhoff Matrix-Tree Counting",
          "Planarity Testing (Boyer–Myrvold)",
          "Maximum Clique (Bron–Kerbosch)",
          "Chromatic Polynomial / Exact Coloring",
          "Steiner Tree DP (Dreyfus–Wagner)",
          "Tree Isomorphism (AHU)",
          "Dynamic Connectivity (Offline, Divide & Conquer)",
          "PageRank",
          "Louvain Community Detection",
        ],
      },
    ],
  },
  {
    id: "XVII",
    title: "DP Optimizations & Advanced Techniques",
    sections: [
      {
        title: "DP Optimizations",
        domain: "dynamic-programming",
        items: [
          "Knuth Optimization",
          "Divide-and-Conquer DP Optimization",
          "Aliens Trick (Lagrangian Relaxation / WQS Binary Search)",
          "Sum over Subsets (SOS) DP",
          "Slope Trick",
          "Broken Profile DP",
          "DP on Broken Lines / Connectivity DP",
        ],
      },
      {
        title: "Linear Recurrences",
        domain: "number-theory",
        items: [
          "Matrix Exponentiation for Linear Recurrences",
          "Berlekamp–Massey",
          "Kitamasa Method",
        ],
      },
      {
        title: "Advanced Problem-Solving Techniques",
        domain: "research",
        items: [
          "Meet in the Middle",
          "Parallel Binary Search",
          "CDQ Divide and Conquer",
          "Small-to-Large Merging (DSU on Tree)",
          "Persistent DSU / Rollback DSU",
        ],
      },
    ],
  },
  {
    id: "XVIII",
    title: "Compression & Coding",
    sections: [
      {
        title: "Lossless Compression",
        domain: "compression",
        items: [
          "LZ77",
          "LZ78",
          "LZW",
          "DEFLATE",
          "Arithmetic Coding",
          "Asymmetric Numeral Systems (ANS)",
        ],
      },
      {
        title: "Error-Correcting Codes",
        domain: "compression",
        items: [
          "Reed–Solomon Codes",
          "Hamming Codes",
          "LDPC Decoding (Belief Propagation)",
          "Viterbi Decoding",
        ],
      },
    ],
  },
  {
    id: "XIX",
    title: "Distributed Systems & Databases",
    sections: [
      {
        title: "Distributed Coordination",
        domain: "distributed",
        items: [
          "Lamport Clocks",
          "Vector Clocks",
          "Two-Phase Commit",
          "Three-Phase Commit",
          "PBFT (Practical Byzantine Fault Tolerance)",
          "Chord DHT",
          "Kademlia DHT",
          "CRDTs (G-Counter, OR-Set, RGA)",
          "Operational Transformation",
        ],
      },
      {
        title: "Transactions & Recovery",
        domain: "databases",
        items: [
          "MVCC (Multi-Version Concurrency Control)",
          "Two-Phase Locking",
          "ARIES Recovery",
          "Snapshot Isolation",
        ],
      },
      {
        title: "Membership & Replication",
        domain: "distributed",
        items: ["Hybrid Logical Clocks", "Merkle Anti-Entropy Repair", "SWIM Membership Protocol"],
      },
      {
        title: "Congestion & Rate Control",
        domain: "networks",
        items: [
          "TCP Congestion Control (Reno/CUBIC)",
          "BBR Congestion Control",
          "Token Bucket Rate Limiting",
        ],
      },
      {
        title: "Query Optimization",
        domain: "databases",
        items: ["Cost-Based Query Optimization (Selinger)"],
      },
    ],
  },
  {
    id: "XX",
    title: "Machine Learning & Probabilistic Inference",
    sections: [
      {
        title: "Deep Learning Building Blocks",
        domain: "deep-learning",
        items: [
          "Adam Optimizer",
          "Scaled Dot-Product Attention",
          "Transformer Forward/Backward Pass",
          "FlashAttention",
        ],
      },
      {
        title: "Matrix Factorisation",
        domain: "machine-learning",
        items: ["PCA", "Singular Value Decomposition"],
      },
      {
        title: "Probabilistic Inference",
        domain: "machine-learning",
        items: [
          "Expectation–Maximization",
          "Gaussian Mixture Models",
          "Hidden Markov Models (Forward–Backward)",
          "Kalman Filter",
          "Particle Filter",
          "Belief Propagation",
          "Metropolis–Hastings MCMC",
          "Gibbs Sampling",
          "Hamiltonian Monte Carlo",
          "Variational Inference",
        ],
      },
      {
        title: "Reinforcement Learning",
        domain: "machine-learning",
        items: [
          "Policy Gradient (REINFORCE)",
          "Proximal Policy Optimization (PPO)",
          "Q-Learning / DQN",
        ],
      },
      {
        title: "Generative Models",
        domain: "deep-learning",
        items: ["Diffusion Model Sampling (DDPM)"],
      },
    ],
  },
  {
    id: "XXI",
    title: "Numerical, Optimization & Quantum",
    sections: [
      {
        title: "Linear Programming",
        domain: "optimization",
        items: ["Simplex Method", "Interior-Point Methods"],
      },
      {
        title: "Numerical Methods",
        domain: "number-theory",
        items: [
          "Conjugate Gradient",
          "Runge–Kutta (RK4)",
          "Multigrid Methods",
          "Finite Element Method (1D/2D)",
        ],
      },
      {
        title: "Nonlinear Optimization",
        domain: "optimization",
        items: ["L-BFGS", "Newton's Method for Optimization"],
      },
      {
        title: "Modern Cryptography",
        domain: "cryptography",
        items: [
          "Shamir Secret Sharing",
          "Schnorr Signatures",
          "Ed25519",
          "Kyber (Post-Quantum Key Exchange)",
        ],
      },
      {
        title: "Quantum Algorithms",
        domain: "research",
        items: ["Quantum Fourier Transform", "Grover's Search", "Shor's Algorithm"],
      },
    ],
  },
];

/** Recognisable DP patterns from the curriculum, with their example problem numbers. */
export const DP_PATTERNS: { pattern: string; examples: number[] }[] = [
  { pattern: "Linear DP", examples: [256, 259] },
  { pattern: "Knapsack DP", examples: [261, 262, 264] },
  { pattern: "Grid DP", examples: [281, 280] },
  { pattern: "Sequence DP", examples: [269, 271, 276] },
  { pattern: "Interval DP", examples: [289, 279] },
  { pattern: "Tree DP", examples: [293, 294] },
  { pattern: "Bitmask DP", examples: [296, 297] },
  { pattern: "Digit DP", examples: [298] },
  { pattern: "State Machine DP", examples: [255] },
  { pattern: "DP with Optimization", examples: [300, 522] },
];

/**
 * The curriculum's "proof of mastery" goals. These are personal learning goals, not
 * algorithms, so they are listed on the learning-path page rather than in the catalogue.
 */
export const MASTERY_GOALS: string[] = [
  "Implement all 600 from scratch, with tests",
  "Write a one-page explanation for each",
  "Benchmark every sorting, hashing and data-structure implementation",
  "Solve 5 contest problems that use each of the top 100",
  "Publish the full implementation library as open source",
  "Teach the top 100 in a recorded course",
];

/**
 * Items listed twice in the curriculum, mapped to their canonical number. They share
 * one entry instead of being written twice.
 */
export const DUPLICATES: Readonly<Record<number, number>> = {
  115: 100, // Monotonic Stack
  148: 147, // Ring Buffer = Circular Buffer
  172: 120, // Expression Tree
  173: 61, // Fenwick Tree = Binary Indexed Tree
  174: 62, // Segment Tree
  186: 97, // Cartesian Tree
  220: 218, // Sollin's algorithm is another name for Borůvka's algorithm
  232: 60, // Floyd's cycle finding
  247: 188, // Lowest Common Ancestor
  248: 191, // Centroid Decomposition
  249: 190, // Heavy-Light Decomposition
  317: 198, // Suffix tree (Ukkonen's construction)
  320: 165, // Trie
  321: 166, // Compressed Trie
  322: 167, // Patricia Trie
  323: 168, // Radix Trie = Radix Tree
  324: 169, // Ternary Search Tree
  330: 276, // Levenshtein distance = edit distance
  331: 277, // Damerau–Levenshtein distance
  345: 328, // Longest palindromic substring via Manacher
  418: 177, // KD tree
  420: 175, // Interval tree
  428: 58, // Reservoir sampling
  429: 59, // Fisher–Yates shuffle
  432: 159, // Treap
  433: 145, // Skip list
  487: 162, // B-tree
  488: 163, // B+ tree
  490: 149, // LRU
};

/**
 * Priority tiers from the curriculum's "100 most important algorithms" lists:
 * 1 = absolutely essential, 2 = very important, 3 = advanced / specialised.
 */
export const TIERS: Readonly<Record<number, 1 | 2 | 3>> = {
  // Tier 1
  3: 1,
  26: 1,
  29: 1,
  32: 1,
  201: 1,
  202: 1,
  207: 1,
  221: 1,
  216: 1,
  217: 1,
  228: 1,
  229: 1,
  251: 1,
  252: 1,
  261: 1,
  269: 1,
  270: 1,
  271: 1,
  276: 1,
  302: 1,
  165: 1,
  62: 1,
  61: 1,
  // Tier 2
  208: 2,
  209: 2,
  211: 2,
  226: 2,
  225: 2,
  245: 2,
  246: 2,
  190: 2,
  187: 2,
  314: 2,
  198: 2,
  318: 2,
  325: 2,
  328: 2,
  54: 2,
  55: 2,
  100: 2,
  99: 2,
  51: 2,
  64: 2,
  360: 2,
  // Tier 3
  391: 3,
  393: 3,
  300: 3,
  298: 3,
  296: 3,
  297: 3,
  235: 3,
  237: 3,
  236: 3,
  371: 3,
  367: 3,
  376: 3,
  406: 3,
  410: 3,
  177: 3,
  427: 3,
  455: 3,
  467: 3,
  466: 3,
  461: 3,
  496: 3,
};

/** The curriculum's recommended learning order, with the sections each step covers. */
export const LEARNING_ORDER: { step: string; sections: string[] }[] = [
  { step: "Time Complexity & Big-O", sections: [] },
  { step: "Searching", sections: ["Searching"] },
  {
    step: "Sorting",
    sections: [
      "Elementary Sorting",
      "Insertion-based Sorting",
      "Heap-based Sorting",
      "Distribution Sorting",
      "Specialized Sorting",
    ],
  },
  { step: "Recursion & Divide-and-Conquer", sections: ["Divide & Conquer Sorting"] },
  { step: "Hashing", sections: ["Hash Tables", "Hash Functions"] },
  { step: "Linked Lists", sections: ["Linked Lists"] },
  { step: "Stacks & Queues", sections: ["Stacks & Queues"] },
  {
    step: "Trees & Binary Search Trees",
    sections: ["Binary Trees & BSTs", "Balanced Search Trees"],
  },
  { step: "Heaps & Priority Queues", sections: ["Heaps"] },
  { step: "Graph Traversal (BFS/DFS)", sections: ["Graph Traversal"] },
  { step: "Shortest Path Algorithms", sections: ["Shortest Paths"] },
  { step: "Minimum Spanning Trees", sections: ["Minimum Spanning Trees"] },
  { step: "Union-Find", sections: ["Connectivity"] },
  { step: "Greedy Algorithms", sections: ["Approximation & Local Search"] },
  {
    step: "Dynamic Programming",
    sections: [
      "DP Fundamentals",
      "Beginner DP Problems",
      "Knapsack Family",
      "Coin Problems",
      "Sequence DP",
      "Edit Distance Family",
      "Matrix DP",
    ],
  },
  {
    step: "Tries & String Algorithms",
    sections: ["Tries", "Basic Pattern Matching", "Prefix & Border Algorithms"],
  },
  { step: "Range Query Data Structures", sections: ["Range Query Structures"] },
  {
    step: "Number Theory",
    sections: ["Basic Number Theory", "Prime Algorithms", "Modular Arithmetic"],
  },
  { step: "Computational Geometry", sections: ["Basic Geometry", "Convex Hull"] },
  { step: "Network Flow & Matching", sections: ["Network Flow", "Matchings"] },
  { step: "Advanced DP Optimizations", sections: ["Advanced DP", "Bitmask DP"] },
  {
    step: "Parallel & Distributed Algorithms",
    sections: ["Parallel Algorithms", "Distributed Systems"],
  },
  { step: "Cryptography", sections: ["Cryptography & Security"] },
  { step: "Machine Learning Algorithms", sections: ["Machine Learning & AI"] },
];

export interface CurriculumItem {
  number: number;
  name: string;
  note?: string;
  part: string;
  partTitle: string;
  section: string;
  domain: DomainId;
  tier?: 1 | 2 | 3;
  /** Canonical number when this item repeats an earlier one. */
  duplicateOf?: number;
}

export interface CurriculumSection {
  title: string;
  domain: DomainId;
  items: CurriculumItem[];
}

export interface CurriculumPart {
  id: string;
  title: string;
  range: [number, number];
  sections: CurriculumSection[];
}

function build(): { parts: CurriculumPart[]; items: CurriculumItem[] } {
  let n = 0;
  const items: CurriculumItem[] = [];
  const parts = PARTS.map((part) => {
    const first = n + 1;
    const sections = part.sections.map((section) => ({
      title: section.title,
      domain: section.domain,
      items: section.items.map((text) => {
        n += 1;
        const [name, note] = text.split("|") as [string, string | undefined];
        const item: CurriculumItem = {
          number: n,
          name,
          ...(note ? { note } : {}),
          part: part.id,
          partTitle: part.title,
          section: section.title,
          domain: section.domain,
          ...(TIERS[n] ? { tier: TIERS[n] } : {}),
          ...(DUPLICATES[n] ? { duplicateOf: DUPLICATES[n] } : {}),
        };
        items.push(item);
        return item;
      }),
    }));
    return { id: part.id, title: part.title, range: [first, n] as [number, number], sections };
  });
  return { parts, items };
}

const built = build();
export const CURRICULUM_PARTS: readonly CurriculumPart[] = built.parts;
export const CURRICULUM_ITEMS: readonly CurriculumItem[] = built.items;

export function curriculumItem(number: number): CurriculumItem | undefined {
  return CURRICULUM_ITEMS[number - 1];
}
