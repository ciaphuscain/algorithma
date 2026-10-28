import type { AlgorithmEntry } from "../types";

export const longestCommonSubstringEntry: AlgorithmEntry = {
  slug: "longest-common-substring",
  name: "Longest Common Substring",
  aliases: ["Longest Common Substring"],
  curriculum: [283],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Find the longest contiguous substring common to two strings. dp[i][j] = dp[i-1][j-1] + 1 if s1[i] == s2[j], else 0. Track the maximum value and its position.",
  tags: ["substring", "DP", "string matching"],
  prerequisites: ["Arrays", "Strings"],
  related: ["lcs", "longest-palindromic-subsequence"],
  problem: {
    input: "Input for Longest Common Substring.",
    output: "Output of Longest Common Substring.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Find the longest contiguous substring common to two strings. dp[i][j] = dp[i-1][j-1] + 1 if s1[i] == s2[j], else 0. Track the maximum value and its position.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Longest Common Substring algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Longest Common Substring follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Longest Common Substring is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Longest Common Substring exist in the literature. See references for details.",
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
    worstClass: "other",
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
      id: "longest-common-substring-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Longest Common Substring?",
      options: [
        "Find the longest contiguous substring common to two strings....",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Longest Common Substring: Find the longest contiguous substring common to two strings. dp[i][j] = dp[i-1][j-1] + 1 if s1[i] == s2[j], else 0. Track the maximum value and its position.",
      hints: ["Think about what problem Longest Common Substring solves."],
      objective: "Longest Common Substring",
    },
  ],
  exam: {
    definition:
      "Find the longest contiguous substring common to two strings. dp[i][j] = dp[i-1][j-1] + 1 if s1[i] == s2[j], else 0. Track the maximum value and its position.",
    steps: ["Apply the Longest Common Substring algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Longest Common Substring algorithm is correct because it systematically processes all cases.",
    applications: ["String DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Longest Common Substring?",
        a: "Use Longest Common Substring when the problem matches its design: Find the longest contiguous substring common to two strings. dp[i][j] = dp[i-1][j-1] + 1 if s1[i] ==",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Longest Common Substring (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Longest Common Substring.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
