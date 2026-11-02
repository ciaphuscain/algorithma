import type { AlgorithmEntry } from "../types";

export const lisEntry: AlgorithmEntry = {
  slug: "lis",
  name: "Longest Increasing Subsequence",
  aliases: ["LIS", "Patience sorting", "Longest increasing subsequence (n log n)"],
  curriculum: [269, 270],
  domain: "dynamic-programming",
  subcategory: "Sequence DP",
  difficulty: "intermediate",
  summary:
    "Finds the longest strictly increasing subsequence of an array. The O(n²) dynamic programme is the classic; keeping the smallest tail for each length and binary-searching it gives O(n log n).",
  tags: ["subsequence", "binary search", "patience sorting", "sequence dp"],
  prerequisites: ["Memoization vs Tabulation (Top-Down and Bottom-Up DP)", "Binary Search"],
  related: ["lcs", "binary-search"],
  problem: {
    input: "An array of $n$ numbers.",
    output:
      "The length of the longest strictly increasing subsequence (elements in their original order, not necessarily adjacent), and one such subsequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Deal the numbers like cards onto piles, left to right. Each card goes on the leftmost pile whose top card is at least as large; if there is none, it starts a new pile on the right. The number of piles at the end is the length of the longest increasing subsequence. This is **patience sorting**, named after the card game.",
      },
      {
        kind: "p",
        text: "The pile tops are exactly the array `tails`: `tails[k]` is the smallest value that can end an increasing subsequence of length $k + 1$. A small tail is better, because more later numbers can extend it.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**$O(n^2)$ DP:** $best[i] = 1 + \\max\\{best[j] : j < i,\\ A[j] < A[i]\\}$ (or 1 if no such $j$). The answer is $\\max_i best[i]$.",
          "**$O(n \\log n)$:** for each $A[i]$, binary-search the first $k$ with $tails[k] \\ge A[i]$; set $tails[k] = A[i]$, extending `tails` when $k$ is its current length.",
          "To recover a subsequence, remember for each $i$ the index that ended the length-$k$ subsequence it extends ($prev[i]$), and follow these links back from the last tail.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [10, 9, 2, 5, 3, 7, 21, 18]$.",
      },
      {
        kind: "table",
        head: ["i", "A[i]", "position k", "tails afterwards", "prev[i]"],
        rows: [
          ["0", "10", "0 (new)", "[10]", "—"],
          ["1", "9", "0", "[9]", "—"],
          ["2", "2", "0", "[2]", "—"],
          ["3", "5", "1 (new)", "[2, 5]", "2"],
          ["4", "3", "1", "[2, 3]", "2"],
          ["5", "7", "2 (new)", "[2, 3, 7]", "4"],
          ["6", "21", "3 (new)", "[2, 3, 7, 21]", "5"],
          ["7", "18", "3", "[2, 3, 7, 18]", "5"],
        ],
      },
      {
        kind: "p",
        text: "Length 4. Following prev back from index 7 gives indices 7, 5, 4, 2, so one longest subsequence is 2, 3, 7, 18. The binary searches make 10 comparisons in total.",
      },
      {
        kind: "callout",
        tone: "warning",
        title: "tails is not a subsequence",
        text: "`tails` can mix elements from different subsequences (in other inputs, a later small value replaces an early tail). Only its length is the answer; use the prev links to recover an actual subsequence.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Strict vs non-decreasing:** for a strictly increasing subsequence search for the first tail $\\ge x$ (`bisect_left`); for non-decreasing, the first tail $> x$ (`bisect_right`).",
          "Store indices in `tails` (or a parallel `end` array) if you need to reconstruct the subsequence.",
          "Longest decreasing subsequence: run on the negated array.",
          "For 2-D problems such as nesting envelopes, sort by width ascending and height descending, then take the LIS of the heights.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** After processing $A[0..i]$, `tails` is strictly increasing and $tails[k]$ is the minimum possible last element of an increasing subsequence of length $k + 1$ within $A[0..i]$. Placing $x$ at the first $k$ with $tails[k] \\ge x$ keeps both: $x$ extends the length-$k$ subsequence ending at $tails[k-1] < x$, and it cannot extend anything longer.",
      },
      {
        kind: "p",
        text: "So the length of `tails` is the LIS length. Each of the $n$ steps does one binary search over at most $n$ tails:",
      },
      {
        kind: "math",
        tex: "T(n) = O(n \\log n), \\qquad \\text{comparisons} \\le n \\lceil \\log_2 (n + 1) \\rceil",
      },
      {
        kind: "p",
        text: "Fredman proved a matching lower bound of $\\Omega(n \\log n)$ comparisons for computing the LIS length in the comparison model.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Erdős–Szekeres theorem:** any sequence of more than $rs$ distinct numbers contains an increasing subsequence of length $r + 1$ or a decreasing one of length $s + 1$.",
          "**Random permutations:** the expected LIS length of a random permutation of $n$ grows like $2\\sqrt{n}$ (Vershik–Kerov, Logan–Shepp), with Tracy–Widom fluctuations (Baik–Deift–Johansson).",
          "**Connection to LCS:** the LIS of $A$ is the longest common subsequence of $A$ and its sorted, de-duplicated copy, which gives an $O(n^2)$ algorithm by a different route.",
          "Counting all longest subsequences, or the LIS with a minimum gap, are standard DP variations.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n)",
    worstClass: "n log n",
    note: "For the patience-sorting algorithm; the simpler DP takes $O(n^2)$.",
  },
  properties: [
    { label: "Technique", value: "DP with binary search (or plain $O(n^2)$ DP)" },
    { label: "Unique answer?", value: "The length is unique; the subsequence need not be" },
  ],
  implementations: [
    {
      language: "python",
      entry: "lis",
      code: `from bisect import bisect_left

def lis(a):
    """Returns [length, one longest strictly increasing subsequence]."""
    tails, end, prev = [], [], [None] * len(a)
    for i, x in enumerate(a):
        k = bisect_left(tails, x)       # first tail >= x
        if k == len(tails):
            tails.append(x)
            end.append(i)
        else:
            tails[k] = x
            end[k] = i
        prev[i] = end[k - 1] if k > 0 else None
    seq, i = [], end[-1] if end else None
    while i is not None:
        seq.append(a[i])
        i = prev[i]
    return [len(tails), seq[::-1]]
`,
      tests: [
        { args: [[10, 9, 2, 5, 3, 7, 21, 18]], expected: [4, [2, 3, 7, 18]] },
        { args: [[3, 3, 1, 3, 2, 2, 4]], expected: [3, [1, 2, 4]] },
        { args: [[]], expected: [0, []] },
      ],
    },
    {
      language: "javascript",
      entry: "lisLengthQuadratic",
      code: `// The classic O(n^2) dynamic programme.
function lisLengthQuadratic(a) {
  const best = a.map(() => 1);
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < i; j++)
      if (a[j] < a[i]) best[i] = Math.max(best[i], best[j] + 1);
  return a.length ? Math.max(...best) : 0;
}
`,
      tests: [
        { args: [[10, 9, 2, 5, 3, 7, 21, 18]], expected: 4 },
        { args: [[9, 7, 5, 3, 1]], expected: 1 },
        { args: [[1, 2, 3, 4, 5, 6]], expected: 6 },
      ],
    },
  ],
  visualizer: "lis",
  practice: [
    {
      id: "lis-length",
      kind: "numeric",
      prompt:
        "What is the length of the longest strictly increasing subsequence of 0, 8, 4, 12, 2, 10, 6, 14?",
      answer: 4,
      explanation:
        "For example 0, 4, 10, 14 or 0, 8, 12, 14. No increasing subsequence of length 5 exists.",
      hints: ["Run patience sorting: how many piles do you get?"],
      objective: "Compute an LIS by hand",
    },
    {
      id: "lis-tails",
      kind: "mcq",
      prompt: "After processing a prefix, what does tails[2] hold?",
      options: [
        "The smallest value that can end an increasing subsequence of length 3",
        "The third element of the longest subsequence found so far",
        "The largest value seen so far",
        "The number of subsequences of length 3",
      ],
      answer: 0,
      explanation:
        "tails[k] is the minimum possible last element over all increasing subsequences of length k + 1.",
      distractors: {
        1: "tails is generally not itself a subsequence.",
        2: "That is the last pile only when it was just extended.",
        3: "tails stores values, not counts.",
      },
      hints: ["Why is a smaller tail better?"],
      objective: "Understand the tails invariant",
    },
    {
      id: "lis-bisect",
      kind: "mcq",
      prompt:
        "To find the longest non-decreasing (rather than strictly increasing) subsequence, which change is needed?",
      options: [
        "Search for the first tail strictly greater than x",
        "Search for the first tail at least x, as before",
        "Sort the array first",
        "Reverse the array",
      ],
      answer: 0,
      explanation:
        "With equal values allowed to follow each other, x may extend a subsequence ending in x, so it replaces the first tail > x (bisect_right).",
      distractors: {
        1: "That computes the strictly increasing version.",
        2: "Sorting destroys the order the subsequence must respect.",
        3: "Reversing gives decreasing subsequences of the original.",
      },
      hints: ["Should an x be allowed to extend a subsequence that ends in x?"],
      objective: "Adapt the algorithm",
    },
  ],
  exam: {
    definition:
      "The longest increasing subsequence problem asks for a longest subsequence of a sequence whose elements are strictly increasing.",
    steps: [
      "O(n²): best[i] = 1 + max best[j] over j < i with A[j] < A[i]; answer max best[i].",
      "O(n log n): maintain tails; for each x, binary search the first tails[k] ≥ x and set tails[k] = x (append if none).",
      "Record predecessors to reconstruct one LIS.",
    ],
    timeComplexity: "$O(n^2)$ for the simple DP; $O(n \\log n)$ with tails and binary search.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "tails stays strictly increasing and tails[k] is the minimal ending value of an increasing subsequence of length k + 1; each element updates exactly the length it can achieve, so the final length of tails is the LIS length.",
    applications: [
      "Box stacking and envelope nesting",
      "Patience sorting",
      "Measuring sortedness of data",
      "Sequence alignment heuristics (e.g. MUMmer)",
    ],
    limitations: ["tails is not itself a valid subsequence", "Many LIS may exist"],
    faq: [
      {
        q: "Why binary search?",
        a: "tails is strictly increasing, so the position for x can be found in $O(\\log n)$ comparisons.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Define subsequence and LIS.",
          "DP $O(n^2)$; tails + binary search $O(n \\log n)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Problem definition (1).",
          "$O(n^2)$ recurrence (1).",
          "Tails method (2).",
          "Worked example (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition with example (1).",
          "$O(n^2)$ DP with recurrence and table (3).",
          "$O(n \\log n)$ method and its invariant (3).",
          "Reconstruction with predecessor links (2).",
          "Complexity comparison (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "C. Schensted, “Longest increasing and decreasing subsequences,” Canadian Journal of Mathematics, 13, 1961.",
      supports: "The connection between LIS length and the shape of Young tableaux.",
    },
    {
      citation:
        "M. L. Fredman, “On computing the length of longest increasing subsequences,” Discrete Mathematics, 11(1), 1975.",
      supports: "The $O(n \\log n)$ algorithm and the matching comparison lower bound.",
    },
    {
      citation:
        "D. Aldous, P. Diaconis, “Longest increasing subsequences: from patience sorting to the Baik–Deift–Johansson theorem,” Bulletin of the American Mathematical Society, 36(4), 1999.",
      supports: "Patience sorting and the behaviour of the LIS of random permutations.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
