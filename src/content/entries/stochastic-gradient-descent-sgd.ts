import type { AlgorithmEntry } from "../types";

export const stochasticGradientDescentSgdEntry: AlgorithmEntry = {
  slug: "stochastic-gradient-descent-sgd",
  name: "Stochastic Gradient Descent (SGD)",
  aliases: ["Stochastic Gradient Descent (SGD)"],
  curriculum: [497],
  domain: "machine-learning",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary:
    "Optimizes a loss function by updating parameters in the direction of the negative gradient computed on a single sample or mini-batch at each step.",
  tags: ["sgd", "gradient descent", "optimization", "machine learning"],
  prerequisites: ["Gradient Descent"],
  related: ["adam-optimizer", "backpropagation"],
  problem: {
    input: "A differentiable loss function L(w) over parameters w and a dataset of samples.",
    output: "Updated parameters w that (approximately) minimize the loss.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Full gradient descent computes the gradient over all samples — expensive for large datasets. SGD approximates the gradient using one sample (or a mini-batch), trading accuracy for speed. The noise from random sampling also helps escape local minima.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize weights w randomly.",
          "For each epoch, shuffle the data.",
          "For each sample (x, y): compute gradient g = ∇L(w; x, y).",
          "Update w ← w − η · g where η is the learning rate.",
          "Repeat until convergence or max epochs.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Learning rate η is critical: too large causes divergence, too small converges slowly. Learning rate schedules (decay, warm-up) help. Mini-batch SGD uses a small batch of samples for more stable gradient estimates.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Convergence.** For convex L with Lipschitz gradients and decaying learning rate $\\eta_t = O(1/t)$, SGD converges at rate $O(1/\\sqrt{T})$ after T steps. The variance of the stochastic gradient adds noise but the expected direction is correct: $E[\\nabla L(w; x_i)] = \\nabla L(w)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Momentum** adds a fraction of the previous update to smooth oscillations.",
          "**Adam** adapts learning rates per parameter using first and second moment estimates.",
          "**Mini-batch SGD** is the standard in deep learning (batch sizes 32–512).",
          "SGD with momentum is often preferred over Adam for final model quality in some settings.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(d)",
      average: "O(n * d)",
      worst: "O(n * d)",
    },
    space: "O(d)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Type",
      value: "First-order optimization",
    },
    {
      label: "Stochastic",
      value: "Yes, samples gradient from one example",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "sgd",
      code: `def sgd(X, y, lr=0.01, epochs=100):
    """Linear regression via SGD. X: list of feature vectors, y: targets. Returns weights."""
    n = len(X)
    d = len(X[0])
    w = [0.0] * d
    for _ in range(epochs):
        for i in range(n):
            pred = sum(w[j] * X[i][j] for j in range(d))
            err = pred - y[i]
            for j in range(d):
                w[j] -= lr * err * X[i][j]
    return [round(wi, 4) for wi in w]
`,
      tests: [
        {
          args: [
            [
              [1, 0],
              [0, 1],
              [1, 1],
            ],
            [2, 3, 5],
            0.1,
            200,
          ],
          expected: [2.0, 3.0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "sgd",
      code: `function sgd(X, y, lr = 0.01, epochs = 100) {
  const n = X.length, d = X[0].length;
  const w = new Array(d).fill(0);
  for (let e = 0; e < epochs; e++) {
    for (let i = 0; i < n; i++) {
      let pred = 0;
      for (let j = 0; j < d; j++) pred += w[j] * X[i][j];
      const err = pred - y[i];
      for (let j = 0; j < d; j++) w[j] -= lr * err * X[i][j];
    }
  }
  return w.map(v => Math.round(v * 10000) / 10000);
}
`,
      tests: [
        {
          args: [
            [
              [1, 0],
              [0, 1],
              [1, 1],
            ],
            [2, 3, 5],
            0.1,
            200,
          ],
          expected: [2.0, 3.0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "stochastic-gradient-descent-sgd-q1",
      kind: "mcq",
      prompt: "What is the main advantage of SGD over batch gradient descent?",
      options: [
        "It updates after each sample, making it faster per iteration on large datasets",
        "It always finds the global minimum",
        "It uses less memory for the model",
        "It doesn't need a learning rate",
      ],
      answer: 0,
      explanation:
        "SGD computes the gradient on one sample, so each update is O(d) instead of O(nd), making it much faster per step on large datasets.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "SGD minimizes a loss function by updating parameters using gradients computed on individual samples.",
    steps: [
      "Initialize weights.",
      "For each sample, compute gradient.",
      "Update weights: w ← w - η·∇L.",
      "Repeat for multiple epochs.",
    ],
    timeComplexity: "$O(n \\cdot d \\cdot T)$ for T epochs.",
    spaceComplexity: "$O(d)$ for the weight vector.",
    correctness:
      "The expected stochastic gradient equals the true gradient, so SGD converges to a (local) minimum under standard conditions.",
    applications: [
      "deep learning training",
      "linear regression",
      "logistic regression",
      "online learning",
    ],
    limitations: ["May oscillate near the minimum", "Sensitive to learning rate choice"],
    faq: [
      {
        q: "When should you use Stochastic Gradient Descent (SGD)?",
        a: "Optimizes a loss function by updating parameters in the direction of the negative gradient computed on a single sample or mini-batch at each step.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Stochastic Gradient Descent (SGD) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Stochastic Gradient Descent (SGD).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
