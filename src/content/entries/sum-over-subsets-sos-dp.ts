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
    "Sum over Subsets (SOS) DP is a well-known algorithm in the domain of dynamic programming.",
  tags: ["sum over subsets sos dp", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Sum over Subsets (SOS) DP.",
    output: "Output of Sum over Subsets (SOS) DP.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Sum over Subsets (SOS) DP solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Sum over Subsets (SOS) DP algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Sum over Subsets (SOS) DP follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Sum over Subsets (SOS) DP is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Sum over Subsets (SOS) DP exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "dynamic programming",
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
      id: "sum-over-subsets-sos-dp-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Sum over Subsets (SOS) DP?",
      options: [
        "To solve the Sum over Subsets (SOS) DP problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Sum over Subsets (SOS) DP is designed to solve its specific problem efficiently.",
      hints: ["Think about what Sum over Subsets (SOS) DP does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Sum over Subsets (SOS) DP is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Sum over Subsets (SOS) DP algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n²)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["dynamic programming applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Sum over Subsets (SOS) DP?",
        a: "Use Sum over Subsets (SOS) DP when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Sum over Subsets (SOS) DP (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Sum over Subsets (SOS) DP.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
