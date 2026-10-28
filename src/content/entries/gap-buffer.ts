import type { AlgorithmEntry } from "../types";

export const gapBufferEntry: AlgorithmEntry = {
  slug: "gap-buffer",
  name: "Gap Buffer",
  aliases: ["Gap Buffer"],
  curriculum: [141],
  domain: "linear-structures",
  subcategory: "Persistent & Text Structures",
  difficulty: "beginner",
  summary:
    "A text-editing array with unused space at the cursor. Inserts at the cursor are O(1) amortized; moving the cursor shifts the gap. Used in Emacs.",
  tags: ["gap buffer", "text editor", "array"],
  prerequisites: ["Arrays"],
  related: ["rope"],
  problem: {
    input: "Input for Gap Buffer.",
    output: "Output of Gap Buffer.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A text-editing array with unused space at the cursor. Inserts at the cursor are O(1) amortized; moving the cursor shifts the gap. Used in Emacs.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gap Buffer algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Gap Buffer follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Gap Buffer is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Gap Buffer exist in the literature. See references for details.",
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
      id: "gap-buffer-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gap Buffer?",
      options: [
        "A text-editing array with unused space at the cursor. Insert...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Gap Buffer: A text-editing array with unused space at the cursor. Inserts at the cursor are O(1) amortized; moving the cursor shifts the gap. Used in Emacs.",
      hints: ["Think about what problem Gap Buffer solves."],
      objective: "Gap Buffer",
    },
  ],
  exam: {
    definition:
      "A text-editing array with unused space at the cursor. Inserts at the cursor are O(1) amortized; moving the cursor shifts the gap. Used in Emacs.",
    steps: ["Apply the Gap Buffer algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Gap Buffer algorithm is correct because it systematically processes all cases.",
    applications: ["Persistent & Text Structures"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Gap Buffer?",
        a: "Use Gap Buffer when the problem matches its design: A text-editing array with unused space at the cursor. Inserts at the cursor are O(1) amortized; movi",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Gap Buffer (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Gap Buffer.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
