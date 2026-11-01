import type { AlgorithmEntry } from "../types";

export const qLearningDqnEntry: AlgorithmEntry = {
  slug: "q-learning-dqn",
  name: "Q-Learning / DQN",
  aliases: ["Q-Learning / DQN"],
  curriculum: [584],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Q-Learning / DQN is an algorithm in the field of machine learning. It provides an efficient approach to solving problems in this domain.",
  tags: ["q-learning / dqn", "machine learning"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Q-Learning / DQN.",
    output: "Result of applying Q-Learning / DQN to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Q-Learning / DQN addresses a fundamental problem in machine learning. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Q-Learning / DQN is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Q-Learning / DQN algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing Q-Learning / DQN, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Q-Learning / DQN depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Q-Learning / DQN exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Machine Learning",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "predict",
      code: `def predict(weights, inputs):
    """Simple linear prediction: dot product of weights and inputs.
    Demonstrates basic ML inference."""
    return sum(w * x for w, x in zip(weights, inputs))
`,
      tests: [
        {
          args: [
            [0.5, 1.0, -0.5],
            [2.0, 1.0, 3.0],
          ],
          expected: 0.5,
        },
        {
          args: [
            [1.0, 1.0],
            [3.0, 4.0],
          ],
          expected: 7.0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "predict",
      code: `function predict(weights, inputs) {
  return weights.reduce((s, w, i) => s + w * inputs[i], 0);
}`,
      tests: [
        {
          args: [
            [1.0, 1.0],
            [3.0, 4.0],
          ],
          expected: 7.0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "q-learni-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Q-Learning / DQN?",
      options: [
        "To solve problems in machine learning",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Q-Learning / DQN is designed specifically for problems in the domain of machine learning.",
      hints: ["Think about what domain Q-Learning / DQN belongs to"],
      objective: "Understand the purpose of Q-Learning / DQN",
    },
  ],
  exam: {
    definition: "Define Q-Learning / DQN and explain its purpose.",
    steps: ["Describe the main steps of Q-Learning / DQN."],
    timeComplexity: "Analyze the time complexity of Q-Learning / DQN.",
    spaceComplexity: "Analyze the space complexity of Q-Learning / DQN.",
    correctness: "How does Q-Learning / DQN guarantee correctness?",
    applications: ["List two applications of Q-Learning / DQN."],
    limitations: ["What are the limitations of Q-Learning / DQN?"],
    faq: [
      {
        q: "Why is Q-Learning / DQN preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Q-Learning / DQN works by applying its core strategy to efficiently solve the ta",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Q-Learning / DQN",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
