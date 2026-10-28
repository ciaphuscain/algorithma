import type { AlgorithmEntry } from "../types";

export const longestPalindromicSubsequenceEntry: AlgorithmEntry = {
  slug: "longest-palindromic-subsequence",
  name: "Longest Palindromic Subsequence",
  aliases: ["Longest Palindromic Subsequence"],
  curriculum: [284],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Find the length of the longest palindromic subsequence. Equivalent to LCS of the string with its reverse. dp[i][j] represents the longest palindromic subsequence of s[i..j].",
  tags: ["palindrome", "DP", "subsequence"],
  prerequisites: ["Longest Common Subsequence"],
  related: ["lcs", "longest-common-substring"],
  problem: {
    input: "Input for Longest Palindromic Subsequence.",
    output: "Output of Longest Palindromic Subsequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Find the length of the longest palindromic subsequence. Equivalent to LCS of the string with its reverse. dp[i][j] represents the longest palindromic subsequence of s[i..j].",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Longest Palindromic Subsequence algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Longest Palindromic Subsequence follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Longest Palindromic Subsequence is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Longest Palindromic Subsequence exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Category",
      value: "String DP",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "longest-palindromic-subsequence-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Longest Palindromic Subsequence?",
      options: [
        "Find the length of the longest palindromic subsequence. Equi...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Longest Palindromic Subsequence: Find the length of the longest palindromic subsequence. Equivalent to LCS of the string with its reverse. dp[i][j] represents the longest palindromic subsequence of s[i..j].",
      hints: ["Think about what problem Longest Palindromic Subsequence solves."],
      objective: "Longest Palindromic Subsequence",
    },
  ],
  exam: {
    definition:
      "Find the length of the longest palindromic subsequence. Equivalent to LCS of the string with its reverse. dp[i][j] represents the longest palindromic subsequence of s[i..j].",
    steps: ["Apply the Longest Palindromic Subsequence algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Longest Palindromic Subsequence algorithm is correct because it systematically processes all cases.",
    applications: ["String DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Longest Palindromic Subsequence?",
        a: "Use Longest Palindromic Subsequence when the problem matches its design: Find the length of the longest palindromic subsequence. Equivalent to LCS of the string with its rev",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Longest Palindromic Subsequence (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Longest Palindromic Subsequence.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
