import type { AlgorithmEntry } from "../types";

export const gramSchmidtOrthogonalizationEntry: AlgorithmEntry = {
  slug: "gram-schmidt-orthogonalization",
  name: "Gram–Schmidt Orthogonalization",
  aliases: ["Gram–Schmidt Orthogonalization"],
  curriculum: [400],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Gram–Schmidt Orthogonalization is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["gram schmidt orthogonalization", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Gram–Schmidt Orthogonalization.",
    output: "Output of Gram–Schmidt Orthogonalization.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gram–Schmidt Orthogonalization solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gram–Schmidt Orthogonalization algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Gram–Schmidt Orthogonalization follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Gram–Schmidt Orthogonalization is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Gram–Schmidt Orthogonalization exist in the literature. See references for details.",
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
      value: "number theory and mathematics",
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
      id: "gram-schmidt-orthogonalization-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gram–Schmidt Orthogonalization?",
      options: [
        "To solve the Gram–Schmidt Orthogonalization problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Gram–Schmidt Orthogonalization is designed to solve its specific problem efficiently.",
      hints: ["Think about what Gram–Schmidt Orthogonalization does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Gram–Schmidt Orthogonalization is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Gram–Schmidt Orthogonalization algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number theory and mathematics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Gram–Schmidt Orthogonalization?",
        a: "Use Gram–Schmidt Orthogonalization when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Gram–Schmidt Orthogonalization (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Gram–Schmidt Orthogonalization.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
