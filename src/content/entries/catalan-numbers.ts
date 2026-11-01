import type { AlgorithmEntry } from "../types";

export const catalanNumbersEntry: AlgorithmEntry = {
  slug: "catalan-numbers",
  name: "Catalan Numbers",
  aliases: [],
  curriculum: [
    381,
  ],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary: "Computes the n-th Catalan number C_n = C(2n, n)/(n+1), which counts balanced parenthesizations, binary trees, triangulations, and many other combinatorial structures.",
  tags: [
    "combinatorics",
    "dynamic programming",
    "counting",
  ],
  prerequisites: [
    "Dynamic Programming",
    "Binomial Coefficients",
  ],
  related: [
    "binomial-coefficient-dp",
  ],
  problem: {
    input: "A non-negative integer n.",
    output: "The n-th Catalan number.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The Catalan numbers appear everywhere in combinatorics. C_n counts: the number of ways to correctly match n pairs of parentheses, the number of distinct binary trees with n nodes, the number of ways to triangulate a convex (n+2)-gon, and the number of monotone lattice paths from (0,0) to (n,n) that don't cross the diagonal.",
      },
      {
        kind: "p",
        text: "The recurrence C_n = sum(C_i * C_{n-1-i}) for i=0..n-1 reflects splitting: choose where the first matching close-paren goes (or where the root splits left/right subtrees), and count recursively.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Base case: C_0 = 1.",
          "Recurrence: C_n = sum_{i=0}^{n-1} C_i * C_{n-1-i}.",
          "Or direct formula: C_n = C(2n, n) / (n + 1).",
          "DP: compute C_0, C_1, ..., C_n iteratively.",
        ],
      },
      {
        kind: "p",
        text: "**First few values**: C_0=1, C_1=1, C_2=2, C_3=5, C_4=14, C_5=42.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The DP recurrence takes O(n^2) time.",
          "The direct formula C(2n,n)/(n+1) takes O(n) time but needs big integers or modular inverse.",
          "For modular arithmetic: C_n = C(2n, n) * modular_inverse(n+1, mod).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Closed form**: C_n = (2n)! / ((n+1)! * n!) = C(2n, n) / (n+1).",
      },
      {
        kind: "p",
        text: "**Generating function**: C(x) = (1 - sqrt(1 - 4x)) / (2x).",
      },
      {
        kind: "p",
        text: "**Asymptotic**: C_n ~ 4^n / (n^(3/2) * sqrt(pi)).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The ballot problem: in how many ways can candidate A always stay ahead of B during counting?",
          "Super Catalan numbers and their generalizations.",
          "Catalan numbers modulo a prime via Lucas' theorem.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
    note: "O(n) with the direct formula; O(n^2) with the DP recurrence.",
  },
  properties: [
    {
      label: "C_0",
      value: "1",
    },
    {
      label: "Growth",
      value: "~4^n / n^(3/2)",
    },
    {
      label: "Applications",
      value: "Parenthesizations, binary trees, triangulations",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "catalan",
      code: `def catalan(n):
    """Compute the n-th Catalan number."""
    if n <= 1:
        return 1
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(i):
            dp[i] += dp[j] * dp[i - 1 - j]
    return dp[n]
`,
      tests: [
        {
          args: [
            0,
          ],
          expected: 1,
        },
        {
          args: [
            3,
          ],
          expected: 5,
        },
        {
          args: [
            5,
          ],
          expected: 42,
        },
        {
          args: [
            10,
          ],
          expected: 16796,
        },
      ],
    },
  ],
  practice: [
    {
      id: "catalan-4",
      kind: "numeric",
      prompt: "What is the 4th Catalan number C_4?",
      answer: 14,
      explanation: "C_4 = C(8,4)/5 = 70/5 = 14. Or by recurrence: C_0*C_3 + C_1*C_2 + C_2*C_1 + C_3*C_0 = 5 + 2 + 2 + 5 = 14.",
      hints: [
        "Use the recurrence or the formula C(2n,n)/(n+1).",
      ],
      objective: "Compute a Catalan number",
    },
  ],
  exam: {
    definition: "The n-th Catalan number C_n = C(2n,n)/(n+1) counts balanced parenthesizations, binary trees, and many other structures, computable by DP or direct formula.",
    steps: [
      "C_0 = 1",
      "C_n = sum of C_i * C_{n-1-i}",
      "Or C_n = C(2n,n) / (n+1)",
    ],
    timeComplexity: "O(n) with formula, O(n^2) with DP",
    spaceComplexity: "O(n)",
    correctness: "The recurrence follows from choosing the split point. The closed form is derived via generating functions.",
    applications: [
      "Counting binary trees",
      "Parenthesization problems",
      "Polygon triangulation",
    ],
    limitations: [
      "Grows exponentially",
    ],
    faq: [
      {
        q: "Why C(2n,n)/(n+1)?",
        a: "C(2n,n) counts all lattice paths; dividing by n+1 removes those that cross the diagonal (ballot problem / reflection principle).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Recurrence, closed form, and counting interpretation (2)",
        ],
      },
    ],
  },
  references: [
    {
      citation: "R. P. Stanley, Catalan Numbers, Cambridge University Press, 2015.",
      supports: "Comprehensive treatment of Catalan numbers and their 200+ interpretations.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
