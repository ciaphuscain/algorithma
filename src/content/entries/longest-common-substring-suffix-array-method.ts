import type { AlgorithmEntry } from "../types";

export const longestCommonSubstringSuffixArrayMethodEntry: AlgorithmEntry = {
  slug: "longest-common-substring-suffix-array-method",
  name: "Longest Common Substring (Suffix Array)",
  aliases: ["LCS via SA+LCP"],
  curriculum: [344],
  domain: "strings",
  subcategory: "Suffix Array Applications",
  difficulty: "intermediate",
  summary:
    "Finds the longest common substring of two strings by building a combined suffix array with LCP array and finding the maximum LCP between suffixes from different strings.",
  tags: ["suffix array", "LCP", "longest common substring"],
  prerequisites: ["kasai-algorithm-lcp-array"],
  related: ["longest-repeated-substring"],
  problem: {
    input: "Two strings A and B.",
    output: "The longest substring common to both.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Concatenate A + '#' + B, build suffix array and LCP array. The answer is the largest LCP value between adjacent suffixes that come from different original strings.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Concatenate: S = A + '#' + B + '$'.",
          "Build suffix array and LCP array of S.",
          "Scan LCP array: find max LCP[i] where SA[i] and SA[i-1] come from different strings.",
          "Use position relative to '#' to determine which string a suffix belongs to.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A suffix starting at position < |A| is from A; one starting at position > |A| is from B.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ with linear SA and Kasai's LCP, where n = |A| + |B| + 2.",
      },
    ],
    deeper: [
      {
        kind: "p",
        text: "For k strings, use a generalized suffix array and sweep with a sliding window minimum over LCP values, requiring suffixes from all k strings in the window.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n)$",
    average: "$O(n)$",
    worst: "$O(n)$",
    space: "$O(n)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "lcs_suffix_array",
      code: `def lcs_suffix_array(a: str, b: str) -> str:
    s = a + "#" + b + "$"
    n = len(s)
    sa = sorted(range(n), key=lambda i: s[i:])
    rank = [0] * n
    for i in range(n):
        rank[sa[i]] = i
    lcp = [0] * n
    k = 0
    for i in range(n):
        if rank[i] == 0:
            k = 0
            continue
        j = sa[rank[i] - 1]
        while i + k < n and j + k < n and s[i + k] == s[j + k]:
            k += 1
        lcp[rank[i]] = k
        if k > 0:
            k -= 1
    best_len, best_pos = 0, 0
    sep = len(a)
    for i in range(1, n):
        p1, p2 = sa[i - 1], sa[i]
        from_a1 = p1 < sep
        from_a2 = p2 < sep
        if from_a1 != from_a2 and lcp[i] > best_len:
            best_len = lcp[i]
            best_pos = sa[i]
    return s[best_pos:best_pos + best_len]
`,
      tests: [
        {
          args: ["abcde", "cdefg"],
          expected: "cde",
        },
        {
          args: ["abc", "xyz"],
          expected: "",
        },
      ],
    },
    {
      language: "javascript",
      entry: "lcsSuffixArray",
      code: `function lcsSuffixArray(a, b) {
  const s = a + "#" + b + "$", n = s.length;
  const sa = [...Array(n).keys()].sort((x, y) => s.substring(x) < s.substring(y) ? -1 : 1);
  const rank = new Array(n);
  for (let i = 0; i < n; i++) rank[sa[i]] = i;
  const lcp = new Array(n).fill(0);
  let k = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] === 0) { k = 0; continue; }
    const j = sa[rank[i] - 1];
    while (i + k < n && j + k < n && s[i + k] === s[j + k]) k++;
    lcp[rank[i]] = k;
    if (k > 0) k--;
  }
  let bestLen = 0, bestPos = 0;
  for (let i = 1; i < n; i++) {
    const a1 = sa[i - 1] < a.length, a2 = sa[i] < a.length;
    if (a1 !== a2 && lcp[i] > bestLen) { bestLen = lcp[i]; bestPos = sa[i]; }
  }
  return s.substring(bestPos, bestPos + bestLen);
}
`,
      tests: [
        {
          args: ["abcde", "cdefg"],
          expected: "cde",
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lcssa-q1",
      kind: "mcq",
      prompt: "What separator is used between the two strings?",
      options: [
        "A character not in either string",
        "No separator needed",
        "The null character",
        "A space",
      ],
      answer: 0,
      explanation: "Using a unique separator prevents false LCP matches across the boundary.",
      hints: ["Sentinel."],
      objective: "Separator",
    },
  ],
  exam: {
    definition: "LCS via concatenated suffix array and LCP scanning.",
    steps: [
      "Concatenate with separator.",
      "Build SA and LCP.",
      "Find max LCP across string boundary.",
    ],
    timeComplexity: "$O(n)$ with linear SA.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "LCP between adjacent SA entries from different strings captures all common substrings.",
    applications: ["Plagiarism detection", "DNA comparison"],
    limitations: ["Requires linear SA construction for O(n) total"],
    faq: [
      {
        q: "Why not use DP?",
        a: "DP is O(nm) in time and space; SA+LCP is O(n+m).",
      },
    ],
    answers: [
      {
        marks: 4,
        outline: [
          "Concatenation (1).",
          "SA+LCP construction (1).",
          "Scanning (1).",
          "Complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "D. Gusfield, 'Algorithms on Strings, Trees, and Sequences', 1997.",
      supports: "Suffix array applications.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
