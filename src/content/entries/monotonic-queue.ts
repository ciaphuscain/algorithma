import type { AlgorithmEntry } from "../types";

export const monotonicQueueEntry: AlgorithmEntry = {
  slug: "monotonic-queue",
  name: "Monotonic Queue (Sliding Window Maximum)",
  aliases: ["Sliding window maximum", "Monotonic deque", "Sliding window minimum"],
  curriculum: [99, 98],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "intermediate",
  summary:
    "A double-ended queue of indices whose values decrease from front to back. The front is always the maximum of the current window, so every window's maximum is found in O(n) total.",
  tags: ["deque", "sliding window", "window maximum", "amortized"],
  prerequisites: ["Queues", "Sliding Window"],
  related: ["monotonic-stack", "sliding-window", "sparse-table"],
  problem: {
    input: "An array $A$ of $n$ numbers and a window size $k$.",
    output: "The maximum of every window $A[s..s + k - 1]$, for $s = 0, \\dots, n - k$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A value is worth remembering only while it could still be the maximum of some future window. As soon as a larger value arrives after it, it never will be: the newcomer is bigger and stays in the window longer. So the queue keeps only “still possible” champions, in decreasing order, and the oldest of them is the current maximum.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each $i$: pop from the **back** every index whose value is $\\le A[i]$, then push $i$ at the back.",
          "If the **front** index is $\\le i - k$, it has left the window: pop it.",
          "Once $i \\ge k - 1$, the front holds the maximum of the window ending at $i$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [1, 3, -1, -3, 5, 3, 6, 7]$, $k = 3$. The deque is shown as indices (values).",
      },
      {
        kind: "table",
        head: ["i", "A[i]", "popped from the back", "deque afterwards", "window maximum"],
        rows: [
          ["0", "1", "—", "0 (1)", ""],
          ["1", "3", "0", "1 (3)", ""],
          ["2", "−1", "—", "1 (3), 2 (−1)", "3"],
          ["3", "−3", "—", "1 (3), 2 (−1), 3 (−3)", "3"],
          ["4", "5", "3, 2, 1", "4 (5)", "5"],
          ["5", "3", "—", "4 (5), 5 (3)", "5"],
          ["6", "6", "5, 4", "6 (6)", "6"],
          ["7", "7", "6", "7 (7)", "7"],
        ],
      },
      {
        kind: "p",
        text: "Maxima: $[3, 3, 5, 5, 6, 7]$, using 10 comparisons. Here nothing ever leaves from the front, because a larger value always arrived first. The “decreasing values” preset shows front removals.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store indices, so you can tell when the front has left the window.",
          "Use a real deque (Python `collections.deque`, or an array with a head index); shifting a JavaScript array is $O(n)$.",
          "For the window **minimum**, flip the comparison: pop values $\\ge A[i]$.",
          "`≤` versus `<` when popping only affects ties; both give correct maxima.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant:** the deque holds, in increasing index order, exactly those indices in the current window that are larger than every later index in the window; their values strictly decrease. The window maximum is such an index, and it is the oldest, so it is at the front.",
      },
      {
        kind: "p",
        text: "**Cost.** Each index is pushed once and popped at most once (from either end). Each back comparison either pops (at most $n$ in total) or stops the loop (once per $i$), so there are at most $2n$ comparisons: $O(n)$ for all $n - k + 1$ windows, against $O(nk)$ for recomputing each window.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Monotonic queues speed up dynamic programmes of the form $dp[i] = \\max_{i - k \\le j < i} dp[j] + c_i$ from $O(nk)$ to $O(n)$.",
          "The shortest subarray with sum at least $T$, with negative numbers allowed, uses a monotonic deque of prefix sums.",
          "For arbitrary range-maximum queries (not sliding windows), use a sparse table or a segment tree.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(k)",
    worstClass: "n",
  },
  properties: [
    { label: "Comparisons", value: "At most $2n$" },
    { label: "Deque order", value: "Values strictly decrease from front to back" },
  ],
  implementations: [
    {
      language: "python",
      entry: "window_max",
      code: `from collections import deque

def window_max(a, k):
    d = deque()                      # indices; values decrease front to back
    out = []
    for i, x in enumerate(a):
        while d and a[d[-1]] <= x:
            d.pop()
        d.append(i)
        if d[0] <= i - k:
            d.popleft()
        if i >= k - 1:
            out.append(a[d[0]])
    return out
`,
      tests: [
        { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
        { args: [[9, 8, 7, 6, 5], 2], expected: [9, 8, 7, 6] },
      ],
    },
    {
      language: "javascript",
      entry: "windowMin",
      code: `// Sliding-window minimum: the same deque with the comparison flipped.
function windowMin(a, k) {
  const d = []; // indices; values increase front to back
  let head = 0;
  const out = [];
  for (let i = 0; i < a.length; i++) {
    while (d.length > head && a[d[d.length - 1]] >= a[i]) d.pop();
    d.push(i);
    if (d[head] <= i - k) head++;
    if (i >= k - 1) out.push(a[d[head]]);
  }
  return out;
}
`,
      tests: [{ args: [[4, 2, 12, 3, 8, 1], 3], expected: [2, 2, 3, 1] }],
    },
  ],
  visualizer: "monotonic-queue",
  practice: [
    {
      id: "mono-queue-max",
      kind: "numeric",
      prompt: "For $A = [4, 2, 12, 3]$ and $k = 2$, what is the maximum of the last window?",
      answer: 12,
      explanation: "The last window is $[12, 3]$.",
      hints: ["The last window is the final $k$ elements."],
      objective: "Read off a window maximum",
    },
    {
      id: "mono-queue-pop",
      kind: "mcq",
      prompt:
        "Why may an index be removed from the back as soon as a larger-or-equal value arrives?",
      options: [
        "The newcomer is at least as large and stays in every later window longer, so the old index can never be a maximum again",
        "The deque has a fixed size of $k$",
        "Old indices always leave from the back",
        "To keep the deque sorted by index",
      ],
      answer: 0,
      explanation:
        "Every future window containing the old index also contains the newcomer, which is at least as large.",
      distractors: {
        1: "Its size varies; it can hold fewer than $k$ indices.",
        2: "Indices leave the window from the front.",
        3: "Indices are already in increasing order; values are what the pops maintain.",
      },
      hints: ["Compare which future windows contain each of the two indices."],
      objective: "Understand the dominance argument",
    },
  ],
  exam: {
    definition:
      "A monotonic queue is a deque of indices with monotone values, used to report the maximum (or minimum) of every sliding window in linear time.",
    steps: [
      "Pop from the back while A[back] ≤ A[i]; push i.",
      "Pop the front if it is outside the window.",
      "The front is the window maximum once i ≥ k − 1.",
    ],
    timeComplexity: "$O(n)$ amortised.",
    spaceComplexity: "$O(k)$.",
    correctness:
      "Removed indices are dominated by a later, larger value for the rest of their lifetime; the front is the oldest undominated index in the window, hence its maximum.",
    applications: [
      "Sliding-window maximum/minimum",
      "DP optimisation over a window",
      "Shortest subarray with sum ≥ T (with negatives)",
    ],
    limitations: ["Only for windows that move forward"],
    faq: [
      {
        q: "Why not a heap?",
        a: "A heap gives $O(n \\log k)$ and needs lazy deletion of expired entries; the deque is simpler and $O(n)$.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Deque of indices with decreasing values.", "Front is the maximum; $O(n)$."],
      },
      { marks: 5, outline: ["Algorithm (2).", "Worked example (2).", "Amortised analysis (1)."] },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Sliding-window minimum with a deque and its amortised analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
