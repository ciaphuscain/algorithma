import type { AlgorithmEntry } from "../types";

export const houseRobberEntry: AlgorithmEntry = {
  slug: "house-robber",
  name: "House Robber",
  aliases: ["House Robber", "Maximum non-adjacent sum"],
  curriculum: [259],
  domain: "dynamic-programming",
  subcategory: "Classic DP",
  difficulty: "beginner",
  summary:
    "Finds the maximum sum of non-adjacent elements in an array, modeling a robber who cannot rob two adjacent houses.",
  tags: ["house robber", "dynamic programming", "non-adjacent", "maximum sum"],
  prerequisites: ["Climbing Stairs"],
  related: ["house-robber-ii", "maximum-independent-set-on-tree"],
  problem: {
    input: "An array of non-negative integers representing money in each house.",
    output: "Maximum amount that can be robbed without robbing two adjacent houses.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "At each house, decide: rob it (add its value to the best from two houses back) or skip it (keep the best from the previous house). Track both options as you go.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "prev2 = 0, prev1 = 0.",
          "For each house value v: new = max(prev1, prev2 + v).",
          "Update prev2 = prev1, prev1 = new.",
          "Return prev1.",
        ],
      },
      {
        kind: "p",
        text: "**Example.** [2, 7, 9, 3, 1]: rob houses 0, 2, 4 → 2+9+1 = 12.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Two variables suffice. The recurrence is dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n)$, space $O(1)$. Equivalent to maximum weight independent set on a path graph.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "House Robber II: circular arrangement (solve twice, exclude first or last).",
          "Tree version: maximum independent set on a tree (tree DP).",
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
      value: "Include/exclude DP",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "rob",
      code: `def rob(nums):
    prev2, prev1 = 0, 0
    for v in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + v)
    return prev1
`,
      tests: [
        {
          args: [[1, 2, 3, 1]],
          expected: 4,
        },
        {
          args: [[2, 7, 9, 3, 1]],
          expected: 12,
        },
        {
          args: [[]],
          expected: 0,
        },
        {
          args: [[5]],
          expected: 5,
        },
      ],
    },
    {
      language: "javascript",
      entry: "rob",
      code: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const v of nums) { const t = Math.max(prev1, prev2 + v); prev2 = prev1; prev1 = t; }
  return prev1;
}
`,
      tests: [
        {
          args: [[1, 2, 3, 1]],
          expected: 4,
        },
        {
          args: [[2, 7, 9, 3, 1]],
          expected: 12,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "house-robber-q1",
      kind: "mcq",
      prompt: "For houses [2, 7, 9, 3, 1], what is the maximum?",
      options: ["12", "11", "16", "10"],
      answer: 0,
      explanation: "Rob houses 0, 2, 4: 2+9+1=12.",
      hints: ["You cannot rob adjacent houses."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Find maximum sum of non-adjacent elements in an array.",
    steps: [
      "Initialize prev2=0, prev1=0.",
      "For each element: max(prev1, prev2+v).",
      "Return prev1.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "Optimal substructure: best up to house i either includes i (needs best up to i-2) or excludes it (best up to i-1).",
    applications: ["scheduling", "resource allocation"],
    limitations: ["Only linear (not circular) arrangement"],
    faq: [
      {
        q: "How does this differ from House Robber II?",
        a: "In II, houses are in a circle so first and last are adjacent.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define recurrence (1).",
          "Show O(1)-space solution (2).",
          "Prove optimality (2).",
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
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
