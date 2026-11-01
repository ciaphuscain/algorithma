import type { AlgorithmEntry } from "../types";

export const climbingStairsEntry: AlgorithmEntry = {
  slug: "climbing-stairs",
  name: "Climbing Stairs",
  aliases: [
    "Climbing Stairs",
    "Staircase problem",
  ],
  curriculum: [
    257,
  ],
  domain: "dynamic-programming",
  subcategory: "Classic DP",
  difficulty: "beginner",
  summary: "Counts the number of distinct ways to climb n stairs taking 1 or 2 steps at a time, equivalent to computing Fibonacci numbers.",
  tags: [
    "climbing stairs",
    "dynamic programming",
    "fibonacci",
  ],
  prerequisites: [
    "Fibonacci Numbers (DP)",
  ],
  related: [
    "fibonacci-dp",
    "min-cost-climbing-stairs",
  ],
  problem: {
    input: "A positive integer n (number of stairs).",
    output: "The number of distinct ways to reach the top.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To reach step n, you either came from step n-1 (one step) or step n-2 (two steps). So ways(n) = ways(n-1) + ways(n-2) — exactly the Fibonacci recurrence.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "ways(1) = 1 (just take one step).",
          "ways(2) = 2 (1+1 or 2).",
          "For i from 3 to n: ways(i) = ways(i-1) + ways(i-2).",
          "Return ways(n).",
        ],
      },
      {
        kind: "table",
        head: [
          "n",
          "1",
          "2",
          "3",
          "4",
          "5",
        ],
        rows: [
          [
            "ways",
            "1",
            "2",
            "3",
            "5",
            "8",
          ],
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use two variables like Fibonacci for O(1) space.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$\\text{ways}(n) = F(n+1)$ where $F$ is the Fibonacci sequence. Time $O(n)$, space $O(1)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Generalize to k steps: ways(n) = sum of ways(n-1) through ways(n-k).",
          "Matrix exponentiation for O(log n) with k steps.",
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
      label: "Pattern",
      value: "Fibonacci-like recurrence",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "climb_stairs",
      code: `def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
`,
      tests: [
        {
          args: [
            1,
          ],
          expected: 1,
        },
        {
          args: [
            2,
          ],
          expected: 2,
        },
        {
          args: [
            3,
          ],
          expected: 3,
        },
        {
          args: [
            5,
          ],
          expected: 8,
        },
        {
          args: [
            10,
          ],
          expected: 89,
        },
      ],
    },
    {
      language: "javascript",
      entry: "climbStairs",
      code: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) { const t = a + b; a = b; b = t; }
  return b;
}
`,
      tests: [
        {
          args: [
            1,
          ],
          expected: 1,
        },
        {
          args: [
            5,
          ],
          expected: 8,
        },
        {
          args: [
            10,
          ],
          expected: 89,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "climbing-stairs-q1",
      kind: "mcq",
      prompt: "How many ways to climb 4 stairs?",
      options: [
        "5",
        "4",
        "8",
        "3",
      ],
      answer: 0,
      explanation: "ways(4) = ways(3) + ways(2) = 3 + 2 = 5.",
      hints: [
        "Build from ways(1)=1, ways(2)=2.",
      ],
      objective: "Counting",
    },
  ],
  exam: {
    definition: "Count distinct ways to climb n stairs with 1 or 2 steps at a time.",
    steps: [
      "Base: ways(1)=1, ways(2)=2.",
      "Recurrence: ways(i) = ways(i-1) + ways(i-2).",
      "Return ways(n).",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "Each step can be reached from exactly the previous one or two steps.",
    applications: [
      "combinatorics",
      "tiling problems",
    ],
    limitations: [
      "Exponential growth of answer",
    ],
    faq: [
      {
        q: "Why is this Fibonacci?",
        a: "Same recurrence with different base cases: ways(1)=1, ways(2)=2 vs F(1)=1, F(2)=1.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "State recurrence (1).",
          "Show iteration (2).",
          "Prove correctness by induction (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Dynamic programming.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
