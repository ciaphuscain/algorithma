import type { AlgorithmEntry } from "../types";

export const lcsEntry: AlgorithmEntry = {
  slug: "lcs",
  name: "Longest Common Subsequence",
  aliases: ["LCS"],
  curriculum: [271],
  domain: "dynamic-programming",
  subcategory: "Sequence DP",
  difficulty: "intermediate",
  summary:
    "Finds the longest sequence of characters that appears in the same order (not necessarily contiguously) in two strings, with an (m+1)×(n+1) DP table.",
  tags: ["dynamic programming", "strings", "table", "subsequence", "diff", "bioinformatics"],
  prerequisites: ["Strings", "Edit Distance (Levenshtein)"],
  related: ["edit-distance", "knapsack", "lis"],
  problem: {
    input: "Two sequences $a$ (length $m$) and $b$ (length $n$).",
    output:
      "The maximum length of a sequence that is a subsequence of both, and one such sequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A **subsequence** keeps some characters of a string in their original order, possibly skipping others: ACE is a subsequence of ABCDE. The LCS asks for the longest thread that runs through both strings.",
      },
      {
        kind: "p",
        text: "Compare the last characters. If they match, that character can end the common subsequence, and the rest is the LCS of the two shorter strings. If they differ, one of them is not used: try dropping each and keep the better result.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "$L[i][j]$ is the LCS length of the first $i$ characters of $a$ and the first $j$ of $b$. Fill the table row by row: on a match take the diagonal plus one; otherwise take the larger of the cells above and to the left. Then walk back from $L[m][n]$: every diagonal step on a match contributes one character.",
      },
      { kind: "heading", text: "Example" },
      {
        kind: "p",
        text: "For $a$ = ABCBDAB and $b$ = BDCABA the LCS length is 4. Tracing back (moving up on ties) gives BCBA; BDAB is another LCS of the same length. The visualizer fills the full 8 × 7 table and highlights the traceback path.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Index carefully: row $i$ refers to `a[i-1]` in 0-based strings.",
          "Only two rows are needed for the length; recovering the subsequence in linear space uses Hirschberg's method.",
          "Different tie-breaking during traceback yields different (equally long) answers.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "math",
        tex: "L[i][j] = \\begin{cases} 0 & i = 0 \\text{ or } j = 0 \\\\ L[i-1][j-1] + 1 & a_i = b_j \\\\ \\max(L[i-1][j],\\, L[i][j-1]) & a_i \\ne b_j \\end{cases}",
      },
      {
        kind: "p",
        text: "**Optimal substructure.** If $a_i = b_j$, some LCS ends with that character (any LCS not using it can be modified to end with it), and the rest is an LCS of the prefixes. If $a_i \\ne b_j$, an LCS cannot use both last characters, so it is an LCS of $a_{1..i-1}$ with $b_{1..j}$ or of $a_{1..i}$ with $b_{1..j-1}$.",
      },
      {
        kind: "p",
        text: "The table has $(m+1)(n+1)$ cells, each $O(1)$: $\\Theta(mn)$ time. There are $2^m$ subsequences of $a$, so brute force is exponential.",
      },
      {
        kind: "p",
        text: "**Relation to edit distance:** with insertions and deletions only, the distance between $a$ and $b$ is $m + n - 2\\,\\text{LCS}(a, b)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**diff** tools compare files line by line as an LCS problem; the Hunt–Szymanski and Myers algorithms are faster when differences are few.",
          "**Longest common substring** (contiguous) is a different problem, with a similar table where mismatches reset to 0.",
          "**LIS connection:** the longest increasing subsequence of a permutation is its LCS with the sorted permutation.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(mn)", average: "\\Theta(mn)", worst: "\\Theta(mn)" },
    space: "\\Theta(mn)",
    worstClass: "n^2",
    note: "$O(\\min(m, n))$ space if only the length is needed.",
  },
  properties: [
    { label: "Technique", value: "Bottom-up dynamic programming" },
    { label: "Answer unique?", value: "The length is; the sequence often is not" },
  ],
  implementations: [
    {
      language: "python",
      entry: "lcs_length",
      code: `def lcs_length(a, b):
    """Length of the longest common subsequence of a and b."""
    m, n = len(a), len(b)
    L = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                L[i][j] = L[i - 1][j - 1] + 1
            else:
                L[i][j] = max(L[i - 1][j], L[i][j - 1])
    return L[m][n]
`,
      tests: [
        { args: ["ABCBDAB", "BDCABA"], expected: 4 },
        { args: ["abc", "xyz"], expected: 0 },
        { args: ["", "abc"], expected: 0 },
      ],
    },
    {
      language: "javascript",
      entry: "lcsLength",
      code: `function lcsLength(a, b) {
  let prev = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const curr = [0];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    prev = curr;
  }
  return prev[b.length];
}
`,
      tests: [
        { args: ["ABCBDAB", "BDCABA"], expected: 4 },
        { args: ["algo", "algo"], expected: 4 },
      ],
    },
  ],
  visualizer: "lcs",
  practice: [
    {
      id: "lcs-small",
      kind: "numeric",
      prompt: "What is the length of the LCS of “AGGTAB” and “GXTXAYB”?",
      answer: 4,
      explanation:
        "GTAB appears in order in both strings, and no common subsequence of length 5 exists.",
      hints: ["Look for G, then T, then A, then B in both."],
      objective: "Compute an LCS by hand",
    },
    {
      id: "lcs-vs-substring",
      kind: "mcq",
      prompt: "Which statement is true?",
      options: [
        "A subsequence need not be contiguous; a substring must be",
        "A subsequence must be contiguous; a substring need not be",
        "They mean the same thing",
        "A subsequence may reorder characters",
      ],
      answer: 0,
      explanation:
        "Subsequences may skip characters but keep their order; substrings are contiguous blocks.",
      distractors: {
        1: "It is the other way round.",
        2: "They differ: ACE is a subsequence of ABCDE but not a substring.",
        3: "Order is always preserved.",
      },
      hints: ["Is ACE a subsequence of ABCDE? A substring?"],
      objective: "Distinguish subsequence and substring",
    },
  ],
  exam: {
    definition:
      "The longest common subsequence of two sequences is a longest sequence that is a subsequence of both; it is computed by dynamic programming over prefixes.",
    steps: [
      "Create $L[0..m][0..n]$ with row 0 and column 0 equal to 0.",
      "For each $i, j$: if $a_i = b_j$, $L[i][j] = L[i-1][j-1] + 1$; else $L[i][j] = \\max(L[i-1][j], L[i][j-1])$.",
      "Return $L[m][n]$; trace back diagonally on matches to recover the sequence.",
    ],
    timeComplexity: "$\\Theta(mn)$.",
    spaceComplexity: "$\\Theta(mn)$, or $O(\\min(m, n))$ for the length only.",
    correctness:
      "Optimal substructure on the last characters, with overlapping subproblems solved once each in the table.",
    applications: [
      "File comparison (diff)",
      "DNA and protein sequence comparison",
      "Version control merging",
      "Plagiarism detection",
    ],
    limitations: [
      "Quadratic time and space",
      "Exponentially many LCSs can exist; the algorithm returns one",
    ],
    faq: [
      {
        q: "Is the LCS unique?",
        a: "Its length is; the subsequence may not be (ABCBDAB/BDCABA has BCBA and BDAB, among others).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Longest sequence common to both, in order, not necessarily contiguous.",
          "DP, $\\Theta(mn)$.",
        ],
      },
      {
        marks: 5,
        outline: ["Definition (1).", "Recurrence (2).", "Small table (1).", "Complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "Definition with an example — 1.",
          "Optimal substructure argument and recurrence — 3.",
          "Filled table and traceback for a 6–7 character example — 4.",
          "Complexity and applications — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §15.4.",
      supports: "Optimal substructure, the recurrence, and the ABCBDAB/BDCABA example.",
    },
    {
      citation:
        "D. S. Hirschberg, “A linear space algorithm for computing maximal common subsequences,” Communications of the ACM, 18(6), 1975.",
      supports: "Linear-space recovery of an LCS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
