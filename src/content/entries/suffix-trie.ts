import type { AlgorithmEntry } from "../types";

export const suffixTrieEntry: AlgorithmEntry = {
  slug: "suffix-trie",
  name: "Suffix Trie",
  aliases: ["Trie of suffixes"],
  curriculum: [170],
  domain: "trees",
  subcategory: "Tries",
  difficulty: "intermediate",
  summary:
    "The plain trie of every suffix of a text, each ended by a unique terminator $. Every substring of the text is a path from the root, so “does p occur?” takes O(|p|) steps, and the leaves below the path list where. The price is size: up to quadratic in the text length, which is why suffix trees compress it.",
  tags: ["tree", "trie", "strings", "suffix", "pattern matching", "substring"],
  prerequisites: ["Tries"],
  related: ["trie", "suffix-tree", "suffix-array", "suffix-automaton", "radix-tree"],
  problem: {
    input: "A text of up to 8 lowercase letters, and up to 4 patterns.",
    output: "The start positions of each pattern in the text, read from the trie.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Every substring of a text is a prefix of some suffix: “nan” in “banana” is the start of the suffix “nana”. So if all suffixes are stored in a trie, every substring is a path from the root, and searching for a pattern is just walking it. Appending a terminator $ that occurs nowhere else makes each suffix end at its own leaf, so no suffix is hidden inside another; each leaf records where its suffix starts.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Append $ to the text.",
          "For i = 0, 1, …, n, insert the suffix starting at i into a trie: follow existing letters, then create nodes for the rest. Record i at the $ leaf.",
          "To find a pattern p: walk its letters from the root. If a letter is missing, p does not occur.",
          "Otherwise each $ leaf below the node where p ends is a suffix starting with p: their recorded positions are exactly the occurrences of p.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): the text banana, so the trie stores the suffixes of banana$.",
      },
      {
        kind: "table",
        head: ["i", "suffix", "letters already present", "new nodes"],
        rows: [
          ["0", "banana$", "none", "7"],
          ["1", "anana$", "none", "6"],
          ["2", "nana$", "none", "5"],
          ["3", "ana$", "a, n, a", "1 ($)"],
          ["4", "na$", "n, a", "1 ($)"],
          ["5", "a$", "a", "1 ($)"],
          ["6", "$", "none", "1 ($)"],
        ],
      },
      {
        kind: "p",
        text: "22 nodes plus the root: one for every distinct substring of banana$. Finding “ana” walks a, n, a and finds two leaves below, at 1 and 3 — the two overlapping occurrences. “nab” fails at b; “a” has three leaves below it: 1, 3 and 5.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The naive construction shown takes $O(n^2)$ time; that is fine for short texts but not for genomes.",
          "Counting occurrences without listing them: store at each node the number of leaves below it, filled in by one traversal after construction.",
          "The longest repeated substring is the deepest node with at least two leaves below it; the longest common substring of two texts uses two different terminators.",
          "In practice one builds a suffix tree, suffix array or suffix automaton instead; the suffix trie is the idea they all refine.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Size.** Nodes correspond one-to-one to distinct substrings of text$ (plus the root, for the empty string), so the trie can have up to about $n^2/2$ nodes: a text whose letters are all different has $n(n+1)/2$ distinct substrings, and so does any text of the form $a^k b^k$ up to a constant factor. A suffix tree compresses single-child chains into edges, leaving O(n) nodes, and can be built in O(n) time (Weiner 1973; Ukkonen 1995).",
      },
      {
        kind: "p",
        text: "**Correctness.** p occurs at position i exactly when p is a prefix of the suffix starting at i, which holds exactly when the path for p leads to the leaf recording i. The tests compare every run with brute-force matching, and check the node count against the number of distinct substrings of text$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The suffix automaton (DAWG) merges identical subtrees of the suffix trie and has at most 2n − 1 states.",
          "Generalised suffix tries store the suffixes of several texts, each with its own terminator, for multi-document search.",
          "A suffix array is the list of leaf positions read left to right in this trie, when children are sorted alphabetically with $ first.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    space: "O(n²)",
    worstClass: "n^2",
    note: "Naive construction walks every letter of every suffix; the size is O(n) only for very repetitive texts such as aaaa. A search for a pattern p takes O(|p|) plus the number of occurrences reported.",
  },
  properties: [
    { label: "Nodes", value: "One per distinct substring of text$, plus the root" },
    { label: "Leaves", value: "One per suffix, thanks to $" },
    { label: "Query", value: "O(|p|) to decide whether p occurs" },
  ],
  implementations: [
    {
      language: "python",
      entry: "occurrences",
      code: `def occurrences(text, pattern):
    """Start positions of pattern in text, read from a suffix trie."""
    root = {}
    s = text + "$"
    for i in range(len(s)):
        node = root
        for c in s[i:]:
            node = node.setdefault(c, {})
        node["start"] = i                       # the $ leaf records the suffix

    node = root
    for c in pattern:
        if c not in node:
            return []
        node = node[c]

    def leaves(n):
        if "start" in n:
            return [n["start"]]
        return [p for k, child in n.items() for p in leaves(child)]
    return sorted(leaves(node))
`,
      tests: [
        { args: ["banana", "ana"], expected: [1, 3] },
        { args: ["banana", "nab"], expected: [] },
        { args: ["banana", "a"], expected: [1, 3, 5] },
      ],
    },
    {
      language: "javascript",
      entry: "trieNodes",
      code: `// Nodes in the suffix trie of text + "$", including the root.
function trieNodes(text) {
  const s = text + "$";
  const subs = new Set();
  for (let i = 0; i < s.length; i++)
    for (let j = i + 1; j <= s.length; j++) subs.add(s.slice(i, j));
  return subs.size + 1;
}
`,
      tests: [
        { args: ["banana"], expected: 23 },
        { args: ["abcd"], expected: 16 },
        { args: ["ababab"], expected: 19 },
      ],
    },
  ],
  visualizer: "suffix-trie",
  practice: [
    {
      id: "suffix-trie-dollar",
      kind: "mcq",
      prompt: "Why is a terminator $ appended before building the suffix trie?",
      options: [
        "So that no suffix ends inside the path of another and every suffix gets its own leaf",
        "To mark the root",
        "To make the trie binary",
        "To sort the suffixes",
      ],
      answer: 0,
      explanation:
        "Without $, the suffix “a” of banana would end in the middle of the path for “ana”, with no leaf to record it.",
      distractors: {
        1: "The root needs no mark.",
        2: "The trie is not binary.",
        3: "Sorting is unrelated; $ only has to be unique.",
      },
      hints: ["Which suffixes of banana are prefixes of other suffixes?"],
      objective: "Terminator",
    },
    {
      id: "suffix-trie-size",
      kind: "numeric",
      prompt:
        "How many nodes, including the root, does the suffix trie of “abc$” have (all letters are different)?",
      answer: 11,
      explanation:
        "abc$ has 4 + 3 + 2 + 1 = 10 distinct non-empty substrings, one node each, plus the root.",
      hints: ["Count the distinct substrings of abc$."],
      objective: "Size",
    },
  ],
  exam: {
    definition:
      "A suffix trie of a text is the trie of all its suffixes, each terminated by a unique end symbol $.",
    steps: [
      "Append $.",
      "Insert each suffix into a trie, recording its start at the leaf.",
      "Query: walk the pattern; occurrences are the leaves below.",
    ],
    timeComplexity: "$O(n^2)$ to build naively; $O(|p| + occ)$ per query.",
    spaceComplexity: "$O(n^2)$ nodes in the worst case.",
    correctness:
      "Every substring is a prefix of a suffix, so it is a root path; its occurrences are the suffixes below.",
    applications: [
      "Substring search on short texts",
      "Teaching suffix trees",
      "Longest repeated substring",
    ],
    limitations: ["Quadratic size", "Superseded by suffix trees, arrays and automata"],
    faq: [
      {
        q: "How does a suffix tree differ?",
        a: "It compresses each chain of single-child nodes into one edge labelled by a text interval, so it has O(n) nodes and can be built in O(n) time.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Definition with $ (1).", "Construction (2).", "Query and occurrences (2)."],
      },
      {
        marks: 10,
        outline: [
          "Definition and example (3).",
          "Pattern search and counting (3).",
          "Quadratic size and the step to suffix trees (4).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. Gusfield, Algorithms on Strings, Trees, and Sequences, Cambridge University Press, 1997, Chapter 5.",
      supports: "Suffix tries, suffix trees and their applications.",
    },
    {
      citation:
        "P. Weiner, “Linear pattern matching algorithms,” Proceedings of the 14th IEEE Symposium on Switching and Automata Theory, 1973.",
      supports: "The first linear-time suffix tree construction.",
    },
    {
      citation: "E. Ukkonen, “On-line construction of suffix trees,” Algorithmica, 14(3), 1995.",
      supports: "Linear-time online construction of suffix trees.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
