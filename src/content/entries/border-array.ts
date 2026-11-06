import type { AlgorithmEntry } from "../types";

export const borderArrayEntry: AlgorithmEntry = {
  slug: "border-array",
  name: "Border Array",
  aliases: ["Border Array"],
  curriculum: [310],
  domain: "strings",
  subcategory: "String Analysis",
  difficulty: "intermediate",
  summary:
    "The border array is identical to the KMP failure/prefix function: for each position, it gives the length of the longest proper prefix that equals a suffix.",
  tags: ["border", "prefix function", "KMP", "string"],
  prerequisites: ["Failure Function"],
  related: ["failure-function", "kmp"],
  problem: {
    input: "A string s.",
    output: "Border array B where B[i] = length of longest border of s[0..i].",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A 'border' of a string is a proper prefix that is also a suffix. The border array records the longest border for each prefix of the string. This is the same as the KMP prefix/failure function.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set B[0] = 0.",
          "For each position i > 0, find the longest border by extending the previous border or falling back.",
          "The algorithm is identical to the failure function computation.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Same algorithm as the failure function. The terminology 'border' is common in European literature; 'failure function' or 'prefix function' in American literature.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ time and $O(n)$ space. The amortized analysis is the same as the failure function.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "All borders of a position can be enumerated by following the chain: i, B[i], B[B[i]], ...",
          "The shortest period of s[0..i] is (i+1) - B[i].",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Same as",
      value: "KMP failure/prefix function",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "border_array",
      code: `def border_array(s):
    n = len(s)
    b = [0] * n
    k = 0
    for i in range(1, n):
        while k > 0 and s[k] != s[i]:
            k = b[k - 1]
        if s[k] == s[i]:
            k += 1
        b[i] = k
    return b
`,
      tests: [
        {
          args: ["abacabab"],
          expected: [0, 0, 1, 0, 1, 2, 3, 2],
        },
        {
          args: ["aaa"],
          expected: [0, 1, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "borderArray",
      code: `function borderArray(s) {
  const n = s.length, b = new Array(n).fill(0);
  let k = 0;
  for (let i = 1; i < n; i++) {
    while (k > 0 && s[k] !== s[i]) k = b[k - 1];
    if (s[k] === s[i]) k++;
    b[i] = k;
  }
  return b;
}
`,
      tests: [
        {
          args: ["abacabab"],
          expected: [0, 0, 1, 0, 1, 2, 3, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "border-array-q1",
      kind: "mcq",
      prompt: "What is a 'border' of a string?",
      options: [
        "A proper prefix that is also a suffix",
        "The first character",
        "The longest substring",
        "A repeated character",
      ],
      answer: 0,
      explanation: "A border is both a proper prefix and a suffix of the string.",
      hints: ["Think prefix AND suffix."],
      objective: "Definition",
    },
  ],
  exam: {
    definition:
      "The border array gives the longest proper-prefix-equals-suffix length for each prefix.",
    steps: ["Compute like KMP failure function."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Same as failure function.",
    applications: ["KMP", "string periods", "pattern counting"],
    limitations: ["Same as failure function"],
    faq: [
      {
        q: "Is it different from the failure function?",
        a: "No, they are the same computation with different names.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define border (1).", "Algorithm (2).", "Applications (2)."],
      },
    ],
  },
  references: [
    {
      citation: "M. Crochemore and W. Rytter, Jewels of Stringology, World Scientific, 2002.",
      supports: "Border array theory.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
