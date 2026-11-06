import type { AlgorithmEntry } from "../types";

export const differenceConstraintsEntry: AlgorithmEntry = {
  slug: "difference-constraints",
  name: "Difference Constraints",
  aliases: ["System of difference constraints"],
  curriculum: [92],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "advanced",
  summary:
    "Solves a system of inequalities x_j − x_i ≤ w_{ij} by modelling them as a shortest-path problem and running Bellman–Ford, detecting infeasibility via negative cycles.",
  tags: ["shortest path", "Bellman-Ford", "constraints", "linear programming"],
  prerequisites: ["Bellman–Ford Algorithm"],
  related: ["bellman-ford"],
  problem: {
    input: "A set of n variables and m constraints of the form x_j − x_i ≤ c.",
    output: "An assignment satisfying all constraints, or a report that the system is infeasible.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each constraint x_j − x_i ≤ c looks exactly like a shortest-path relaxation: d[j] ≤ d[i] + c. So we create a graph with an edge from i to j with weight c for each constraint, add a source connected to all variables with weight 0, and run Bellman–Ford.",
      },
      {
        kind: "p",
        text: "If Bellman–Ford finds shortest paths, they satisfy all constraints. If it detects a negative cycle, the constraints contradict each other and no solution exists.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create a graph with one vertex per variable plus a source vertex s.",
          "For each constraint x_j − x_i ≤ c, add edge (i, j) with weight c.",
          "Add edges from s to every variable vertex with weight 0.",
          "Run Bellman–Ford from s.",
          "If no negative cycle: x_i = d[i] (shortest distance from s) satisfies all constraints.",
          "If a negative cycle is found: the system is infeasible.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example:** x₁ − x₀ ≤ 3, x₂ − x₁ ≤ −1, x₂ − x₀ ≤ 4. Edges: (0,1,3), (1,2,−1), (0,2,4). Add source s with edges to all. Bellman–Ford gives d[0]=0, d[1]=0, d[2]=−1. So x₀=0, x₁=0, x₂=−1 works.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The extra source vertex ensures all variables are reachable.",
          "Variables can be shifted: if x is a solution, so is x + c for any constant c.",
          "This technique is used in scheduling, circuit timing analysis, and LP duality.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness:** Bellman–Ford produces d[j] ≤ d[i] + w(i,j) for all edges, which is exactly x_j − x_i ≤ c. Negative cycles correspond to unsatisfiable circular constraints.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(nm) where n is the number of variables and m the number of constraints (Bellman–Ford on the constraint graph).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Difference constraints are a special case of linear programming solvable in polynomial time.",
          "Tightest constraints correspond to shortest paths in the constraint graph.",
          "Used in compiler scheduling to determine instruction ordering under latency constraints.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(nm)",
      average: "O(nm)",
      worst: "O(nm)",
    },
    space: "O(n + m)",
    worstClass: "n^2",
    note: "Bellman–Ford on n+1 vertices and m + n edges.",
  },
  properties: [
    {
      label: "Reduction",
      value: "To shortest paths (Bellman–Ford)",
    },
    {
      label: "Infeasibility",
      value: "Detected via negative cycle",
    },
    {
      label: "Application",
      value: "Scheduling, timing analysis",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "difference_constraints",
      code: `def difference_constraints(n, constraints):
    """Solve x_j - x_i <= c for n variables (0..n-1).
    constraints: list of (i, j, c). Returns list of values or 'infeasible'."""
    INF = float('inf')
    # Add source vertex n with edges to all variables (weight 0)
    edges = [(n, i, 0) for i in range(n)] + [(i, j, c) for i, j, c in constraints]
    d = [INF] * (n + 1)
    d[n] = 0
    for _ in range(n):
        for u, v, w in edges:
            if d[u] != INF and d[u] + w < d[v]:
                d[v] = d[u] + w
    for u, v, w in edges:
        if d[u] != INF and d[u] + w < d[v]:
            return "infeasible"
    return d[:n]
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1, 3],
              [1, 2, -1],
              [0, 2, 4],
            ],
          ],
          expected: [0, 0, -1],
        },
        {
          args: [
            2,
            [
              [0, 1, 5],
              [1, 0, -6],
            ],
          ],
          expected: "infeasible",
        },
        {
          args: [2, [[0, 1, 3]]],
          expected: [0, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "diff-constraints-graph",
      kind: "mcq",
      prompt: "What does each constraint x_j − x_i ≤ c become in the constraint graph?",
      options: [
        "An edge from i to j with weight c",
        "An edge from j to i with weight c",
        "An edge from i to j with weight −c",
        "A bidirectional edge",
      ],
      answer: 0,
      explanation:
        "The constraint x_j − x_i ≤ c matches the relaxation d[j] ≤ d[i] + c, so edge (i, j, c).",
      hints: ["Compare with Bellman–Ford's relaxation condition."],
      objective: "Map constraints to graph edges",
    },
  ],
  exam: {
    definition:
      "Difference constraints x_j − x_i ≤ c are solved by reducing to shortest paths with Bellman–Ford.",
    steps: [
      "Build constraint graph: edge (i,j,c) for each x_j − x_i ≤ c.",
      "Add source vertex with zero-weight edges to all.",
      "Run Bellman–Ford; distances give the solution.",
    ],
    timeComplexity: "O(nm)",
    spaceComplexity: "O(n + m)",
    correctness:
      "Shortest-path distances satisfy all relaxation inequalities, which are exactly the constraints.",
    applications: ["Scheduling", "Circuit timing", "LP relaxation"],
    limitations: ["Only handles difference constraints, not general linear constraints"],
    faq: [
      {
        q: "What does a negative cycle mean?",
        a: "The constraints are contradictory (infeasible).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Reduction to Bellman–Ford.", "Negative cycle = infeasible."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009, §24.4.",
      supports: "Difference constraints and shortest paths.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
