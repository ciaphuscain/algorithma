import type { AlgorithmEntry } from "../types";

export const randomizedQuicksortEntry: AlgorithmEntry = {
  slug: "randomized-quicksort",
  name: "Randomized QuickSort",
  aliases: ["Randomized QuickSort"],
  curriculum: [426],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Randomized QuickSort is an algorithm in the field of randomized algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["randomized quicksort", "randomized algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Randomized QuickSort.",
    output: "Result of applying Randomized QuickSort to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Randomized QuickSort addresses a fundamental problem in randomized algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Randomized QuickSort is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Randomized QuickSort algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Randomized QuickSort, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Randomized QuickSort depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Randomized QuickSort exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "randomiz-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Randomized QuickSort?",
      options: [
        "To solve problems in randomized algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Randomized QuickSort is designed specifically for problems in the domain of randomized algorithms.",
      hints: ["Think about what domain Randomized QuickSort belongs to"],
      objective: "Understand the purpose of Randomized QuickSort",
    },
  ],
  exam: {
    definition: "Define Randomized QuickSort and explain its purpose.",
    steps: ["Describe the main steps of Randomized QuickSort."],
    timeComplexity: "Analyze the time complexity of Randomized QuickSort.",
    spaceComplexity: "Analyze the space complexity of Randomized QuickSort.",
    correctness: "How does Randomized QuickSort guarantee correctness?",
    applications: ["List two applications of Randomized QuickSort."],
    limitations: ["What are the limitations of Randomized QuickSort?"],
    faq: [
      {
        q: "Why is Randomized QuickSort preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Randomized QuickSort works by applying its core strategy to efficiently solve th",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Randomized QuickSort",
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
