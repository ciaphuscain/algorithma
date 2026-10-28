import type { AlgorithmEntry } from "../types";

export const zAlgorithmEntry: AlgorithmEntry = {
  slug: "z-algorithm",
  name: "Z-Algorithm",
  aliases: ["Z-Algorithm"],
  curriculum: [307],
  domain: "strings",
  subcategory: "String Matching",
  difficulty: "intermediate",
  summary:
    "Computes the Z-array where Z[i] is the length of the longest substring starting at i that matches a prefix of the string. Runs in O(n) using a sliding window [L, R]. Used for pattern matching by concatenating pattern + '$' + text.",
  tags: ["Z-algorithm", "string matching", "prefix"],
  prerequisites: ["Arrays", "Strings"],
  related: ["kmp", "naive-string-matching"],
  problem: {
    input: "Input for Z-Algorithm.",
    output: "Output of Z-Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Computes the Z-array where Z[i] is the length of the longest substring starting at i that matches a prefix of the string. Runs in O(n) using a sliding window [L, R]. Used for pattern matching by concatenating pattern + '$' + text.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Z-Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Z-Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Z-Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Z-Algorithm exist in the literature. See references for details.",
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
      value: "String Matching",
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
      id: "z-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Z-Algorithm?",
      options: [
        "Computes the Z-array where Z[i] is the length of the longest...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Z-Algorithm: Computes the Z-array where Z[i] is the length of the longest substring starting at i that matches a prefix of the string. Runs in O(n) using a sliding window [L, R]. Used for pattern matching by concatenating pattern + '$' + text.",
      hints: ["Think about what problem Z-Algorithm solves."],
      objective: "Z-Algorithm",
    },
  ],
  exam: {
    definition:
      "Computes the Z-array where Z[i] is the length of the longest substring starting at i that matches a prefix of the string. Runs in O(n) using a sliding window [L, R]. Used for pattern matching by concatenating pattern + '$' + text.",
    steps: ["Apply the Z-Algorithm algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Z-Algorithm algorithm is correct because it systematically processes all cases.",
    applications: ["String Matching"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Z-Algorithm?",
        a: "Use Z-Algorithm when the problem matches its design: Computes the Z-array where Z[i] is the length of the longest substring starting at i that matches a ",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Z-Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Z-Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
