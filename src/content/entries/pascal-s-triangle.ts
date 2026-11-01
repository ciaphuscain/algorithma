import type { AlgorithmEntry } from "../types";

export const pascalSTriangleEntry: AlgorithmEntry = {
  slug: "pascal-s-triangle",
  name: "Pascal's Triangle",
  aliases: ["Binomial Triangle"],
  curriculum: [379],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Constructs the triangle of binomial coefficients row by row, where each entry is the sum of the two entries above it, enabling O(n²) computation of all C(n,k) for k ≤ n.",
  tags: ["combinatorics", "binomial coefficients", "dynamic programming"],
  prerequisites: [],
  related: ["binomial-coefficient-dp", "catalan-numbers"],
  problem: {
    input: "A non-negative integer n.",
    output: "The first n+1 rows of Pascal's triangle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Pascal's triangle starts with a 1 at the top. Each subsequent row is built by adding adjacent pairs from the row above, with 1s at the edges. Row n contains the binomial coefficients C(n,0) through C(n,n).",
      },
      {
        kind: "p",
        text: "This simple addition rule avoids the factorials in the binomial formula, making it numerically stable and fast for computing many coefficients at once.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Row 0 = [1].",
          "For each row i from 1 to n: row[i][0] = row[i][i] = 1, and row[i][j] = row[i−1][j−1] + row[i−1][j] for 0 < j < i.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** Rows 0–4: [1], [1,1], [1,2,1], [1,3,3,1], [1,4,6,4,1].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Only the previous row is needed, so space can be O(n) instead of O(n²).",
          "For a single C(n,k), iterate from 1 to k: C = C * (n−i+1) / i.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$C(n,k) = C(n-1,k-1) + C(n-1,k)$ is Pascal's rule. Building row by row takes $O(n^2)$ time and $O(n)$ space (keeping only the current row).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Row n modulo a prime p has a fractal structure related to Sierpinski's triangle.",
          "Lucas' theorem gives C(n,k) mod p from the base-p digits of n and k.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^2)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
    space: "O(n)",
    worstClass: "n^2",
    note: "To build all rows up to n. Single C(n,k) in O(k).",
  },
  properties: [
    {
      label: "Recurrence",
      value: "$C(n,k) = C(n-1,k-1) + C(n-1,k)$",
    },
    {
      label: "Symmetry",
      value: "$C(n,k) = C(n, n-k)$",
    },
    {
      label: "Row sum",
      value: "$2^n$",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "pascals_triangle",
      code: `def pascals_triangle(n):
    """Return first n+1 rows of Pascal's triangle."""
    rows = [[1]]
    for i in range(1, n + 1):
        prev = rows[-1]
        row = [1]
        for j in range(1, i):
            row.append(prev[j - 1] + prev[j])
        row.append(1)
        rows.append(row)
    return rows
`,
      tests: [
        {
          args: [0],
          expected: [[1]],
        },
        {
          args: [4],
          expected: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pascal-sum",
      kind: "mcq",
      prompt: "What is the sum of all entries in row n of Pascal's triangle?",
      options: ["2^n", "n!", "n^2", "n+1"],
      answer: 0,
      explanation: "Sum of row n = Σ C(n,k) = 2^n, because (1+1)^n = 2^n by the binomial theorem.",
      hints: ["Evaluate (1+1)^n using the binomial theorem."],
      objective: "Know row sum property",
    },
  ],
  exam: {
    definition:
      "Pascal's triangle builds binomial coefficients row by row using C(n,k) = C(n−1,k−1) + C(n−1,k).",
    steps: ["Start with [1].", "Each row: edges are 1, interior entries sum two above."],
    timeComplexity: "$O(n^2)$ for all rows.",
    spaceComplexity: "$O(n)$ keeping one row.",
    correctness:
      "Pascal's rule follows from the combinatorial identity: choosing k from n either includes or excludes the nth element.",
    applications: ["Binomial coefficient computation", "Probability", "Polynomial expansion"],
    limitations: ["O(n²) to build full triangle"],
    faq: [
      {
        q: "Why avoid factorials?",
        a: "Factorials grow rapidly and cause overflow; the addition rule keeps numbers smaller and is exact for integers.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Pascal's rule and row-by-row construction (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "R. L. Graham, D. E. Knuth, O. Patashnik, Concrete Mathematics, 2nd ed., Addison-Wesley, 1994, Ch. 5.",
      supports: "Binomial coefficients and Pascal's triangle.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
