import type { AlgorithmEntry } from "../types";

export const determinantComputationEntry: AlgorithmEntry = {
  slug: "determinant-computation",
  name: "Determinant Computation",
  aliases: ["Matrix Determinant", "Gaussian elimination determinant"],
  curriculum: [398],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Computes the determinant of an n×n matrix using Gaussian elimination to reduce to upper triangular form, then multiplies the diagonal entries, in O(n³) time.",
  tags: ["linear algebra", "matrix", "Gaussian elimination"],
  prerequisites: ["Gaussian Elimination"],
  related: ["gaussian-elimination"],
  problem: {
    input: "An n×n matrix of numbers.",
    output: "The determinant of the matrix.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The determinant measures the signed volume scaling factor of a linear transformation. A zero determinant means the matrix is singular (maps space onto a lower dimension). For a 2×2 matrix [[a,b],[c,d]], it is ad − bc.",
      },
      {
        kind: "p",
        text: "Computing determinants via the cofactor expansion takes O(n!) time. Instead, row-reduce to upper triangular form using Gaussian elimination, then multiply the diagonal — the determinant of a triangular matrix is just the product of its diagonal entries.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Copy the matrix. Set sign = 1.",
          "For each column c from 0 to n−1, find a pivot row with a nonzero entry in column c (partial pivoting). If a row swap is needed, negate sign.",
          "Eliminate entries below the pivot by subtracting multiples of the pivot row.",
          "After reduction, det = sign × product of diagonal entries.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** for [[2,1],[5,3]]:",
      },
      {
        kind: "table",
        head: ["Step", "Matrix", "sign"],
        rows: [
          ["Start", "[[2,1],[5,3]]", "+1"],
          ["R1 ← R1 − (5/2)R0", "[[2,1],[0,0.5]]", "+1"],
          ["det = 1 × 2 × 0.5 = 1", "", ""],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use partial pivoting to improve numerical stability.",
          "For exact integer determinants, use fraction-free elimination or compute modulo primes and use CRT.",
          "The determinant changes sign with each row swap and is multiplied by the scalar when a row is scaled.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness:** Row operations preserve the determinant (up to sign for swaps and scaling). The upper triangular form has determinant equal to the product of diagonal entries.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(n³) time (Gaussian elimination), O(n²) space for the matrix copy.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bareiss algorithm computes integer determinants without fractions in O(n³).",
          "For sparse matrices, LU decomposition variants can be faster.",
          "The determinant relates to eigenvalues: det(A) = product of eigenvalues.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n³)",
      average: "O(n³)",
      worst: "O(n³)",
    },
    space: "O(n²)",
    worstClass: "n^3",
    note: "Gaussian elimination on an n×n matrix.",
  },
  properties: [
    {
      label: "Approach",
      value: "Row reduction to triangular form",
    },
    {
      label: "Numeric stability",
      value: "Partial pivoting recommended",
    },
    {
      label: "Result",
      value: "Signed scalar (volume scaling factor)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "determinant",
      code: `def determinant(matrix):
    """Compute determinant via Gaussian elimination with partial pivoting."""
    n = len(matrix)
    m = [row[:] for row in matrix]
    sign = 1
    for c in range(n):
        pivot = None
        for r in range(c, n):
            if m[r][c] != 0:
                pivot = r
                break
        if pivot is None:
            return 0
        if pivot != c:
            m[c], m[pivot] = m[pivot], m[c]
            sign *= -1
        for r in range(c + 1, n):
            if m[r][c] != 0:
                factor = m[r][c] / m[c][c]
                for j in range(c, n):
                    m[r][j] -= factor * m[c][j]
    result = sign
    for i in range(n):
        result *= m[i][i]
    return round(result, 10)
`,
      tests: [
        {
          args: [
            [
              [2, 1],
              [5, 3],
            ],
          ],
          expected: 1,
        },
        {
          args: [
            [
              [1, 0],
              [0, 1],
            ],
          ],
          expected: 1,
        },
        {
          args: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
          expected: -2,
        },
        {
          args: [
            [
              [0, 1],
              [1, 0],
            ],
          ],
          expected: -1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "det-triangular",
      kind: "mcq",
      prompt: "What is the determinant of an upper triangular matrix?",
      options: [
        "Product of the diagonal entries",
        "Sum of the diagonal entries",
        "Product of all entries",
        "Always 1",
      ],
      answer: 0,
      explanation:
        "For a triangular matrix, the determinant equals the product of its diagonal entries.",
      hints: ["Think about what row reduction leaves behind."],
      objective: "Know properties of triangular determinants",
    },
  ],
  exam: {
    definition:
      "The determinant of a matrix is computed by reducing to triangular form via Gaussian elimination and multiplying diagonal entries.",
    steps: [
      "Row-reduce with partial pivoting.",
      "Track sign changes from row swaps.",
      "Multiply diagonal entries with accumulated sign.",
    ],
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n²)",
    correctness:
      "Row operations preserve the determinant (with sign flips for swaps). Triangular determinant is the diagonal product.",
    applications: ["Solving linear systems", "Checking matrix singularity", "Volume computation"],
    limitations: ["Numerical precision for floating-point matrices"],
    faq: [
      {
        q: "Why not use cofactor expansion?",
        a: "It takes O(n!) time, exponentially slower than Gaussian elimination.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Row-reduce to triangular form.", "det = sign × product of diagonal."],
      },
    ],
  },
  references: [
    {
      citation:
        "G. H. Golub, C. F. Van Loan, Matrix Computations, 4th ed., Johns Hopkins University Press, 2013.",
      supports: "Gaussian elimination and determinant computation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
