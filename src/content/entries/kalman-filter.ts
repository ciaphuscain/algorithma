import type { AlgorithmEntry } from "../types";

export const kalmanFilterEntry: AlgorithmEntry = {
  slug: "kalman-filter",
  name: "Kalman Filter",
  aliases: ["Kalman Filter"],
  curriculum: [575],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Estimates the state of a linear dynamical system from noisy measurements by combining prediction and observation updates using Gaussian distributions.",
  tags: ["kalman filter", "machine learning"],
  prerequisites: [],
  related: [],
  problem: {
    input:
      "A linear state-space model (transition, observation matrices, noise covariances) and a sequence of observations.",
    output: "Filtered state estimates and their uncertainties at each time step.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The Kalman filter is like a smart averaging: it predicts the next state, then corrects that prediction using the actual measurement. It optimally combines uncertain predictions with uncertain measurements by weighting them by their respective confidences.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Predict: x̂ₜ|ₜ₋₁ = F·x̂ₜ₋₁ and P = F·Pₜ₋₁·Fᵀ + Q.",
          "Compute Kalman gain: K = P·Hᵀ·(H·P·Hᵀ + R)⁻¹.",
          "Update: x̂ₜ = x̂ₜ|ₜ₋₁ + K·(zₜ - H·x̂ₜ|ₜ₋₁).",
          "Update covariance: Pₜ = (I - K·H)·P.",
          "Repeat for each observation.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "For scalar systems (1D), the filter simplifies to a few multiplications per step. The Kalman gain K determines how much to trust the measurement vs. the prediction.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The Kalman filter is the optimal estimator for linear Gaussian systems: it minimizes mean squared error. Each step is $O(d^3)$ where d is the state dimension (due to matrix operations). The extended Kalman filter (EKF) linearizes nonlinear systems.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Extended Kalman Filter** handles nonlinear dynamics via local linearization.",
          "**Unscented Kalman Filter** uses sigma points for better nonlinear approximation.",
          "**Particle filter** handles arbitrary nonlinear/non-Gaussian systems.",
          "Used in GPS, robotics (SLAM), finance (tracking hidden states), aerospace (navigation).",
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
      entry: "kalman_1d",
      code: `def kalman_1d(measurements, F=1, H=1, Q=0.1, R=1, x0=0, P0=1):
    """1D Kalman filter. Returns filtered state estimates."""
    x, P = x0, P0
    results = []
    for z in measurements:
        # Predict
        x_pred = F * x
        P_pred = F * P * F + Q
        # Update
        K = P_pred * H / (H * P_pred * H + R)
        x = x_pred + K * (z - H * x_pred)
        P = (1 - K * H) * P_pred
        results.append(round(x, 4))
    return results
`,
      tests: [
        {
          args: [[1, 2, 3]],
          expected: [0.5, 1.2105, 2.0288],
        },
      ],
    },
    {
      language: "javascript",
      entry: "kalman1d",
      code: `function kalman1d(measurements, F=1, H=1, Q=0.1, R=1, x0=0, P0=1) {
  let x = x0, P = P0;
  return measurements.map(z => {
    const xPred = F * x, PPred = F * P * F + Q;
    const K = PPred * H / (H * PPred * H + R);
    x = xPred + K * (z - H * xPred);
    P = (1 - K * H) * PPred;
    return Math.round(x * 10000) / 10000;
  });
}
`,
      tests: [
        {
          args: [[1, 2, 3]],
          expected: [0.5, 1.2105, 2.0288],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "kalman-filter-q1",
      kind: "mcq",
      prompt: "What does the Kalman gain K control?",
      options: [
        "How much to trust the measurement vs. the prediction",
        "The speed of convergence",
        "The number of iterations",
        "The state dimension",
      ],
      answer: 0,
      explanation:
        "When K is large, the filter trusts the measurement more; when small, it trusts the prediction more.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Estimates the state of a linear dynamical system from noisy measurements by combining prediction and observation updates using Gaussian distributions.",
    steps: [
      "Predict: x̂ₜ|ₜ₋₁ = F·x̂ₜ₋₁ and P = F·Pₜ₋₁·Fᵀ + Q.",
      "Compute Kalman gain: K = P·Hᵀ·(H·P·Hᵀ + R)⁻¹.",
      "Update: x̂ₜ = x̂ₜ|ₜ₋₁ + K·(zₜ - H·x̂ₜ|ₜ₋₁).",
      "Update covariance: Pₜ = (I - K·H)·P.",
      "Repeat for each observation.",
    ],
    timeComplexity: "$O(n·d·k)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Kalman Filter?",
        a: "Estimates the state of a linear dynamical system from noisy measurements by combining prediction and observation updates using Gaussian distributions.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Kalman Filter (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Kalman Filter.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
