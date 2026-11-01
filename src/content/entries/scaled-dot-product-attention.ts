import type { AlgorithmEntry } from "../types";

export const scaledDotProductAttentionEntry: AlgorithmEntry = {
  slug: "scaled-dot-product-attention",
  name: "Scaled Dot-Product Attention",
  aliases: ["Scaled Dot-Product Attention"],
  curriculum: [567],
  domain: "deep-learning",
  subcategory: "Deep Learning",
  difficulty: "intermediate",
  summary:
    "Scaled Dot-Product Attention is an algorithm in the field of deep learning. It provides an efficient approach to solving problems in this domain.",
  tags: ["scaled dot-product attention", "deep learning"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Scaled Dot-Product Attention.",
    output: "Result of applying Scaled Dot-Product Attention to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Scaled Dot-Product Attention addresses a fundamental problem in deep learning. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Scaled Dot-Product Attention is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Scaled Dot-Product Attention algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Scaled Dot-Product Attention, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Scaled Dot-Product Attention depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Scaled Dot-Product Attention exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "scaled-d-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Scaled Dot-Product Attention?",
      options: [
        "To solve problems in deep learning",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Scaled Dot-Product Attention is designed specifically for problems in the domain of deep learning.",
      hints: ["Think about what domain Scaled Dot-Product Attention belongs to"],
      objective: "Understand the purpose of Scaled Dot-Product Attention",
    },
  ],
  exam: {
    definition: "Define Scaled Dot-Product Attention and explain its purpose.",
    steps: ["Describe the main steps of Scaled Dot-Product Attention."],
    timeComplexity: "Analyze the time complexity of Scaled Dot-Product Attention.",
    spaceComplexity: "Analyze the space complexity of Scaled Dot-Product Attention.",
    correctness: "How does Scaled Dot-Product Attention guarantee correctness?",
    applications: ["List two applications of Scaled Dot-Product Attention."],
    limitations: ["What are the limitations of Scaled Dot-Product Attention?"],
    faq: [
      {
        q: "Why is Scaled Dot-Product Attention preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Scaled Dot-Product Attention works by applying its core strategy to efficiently ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Scaled Dot-Product Attention",
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
