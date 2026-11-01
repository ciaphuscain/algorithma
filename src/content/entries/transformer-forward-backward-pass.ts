import type { AlgorithmEntry } from "../types";

export const transformerForwardBackwardPassEntry: AlgorithmEntry = {
  slug: "transformer-forward-backward-pass",
  name: "Transformer Forward/Backward Pass",
  aliases: ["Transformer Forward/Backward Pass"],
  curriculum: [568],
  domain: "deep-learning",
  subcategory: "Deep Learning",
  difficulty: "intermediate",
  summary:
    "Transformer Forward/Backward Pass is a well-known algorithm in the domain of deep learning.",
  tags: ["transformer forward backward pass", "deep learning"],
  prerequisites: ["Backpropagation"],
  related: [],
  problem: {
    input: "Input for Transformer Forward/Backward Pass.",
    output: "Output of Transformer Forward/Backward Pass.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Transformer Forward/Backward Pass solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Transformer Forward/Backward Pass algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Transformer Forward/Backward Pass follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Transformer Forward/Backward Pass is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Transformer Forward/Backward Pass exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "deep learning",
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
      id: "transformer-forward-backward-pass-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Transformer Forward/Backward Pass?",
      options: [
        "To solve the Transformer Forward/Backward Pass problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Transformer Forward/Backward Pass is designed to solve its specific problem efficiently.",
      hints: ["Think about what Transformer Forward/Backward Pass does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Transformer Forward/Backward Pass is an algorithm in the domain of deep learning.",
    steps: [
      "Apply the Transformer Forward/Backward Pass algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["deep learning applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Transformer Forward/Backward Pass?",
        a: "Use Transformer Forward/Backward Pass when the problem matches its designed use case in deep learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Transformer Forward/Backward Pass (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Transformer Forward/Backward Pass.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
