import type { AlgorithmEntry } from "../types";

export const optimalBinarySearchTreeEntry: AlgorithmEntry = {
  slug: "optimal-binary-search-tree",
  name: "Optimal Binary Search Tree",
  aliases: ["OBST", "Optimal BST"],
  curriculum: [290],
  domain: "dynamic-programming",
  subcategory: "Interval DP",
  difficulty: "intermediate",
  summary:
    "Given keys with search frequencies, construct a BST minimizing expected search cost. Interval DP similar to matrix chain multiplication.",
  tags: ["BST", "interval DP", "dynamic programming"],
  prerequisites: ["matrix-chain-multiplication"],
  related: ["matrix-chain-multiplication", "knuth-optimization"],
  problem: {
    input: "Keys with search probabilities.",
    output: "Minimum expected search cost.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Frequently searched keys should be near the root. For each interval of keys, try each as root and sum the cost.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[i][j] = min expected cost for keys i..j.",
          "For each root r in [i,j]: dp[i][j] = min(dp[i][r-1] + dp[r+1][j] + sum(freq[i..j])).",
          "The sum(freq) accounts for all keys going one level deeper.",
          "Return dp[1][n].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Prefix sums for frequency ranges. O(n^3) time, O(n^2) space.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^3)$, $O(n^2)$ with Knuth optimization. Space $O(n^2)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Knuth's optimization exploits monotonicity of optimal roots: opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j].",
      },
    ],
  },
  complexity: {
    time: { best: "O(n³)", average: "O(n³)", worst: "O(n³)" },
    space: "O(n²)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "optimalBST",
      code: `def optimalBST(freq):
    n = len(freq)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = freq[i]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            total = sum(freq[i:j + 1])
            dp[i][j] = float('inf')
            for r in range(i, j + 1):
                left = dp[i][r - 1] if r > i else 0
                right = dp[r + 1][j] if r < j else 0
                dp[i][j] = min(dp[i][j], left + right + total)
    return dp[0][n - 1]`,
      tests: [
        {
          args: [[34, 8, 50]],
          expected: 142,
        },
        {
          args: [[25, 20, 5, 20, 30]],
          expected: 210,
        },
      ],
    },
    {
      language: "javascript",
      entry: "optimalBST",
      code: `function optimalBST(freq) {
  const n = freq.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = freq[i];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      let total = 0;
      for (let x = i; x <= j; x++) total += freq[x];
      dp[i][j] = Infinity;
      for (let r = i; r <= j; r++) {
        const left = r > i ? dp[i][r - 1] : 0;
        const right = r < j ? dp[r + 1][j] : 0;
        dp[i][j] = Math.min(dp[i][j], left + right + total);
      }
    }
  }
  return dp[0][n - 1];
}`,
      tests: [
        {
          args: [[34, 8, 50]],
          expected: 142,
        },
        {
          args: [[25, 20, 5, 20, 30]],
          expected: 210,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "obst-q1",
      kind: "mcq",
      prompt: "freq=[10,20]. Optimal cost?",
      options: ["40", "30", "50", "20"],
      answer: 0,
      explanation: "Root=key2(freq 20, depth 1) + key1(freq 10, depth 2) = 20+20=40.",
      hints: ["Try both as root."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Construct BST minimizing expected search cost given key frequencies.",
    steps: [
      "dp[i][j] = min cost for key range.",
      "Try each key as root.",
      "Add frequency sum for depth increase.",
    ],
    timeComplexity: "$O(n^3)$.",
    spaceComplexity: "$O(n^2)$.",
    correctness: "Optimal substructure: best tree splits into best left and right subtrees.",
    applications: ["compiler symbol tables", "database indexing"],
    limitations: ["static frequencies"],
    faq: [
      {
        q: "Why add sum(freq)?",
        a: "Moving all keys one level deeper adds their total frequency to the cost.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Interval DP setup (2).",
          "Root enumeration (1).",
          "Knuth optimization mention (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Optimal BST.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
