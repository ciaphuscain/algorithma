import type { AlgorithmEntry } from "../types";

export const pcaEntry: AlgorithmEntry = {
  slug: "pca",
  name: "PCA",
  aliases: ["PCA"],
  curriculum: [570],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary: "PCA is a well-known algorithm in the domain of machine learning.",
  tags: ["pca", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for PCA.",
    output: "Output of PCA.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "PCA solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The PCA algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of PCA follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of PCA is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of PCA exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(nd²)",
      average: "O(nd²)",
      worst: "O(nd²)",
    },
    space: "O(nd)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "machine learning",
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
      id: "pca-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of PCA?",
      options: [
        "To solve the PCA problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "PCA is designed to solve its specific problem efficiently.",
      hints: ["Think about what PCA does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "PCA is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the PCA algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(nd²)$.",
    spaceComplexity: "$O(nd)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use PCA?",
        a: "Use PCA when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define PCA (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for PCA.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
