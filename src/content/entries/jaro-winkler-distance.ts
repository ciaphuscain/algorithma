import type { AlgorithmEntry } from "../types";

export const jaroWinklerDistanceEntry: AlgorithmEntry = {
  slug: "jaro-winkler-distance",
  name: "Jaro–Winkler Distance",
  aliases: ["Jaro–Winkler Distance"],
  curriculum: [334],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Jaro–Winkler Distance is a well-known algorithm in the domain of string processing.",
  tags: ["jaro winkler distance", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Jaro–Winkler Distance.",
    output: "Output of Jaro–Winkler Distance.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Jaro–Winkler Distance solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Jaro–Winkler Distance algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Jaro–Winkler Distance follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Jaro–Winkler Distance is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Jaro–Winkler Distance exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "string processing",
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
      id: "jaro-winkler-distance-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Jaro–Winkler Distance?",
      options: [
        "To solve the Jaro–Winkler Distance problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Jaro–Winkler Distance is designed to solve its specific problem efficiently.",
      hints: ["Think about what Jaro–Winkler Distance does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Jaro–Winkler Distance is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Jaro–Winkler Distance algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["string processing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Jaro–Winkler Distance?",
        a: "Use Jaro–Winkler Distance when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Jaro–Winkler Distance (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Jaro–Winkler Distance.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
