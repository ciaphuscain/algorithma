import type { AlgorithmEntry } from "../types";

export const fractionalKnapsackGreedyDpComparisonEntry: AlgorithmEntry = {
  slug: "fractional-knapsack-greedy-dp-comparison",
  name: "Fractional Knapsack (Greedy vs DP)",
  aliases: ["Continuous Knapsack"],
  curriculum: [263],
  domain: "dynamic-programming",
  subcategory: "Knapsack Variants",
  difficulty: "intermediate",
  summary:
    "Fractional knapsack allows taking fractions of items. Greedy by value/weight ratio is optimal. Compared with 0/1 knapsack DP.",
  tags: ["knapsack", "greedy", "dynamic programming", "comparison"],
  prerequisites: ["0-1-knapsack"],
  related: ["unbounded-knapsack"],
  problem: {
    input: "Item weights and values, and a capacity W. Items can be split.",
    output: "Maximum total value (may include fractional items).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "When you can take fractions, always pick the highest value-per-weight first. This greedy approach is provably optimal for the continuous case.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Sort items by value/weight ratio descending.",
          "Take items greedily; if an item doesn't fully fit, take the fraction that does.",
          "Return total value.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "O(n log n) for sorting. A single pass after sorting computes the answer.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n \\log n)$, space $O(n)$. The greedy solution is an upper bound for 0/1 knapsack.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The fractional solution provides a relaxation bound used in branch-and-bound for 0/1 knapsack.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "fractionalKnapsack",
      code: `def fractionalKnapsack(weights, values, capacity):
    items = sorted(range(len(weights)), key=lambda i: values[i] / weights[i], reverse=True)
    total = 0.0
    remaining = capacity
    for i in items:
        if remaining <= 0:
            break
        take = min(weights[i], remaining)
        total += take * (values[i] / weights[i])
        remaining -= take
    return total`,
      tests: [
        {
          args: [[10, 20, 30], [60, 100, 120], 50],
          expected: 240.0,
        },
        {
          args: [[5, 10], [50, 60], 15],
          expected: 110.0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "fractionalKnapsack",
      code: `function fractionalKnapsack(weights, values, capacity) {
  const items = Array.from({length: weights.length}, (_, i) => i);
  items.sort((a, b) => values[b] / weights[b] - values[a] / weights[a]);
  let total = 0, remaining = capacity;
  for (const i of items) {
    if (remaining <= 0) break;
    const take = Math.min(weights[i], remaining);
    total += take * (values[i] / weights[i]);
    remaining -= take;
  }
  return total;
}`,
      tests: [
        {
          args: [[10, 20, 30], [60, 100, 120], 50],
          expected: 240.0,
        },
        {
          args: [[5, 10], [50, 60], 15],
          expected: 110.0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "fk-q1",
      kind: "mcq",
      prompt: "Why is greedy optimal for fractional knapsack?",
      options: ["Items are divisible", "Items are sorted", "DP is too slow", "Weights are equal"],
      answer: 0,
      explanation:
        "Divisibility means taking the best ratio greedily never blocks a better choice.",
      hints: ["Think about what splitting allows."],
      objective: "Concept",
    },
  ],
  exam: {
    definition: "Maximize value by taking fractions of items under weight limit.",
    steps: ["Sort by value/weight.", "Greedily take items.", "Fraction of last item if needed."],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Exchange argument: swapping any choice with higher-ratio fraction improves or maintains value.",
    applications: ["resource allocation", "scheduling"],
    limitations: ["items must be divisible"],
    faq: [
      {
        q: "Why doesn't greedy work for 0/1?",
        a: "Indivisibility creates dependencies between choices.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Greedy algorithm (2).",
          "Correctness via exchange argument (2).",
          "Comparison with 0/1 (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Greedy algorithms.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
