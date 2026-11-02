import type { AlgorithmEntry } from "../types";

export const digitDpEntry: AlgorithmEntry = {
  slug: "digit-dp",
  name: "Digit DP",
  aliases: ["DP over digits", "Counting numbers with a digit property", "Tight/loose DP"],
  curriculum: [298],
  domain: "dynamic-programming",
  subcategory: "Counting DP",
  difficulty: "advanced",
  summary:
    "Counts the numbers up to N with a property of their digits (here: digit sum S) by choosing digits from the most significant. A “tight” flag tracks whether the prefix still equals N's; once it is smaller, the rest is free and the count depends only on (position, state), which is memoized.",
  tags: ["digit dp", "counting", "memoization", "combinatorics", "number theory"],
  prerequisites: ["Memoization vs Tabulation (Top-Down and Bottom-Up DP)", "Place-value notation"],
  related: ["memoization-tabulation", "assignment-dp"],
  problem: {
    input: "A bound N and a target digit sum S.",
    output: "How many integers x with 0 ≤ x ≤ N have digit sum S.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Counting up to N one number at a time is hopeless for N = 10¹⁸. Instead, build numbers digit by digit, as if writing them out with leading zeros under N. While your prefix matches N's, the next digit may not exceed N's digit there. The moment you write a smaller digit, every later digit is free (0–9), and how many ways remain depends only on how many digits are left and what sum you still need.",
      },
      {
        kind: "p",
        text: "Those free sub-problems repeat constantly: “two free digits that sum to 9” is needed after the prefix 0, after 1, after 2, … So they are computed once and remembered.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Write N's digits $d_0 d_1 \\dots d_{L-1}$, most significant first.",
          "f(pos, rem, tight) counts the ways to choose digits pos … L − 1 with sum rem. At the end, return 1 if rem = 0.",
          "Try every digit x from 0 to (tight ? $d_{pos}$ : 9), up to rem; the child is tight only if this one was tight and $x = d_{pos}$.",
          "Memoize f only when not tight: the tight case occurs once per position.",
        ],
      },
      { kind: "p", text: "**Worked example** (the first preset): N = 345, S = 10." },
      {
        kind: "table",
        head: ["First digit", "Remaining digits", "Ways"],
        rows: [
          ["0", "two free digits with sum 10", "9"],
          ["1", "two free digits with sum 9", "10"],
          ["2", "two free digits with sum 8", "9"],
          [
            "3 (tight)",
            "second digit 0–3 free (one free digit with sum 7 − x: 4 ways), or 4 (tight) then a last digit ≤ 5 with sum 3 (1 way)",
            "5",
          ],
        ],
      },
      {
        kind: "p",
        text: "Total 9 + 10 + 9 + 5 = 33. The memo table holds the free counts: two digits with sums 8, 9, 10 → 9, 10, 9; one digit with sums 0 to 9 → 1 each, sum 10 → 0.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Count a range [lo, hi] as count(hi) − count(lo − 1) (the JavaScript sample).",
          "Leading zeros are harmless for digit sums; properties such as “no repeated adjacent digit” need an extra “started” flag.",
          "The state is (position, property state, tight); the work is positions × states × 10.",
          "Write it top-down with a memo (the Python sample uses lru_cache) or bottom-up over positions.",
          "Typical properties: digit sum (or sum modulo k), the number modulo k, banned digits or patterns, counts of a digit.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Why tight states are not memoized.** For each position there is exactly one tight prefix (N's own), so caching them saves nothing, and mixing them with free states would be wrong: a free state may use any digit, a tight one may not.",
      },
      {
        kind: "p",
        text: "**Cost.** At most L · (S + 1) free states, each trying up to 10 digits, plus one tight state per position:",
      },
      {
        kind: "math",
        tex: "T = O(L \\cdot S \\cdot 10), \\qquad L = \\lfloor \\log_{10} N \\rfloor + 1",
      },
      {
        kind: "p",
        text: "For N = 10¹⁸ that is about 18 · 162 · 10 ≈ 30,000 steps instead of 10¹⁸. The property tests compare the count with direct enumeration and check the bound on the work.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The free counts have a closed form by inclusion–exclusion: the number of k-digit strings with sum r is $\\sum_i (-1)^i \\binom{k}{i} \\binom{r - 10i + k - 1}{k - 1}$.",
          "Digit DP generalises to automata: count strings up to N accepted by a finite automaton, with the automaton state in the DP.",
          "Other bases work the same way (binary digit DP counts numbers with a given number of 1-bits).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(L S)", average: "O(L S)", worst: "O(L S)" },
    space: "O(L S)",
    worstClass: "other",
    note: "L = number of digits of N (≈ log₁₀ N), S = target sum; times 10 digits per state.",
  },
  properties: [
    { label: "State", value: "(position, remaining sum, tight)" },
    { label: "Memoized", value: "Only the free (not tight) states" },
  ],
  implementations: [
    {
      language: "python",
      entry: "count_digit_sum",
      code: `from functools import lru_cache


def count_digit_sum(n, s):
    digits = list(map(int, str(n)))

    @lru_cache(maxsize=None)
    def f(pos, rem, tight):
        if rem < 0:
            return 0
        if pos == len(digits):
            return 1 if rem == 0 else 0
        limit = digits[pos] if tight else 9
        return sum(f(pos + 1, rem - x, tight and x == limit) for x in range(limit + 1))

    return f(0, s, True)
`,
      tests: [
        { args: [345, 10], expected: 33 },
        { args: [999999, 27], expected: 55252 },
        { args: [0, 0], expected: 1 },
      ],
    },
    {
      language: "javascript",
      entry: "countDigitSumRange",
      code: `// Numbers in [lo, hi] with digit sum s, as count(hi) − count(lo − 1).
function countDigitSumRange(lo, hi, s) {
  const count = (n) => {
    if (n < 0) return 0;
    const d = String(n).split("").map(Number), memo = new Map();
    const f = (pos, rem, tight) => {
      if (rem < 0) return 0;
      if (pos === d.length) return rem === 0 ? 1 : 0;
      const key = pos + "," + rem;
      if (!tight && memo.has(key)) return memo.get(key);
      let total = 0;
      const limit = tight ? d[pos] : 9;
      for (let x = 0; x <= limit; x++) total += f(pos + 1, rem - x, tight && x === limit);
      if (!tight) memo.set(key, total);
      return total;
    };
    return f(0, s, true);
  };
  return count(hi) - count(lo - 1);
}
`,
      tests: [
        { args: [0, 345, 10], expected: 33 },
        { args: [100, 199, 10], expected: 10 },
      ],
    },
  ],
  visualizer: "digit-dp",
  practice: [
    {
      id: "digit-count",
      kind: "numeric",
      prompt: "How many integers from 0 to 1000 have digit sum 3?",
      answer: 10,
      explanation:
        "The 3-digit strings (with leading zeros) of sum 3: C(5, 2) = 10 (3, 12, 21, 30, 102, 111, 120, 201, 210, 300); 1000 itself has sum 1.",
      hints: ["Count digit strings of length 3 with sum 3 (stars and bars)."],
      objective: "Apply the digit decomposition",
    },
    {
      id: "digit-tight",
      kind: "mcq",
      prompt: "Why must the memo ignore tight states (or key on the tight flag)?",
      options: [
        "A tight state limits the next digit to N's digit, so it has fewer completions than the free state with the same position and sum",
        "Because tight states never occur",
        "Because tight states are always zero",
        "To save memory only",
      ],
      answer: 0,
      explanation:
        "Reusing a free count for a tight state would allow digits that make x exceed N.",
      distractors: {
        1: "There is one tight state per position.",
        2: "They are often non-zero (the 5 ways in the example).",
        3: "Correctness, not memory, is the issue.",
      },
      hints: ["Which digits may follow in each case?"],
      objective: "Understand the tight flag",
    },
  ],
  exam: {
    definition:
      "Digit DP counts numbers in a range with a digit-defined property by filling digits from the most significant, tracking whether the prefix is still tight against the bound and memoizing the free states.",
    steps: [
      "Digits of N.",
      "f(pos, state, tight): try digits up to (tight ? d[pos] : 9).",
      "Memoize free states; base case at the end.",
      "Range [lo, hi] = count(hi) − count(lo − 1).",
    ],
    timeComplexity: "$O(L \\cdot |states| \\cdot 10)$.",
    spaceComplexity: "$O(L \\cdot |states|)$.",
    correctness:
      "Every x ≤ N corresponds to exactly one digit sequence that stays within the tight constraint.",
    applications: [
      "Counting numbers with digit constraints",
      "Sums of digit functions over ranges",
      "Competitive programming",
    ],
    limitations: ["The property must be computable digit by digit with a small state"],
    faq: [
      {
        q: "What about leading zeros?",
        a: "Usually harmless; add a “started” flag when the property depends on the first non-zero digit.",
      },
    ],
    answers: [
      { marks: 2, outline: ["State (pos, sum, tight).", "Memoize free states."] },
      {
        marks: 5,
        outline: [
          "Idea (1).",
          "Recurrence with the tight flag (2).",
          "Example (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem and the infeasibility of enumeration (1).",
          "State and recurrence (3).",
          "Worked example (3).",
          "Range counting and variations (1).",
          "Complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, ch. 15.",
      supports:
        "Memoized recursion over overlapping subproblems, which digit DP applies to digit positions.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review. Digit DP is a competitive-programming technique without a single original paper; the reference covers the underlying method only.",
  },
  version: 1,
  updated: "2026-10-23",
};
