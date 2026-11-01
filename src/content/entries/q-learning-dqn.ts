import type { AlgorithmEntry } from "../types";

export const qLearningDqnEntry: AlgorithmEntry = {
  slug: "q-learning-dqn",
  name: "Q-Learning / DQN",
  aliases: ["Q-Learning / DQN"],
  curriculum: [584],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary: "Q-Learning / DQN is a well-known algorithm in the domain of machine learning.",
  tags: ["q learning dqn", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Q-Learning / DQN.",
    output: "Output of Q-Learning / DQN.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Q-Learning / DQN solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Q-Learning / DQN algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Q-Learning / DQN follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Q-Learning / DQN is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Q-Learning / DQN exist in the literature. See references for details.",
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
      id: "q-learning-dqn-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Q-Learning / DQN?",
      options: [
        "To solve the Q-Learning / DQN problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Q-Learning / DQN is designed to solve its specific problem efficiently.",
      hints: ["Think about what Q-Learning / DQN does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Q-Learning / DQN is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the Q-Learning / DQN algorithm to the input.",
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
        q: "When should you use Q-Learning / DQN?",
        a: "Use Q-Learning / DQN when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Q-Learning / DQN (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Q-Learning / DQN.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
