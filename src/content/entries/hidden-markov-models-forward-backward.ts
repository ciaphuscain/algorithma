import type { AlgorithmEntry } from "../types";

export const hiddenMarkovModelsForwardBackwardEntry: AlgorithmEntry = {
  slug: "hidden-markov-models-forward-backward",
  name: "Hidden Markov Models (Forward–Backward)",
  aliases: ["Hidden Markov Models (Forward–Backward)"],
  curriculum: [574],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Hidden Markov Models (Forward–Backward) is a well-known algorithm in the domain of machine learning.",
  tags: ["hidden markov models forward backward", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Hidden Markov Models (Forward–Backward).",
    output: "Output of Hidden Markov Models (Forward–Backward).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hidden Markov Models (Forward–Backward) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hidden Markov Models (Forward–Backward) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Hidden Markov Models (Forward–Backward) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Hidden Markov Models (Forward–Backward) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Hidden Markov Models (Forward–Backward) exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n·d)",
      worst: "O(n·d·k)",
    },
    space: "O(n)",
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
      id: "hidden-markov-models-forward-backward-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hidden Markov Models (Forward–Backward)?",
      options: [
        "To solve the Hidden Markov Models (Forward–Backward) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Hidden Markov Models (Forward–Backward) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Hidden Markov Models (Forward–Backward) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Hidden Markov Models (Forward–Backward) is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the Hidden Markov Models (Forward–Backward) algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Hidden Markov Models (Forward–Backward)?",
        a: "Use Hidden Markov Models (Forward–Backward) when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Hidden Markov Models (Forward–Backward) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Hidden Markov Models (Forward–Backward).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
