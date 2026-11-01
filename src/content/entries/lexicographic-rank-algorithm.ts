import type { AlgorithmEntry } from "../types";

export const lexicographicRankAlgorithmEntry: AlgorithmEntry = {
  slug: "lexicographic-rank-algorithm",
  name: "Lexicographic Rank Algorithm",
  aliases: ["Permutation Rank"],
  curriculum: [346],
  domain: "strings",
  subcategory: "Combinatorics",
  difficulty: "intermediate",
  summary:
    "Computes the rank (position) of a string among all its sorted permutations using factorial number system.",
  tags: ["permutation", "rank", "factorial", "combinatorics"],
  prerequisites: [],
  related: [],
  problem: {
    input: "A string S.",
    output: "The 1-based rank of S among all sorted permutations of its characters.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "For each position, count how many unused characters are smaller than the current one. Multiply by the number of permutations of the remaining characters.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For i=0..n-1:",
          "  Count characters in remaining pool smaller than S[i].",
          "  rank += count * (n-i-1)! / product of remaining duplicate factorials.",
          "Return rank + 1.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Handle duplicates by dividing by the factorial of each character's remaining count.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With distinct characters: $\\text{rank} = \\sum_{i} c_i \\cdot (n-i-1)!$ where $c_i$ is the count of smaller remaining characters.",
      },
    ],
    deeper: [
      {
        kind: "p",
        text: "This is essentially converting to the factorial number system. The inverse operation reconstructs the permutation from its rank.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n^2)$",
    average: "$O(n^2)$",
    worst: "$O(n^2)$",
    space: "$O(n)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "lexicographic_rank",
      code: `from math import factorial
from collections import Counter

def lex_rank(s: str) -> int:
    n = len(s)
    rank = 0
    freq = Counter(s)
    for i in range(n):
        smaller = sum(v for k, v in freq.items() if k < s[i])
        perms = factorial(n - i - 1)
        for v in freq.values():
            perms //= factorial(v)
        rank += smaller * perms
        freq[s[i]] -= 1
        if freq[s[i]] == 0:
            del freq[s[i]]
    return rank + 1
`,
      tests: [
        {
          args: ["abc"],
          expected: 1,
        },
        {
          args: ["bac"],
          expected: 3,
        },
        {
          args: ["cba"],
          expected: 6,
        },
      ],
    },
    {
      language: "javascript",
      entry: "lexicographicRank",
      code: `function factorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
function lexRank(s) {
  const n = s.length, freq = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;
  let rank = 0;
  for (let i = 0; i < n; i++) {
    let smaller = 0;
    for (const k in freq) if (k < s[i]) smaller += freq[k];
    let perms = factorial(n - i - 1);
    for (const v of Object.values(freq)) perms /= factorial(v);
    rank += smaller * perms;
    freq[s[i]]--;
    if (freq[s[i]] === 0) delete freq[s[i]];
  }
  return rank + 1;
}
`,
      tests: [
        {
          args: ["abc"],
          expected: 1,
        },
        {
          args: ["cba"],
          expected: 6,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lr-q1",
      kind: "mcq",
      prompt: "What is the rank of 'bca' among permutations of {a,b,c}?",
      options: ["4", "3", "5", "2"],
      answer: 0,
      explanation: "abc=1, acb=2, bac=3, bca=4.",
      hints: ["List them."],
      objective: "Rank",
    },
  ],
  exam: {
    definition: "Computes the 1-based rank of a permutation among all sorted permutations.",
    steps: ["For each position: count smaller characters, multiply by remaining permutations."],
    timeComplexity: "$O(n^2)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Factorial number system bijection.",
    applications: ["Combinatorial enumeration", "hashing permutations"],
    limitations: ["Factorial overflow for long strings without big integers"],
    faq: [
      {
        q: "How to handle duplicates?",
        a: "Divide by factorial of each character's frequency.",
      },
    ],
    answers: [
      {
        marks: 3,
        outline: ["Formula (1).", "Duplicate handling (1).", "Example (1)."],
      },
    ],
  },
  references: [
    {
      citation: "D. Knuth, TAOCP Volume 4A, Section 7.2.1.2.",
      supports: "Permutation ranking.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
