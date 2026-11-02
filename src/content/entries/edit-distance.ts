import type { AlgorithmEntry } from "../types";

export const editDistanceEntry: AlgorithmEntry = {
  slug: "edit-distance",
  name: "Edit Distance (Levenshtein)",
  aliases: ["Levenshtein distance", "Wagner–Fischer algorithm"],
  curriculum: [276, 330],
  domain: "dynamic-programming",
  subcategory: "Edit distance family",
  difficulty: "intermediate",
  summary:
    "The minimum number of single-character insertions, deletions and substitutions that turn one string into another, computed with an (m+1)×(n+1) dynamic-programming table.",
  tags: ["dynamic programming", "strings", "table", "sequence alignment", "spell checking"],
  prerequisites: ["Strings and indexing", "Recursion", "2-D arrays"],
  related: ["bfs"],
  problem: {
    input: "Two strings $a$ (length $m$) and $b$ (length $n$).",
    output:
      "The least number of edits — insert a character, delete a character, or substitute one character for another — that transforms $a$ into $b$, and one such sequence of edits.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "How different are “kitten” and “sitting”? Change k→s, change e→i, and add a g: three edits. Spell checkers and DNA comparison tools need this number for many pairs of strings, and they need it computed exactly.",
      },
      {
        kind: "p",
        text: "Look at the last characters. Either they match and cost nothing, or the last edit was a deletion, an insertion or a substitution. Each choice leaves a smaller version of the same question. A table remembers the answer for every pair of prefixes, so no question is solved twice.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "Let $D[i][j]$ be the edit distance between the first $i$ characters of $a$ and the first $j$ characters of $b$.",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Base cases: $D[i][0] = i$ (delete everything) and $D[0][j] = j$ (insert everything).",
          "Fill the table row by row. For each cell, take the cheapest of: the cell above $+1$ (delete $a_i$), the cell to the left $+1$ (insert $b_j$), and the diagonal cell $+0$ if $a_i = b_j$, otherwise $+1$ (keep or substitute).",
          "The answer is $D[m][n]$. To list the edits, walk back from $D[m][n]$, at each step moving to a neighbour that produced the cell's value.",
        ],
      },
      { kind: "heading", text: "Worked example: cat → cart" },
      {
        kind: "table",
        head: ["", "ε", "c", "a", "r", "t"],
        rows: [
          ["ε", "0", "1", "2", "3", "4"],
          ["c", "1", "0", "1", "2", "3"],
          ["a", "2", "1", "0", "1", "2"],
          ["t", "3", "2", "1", "1", "1"],
        ],
      },
      {
        kind: "p",
        text: "$D[3][4] = 1$: keep c, keep a, insert r, keep t. The bottom-right cell is the diagonal 1 (t = t, cost 0), which came from the cell to its left, 1, which came from an insertion of r.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Off-by-one.** The table has $m+1$ rows and $n+1$ columns; row $i$ refers to character `a[i-1]` in 0-based strings.",
          "**Two rows suffice for the distance alone.** Each row depends only on the previous one, so memory drops to $O(n)$. Recovering the edits then needs the full table, or Hirschberg's divide-and-conquer method.",
          "**Early exit.** If you only need to know whether the distance is at most $k$, fill only the band of width $2k+1$ around the diagonal: $O(k \\cdot \\min(m, n))$.",
          "**Unicode.** Decide whether a “character” is a code unit, a code point or a grapheme; the distance changes accordingly.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "The recurrence" },
      {
        kind: "math",
        tex: "D[i][j] = \\min\\begin{cases} D[i-1][j] + 1 \\\\ D[i][j-1] + 1 \\\\ D[i-1][j-1] + [a_i \\ne b_j] \\end{cases} \\qquad D[i][0] = i,\\; D[0][j] = j.",
      },
      {
        kind: "p",
        text: "**Why it is correct.** Take an optimal edit script for $a_{1..i} \\to b_{1..j}$ and consider what happens to the last characters. Either $a_i$ is deleted, or $b_j$ is inserted, or $a_i$ is aligned with $b_j$ (kept if equal, substituted otherwise). Removing that final operation leaves an optimal script for the corresponding smaller prefixes (optimal substructure), so the minimum over the three cases is the answer.",
      },
      { kind: "heading", text: "Cost" },
      {
        kind: "p",
        text: "There are $(m+1)(n+1)$ cells, each filled in $O(1)$ time from three earlier cells, so time and space are $\\Theta(mn)$. Without the table, the plain recursion branches three ways at every mismatch and takes exponential time; the table works because those branches keep reaching the same prefix pairs.",
      },
      { kind: "heading", text: "A metric" },
      {
        kind: "p",
        text: "Edit distance is a metric on strings: $d(a, b) = 0$ exactly when $a = b$, $d(a, b) = d(b, a)$ (reverse each edit), and $d(a, c) \\le d(a, b) + d(b, c)$ (concatenate the scripts). Also $|m - n| \\le d(a, b) \\le \\max(m, n)$. ALGORITHMA's property tests check these on thousands of random string triples.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Damerau–Levenshtein** also counts swapping two adjacent characters as one edit.",
          "**Needleman–Wunsch** generalises the costs (substitution matrices, gap penalties) for global sequence alignment in bioinformatics; **Smith–Waterman** finds the best local alignment.",
          "**LCS connection:** with insertions and deletions only (no substitutions), the distance is $m + n - 2\\,\\text{LCS}(a, b)$.",
          "**Lower bound:** under the Strong Exponential Time Hypothesis, edit distance cannot be computed in $O((mn)^{1-\\varepsilon})$ time (Backurs and Indyk, 2015), so the quadratic table is essentially optimal.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(mn)", average: "\\Theta(mn)", worst: "\\Theta(mn)" },
    space: "\\Theta(mn)",
    worstClass: "n^2",
    note: "$O(\\min(m, n))$ space suffices if only the distance is needed.",
  },
  properties: [
    { label: "Technique", value: "Bottom-up dynamic programming" },
    { label: "Operations", value: "Insert, delete, substitute (cost 1 each)" },
    { label: "Metric", value: "Yes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "edit_distance",
      code: `def edit_distance(a, b):
    """Levenshtein distance between strings a and b."""
    m, n = len(a), len(b)
    D = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        D[i][0] = i
    for j in range(n + 1):
        D[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            D[i][j] = min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + cost)
    return D[m][n]
`,
      tests: [
        { args: ["kitten", "sitting"], expected: 3 },
        { args: ["sunday", "saturday"], expected: 3 },
        { args: ["", "abc"], expected: 3 },
        { args: ["cat", "cart"], expected: 1 },
      ],
    },
    {
      language: "javascript",
      entry: "editDistance",
      code: `// Two-row version: O(n) memory, distance only.
function editDistance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
}
`,
      tests: [
        { args: ["kitten", "sitting"], expected: 3 },
        { args: ["algo", "algo"], expected: 0 },
        { args: ["abc", ""], expected: 3 },
      ],
    },
  ],
  visualizer: "edit-distance",
  practice: [
    {
      id: "edit-kitten",
      kind: "numeric",
      prompt: "What is the edit distance between “flaw” and “lawn”?",
      answer: 2,
      explanation:
        "Delete f, then insert n at the end: flaw → law → lawn. One edit cannot do it, because the strings differ in their first and last characters.",
      hints: ["Look for a long common part.", "How many characters must change at the ends?"],
      objective: "Compute a distance by hand",
    },
    {
      id: "edit-cell",
      kind: "mcq",
      prompt: "Which cells does $D[i][j]$ depend on?",
      options: [
        "$D[i-1][j]$, $D[i][j-1]$ and $D[i-1][j-1]$",
        "Only $D[i-1][j-1]$",
        "All cells in row $i-1$",
        "$D[i+1][j+1]$",
      ],
      answer: 0,
      explanation:
        "Above (delete), left (insert) and diagonal (keep or substitute). This is why a row-by-row fill order works.",
      distractors: {
        1: "The diagonal alone covers only keeps and substitutions.",
        2: "Only three neighbours are needed, not the whole row.",
        3: "Cells are filled from smaller prefixes to larger ones.",
      },
      hints: ["Which three operations can be the last edit?"],
      objective: "Understand the recurrence",
    },
    {
      id: "edit-space",
      kind: "mcq",
      prompt: "You only need the distance, not the edits. How much memory is enough?",
      options: ["$O(\\min(m, n))$", "$O(mn)$", "$O(1)$", "$O(m + n)^2$"],
      answer: 0,
      explanation:
        "Each row depends only on the previous row. Keep two rows of the shorter string's length.",
      distractors: {
        1: "That is needed only to recover the edit script by traceback.",
        2: "A whole row of values is still needed.",
        3: "That is more than the full table.",
      },
      hints: ["Which earlier rows does row $i$ read?"],
      objective: "Optimise space",
    },
  ],
  exam: {
    definition:
      "The edit (Levenshtein) distance between two strings is the minimum number of single-character insertions, deletions and substitutions needed to transform one into the other. It is computed by dynamic programming over all pairs of prefixes.",
    steps: [
      "Create a table $D$ of size $(m+1) \\times (n+1)$; set $D[i][0] = i$ and $D[0][j] = j$.",
      "For $i = 1..m$, $j = 1..n$: $D[i][j] = \\min(D[i-1][j]+1,\\; D[i][j-1]+1,\\; D[i-1][j-1] + [a_i \\ne b_j])$.",
      "Return $D[m][n]$; trace back through the table to recover the edits.",
    ],
    timeComplexity: "$\\Theta(mn)$.",
    spaceComplexity: "$\\Theta(mn)$ with traceback; $O(\\min(m, n))$ for the distance only.",
    correctness:
      "Optimal substructure: the last operation of an optimal script is a deletion, insertion or keep/substitute, and the rest is an optimal script for smaller prefixes.",
    applications: [
      "Spelling correction and fuzzy search",
      "DNA and protein sequence comparison",
      "Diff tools and plagiarism detection",
      "Speech recognition evaluation (word error rate)",
    ],
    limitations: [
      "Quadratic time and space for long strings",
      "Unit costs ignore that some edits (e.g. nearby keys) are more likely than others",
    ],
    faq: [
      {
        q: "Why dynamic programming and not recursion?",
        a: "The recursion revisits the same prefix pairs exponentially many times; the table computes each one once.",
      },
      { q: "What does ε mean in the table?", a: "The empty prefix (zero characters)." },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Minimum insert/delete/substitute operations to turn $a$ into $b$.",
          "DP table, $\\Theta(mn)$ time.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Recurrence with base cases (2).",
          "Small filled table (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and example — 1.",
          "Recurrence with justification of each case — 2.",
          "Fully filled table for a 4–6 letter example and traceback — 4.",
          "Time and space, two-row optimisation — 1.",
          "Applications and variants (Damerau, alignment) — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "V. I. Levenshtein, “Binary codes capable of correcting deletions, insertions, and reversals,” Soviet Physics Doklady, 10(8), 1966.",
      supports: "Definition of the distance.",
    },
    {
      citation:
        "R. A. Wagner, M. J. Fischer, “The string-to-string correction problem,” Journal of the ACM, 21(1), 1974.",
      supports: "The dynamic-programming algorithm and traceback.",
    },
    {
      citation:
        "A. Backurs, P. Indyk, “Edit Distance Cannot Be Computed in Strongly Subquadratic Time (unless SETH is false),” Proc. STOC 2015.",
      supports: "Conditional lower bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
