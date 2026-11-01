import type { AlgorithmEntry } from "../types";

export const kirchhoffMatrixTreeCountingEntry: AlgorithmEntry = {
  slug: "kirchhoff-matrix-tree-counting",
  name: "Kirchhoff Matrix-Tree Counting",
  aliases: [
    "Kirchhoff's theorem",
    "Matrix tree theorem",
  ],
  curriculum: [
    512,
  ],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Counts the number of spanning trees of a graph by computing a cofactor of the Laplacian matrix, using the matrix tree theorem.",
  tags: [
    "spanning tree",
    "Laplacian",
    "determinant",
    "graph",
  ],
  prerequisites: [
    "Graph Theory",
    "Linear Algebra",
  ],
  related: [
    "kruskal",
    "prim",
  ],
  problem: {
    input: "An undirected graph with n vertices.",
    output: "The number of spanning trees.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The Laplacian matrix L = D - A, where D is the degree matrix and A is the adjacency matrix, encodes the graph's structure. Kirchhoff's theorem says: delete any row and column from L, and the determinant of the resulting (n-1)×(n-1) matrix equals the number of spanning trees.",
      },
      {
        kind: "p",
        text: "This is remarkable: a combinatorial counting problem reduces to a single determinant computation, solvable in O(n³).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build the adjacency matrix A and degree matrix D.",
          "Compute the Laplacian L = D - A.",
          "Delete row 0 and column 0 (any row/column works).",
          "Compute the determinant of the resulting matrix.",
          "The determinant equals the spanning tree count.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Triangle graph (3 vertices, 3 edges). L = [[2,-1,-1],[-1,2,-1],[-1,-1,2]]. Delete row 0 and col 0: [[2,-1],[-1,2]]. det = 4-1 = 3. The triangle has 3 spanning trees (each obtained by removing one edge).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use Gaussian elimination for the determinant — O(n³).",
          "For integer results, use fraction-free elimination or work modulo a prime.",
          "The result is always a non-negative integer.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Kirchhoff's theorem: the number of spanning trees equals any cofactor of L. All cofactors are equal because L has rank n-1 (its null space is the all-ones vector).",
      },
      {
        kind: "p",
        text: "Equivalently, the count is $\\frac{1}{n}\\prod_{i=1}^{n-1} \\lambda_i$ where $\\lambda_i$ are the non-zero eigenvalues of L.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For complete graph $K_n$: Cayley's formula gives $n^{n-2}$ spanning trees.",
          "Generalizes to directed graphs (counting arborescences) via the directed Laplacian.",
          "Used in network reliability and random spanning tree generation.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^3)",
      average: "O(n^3)",
      worst: "O(n^3)",
    },
    space: "O(n^2)",
    worstClass: "n^3",
    note: "Dominated by determinant computation.",
  },
  properties: [
    {
      label: "Exact count",
      value: "Yes, not approximate",
    },
    {
      label: "Matrix-based",
      value: "Uses Laplacian determinant",
    },
    {
      label: "Polynomial time",
      value: "O(n³) via Gaussian elimination",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "count_spanning_trees",
      code: `def count_spanning_trees(n, edges):
    """Count spanning trees using Kirchhoff's matrix tree theorem.
    edges = list of [u, v] for undirected graph on vertices 0..n-1."""
    L = [[0]*n for _ in range(n)]
    for u, v in edges:
        L[u][v] -= 1
        L[v][u] -= 1
        L[u][u] += 1
        L[v][v] += 1
    # Delete row 0 and col 0
    M = [[L[i][j] for j in range(1, n)] for i in range(1, n)]
    # Gaussian elimination for determinant
    size = n - 1
    det = 1.0
    for col in range(size):
        pivot = -1
        for row in range(col, size):
            if M[row][col] != 0:
                pivot = row
                break
        if pivot == -1:
            return 0
        if pivot != col:
            M[col], M[pivot] = M[pivot], M[col]
            det *= -1
        det *= M[col][col]
        for row in range(col + 1, size):
            factor = M[row][col] / M[col][col]
            for j in range(col, size):
                M[row][j] -= factor * M[col][j]
    return round(det)
`,
      tests: [
        {
          args: [
            3,
            [
              [
                0,
                1,
              ],
              [
                1,
                2,
              ],
              [
                0,
                2,
              ],
            ],
          ],
          expected: 3,
        },
        {
          args: [
            4,
            [
              [
                0,
                1,
              ],
              [
                0,
                2,
              ],
              [
                0,
                3,
              ],
              [
                1,
                2,
              ],
              [
                1,
                3,
              ],
              [
                2,
                3,
              ],
            ],
          ],
          expected: 16,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "kirchhoff-what",
      kind: "mcq",
      prompt: "What does the matrix tree theorem count?",
      options: [
        "Spanning trees via a Laplacian cofactor",
        "Shortest paths",
        "Connected components",
        "Eulerian circuits",
      ],
      answer: 0,
      explanation: "The determinant of any cofactor of the Laplacian matrix equals the number of spanning trees.",
      hints: [
        "It involves the Laplacian matrix L = D - A.",
      ],
      objective: "State the matrix tree theorem",
    },
  ],
  exam: {
    definition: "Kirchhoff's theorem counts spanning trees as the determinant of any cofactor of the Laplacian matrix L = D - A.",
    steps: [
      "Build Laplacian L = D - A.",
      "Delete one row and column.",
      "Compute determinant.",
    ],
    timeComplexity: "$O(n^3)$",
    spaceComplexity: "$O(n^2)$",
    correctness: "L has rank n-1; all cofactors are equal and count spanning trees.",
    applications: [
      "Spanning tree counting",
      "Network reliability",
      "Random tree generation",
    ],
    limitations: [
      "Only counts, doesn't enumerate",
      "Numerical issues for large graphs",
    ],
    faq: [
      {
        q: "How many spanning trees does K_n have?",
        a: "n^{n-2} by Cayley's formula, a special case.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Laplacian construction and cofactor computation (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "G. Kirchhoff, 'Über die Auflösung der Gleichungen,' Annalen der Physik, 148(12), 1847.",
      supports: "The original matrix tree theorem.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
