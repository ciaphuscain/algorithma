import type { AlgorithmEntry } from "../types";

export const palindromicTreeEertreeEntry: AlgorithmEntry = {
  slug: "palindromic-tree-eertree",
  name: "Palindromic Tree (Eertree)",
  aliases: ["Eertree", "Palindromic Automaton"],
  curriculum: [329],
  domain: "strings",
  subcategory: "Palindrome Structures",
  difficulty: "intermediate",
  summary:
    "A tree structure containing all distinct palindromic substrings of a string, built online in O(n) time.",
  tags: ["palindrome", "eertree", "online construction"],
  prerequisites: [],
  related: [],
  problem: {
    input: "A string S.",
    output: "All distinct palindromic substrings and their counts.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each node represents a unique palindromic substring. Two root nodes represent palindromes of odd and even length. Suffix links connect each palindrome to its longest proper palindromic suffix.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Two roots: imaginary root (length -1) and empty root (length 0).",
          "For each new character:",
          "  Follow suffix links from the last node until the character before the palindrome matches the new character.",
          "  If the child edge exists, move there. Otherwise, create a new node.",
          "  Set suffix link by following the parent's suffix link similarly.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Online construction processes characters one by one. At most n+2 nodes (n distinct non-empty palindromes + 2 roots).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "A string of length n has at most n+1 distinct palindromic substrings (including empty). Construction is amortized $O(n)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The palindromic tree enables counting occurrences of all palindromic substrings, finding the longest palindrome, and solving palindrome-based DP problems.",
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
      entry: "build_eertree",
      code: `class Node:
    def __init__(self, length, suffix_link=0):
        self.length = length
        self.suffix_link = suffix_link
        self.children: dict[str, int] = {}
        self.count = 0

def build_eertree(s: str) -> int:
    nodes = [Node(-1, 0), Node(0, 0)]
    nodes[0].suffix_link = 0
    last = 1
    for i, c in enumerate(s):
        cur = last
        while True:
            cl = nodes[cur].length
            if i - cl - 1 >= 0 and s[i - cl - 1] == c:
                break
            cur = nodes[cur].suffix_link
        if c in nodes[cur].children:
            last = nodes[cur].children[c]
            nodes[last].count += 1
            continue
        new_len = nodes[cur].length + 2
        q = nodes[cur].suffix_link
        while True:
            ql = nodes[q].length
            if i - ql - 1 >= 0 and s[i - ql - 1] == c:
                break
            q = nodes[q].suffix_link
        suf = nodes[q].children.get(c, 1)
        new_node = Node(new_len, suf)
        new_node.count = 1
        nodes[cur].children[c] = len(nodes)
        nodes.append(new_node)
        last = len(nodes) - 1
    return len(nodes) - 2
`,
      tests: [
        {
          args: ["abba"],
          expected: 4,
        },
        {
          args: ["aaa"],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "countDistinctPalindromes",
      code: `function countDistinctPalindromes(s) {
  const nodes = [{len: -1, suf: 0, ch: {}}, {len: 0, suf: 0, ch: {}}];
  let last = 1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    let cur = last;
    while (true) {
      const cl = nodes[cur].len;
      if (i - cl - 1 >= 0 && s[i - cl - 1] === c) break;
      cur = nodes[cur].suf;
    }
    if (c in nodes[cur].ch) { last = nodes[cur].ch[c]; continue; }
    let q = nodes[cur].suf;
    while (true) {
      const ql = nodes[q].len;
      if (i - ql - 1 >= 0 && s[i - ql - 1] === c) break;
      q = nodes[q].suf;
    }
    const suf = nodes[q].ch[c] || 1;
    const newNode = {len: nodes[cur].len + 2, suf, ch: {}};
    nodes[cur].ch[c] = nodes.length;
    nodes.push(newNode);
    last = nodes.length - 1;
  }
  return nodes.length - 2;
}
`,
      tests: [
        {
          args: ["abba"],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "eertree-q1",
      kind: "mcq",
      prompt: "How many distinct palindromic substrings can a string of length n have?",
      options: ["At most n+1", "n^2", "2^n", "n log n"],
      answer: 0,
      explanation: "Including the empty palindrome, at most n+1 distinct palindromic substrings.",
      hints: ["Linear bound."],
      objective: "Count",
    },
  ],
  exam: {
    definition: "A tree of all distinct palindromic substrings, built online in O(n).",
    steps: [
      "Two roots (length -1 and 0).",
      "Extend by suffix link traversal.",
      "Create new nodes for new palindromes.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Suffix links guarantee all palindromes are found.",
    applications: ["Count distinct palindromes", "palindrome-based DP"],
    limitations: ["Constant factor overhead from node structure"],
    faq: [
      {
        q: "Why two roots?",
        a: "One for odd-length palindromes (starting from length -1), one for even-length (starting from length 0).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Structure (2).", "Construction (2).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "M. Rubinchik and A. Shur, 'EERTREE: An Efficient Data Structure for Processing Palindromes in Strings', 2015.",
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
