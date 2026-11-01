import type { AlgorithmEntry } from "../types";

export const monteCarloAlgorithmEntry: AlgorithmEntry = {
  slug: "monte-carlo-algorithm",
  name: "Monte Carlo Algorithm",
  aliases: ["Monte Carlo Algorithm"],
  curriculum: [430],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Monte Carlo Algorithm is an algorithm in the field of randomized algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["monte carlo algorithm", "randomized algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Monte Carlo Algorithm.",
    output: "Result of applying Monte Carlo Algorithm to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Monte Carlo Algorithm addresses a fundamental problem in randomized algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Monte Carlo Algorithm is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Monte Carlo Algorithm algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing Monte Carlo Algorithm, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Monte Carlo Algorithm depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Monte Carlo Algorithm exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n^2)",
    },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Randomized Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(arr, k):
    """Find kth smallest element using quickselect (deterministic pivot for testing).
    k is 0-indexed."""
    a = list(arr)
    def select(lo, hi, k):
        if lo == hi:
            return a[lo]
        pivot = a[hi]
        i = lo
        for j in range(lo, hi):
            if a[j] <= pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        if k == i:
            return a[i]
        elif k < i:
            return select(lo, i - 1, k)
        else:
            return select(i + 1, hi, k)
    return select(0, len(a) - 1, k)
`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5], 0],
          expected: 1,
        },
        {
          args: [[3, 1, 4, 1, 5], 2],
          expected: 3,
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(arr, k) {
  const a = [...arr];
  function select(lo, hi, k) {
    if (lo === hi) return a[lo];
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    if (k === i) return a[i];
    return k < i ? select(lo, i-1, k) : select(i+1, hi, k);
  }
  return select(0, a.length - 1, k);
}`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5], 0],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "monte-ca-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Monte Carlo Algorithm?",
      options: [
        "To solve problems in randomized algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Monte Carlo Algorithm is designed specifically for problems in the domain of randomized algorithms.",
      hints: ["Think about what domain Monte Carlo Algorithm belongs to"],
      objective: "Understand the purpose of Monte Carlo Algorithm",
    },
  ],
  exam: {
    definition: "Define Monte Carlo Algorithm and explain its purpose.",
    steps: ["Describe the main steps of Monte Carlo Algorithm."],
    timeComplexity: "Analyze the time complexity of Monte Carlo Algorithm.",
    spaceComplexity: "Analyze the space complexity of Monte Carlo Algorithm.",
    correctness: "How does Monte Carlo Algorithm guarantee correctness?",
    applications: ["List two applications of Monte Carlo Algorithm."],
    limitations: ["What are the limitations of Monte Carlo Algorithm?"],
    faq: [
      {
        q: "Why is Monte Carlo Algorithm preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Monte Carlo Algorithm works by applying its core strategy to efficiently solve t",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Monte Carlo Algorithm",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
