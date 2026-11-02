import type { AlgorithmEntry } from "../types";

export const fibonacciSearchEntry: AlgorithmEntry = {
  slug: "fibonacci-search",
  name: "Fibonacci Search",
  aliases: ["Fibonaccian search"],
  curriculum: [9],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "intermediate",
  summary:
    "A binary-search variant that splits the range at Fibonacci numbers, so probe positions are computed with additions and subtractions only. It needs about log_φ n ≈ 1.44 log₂ n comparisons in the worst case.",
  tags: ["searching", "sorted array", "Fibonacci numbers", "divide and conquer"],
  prerequisites: ["Binary search", "Fibonacci numbers"],
  related: ["binary-search", "uniform-binary-search", "fibonacci-heap"],
  problem: {
    input: "A sorted array and a target $x$.",
    output: "An index $k$ with $A[k] = x$, or $-1$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Fibonacci numbers split neatly: F(k) = F(k − 1) + F(k − 2). So a range of F(k) positions can be divided into a front part of F(k − 2) and a back part of F(k − 1), and whichever part survives is again a Fibonacci size. Moving to the next split is just a subtraction — no halving, no division.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Find the smallest Fibonacci number f = F(k) ≥ n, with b = F(k − 1) and a = F(k − 2). offset = −1 marks what has been eliminated at the front.",
          "Probe i = min(offset + a, n − 1).",
          "If A[i] < x: the target is after i; step down one Fibonacci number (f ← b, b ← a, a ← f − b) and set offset = i.",
          "If A[i] > x: the target is before i; step down two (f ← a, b ← b − a, a ← f − b).",
          "When f reaches 1, check the single remaining candidate A[offset + 1].",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the third preset): 11 keys [10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100], searching for 85. F(7) = 13 ≥ 11, so a = 5, b = 8. Probe 4 (45 < 85): offset = 4, a = 3, b = 5. Probe 7 (82 < 85): offset = 7, a = 2, b = 3. Probe 9 (90 > 85): a = 1, b = 1. Probe 8: 85 — found after 4 comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "It was designed for machines where division was slow, and for searching tapes or disks where probes closer together are cheaper: Fibonacci splits are uneven, so the next probe tends to be nearer the last.",
          "On modern hardware binary search with a shift is just as fast and makes fewer comparisons.",
          "Clamp probes with min(·, n − 1) because F(k) may exceed n.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Each comparison reduces the Fibonacci index by 1 or 2, starting from k where $F(k) \\ge n$, so at most about $k \\approx \\log_\\varphi n \\approx 1.44 \\log_2 n$ comparisons are made, with $\\varphi = (1 + \\sqrt 5)/2$. On average it makes slightly more comparisons than binary search (Knuth, TAOCP Vol. 3, §6.2.1). The tests check every result against the array.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Kiefer's (1953) Fibonacci search for the maximum of a unimodal function is the optimal sequential search for a fixed number of evaluations; golden-section search is its limit.",
          "Ferguson (1960) gave the array version described here; Knuth presents it as Algorithm F in TAOCP Vol. 3, §6.2.1.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
    worstClass: "log n",
  },
  properties: [
    { label: "Split", value: "F(k − 2) : F(k − 1)" },
    { label: "Arithmetic", value: "Additions and subtractions only" },
  ],
  implementations: [
    {
      language: "python",
      entry: "fibonacci_search",
      code: `def fibonacci_search(arr, x):
    n = len(arr)
    a, b = 0, 1
    f = a + b
    while f < n:
        a, b = b, f
        f = a + b
    offset = -1
    while f > 1:
        i = min(offset + a, n - 1)
        if arr[i] < x:
            f, b = b, a
            a = f - b
            offset = i
        elif arr[i] > x:
            f = a
            b = b - a
            a = f - b
        else:
            return i
    if b == 1 and offset + 1 < n and arr[offset + 1] == x:
        return offset + 1
    return -1
`,
      tests: [
        { args: [[10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100], 85], expected: 8 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 40], expected: -1 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 91], expected: 9 },
      ],
    },
    {
      language: "javascript",
      entry: "smallestFib",
      code: `// The smallest Fibonacci number at least n.
function smallestFib(n) {
  let [a, b] = [0, 1];
  while (b < n) [a, b] = [b, a + b];
  return b;
}
`,
      tests: [
        { args: [11], expected: 13 },
        { args: [100], expected: 144 },
      ],
    },
  ],
  visualizer: "fibonacci-search",
  practice: [
    {
      id: "fib-start",
      kind: "numeric",
      prompt: "Fibonacci search on 20 elements starts from which Fibonacci number f?",
      answer: 21,
      explanation: "The smallest Fibonacci number ≥ 20 is 21.",
      hints: ["… 8, 13, 21, 34 …"],
      objective: "Setup",
    },
    {
      id: "fib-ops",
      kind: "mcq",
      prompt: "What advantage did Fibonacci search have over binary search on early computers?",
      options: [
        "Probe positions need only addition and subtraction",
        "It makes fewer comparisons",
        "It works on unsorted arrays",
        "It needs no extra variables",
      ],
      answer: 0,
      explanation: "No division or shift is needed to find the next probe.",
      distractors: {
        1: "It makes slightly more comparisons on average.",
        2: "It needs sorted input.",
        3: "It keeps three Fibonacci numbers and an offset.",
      },
      hints: ["How is the next probe computed?"],
      objective: "Motivation",
    },
  ],
  exam: {
    definition:
      "Fibonacci search narrows a sorted range by splitting it at Fibonacci numbers, using only additions and subtractions.",
    steps: [
      "Find F(k) ≥ n.",
      "Probe offset + F(k − 2).",
      "Step down one or two Fibonacci numbers.",
    ],
    timeComplexity: "$O(\\log n)$, at most about $\\log_\\varphi n$ comparisons.",
    spaceComplexity: "$O(1)$.",
    correctness: "The surviving part always has a Fibonacci size and contains x if x is present.",
    applications: ["Historical: machines without fast division", "Non-uniform access cost media"],
    limitations: ["More comparisons than binary search"],
    faq: [
      {
        q: "Is it faster than binary search today?",
        a: "No; it makes slightly more comparisons and shifts are cheap.",
      },
    ],
    answers: [{ marks: 5, outline: ["Fibonacci split (2).", "Algorithm (2).", "Cost (1)."] }],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 6.2.1.",
      supports: "Fibonaccian search (Algorithm F) and its analysis.",
    },
    {
      citation: "D. E. Ferguson, “Fibonaccian searching,” Communications of the ACM, 3(12), 1960.",
      supports: "The array version of Fibonacci search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
