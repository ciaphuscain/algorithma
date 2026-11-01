import type { AlgorithmEntry } from "../types";

export const longestRepeatedSubstringEntry: AlgorithmEntry = {
  slug: "longest-repeated-substring",
  name: "Longest Repeated Substring",
  aliases: ["LRS"],
  curriculum: [343],
  domain: "strings",
  subcategory: "Suffix Array Applications",
  difficulty: "intermediate",
  summary:
    "Finds the longest substring that appears at least twice using the suffix array and LCP array.",
  tags: ["suffix array", "LCP", "repeated substring"],
  prerequisites: ["kasai-algorithm-lcp-array"],
  related: ["longest-common-substring-suffix-array-method"],
  problem: {
    input: "A string S.",
    output: "The longest substring occurring at least twice in S.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The longest repeated substring corresponds to the maximum value in the LCP array, which measures the longest common prefix between consecutive suffixes in sorted order.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build suffix array of S.",
          "Compute LCP array using Kasai's algorithm.",
          "Find the maximum value in the LCP array.",
          "The corresponding prefix of that suffix is the answer.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Simply scan the LCP array for its maximum and extract the substring.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ with linear SA construction and Kasai's algorithm.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "For the k-th longest repeated substring or repeated substrings with at least k occurrences, combine LCP with stack-based range queries.",
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
      entry: "longest_repeated_substring",
      code: `def longest_repeated_substring(s: str) -> str:
    n = len(s)
    if n == 0:
        return ""
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
    max_lcp = max(lcp) if lcp else 0
    if max_lcp == 0:
        return ""
    idx = lcp.index(max_lcp)
    return s[sa[idx]:sa[idx] + max_lcp]
`,
      tests: [
        {
          args: ["banana"],
          expected: "ana",
        },
        {
          args: ["abcd"],
          expected: "",
        },
      ],
    },
    {
      language: "javascript",
      entry: "longestRepeatedSubstring",
      code: `function longestRepeatedSubstring(s) {
  const n = s.length;
  if (n === 0) return "";
  const sa = [...Array(n).keys()].sort((a, b) => s.substring(a) < s.substring(b) ? -1 : 1);
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
  let maxLcp = 0, idx = 0;
  for (let i = 0; i < n; i++) if (lcp[i] > maxLcp) { maxLcp = lcp[i]; idx = i; }
  return maxLcp === 0 ? "" : s.substring(sa[idx], sa[idx] + maxLcp);
}
`,
      tests: [
        {
          args: ["banana"],
          expected: "ana",
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lrs-q1",
      kind: "mcq",
      prompt: "LRS is found by taking the maximum of which array?",
      options: ["LCP array", "Suffix array", "Z-array", "Rank array"],
      answer: 0,
      explanation:
        "The LCP array stores lengths of common prefixes between adjacent sorted suffixes.",
      hints: ["Adjacent suffixes."],
      objective: "Array",
    },
  ],
  exam: {
    definition: "The longest substring occurring at least twice, found via max(LCP).",
    steps: ["Build SA.", "Compute LCP via Kasai.", "max(LCP) gives the length."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Any repeated substring appears as a common prefix of two suffixes.",
    applications: ["Data compression", "DNA analysis"],
    limitations: ["Need SA+LCP infrastructure"],
    faq: [
      {
        q: "What if we want at least k repeats?",
        a: "Slide a window of size k over the LCP array and find the max of window minimums.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["SA+LCP (1).", "Max LCP (1).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. Kasai et al., 'Linear-Time Longest-Common-Prefix Computation in Suffix Arrays', CPM, 2001.",
      supports: "LCP applications.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
