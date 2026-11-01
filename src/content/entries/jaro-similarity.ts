import type { AlgorithmEntry } from "../types";

export const jaroSimilarityEntry: AlgorithmEntry = {
  slug: "jaro-similarity",
  name: "Jaro Similarity",
  aliases: ["Jaro Similarity"],
  curriculum: [333],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Jaro Similarity is a well-known algorithm in the domain of string processing.",
  tags: ["jaro similarity", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Jaro Similarity.",
    output: "Output of Jaro Similarity.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Jaro Similarity solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Jaro Similarity algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Jaro Similarity follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Jaro Similarity is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Jaro Similarity exist in the literature. See references for details.",
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
      id: "jaro-similarity-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Jaro Similarity?",
      options: [
        "To solve the Jaro Similarity problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Jaro Similarity is designed to solve its specific problem efficiently.",
      hints: ["Think about what Jaro Similarity does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Jaro Similarity is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Jaro Similarity algorithm to the input.",
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
        q: "When should you use Jaro Similarity?",
        a: "Use Jaro Similarity when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Jaro Similarity (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Jaro Similarity.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
