import type { AlgorithmEntry } from "../types";

export const steinerTreeDpDreyfusWagnerEntry: AlgorithmEntry = {
  slug: "steiner-tree-dp-dreyfus-wagner",
  name: "Steiner Tree DP (Dreyfus–Wagner)",
  aliases: ["Dreyfus-Wagner", "Steiner Tree in Graphs"],
  curriculum: [516],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "The Dreyfus–Wagner algorithm finds the minimum Steiner tree connecting a set of terminal vertices in a weighted graph using bitmask DP over subsets of terminals, running in O(3^k · n + 2^k · n^2) time.",
  tags: ["Steiner tree", "bitmask DP", "graph optimization", "NP-hard"],
  prerequisites: ["Dijkstra's Algorithm", "State Compression DP"],
  related: ["state-compression-dp"],
  problem: {
    input: "A weighted graph G and a set of k terminal vertices.",
    output:
      "The minimum-weight tree in G connecting all terminals (may use non-terminal Steiner vertices).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A Steiner tree connects specified terminal vertices using the cheapest possible tree, possibly through non-terminal vertices. Unlike MST, which connects all vertices, the Steiner tree problem is NP-hard. The Dreyfus–Wagner algorithm solves it exactly using bitmask DP over subsets of terminals.",
      },
      {
        kind: "p",
        text: "The key idea: dp[S][v] = cost of the cheapest tree connecting the terminals in subset S, rooted at vertex v. We build larger subsets from smaller ones and relax edges to extend trees.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each terminal t, initialize dp[{t}][t] = 0.",
          "Process subsets S in increasing size order.",
          "For each non-empty proper subset T of S: dp[S][v] = min(dp[T][v] + dp[S\\T][v]) — merge two subtrees at v.",
          "Relax: for each edge (u,v,w), dp[S][v] = min(dp[S][v], dp[S][u] + w) — extend tree to neighbor.",
          "Answer: min over v of dp[full_set][v].",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Enumerate submasks efficiently: for (sub = (S-1)&S; sub > 0; sub = (sub-1)&S).",
          "The relaxation step can use Dijkstra-like shortest path computation for each subset.",
          "Only practical for small k (up to ~15-20 terminals).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time: O(3^k · n + 2^k · n^2) where k = |terminals| and n = |V|. The 3^k comes from enumerating all pairs of complementary subsets. Space: O(2^k · n). NP-hardness means no polynomial algorithm exists (unless P=NP).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Steiner tree approximation: the MST of terminals gives a 2-approximation.",
          "Robins–Zelikovsky gives a 1.55-approximation in polynomial time.",
          "The Steiner tree problem in graphs is NP-hard but fixed-parameter tractable in k.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(3^k n)",
      average: "O(3^k n + 2^k n^2)",
      worst: "O(3^k n + 2^k n^2)",
    },
    space: "O(2^k n)",
    worstClass: "2^n",
    note: "k = number of terminals, n = vertices. Exponential in k only.",
  },
  properties: [
    {
      label: "Exact",
      value: "Yes",
    },
    {
      label: "Applicable k",
      value: "≤ 15-20 terminals",
    },
    {
      label: "Problem class",
      value: "NP-hard (FPT in k)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "steiner_tree",
      code: `def steiner_tree(n, edges, terminals):
    """Minimum Steiner tree cost. n vertices (0..n-1), edges: [u,v,w], terminals: list."""
    import heapq
    INF = float('inf')
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))
    k = len(terminals)
    dp = [[INF]*n for _ in range(1 << k)]
    for i, t in enumerate(terminals):
        dp[1 << i][t] = 0
    for S in range(1, 1 << k):
        # Merge subtrees
        sub = (S - 1) & S
        while sub > 0:
            comp = S ^ sub
            if sub < comp:
                sub = (sub - 1) & S
                continue
            for v in range(n):
                val = dp[sub][v] + dp[comp][v]
                if val < dp[S][v]:
                    dp[S][v] = val
            sub = (sub - 1) & S
        # Dijkstra relaxation
        pq = []
        for v in range(n):
            if dp[S][v] < INF:
                heapq.heappush(pq, (dp[S][v], v))
        while pq:
            d, u = heapq.heappop(pq)
            if d > dp[S][u]: continue
            for v, w in adj[u]:
                if d + w < dp[S][v]:
                    dp[S][v] = d + w
                    heapq.heappush(pq, (dp[S][v], v))
    full = (1 << k) - 1
    return min(dp[full])
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 1],
              [1, 2, 2],
              [2, 3, 1],
              [0, 3, 4],
              [1, 3, 3],
            ],
            [0, 2, 3],
          ],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "steiner-vs-mst",
      kind: "mcq",
      prompt: "How does the Steiner tree differ from the minimum spanning tree?",
      options: [
        "It connects only terminal vertices and may use non-terminal Steiner points",
        "It must visit all vertices",
        "It minimizes the longest edge",
        "It only works on planar graphs",
      ],
      answer: 0,
      explanation:
        "MST connects all vertices; Steiner tree connects only specified terminals, potentially using additional intermediate vertices.",
      hints: ["What vertices does a Steiner tree need to include?"],
      objective: "Distinguish Steiner tree from MST",
    },
  ],
  exam: {
    definition:
      "The Dreyfus–Wagner algorithm finds the minimum Steiner tree using bitmask DP over subsets of terminals.",
    steps: [
      "Init dp[{t}][t]=0 for each terminal.",
      "Merge subtrees: dp[S][v] = dp[T][v]+dp[S\\T][v].",
      "Relax edges (Dijkstra).",
      "Answer: min dp[full][v].",
    ],
    timeComplexity: "O(3^k n + 2^k n^2)",
    spaceComplexity: "O(2^k n)",
    correctness:
      "Correctness: every Steiner tree decomposes into subtrees merged at vertices; DP enumerates all decompositions.",
    applications: ["VLSI routing", "Network design", "Phylogenetic trees"],
    limitations: ["Only practical for small k", "NP-hard in general"],
    faq: [
      {
        q: "Can we approximate?",
        a: "Yes, MST of terminals gives 2-approximation; Robins-Zelikovsky gives 1.55.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Bitmask DP over terminal subsets (1).", "Merge and relax steps (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "S. E. Dreyfus, R. A. Wagner, 'The Steiner Problem in Graphs,' Networks, 1(3), 1971.",
      supports: "The original Dreyfus-Wagner algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
