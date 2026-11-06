import type { AlgorithmEntry } from "../types";

export const backpropagationEntry: AlgorithmEntry = {
  slug: "backpropagation",
  name: "Backpropagation",
  aliases: ["Backpropagation"],
  curriculum: [498],
  domain: "machine-learning",
  subcategory: "Neural Networks",
  difficulty: "intermediate",
  summary:
    "Computes gradients of a neural network's loss with respect to each weight by applying the chain rule layer by layer from output to input.",
  tags: ["backprop", "neural network", "gradient", "chain rule", "machine learning"],
  prerequisites: ["SGD", "Gradient Descent"],
  related: ["stochastic-gradient-descent-sgd", "adam-optimizer"],
  problem: {
    input:
      "A neural network with weights, an input, a target output, and a differentiable loss function.",
    output: "The gradient of the loss with respect to every weight in the network.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To train a neural network, we need to know how each weight affects the loss. Backpropagation efficiently computes all these gradients in one backward pass by applying the chain rule: the gradient at each layer depends on the gradient from the layer above, multiplied by the local derivative.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Forward pass: compute the output of each layer from input to output.",
          "Compute the loss between the network output and the target.",
          "Backward pass: compute ∂loss/∂output.",
          "For each layer from output to input: compute the gradient of the loss with respect to that layer's weights and inputs using the chain rule.",
          "Use the gradients to update weights (e.g., via SGD).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Store activations during the forward pass for use in the backward pass. For a layer y = f(Wx + b), the weight gradient is ∂L/∂W = (∂L/∂y · f'(Wx+b)) · xᵀ. ReLU derivative is 1 if x > 0, else 0.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "For a network with L layers, backprop computes all gradients in $O(\\text{forward pass cost})$. This is because each layer's backward pass does the same number of operations as its forward pass (matrix multiply + elementwise activation derivative). Total: $O(\\sum_l n_{l-1} \\cdot n_l)$ where $n_l$ is the width of layer $l$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Vanishing/exploding gradients** occur in deep networks; solved by ReLU, batch normalization, residual connections.",
          "**Automatic differentiation** (autograd) generalizes backprop to arbitrary computation graphs.",
          "Backprop through time (BPTT) applies the same idea to recurrent networks.",
          "The algorithm was popularized by Rumelhart, Hinton & Williams (1986).",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(W)",
      average: "O(W)",
      worst: "O(W)",
    },
    space: "O(W + A)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Core idea",
      value: "Chain rule applied layer by layer",
    },
    {
      label: "Memory",
      value: "Must store all activations from forward pass",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "backprop",
      code: `def backprop(X, y, hidden=2, lr=0.1, epochs=500):
    """Train a 1-hidden-layer network on 1D input/output. Returns final predictions (rounded)."""
    import math, random
    random.seed(42)
    n = len(X)
    # Weights: input->hidden (hidden weights), hidden->output (hidden weights)
    w1 = [random.uniform(-1, 1) for _ in range(hidden)]
    b1 = [0.0] * hidden
    w2 = [random.uniform(-1, 1) for _ in range(hidden)]
    b2 = 0.0
    def sigmoid(x):
        return 1 / (1 + math.exp(-max(-500, min(500, x))))
    for _ in range(epochs):
        for i in range(n):
            # Forward
            h = [sigmoid(w1[j] * X[i] + b1[j]) for j in range(hidden)]
            out = sum(w2[j] * h[j] for j in range(hidden)) + b2
            # Backward
            dout = 2 * (out - y[i])
            for j in range(hidden):
                dw2 = dout * h[j]
                dh = dout * w2[j] * h[j] * (1 - h[j])
                w2[j] -= lr * dw2
                w1[j] -= lr * dh * X[i]
                b1[j] -= lr * dh
            b2 -= lr * dout
    preds = []
    for i in range(n):
        h = [sigmoid(w1[j] * X[i] + b1[j]) for j in range(hidden)]
        preds.append(round(sum(w2[j] * h[j] for j in range(hidden)) + b2, 1))
    return preds
`,
      tests: [
        {
          args: [[0, 1, 2, 3], [0, 2, 4, 6], 4, 0.05, 1000],
          expected: [0.0, 1.9, 4.0, 6.0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "backprop",
      code: `function backprop(X, y, hidden = 2, lr = 0.1, epochs = 500) {
  function sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }
  // seed-like init
  let w1 = [], b1 = [], w2 = [], b2 = 0;
  for (let j = 0; j < hidden; j++) {
    w1.push(((j * 1337 + 7) % 100) / 100 - 0.5);
    b1.push(0);
    w2.push(((j * 2671 + 13) % 100) / 100 - 0.5);
  }
  const n = X.length;
  for (let e = 0; e < epochs; e++) {
    for (let i = 0; i < n; i++) {
      const h = w1.map((wj, j) => sigmoid(wj * X[i] + b1[j]));
      const out = h.reduce((s, hj, j) => s + w2[j] * hj, 0) + b2;
      const dout = 2 * (out - y[i]);
      for (let j = 0; j < hidden; j++) {
        const dw2 = dout * h[j];
        const dh = dout * w2[j] * h[j] * (1 - h[j]);
        w2[j] -= lr * dw2;
        w1[j] -= lr * dh * X[i];
        b1[j] -= lr * dh;
      }
      b2 -= lr * dout;
    }
  }
  return X.map(xi => {
    const h = w1.map((wj, j) => sigmoid(wj * xi + b1[j]));
    return Math.round((h.reduce((s, hj, j) => s + w2[j] * hj, 0) + b2) * 10) / 10;
  });
}
`,
      tests: [
        {
          args: [[0, 1, 2, 3], [0, 2, 4, 6], 4, 0.05, 1000],
          expected: [0.0, 1.9, 4.0, 6.0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "backpropagation-q1",
      kind: "mcq",
      prompt: "What does backpropagation compute?",
      options: [
        "The gradient of the loss with respect to every weight in the network",
        "The optimal weights directly",
        "The forward pass output",
        "The network architecture",
      ],
      answer: 0,
      explanation:
        "Backpropagation uses the chain rule to efficiently compute how much each weight contributes to the loss.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Backpropagation computes gradients of a loss function with respect to neural network weights using the chain rule.",
    steps: [
      "Forward pass: compute all layer outputs.",
      "Compute loss.",
      "Backward pass: apply chain rule layer by layer.",
      "Return all weight gradients.",
    ],
    timeComplexity: "$O(W)$ where W is the total number of weights.",
    spaceComplexity: "$O(W + A)$ where A is total activations stored.",
    correctness: "By the chain rule, the computed gradients are exact for the given input.",
    applications: ["neural network training", "deep learning", "automatic differentiation"],
    limitations: [
      "Requires differentiable activation functions",
      "Vanishing/exploding gradients in deep networks",
    ],
    faq: [
      {
        q: "When should you use Backpropagation?",
        a: "Computes gradients of a neural network's loss with respect to each weight by applying the chain rule layer by layer from output to input.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Backpropagation (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Backpropagation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
