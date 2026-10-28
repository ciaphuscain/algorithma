import type { AlgorithmEntry } from "../types";

export const convexHullTrickEntry: AlgorithmEntry = {
  slug: "convex-hull-trick",
  name: "Convex Hull Trick (DP Optimisation)",
  aliases: ["CHT", "Lower envelope of lines", "Monotone deque optimisation", "Li Chao tree"],
  curriculum: [300],
  domain: "dynamic-programming",
  subcategory: "DP optimisation",
  difficulty: "advanced",
  summary:
    "Speeds up recurrences of the form dp[i] = min over j < i of (m_j · x_i + b_j) by keeping only the lines on the lower envelope. With slopes and queries both monotone, a deque answers each query in amortised O(1), turning O(n²) into O(n).",
  tags: ["convex hull trick", "dp optimisation", "lines", "deque", "lower envelope", "li chao"],
  prerequisites: [
    "Memoization vs Tabulation (Top-Down and Bottom-Up DP)",
    "Monotonic Queue (Sliding Window Maximum)",
  ],
  related: ["monotonic-queue", "memoization-tabulation", "held-karp"],
  problem: {
    input: "Stone heights h₀ < h₁ < … < h_{n−1} and a fixed cost C per jump (the frog problem).",
    output:
      "dp[i] = min over j < i of dp[j] + (h_i − h_j)² + C, and the cost to reach the last stone.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A frog hops forward along stones; a jump from j to i costs $(h_i - h_j)^2 + C$. The plain DP tries every earlier stone: $O(n^2)$. Expand the square: $dp[j] + h_j^2 - 2h_j h_i + h_i^2 + C$. The part that depends on j is a **line** in $x = h_i$: slope $-2h_j$, intercept $dp[j] + h_j^2$. So each stone adds a line, and each query asks for the lowest line at x.",
      },
      {
        kind: "p",
        text: "The lowest of many lines, drawn over all x, is a convex chain: the lower envelope. A line that is never on it can be thrown away forever. Because slopes keep decreasing and queries keep increasing, lines join at one end of a deque and become useless at the other, like the monotonic queue.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with line 0 in the deque.",
          "For x = h_i: while the second line is at least as low as the first at x, pop the front (queries only increase, so it will never be best again).",
          "dp[i] = (front line at x) + h_i² + C.",
          "Add line i at the back, first popping back lines that would never be strictly lowest: line q between p and the new line r is useless when p and r cross at or before where p and q cross.",
        ],
      },
      { kind: "p", text: "**Worked example** (the first preset): h = 1, 2, 3, 4, 5 and C = 6." },
      {
        kind: "table",
        head: ["i", "x = h_i", "Deque at the query (lines by stone)", "Best line", "dp[i]"],
        rows: [
          ["1", "2", "0", "0: −2x + 1 → −3", "−3 + 4 + 6 = 7"],
          ["2", "3", "0, 1", "0 → −5 (line 1 gives −1)", "−5 + 9 + 6 = 10"],
          ["3", "4", "0, 2 (line 1 was dropped from the back)", "0 → −7", "−7 + 16 + 6 = 15"],
          [
            "4",
            "5",
            "2, 3 (line 0 popped from the front)",
            "2: −6x + 19 → −11",
            "−11 + 25 + 6 = 20",
          ],
        ],
      },
      {
        kind: "p",
        text: "The best route is 0 → 2 → 4 (stones 1, 3, 5): 4 + 6 + 4 + 6 = 20, cheaper than hopping to every stone (4 · 7 = 28) or jumping straight to the end (16 + 6 = 22).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Compare intersections by cross-multiplication in integers, not by dividing: floating-point ties cause wrong pops.",
          "If queries are not monotone, binary-search the envelope for each query: O(log n).",
          "If slopes arrive in any order, use a **Li Chao tree** (the JavaScript sample): a segment tree over the x-range that keeps one line per node, O(log range) per insert and query.",
          "For maxima instead of minima, negate the lines, or reverse every comparison.",
          "Check the monotonicity assumptions: here slopes −2h_j decrease because heights increase.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Lower envelope.** With slopes $m_p > m_q > m_r$, line q is below both p and r somewhere exactly when the crossing of p and q comes before the crossing of p and r:",
      },
      {
        kind: "math",
        tex: "q \\text{ useless} \\iff (b_r - b_p)(m_p - m_q) \\le (b_q - b_p)(m_p - m_r)",
      },
      {
        kind: "p",
        text: "**Amortised O(1).** Each line enters the deque once and leaves at most once, from either end; every comparison either pops a line or ends a loop. So the total work is O(n). The property tests check the answers against the $O(n^2)$ DP and that at most 3n line comparisons are made.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The trick appears in many problems: splitting arrays into groups with quadratic costs, building stations on a line, batch scheduling with setup times.",
          "Its geometric dual is the convex hull of points (m_j, b_j): querying the lowest line at x is finding the hull point minimising the dot product with (x, 1).",
          "Related speed-ups: divide-and-conquer optimisation and Knuth's optimisation apply to other recurrence shapes; Aliens' trick (Lagrangian relaxation) removes a constraint on the number of groups.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "With monotone slopes and queries; O(n log n) with binary search or a Li Chao tree otherwise.",
  },
  properties: [
    { label: "Needs", value: "dp[i] = min over j of (line_j at x_i) + something independent of j" },
    { label: "Deque size", value: "Each line is pushed once and popped at most once" },
  ],
  implementations: [
    {
      language: "python",
      entry: "frog",
      code: `from collections import deque


def frog(h, C):
    # dp[i] = min over j < i of dp[j] + (h[i] - h[j])^2 + C, heights increasing
    dp = [0] * len(h)
    lines = deque([(-2 * h[0], h[0] ** 2)])      # (slope, intercept)

    def value(line, x):
        return line[0] * x + line[1]

    for i in range(1, len(h)):
        x = h[i]
        while len(lines) >= 2 and value(lines[1], x) <= value(lines[0], x):
            lines.popleft()
        dp[i] = value(lines[0], x) + x * x + C
        new = (-2 * h[i], dp[i] + h[i] ** 2)
        while len(lines) >= 2:
            (m1, b1), (m2, b2) = lines[-2], lines[-1]
            if (new[1] - b1) * (m1 - m2) <= (b2 - b1) * (m1 - new[0]):
                lines.pop()
            else:
                break
        lines.append(new)
    return dp[-1]
`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 6], expected: 20 },
        { args: [[10, 20, 30, 40, 50], 1], expected: 404 },
      ],
    },
    {
      language: "javascript",
      entry: "frogLiChao",
      code: `// The frog problem with a Li Chao tree over heights 0..100: lines may be
// added and queried in any order, O(log range) each.
function frogLiChao(h, C) {
  const tree = new Map(); // node -> [slope, intercept]
  const f = ([m, b], x) => m * x + b;
  const add = (line, node = 1, lo = 0, hi = 100) => {
    if (!tree.has(node)) { tree.set(node, line); return; }
    const mid = (lo + hi) >> 1;
    let cur = tree.get(node);
    const leftBetter = f(line, lo) < f(cur, lo), midBetter = f(line, mid) < f(cur, mid);
    if (midBetter) { tree.set(node, line); [line, cur] = [cur, line]; }
    if (lo === hi) return;
    if (leftBetter !== midBetter) add(line, 2 * node, lo, mid);
    else add(line, 2 * node + 1, mid + 1, hi);
  };
  const query = (x, node = 1, lo = 0, hi = 100) => {
    if (!tree.has(node)) return Infinity;
    const mid = (lo + hi) >> 1, here = f(tree.get(node), x);
    if (lo === hi) return here;
    return Math.min(here, x <= mid ? query(x, 2 * node, lo, mid) : query(x, 2 * node + 1, mid + 1, hi));
  };
  let dp = 0;
  add([-2 * h[0], h[0] * h[0]]);
  for (let i = 1; i < h.length; i++) {
    dp = query(h[i]) + h[i] * h[i] + C;
    add([-2 * h[i], dp + h[i] * h[i]]);
  }
  return dp;
}
`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 6], expected: 20 },
        { args: [[10, 20, 30, 40, 50], 1], expected: 404 },
      ],
    },
  ],
  visualizer: "convex-hull-trick",
  practice: [
    {
      id: "cht-answer",
      kind: "numeric",
      prompt:
        "Stones at heights 1, 2, 3, 4, 5 and C = 6: what is the minimum total cost to reach the last stone?",
      answer: 20,
      explanation: "Jump 1 → 3 → 5: (2² + 6) + (2² + 6) = 20.",
      hints: ["Compare hopping every stone, jumping straight, and every-other stone."],
      objective: "Evaluate the recurrence",
    },
    {
      id: "cht-pop-front",
      kind: "mcq",
      prompt:
        "Why can the front line be removed for good once the second line is at least as low at the current query?",
      options: [
        "Queries only increase and the second line has the smaller slope, so it stays at least as low from then on",
        "Because the front line is always the oldest",
        "Because lines with negative slopes are never needed",
        "Because the deque has a fixed size",
      ],
      answer: 0,
      explanation:
        "Past their crossing point, the line with the smaller slope remains lower; later queries all lie past that point.",
      distractors: {
        1: "Age alone is not the reason; monotone queries are.",
        2: "All slopes here are negative.",
        3: "The deque grows and shrinks freely.",
      },
      hints: ["Compare two lines to the right of where they cross."],
      objective: "Understand the front pops",
    },
  ],
  exam: {
    definition:
      "The convex hull trick evaluates dp[i] = min_j (m_j x_i + b_j) + c_i quickly by maintaining the lower envelope of the lines; with monotone slopes and queries a deque gives O(1) amortised per step.",
    steps: [
      "Rewrite the transition as a line in a query variable.",
      "Query: pop front lines beaten by the next one; evaluate the front.",
      "Insert: pop back lines made useless by the new line; push it.",
    ],
    timeComplexity: "$O(n)$ with monotone slopes and queries; $O(n \\log n)$ otherwise.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Only lines on the lower envelope can be minimal; removed lines are provably never minimal for any remaining query.",
    applications: [
      "Partitioning arrays with quadratic costs",
      "Frog/jump problems",
      "Facility placement on a line",
      "Batch scheduling",
    ],
    limitations: [
      "The transition must split into a line in x_i plus j-independent terms",
      "Monotonicity is needed for the O(1) deque version",
    ],
    faq: [
      {
        q: "Li Chao tree or deque?",
        a: "Deque when slopes and queries are monotone; Li Chao tree when they are not.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Transitions as lines; keep the lower envelope.", "O(n) with monotone deque."],
      },
      {
        marks: 5,
        outline: ["Rewriting the recurrence (2).", "Deque operations (2).", "Complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "O(n²) recurrence and its algebraic split (2).",
          "Lower envelope and the useless-line test (3).",
          "Worked example (3).",
          "Amortised analysis and variants (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. de Berg, O. Cheong, M. van Kreveld, M. Overmars, Computational Geometry: Algorithms and Applications, 3rd ed., Springer, 2008.",
      supports: "Lower envelopes of lines and their duality with convex hulls.",
    },
    {
      citation: "AtCoder Educational DP Contest, Problem Z “Frog 3”, 2019.",
      supports: "The frog recurrence used as the example.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review. The trick itself is folklore in competitive programming; no single original source is cited.",
  },
  version: 1,
  updated: "2026-10-23",
};
