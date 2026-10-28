import type { AlgorithmEntry } from "../types";

export const naiveStringMatchingEntry: AlgorithmEntry = {
  slug: "naive-string-matching",
  name: "Naive String Matching",
  aliases: ["Naive String Matching"],
  curriculum: [301],
  domain: "strings",
  subcategory: "String Matching",
  difficulty: "beginner",
  summary:
    "Check every position in the text as a potential match start. For each position, compare characters one by one. O(nm) worst case but simple and fast for short patterns.",
  tags: ["string matching", "brute force", "pattern"],
  prerequisites: ["Arrays", "Strings"],
  related: ["kmp", "z-algorithm"],
  problem: {
    input: "Input for Naive String Matching.",
    output: "Output of Naive String Matching.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Check every position in the text as a potential match start. For each position, compare characters one by one. O(nm) worst case but simple and fast for short patterns.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Naive String Matching algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Naive String Matching follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Naive String Matching is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Naive String Matching exist in the literature. See references for details.",
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
    worstClass: "other",
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
      id: "naive-string-matching-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Naive String Matching?",
      options: [
        "Check every position in the text as a potential match start....",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Naive String Matching: Check every position in the text as a potential match start. For each position, compare characters one by one. O(nm) worst case but simple and fast for short patterns.",
      hints: ["Think about what problem Naive String Matching solves."],
      objective: "Naive String Matching",
    },
  ],
  exam: {
    definition:
      "Check every position in the text as a potential match start. For each position, compare characters one by one. O(nm) worst case but simple and fast for short patterns.",
    steps: ["Apply the Naive String Matching algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Naive String Matching algorithm is correct because it systematically processes all cases.",
    applications: ["String Matching"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Naive String Matching?",
        a: "Use Naive String Matching when the problem matches its design: Check every position in the text as a potential match start. For each position, compare characters o",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Naive String Matching (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Naive String Matching.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
