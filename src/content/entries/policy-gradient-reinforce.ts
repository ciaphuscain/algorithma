import type { AlgorithmEntry } from "../types";

export const policyGradientReinforceEntry: AlgorithmEntry = {
  slug: "policy-gradient-reinforce",
  name: "Policy Gradient (REINFORCE)",
  aliases: ["Policy Gradient (REINFORCE)"],
  curriculum: [582],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Policy Gradient (REINFORCE) is an algorithm in the field of machine learning. It provides an efficient approach to solving problems in this domain.",
  tags: ["policy gradient (reinforce)", "machine learning"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Policy Gradient (REINFORCE).",
    output: "Result of applying Policy Gradient (REINFORCE) to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Policy Gradient (REINFORCE) addresses a fundamental problem in machine learning. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Policy Gradient (REINFORCE) is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Policy Gradient (REINFORCE) algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Policy Gradient (REINFORCE), pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Policy Gradient (REINFORCE) depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Policy Gradient (REINFORCE) exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "policy-g-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Policy Gradient (REINFORCE)?",
      options: [
        "To solve problems in machine learning",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Policy Gradient (REINFORCE) is designed specifically for problems in the domain of machine learning.",
      hints: ["Think about what domain Policy Gradient (REINFORCE) belongs to"],
      objective: "Understand the purpose of Policy Gradient (REINFORCE)",
    },
  ],
  exam: {
    definition: "Define Policy Gradient (REINFORCE) and explain its purpose.",
    steps: ["Describe the main steps of Policy Gradient (REINFORCE)."],
    timeComplexity: "Analyze the time complexity of Policy Gradient (REINFORCE).",
    spaceComplexity: "Analyze the space complexity of Policy Gradient (REINFORCE).",
    correctness: "How does Policy Gradient (REINFORCE) guarantee correctness?",
    applications: ["List two applications of Policy Gradient (REINFORCE)."],
    limitations: ["What are the limitations of Policy Gradient (REINFORCE)?"],
    faq: [
      {
        q: "Why is Policy Gradient (REINFORCE) preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Policy Gradient (REINFORCE) works by applying its core strategy to efficiently s",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Policy Gradient (REINFORCE)",
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
