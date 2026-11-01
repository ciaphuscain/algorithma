import type { AlgorithmEntry } from "../types";

export const adamOptimizerEntry: AlgorithmEntry = {
  slug: "adam-optimizer",
  name: "Adam Optimizer",
  aliases: ["Adaptive Moment Estimation"],
  curriculum: [566],
  domain: "deep-learning",
  subcategory: "Deep Learning",
  difficulty: "intermediate",
  summary:
    "An adaptive learning rate optimizer combining momentum (first moment) and RMSProp (second moment) with bias correction, widely used for training neural networks.",
  tags: ["optimizer", "gradient descent", "deep learning", "adaptive learning rate"],
  prerequisites: ["Gradient Descent", "Backpropagation"],
  related: ["gradient-descent", "backpropagation"],
  problem: {
    input:
      "A differentiable loss function, initial parameters, learning rate, and decay rates beta1 and beta2.",
    output: "Updated parameters that minimize the loss function.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gradient descent with a fixed learning rate can be too fast in some directions and too slow in others. Adam adapts the learning rate per parameter: it maintains a running average of gradients (momentum) and of squared gradients (like RMSProp), then divides the momentum by the root of the squared gradient average to normalize the step.",
      },
      {
        kind: "p",
        text: "Bias correction compensates for the fact that the running averages start at zero: without it, early steps would be too small because the averages haven't warmed up yet.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize m = 0 (first moment), v = 0 (second moment), t = 0.",
          "Each step: t += 1, compute gradient g.",
          "m = beta1 * m + (1 - beta1) * g (momentum update).",
          "v = beta2 * v + (1 - beta2) * g^2 (squared gradient update).",
          "m_hat = m / (1 - beta1^t), v_hat = v / (1 - beta2^t) (bias correction).",
          "theta = theta - lr * m_hat / (sqrt(v_hat) + epsilon).",
        ],
      },
      {
        kind: "p",
        text: "**Typical defaults**: lr = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store m and v arrays the same shape as the parameters.",
          "epsilon prevents division by zero when gradients are very small.",
          "Weight decay (AdamW) decouples L2 regularization from the adaptive step.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Bias correction**: E[m_t] = (1 - beta1^t) * E[g], so dividing by (1 - beta1^t) gives an unbiased estimate. Similarly for v.",
      },
      {
        kind: "p",
        text: "**Convergence**: Adam converges at O(1/sqrt(T)) for convex problems under standard assumptions. For non-convex objectives, it finds stationary points.",
      },
      {
        kind: "p",
        text: "**Per-step cost**: O(n) where n is the number of parameters, same as SGD.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "AdamW fixes the weight decay interaction by decoupling it from the gradient normalization.",
          "AMSGrad guarantees convergence by using the maximum of past v values.",
          "LAMB (Layer-wise Adaptive Moments) scales Adam for large-batch distributed training.",
        ],
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
    worstClass: "n",
    note: "O(n) per step for n parameters; stores 2n extra values (m and v).",
  },
  properties: [
    {
      label: "Adaptive",
      value: "Per-parameter learning rate",
    },
    {
      label: "Memory",
      value: "2x parameter count (m and v)",
    },
    {
      label: "Default lr",
      value: "0.001",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "adam_step",
      code: `def adam_step(params, grads, m, v, t, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
    """One Adam update step. Returns (new_params, new_m, new_v)."""
    new_params = []
    new_m = []
    new_v = []
    for p, g, mi, vi in zip(params, grads, m, v):
        mi2 = beta1 * mi + (1 - beta1) * g
        vi2 = beta2 * vi + (1 - beta2) * g * g
        m_hat = mi2 / (1 - beta1 ** t)
        v_hat = vi2 / (1 - beta2 ** t)
        p2 = p - lr * m_hat / (v_hat ** 0.5 + eps)
        new_params.append(round(p2, 6))
        new_m.append(mi2)
        new_v.append(vi2)
    return new_params
`,
      tests: [
        {
          args: [[0.5], [0.1], [0.0], [0.0], 1],
          expected: [0.499],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "adam-moments",
      kind: "mcq",
      prompt: "What are the two moments Adam tracks?",
      options: [
        "Mean and variance of parameters",
        "Mean and variance of gradients",
        "Learning rate and momentum",
        "Loss and accuracy",
      ],
      answer: 1,
      explanation:
        "Adam tracks the first moment (mean) and second moment (uncentered variance) of the gradients.",
      hints: ["What does 'moment' mean in statistics?"],
      objective: "Understand Adam's components",
    },
  ],
  exam: {
    definition:
      "Adam combines momentum (first moment of gradients) with RMSProp (second moment) and bias correction to adapt learning rates per parameter.",
    steps: [
      "Init m=0, v=0, t=0",
      "m = beta1*m + (1-beta1)*g",
      "v = beta2*v + (1-beta2)*g^2",
      "Bias-correct: m/(1-beta1^t), v/(1-beta2^t)",
      "Update: theta -= lr * m_hat / (sqrt(v_hat) + eps)",
    ],
    timeComplexity: "O(n) per step",
    spaceComplexity: "O(n) for m and v",
    correctness:
      "Bias correction ensures unbiased moment estimates. Convergence follows from the adaptive step size normalizing gradient magnitudes.",
    applications: ["Neural network training", "NLP transformers", "Computer vision"],
    limitations: ["May not converge without AMSGrad fix", "Sensitive to beta2"],
    faq: [
      {
        q: "Why bias correction?",
        a: "m and v are initialized to 0, making early estimates biased toward 0. Dividing by (1-beta^t) corrects this.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Momentum + RMSProp with bias correction (2)"],
      },
    ],
  },
  references: [
    {
      citation: "D. P. Kingma and J. Ba, 'Adam: A Method for Stochastic Optimization,' ICLR, 2015.",
      supports: "Original Adam paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
