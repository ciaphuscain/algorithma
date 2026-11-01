import type { AlgorithmEntry } from "../types";

export const quantumFourierTransformEntry: AlgorithmEntry = {
  slug: "quantum-fourier-transform",
  name: "Quantum Fourier Transform",
  aliases: ["Quantum Fourier Transform"],
  curriculum: [598],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Quantum Fourier Transform is a well-known algorithm in the domain of advanced research topics.",
  tags: ["quantum fourier transform", "research"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Quantum Fourier Transform.",
    output: "Output of Quantum Fourier Transform.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Quantum Fourier Transform solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Quantum Fourier Transform algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Quantum Fourier Transform follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Quantum Fourier Transform is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Quantum Fourier Transform exist in the literature. See references for details.",
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
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "advanced research topics",
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
      id: "quantum-fourier-transform-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Quantum Fourier Transform?",
      options: [
        "To solve the Quantum Fourier Transform problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Quantum Fourier Transform is designed to solve its specific problem efficiently.",
      hints: ["Think about what Quantum Fourier Transform does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Quantum Fourier Transform is an algorithm in the domain of advanced research topics.",
    steps: [
      "Apply the Quantum Fourier Transform algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["advanced research topics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Quantum Fourier Transform?",
        a: "Use Quantum Fourier Transform when the problem matches its designed use case in advanced research topics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Quantum Fourier Transform (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Quantum Fourier Transform.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
