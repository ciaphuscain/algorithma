import type { AlgorithmEntry } from "../types";

export const parallelMatrixMultiplicationEntry: AlgorithmEntry = {
  slug: "parallel-matrix-multiplication",
  name: "Parallel Matrix Multiplication",
  aliases: ["Cannon's Algorithm", "SUMMA"],
  curriculum: [464],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Distributes the work of multiplying two n×n matrices across p processors, reducing time from O(n³) to O(n³/p) with various communication patterns depending on the memory model.",
  tags: ["parallel", "matrix", "linear algebra", "Cannon", "SUMMA"],
  prerequisites: ["Matrix Multiplication"],
  related: ["strassen-matrix-multiplication"],
  problem: {
    input: "Two n×n matrices A and B, and p processors.",
    output: "The product matrix C = A × B, computed in parallel.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each entry C[i][j] = Σ A[i][k]·B[k][j] is an independent dot product. With n² entries, each requiring n multiplications, there's plenty of parallelism. The challenge is distributing data so processors don't spend all their time communicating.",
      },
      {
        kind: "p",
        text: "Cannon's algorithm tiles the matrices across a √p × √p processor grid and shifts blocks systematically so each processor accumulates its portion of C without needing the full matrices.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Arrange p processors in a √p × √p grid.",
          "Distribute A and B in block fashion: processor (i,j) gets a block of A and a block of B.",
          "Initially skew: shift A's rows left by i and B's columns up by j.",
          "Repeat √p times: multiply local blocks, accumulate into C, shift A left by 1, shift B up by 1.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** 2×2 matrix on 4 processors (2×2 grid): each processor holds one element; after 2 shifts each has computed its output entry.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "SUMMA (Scalable Universal Matrix Multiply Algorithm) generalises to non-square processor grids.",
          "Cache-oblivious recursive multiplication also parallelises well via divide and conquer.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Computation: $O(n^3/p)$. Communication (Cannon's): $O(n^2/\\sqrt{p})$ data moved in $O(\\sqrt{p})$ steps. Memory per processor: $O(n^2/p)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Strassen's algorithm can be parallelised for O(n^{2.807}/p) work.",
          "Communication-avoiding algorithms (2.5D) trade extra memory for fewer communication rounds.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^3/p)",
      average: "O(n^3/p)",
      worst: "O(n^3/p)",
    },
    space: "O(n^2/p)",
    worstClass: "n^3",
    note: "Cannon's algorithm on a √p × √p grid.",
  },
  properties: [
    {
      label: "Work",
      value: "$O(n^3)$",
    },
    {
      label: "Communication",
      value: "$O(n^2/\\sqrt{p})$",
    },
    {
      label: "Memory per proc",
      value: "$O(n^2/p)$",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_matmul",
      code: `def parallel_matmul(A, B):
    """Standard matrix multiply (simulates parallel: each C[i][j] is independent). Returns C = A*B."""
    n = len(A)
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            s = 0
            for k in range(n):
                s += A[i][k] * B[k][j]
            C[i][j] = s
    return C
`,
      tests: [
        {
          args: [
            [
              [1, 2],
              [3, 4],
            ],
            [
              [5, 6],
              [7, 8],
            ],
          ],
          expected: [
            [19, 22],
            [43, 50],
          ],
        },
        {
          args: [
            [
              [1, 0],
              [0, 1],
            ],
            [
              [3, 4],
              [5, 6],
            ],
          ],
          expected: [
            [3, 4],
            [5, 6],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pmatmul-cannon",
      kind: "mcq",
      prompt: "In Cannon's algorithm, how are matrix blocks shifted?",
      options: [
        "A rows shift left, B columns shift up",
        "Both shift right",
        "A shifts up, B shifts left",
        "No shifting needed",
      ],
      answer: 0,
      explanation:
        "Cannon's algorithm shifts A blocks left and B blocks up so each processor sees all the blocks it needs.",
      hints: ["Think about how each processor accumulates its dot product."],
      objective: "Understand Cannon's algorithm",
    },
  ],
  exam: {
    definition:
      "Parallel matrix multiplication distributes n×n matrix product across p processors using block decomposition and systematic communication.",
    steps: [
      "Tile A, B across √p × √p grid.",
      "Skew initial placement.",
      "Repeat: local multiply, shift blocks.",
      "Accumulate C.",
    ],
    timeComplexity: "$O(n^3/p)$ compute, $O(n^2/\\sqrt{p})$ communication.",
    spaceComplexity: "$O(n^2/p)$ per processor.",
    correctness:
      "Each processor computes n/√p × n/√p block products; √p shifts ensure all needed blocks are seen.",
    applications: ["Scientific computing", "Deep learning training", "Dense linear algebra"],
    limitations: ["Communication can dominate on slow networks"],
    faq: [
      {
        q: "Why not just broadcast?",
        a: "Broadcasting the full matrices costs O(n²) per processor; Cannon's shifts only O(n²/p) data.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Block distribution and shift pattern (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        'L. E. Cannon, "A cellular computer to implement the Kalman filter algorithm," PhD thesis, Montana State University, 1969.',
      supports: "The original Cannon's algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
