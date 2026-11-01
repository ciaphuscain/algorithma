import type { AlgorithmEntry } from "../types";

export const particleSwarmOptimizationEntry: AlgorithmEntry = {
  slug: "particle-swarm-optimization",
  name: "Particle Swarm Optimization",
  aliases: ["PSO"],
  curriculum: [440],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Optimises a function by moving a swarm of candidate solutions through the search space, each adjusting its velocity based on its own best-known position and the swarm's best-known position.",
  tags: ["optimization", "metaheuristic", "swarm intelligence"],
  prerequisites: [],
  related: ["ant-colony-optimization", "simulated-annealing"],
  problem: {
    input: "An objective function f: R^d → R to minimise and search bounds.",
    output: "An approximate global minimum.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine a flock of birds searching for food. Each bird remembers the best spot it has visited and knows the best spot found by any bird. It adjusts its flight direction to drift toward both of these positions, with some randomness. Over time the flock converges on a good food source.",
      },
      {
        kind: "p",
        text: "PSO is a population-based optimiser that balances exploration (random components) with exploitation (moving toward known good positions).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialise n particles at random positions with random velocities.",
          "Evaluate the objective function at each particle's position.",
          "Update each particle's personal best and the global best.",
          "Update velocity: $v_i = w \\cdot v_i + c_1 r_1 (p_i - x_i) + c_2 r_2 (g - x_i)$.",
          "Update position: $x_i = x_i + v_i$.",
          "Repeat until convergence.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** Minimise $f(x) = x^2$. Particles start randomly in [−10, 10]. Over iterations they converge to $x = 0$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Inertia weight w controls exploration vs exploitation — decrease it over time for convergence.",
          "Typical parameters: w=0.7, c1=c2=1.5.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each iteration is $O(nd)$ for n particles in d dimensions. Total $O(ndt)$ for t iterations. No convergence guarantee to global optimum but works well empirically on many problems.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Constriction coefficient variant prevents velocity explosion without clamping.",
          "Multi-objective PSO extends to Pareto-optimal fronts.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n d t)",
      average: "O(n d t)",
      worst: "O(n d t)",
    },
    space: "O(n d)",
    worstClass: "other",
    note: "n particles, d dimensions, t iterations.",
  },
  properties: [
    {
      label: "Population-based",
      value: "n particles explore in parallel",
    },
    {
      label: "Gradient-free",
      value: "Only needs function evaluations",
    },
    {
      label: "Convergence",
      value: "No global optimality guarantee",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "pso_minimize",
      code: `import random

def pso_minimize(f, dim, bounds, n_particles=20, iterations=50):
    """Minimise f over [bounds[0], bounds[1]]^dim. Returns best position and value."""
    random.seed(42)
    lo, hi = bounds
    pos = [[random.uniform(lo, hi) for _ in range(dim)] for _ in range(n_particles)]
    vel = [[random.uniform(-(hi-lo)/10, (hi-lo)/10) for _ in range(dim)] for _ in range(n_particles)]
    pbest = [list(p) for p in pos]
    pbest_val = [f(p) for p in pos]
    gi = min(range(n_particles), key=lambda i: pbest_val[i])
    gbest = list(pbest[gi])
    gbest_val = pbest_val[gi]
    w, c1, c2 = 0.7, 1.5, 1.5
    for _ in range(iterations):
        for i in range(n_particles):
            for d in range(dim):
                r1, r2 = random.random(), random.random()
                vel[i][d] = w * vel[i][d] + c1 * r1 * (pbest[i][d] - pos[i][d]) + c2 * r2 * (gbest[d] - pos[i][d])
                pos[i][d] += vel[i][d]
                pos[i][d] = max(lo, min(hi, pos[i][d]))
            val = f(pos[i])
            if val < pbest_val[i]:
                pbest[i] = list(pos[i])
                pbest_val[i] = val
                if val < gbest_val:
                    gbest = list(pos[i])
                    gbest_val = val
    return [round(x, 4) for x in gbest], round(gbest_val, 4)
`,
      tests: [
        {
          args: ["lambda x: x[0]**2 + x[1]**2", 2, [-10, 10], 20, 100],
          expected: [0.0, 0.0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pso-velocity",
      kind: "mcq",
      prompt: "What two best positions influence a particle's velocity update?",
      options: [
        "Its personal best and the global best",
        "Its current position and the origin",
        "Two random positions",
        "The nearest two neighbours",
      ],
      answer: 0,
      explanation:
        "Each particle moves toward its own best-known position (personal best) and the best position found by any particle (global best).",
      hints: ["What does each particle remember?"],
      objective: "Understand PSO velocity update",
    },
  ],
  exam: {
    definition:
      "PSO moves particles through the search space by adjusting velocities toward personal and global bests.",
    steps: [
      "Init random positions and velocities.",
      "Evaluate, update personal and global bests.",
      "Update velocity with inertia, cognitive, social terms.",
      "Update position.",
      "Repeat.",
    ],
    timeComplexity: "$O(ndt)$.",
    spaceComplexity: "$O(nd)$.",
    correctness:
      "Empirically converges well; no global optimality guarantee. Inertia weight balances exploration and exploitation.",
    applications: ["Hyperparameter tuning", "Neural network training", "Engineering design"],
    limitations: ["May converge to local optima", "Parameter sensitive"],
    faq: [
      {
        q: "What does inertia weight do?",
        a: "It controls how much of the previous velocity is retained, balancing exploration (high w) and convergence (low w).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Velocity update formula and convergence behaviour (2)."],
      },
    ],
  },
  references: [
    {
      citation: 'J. Kennedy, R. Eberhart, "Particle swarm optimization," IEEE ICNN, 1995.',
      supports: "The original PSO paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
