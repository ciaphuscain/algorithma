import type { AlgorithmEntry } from "../types";

export const knapsackEntry: AlgorithmEntry = {
  slug: "knapsack",
  name: "0/1 Knapsack",
  aliases: ["Binary knapsack", "0-1 knapsack problem"],
  curriculum: [261],
  domain: "dynamic-programming",
  subcategory: "Knapsack family",
  difficulty: "intermediate",
  summary:
    "Chooses a subset of items with maximum total value whose total weight fits a capacity, by DP over items and capacities in O(nW) time.",
  tags: ["dynamic programming", "optimisation", "table", "subset", "pseudo-polynomial", "NP-hard"],
  prerequisites: ["Recursion", "2-D arrays"],
  related: ["lcs", "edit-distance"],
  problem: {
    input:
      "Items $1..n$ with integer weights $w_i > 0$ and values $v_i \\ge 0$, and an integer capacity $W$.",
    output:
      "A subset $S$ maximising $\\sum_{i \\in S} v_i$ subject to $\\sum_{i \\in S} w_i \\le W$, and that maximum value.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "You can carry at most $W$ kilograms and want the most valuable load. Each item is taken whole or left behind (“0/1”). Grabbing the most valuable item first can go wrong: one heavy treasure may block two lighter items worth more together.",
      },
      {
        kind: "p",
        text: "Decide items one at a time. For item $i$ and a remaining capacity $c$, either skip it, or take it and solve the rest with capacity $c - w_i$. A table indexed by (items considered, capacity) stores each answer once.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "$K[i][c]$ is the best value using only the first $i$ items with capacity $c$. Row 0 is all zeros. For each later cell, start from the cell above (skip item $i$); if $w_i \\le c$, compare with $K[i-1][c - w_i] + v_i$ (take it). The answer is $K[n][W]$. To find the items, walk up from $K[n][W]$: whenever a cell differs from the one above it, item $i$ was taken, so subtract its weight.",
      },
      { kind: "heading", text: "Worked example: weights 1, 3, 4, 5; values 1, 4, 5, 7; W = 7" },
      {
        kind: "table",
        head: ["items \\ c", "0", "1", "2", "3", "4", "5", "6", "7"],
        rows: [
          ["none", "0", "0", "0", "0", "0", "0", "0", "0"],
          ["#1 (w1, v1)", "0", "1", "1", "1", "1", "1", "1", "1"],
          ["#2 (w3, v4)", "0", "1", "1", "4", "5", "5", "5", "5"],
          ["#3 (w4, v5)", "0", "1", "1", "4", "5", "6", "6", "9"],
          ["#4 (w5, v7)", "0", "1", "1", "4", "5", "7", "8", "9"],
        ],
      },
      {
        kind: "p",
        text: "The best value is 9, from items #2 and #3 (weight 7). Taking the most valuable item first (#4, value 7, weight 5) leaves room only for #1: value 8.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**One-dimensional version:** keep a single array `best[c]` and loop capacities from $W$ down to $w_i$. Looping *downwards* ensures each item is used at most once; looping upwards solves the *unbounded* knapsack instead.",
          "Weights must be integers (or scaled to integers) because they index the table.",
          "Memory is $\\Theta(nW)$ with traceback, $\\Theta(W)$ without.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "math",
        tex: "K[i][c] = \\begin{cases} 0 & i = 0 \\\\ K[i-1][c] & w_i > c \\\\ \\max\\big(K[i-1][c],\\; K[i-1][c-w_i] + v_i\\big) & w_i \\le c \\end{cases}",
      },
      {
        kind: "p",
        text: "**Optimal substructure:** an optimal subset for (first $i$ items, capacity $c$) either excludes item $i$ — then it is optimal for $(i-1, c)$ — or includes it, and the rest is optimal for $(i-1, c - w_i)$.",
      },
      { kind: "heading", text: "Pseudo-polynomial time" },
      {
        kind: "p",
        text: "The table has $(n+1)(W+1)$ cells, so the running time is $\\Theta(nW)$. This is polynomial in the *value* of $W$ but exponential in its *length*: $W$ is written with $\\log_2 W$ bits. That is why the result does not contradict the NP-hardness of the knapsack problem; it is called *weakly* NP-hard.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Fractional knapsack** (items may be split) is solved greedily by value per weight in $O(n \\log n)$; the greedy rule fails for 0/1.",
          "**Unbounded and bounded knapsack** allow many copies of each item.",
          "**FPTAS:** scaling and rounding values gives a $(1 - \\varepsilon)$-approximation in time polynomial in $n$ and $1/\\varepsilon$.",
          "**Meet in the middle** solves instances with huge $W$ but small $n$ (around 40) in $O(2^{n/2} n)$.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(nW)", average: "\\Theta(nW)", worst: "\\Theta(nW)" },
    space: "\\Theta(nW)",
    worstClass: "other",
    note: "Pseudo-polynomial: $W$ is the capacity's value, not its size in bits. $\\Theta(W)$ space suffices for the value alone.",
  },
  properties: [
    { label: "Technique", value: "Bottom-up dynamic programming" },
    { label: "Complexity class", value: "NP-hard (weakly)" },
    { label: "Greedy works?", value: "No (only for the fractional version)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "knapsack",
      code: `def knapsack(weights, values, capacity):
    """Best total value of a subset of items that fits the capacity."""
    best = [0] * (capacity + 1)
    for w, v in zip(weights, values):
        # Go downwards so each item is used at most once.
        for c in range(capacity, w - 1, -1):
            best[c] = max(best[c], best[c - w] + v)
    return best[capacity]
`,
      tests: [
        { args: [[1, 3, 4, 5], [1, 4, 5, 7], 7], expected: 9 },
        { args: [[5, 4, 3], [10, 7, 6], 7], expected: 13 },
        { args: [[6, 8], [5, 9], 4], expected: 0 },
      ],
    },
    {
      language: "javascript",
      entry: "knapsack",
      code: `function knapsack(weights, values, capacity) {
  const best = new Array(capacity + 1).fill(0);
  weights.forEach((w, i) => {
    for (let c = capacity; c >= w; c--) best[c] = Math.max(best[c], best[c - w] + values[i]);
  });
  return best[capacity];
}
`,
      tests: [{ args: [[1, 3, 4, 5], [1, 4, 5, 7], 7], expected: 9 }],
    },
  ],
  visualizer: "knapsack",
  practice: [
    {
      id: "knapsack-greedy",
      kind: "numeric",
      prompt:
        "Items (weight, value): (5, 10), (4, 7), (3, 6); capacity 7. What is the best total value?",
      answer: 13,
      explanation:
        "Taking the 4- and 3-weight items gives 13. The single most valuable item (10) leaves no room for anything else.",
      hints: ["List the subsets that fit."],
      objective: "Solve a small instance and see why greedy fails",
    },
    {
      id: "knapsack-direction",
      kind: "mcq",
      prompt: "In the one-dimensional DP, why does the inner loop go from capacity W down to w?",
      options: [
        "So each item is used at most once",
        "It is faster than going upwards",
        "To find the lexicographically smallest subset",
        "It does not matter",
      ],
      answer: 0,
      explanation:
        "Going down, `best[c - w]` still holds the value from before this item was considered. Going up would let the same item be added again: the unbounded knapsack.",
      distractors: {
        1: "Both directions take the same time.",
        2: "The direction affects correctness, not tie-breaking.",
        3: "It changes the problem being solved.",
      },
      hints: ["Which version of `best[c - w]` does each direction read?"],
      objective: "Understand the space optimisation",
    },
    {
      id: "knapsack-np",
      kind: "mcq",
      prompt:
        "The DP runs in Θ(nW) time, yet 0/1 knapsack is NP-hard. Why is there no contradiction?",
      options: [
        "nW is exponential in the number of bits needed to write W",
        "The DP is only an approximation",
        "NP-hardness only applies to the fractional version",
        "The DP only works for small n",
      ],
      answer: 0,
      explanation:
        "The input size counts the digits of $W$, about $\\log_2 W$. A running time proportional to $W$ is exponential in that.",
      distractors: {
        1: "The DP is exact.",
        2: "The fractional version is the easy one (greedy).",
        3: "It works for any $n$; the issue is large $W$.",
      },
      hints: ["How many bits does it take to write the number $W$?"],
      objective: "Understand pseudo-polynomial time",
    },
  ],
  exam: {
    definition:
      "The 0/1 knapsack problem asks for a subset of items, each taken whole or not at all, maximising total value within a weight capacity. Dynamic programming solves it in $\\Theta(nW)$ time.",
    steps: [
      "Create $K[0..n][0..W]$ with row 0 all zeros.",
      "For $i = 1..n$, $c = 0..W$: $K[i][c] = K[i-1][c]$; if $w_i \\le c$, $K[i][c] = \\max(K[i][c], K[i-1][c - w_i] + v_i)$.",
      "Return $K[n][W]$; trace back to find the chosen items.",
    ],
    timeComplexity: "$\\Theta(nW)$ — pseudo-polynomial.",
    spaceComplexity: "$\\Theta(nW)$, or $\\Theta(W)$ with the one-dimensional table.",
    correctness:
      "Optimal substructure: the best subset either excludes item $i$ or includes it plus a best subset for the reduced capacity.",
    applications: [
      "Budget allocation and project selection",
      "Cargo loading",
      "Resource allocation in scheduling",
      "Cryptography (historically, Merkle–Hellman)",
    ],
    limitations: ["Impractical for very large capacities", "Needs integer weights"],
    faq: [
      {
        q: "Why not greedy?",
        a: "Choosing by value or by value/weight can be suboptimal for 0/1 items; greedy is optimal only for the fractional version.",
      },
      {
        q: "Unbounded knapsack?",
        a: "Same recurrence with $K[i][c - w_i]$ (same row) when taking an item, or the 1-D loop upwards.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Max value subset within capacity, items whole.", "DP $\\Theta(nW)$."],
      },
      {
        marks: 5,
        outline: [
          "Problem statement (1).",
          "Recurrence (2).",
          "Small table (1).",
          "Complexity and greedy counterexample (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem definition and why greedy fails (example) — 2.",
          "Recurrence with justification — 2.",
          "Full table and traceback — 4.",
          "Complexity, pseudo-polynomial time, space optimisation — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. M. Karp, “Reducibility among combinatorial problems,” in Complexity of Computer Computations, Plenum Press, 1972.",
      supports: "NP-completeness of the knapsack decision problem.",
    },
    {
      citation: "J. Kleinberg, É. Tardos, Algorithm Design, Addison-Wesley, 2005, §6.4.",
      supports: "Subset-sum / knapsack DP and its pseudo-polynomial running time.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
