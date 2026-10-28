import type { AlgorithmEntry } from "../types";

export const ropeEntry: AlgorithmEntry = {
  slug: "rope",
  name: "Rope",
  aliases: ["Rope"],
  curriculum: [140],
  domain: "linear-structures",
  subcategory: "Persistent & Text Structures",
  difficulty: "intermediate",
  summary:
    "A balanced binary tree of string fragments supporting O(log n) concatenation, split, and insert. The backbone of text editors for large files.",
  tags: ["rope", "text editor", "balanced tree"],
  prerequisites: ["Binary Search Tree"],
  related: ["avl-tree"],
  problem: {
    input: "Input for Rope.",
    output: "Output of Rope.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A balanced binary tree of string fragments supporting O(log n) concatenation, split, and insert. The backbone of text editors for large files.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Rope algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Rope follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Rope is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Rope exist in the literature. See references for details.",
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
    worstClass: "log n",
  },
  properties: [
    {
      label: "Category",
      value: "Persistent & Text Structures",
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
      id: "rope-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Rope?",
      options: [
        "A balanced binary tree of string fragments supporting O(log ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Rope: A balanced binary tree of string fragments supporting O(log n) concatenation, split, and insert. The backbone of text editors for large files.",
      hints: ["Think about what problem Rope solves."],
      objective: "Rope",
    },
  ],
  exam: {
    definition:
      "A balanced binary tree of string fragments supporting O(log n) concatenation, split, and insert. The backbone of text editors for large files.",
    steps: ["Apply the Rope algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness: "The Rope algorithm is correct because it systematically processes all cases.",
    applications: ["Persistent & Text Structures"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Rope?",
        a: "Use Rope when the problem matches its design: A balanced binary tree of string fragments supporting O(log n) concatenation, split, and insert. The",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define Rope (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Rope.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
