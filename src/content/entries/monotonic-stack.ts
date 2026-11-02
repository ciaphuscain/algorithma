import type { AlgorithmEntry } from "../types";

export const monotonicStackEntry: AlgorithmEntry = {
  slug: "monotonic-stack",
  name: "Monotonic Stack",
  aliases: ["Next greater element", "All nearest larger values", "Increasing/decreasing stack"],
  curriculum: [100],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "intermediate",
  summary:
    "A stack of indices whose values stay in sorted order. Scanning once, each new value resolves every smaller value waiting on the stack, which gives every element's next greater element in O(n).",
  tags: ["stack", "next greater element", "nearest larger value", "amortized"],
  prerequisites: ["Stacks", "Arrays"],
  related: ["monotonic-queue", "sliding-window"],
  problem: {
    input: "An array $A$ of $n$ numbers.",
    output:
      "For each $i$, the first value to the right of $A[i]$ that is larger than it, or “none”.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Daily temperatures: for each day, when is it next warmer? Keep a stack of days still waiting for a warmer day. A warm new day answers everyone on top of the stack who is colder, then waits itself. The waiting days are always in decreasing temperature from bottom to top, because a colder day never sits on a warmer one for long: it would have been answered.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Scan $i = 0, 1, \\dots, n - 1$.",
          "While the stack is not empty and $A[\\text{top}] < A[i]$: pop the top; its answer is $A[i]$.",
          "Push $i$.",
          "Indices still on the stack at the end have no larger value to their right.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [73, 74, 75, 71, 69, 72, 76, 73]$.",
      },
      {
        kind: "table",
        head: ["i", "A[i]", "popped (answer = A[i])", "stack afterwards (indices)"],
        rows: [
          ["0", "73", "—", "0"],
          ["1", "74", "0", "1"],
          ["2", "75", "1", "2"],
          ["3", "71", "—", "2, 3"],
          ["4", "69", "—", "2, 3, 4"],
          ["5", "72", "4, 3", "2, 5"],
          ["6", "76", "5, 2", "6"],
          ["7", "73", "—", "6, 7"],
        ],
      },
      {
        kind: "p",
        text: "Answers: $[74, 75, 76, 72, 72, 76, \\text{none}, \\text{none}]$, using 10 comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store **indices**, not values: you usually need the position (for distances, like “how many days until warmer”) as well as the value.",
          "Choose `<` or `≤` deliberately: with `<`, equal values wait for a strictly larger one; with `≤`, an equal value counts as the answer.",
          "Variants by direction and order: next smaller, previous greater (scan from the right, or read the stack top before pushing).",
          "**Largest rectangle in a histogram** uses the previous and next smaller bar of every bar, both from one monotonic-stack pass.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Running time.** Each index is pushed once and popped at most once. Every comparison either pops an index (at most $n$ times overall) or stops the while loop (once per $i$, $n$ times), so there are at most $2n - 1$ comparisons: $O(n)$, even though one step can pop many indices.",
      },
      {
        kind: "p",
        text: "**Correctness.** Invariant: the stack holds exactly the indices $< i$ whose answer is not yet known, with values non-increasing from bottom to top. When $A[i]$ arrives, the indices with smaller values are on top; $A[i]$ is the first larger value to their right, since any earlier larger value would already have popped them.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "In parallel computing this is the **all nearest smaller values** problem, solvable in $O(\\log \\log n)$ time on a CRCW PRAM.",
          "**Cartesian trees** are built in $O(n)$ with the same stack: the last node popped becomes the left child of the new node, and the new node becomes the right child of the node left on top.",
          "Stock span, trapping rain water, and sum of subarray minimums are standard applications.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    { label: "Comparisons", value: "At most $2n - 1$" },
    { label: "Stack order", value: "Values non-increasing from bottom to top" },
  ],
  implementations: [
    {
      language: "python",
      entry: "next_greater",
      code: `def next_greater(a):
    """For each element, the next larger value to its right, or None."""
    answer = [None] * len(a)
    stack = []                       # indices still waiting
    for i, x in enumerate(a):
        while stack and a[stack[-1]] < x:
            answer[stack.pop()] = x
        stack.append(i)
    return answer
`,
      tests: [
        {
          args: [[73, 74, 75, 71, 69, 72, 76, 73]],
          expected: [74, 75, 76, 72, 72, 76, null, null],
        },
        { args: [[9, 7, 5, 3]], expected: [null, null, null, null] },
      ],
    },
    {
      language: "javascript",
      entry: "largestRectangle",
      code: `// Largest rectangle in a histogram: each bar extends until a smaller bar.
function largestRectangle(h) {
  const stack = []; // indices with increasing heights
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const height = i === h.length ? 0 : h[i];
    while (stack.length && h[stack[stack.length - 1]] >= height) {
      const top = stack.pop();
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, h[top] * (i - left));
    }
    stack.push(i);
  }
  return best;
}
`,
      tests: [
        { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
        { args: [[2, 4]], expected: 4 },
      ],
    },
  ],
  visualizer: "monotonic-stack",
  practice: [
    {
      id: "mono-stack-answer",
      kind: "numeric",
      prompt: "For $A = [2, 1, 2, 4, 3]$, what is the next greater value of $A[1] = 1$?",
      answer: 2,
      explanation: "The first value to the right of index 1 that is larger than 1 is $A[2] = 2$.",
      hints: ["Look to the right of index 1."],
      objective: "Compute next greater elements",
    },
    {
      id: "mono-stack-cost",
      kind: "mcq",
      prompt: "Why is the algorithm $O(n)$ even though one step can pop many indices?",
      options: [
        "Every index is popped at most once over the whole scan",
        "The stack never holds more than two indices",
        "Pops are free",
        "It is actually $O(n^2)$",
      ],
      answer: 0,
      explanation:
        "Total pops ≤ total pushes = $n$; amortised over the scan, each step is constant.",
      distractors: {
        1: "A decreasing input keeps every index on the stack.",
        2: "Each pop costs a comparison.",
        3: "The amortised bound is $O(n)$.",
      },
      hints: ["How many times can one index be popped?"],
      objective: "Amortised analysis",
    },
  ],
  exam: {
    definition:
      "A monotonic stack keeps indices whose values are sorted; scanning once, it finds each element's next greater (or smaller) element.",
    steps: ["For each i: while A[top] < A[i], pop top and set its answer to A[i].", "Push i."],
    timeComplexity: "$O(n)$ amortised: each index is pushed and popped once.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "The stack holds the unresolved indices with non-increasing values; the first larger arrival pops exactly the indices it answers.",
    applications: [
      "Next greater/smaller element",
      "Stock span",
      "Largest rectangle in a histogram",
      "Cartesian tree construction",
    ],
    limitations: ["Answers one direction per pass"],
    faq: [
      {
        q: "Increasing or decreasing stack?",
        a: "For next greater elements the stack is decreasing (bottom to top); for next smaller it is increasing.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Stack of unresolved indices in sorted order.", "$O(n)$ amortised."] },
      { marks: 5, outline: ["Algorithm (2).", "Worked example (2).", "Amortised analysis (1)."] },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Nearest smaller elements with a stack and the amortised analysis.",
    },
    {
      citation:
        "O. Berkman, B. Schieber, U. Vishkin, “Optimal doubly logarithmic parallel algorithms based on finding all nearest smaller values,” Journal of Algorithms, 14(3), 1993.",
      supports: "The all-nearest-smaller-values problem and its parallel algorithms.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
