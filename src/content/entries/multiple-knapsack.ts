import type { AlgorithmEntry } from "../types";

export const multipleKnapsackEntry: AlgorithmEntry = {
  slug: "multiple-knapsack",
  name: "Multiple Knapsack",
  aliases: ["Bounded Knapsack"],
  curriculum: [264],
  domain: "dynamic-programming",
  subcategory: "Knapsack Variants",
  difficulty: "intermediate",
  summary:
    "Each item has a limited number of copies. Binary splitting converts bounded copies into a 0/1 knapsack on O(n log C) virtual items.",
  tags: ["knapsack", "dynamic programming", "bounded"],
  prerequisites: ["0-1-knapsack"],
  related: ["unbounded-knapsack", "group-knapsack"],
  problem: {
    input: "Items with weight, value, and count limit; capacity W.",
    output: "Maximum value using at most count[i] copies of item i.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Binary splitting: represent count c as 1+2+4+...+(remainder). Each group becomes a 0/1 item.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each item with count c, create virtual items of sizes 1, 2, 4, ..., 2^k, remainder.",
          "Run 0/1 knapsack on virtual items.",
          "Return dp[W].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "This reduces O(n·C·W) naive approach to O(n·log(C)·W).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(W \\cdot n \\log C_{\\max})$, space $O(W)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Monotone-queue optimization achieves O(nW) by processing each item's multiples in a sliding window.",
      },
    ],
  },
  complexity: {
    time: { best: "O(W·n·logC)", average: "O(W·n·logC)", worst: "O(W·n·logC)" },
    space: "O(W)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "multipleKnapsack",
      code: `def multipleKnapsack(weights, values, counts, capacity):
    dp = [0] * (capacity + 1)
    for i in range(len(weights)):
        c = counts[i]
        k = 1
        while c > 0:
            take = min(k, c)
            tw, tv = weights[i] * take, values[i] * take
            for w in range(capacity, tw - 1, -1):
                dp[w] = max(dp[w], dp[w - tw] + tv)
            c -= take
            k *= 2
    return dp[capacity]`,
      tests: [
        {
          args: [[2, 3], [5, 8], [3, 2], 10],
          expected: 25,
        },
        {
          args: [[1, 2, 3], [2, 5, 8], [3, 2, 1], 7],
          expected: 18,
        },
      ],
    },
    {
      language: "javascript",
      entry: "multipleKnapsack",
      code: `function multipleKnapsack(weights, values, counts, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    let c = counts[i], k = 1;
    while (c > 0) {
      const take = Math.min(k, c);
      const tw = weights[i] * take, tv = values[i] * take;
      for (let w = capacity; w >= tw; w--) dp[w] = Math.max(dp[w], dp[w - tw] + tv);
      c -= take;
      k *= 2;
    }
  }
  return dp[capacity];
}`,
      tests: [
        {
          args: [[2, 3], [5, 8], [3, 2], 10],
          expected: 25,
        },
        {
          args: [[1, 2, 3], [2, 5, 8], [3, 2, 1], 7],
          expected: 18,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "mk-q1",
      kind: "mcq",
      prompt: "Binary splitting of count=7 gives groups of sizes?",
      options: ["1,2,4", "1,2,3,1", "1,6", "7"],
      answer: 0,
      explanation: "7 = 1+2+4.",
      hints: ["Powers of 2 up to the count."],
      objective: "Concept",
    },
  ],
  exam: {
    definition: "Knapsack where each item has a bounded number of copies.",
    steps: ["Binary-split each item.", "Run 0/1 knapsack on virtual items.", "Return dp[W]."],
    timeComplexity: "$O(W \\cdot n \\log C)$.",
    spaceComplexity: "$O(W)$.",
    correctness: "Binary splitting can represent any count from 0 to c.",
    applications: ["inventory optimization", "resource planning"],
    limitations: ["pseudo-polynomial"],
    faq: [
      {
        q: "Why binary splitting?",
        a: "Any integer 0..c can be formed by subsets of {1,2,4,...,r}; this reduces item count from c to log c.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Binary splitting (2).", "0/1 knapsack on virtual items (1).", "Complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "S. Martello and P. Toth, Knapsack Problems, Wiley, 1990.",
      supports: "Bounded knapsack.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
