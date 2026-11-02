import type { AlgorithmEntry } from "../types";

export const particleFilterEntry: AlgorithmEntry = {
  slug: "particle-filter",
  name: "Particle Filter",
  aliases: ["Sequential Monte Carlo", "SMC"],
  curriculum: [576],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Estimates the state of a dynamic system from noisy observations by maintaining a weighted set of samples (particles) that are propagated, weighted by observation likelihood, and resampled each time step.",
  tags: ["Bayesian", "state estimation", "Monte Carlo", "filtering"],
  prerequisites: ["Probability"],
  related: ["belief-propagation"],
  problem: {
    input:
      "A sequence of observations from a hidden Markov model and the transition/observation models.",
    output: "An estimate of the hidden state at each time step.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine tracking a robot's position using noisy sensor readings. A particle filter represents uncertainty about the position with thousands of hypothetical positions (particles). Each step: move each particle according to the motion model, weight it by how well it explains the sensor reading, then resample — particles consistent with observations survive, others die off.",
      },
      {
        kind: "p",
        text: "Over time, the particles cluster around the true state, giving a non-parametric approximation to the posterior distribution.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialise N particles from the prior distribution.",
          "For each time step: (a) propagate each particle through the transition model, (b) weight each by observation likelihood, (c) normalise weights, (d) resample with replacement proportional to weights.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** 1D tracking with N=4 particles at positions [2,3,5,7], observation=4. Weights peak near 4, so after resampling particles cluster around 3–5.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Systematic resampling is more efficient and lower-variance than multinomial resampling.",
          "Effective sample size (ESS) determines when to resample — resample only when ESS drops below N/2.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each step is $O(N)$ for propagation, weighting, and resampling. Total for T steps: $O(NT)$. The approximation converges to the true posterior as $N \\to \\infty$, with error $O(1/\\sqrt{N})$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Rao-Blackwellised particle filters marginalise some variables analytically to reduce variance.",
          "Used in SLAM (simultaneous localisation and mapping) for robotics.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(N T)",
      average: "O(N T)",
      worst: "O(N T)",
    },
    space: "O(N)",
    worstClass: "n",
    note: "N particles, T time steps.",
  },
  properties: [
    {
      label: "Non-parametric",
      value: "Handles multimodal distributions",
    },
    {
      label: "Convergence",
      value: "$O(1/\\sqrt{N})$ error",
    },
    {
      label: "Online",
      value: "Processes observations one at a time",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "particle_filter_1d",
      code: `import random

def particle_filter_1d(observations, n_particles=100, noise=1.0):
    """Simple 1D particle filter. Returns estimated state at each step."""
    random.seed(42)
    particles = [random.gauss(0, 5) for _ in range(n_particles)]
    estimates = []
    for obs in observations:
        # Propagate
        particles = [p + random.gauss(0, noise) for p in particles]
        # Weight by Gaussian likelihood
        weights = [max(1e-300, __import__('math').exp(-0.5 * ((p - obs) / noise) ** 2)) for p in particles]
        total = sum(weights)
        weights = [w / total for w in weights]
        # Estimate
        estimates.append(round(sum(p * w for p, w in zip(particles, weights)), 1))
        # Resample
        cum = []
        s = 0
        for w in weights:
            s += w
            cum.append(s)
        new_particles = []
        for _ in range(n_particles):
            r = random.random()
            for i, c in enumerate(cum):
                if r <= c:
                    new_particles.append(particles[i])
                    break
        particles = new_particles
    return estimates
`,
      tests: [
        {
          args: [[0.0, 1.0, 2.0], 50, 1.0],
          expected: [0.0, 0.6, 1.3],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pf-resample",
      kind: "mcq",
      prompt: "Why is resampling needed in a particle filter?",
      options: [
        "To focus particles on high-likelihood regions and prevent weight degeneracy",
        "To reduce computation",
        "To sort particles",
        "To remove noise",
      ],
      answer: 0,
      explanation:
        "Without resampling, most particles end up with near-zero weight, wasting computation on unlikely states.",
      hints: ["What happens if you skip resampling?"],
      objective: "Understand resampling",
    },
  ],
  exam: {
    definition:
      "A particle filter approximates Bayesian filtering using weighted samples that are propagated, weighted, and resampled at each step.",
    steps: [
      "Init N particles from prior.",
      "Propagate through transition model.",
      "Weight by observation likelihood.",
      "Resample proportional to weights.",
    ],
    timeComplexity: "$O(NT)$.",
    spaceComplexity: "$O(N)$.",
    correctness:
      "Monte Carlo approximation converges with O(1/√N) error by the law of large numbers.",
    applications: ["Robot localisation", "Object tracking", "Financial modelling"],
    limitations: ["Curse of dimensionality", "Particle degeneracy"],
    faq: [
      {
        q: "What is ESS?",
        a: "Effective sample size: 1/Σw² measures how many particles carry meaningful weight.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Propagate-weight-resample cycle and convergence (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "A. Doucet, N. de Freitas, N. Gordon, Sequential Monte Carlo Methods in Practice, Springer, 2001.",
      supports: "Comprehensive reference on particle filters.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
