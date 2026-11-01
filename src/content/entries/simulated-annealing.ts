import type { AlgorithmEntry } from "../types";

export const simulatedAnnealingEntry: AlgorithmEntry = {
  slug: "simulated-annealing",
  name: "Simulated Annealing",
  aliases: ["SA"],
  curriculum: [438],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Simulated annealing is a probabilistic optimization method that escapes local optima by occasionally accepting worse solutions, with the probability decreasing over time according to a temperature schedule.",
  tags: ["metaheuristic", "optimization", "randomized", "combinatorial optimization"],
  prerequisites: ["Greedy Algorithms"],
  related: ["tabu-search", "ant-colony-optimization"],
  problem: {
    input:
      "A combinatorial optimization problem defined by a solution space, neighborhood function, and cost function.",
    output: "An approximate optimal solution.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hill climbing always moves to a better neighbor, but gets stuck in local optima. Simulated annealing borrows from metallurgy: at high temperature, atoms move freely (the algorithm accepts bad moves); as temperature cools, atoms settle into a low-energy crystal (the algorithm converges to a good solution).",
      },
      {
        kind: "p",
        text: "The key insight is that accepting worse solutions early allows exploration of the search space, while gradually reducing acceptance probability lets the algorithm settle near the global optimum.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with an initial solution and high temperature T.",
          "Generate a random neighbor solution.",
          "If the neighbor is better, accept it. If worse, accept with probability $e^{-\\Delta / T}$ where Δ is the cost increase.",
          "Reduce T according to a cooling schedule (e.g., T ← α·T with α ≈ 0.99).",
          "Repeat until T is very small or a stopping criterion is met.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: Minimise f(x)=x^2, start x=5, T=10, α=0.5. Neighbor x=6: Δ=11, accept with p=e^{-11/10}=0.33. Neighbor x=3: Δ=-16, always accept. T→5. Neighbor x=4: Δ=7, accept with p=e^{-7/5}=0.25. Gradually converges toward x=0.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The cooling schedule is critical: too fast misses good solutions, too slow wastes time.",
          "Common schedules: geometric (T*=αT), logarithmic (T=C/log(k)), linear (T-=δ).",
          "Reheating (temporarily increasing T) can help escape deep local optima.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With a sufficiently slow logarithmic cooling schedule T(k) = C/log(k), simulated annealing converges to the global optimum with probability 1 (Hajek, 1988). In practice, geometric cooling is used and only approximate optimality is guaranteed.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Metropolis–Hastings algorithm in MCMC is the statistical mechanics basis for SA.",
          "Parallel tempering runs multiple chains at different temperatures and swaps solutions.",
          "SA is effective for TSP, VLSI placement, protein folding, and scheduling problems.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(k)",
      average: "O(k)",
      worst: "O(k)",
    },
    space: "O(1)",
    worstClass: "other",
    note: "k is the number of iterations (user-defined); each iteration evaluates one neighbor.",
  },
  properties: [
    {
      label: "Type",
      value: "Metaheuristic (approximate)",
    },
    {
      label: "Escapes local optima",
      value: "Yes, via probabilistic acceptance",
    },
    {
      label: "Guarantee",
      value: "Converges to global optimum with slow enough cooling",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "sa_minimize_quadratic",
      code: `def sa_minimize_quadratic(a, b, c, x0, seed=42):
    """Use simulated annealing to find the x that minimizes ax^2 + bx + c.
    Returns x rounded to nearest integer."""
    import random, math
    rng = random.Random(seed)
    x = float(x0)
    def f(v): return a*v*v + b*v + c
    fx = f(x)
    best, fbest = x, fx
    T = 100.0
    for _ in range(10000):
        xn = x + rng.uniform(-1, 1)
        fxn = f(xn)
        delta = fxn - fx
        if delta < 0 or rng.random() < math.exp(-delta / max(T, 1e-10)):
            x, fx = xn, fxn
        if fx < fbest:
            best, fbest = x, fx
        T *= 0.9995
    return round(best)
`,
      tests: [
        {
          args: [1, -6, 9, 10],
          expected: 3,
        },
        {
          args: [1, 0, 0, 5],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sa-accept",
      kind: "mcq",
      prompt: "Why does simulated annealing accept worse solutions?",
      options: [
        "To escape local optima and explore the search space",
        "Because worse solutions are always closer to the global optimum",
        "To speed up computation",
        "Due to a bug in the algorithm",
      ],
      answer: 0,
      explanation:
        "Accepting worse solutions with decreasing probability allows exploration early and convergence later.",
      hints: ["What happens if you only accept improvements?"],
      objective: "Understand acceptance criterion",
    },
  ],
  exam: {
    definition:
      "Simulated annealing minimizes a function by accepting worse neighbors with probability e^(-Δ/T), decreasing T over time.",
    steps: [
      "Initialize solution and temperature.",
      "Generate neighbor, compute cost difference.",
      "Accept if better or with Boltzmann probability.",
      "Cool temperature.",
      "Repeat.",
    ],
    timeComplexity: "O(k) iterations",
    spaceComplexity: "O(1)",
    correctness: "Converges to global optimum with logarithmic cooling (Hajek, 1988).",
    applications: ["TSP", "VLSI placement", "Scheduling", "Protein folding"],
    limitations: [
      "No guarantee of optimality with practical cooling",
      "Sensitive to cooling schedule",
    ],
    faq: [
      {
        q: "How to choose the cooling schedule?",
        a: "Start T high enough that ~80% of moves are accepted; cool geometrically with α=0.99-0.999.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Metropolis criterion (1).", "Cooling schedule and convergence (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "S. Kirkpatrick, C. D. Gelatt, M. P. Vecchi, 'Optimization by Simulated Annealing,' Science, 220(4598), 1983.",
      supports: "The seminal SA paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
