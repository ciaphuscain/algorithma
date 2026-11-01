import type { AlgorithmEntry } from "../types";

export const fmIndexFullTextSearchEntry: AlgorithmEntry = {
  slug: "fm-index-full-text-search",
  name: "FM-Index",
  aliases: ["FM Index", "Full-text Minute-space Index"],
  curriculum: [350],
  domain: "strings",
  subcategory: "Compressed Index",
  difficulty: "intermediate",
  summary:
    "A compressed full-text index based on the Burrows-Wheeler Transform that supports O(m) pattern counting and O(m + occ) locate queries.",
  tags: ["BWT", "compressed index", "rank query", "full-text search"],
  prerequisites: ["burrows-wheeler-transform-bwt", "suffix-array-sa-is-linear-algorithm"],
  related: ["lz77"],
  problem: {
    input: "A text T (preprocessed into FM-index) and a pattern P.",
    output: "Count or positions of P in T.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The BWT of the text groups similar contexts. By counting character ranks in the BWT column, we can narrow the suffix array range matching a pattern, character by character from right to left.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build the BWT and suffix array of T.",
          "Precompute C[c] = number of characters < c, and Occ(c,i) = rank of c in BWT[0..i].",
          "To count pattern P: maintain range [lo, hi) in the suffix array.",
          "For each character P[i] from right to left: lo = C[c] + Occ(c, lo-1), hi = C[c] + Occ(c, hi-1).",
          "Final range size = number of occurrences.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The key operation is rank queries on the BWT column, which can be done in O(1) with wavelet trees or sampled tables.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Counting takes $O(m)$ backward steps. Each step is O(1) with rank data structures. Space is $O(n \\cdot H_k)$ bits where $H_k$ is the k-th order entropy.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The FM-index achieves self-indexing: the text can be reconstructed from the index, so no separate storage needed. Combined with sampling, locate queries are $O(m + \\text{occ} \\cdot \\log^\\epsilon n)$.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(m)$",
    average: "$O(m)$",
    worst: "$O(m + \\text{occ})$",
    space: "$O(n)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "fm_index",
      code: `def build_fm_index(text: str):
    text = text + "$"
    n = len(text)
    suffixes = sorted(range(n), key=lambda i: text[i:])
    bwt = "".join(text[(s - 1) % n] for s in suffixes)
    chars = sorted(set(text))
    c_table = {}
    count = 0
    for ch in chars:
        c_table[ch] = count
        count += bwt.count(ch)
    occ = {ch: [0] * (n + 1) for ch in chars}
    for i in range(n):
        for ch in chars:
            occ[ch][i + 1] = occ[ch][i] + (1 if bwt[i] == ch else 0)
    return {"bwt": bwt, "sa": suffixes, "c": c_table, "occ": occ}

def fm_count(index, pattern: str) -> int:
    lo, hi = 0, len(index["bwt"])
    for c in reversed(pattern):
        if c not in index["c"]:
            return 0
        lo = index["c"][c] + index["occ"][c][lo]
        hi = index["c"][c] + index["occ"][c][hi]
        if lo >= hi:
            return 0
    return hi - lo
`,
      tests: [
        {
          args: ["banana", "ana"],
          expected: 2,
        },
        {
          args: ["banana", "xyz"],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "fm-q1",
      kind: "mcq",
      prompt: "FM-index backward search processes the pattern in which direction?",
      options: ["Right to left", "Left to right", "Middle outward", "Random order"],
      answer: 0,
      explanation: "Each step reads one character from right to left, narrowing the SA range.",
      hints: ["Backward."],
      objective: "Direction",
    },
  ],
  exam: {
    definition: "A compressed full-text index using BWT and rank/select queries.",
    steps: [
      "Build BWT and SA.",
      "Precompute C and Occ tables.",
      "Backward search: narrow [lo,hi) per character.",
    ],
    timeComplexity: "$O(m)$ to count, $O(m+occ)$ to locate.",
    spaceComplexity: "$O(n H_k)$ bits compressed.",
    correctness: "LF-mapping preserves suffix array order.",
    applications: ["Bioinformatics read alignment", "compressed text search"],
    limitations: ["Locate queries need sampled SA positions"],
    faq: [
      {
        q: "Why is it called 'Full-text Minute-space'?",
        a: "It compresses the index to entropy-bounded space while supporting full-text queries.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["BWT construction (1).", "Backward search (2).", "Compression properties (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "P. Ferragina and G. Manzini, 'Opportunistic data structures with applications', FOCS, 2000.",
      supports: "Original FM-index paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
