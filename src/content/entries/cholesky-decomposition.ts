import type { AlgorithmEntry } from "../types";

export const choleskyDecompositionEntry: AlgorithmEntry = {
  slug: "cholesky-decomposition",
  name: "Cholesky Decomposition",
  aliases: ["Cholesky Factorization"],
  curriculum: [389],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Decomposes a symmetric positive-definite matrix A into L * L^T where L is lower triangular, providing a numerically stable and efficient way to solve linear systems and compute determinants.",
  tags: ["linear algebra", "matrix decomposition", "numerical methods"],
  prerequisites: ["Matrix Multiplication"],
  related: ["lu-decomposition", "qr-decomposition"],
  problem: {
    input: "A symmetric positive-definite n x n matrix A.",
    output: "A lower triangular matrix L such that A = L * L^T.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Every symmetric positive-definite matrix can be written as L*L^T where L is lower triangular. This is like taking the square root of a matrix. Once you have L, solving Ax = b becomes two easy triangular solves: Ly = b (forward substitution) then L^T x = y (back substitution).",
      },
      {
        kind: "p",
        text: "Cholesky is about twice as fast as general LU decomposition because it exploits symmetry, and it's numerically stable without pivoting.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For i = 0 to n-1:",
          "  L[i][i] = sqrt(A[i][i] - sum(L[i][k]^2 for k < i))",
          "  For j = i+1 to n-1:",
          "    L[j][i] = (A[j][i] - sum(L[j][k]*L[i][k] for k < i)) / L[i][i]",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: A = [[4, 2], [2, 5]].",
      },
      {
        kind: "p",
        text: "L[0][0] = sqrt(4) = 2. L[1][0] = 2/2 = 1. L[1][1] = sqrt(5 - 1) = 2. So L = [[2, 0], [1, 2]]. Check: L*L^T = [[4, 2], [2, 5]]. Correct!",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "If the matrix is not positive-definite, a diagonal entry will be zero or negative under the square root — use this as a check.",
          "For sparse matrices, sparse Cholesky (e.g., CHOLMOD) exploits the sparsity pattern.",
          "The incomplete Cholesky factorization is a preconditioner for iterative solvers.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Time**: O(n^3 / 3), about half the cost of LU decomposition.",
      },
      {
        kind: "p",
        text: "**Numerical stability**: The algorithm is backward-stable without pivoting for positive-definite matrices.",
      },
      {
        kind: "p",
        text: "**Determinant**: det(A) = product of L[i][i]^2.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "LDL^T decomposition avoids square roots by splitting into L * D * L^T with diagonal D.",
          "Block Cholesky processes the matrix in blocks for cache efficiency.",
          "In optimization, Cholesky updates efficiently handle rank-1 changes to the matrix.",
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
    note: "About n^3/3 operations, half of LU.",
  },
  properties: [
    {
      label: "Requires",
      value: "Symmetric positive-definite matrix",
    },
    {
      label: "Stable",
      value: "Yes, without pivoting",
    },
    {
      label: "Speed vs LU",
      value: "~2x faster",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "cholesky",
      code: `import math

def cholesky(A):
    """Cholesky decomposition. Returns L such that A = L * L^T."""
    n = len(A)
    L = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1):
            s = sum(L[i][k] * L[j][k] for k in range(j))
            if i == j:
                L[i][j] = math.sqrt(A[i][i] - s)
            else:
                L[i][j] = (A[i][j] - s) / L[j][j]
    return L

def cholesky_test(A):
    L = cholesky(A)
    return [[round(x, 4) for x in row] for row in L]
`,
      tests: [
        {
          args: [
            [
              [4, 2],
              [2, 5],
            ],
          ],
          expected: [
            [2.0, 0.0],
            [1.0, 2.0],
          ],
        },
        {
          args: [
            [
              [1, 0],
              [0, 1],
            ],
          ],
          expected: [
            [1.0, 0.0],
            [0.0, 1.0],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "chol-req",
      kind: "mcq",
      prompt: "What property must a matrix have for Cholesky decomposition to exist?",
      options: ["Invertible", "Symmetric positive-definite", "Orthogonal", "Diagonal"],
      answer: 1,
      explanation:
        "Cholesky requires the matrix to be symmetric (A = A^T) and positive-definite (all eigenvalues > 0).",
      hints: ["What can go wrong with a non-positive matrix?"],
      objective: "Know Cholesky prerequisites",
    },
  ],
  exam: {
    definition:
      "Cholesky decomposes a symmetric positive-definite matrix A into L*L^T where L is lower triangular, in O(n^3/3) time.",
    steps: [
      "For each diagonal: L[i][i] = sqrt(A[i][i] - sum of squares)",
      "For each below-diagonal: L[j][i] = (A[j][i] - dot product) / L[i][i]",
    ],
    timeComplexity: "O(n^3)",
    spaceComplexity: "O(n^2)",
    correctness:
      "Positive-definiteness ensures all diagonal entries under the square root are positive. Uniqueness follows from the structure of triangular systems.",
    applications: ["Solving linear systems", "Gaussian processes", "Monte Carlo simulation"],
    limitations: ["Only for SPD matrices", "O(n^3) for dense matrices"],
    faq: [
      {
        q: "Why faster than LU?",
        a: "Symmetry means only the lower triangle needs computation, halving the work.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["L*L^T factorization for SPD matrices in O(n^3/3) (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "G. H. Golub and C. F. Van Loan, Matrix Computations, 4th ed., Johns Hopkins, 2013, §4.2.",
      supports: "Cholesky factorization and its applications.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
