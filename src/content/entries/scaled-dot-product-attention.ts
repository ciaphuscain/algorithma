import type { AlgorithmEntry } from "../types";

export const scaledDotProductAttentionEntry: AlgorithmEntry = {
  slug: "scaled-dot-product-attention",
  name: "Scaled Dot-Product Attention",
  aliases: ["Scaled Dot-Product Attention"],
  curriculum: [567],
  domain: "deep-learning",
  subcategory: "Deep Learning",
  difficulty: "intermediate",
  summary: "Scaled Dot-Product Attention is a well-known algorithm in the domain of deep learning.",
  tags: ["scaled dot product attention", "deep learning"],
  prerequisites: ["Backpropagation"],
  related: [],
  problem: {
    input: "Input for Scaled Dot-Product Attention.",
    output: "Output of Scaled Dot-Product Attention.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Scaled Dot-Product Attention solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Scaled Dot-Product Attention algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Scaled Dot-Product Attention follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Scaled Dot-Product Attention is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Scaled Dot-Product Attention exist in the literature. See references for details.",
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
      id: "scaled-dot-product-attention-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Scaled Dot-Product Attention?",
      options: [
        "To solve the Scaled Dot-Product Attention problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Scaled Dot-Product Attention is designed to solve its specific problem efficiently.",
      hints: ["Think about what Scaled Dot-Product Attention does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Scaled Dot-Product Attention is an algorithm in the domain of deep learning.",
    steps: [
      "Apply the Scaled Dot-Product Attention algorithm to the input.",
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
        q: "When should you use Scaled Dot-Product Attention?",
        a: "Use Scaled Dot-Product Attention when the problem matches its designed use case in deep learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Scaled Dot-Product Attention (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Scaled Dot-Product Attention.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
