import type { AlgorithmEntry } from "../types";

export const kasaiAlgorithmLcpArrayEntry: AlgorithmEntry = {
  slug: "kasai-algorithm-lcp-array",
  name: "Kasai's Algorithm (LCP Array)",
  aliases: ["LCP Array Construction"],
  curriculum: [316],
  domain: "strings",
  subcategory: "Suffix Array",
  difficulty: "intermediate",
  summary:
    "Computes the Longest Common Prefix array from a suffix array in O(n) time using the property that LCP values decrease by at most 1 when traversed in text order.",
  tags: ["suffix array", "LCP", "longest common prefix"],
  prerequisites: ["suffix-array-sa-is-linear-algorithm"],
  related: ["longest-repeated-substring"],
  problem: {
    input: "A string S and its suffix array SA.",
    output: "LCP array where LCP[i] = length of longest common prefix between SA[i] and SA[i-1].",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If suffix at position i has LCP k with its SA neighbor, then suffix at i+1 has LCP at least k-1. Process suffixes in text order to exploit this.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute rank array (inverse SA).",
          "Initialize k=0.",
          "For i=0..n-1:",
          "  Let j = SA[rank[i]-1].",
          "  While S[i+k] == S[j+k]: k++.",
          "  LCP[rank[i]] = k.",
          "  If k>0: k--.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The key insight: processing in text order (i=0,1,...) rather than SA order guarantees k decreases by at most 1 per step.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$: k increases at most n times total (bounded by string length) and decreases by at most 1 per iteration.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The LCP array enables O(1) LCP queries between any two suffixes using range minimum queries, which powers many suffix-array-based algorithms.",
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
      entry: "kasai",
      code: `def kasai(s: str, sa: list[int]) -> list[int]:
    n = len(s)
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
    return lcp
`,
      tests: [
        {
          args: ["banana", [5, 3, 1, 0, 4, 2]],
          expected: [0, 1, 3, 0, 0, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "kasai",
      code: `function kasai(s, sa) {
  const n = s.length, rank = new Array(n), lcp = new Array(n).fill(0);
  for (let i = 0; i < n; i++) rank[sa[i]] = i;
  let k = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] === 0) { k = 0; continue; }
    const j = sa[rank[i] - 1];
    while (i + k < n && j + k < n && s[i + k] === s[j + k]) k++;
    lcp[rank[i]] = k;
    if (k > 0) k--;
  }
  return lcp;
}
`,
      tests: [
        {
          args: ["banana", [5, 3, 1, 0, 4, 2]],
          expected: [0, 1, 3, 0, 0, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "kasai-q1",
      kind: "mcq",
      prompt: "Why is Kasai's algorithm O(n)?",
      options: [
        "k decreases by at most 1 per step and increases at most n total",
        "It uses hashing",
        "It sorts first",
        "It uses divide and conquer",
      ],
      answer: 0,
      explanation: "The variable k is bounded by n in total increases.",
      hints: ["Amortized analysis."],
      objective: "Complexity",
    },
  ],
  exam: {
    definition: "Computes the LCP array from a suffix array in O(n) time.",
    steps: [
      "Compute rank (inverse SA).",
      "Process in text order.",
      "k decreases by at most 1 per step.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "LCP[rank[i]] >= LCP[rank[i-1]] - 1 by the Kasai lemma.",
    applications: ["Longest repeated substring", "number of distinct substrings"],
    limitations: ["Requires suffix array already built"],
    faq: [
      {
        q: "Can LCP be built during SA construction?",
        a: "Some SA construction algorithms (SA-IS) can compute LCP simultaneously.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm (2).", "Amortized proof (1).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. Kasai et al., 'Linear-Time Longest-Common-Prefix Computation in Suffix Arrays', CPM, 2001.",
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
