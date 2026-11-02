import type { AlgorithmEntry } from "../types";

export const houseRobberIiEntry: AlgorithmEntry = {
  slug: "house-robber-ii",
  name: "House Robber II",
  aliases: ["House Robber II", "Circular house robber"],
  curriculum: [260],
  domain: "dynamic-programming",
  subcategory: "Classic DP",
  difficulty: "intermediate",
  summary:
    "Extension of House Robber where houses are arranged in a circle: the first and last houses are adjacent, so both cannot be robbed.",
  tags: ["house robber", "dynamic programming", "circular", "non-adjacent"],
  prerequisites: ["House Robber"],
  related: ["house-robber"],
  problem: {
    input: "An array of non-negative integers in circular arrangement.",
    output:
      "Maximum amount robbed without robbing two adjacent houses (including first-last pair).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The circle means house 0 and house n-1 are neighbors. Solve two linear subproblems: one excluding the first house, one excluding the last. The answer is the max of both.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Run House Robber on nums[1..n-1] (exclude first).",
          "Run House Robber on nums[0..n-2] (exclude last).",
          "Return the maximum of both results.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Reuse the linear House Robber as a helper. Handle edge case: single house.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Two passes of $O(n)$ each → $O(n)$ total, $O(1)$ space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Can be further generalized to any circular constraint.",
          "The tree version requires tree DP instead.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Pattern",
      value: "Two linear passes on a circular array",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "rob2",
      code: `def rob2(nums):
    if len(nums) <= 1:
        return nums[0] if nums else 0
    def linear(arr):
        p2, p1 = 0, 0
        for v in arr:
            p2, p1 = p1, max(p1, p2 + v)
        return p1
    return max(linear(nums[1:]), linear(nums[:-1]))
`,
      tests: [
        {
          args: [[2, 3, 2]],
          expected: 3,
        },
        {
          args: [[1, 2, 3, 1]],
          expected: 4,
        },
        {
          args: [[5]],
          expected: 5,
        },
      ],
    },
    {
      language: "javascript",
      entry: "rob2",
      code: `function rob2(nums) {
  if (nums.length <= 1) return nums[0] || 0;
  function linear(arr) {
    let p2 = 0, p1 = 0;
    for (const v of arr) { const t = Math.max(p1, p2 + v); p2 = p1; p1 = t; }
    return p1;
  }
  return Math.max(linear(nums.slice(1)), linear(nums.slice(0, -1)));
}
`,
      tests: [
        {
          args: [[2, 3, 2]],
          expected: 3,
        },
        {
          args: [[1, 2, 3, 1]],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "house-robber-ii-q1",
      kind: "mcq",
      prompt: "Why solve two linear subproblems?",
      options: [
        "Because first and last houses cannot both be robbed",
        "To double-check the answer",
        "Because the array might be empty",
        "To handle even/odd lengths",
      ],
      answer: 0,
      explanation: "In a circle, the first and last are adjacent, so at most one can be included.",
      hints: ["Think about what constraint the circle adds."],
      objective: "Insight",
    },
  ],
  exam: {
    definition: "Max non-adjacent sum in a circular array.",
    steps: ["Solve linear version on nums[1..n-1].", "Solve on nums[0..n-2].", "Return max."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "Either house 0 is not robbed (first case) or house n-1 is not (second case). One must hold.",
    applications: ["circular scheduling"],
    limitations: ["Only handles pairs of adjacent constraints"],
    faq: [
      {
        q: "Why not just run House Robber directly?",
        a: "It might rob both house 0 and n-1, which are adjacent in a circle.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Explain circular constraint (1).",
          "Two linear subproblems (2).",
          "Correctness argument (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Dynamic programming.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
