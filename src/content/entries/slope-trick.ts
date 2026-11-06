import type { AlgorithmEntry } from "../types";

export const slopeTrickEntry: AlgorithmEntry = {
  slug: "slope-trick",
  name: "Slope Trick",
  aliases: ["Slope Trick DP"],
  curriculum: [525],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Slope trick is a DP optimization technique that represents a convex piecewise-linear cost function by its slopes' breakpoints, enabling efficient transitions using priority queues.",
  tags: ["dp optimization", "convex functions", "priority queue", "piecewise linear"],
  prerequisites: ["Dynamic Programming"],
  related: ["space-optimized-dp"],
  problem: {
    input: "A DP recurrence whose cost function is convex and piecewise-linear at each step.",
    output: "The optimal DP value, computed efficiently by maintaining the slope change points.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Many DP problems have cost functions that are convex (bowl-shaped) and piecewise-linear (made of straight segments). Instead of storing the entire function, we can store just the breakpoints where the slope changes. This compressed representation can be updated in O(log n) per transition using a heap.",
      },
      {
        kind: "p",
        text: "The classic example is making an array non-decreasing with minimum total absolute deviation: the cost function for each prefix is convex, and adding element a[i] shifts and clips the function, operations that translate to heap pushes and pops.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Represent the convex function f by its minimum value and a max-heap of breakpoints where the slope decreases by 1 (left side) and a min-heap where it increases by 1 (right side).",
          "To add |x - a[i]|: push a[i] to both heaps. If the left heap's top exceeds the right heap's top, swap them and add the difference to the cost.",
          "To apply a shift (e.g., x must be ≥ previous x), remove breakpoints that violate the constraint.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: Make [3, 1, 4] non-decreasing with min total change. After processing 3: f is |x-3|, left={3}, right={3}. After 1: push 1 to both. Left top=3>right top=1, so swap: cost += 3-1=2. Left={1,1}, right={3,3}. After 4: push 4. Left={4,1,1}, right={3,3,4}. Top 4>3, swap: cost+=1. Total cost=3. Answer: [1,1,4] or [3,3,4] both cost 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a max-heap for the left slopes and min-heap for the right slopes.",
          "Each transition is O(log n) instead of O(n) or O(n^2) for naive DP.",
          "Works for problems like non-decreasing subsequence cost, stock trading with fees, and certain scheduling problems.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The key invariant is that the function remains convex after each update. Adding |x - c| to a convex function preserves convexity. The breakpoints partition the x-axis into regions of constant slope, and only O(n) breakpoints exist after n steps.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Slope trick extends to problems with L1 cost (absolute value), not L2 (squared).",
          "The technique can handle some non-decreasing/non-increasing constraints and bounded differences.",
          "Related to the Lipschitz DP technique and the kinetic heaps approach.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "n elements, each processed with O(log n) heap operations.",
  },
  properties: [
    {
      label: "Function type",
      value: "Convex piecewise-linear",
    },
    {
      label: "Per-element cost",
      value: "O(log n)",
    },
    {
      label: "Representation",
      value: "Two heaps storing slope breakpoints",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "min_cost_nondecreasing",
      code: `def min_cost_nondecreasing(arr):
    """Minimum total |change| to make arr non-decreasing."""
    import heapq
    cost = 0
    left = []  # max-heap (negate for heapq)
    for a in arr:
        heapq.heappush(left, -a)
        heapq.heappush(left, -a)
        # Pop the largest breakpoint to "right" side (discard, add cost)
        top = -heapq.heappop(left)
        cost += top - a
    return cost
`,
      tests: [
        {
          args: [[3, 1, 4]],
          expected: 2,
        },
        {
          args: [[5, 3, 1]],
          expected: 4,
        },
        {
          args: [[1, 2, 3]],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "slope-trick-repr",
      kind: "mcq",
      prompt: "What data structure does slope trick use to represent the cost function?",
      options: [
        "Priority queues (heaps) storing slope breakpoints",
        "A 2D array of costs",
        "A balanced BST of function values",
        "A segment tree",
      ],
      answer: 0,
      explanation:
        "Slope trick stores breakpoints where the slope changes in heaps, enabling O(log n) updates.",
      hints: ["Think about how a piecewise-linear function is defined."],
      objective: "Understand slope trick representation",
    },
  ],
  exam: {
    definition:
      "Slope trick represents convex piecewise-linear DP cost functions by their slope breakpoints in heaps, enabling O(log n) per-element updates.",
    steps: [
      "Maintain max-heap (left) and min-heap (right) of breakpoints.",
      "Push new breakpoints, swap tops if crossing, update cost.",
      "Final answer is the accumulated cost.",
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctness:
      "Convexity is preserved by each operation; the heaps maintain the sorted breakpoint invariant.",
    applications: ["Non-decreasing array with min changes", "Stock trading", "Scheduling"],
    limitations: [
      "Only works for convex piecewise-linear costs",
      "Requires careful analysis to apply",
    ],
    faq: [
      {
        q: "Why not just do standard DP?",
        a: "Standard DP is O(n^2) or worse; slope trick reduces it to O(n log n) by exploiting convexity.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Breakpoint representation (1).", "Heap operations and complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "P. Stańczyk, 'Slope Trick,' Algorithmic Engagements, 2014.",
      supports: "Popularized the slope trick technique.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
