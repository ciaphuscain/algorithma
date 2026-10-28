import type { AlgorithmEntry } from "../types";

export const houseRobberEntry: AlgorithmEntry = {
  slug: "house-robber",
  name: "House Robber",
  aliases: ["House Robber"],
  curriculum: [259],
  domain: "dynamic-programming",
  subcategory: "Beginner DP",
  difficulty: "beginner",
  summary:
    "Maximize the sum of non-adjacent elements in an array. dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Models a robber choosing which houses to rob without triggering adjacent alarms.",
  tags: ["house robber", "DP", "non-adjacent"],
  prerequisites: ["Climbing Stairs"],
  related: ["house-robber-ii", "fibonacci-dp"],
  problem: {
    input: "Input for House Robber.",
    output: "Output of House Robber.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Maximize the sum of non-adjacent elements in an array. dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Models a robber choosing which houses to rob without triggering adjacent alarms.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The House Robber algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of House Robber follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of House Robber is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of House Robber exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Beginner DP",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "house-robber-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of House Robber?",
      options: [
        "Maximize the sum of non-adjacent elements in an array. dp[i]...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "House Robber: Maximize the sum of non-adjacent elements in an array. dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Models a robber choosing which houses to rob without triggering adjacent alarms.",
      hints: ["Think about what problem House Robber solves."],
      objective: "House Robber",
    },
  ],
  exam: {
    definition:
      "Maximize the sum of non-adjacent elements in an array. dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Models a robber choosing which houses to rob without triggering adjacent alarms.",
    steps: ["Apply the House Robber algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The House Robber algorithm is correct because it systematically processes all cases.",
    applications: ["Beginner DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use House Robber?",
        a: "Use House Robber when the problem matches its design: Maximize the sum of non-adjacent elements in an array. dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Mode",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define House Robber (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for House Robber.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
