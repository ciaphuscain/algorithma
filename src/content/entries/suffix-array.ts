import type { AlgorithmEntry } from "../types";

export const suffixArrayEntry: AlgorithmEntry = {
  slug: "suffix-array",
  name: "Suffix Array (Prefix Doubling)",
  aliases: ["Suffix array", "Manber–Myers", "Prefix doubling", "SA"],
  curriculum: [314],
  domain: "strings",
  subcategory: "Suffix structures",
  difficulty: "advanced",
  summary:
    "Sorts all suffixes of a string. Prefix doubling ranks the suffixes by their first letter, then by their first 2, 4, 8, … letters, each round sorting pairs of ranks from the round before, so at most ⌈log₂ n⌉ rounds are needed.",
  tags: ["suffix array", "sorting", "doubling", "lcp", "string indexing"],
  prerequisites: ["Merge Sort", "Radix sort", "Strings"],
  related: ["suffix-tree", "suffix-automaton", "kmp"],
  problem: {
    input: "A string s of length n.",
    output: "SA: the start positions of the suffixes of s, in lexicographic order of the suffixes.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Write down every suffix of banana (banana, anana, nana, ana, na, a) and sort them alphabetically. The suffix array is the list of their start positions in that order: [5, 3, 1, 0, 4, 2]. It is a compact index: every occurrence of a pattern is a contiguous block of it, found by binary search.",
      },
      {
        kind: "p",
        text: "Sorting the suffixes as strings costs up to $O(n)$ per comparison. Doubling avoids that: once you know how the suffixes compare on their first $k$ letters, comparing them on $2k$ letters needs only two numbers per suffix, the rank of its first $k$ letters and the rank of the $k$ letters after them.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Rank every suffix by its first letter.",
          "For $k = 1, 2, 4, \\dots$: give suffix $i$ the key $(rank[i], rank[i + k])$, using $-1$ when $i + k \\ge n$ (a shorter string sorts first).",
          "Sort by the keys, then re-rank: equal keys get equal ranks, and the rank goes up by one at each new key.",
          "Stop when all ranks are different.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, s = banana). Rows are in final order; letters rank a = 0, b = 1, n = 2.",
      },
      {
        kind: "table",
        head: [
          "Start",
          "Suffix",
          "Rank (1 letter)",
          "Key, k = 1",
          "Rank (2 letters)",
          "Key, k = 2",
          "Rank (4 letters)",
        ],
        rows: [
          ["5", "a", "0", "(0, −1)", "0", "(0, −1)", "0"],
          ["3", "ana", "0", "(0, 2)", "1", "(1, 0)", "1"],
          ["1", "anana", "0", "(0, 2)", "1", "(1, 1)", "2"],
          ["0", "banana", "1", "(1, 0)", "2", "(2, 3)", "3"],
          ["4", "na", "2", "(2, 0)", "3", "(3, −1)", "4"],
          ["2", "nana", "2", "(2, 0)", "3", "(3, 3)", "5"],
        ],
      },
      {
        kind: "p",
        text: "After the first round ana and anana still tie (both start an), as do na and nana. The second round separates them: after its first two letters, ana continues with a (suffix 5, rank 0) and anana with an (suffix 3, rank 1). All six ranks differ after two rounds, so SA = [5, 3, 1, 0, 4, 2].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "With a comparison sort each round costs $O(n \\log n)$, so $O(n \\log^2 n)$ in total; the visualizer does this. Radix-sorting the pairs (two stable counting-sort passes) gives $O(n \\log n)$.",
          "Stop as soon as the largest rank is $n - 1$. On random text the longest repeated substring is short (about $2 \\log_\\sigma n$ letters), so only a few rounds run.",
          "The **LCP array** (longest common prefix of neighbouring suffixes) is computed afterwards in $O(n)$ with Kasai's algorithm, as in the JavaScript sample: going through suffixes in text order, the LCP drops by at most one per step.",
          "Pattern search: binary search over SA comparing the pattern with suffixes costs $O(m \\log n)$; with LCP information it improves to $O(m + \\log n)$.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** After the round with step $k$, $rank[i] < rank[j]$ exactly when the first $2k$ letters of suffix $i$ come before those of suffix $j$ (a suffix shorter than $2k$ counts as itself). This holds because the first $2k$ letters are the first $k$ letters followed by the next $k$, and pairs compare lexicographically.",
      },
      {
        kind: "p",
        text: "**Termination.** Different suffixes have different lengths, so once $2k \\ge n$ all prefixes differ and so do all ranks. After the first letter, rounds compare 2, 4, 8, … letters:",
      },
      {
        kind: "math",
        tex: "\\text{rounds} \\le \\lceil \\log_2 n \\rceil, \\qquad T(n) = O(n \\log n) \\text{ with radix sort}",
      },
      {
        kind: "p",
        text: "**Counting distinct substrings.** Each suffix contributes its length minus what it shares with its predecessor in SA: $\\frac{n(n+1)}{2} - \\sum LCP$. For banana: $21 - (1 + 3 + 0 + 0 + 2) = 15$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Linear-time construction exists: the skew (DC3) algorithm of Kärkkäinen and Sanders, and SA-IS (induced sorting) by Nong, Zhang and Chan, which is fast in practice.",
          "A suffix array plus its LCP array can simulate a suffix tree's traversals in far less memory.",
          "The Burrows–Wheeler transform (used by bzip2 and DNA aligners such as BWA and Bowtie) is read straight off the suffix array.",
          "Range-minimum queries over the LCP array (for example with a sparse table) give the longest common prefix of any two suffixes in $O(1)$.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n)",
    worstClass: "n log n",
    note: "With radix-sorted rounds. Comparison-sorted rounds, as in the visualizer, take O(n log² n).",
  },
  properties: [
    { label: "Rounds", value: "At most ⌈log₂ n⌉ after the first letter" },
    { label: "Companion", value: "LCP array in O(n) (Kasai)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "suffix_array",
      code: `def suffix_array(s):
    n = len(s)
    rank = [ord(c) for c in s]
    sa = list(range(n))
    k = 1
    while True:
        def key(i):
            return (rank[i], rank[i + k] if i + k < n else -1)
        sa.sort(key=key)
        new = [0] * n
        for j in range(1, n):
            new[sa[j]] = new[sa[j - 1]] + (key(sa[j]) != key(sa[j - 1]))
        rank = new
        if n == 0 or rank[sa[-1]] == n - 1:
            return sa
        k *= 2
`,
      tests: [
        { args: ["banana"], expected: [5, 3, 1, 0, 4, 2] },
        { args: ["mississippi"], expected: [10, 7, 4, 1, 0, 9, 8, 6, 3, 5, 2] },
        { args: ["a"], expected: [0] },
      ],
    },
    {
      language: "javascript",
      entry: "lcpArray",
      code: `// Kasai et al.: lcp[j] = longest common prefix of suffixes sa[j] and sa[j + 1].
function lcpArray(s, sa) {
  const n = s.length, rank = new Array(n);
  const lcp = new Array(Math.max(n - 1, 0)).fill(0);
  sa.forEach((i, j) => (rank[i] = j));
  let h = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] === 0) { h = 0; continue; }
    const j = sa[rank[i] - 1];
    while (s[i + h] !== undefined && s[i + h] === s[j + h]) h++;
    lcp[rank[i] - 1] = h;
    if (h > 0) h--;
  }
  return lcp;
}
`,
      tests: [
        { args: ["banana", [5, 3, 1, 0, 4, 2]], expected: [1, 3, 0, 0, 2] },
        { args: ["aaa", [2, 1, 0]], expected: [1, 2] },
      ],
    },
  ],
  visualizer: "suffix-array",
  practice: [
    {
      id: "sa-rounds",
      kind: "numeric",
      prompt:
        "How many doubling rounds (after the first sort by one letter) does prefix doubling need for s = aaaaa?",
      answer: 3,
      explanation:
        "The suffixes are a, aa, aaa, aaaa and aaaaa. On 2 letters, the four longest all read aa; on 4 letters, aaaa and aaaaa still tie; only the third round (8 letters) separates them. Rounds k = 1, 2, 4.",
      hints: ["Round r compares the first 2^r letters. When do all of them differ?"],
      objective: "Trace the doubling rounds",
    },
    {
      id: "sa-key",
      kind: "mcq",
      prompt: "Why may the key for 2k letters be the pair (rank[i], rank[i + k])?",
      options: [
        "The first 2k letters are the first k letters followed by the next k, which start suffix i + k",
        "Because ranks are always distinct after the first round",
        "Because suffixes of equal length are equal",
        "Because rank[i + k] counts the letters in suffix i",
      ],
      answer: 0,
      explanation:
        "Comparing the pairs lexicographically is exactly comparing 2k-letter prefixes, given the ranks of k-letter prefixes.",
      distractors: {
        1: "Ties can survive many rounds (try aaaaa).",
        2: "Suffixes of a string all have different lengths.",
        3: "A rank is a position in an order, not a count of letters.",
      },
      hints: ["Where do letters k + 1 … 2k of suffix i begin?"],
      objective: "Understand why doubling is correct",
    },
  ],
  exam: {
    definition:
      "A suffix array lists the starting positions of all suffixes of a string in lexicographic order. Prefix doubling builds it by repeatedly sorting suffixes on pairs of ranks of their first k and next k letters.",
    steps: [
      "Rank suffixes by their first letter.",
      "For k = 1, 2, 4, …: key(i) = (rank[i], rank[i + k] or −1); sort; re-rank.",
      "Stop when all ranks are distinct.",
      "Optionally compute LCP with Kasai's algorithm.",
    ],
    timeComplexity: "$O(n \\log n)$ with radix sort; $O(n \\log^2 n)$ with comparison sorts.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "After step k, ranks order the 2k-letter prefixes, because pairs of k-letter ranks compare exactly like 2k-letter prefixes; all prefixes differ once 2k ≥ n.",
    applications: [
      "Full-text indexes and pattern search",
      "Longest repeated / common substring (with LCP)",
      "Burrows–Wheeler transform and compression",
      "Genome indexing",
    ],
    limitations: [
      "Static: the text cannot change",
      "Pattern search needs binary search unless augmented",
    ],
    faq: [
      {
        q: "Suffix array or suffix tree?",
        a: "They answer most of the same questions. The array uses several times less memory; with the LCP array it can simulate tree traversals.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Sorted suffix start positions.", "Doubling in $O(n \\log n)$."] },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Doubling rounds (2).",
          "Worked example (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and naive cost (1).",
          "Doubling algorithm with radix sort (2).",
          "Worked example on banana (2).",
          "Correctness invariant and termination (2).",
          "LCP array with Kasai (2).",
          "Applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "U. Manber, G. Myers, “Suffix arrays: a new method for on-line string searches,” SIAM Journal on Computing, 22(5), 1993.",
      supports:
        "Suffix arrays, construction by prefix doubling, and searching with LCP information.",
    },
    {
      citation:
        "T. Kasai, G. Lee, H. Arimura, S. Arikawa, K. Park, “Linear-time longest-common-prefix computation in suffix arrays and its applications,” CPM 2001, LNCS 2089.",
      supports: "The O(n) LCP algorithm in the JavaScript sample.",
    },
    {
      citation:
        "G. Nong, S. Zhang, W. H. Chan, “Linear suffix array construction by almost pure induced-sorting,” Data Compression Conference (DCC), 2009.",
      supports: "SA-IS, a linear-time construction.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
