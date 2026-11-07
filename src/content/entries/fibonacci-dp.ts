import type { AlgorithmEntry } from "../types";

export const fibonacciDpEntry: AlgorithmEntry = {
  slug: "fibonacci-dp",
  name: "Fibonacci Numbers (DP)",
  aliases: ["Fibonacci DP", "Fibonacci sequence"],
  curriculum: [256],
  domain: "dynamic-programming",
  subcategory: "Classic DP",
  difficulty: "beginner",
  summary:
    "Computes the n-th Fibonacci number using dynamic programming in O(n) time and O(1) space, avoiding the exponential blowup of naive recursion.",
  tags: ["fibonacci", "dynamic programming", "memoization", "tabulation"],
  prerequisites: [],
  related: ["climbing-stairs", "memoization-tabulation"],
  problem: {
    input: "A non-negative integer n.",
    output: "The n-th Fibonacci number F(n), where F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each Fibonacci number is the sum of the two before it. Naive recursion recomputes the same values exponentially many times. DP stores each value once.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set F(0) = 0, F(1) = 1.",
          "For i from 2 to n: F(i) = F(i-1) + F(i-2).",
          "Return F(n).",
        ],
      },
      {
        kind: "table",
        head: ["i", "0", "1", "2", "3", "4", "5", "6", "7"],
        rows: [["F(i)", "0", "1", "1", "2", "3", "5", "8", "13"]],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Since each F(i) depends only on the two preceding values, we only need two variables, giving O(1) space.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n)$, space $O(1)$. The closed form is $F(n) = \\frac{\\phi^n - \\psi^n}{\\sqrt{5}}$ where $\\phi = \\frac{1+\\sqrt{5}}{2}$, but it suffers from floating-point error for large n.",
      },
      {
        kind: "p",
        text: "Matrix exponentiation computes F(n) in $O(\\log n)$ time: $\\begin{pmatrix}1&1\\\\1&0\\end{pmatrix}^n = \\begin{pmatrix}F(n+1)&F(n)\\\\F(n)&F(n-1)\\end{pmatrix}$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Matrix exponentiation gives $O(\\log n)$ time.",
          "Pisano period: $F(n) \\bmod m$ is periodic for any $m$.",
          "Fibonacci numbers appear in the analysis of Euclid's algorithm (worst case inputs are consecutive Fibonacci numbers).",
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
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Recurrence",
      value: "F(n) = F(n-1) + F(n-2)",
    },
    {
      label: "Base cases",
      value: "F(0) = 0, F(1) = 1",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "fib",
      code: `def fib(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
`,
      tests: [
        {
          args: [0],
          expected: 0,
        },
        {
          args: [1],
          expected: 1,
        },
        {
          args: [10],
          expected: 55,
        },
        {
          args: [20],
          expected: 6765,
        },
      ],
    },
    {
      language: "javascript",
      entry: "fib",
      code: `function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t; }
  return b;
}
`,
      tests: [
        {
          args: [0],
          expected: 0,
        },
        {
          args: [10],
          expected: 55,
        },
        {
          args: [20],
          expected: 6765,
        },
      ],
    },
  ],
  visualizer: "fibonacci-dp",
  practice: [
    {
      id: "fibonacci-dp-q1",
      kind: "mcq",
      prompt: "What is the time complexity of computing F(n) with naive recursion?",
      options: ["O(2^n)", "O(n)", "O(n^2)", "O(log n)"],
      answer: 0,
      explanation:
        "Naive recursion has exponential time because it recomputes the same subproblems.",
      hints: ["Draw the recursion tree for F(5)."],
      objective: "Time complexity",
    },
  ],
  exam: {
    definition:
      "Fibonacci DP computes F(n) iteratively in O(n) time by building up from F(0) and F(1).",
    steps: ["Set a=0, b=1.", "Loop from 2 to n, updating a,b = b, a+b.", "Return b."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$ with two variables.",
    correctness: "Each iteration correctly computes F(i) = F(i-1) + F(i-2) bottom-up.",
    applications: ["algorithm analysis", "combinatorics", "nature patterns"],
    limitations: ["Large F(n) values require big integers"],
    faq: [
      {
        q: "Can we do better than O(n)?",
        a: "Yes, matrix exponentiation gives O(log n).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define recurrence (1).",
          "Show DP algorithm (2).",
          "Analyze time and space (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Dynamic programming introduction.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
