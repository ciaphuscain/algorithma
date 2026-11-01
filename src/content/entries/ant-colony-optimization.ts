import type { AlgorithmEntry } from "../types";

export const antColonyOptimizationEntry: AlgorithmEntry = {
  slug: "ant-colony-optimization",
  name: "Ant Colony Optimization",
  aliases: [
    "ACO",
  ],
  curriculum: [
    449,
  ],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary: "A metaheuristic inspired by ant foraging behavior, where artificial ants build solutions guided by pheromone trails and local heuristics, applied to combinatorial optimization problems like TSP.",
  tags: [
    "metaheuristic",
    "swarm intelligence",
    "TSP",
    "optimization",
  ],
  prerequisites: [
    "Graph Theory",
  ],
  related: [
    "simulated-annealing",
    "genetic-algorithm",
  ],
  problem: {
    input: "A combinatorial optimization problem (e.g., a weighted graph for TSP).",
    output: "A near-optimal solution found through iterative pheromone-guided construction.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Real ants find short paths to food by depositing pheromones. Shorter paths get more pheromone (ants traverse them faster), attracting more ants, creating positive feedback. ACO simulates this: artificial ants build solutions probabilistically, and better solutions receive more pheromone, biasing future ants toward good components.",
      },
      {
        kind: "p",
        text: "The balance between pheromone (exploitation) and a heuristic like inverse distance (exploration) prevents premature convergence to a local optimum.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize pheromone levels on all edges.",
          "Each iteration: m ants each build a complete solution. At each step, an ant chooses the next city with probability proportional to tau^alpha * eta^beta, where tau is pheromone and eta is the heuristic (1/distance).",
          "After all ants finish, evaporate pheromone: tau *= (1 - rho).",
          "Deposit new pheromone: for each ant, add Q/tour_length to edges in its tour.",
          "Repeat for T iterations. Return the best tour found.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "alpha controls pheromone influence; beta controls heuristic influence.",
          "Elitist strategies deposit extra pheromone on the global-best tour.",
          "MAX-MIN ant system bounds pheromone to [tau_min, tau_max] to prevent stagnation.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Convergence**: Under certain conditions, ACO converges to the optimal solution with probability 1 as iterations → infinity, but no polynomial time bound exists.",
      },
      {
        kind: "p",
        text: "**Time per iteration**: O(m * n^2) for m ants on n cities. Total: O(T * m * n^2).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Ant Colony System (ACS) adds local pheromone updates and a pseudorandom proportional rule.",
          "Applied beyond TSP to vehicle routing, scheduling, network routing.",
          "Can be parallelized: each ant's tour is independent within an iteration.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(T * m * n^2)",
      average: "O(T * m * n^2)",
      worst: "O(T * m * n^2)",
    },
    space: "O(n^2)",
    worstClass: "n^2",
    note: "T iterations, m ants, n cities.",
  },
  properties: [
    {
      label: "Type",
      value: "Metaheuristic (no optimality guarantee)",
    },
    {
      label: "Stochastic",
      value: "Yes",
    },
    {
      label: "Parallelizable",
      value: "Yes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "aco_tsp",
      code: `import random
import math

def aco_tsp(dist, n_ants=10, n_iter=50, alpha=1.0, beta=2.0, rho=0.5):
    """ACO for TSP. dist[i][j] = distance. Returns best tour length."""
    n = len(dist)
    pheromone = [[1.0]*n for _ in range(n)]
    best_length = float("inf")
    for _ in range(n_iter):
        tours = []
        for _ in range(n_ants):
            visited = [False]*n
            tour = [random.randrange(n)]
            visited[tour[0]] = True
            for _ in range(n-1):
                cur = tour[-1]
                probs = []
                for j in range(n):
                    if not visited[j] and dist[cur][j] > 0:
                        p = pheromone[cur][j]**alpha * (1.0/dist[cur][j])**beta
                        probs.append((j, p))
                    elif not visited[j]:
                        probs.append((j, 0.001))
                total = sum(p for _, p in probs)
                r = random.random() * total
                cum = 0
                chosen = probs[0][0]
                for j, p in probs:
                    cum += p
                    if cum >= r:
                        chosen = j
                        break
                tour.append(chosen)
                visited[chosen] = True
            length = sum(dist[tour[i]][tour[(i+1)%n]] for i in range(n))
            tours.append((tour, length))
            if length < best_length:
                best_length = length
        # Evaporate
        for i in range(n):
            for j in range(n):
                pheromone[i][j] *= (1-rho)
        # Deposit
        for tour, length in tours:
            deposit = 1.0/length if length > 0 else 0
            for i in range(n):
                a, b = tour[i], tour[(i+1)%n]
                pheromone[a][b] += deposit
                pheromone[b][a] += deposit
    return best_length

def aco_test(dist):
    random.seed(42)
    return aco_tsp(dist, n_ants=20, n_iter=100)
`,
      tests: [
        {
          args: [
            [
              [
                0,
                10,
                15,
                20,
              ],
              [
                10,
                0,
                35,
                25,
              ],
              [
                15,
                35,
                0,
                30,
              ],
              [
                20,
                25,
                30,
                0,
              ],
            ],
          ],
          expected: 80,
        },
      ],
    },
  ],
  practice: [
    {
      id: "aco-balance",
      kind: "mcq",
      prompt: "In ACO, what does the beta parameter control?",
      options: [
        "Pheromone evaporation rate",
        "Influence of the heuristic (e.g., distance)",
        "Number of ants",
        "Influence of pheromone",
      ],
      answer: 1,
      explanation: "Beta weights the heuristic information (like inverse distance). Alpha weights the pheromone. Together they balance exploitation and exploration.",
      hints: [
        "What are the two factors in the transition probability?",
      ],
      objective: "Understand ACO parameters",
    },
  ],
  exam: {
    definition: "ACO simulates ant foraging: artificial ants build solutions guided by pheromone trails and heuristics, with pheromone reinforcing good solutions.",
    steps: [
      "Initialize pheromone",
      "Ants build solutions using pheromone * heuristic",
      "Evaporate pheromone",
      "Deposit pheromone on good tours",
      "Repeat",
    ],
    timeComplexity: "O(T * m * n^2)",
    spaceComplexity: "O(n^2)",
    correctness: "Positive feedback: better solutions get more pheromone, attracting more ants. Evaporation prevents stagnation.",
    applications: [
      "Traveling Salesman Problem",
      "Vehicle routing",
      "Network routing",
    ],
    limitations: [
      "No optimality guarantee",
      "Many parameters to tune",
    ],
    faq: [
      {
        q: "Why evaporate?",
        a: "To forget poor early solutions and allow exploration of new paths.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Pheromone-guided construction with evaporation and reinforcement (2)",
        ],
      },
    ],
  },
  references: [
    {
      citation: "M. Dorigo and L. M. Gambardella, 'Ant Colony System: A Cooperative Learning Approach to the Traveling Salesman Problem,' IEEE Trans. Evolutionary Computation, 1(1):53-66, 1997.",
      supports: "Foundational ACO paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
