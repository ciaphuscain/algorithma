import type { AlgorithmEntry } from "../types";

export const stateCompressionDpEntry: AlgorithmEntry = {
  slug: "state-compression-dp",
  name: "State Compression DP",
  aliases: ["Bitmask DP", "DP with bitmasks"],
  curriculum: [254],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "State compression DP represents subsets of elements as bitmasks, enabling DP over exponentially many states in O(2^n · poly(n)) time.",
  tags: ["dynamic programming", "bitmask", "subset", "exponential"],
  prerequisites: ["Dynamic Programming"],
  related: ["space-optimized-dp", "state-machine-dp"],
  problem: {
    input: "A problem where the state is a subset of n elements (n typically ≤ 20).",
    output: "The optimal value over all subsets, computed by iterating over 2^n bitmask states.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "When the DP state involves 'which items have been used', we can represent this as a bitmask: an integer where bit i is 1 if item i is included. For n ≤ 20, there are 2^n ≈ 10^6 states, which is feasible.",
      },
      {
        kind: "p",
        text: "The classic example is the travelling salesman problem (TSP): dp[mask][i] = minimum cost to visit the cities in mask, ending at city i. The bitmask encodes which cities have been visited.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Encode subsets as integers: mask = 0b1010 means items 1 and 3 are selected.",
          "Iterate over all masks from 0 to 2^n - 1.",
          "For each mask, try adding each unvisited element and update dp[new_mask].",
          "Use bitwise operations: check bit i with (mask >> i) & 1, set bit i with mask | (1 << i).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (TSP, 4 cities): dp[0001][0]=0 (start at city 0). dp[0011][1] = dist(0,1). dp[0101][2] = dist(0,2). ... dp[1111][i] = min over all paths visiting all cities, ending at i, + dist(i,0).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "n must be small (typically ≤ 20-25) since the state space is 2^n.",
          "Iterate masks in increasing order to ensure subsets are processed before supersets.",
          "Common operations: enumerate submasks of a mask with `sub = (sub - 1) & mask`.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time: O(2^n · n) for TSP, O(3^n) for subset convolution. Space: O(2^n). The 2^n factor is optimal for problems that inherently require considering all subsets (like TSP, which is NP-hard).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Subset sum convolution runs in O(2^n · n^2) using the ranked Möbius transform.",
          "Profile DP (broken profile) uses bitmasks for one dimension of a grid problem.",
          "The Held–Karp algorithm for TSP is the canonical state-compression DP, running in O(2^n · n^2).",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(2^n n)",
      average: "O(2^n n)",
      worst: "O(2^n n^2)",
    },
    space: "O(2^n n)",
    worstClass: "2^n",
    note: "Exponential in n but polynomial for fixed n; practical for n ≤ 20.",
  },
  properties: [
    {
      label: "State space",
      value: "2^n subsets",
    },
    {
      label: "Applicable n",
      value: "Typically ≤ 20",
    },
    {
      label: "Subset encoding",
      value: "Integer bitmask",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "tsp_bitmask",
      code: `def tsp_bitmask(dist):
    """Solve TSP on dist matrix (n x n). Returns minimum tour cost starting and ending at 0."""
    n = len(dist)
    INF = float('inf')
    dp = [[INF]*n for _ in range(1 << n)]
    dp[1][0] = 0  # start at city 0
    for mask in range(1 << n):
        for u in range(n):
            if dp[mask][u] == INF: continue
            if not (mask >> u & 1): continue
            for v in range(n):
                if mask >> v & 1: continue
                nm = mask | (1 << v)
                if dp[mask][u] + dist[u][v] < dp[nm][v]:
                    dp[nm][v] = dp[mask][u] + dist[u][v]
    full = (1 << n) - 1
    return min(dp[full][i] + dist[i][0] for i in range(n))
`,
      tests: [
        {
          args: [
            [
              [0, 10, 15, 20],
              [10, 0, 35, 25],
              [15, 35, 0, 30],
              [20, 25, 30, 0],
            ],
          ],
          expected: 80,
        },
        {
          args: [
            [
              [0, 1, 2],
              [1, 0, 3],
              [2, 3, 0],
            ],
          ],
          expected: 6,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bitmask-check",
      kind: "mcq",
      prompt: "How do you check if city i is in bitmask 'mask'?",
      options: ["(mask >> i) & 1", "mask % i", "mask[i]", "mask & i"],
      answer: 0,
      explanation: "Right-shift by i and AND with 1 extracts bit i from the mask.",
      hints: ["Think about bitwise operations."],
      objective: "Know bitmask operations",
    },
  ],
  exam: {
    definition:
      "State compression DP encodes subsets as bitmasks, enabling DP over 2^n states for subset-based problems.",
    steps: [
      "Represent subsets as integers.",
      "Iterate masks in order.",
      "Transition by adding/removing elements.",
      "Use bitwise operations.",
    ],
    timeComplexity: "O(2^n · n) to O(2^n · n^2)",
    spaceComplexity: "O(2^n · n)",
    correctness: "Exhaustive over all subsets; correctness follows from the DP recurrence.",
    applications: ["TSP (Held-Karp)", "Hamiltonian path", "Assignment problems", "Profile DP"],
    limitations: ["Exponential: only feasible for n ≤ ~20", "Memory-intensive"],
    faq: [
      {
        q: "Can it solve problems larger than n=20?",
        a: "Rarely; meet-in-the-middle can push to n≈40 for some problems.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Bitmask encoding and transitions (1).", "TSP example and complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "M. Held, R. M. Karp, 'A Dynamic Programming Approach to Sequencing Problems,' Journal of SIAM, 10(1), 1962.",
      supports: "The Held-Karp TSP algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
