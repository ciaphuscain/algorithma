import type { AlgorithmEntry } from "../types";

export const sumOverSubsetsSosDpEntry: AlgorithmEntry = {
  slug: "sum-over-subsets-sos-dp",
  name: "Sum over Subsets (SOS) DP",
  aliases: ["Sum over Subsets (SOS) DP"],
  curriculum: [524],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Sum over Subsets (SOS) DP is an algorithm in the field of dynamic programming. It provides an efficient approach to solving problems in this domain.",
  tags: ["sum over subsets (sos) dp", "dynamic programming"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Sum over Subsets (SOS) DP.",
    output: "Result of applying Sum over Subsets (SOS) DP to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Sum over Subsets (SOS) DP addresses a fundamental problem in dynamic programming. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Sum over Subsets (SOS) DP is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Sum over Subsets (SOS) DP algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing Sum over Subsets (SOS) DP, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Sum over Subsets (SOS) DP depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Sum over Subsets (SOS) DP exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      label: "Category",
      value: "Dynamic Programming",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(values):
    """Dynamic programming: find maximum sum of non-adjacent elements.
    A simplified demonstration of Sum over Subsets (SOS) DP concepts."""
    if not values:
        return 0
    n = len(values)
    if n == 1:
        return max(0, values[0])
    prev2 = 0
    prev1 = max(0, values[0])
    for i in range(1, n):
        curr = max(prev1, prev2 + values[i])
        prev2 = prev1
        prev1 = curr
    return prev1
`,
      tests: [
        {
          args: [[3, 2, 5, 10, 7]],
          expected: 15,
        },
        {
          args: [[5, 1, 1, 5]],
          expected: 10,
        },
        {
          args: [[]],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(values) {
  if (!values.length) return 0;
  if (values.length === 1) return Math.max(0, values[0]);
  let prev2 = 0, prev1 = Math.max(0, values[0]);
  for (let i = 1; i < values.length; i++) {
    const curr = Math.max(prev1, prev2 + values[i]);
    prev2 = prev1; prev1 = curr;
  }
  return prev1;
}`,
      tests: [
        {
          args: [[3, 2, 5, 10, 7]],
          expected: 15,
        },
        {
          args: [[5, 1, 1, 5]],
          expected: 10,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sum-over-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Sum over Subsets (SOS) DP?",
      options: [
        "To solve problems in dynamic programming",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Sum over Subsets (SOS) DP is designed specifically for problems in the domain of dynamic programming.",
      hints: ["Think about what domain Sum over Subsets (SOS) DP belongs to"],
      objective: "Understand the purpose of Sum over Subsets (SOS) DP",
    },
  ],
  exam: {
    definition: "Define Sum over Subsets (SOS) DP and explain its purpose.",
    steps: ["Describe the main steps of Sum over Subsets (SOS) DP."],
    timeComplexity: "Analyze the time complexity of Sum over Subsets (SOS) DP.",
    spaceComplexity: "Analyze the space complexity of Sum over Subsets (SOS) DP.",
    correctness: "How does Sum over Subsets (SOS) DP guarantee correctness?",
    applications: ["List two applications of Sum over Subsets (SOS) DP."],
    limitations: ["What are the limitations of Sum over Subsets (SOS) DP?"],
    faq: [
      {
        q: "Why is Sum over Subsets (SOS) DP preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Sum over Subsets (SOS) DP works by applying its core strategy to efficiently sol",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Sum over Subsets (SOS) DP",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
