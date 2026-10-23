import type { AlgorithmEntry } from "../types";

export const memoizationTabulationEntry: AlgorithmEntry = {
  slug: "memoization-tabulation",
  name: "Memoization vs Tabulation (Top-Down and Bottom-Up DP)",
  aliases: ["Memoization", "Tabulation", "Top-down DP", "Bottom-up DP", "Caching recursion"],
  curriculum: [251, 252],
  domain: "dynamic-programming",
  subcategory: "DP fundamentals",
  difficulty: "beginner",
  summary:
    "The two ways to evaluate a dynamic-programming recurrence. Memoization keeps the recursion and caches each answer, computing only the subproblems it reaches; tabulation fills a table in dependency order with plain loops. Both turn exponential recursion into polynomial time.",
  tags: ["memoization", "tabulation", "top-down", "bottom-up", "recursion", "caching"],
  prerequisites: ["Recursion", "Arrays"],
  related: ["knapsack", "lcs", "edit-distance", "lis"],
  problem: {
    input:
      "A recurrence with overlapping subproblems; here C(n, k) = C(n − 1, k − 1) + C(n − 1, k).",
    output: "Its value, computed without solving any subproblem twice.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Plain recursion for Pascal's rule recomputes the same values again and again: C(6, 3) makes 39 calls to produce 20, and the count grows like the answer itself. The fix is to remember. **Memoization** (top-down) keeps the recursive code and stores every result the first time it is computed; later calls look it up. **Tabulation** (bottom-up) drops the recursion and fills a table from the smallest subproblems up, in an order where everything a cell needs is already there.",
      },
      {
        kind: "p",
        text: "Same recurrence, same answers, different trade-offs. Top-down only touches the subproblems the question actually needs. Bottom-up has no recursion overhead or stack-depth limits, and its fixed order makes it easy to keep only the last row.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Top-down: write the recursion; before computing C(a, b), check the memo; after computing it, store it.",
          "Bottom-up: choose an order in which dependencies come first (here, increasing a), loop over the table and apply the recurrence.",
          "Both: base cases C(a, 0) = C(a, a) = 1.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the preset C(4, 2)). The top-down calls, in order:",
      },
      {
        kind: "table",
        head: ["Call", "Outcome"],
        rows: [
          ["C(4, 2)", "needs C(3, 1) and C(3, 2)"],
          ["C(3, 1)", "needs C(2, 0) and C(2, 1)"],
          ["C(2, 0)", "base case: 1"],
          ["C(2, 1)", "needs C(1, 0) = 1 and C(1, 1) = 1: stores 2"],
          ["C(3, 1)", "stores 1 + 2 = 3"],
          ["C(3, 2)", "C(2, 1) is in the memo (2); C(2, 2) = 1: stores 3"],
          ["C(4, 2)", "stores 3 + 3 = 6"],
        ],
      },
      {
        kind: "p",
        text: "That is 9 calls, one answered from the memo, touching 8 distinct subproblems. Bottom-up fills every cell with $b \\le \\min(a, 2)$ for $a = 0..4$: 12 cells, including C(0, 0), C(3, 0), C(4, 0) and C(4, 1), which the answer never needed. Plain recursion would make $2 \\cdot 6 - 1 = 11$ calls; the gap grows quickly (39 against 19 for C(6, 3)).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "In Python, `functools.lru_cache` (or `cache`) memoizes a function in one line (the Python sample); the arguments must be hashable.",
          "Deep recursion can overflow the call stack (Python's default limit is 1000 frames). Tabulation, or raising the limit with care, avoids that.",
          "Bottom-up often allows **space optimisation**: Pascal's rule needs only the previous row, and updating a single row from right to left reuses it in place (the JavaScript sample).",
          "Memo keys must capture the whole state: forgetting a parameter gives wrong answers that only show up on some inputs.",
          "A sentinel such as −1 for “not computed” fails if −1 can be a real answer; use a separate flag or None.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Why it works.** A recurrence whose subproblems form a DAG (no subproblem depends on itself) can be evaluated once per subproblem, in any topological order of that DAG. Tabulation picks the order explicitly; memoization lets the recursion find it, a depth-first traversal of the DAG.",
      },
      {
        kind: "p",
        text: "**Counts for C(n, k)**, with $0 < k < n$. Top-down solves the $k(n-k)$ inner subproblems once each, reaches $n$ base cases, and makes two calls per inner subproblem plus the first. Bottom-up fills $\\sum_{a=0}^{n} (\\min(a, k) + 1)$ cells, which is exactly $1 + k(k+1)/2$ more than top-down touches. Plain recursion makes $2\\binom{n}{k} - 1$ calls.",
      },
      {
        kind: "math",
        tex: "\\text{calls}_{\\text{memo}} = 1 + 2k(n - k), \\qquad \\text{calls}_{\\text{plain}} = 2\\binom{n}{k} - 1",
      },
      {
        kind: "p",
        text: "The oracle checks all of these counts on every run, and a property test checks every $n \\le 12$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "When the reachable subproblems are sparse (e.g. some game-tree or digit-DP states), top-down can be far cheaper than a full table.",
          "When every cell is needed anyway, bottom-up is usually faster in practice: no function calls, no hashing, sequential memory access.",
          "Some optimisations suit one style: monotone-queue and convex-hull speed-ups are natural in the bottom-up order; pruning and branch-and-bound fit top-down.",
          "Memoization is not specific to DP: caching pure functions is a general technique (Michie, 1968, coined the term “memo function”).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(nk)", average: "O(nk)", worst: "O(nk)" },
    space: "O(nk)",
    worstClass: "n^2",
    note: "For C(n, k) by either method; plain recursion is $O(\\binom{n}{k})$. Bottom-up needs only $O(k)$ space with one row.",
  },
  properties: [
    { label: "Top-down", value: "Recursion + cache; computes only reachable subproblems" },
    { label: "Bottom-up", value: "Loops in dependency order; easy to save space" },
  ],
  implementations: [
    {
      language: "python",
      entry: "binomial",
      code: `from functools import lru_cache


@lru_cache(maxsize=None)
def binomial(n, k):
    # Top-down: the recursion is unchanged; the cache does the rest.
    if k == 0 or k == n:
        return 1
    return binomial(n - 1, k - 1) + binomial(n - 1, k)
`,
      tests: [
        { args: [6, 3], expected: 20 },
        { args: [30, 15], expected: 155117520 },
        { args: [0, 0], expected: 1 },
      ],
    },
    {
      language: "javascript",
      entry: "binomialRow",
      code: `// Bottom-up with a single row: row[b] holds C(a, b) for the current a.
function binomialRow(n, k) {
  const row = new Array(k + 1).fill(0);
  row[0] = 1;
  for (let a = 1; a <= n; a++)
    for (let b = Math.min(a, k); b > 0; b--) row[b] += row[b - 1]; // right to left
  return row[k];
}
`,
      tests: [
        { args: [6, 3], expected: 20 },
        { args: [30, 15], expected: 155117520 },
        { args: [5, 0], expected: 1 },
      ],
    },
  ],
  visualizer: "memoization-tabulation",
  practice: [
    {
      id: "memo-calls",
      kind: "numeric",
      prompt:
        "How many calls does the memoized recursion make for C(6, 3), counting calls answered from the memo?",
      answer: 19,
      explanation:
        "There are k(n − k) = 9 inner subproblems, each making two calls, plus the first call: 1 + 18 = 19.",
      hints: ["Which calls are not base cases, and how many calls does each make?"],
      objective: "Count the work of memoization",
    },
    {
      id: "memo-vs-tab",
      kind: "mcq",
      prompt: "Which is an advantage of tabulation over memoization?",
      options: [
        "No recursion depth limit, and its fixed order allows keeping only the last row",
        "It computes fewer subproblems",
        "It works for recurrences with cycles",
        "It does not need base cases",
      ],
      answer: 0,
      explanation:
        "Loops avoid stack overflow and call overhead, and knowing the order lets you discard rows that are no longer needed.",
      distractors: {
        1: "Usually the opposite: top-down computes only what it reaches.",
        2: "Neither method handles cyclic dependencies.",
        3: "Both need base cases.",
      },
      hints: ["Think about the call stack and about memory."],
      objective: "Choose between the two styles",
    },
  ],
  exam: {
    definition:
      "Memoization (top-down DP) caches the results of a recursive function so each subproblem is solved once; tabulation (bottom-up DP) fills a table of subproblem results iteratively in an order that respects dependencies.",
    steps: [
      "Define the state and recurrence, with base cases.",
      "Top-down: recurse; check and fill the memo.",
      "Bottom-up: pick a topological order of states; loop and fill the table.",
      "Optionally reduce space by keeping only the states still needed.",
    ],
    timeComplexity: "(number of states) × (work per state), for both; $O(nk)$ for C(n, k).",
    spaceComplexity:
      "One entry per state (plus recursion depth for top-down); often reducible bottom-up.",
    correctness:
      "Each state depends only on earlier states in a DAG; computing each once, after its dependencies, gives the same values as the plain recursion.",
    applications: [
      "Every DP problem: knapsack, LCS, edit distance, shortest paths in DAGs",
      "Caching pure functions",
    ],
    limitations: [
      "Top-down: recursion depth, hashing overhead",
      "Bottom-up: may compute unneeded states; needs an explicit order",
    ],
    faq: [
      {
        q: "Which should I write first?",
        a: "Top-down is often quicker to derive from the recurrence; convert to bottom-up when you need speed, less memory or no recursion.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Top-down: recursion + cache. Bottom-up: iterative table.",
          "Both solve each subproblem once.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Overlapping subproblems (1).",
          "Memoization with example (2).",
          "Tabulation with example (2).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Overlapping subproblems and exponential plain recursion (2).",
          "Memoization: code, call trace (2).",
          "Tabulation: order, table (2).",
          "Comparison: states touched, stack, space optimisation (3).",
          "When to use each (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "D. Michie, “‘Memo’ functions and machine learning,” Nature, 218, 1968.",
      supports: "The term and idea of memo functions.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, ch. 15.",
      supports:
        "Top-down with memoization versus the bottom-up method, and overlapping subproblems.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
