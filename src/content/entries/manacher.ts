import type { AlgorithmEntry } from "../types";

export const manacherEntry: AlgorithmEntry = {
  slug: "manacher",
  name: "Manacher's Algorithm (Longest Palindromic Substring)",
  aliases: ["Manacher", "Longest palindromic substring", "Palindrome radii"],
  curriculum: [328],
  domain: "strings",
  subcategory: "Palindromes",
  difficulty: "advanced",
  summary:
    "Finds the longest palindromic substring in linear time. It records the palindrome radius around every centre, and inside a known palindrome it starts each centre from its mirror image's radius instead of from zero.",
  tags: ["palindrome", "string", "linear time", "radius", "centre expansion"],
  prerequisites: ["Strings", "Expanding around centres"],
  related: ["kmp", "suffix-array"],
  problem: {
    input: "A string s.",
    output:
      "The longest substring of s that reads the same forwards and backwards (the leftmost one if several tie), plus the palindrome radius at every centre.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The simple method tries every centre and expands outwards while the two ends match: $O(n^2)$ on a string like aaaa…a. Manacher's observation is that a palindrome is a mirror. If you already know a long palindrome, every position in its right half sees, reflected, the same letters as the matching position in its left half, whose answer you already have.",
      },
      {
        kind: "p",
        text: "So keep the palindrome that reaches furthest right. For a new centre inside it, copy the mirror's radius (cut off at the right edge, because beyond the edge the mirror says nothing), then expand only past what is already known. Each successful expansion pushes the right edge further, and the edge only moves right, so the total work is linear.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Put a separator between and around the letters: abacabad becomes T = #a#b#a#c#a#b#a#d#. Now every palindrome in T has odd length, so even and odd palindromes of s both get a single centre.",
          "Keep $C$ and $R$: the centre and right end of the palindrome reaching furthest right so far.",
          "For each position $i$ of T: if $i < R$, start with $P[i] = \\min(R - i, P[2C - i])$; otherwise start at 0.",
          "Expand: while $T[i - P[i] - 1] = T[i + P[i] + 1]$, increase $P[i]$.",
          "If $i + P[i] > R$, set $C = i$ and $R = i + P[i]$.",
          "$P[i]$ is the length of the palindrome of s centred at $i$. The largest $P[i]$ gives the answer, starting at position $(i - P[i]) / 2$ of s.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, s = abacabad, T = #a#b#a#c#a#b#a#d#, positions 0–16). Rows with $P[i] = 0$ and no mirror are left out.",
      },
      {
        kind: "table",
        head: ["i", "T[i]", "Inside (C, R)?", "Start", "P[i]", "C, R after"],
        rows: [
          ["1", "a", "no", "0", "1", "1, 2"],
          ["3", "b", "no", "0", "3", "3, 6"],
          ["5", "a", "yes: mirror 1", "min(1, 1) = 1", "1", "3, 6"],
          ["7", "c", "no", "0", "7", "7, 14"],
          ["9", "a", "yes: mirror 5", "min(5, 1) = 1", "1", "7, 14"],
          ["11", "b", "yes: mirror 3", "min(3, 3) = 3", "3", "7, 14"],
          ["13", "a", "yes: mirror 1", "min(1, 1) = 1", "1", "7, 14"],
          ["15", "d", "no", "0", "1", "15, 16"],
        ],
      },
      {
        kind: "p",
        text: "The largest radius is $P[7] = 7$: the palindrome abacaba, starting at $(7 - 7)/2 = 0$. Position 11 started at 3 for free and needed one comparison (c against d) to stop. The whole run makes 23 letter comparisons for the 17 positions of T.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Check both bounds while expanding, or use sentinels (e.g. ^ and $ at the ends of T) that never match.",
          "The separator must not occur in s; with a real alphabet, work on indices instead of building T.",
          "$P[i]$ in T equals the palindrome's length in s, so no conversion is needed except for the start: $(i - P[i]) / 2$.",
          "To report the leftmost longest palindrome, replace the best only on a strictly larger radius.",
          "Summing $\\lceil P[i] / 2 \\rceil$ over all $i$ counts every palindromic substring (with repeats) in $O(n)$; the JavaScript sample does this.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Mirror lemma.** Let $T[C-R' .. C+R']$ be a palindrome (with $R = C + R'$) and $i < R$ with mirror $j = 2C - i$. The palindrome at $j$, cut to fit inside the big one, reflects to a palindrome at $i$. So $P[i] \\ge \\min(R - i, P[j])$. If $P[j] < R - i$, then $P[i] = P[j]$ exactly: the letters just outside $j$'s palindrome differ and both lie inside the big palindrome, so they reflect to differing letters just outside $i$'s.",
      },
      {
        kind: "p",
        text: "**Linear time.** A successful comparison at centre $i$ always reads a letter beyond the current $R$: starting from the mirror's radius skips everything already known, and when $P[2C - i] < R - i$ the first comparison fails by the mirror lemma. Each success extends the reach one position past $R$, and $R$ is then moved there. $R$ never exceeds $|T| - 1$, so there are fewer than $|T|$ successful comparisons; each centre has at most one failing comparison. With $m = |T| = 2n + 1$:",
      },
      { kind: "math", tex: "\\text{comparisons} \\le (m - 1) + m = 2m - 1 = 4n + 1" },
      {
        kind: "p",
        text: "The property tests check this bound on random strings. Never updating $C$ and $R$, so that every centre expands from zero, breaks it (the tests find a counterexample), even though the answers stay correct.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Manacher's 1975 paper solved a different-looking problem: finding the shortest palindrome that is a prefix of the input, online. The same mirror idea gives all centre radii, and that is how the algorithm is usually taught today.",
          "The palindromic tree (eertree) stores every distinct palindromic substring in $O(n)$ space and supports appending letters.",
          "Suffix structures also find the longest palindrome (via the longest common extension of s and its reverse), but with larger constants.",
          "Hashing with binary search gives $O(n \\log n)$, with a small probability of error.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "At most 4n + 1 letter comparisons.",
  },
  properties: [
    { label: "Output", value: "Radius at every centre; longest palindrome" },
    { label: "Key idea", value: "Reuse the mirror's radius inside the rightmost palindrome" },
  ],
  implementations: [
    {
      language: "python",
      entry: "longest_palindrome",
      code: `def longest_palindrome(s):
    t = "#" + "#".join(s) + "#"
    p = [0] * len(t)
    c = r = 0
    for i in range(len(t)):
        if i < r:
            p[i] = min(r - i, p[2 * c - i])
        while (i - p[i] - 1 >= 0 and i + p[i] + 1 < len(t)
               and t[i - p[i] - 1] == t[i + p[i] + 1]):
            p[i] += 1
        if i + p[i] > r:
            c, r = i, i + p[i]
    best = max(range(len(t)), key=lambda i: (p[i], -i))
    start = (best - p[best]) // 2
    return s[start:start + p[best]]
`,
      tests: [
        { args: ["abacabad"], expected: "abacaba" },
        { args: ["cbbd"], expected: "bb" },
        { args: ["forgeeksskeegfor"], expected: "geeksskeeg" },
        { args: ["a"], expected: "a" },
      ],
    },
    {
      language: "javascript",
      entry: "countPalindromes",
      code: `// Every palindromic substring, counted by position (O(n)).
function countPalindromes(s) {
  const t = ["#", ...[...s].flatMap((c) => [c, "#"])];
  const p = new Array(t.length).fill(0);
  let c = 0, r = 0, count = 0;
  for (let i = 0; i < t.length; i++) {
    if (i < r) p[i] = Math.min(r - i, p[2 * c - i]);
    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < t.length &&
           t[i - p[i] - 1] === t[i + p[i] + 1]) p[i]++;
    if (i + p[i] > r) { c = i; r = i + p[i]; }
    count += Math.ceil(p[i] / 2); // palindromes centred at i
  }
  return count;
}
`,
      tests: [
        { args: ["aaa"], expected: 6 },
        { args: ["abc"], expected: 3 },
        { args: ["abacabad"], expected: 13 },
      ],
    },
  ],
  visualizer: "manacher",
  practice: [
    {
      id: "manacher-start",
      kind: "mcq",
      prompt:
        "Position i lies inside the rightmost palindrome (centre C, right end R) and its mirror has radius P[2C − i] = 5, but R − i = 2. Where does the expansion at i start?",
      options: ["At 2", "At 5", "At 0", "At 7"],
      answer: 0,
      explanation:
        "Only the part inside the big palindrome is guaranteed to be mirrored, so start from min(R − i, P[mirror]) = 2 and compare from there.",
      distractors: {
        1: "Beyond R the mirror tells us nothing; radius 5 is not guaranteed.",
        2: "Starting at 0 is correct but throws away the information that makes the algorithm linear.",
        3: "Radii are not added.",
      },
      hints: ["Which part of the mirror's palindrome is inside the big palindrome?"],
      objective: "Apply the mirror rule",
    },
    {
      id: "manacher-radius",
      kind: "numeric",
      prompt:
        "Run Manacher's algorithm on s = cbbd (T = #c#b#b#d#). What is the largest value in P?",
      answer: 2,
      explanation:
        "P = [0, 1, 0, 1, 2, 1, 0, 1, 0]. The largest is P[4] = 2, at the # between the two b's: the even palindrome bb.",
      hints: ["Even-length palindromes are centred on a #."],
      objective: "Compute palindrome radii",
    },
  ],
  exam: {
    definition:
      "Manacher's algorithm computes, for every centre of a string, the radius of the longest palindrome centred there, in O(n) time, by reusing radii mirrored inside the rightmost palindrome found so far.",
    steps: [
      "Interleave a separator: T = #s₁#s₂#…#.",
      "Keep C, R for the palindrome reaching furthest right.",
      "P[i] ← min(R − i, P[2C − i]) if i < R, else 0; expand while the ends match.",
      "If i + P[i] > R: C ← i, R ← i + P[i].",
      "Answer: the largest P[i], starting at (i − P[i]) / 2 in s.",
    ],
    timeComplexity: "$O(n)$: at most $4n + 1$ comparisons.",
    spaceComplexity: "$O(n)$ for T and P.",
    correctness:
      "Inside a palindrome, positions mirror each other, so P[i] ≥ min(R − i, P[mirror]), with equality when P[mirror] < R − i. Successful comparisons only happen past R, which only moves right.",
    applications: [
      "Longest palindromic substring",
      "Counting palindromic substrings",
      "Palindromic factorisation problems",
    ],
    limitations: [
      "Specific to palindromes",
      "Needs a separator not in the alphabet (or index arithmetic)",
    ],
    faq: [
      {
        q: "Why the # separators?",
        a: "They give even-length palindromes a centre (a #), so one loop handles both parities.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Radius per centre, mirror reuse inside the rightmost palindrome.", "$O(n)$."],
      },
      {
        marks: 5,
        outline: [
          "Transformation with # (1).",
          "Mirror rule and expansion (2).",
          "Worked example (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem and the $O(n^2)$ centre-expansion baseline (1).",
          "Transformation (1).",
          "Algorithm with C and R (2).",
          "Worked example table (2).",
          "Mirror lemma (2).",
          "Linear-time argument (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "G. Manacher, “A new linear-time ‘on-line’ algorithm for finding the smallest initial palindrome of a string,” Journal of the ACM, 22(3), 1975.",
      supports: "The original algorithm and its linear-time argument.",
    },
    {
      citation:
        "D. Gusfield, Algorithms on Strings, Trees, and Sequences, Cambridge University Press, 1997.",
      supports:
        "Finding all maximal palindromes in linear time by another route (suffix trees and longest common extensions).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
