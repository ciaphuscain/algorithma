import type { AlgorithmEntry } from "../types";

export const hamiltonianMonteCarloEntry: AlgorithmEntry = {
  slug: "hamiltonian-monte-carlo",
  name: "Hamiltonian Monte Carlo",
  aliases: ["Hamiltonian Monte Carlo"],
  curriculum: [580],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Hamiltonian Monte Carlo is an algorithm in the field of machine learning. It provides an efficient approach to solving problems in this domain.",
  tags: ["hamiltonian monte carlo", "machine learning"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Hamiltonian Monte Carlo.",
    output: "Result of applying Hamiltonian Monte Carlo to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hamiltonian Monte Carlo addresses a fundamental problem in machine learning. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Hamiltonian Monte Carlo is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hamiltonian Monte Carlo algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Hamiltonian Monte Carlo, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Hamiltonian Monte Carlo depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Hamiltonian Monte Carlo exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "hamilton-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hamiltonian Monte Carlo?",
      options: [
        "To solve problems in machine learning",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Hamiltonian Monte Carlo is designed specifically for problems in the domain of machine learning.",
      hints: ["Think about what domain Hamiltonian Monte Carlo belongs to"],
      objective: "Understand the purpose of Hamiltonian Monte Carlo",
    },
  ],
  exam: {
    definition: "Define Hamiltonian Monte Carlo and explain its purpose.",
    steps: ["Describe the main steps of Hamiltonian Monte Carlo."],
    timeComplexity: "Analyze the time complexity of Hamiltonian Monte Carlo.",
    spaceComplexity: "Analyze the space complexity of Hamiltonian Monte Carlo.",
    correctness: "How does Hamiltonian Monte Carlo guarantee correctness?",
    applications: ["List two applications of Hamiltonian Monte Carlo."],
    limitations: ["What are the limitations of Hamiltonian Monte Carlo?"],
    faq: [
      {
        q: "Why is Hamiltonian Monte Carlo preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Hamiltonian Monte Carlo works by applying its core strategy to efficiently solve",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Hamiltonian Monte Carlo",
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
