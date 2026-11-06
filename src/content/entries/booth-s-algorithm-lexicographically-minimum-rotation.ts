import type { AlgorithmEntry } from "../types";

export const boothSAlgorithmLexicographicallyMinimumRotationEntry: AlgorithmEntry = {
  slug: "booth-s-algorithm-lexicographically-minimum-rotation",
  name: "Booth's Algorithm",
  aliases: ["Lexicographically Minimum Rotation"],
  curriculum: [341],
  domain: "strings",
  subcategory: "String Rotation",
  difficulty: "intermediate",
  summary:
    "Finds the lexicographically smallest rotation of a string in O(n) time using a modified failure function.",
  tags: ["rotation", "lexicographic", "failure function"],
  prerequisites: ["failure-function"],
  related: ["lyndon-factorization-duval-s-algorithm"],
  problem: {
    input: "A string S.",
    output: "The starting index of the lexicographically smallest rotation of S.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Concatenate the string with itself to make all rotations substrings. Use a modified failure function to track the best rotation seen so far.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set f = [-1]*2n, k=0.",
          "For j=1..2n-1:",
          "  Let i = f[j-1-k].",
          "  While i != -1 and s[j%n] != s[(k+i+1)%n]:",
          "    If s[j%n] < s[(k+i+1)%n], k = j-i-1.",
          "    i = f[i].",
          "  If i==-1 and s[j%n] != s[(k+i+1)%n]:",
          "    If s[j%n] < s[(k+i+1)%n], k = j.",
          "    f[j-k] = -1.",
          "  Else: f[j-k] = i+1.",
          "Return k.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Conceptually similar to KMP's failure function but updates the candidate rotation index when a smaller character is found.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ time since each comparison either advances j or reduces i, similar to KMP analysis.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Booth's algorithm is useful for canonical forms: two strings are rotations of each other if and only if their Booth-normalized forms are identical.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "least_rotation",
      code: `def least_rotation(s: str) -> int:
    s2 = s + s
    n = len(s)
    f = [-1] * (2 * n)
    k = 0
    for j in range(1, 2 * n):
        sj = s2[j]
        i = f[j - 1 - k]
        while i != -1 and sj != s2[k + i + 1]:
            if sj < s2[k + i + 1]:
                k = j - i - 1
            i = f[i]
        if i == -1 and sj != s2[k + i + 1]:
            if sj < s2[k + i + 1]:
                k = j
            f[j - k] = -1
        else:
            f[j - k] = i + 1
    return k
`,
      tests: [
        {
          args: ["bca"],
          expected: 2,
        },
        {
          args: ["cba"],
          expected: 2,
        },
        {
          args: ["aab"],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "leastRotation",
      code: `function leastRotation(s) {
  const s2 = s + s, n = s.length;
  const f = new Array(2 * n).fill(-1);
  let k = 0;
  for (let j = 1; j < 2 * n; j++) {
    let i = f[j - 1 - k];
    while (i !== -1 && s2[j] !== s2[k + i + 1]) {
      if (s2[j] < s2[k + i + 1]) k = j - i - 1;
      i = f[i];
    }
    if (i === -1 && s2[j] !== s2[k + i + 1]) {
      if (s2[j] < s2[k + i + 1]) k = j;
      f[j - k] = -1;
    } else f[j - k] = i + 1;
  }
  return k;
}
`,
      tests: [
        {
          args: ["bca"],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "booth-q1",
      kind: "mcq",
      prompt: "Booth's algorithm is based on which technique?",
      options: ["Modified failure function", "Suffix array", "Hashing", "Dynamic programming"],
      answer: 0,
      explanation: "It modifies the KMP failure function to track the smallest rotation.",
      hints: ["Think KMP."],
      objective: "Basis",
    },
  ],
  exam: {
    definition: "Finds the starting index of the lexicographically smallest rotation in O(n).",
    steps: ["Concatenate s+s.", "Run modified failure function tracking candidate k."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The failure function ensures all rotations are compared.",
    applications: ["Canonical string forms", "necklace problems"],
    limitations: ["Requires O(n) extra space for failure array"],
    faq: [
      {
        q: "How to check if two strings are rotations?",
        a: "Compare their Booth-normalized forms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm (2).", "Complexity proof (1).", "Application (1)."],
      },
    ],
  },
  references: [
    {
      citation: "K. S. Booth, 'Lexicographically least circular substrings', IPL, 1980.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
