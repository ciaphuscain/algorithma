import type { AlgorithmEntry } from "../types";

export const metropolisHastingsMcmcEntry: AlgorithmEntry = {
  slug: "metropolis-hastings-mcmc",
  name: "Metropolis–Hastings MCMC",
  aliases: ["Metropolis–Hastings MCMC"],
  curriculum: [578],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Generates samples from a target probability distribution by constructing a Markov chain that converges to the target as its stationary distribution.",
  tags: ["metropolis hastings mcmc", "machine learning"],
  prerequisites: [],
  related: ["gibbs-sampling", "hamiltonian-monte-carlo"],
  problem: {
    input: "A target distribution p(x) (up to a normalizing constant) and a proposal distribution.",
    output: "A sequence of samples approximately distributed according to p(x).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Metropolis-Hastings explores a distribution by random walk: propose a new point, accept it if it's in a higher-probability region (or sometimes accept even in lower regions). Over time, the visited points form a representative sample.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start at an arbitrary point x₀.",
          "Propose a new point x' ~ q(x'|xₜ).",
          "Compute acceptance ratio α = min(1, p(x')·q(xₜ|x') / (p(xₜ)·q(x'|xₜ))).",
          "Accept x' with probability α (set xₜ₊₁ = x'), else stay (xₜ₊₁ = xₜ).",
          "Repeat and collect samples after a burn-in period.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "With a symmetric proposal (e.g., Gaussian random walk), q(x'|x) = q(x|x'), so α simplifies to min(1, p(x')/p(x)). Tuning the proposal scale is critical: too wide → many rejections, too narrow → slow exploration.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Metropolis-Hastings satisfies detailed balance: $p(x)q(x'|x)\\alpha(x \\to x') = p(x')q(x|x')\\alpha(x' \\to x)$, so the chain's stationary distribution is p. Convergence rate depends on mixing time, which is hard to bound in general.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Metropolis algorithm (1953) is the special case with symmetric proposals.",
          "Gibbs sampling is a special case where each variable is sampled from its conditional.",
          "Hamiltonian Monte Carlo uses gradient information for faster mixing.",
          "Used for Bayesian inference, statistical physics, optimization.",
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
      entry: "metropolis_demo",
      code: `def metropolis(log_target, x0, sigma, n_samples, seed=42):
    """Metropolis-Hastings with Gaussian proposal. Returns samples."""
    import random, math
    random.seed(seed)
    x = x0
    samples = []
    for _ in range(n_samples):
        x_prop = x + random.gauss(0, sigma)
        log_alpha = log_target(x_prop) - log_target(x)
        if math.log(random.random()) < log_alpha:
            x = x_prop
        samples.append(round(x, 2))
    return samples

def metropolis_demo(x0, sigma, n_samples, seed=42):
    return metropolis(lambda x: -0.5*x*x, x0, sigma, n_samples, seed)
`,
      tests: [
        {
          args: [0, 1.0, 5, 42],
          expected: [-0.14, -0.32, -0.44, -1.94, -2.16],
        },
      ],
    },
    {
      language: "javascript",
      entry: "metropolisDemo",
      code: `function metropolis(logTarget, x0, sigma, nSamples, seed = 42) {
  function rng(s) { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; }
  let s = seed, x = x0;
  const samples = [];
  for (let i = 0; i < nSamples; i++) {
    s = rng(s); const u1 = s / 0x7fffffff;
    s = rng(s); const u2 = s / 0x7fffffff;
    const z = Math.sqrt(-2*Math.log(u1||1e-10))*Math.cos(2*Math.PI*u2);
    const xProp = x + sigma * z;
    const logAlpha = logTarget(xProp) - logTarget(x);
    s = rng(s); const u = s / 0x7fffffff;
    if (Math.log(u||1e-10) < logAlpha) x = xProp;
    samples.push(Math.round(x * 100) / 100);
  }
  return samples;
}
function metropolisDemo(x0, sigma, nSamples, seed) {
  return metropolis(x => -0.5*x*x, x0, sigma, nSamples, seed);
}
`,
      tests: [
        {
          args: [0, 1.0, 3, 42],
          expected: [0, 0.02, 0.68],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "metropolis-hastings-mcmc-q1",
      kind: "mcq",
      prompt: "What is the acceptance ratio in Metropolis-Hastings?",
      options: [
        "min(1, p(x')q(x|x') / p(x)q(x'|x))",
        "Always 1",
        "p(x')/p(x) always",
        "The proposal probability",
      ],
      answer: 0,
      explanation:
        "The acceptance ratio balances the target density ratio with the proposal asymmetry to ensure detailed balance.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Generates samples from a target probability distribution by constructing a Markov chain that converges to the target as its stationary distribution.",
    steps: [
      "Start at an arbitrary point x₀.",
      "Propose a new point x' ~ q(x'|xₜ).",
      "Compute acceptance ratio α = min(1, p(x')·q(xₜ|x') / (p(xₜ)·q(x'|xₜ))).",
      "Accept x' with probability α (set xₜ₊₁ = x'), else stay (xₜ₊₁ = xₜ).",
      "Repeat and collect samples after a burn-in period.",
    ],
    timeComplexity: "$O(n·d·k)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Metropolis–Hastings MCMC?",
        a: "Generates samples from a target probability distribution by constructing a Markov chain that converges to the target as its stationary distribution.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Metropolis–Hastings MCMC (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Metropolis–Hastings MCMC.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
