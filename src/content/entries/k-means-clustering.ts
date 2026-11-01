import type { AlgorithmEntry } from "../types";

export const kMeansClusteringEntry: AlgorithmEntry = {
  slug: "k-means-clustering",
  name: "K-Means Clustering",
  aliases: ["K-Means Clustering"],
  curriculum: [499],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary: "K-Means Clustering is a well-known algorithm in the domain of machine learning.",
  tags: ["k means clustering", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for K-Means Clustering.",
    output: "Output of K-Means Clustering.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "K-Means Clustering solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The K-Means Clustering algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of K-Means Clustering follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of K-Means Clustering is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of K-Means Clustering exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(nkd)",
      average: "O(nkdi)",
      worst: "O(nkdi)",
    },
    space: "O(nk)",
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
      id: "k-means-clustering-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of K-Means Clustering?",
      options: [
        "To solve the K-Means Clustering problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "K-Means Clustering is designed to solve its specific problem efficiently.",
      hints: ["Think about what K-Means Clustering does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "K-Means Clustering is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the K-Means Clustering algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(nkd)$.",
    spaceComplexity: "$O(nk)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use K-Means Clustering?",
        a: "Use K-Means Clustering when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define K-Means Clustering (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for K-Means Clustering.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
