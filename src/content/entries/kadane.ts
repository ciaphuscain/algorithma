import type { AlgorithmEntry } from "../types";

export const kadaneEntry: AlgorithmEntry = {
  slug: "kadane",
  name: "Kadane's Algorithm",
  aliases: ["Maximum subarray", "Maximum subarray sum", "Largest sum contiguous subarray"],
  curriculum: [53],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "intermediate",
  summary:
    "Find the contiguous subarray with the largest sum in one pass: keep the best sum of a subarray ending at the current position, which either extends the previous one or starts afresh when the previous sum is negative.",
  tags: ["dynamic programming", "maximum subarray", "greedy", "one pass"],
  prerequisites: ["Prefix Sums"],
  related: ["prefix-sums", "sliding-window", "lis"],
  problem: {
    input: "An array of n numbers, some possibly negative.",
    output: "The largest sum of a non-empty contiguous subarray, and where it is.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Walk along the array carrying a running total. If at some point your total has become negative, it can only drag down whatever comes next, so throw it away and start a new run from the current element. Along the way, remember the best total you have ever had. That is the whole algorithm.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "cur = best = A[0].",
          "For each next element x: cur = x if cur < 0, else cur + x.",
          "If cur > best, record best and the current run's start and end.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [−2, 1, −3, 4, −1, 2, 1, −5, 4]. The run restarts at 1, then at 4 (both times the running sum was negative). From 4 it goes 4, 3, 5, 6, 1, 5; the best is 6, from A[3..6] = [4, −1, 2, 1]. With all values negative (second preset) the answer is the largest single value, −2.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Initialising with A[0] (not 0) handles all-negative arrays; the variant that starts from 0 returns 0, the empty subarray.",
          "Ties: this version keeps the first best run, because it updates only on a strictly larger sum.",
          "The same idea works on a circular array (take the better of the plain answer and total − minimum subarray) and in 2-D (fix two rows, run Kadane on column sums: O(n³)).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**As dynamic programming.** Let E(i) be the best sum of a subarray ending exactly at i. Then E(0) = A[0] and E(i) = A[i] + max(E(i − 1), 0): the best subarray ending at i either is A[i] alone or extends the best one ending at i − 1. The answer is max_i E(i). **Cost:** one pass, O(n) time and O(1) space; any algorithm must read every element. The tests compare with an O(n²) search over all subarrays.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bentley (1984) tells the story: Grenander posed the problem, Shamos found an O(n log n) divide-and-conquer, and Kadane found the linear scan within minutes of hearing it.",
          "With prefix sums P, the answer is max over r of P[r + 1] − min_{l ≤ r} P[l], the same scan in another form.",
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
      label: "Passes",
      value: "One",
    },
    {
      label: "Paradigm",
      value: "Dynamic programming",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "max_subarray",
      code: `def max_subarray(a):
    best = cur = a[0]
    for x in a[1:]:
        cur = x if cur < 0 else cur + x
        best = max(best, cur)
    return best
`,
      tests: [
        {
          args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
          expected: 6,
        },
        {
          args: [[-8, -3, -6, -2, -5, -4]],
          expected: -2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxSubarray",
      code: `// Returns [sum, start, end] of the first maximum-sum subarray.
function maxSubarray(a) {
  let cur = a[0], best = a[0], s = 0, bl = 0, br = 0;
  for (let i = 1; i < a.length; i++) {
    if (cur < 0) { cur = a[i]; s = i; } else cur += a[i];
    if (cur > best) { best = cur; bl = s; br = i; }
  }
  return [best, bl, br];
}
`,
      tests: [
        {
          args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
          expected: [6, 3, 6],
        },
        {
          args: [[2, 3, 1, 4]],
          expected: [10, 0, 3],
        },
      ],
    },
  ],
  visualizer: "kadane",
  practice: [
    {
      id: "kad-num",
      kind: "numeric",
      prompt: "What is the maximum subarray sum of [5, −9, 6, −2, 3]?",
      answer: 7,
      explanation: "6 − 2 + 3 = 7; including the 5 would require the −9.",
      hints: ["Where does the running sum go negative?"],
      objective: "Run the algorithm",
    },
    {
      id: "kad-reset",
      kind: "mcq",
      prompt: "When does Kadane's algorithm start a new run at A[i]?",
      options: [
        "When the running sum before A[i] is negative",
        "When A[i] is negative",
        "When A[i] is larger than the best",
        "Never",
      ],
      answer: 0,
      explanation: "A negative prefix can only lower any sum that includes it.",
      distractors: {
        "1": "A negative element can still be worth crossing, as with −1 in the example.",
        "2": "That updates best, not the run.",
        "3": "Then all-positive runs would be the only option.",
      },
      hints: ["What does a negative prefix add?"],
      objective: "Recurrence",
    },
  ],
  exam: {
    definition:
      "Kadane's algorithm finds the maximum-sum contiguous subarray by tracking the best sum of a subarray ending at each position.",
    steps: ["cur = best = A[0].", "cur = max(A[i], cur + A[i]).", "best = max(best, cur)."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "E(i) = A[i] + max(E(i − 1), 0) is the best sum ending at i, and every subarray ends somewhere.",
    applications: [
      "Maximum profit from one buy and sell (on price differences)",
      "Signal and image analysis (2-D version)",
    ],
    limitations: ["Contiguous subarrays only"],
    faq: [
      {
        q: "What if the empty subarray is allowed?",
        a: "Start best and cur at 0; the answer is then never negative.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Recurrence E(i) (2).",
          "Algorithm (1).",
          "All-negative case (1).",
          "Complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Bentley, “Programming pearls: algorithm design techniques,” Communications of the ACM, 27(9), 1984, pp. 865–873.",
      supports: "The maximum subarray problem, its history and the linear-time scan.",
    },
    {
      citation: "J. Bentley, Programming Pearls, 2nd ed., Addison-Wesley, 2000, Column 8.",
      supports: "Development of the O(n) algorithm and its invariant.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
