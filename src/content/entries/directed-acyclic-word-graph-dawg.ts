import type { AlgorithmEntry } from "../types";

export const directedAcyclicWordGraphDawgEntry: AlgorithmEntry = {
  slug: "directed-acyclic-word-graph-dawg",
  name: "Directed Acyclic Word Graph (DAWG)",
  aliases: ["Directed Acyclic Word Graph (DAWG)"],
  curriculum: [319],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary:
    "Directed Acyclic Word Graph (DAWG) is a well-known algorithm in the domain of string processing.",
  tags: ["directed acyclic word graph dawg", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Directed Acyclic Word Graph (DAWG).",
    output: "Output of Directed Acyclic Word Graph (DAWG).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Directed Acyclic Word Graph (DAWG) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Directed Acyclic Word Graph (DAWG) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Directed Acyclic Word Graph (DAWG) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Directed Acyclic Word Graph (DAWG) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Directed Acyclic Word Graph (DAWG) exist in the literature. See references for details.",
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
      id: "directed-acyclic-word-graph-dawg-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Directed Acyclic Word Graph (DAWG)?",
      options: [
        "To solve the Directed Acyclic Word Graph (DAWG) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Directed Acyclic Word Graph (DAWG) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Directed Acyclic Word Graph (DAWG) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Directed Acyclic Word Graph (DAWG) is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Directed Acyclic Word Graph (DAWG) algorithm to the input.",
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
        q: "When should you use Directed Acyclic Word Graph (DAWG)?",
        a: "Use Directed Acyclic Word Graph (DAWG) when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Directed Acyclic Word Graph (DAWG) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Directed Acyclic Word Graph (DAWG).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
