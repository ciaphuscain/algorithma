import type { AlgorithmEntry } from "../types";

export const expectationMaximizationEntry: AlgorithmEntry = {
  slug: "expectation-maximization",
  name: "Expectation–Maximization",
  aliases: ["Expectation–Maximization"],
  curriculum: [572],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Iteratively estimates parameters of statistical models with latent variables by alternating between computing expected values (E-step) and maximizing likelihood (M-step).",
  tags: ["expectation maximization", "machine learning"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Observed data and a parametric model with latent variables.",
    output: "Maximum likelihood parameter estimates.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "EM alternates between guessing the hidden variables given current parameters (E-step) and optimizing parameters given the guesses (M-step). Each cycle increases the likelihood, converging to a local maximum.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize parameters θ randomly.",
          "E-step: compute expected value of latent variables given data and θ.",
          "M-step: update θ to maximize expected log-likelihood.",
          "Repeat until convergence.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Monitor log-likelihood to check convergence. EM may converge to local maxima — run with multiple initializations.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "EM monotonically increases the log-likelihood $\\log p(X|\\theta)$ at each step. By Jensen's inequality, the E-step lower-bounds the log-likelihood, and the M-step maximizes this bound.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Foundation for GMMs, HMMs, topic models.",
          "K-means is a special case of EM with hard assignments.",
          "Variational EM uses approximate posteriors for intractable E-steps.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n·d·k)",
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
      entry: "em_coin",
      code: `def em_coin(flips, n_iter=20):
    """EM for two biased coins. flips: list of (n_heads, n_tails) per experiment.
    Returns estimated probabilities [p_A, p_B]."""
    p_a, p_b = 0.6, 0.4
    for _ in range(n_iter):
        a_heads, a_tails, b_heads, b_tails = 0, 0, 0, 0
        for h, t in flips:
            n = h + t
            la = p_a**h * (1-p_a)**t
            lb = p_b**h * (1-p_b)**t
            wa = la / (la + lb) if (la + lb) > 0 else 0.5
            wb = 1 - wa
            a_heads += wa * h; a_tails += wa * t
            b_heads += wb * h; b_tails += wb * t
        p_a = a_heads / (a_heads + a_tails) if (a_heads + a_tails) > 0 else 0.5
        p_b = b_heads / (b_heads + b_tails) if (b_heads + b_tails) > 0 else 0.5
    return [round(p_a, 2), round(p_b, 2)]
`,
      tests: [
        {
          args: [
            [
              [5, 5],
              [9, 1],
              [8, 2],
              [4, 6],
              [7, 3],
            ],
          ],
          expected: [0.8, 0.52],
        },
      ],
    },
    {
      language: "javascript",
      entry: "emCoin",
      code: `function emCoin(flips, nIter = 20) {
  let pA = 0.6, pB = 0.4;
  for (let i = 0; i < nIter; i++) {
    let aH = 0, aT = 0, bH = 0, bT = 0;
    for (const [h, t] of flips) {
      const la = pA**h * (1-pA)**t, lb = pB**h * (1-pB)**t;
      const wa = (la + lb) > 0 ? la / (la + lb) : 0.5;
      aH += wa * h; aT += wa * t; bH += (1-wa) * h; bT += (1-wa) * t;
    }
    pA = aH / (aH + aT) || 0.5;
    pB = bH / (bH + bT) || 0.5;
  }
  return [Math.round(pA * 100) / 100, Math.round(pB * 100) / 100];
}
`,
      tests: [
        {
          args: [
            [
              [5, 5],
              [9, 1],
              [8, 2],
              [4, 6],
              [7, 3],
            ],
          ],
          expected: [0.8, 0.52],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "expectation-maximization-q1",
      kind: "mcq",
      prompt: "What does the E-step in EM compute?",
      options: [
        "Expected values of latent variables given current parameters",
        "The maximum likelihood estimate",
        "The gradient of the loss",
        "The prior distribution",
      ],
      answer: 0,
      explanation:
        "The E-step computes the posterior distribution (or expected sufficient statistics) of the latent variables.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Iteratively estimates parameters of statistical models with latent variables by alternating between computing expected values (E-step) and maximizing likelihood (M-step).",
    steps: [
      "Initialize parameters θ randomly.",
      "E-step: compute expected value of latent variables given data and θ.",
      "M-step: update θ to maximize expected log-likelihood.",
      "Repeat until convergence.",
    ],
    timeComplexity: "$O(n·d·k)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Expectation–Maximization?",
        a: "Iteratively estimates parameters of statistical models with latent variables by alternating between computing expected values (E-step) and maximizing likelihood (M-step).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Expectation–Maximization (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Expectation–Maximization.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
