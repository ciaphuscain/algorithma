import type { AlgorithmEntry } from "../types";

export const sequenceAlignmentNeedlemanWunschEntry: AlgorithmEntry = {
  slug: "sequence-alignment-needleman-wunsch",
  name: "Sequence Alignment (Needleman-Wunsch)",
  aliases: ["Global Alignment", "Needleman-Wunsch"],
  curriculum: [278],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Global sequence alignment using DP. Assigns scores for matches, mismatches, and gaps, finding the alignment that maximizes total score.",
  tags: ["sequence alignment", "bioinformatics", "dynamic programming"],
  prerequisites: ["edit-distance-levenshtein"],
  related: ["damerau-levenshtein-distance", "longest-common-substring"],
  problem: {
    input: "Two sequences and scoring parameters (match, mismatch, gap penalty).",
    output: "Maximum alignment score.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Align two sequences end-to-end, inserting gaps where needed. Score each column (match/mismatch/gap) and maximize the total.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[i][j] = max(dp[i-1][j-1] + score(a[i],b[j]), dp[i-1][j] + gap, dp[i][j-1] + gap).",
          "dp[0][j] = j*gap, dp[i][0] = i*gap.",
          "Return dp[m][n].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Traceback from dp[m][n] reconstructs the optimal alignment.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(mn)$, space $O(mn)$ (or $O(n)$ without traceback).",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Hirschberg's algorithm reduces space to O(n) while still recovering the alignment using divide-and-conquer.",
      },
    ],
  },
  complexity: {
    time: { best: "O(m·n)", average: "O(m·n)", worst: "O(m·n)" },
    space: "O(m·n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "needlemanWunsch",
      code: `def needlemanWunsch(a, b, match=1, mismatch=-1, gap=-1):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i * gap
    for j in range(n + 1):
        dp[0][j] = j * gap
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            s = match if a[i-1] == b[j-1] else mismatch
            dp[i][j] = max(dp[i-1][j-1] + s, dp[i-1][j] + gap, dp[i][j-1] + gap)
    return dp[m][n]`,
      tests: [
        {
          args: ["GATTACA", "GCATGCU"],
          expected: 0,
        },
        {
          args: ["ABC", "ABC"],
          expected: 3,
        },
      ],
    },
    {
      language: "javascript",
      entry: "needlemanWunsch",
      code: `function needlemanWunsch(a, b, match = 1, mismatch = -1, gap = -1) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i * gap;
  for (let j = 0; j <= n; j++) dp[0][j] = j * gap;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const s = a[i-1] === b[j-1] ? match : mismatch;
      dp[i][j] = Math.max(dp[i-1][j-1] + s, dp[i-1][j] + gap, dp[i][j-1] + gap);
    }
  }
  return dp[m][n];
}`,
      tests: [
        {
          args: ["GATTACA", "GCATGCU"],
          expected: 0,
        },
        {
          args: ["ABC", "ABC"],
          expected: 3,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "nw-q1",
      kind: "mcq",
      prompt: "Needleman-Wunsch is for which type of alignment?",
      options: ["Global", "Local", "Semi-global", "Multiple"],
      answer: 0,
      explanation: "NW aligns entire sequences end-to-end (global).",
      hints: ["Local alignment is Smith-Waterman."],
      objective: "Concept",
    },
  ],
  exam: {
    definition: "Optimal global alignment of two sequences.",
    steps: [
      "Init borders with gap penalties.",
      "Fill dp with match/mismatch/gap.",
      "Traceback for alignment.",
    ],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(mn)$.",
    correctness: "Optimal substructure: best alignment extends best sub-alignment.",
    applications: ["bioinformatics", "plagiarism detection"],
    limitations: ["quadratic for long sequences"],
    faq: [
      {
        q: "NW vs Smith-Waterman?",
        a: "NW is global (full sequences); SW is local (best subsequences).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Scoring scheme (1).", "Recurrence (2).", "Traceback (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "S. B. Needleman and C. D. Wunsch, A general method applicable to the search for similarities, 1970.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
