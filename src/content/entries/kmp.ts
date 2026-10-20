import type { AlgorithmEntry } from "../types";

export const kmpEntry: AlgorithmEntry = {
  slug: "kmp",
  name: "Knuth–Morris–Pratt (KMP)",
  aliases: ["KMP", "Prefix-function string matching"],
  curriculum: [302, 308],
  domain: "strings",
  subcategory: "Pattern matching",
  difficulty: "advanced",
  summary:
    "Finds every occurrence of a pattern in a text in O(n + m) by never moving backwards in the text: the pattern's prefix function says how far to shift after a mismatch.",
  tags: ["strings", "pattern matching", "prefix function", "failure function", "linear time"],
  prerequisites: ["Strings", "Naive string matching"],
  related: ["edit-distance", "lcs"],
  problem: {
    input: "A text $T$ of length $n$ and a pattern $P$ of length $m \\ge 1$.",
    output: "Every position $s$ with $T[s..s+m-1] = P$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The naive method slides the pattern one step at a time and re-compares from scratch, which can cost $O(nm)$. But after matching several characters and then failing, you already *know* what those text characters were — they equal the start of the pattern.",
      },
      {
        kind: "p",
        text: "KMP precomputes, for every prefix of the pattern, how much of it can be reused after a mismatch: the longest proper prefix that is also a suffix (its *border*). The text pointer then never moves backwards.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Prefix function:** $\\text{lps}[q]$ is the length of the longest proper prefix of $P[0..q]$ that is also a suffix of it.",
          "**Scan:** keep $i$ in the text and $j$, the number of pattern characters matched. Compare $T[i]$ with $P[j]$ once per step: if they match, advance both; if not and $j > 0$, fall back to $j = \\text{lps}[j-1]$ without moving $i$; if not and $j = 0$, advance $i$.",
          "When $j = m$, report a match at $i - m$ and continue with $j = \\text{lps}[m-1]$ so that overlapping matches are found.",
        ],
      },
      { kind: "heading", text: "Example prefix function: P = ababd" },
      {
        kind: "table",
        head: ["q", "0", "1", "2", "3", "4"],
        rows: [
          ["P[q]", "a", "b", "a", "b", "d"],
          ["lps[q]", "0", "0", "1", "2", "0"],
        ],
      },
      {
        kind: "p",
        text: "lps[3] = 2 because “abab” starts and ends with “ab”. If the text matches “abab” and then fails on “d”, the last “ab” it read is already the start of a new attempt, so the search continues with $j = 2$ instead of starting over. In the preset text ababcabcabababd, the single match is at position 10.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The prefix-function computation is the same algorithm run on the pattern against itself.",
          "Several fallbacks may be needed for one text character; in the one-comparison-per-step form shown here they happen on successive steps while $i$ stays put. The common alternative writes them as an inner `while` loop, which re-compares the same pair once more after the loop.",
          "After a full match, fall back with $\\text{lps}[m-1]$ rather than resetting to 0, or overlapping matches (e.g. “aaa” in “aaaaa”) are missed.",
          "Some books define a *failure function* shifted by one position ($\\pi$ with 1-based indices); the idea is identical.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Why it is linear" },
      {
        kind: "p",
        text: "Each step of the scan makes one comparison and either advances $i$ or strictly decreases $j$. $i$ advances at most $n$ times. $j$ only increases when $i$ does, so it can decrease at most $n$ times in total. Hence at most $2n$ steps, and $2n$ comparisons. The same argument for the prefix function ($q$ advances at most $m - 1$ times) gives at most $2(m-1)$ more:",
      },
      { kind: "math", tex: "C(n, m) \\le 2n + 2(m-1) = O(n + m)." },
      { kind: "heading", text: "Why the fallback is safe" },
      {
        kind: "p",
        text: "If $P[0..j-1]$ matches the text ending at $i-1$, the next possible alignment that could still match must have a prefix of $P$ equal to a suffix of $P[0..j-1]$ — that is, a border. Jumping to the longest border skips only alignments that are impossible, so no occurrence is missed.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Z-algorithm** computes, for each position, the longest substring starting there that matches a prefix; it solves the same problem in linear time.",
          "**Boyer–Moore** skips ahead using the end of the pattern and is often faster on natural-language text, though its simple versions are not linear in the worst case.",
          "**Aho–Corasick** generalises KMP's failure links to a trie of many patterns at once.",
          "The prefix function also gives the shortest period of a string: $m - \\text{lps}[m-1]$.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n + m)", average: "\\Theta(n + m)", worst: "\\Theta(n + m)" },
    space: "\\Theta(m)",
    worstClass: "n + m",
    note: "At most $2n + 2(m-1)$ character comparisons in the form shown (property-tested).",
  },
  properties: [
    { label: "Text pointer moves back?", value: "Never" },
    { label: "Preprocessing", value: "$O(m)$ prefix function" },
    { label: "Finds overlapping matches", value: "Yes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "kmp_search",
      code: `def kmp_search(text, pattern):
    """Return every start index of pattern in text (pattern non-empty)."""
    m = len(pattern)
    lps, k, q = [0] * m, 0, 1
    while q < m:  # one comparison per iteration
        if pattern[q] == pattern[k]:
            k += 1
            lps[q] = k
            q += 1
        elif k > 0:
            k = lps[k - 1]
        else:
            q += 1
    matches, i, j = [], 0, 0
    while i < len(text):
        if text[i] == pattern[j]:
            i, j = i + 1, j + 1
            if j == m:
                matches.append(i - m)
                j = lps[j - 1]
        elif j > 0:
            j = lps[j - 1]
        else:
            i += 1
    return matches
`,
      tests: [
        { args: ["ababcabcabababd", "ababd"], expected: [10] },
        { args: ["aaaaab", "aaa"], expected: [0, 1, 2] },
        { args: ["abcabcabc", "abd"], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "prefixFunction",
      code: `function prefixFunction(p) {
  const lps = new Array(p.length).fill(0);
  let k = 0;
  for (let q = 1; q < p.length; q++) {
    while (k > 0 && p[q] !== p[k]) k = lps[k - 1];
    if (p[q] === p[k]) k++;
    lps[q] = k;
  }
  return lps;
}
`,
      tests: [
        { args: ["ababd"], expected: [0, 0, 1, 2, 0] },
        { args: ["aabaaab"], expected: [0, 1, 0, 1, 2, 2, 3] },
      ],
    },
  ],
  visualizer: "kmp",
  practice: [
    {
      id: "kmp-lps",
      kind: "mcq",
      prompt: "What is the prefix function (lps) of “aabaaab”?",
      options: [
        "[0, 1, 0, 1, 2, 2, 3]",
        "[0, 1, 0, 1, 2, 3, 3]",
        "[0, 0, 1, 2, 2, 3, 4]",
        "[0, 1, 0, 0, 1, 2, 3]",
      ],
      answer: 0,
      explanation:
        "For example, lps[5] = 2: “aabaaa” ends with “aa”, which is also its start, but not with “aab”. lps[6] = 3: “aabaaab” starts and ends with “aab”.",
      distractors: {
        1: "lps[5] cannot be 3: “aabaaa” ends with “aaa”, but it starts with “aab”.",
        2: "lps[1] is 1: “aa” has the border “a”.",
        3: "lps[3] is 1: “aaba” ends with “a”, which is its first character.",
      },
      hints: ["Compute lps[q] by asking: which prefixes of P[0..q] also end it?"],
      objective: "Compute the prefix function",
    },
    {
      id: "kmp-comparisons",
      kind: "mcq",
      prompt: "Why does KMP's search phase make at most 2n comparisons?",
      options: [
        "j rises at most n times overall, and each fallback lowers it, so fallbacks are at most n",
        "Each text character is compared exactly twice",
        "The pattern is shorter than the text",
        "The prefix function has length n",
      ],
      answer: 0,
      explanation:
        "This is an amortised argument: the total number of decreases cannot exceed the total number of increases.",
      distractors: {
        1: "Some characters are compared once, others several times; only the total is bounded.",
        2: "Lengths alone do not bound the comparisons.",
        3: "The prefix function has length m.",
      },
      hints: ["Track how j changes over the whole scan."],
      objective: "Understand the amortised bound",
    },
    {
      id: "kmp-overlap",
      kind: "numeric",
      prompt: "How many occurrences of “aba” are there in “abababa”, counting overlaps?",
      answer: 3,
      explanation:
        "At positions 0, 2 and 4. KMP finds all three because it continues with $j = \\text{lps}[2] = 1$ after each match.",
      hints: ["Occurrences may share characters."],
      objective: "Find overlapping matches",
    },
  ],
  exam: {
    definition:
      "The Knuth–Morris–Pratt algorithm finds all occurrences of a pattern in a text in $O(n + m)$ time by precomputing the pattern's prefix function, which tells how far the pattern can shift after a mismatch without re-reading the text.",
    steps: [
      "Compute lps with $k = 0$, $q = 1$: if $P[q] = P[k]$, set lps[$q$] $= k + 1$ and advance both; else if $k > 0$, $k \\leftarrow$ lps[$k-1$]; else lps[$q$] $= 0$ and advance $q$.",
      "Scan with $i = j = 0$: if $T[i] = P[j]$ advance both; else if $j > 0$, $j \\leftarrow$ lps[$j-1$]; else advance $i$.",
      "When $j = m$, report $i - m$ and set $j$ = lps[$m-1$].",
    ],
    timeComplexity:
      "$O(m)$ preprocessing plus $O(n)$ search: $O(n + m)$, at most $2n + 2(m-1)$ comparisons.",
    spaceComplexity: "$O(m)$ for the prefix function.",
    correctness:
      "Falling back to the longest border skips only alignments that cannot match, so every occurrence is found.",
    applications: [
      "Text editors' find",
      "Searching DNA sequences",
      "Detecting periodicity in strings",
      "Basis for Aho–Corasick multi-pattern search",
    ],
    limitations: [
      "Often slower than Boyer–Moore on large alphabets in practice",
      "Single pattern only",
    ],
    faq: [
      { q: "What does lps stand for?", a: "Longest proper prefix which is also a suffix." },
      {
        q: "Naive matching vs KMP?",
        a: "Naive is $O(nm)$ in the worst case (e.g. aaaa…ab); KMP is $O(n + m)$ always.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Linear-time pattern matching using the prefix function to avoid re-reading text.",
          "$O(n + m)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and lps (1).",
          "lps computation (1).",
          "Search algorithm (2).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem and weakness of naive matching — 1.",
          "Definition of lps with an example table — 2.",
          "Pseudocode for both phases — 3.",
          "Full trace of a search with fallbacks — 2.",
          "Amortised $O(n + m)$ proof — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, J. H. Morris, V. R. Pratt, “Fast pattern matching in strings,” SIAM Journal on Computing, 6(2), 1977.",
      supports: "The algorithm and its linear-time analysis.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §32.4.",
      supports: "Prefix function, correctness and amortised analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
