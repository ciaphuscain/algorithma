import type { AlgorithmEntry } from "../types";

export const slidingWindowEntry: AlgorithmEntry = {
  slug: "sliding-window",
  name: "Sliding Window",
  aliases: ["Variable-size window", "Shortest subarray with sum at least k", "Caterpillar method"],
  curriculum: [54],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "beginner",
  summary:
    "Keeps a contiguous window [L, R] and moves its two ends only forwards: grow the right end until the window is good enough, then shrink the left end while it stays good. Linear time.",
  tags: ["sliding window", "two pointers", "subarray", "amortized"],
  prerequisites: ["Arrays"],
  related: ["two-pointers", "monotonic-queue", "prefix-sums"],
  problem: {
    input: "An array $A$ of positive integers and a target $T$.",
    output:
      "The length of the shortest contiguous subarray whose sum is at least $T$ (0 if none exists).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine a caterpillar crawling along the array. Its head moves forward to swallow more numbers; once its body holds enough, the tail creeps forward to see how short it can get. Neither end ever moves backwards, so the caterpillar crosses the array once.",
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Why positive numbers matter",
        text: "Shrinking from the left is safe only because removing a positive number always lowers the sum. With negative numbers a longer window could have a smaller sum, and the method breaks; use prefix sums with a monotonic queue instead.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with an empty window: $L = 0$, sum $= 0$, best $= \\infty$.",
          "For each $R$: add $A[R]$ to the sum.",
          "While sum $\\ge T$: record $R - L + 1$ if it is shorter than best, then subtract $A[L]$ and move $L$ right.",
          "At the end best is the answer (0 if it is still $\\infty$).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [2, 3, 1, 2, 4, 3]$, $T = 7$.",
      },
      {
        kind: "table",
        head: ["R", "add", "window and sum", "shrinking", "best"],
        rows: [
          ["0", "2", "[2] = 2", "—", "∞"],
          ["1", "3", "[2, 3] = 5", "—", "∞"],
          ["2", "1", "[2, 3, 1] = 6", "—", "∞"],
          ["3", "2", "[2, 3, 1, 2] = 8", "length 4 counts; drop 2 → 6", "4"],
          ["4", "4", "[3, 1, 2, 4] = 10", "length 4; drop 3 → 7; length 3 counts; drop 1 → 6", "3"],
          ["5", "3", "[2, 4, 3] = 9", "length 3; drop 2 → 7; length 2 counts; drop 4 → 3", "2"],
        ],
      },
      {
        kind: "p",
        text: "The shortest window is $[4, 3]$ at indices 4–5, length 2. Every element was added once and removed at most once: 6 + 5 = 11 reads.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Template: an outer loop over $R$ and an inner `while` that advances $L$. The inner loop is not nested work, because $L$ only moves forward overall.",
          "Decide when to record the answer: for “shortest window that satisfies”, record inside the shrink loop; for “longest window that satisfies”, record after it.",
          "**Fixed-size windows** (size $k$): add $A[R]$, and once the window exceeds $k$, remove $A[R - k]$.",
          "The window can track more than a sum: character counts (longest substring without repeats), a deque (window maximum), a hash map of frequencies.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Running time.** $R$ takes $n$ values and $L$ increases at most $n$ times in total, so the loop body runs at most $2n$ times: $O(n)$. This is an **amortised** bound: one step of $R$ can trigger many steps of $L$, but not on every step.",
      },
      {
        kind: "p",
        text: "**Correctness.** Let $[l, r]$ be a shortest valid window. The left pointer cannot have passed $l$ before $R$ reaches $r$: it passes $l$ only from inside the shrink loop, which means $A[l..R']$ was valid for some $R' < r$, a shorter window, contradicting the choice of $[l, r]$. So when $R = r$, $L \\le l$. Every window $A[L..r]$ with $L \\le l$ contains $A[l..r]$ and, the elements being positive, is valid; the shrink loop therefore keeps going until it records $[l, r]$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "With negative numbers, the shortest subarray with sum $\\ge T$ is still $O(n)$: scan prefix sums and keep a monotonic deque of candidate left ends.",
          "**Longest substring without repeating characters**, **minimum window containing all of a set**, and **at most $k$ distinct values** are all variable windows tracking counts.",
          "Network protocols use a different, unrelated “sliding window” (TCP flow control), which bounds how many packets may be unacknowledged.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    { label: "Reads", value: "At most $2n$" },
    { label: "Requires", value: "Monotonicity, here from positive numbers" },
  ],
  implementations: [
    {
      language: "python",
      entry: "shortest_window",
      code: `def shortest_window(a, target):
    """Length of the shortest subarray with sum >= target (all a[i] > 0); 0 if none."""
    best = float("inf")
    left = 0
    total = 0
    for right, x in enumerate(a):
        total += x
        while total >= target:
            best = min(best, right - left + 1)
            total -= a[left]
            left += 1
    return 0 if best == float("inf") else best
`,
      tests: [
        { args: [[2, 3, 1, 2, 4, 3], 7], expected: 2 },
        { args: [[1, 4, 4], 4], expected: 1 },
        { args: [[1, 1, 1, 1], 11], expected: 0 },
      ],
    },
    {
      language: "javascript",
      entry: "longestUniqueSubstring",
      code: `// Longest substring without repeating characters: a window that tracks counts.
function longestUniqueSubstring(s) {
  const count = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    count.set(c, (count.get(c) ?? 0) + 1);
    while (count.get(c) > 1) {
      count.set(s[left], count.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
`,
      tests: [
        { args: ["abcabcbb"], expected: 3 },
        { args: ["bbbbb"], expected: 1 },
        { args: ["pwwkew"], expected: 3 },
      ],
    },
  ],
  visualizer: "sliding-window",
  practice: [
    {
      id: "window-shortest",
      kind: "numeric",
      prompt:
        "For $A = [1, 2, 3, 4, 5]$ and target 11, what is the length of the shortest subarray with sum at least 11?",
      answer: 3,
      explanation: "$3 + 4 + 5 = 12 \\ge 11$; no two adjacent elements reach 11 ($4 + 5 = 9$).",
      hints: ["The largest elements are at the end."],
      objective: "Apply the sliding window",
    },
    {
      id: "window-negatives",
      kind: "mcq",
      prompt: "Why does this shrinking rule fail if the array may contain negative numbers?",
      options: [
        "Removing an element from the left could increase the sum, so a valid window might be passed over",
        "Negative numbers cannot be added",
        "The window would become longer than the array",
        "It would need more memory",
      ],
      answer: 0,
      explanation:
        "The method relies on the sum shrinking whenever the window does. A negative element breaks that monotonicity.",
      distractors: {
        1: "Addition works fine; the issue is the shrinking decision.",
        2: "Both pointers stay inside the array.",
        3: "Memory is unchanged.",
      },
      hints: ["What does removing $-5$ do to a sum?"],
      objective: "Know when the technique applies",
    },
  ],
  exam: {
    definition:
      "The sliding-window technique maintains a contiguous range [L, R] of an array, advancing R to grow it and L to shrink it, so each element enters and leaves once.",
    steps: [
      "For each R: add A[R].",
      "While the window satisfies the condition: update the answer, remove A[L], advance L.",
    ],
    timeComplexity: "$O(n)$ amortised: each pointer moves at most $n$ times.",
    spaceComplexity: "$O(1)$ for sums; more if the window keeps counts.",
    correctness:
      "With positive elements, the best left end for each right end never moves left, so a single forward pass of L visits it.",
    applications: [
      "Shortest or longest subarray with a sum condition",
      "Longest substring without repeats",
      "Moving averages",
      "Rate limiting over time windows",
    ],
    limitations: ["Needs a monotone condition (e.g. positive numbers)"],
    faq: [
      {
        q: "Sliding window or two pointers?",
        a: "A sliding window is a two-pointer technique where both pointers move in the same direction and the elements between them matter.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Two forward-only pointers bound a window.", "$O(n)$ amortised."] },
      {
        marks: 5,
        outline: [
          "Problem and window idea (1).",
          "Grow/shrink loop (2).",
          "Worked example (1).",
          "Amortised analysis (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "The two-pointers and sliding-window methods and their amortised analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
