import type { AlgorithmEntry } from "../types";

export const transformerForwardBackwardPassEntry: AlgorithmEntry = {
  slug: "transformer-forward-backward-pass",
  name: "Transformer Forward/Backward Pass",
  aliases: ["Transformer Forward/Backward Pass"],
  curriculum: [568],
  domain: "deep-learning",
  subcategory: "Deep Learning",
  difficulty: "intermediate",
  summary:
    "Transformer Forward/Backward Pass is an algorithm in the field of deep learning. It provides an efficient approach to solving problems in this domain.",
  tags: ["transformer forward/backward pass", "deep learning"],
  prerequisites: [],
  related: ["scaled-dot-product-attention", "flashattention"],
  problem: {
    input: "Input data for Transformer Forward/Backward Pass.",
    output: "Result of applying Transformer Forward/Backward Pass to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Transformer Forward/Backward Pass addresses a fundamental problem in deep learning. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Transformer Forward/Backward Pass is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Transformer Forward/Backward Pass algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Transformer Forward/Backward Pass, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Transformer Forward/Backward Pass depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Transformer Forward/Backward Pass exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n * m)",
      average: "O(n * m)",
      worst: "O(n * m)",
    },
    space: "O(m)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Category",
      value: "Deep Learning",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "forward",
      code: `def forward(inputs, weights, biases):
    """Simple dense layer forward pass: output = inputs * weights + biases.
    inputs: list of floats, weights: list of lists, biases: list of floats."""
    outputs = []
    for j in range(len(biases)):
        val = biases[j]
        for i in range(len(inputs)):
            val += inputs[i] * weights[i][j]
        outputs.append(round(val, 6))
    return outputs
`,
      tests: [
        {
          args: [
            [1.0, 2.0],
            [
              [0.5, -0.5],
              [1.0, 0.5],
            ],
            [0.1, -0.1],
          ],
          expected: [2.6, 0.4],
        },
      ],
    },
    {
      language: "javascript",
      entry: "forward",
      code: `function forward(inputs, weights, biases) {
  return biases.map((b, j) => {
    let val = b;
    for (let i = 0; i < inputs.length; i++) val += inputs[i] * weights[i][j];
    return Math.round(val * 1e6) / 1e6;
  });
}`,
      tests: [
        {
          args: [
            [1.0, 2.0],
            [
              [0.5, -0.5],
              [1.0, 0.5],
            ],
            [0.1, -0.1],
          ],
          expected: [2.6, 0.4],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "transfor-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Transformer Forward/Backward Pass?",
      options: [
        "To solve problems in deep learning",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Transformer Forward/Backward Pass is designed specifically for problems in the domain of deep learning.",
      hints: ["Think about what domain Transformer Forward/Backward Pass belongs to"],
      objective: "Understand the purpose of Transformer Forward/Backward Pass",
    },
  ],
  exam: {
    definition: "Define Transformer Forward/Backward Pass and explain its purpose.",
    steps: ["Describe the main steps of Transformer Forward/Backward Pass."],
    timeComplexity: "Analyze the time complexity of Transformer Forward/Backward Pass.",
    spaceComplexity: "Analyze the space complexity of Transformer Forward/Backward Pass.",
    correctness: "How does Transformer Forward/Backward Pass guarantee correctness?",
    applications: ["List two applications of Transformer Forward/Backward Pass."],
    limitations: ["What are the limitations of Transformer Forward/Backward Pass?"],
    faq: [
      {
        q: "Why is Transformer Forward/Backward Pass preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Transformer Forward/Backward Pass works by applying its core strategy to efficie",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Transformer Forward/Backward Pass",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
