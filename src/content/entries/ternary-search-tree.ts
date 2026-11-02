import type { AlgorithmEntry } from "../types";

export const ternarySearchTreeEntry: AlgorithmEntry = {
  slug: "ternary-search-tree",
  name: "Ternary Search Tree",
  aliases: ["TST", "Ternary trie"],
  curriculum: [169],
  domain: "trees",
  subcategory: "Tries",
  difficulty: "intermediate",
  summary:
    "A trie in which each node holds one letter and three links: to smaller letters, to the next letter of the words passing through it, and to larger letters. It has the prefix powers of a trie with the space of a binary search tree.",
  tags: ["tree", "trie", "strings", "prefix", "dictionary", "autocomplete", "binary search tree"],
  prerequisites: ["Tries", "Binary search trees"],
  related: ["trie", "radix-tree", "bst", "quick-sort"],
  problem: {
    input: "A sequence of insert, search and prefix operations on lowercase words.",
    output: "Whether each operation succeeded, and the tree built in that insertion order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A trie node with an array of 26 children wastes most of them. A ternary search tree replaces that array by a small binary search tree over the letters actually used at that position: the < and > links lead to alternative letters, and only the = link moves on to the next letter of the word. Searching is like a series of binary searches, one per letter of the word.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start at the root with the first letter c of the word.",
          "If c is smaller than the node's letter, follow the < link; if larger, the > link. The letter position does not change.",
          "If c equals the node's letter: if it is the word's last letter, stop here; otherwise move to the next letter and follow the = link.",
          "**Insert:** wherever a link is missing, create a node with the current letter; mark the node where the word's last letter matched.",
          "**Search** succeeds if every letter matches and the last node is marked; **prefix** only needs every letter to match.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert cat, cup, at, as, he, us, i.",
      },
      {
        kind: "table",
        head: ["insert", "path", "new nodes", "nodes in all"],
        rows: [
          ["cat", "empty tree", "c, a, t", "3"],
          ["cup", "c =, then u > a", "u (as a's > child), p", "5"],
          ["at", "a < c", "a (c's < child), t", "7"],
          ["as", "a < c, a =, then s < t", "s (t's < child)", "8"],
          ["he", "h > c", "h, e", "10"],
          ["us", "u > c, u > h", "u, s", "12"],
          ["i", "i > c, i > h, i < u", "i", "13"],
        ],
      },
      {
        kind: "p",
        text: "Searching for “cup” then makes four comparisons: c equal, u greater than a, u equal, p equal. “cu” is a prefix but not a stored word, and “it” fails because the node for i has no = link. The second preset inserts a, b, c, d, e in sorted order and gets a chain of > links, just as sorted input degrades a binary search tree.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each node needs one letter, three links and a word-end flag (or a value) — far less than a trie node with a full child array.",
          "Insert words in random order, or insert the median of a sorted list first and recurse on each half, to keep the < and > subtrees balanced.",
          "TSTs support prefix listing (autocomplete), near-neighbour search within a given Hamming distance, and wildcard matching by exploring several links at once.",
          "Bentley and Sedgewick note that a TST is to multikey (three-way radix) quicksort what a binary search tree is to quicksort.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** A search for a word of length L follows L = links and some number of < or > links; each < or > step at a position is a step in the binary search tree of the letters seen there, so with balanced subtrees a search makes $O(L + \\log n)$ comparisons. In the worst case (sorted insertions) the < and > chains are as long as the alphabet, giving O(L · σ) for alphabet size σ.",
      },
      {
        kind: "p",
        text: "**Space.** Each node stores one letter, so there are at most as many nodes as letters inserted, and usually far fewer because shared prefixes share = paths. **Correctness:** the < and > links at a position form a binary search tree on letters, and the = links spell out prefixes, so each word has exactly one path. The tests compare every run with an independent recursive implementation of Bentley and Sedgewick's insert and with a plain set of words.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The shape depends on insertion order, unlike a trie or radix tree; balancing schemes from binary search trees can be applied at each letter position.",
          "Hybrids put an R-way branch at the root (for the first one or two letters) and TSTs below, combining a fast start with small nodes.",
          "Deletion is possible but rarely shown: unmark the word's node, then remove nodes that no longer lie on any word's path, which may require splicing a node out of a < or > subtree as in BST deletion.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(L)", average: "O(L + log n)", worst: "O(L · σ)" },
    space: "O(total letters)",
    worstClass: "n",
    note: "L is the word's length, n the number of words, σ the alphabet size. Average assumes balanced < and > subtrees.",
  },
  properties: [
    { label: "Links per node", value: "Three: <, = and >" },
    { label: "Shape", value: "Depends on insertion order" },
    { label: "Ordered", value: "Yes: an in-order walk lists words alphabetically" },
  ],
  implementations: [
    {
      language: "python",
      entry: "search_all",
      code: `class Node:
    def __init__(self, ch):
        self.ch, self.end = ch, False
        self.lo = self.eq = self.hi = None

def insert(node, word, i=0):
    c = word[i]
    if node is None:
        node = Node(c)
    if c < node.ch:
        node.lo = insert(node.lo, word, i)
    elif c > node.ch:
        node.hi = insert(node.hi, word, i)
    elif i < len(word) - 1:
        node.eq = insert(node.eq, word, i + 1)
    else:
        node.end = True
    return node

def contains(node, word):
    i = 0
    while node:
        c = word[i]
        if c < node.ch:
            node = node.lo
        elif c > node.ch:
            node = node.hi
        elif i == len(word) - 1:
            return node.end
        else:
            i, node = i + 1, node.eq
    return False

def search_all(words, queries):
    root = None
    for w in words:
        root = insert(root, w)
    return [contains(root, q) for q in queries]
`,
      tests: [
        {
          args: [
            ["cat", "cup", "at", "as", "he", "us", "i"],
            ["cup", "cu", "it", "as"],
          ],
          expected: [true, false, false, true],
        },
      ],
    },
    {
      language: "javascript",
      entry: "nodeCount",
      code: `// Nodes in the ternary search tree built by inserting the words in order.
function nodeCount(words) {
  let root = null;
  let count = 0;
  const insert = (n, w, i) => {
    const c = w[i];
    if (!n) {
      n = { ch: c, lo: null, eq: null, hi: null };
      count++;
    }
    if (c < n.ch) n.lo = insert(n.lo, w, i);
    else if (c > n.ch) n.hi = insert(n.hi, w, i);
    else if (i < w.length - 1) n.eq = insert(n.eq, w, i + 1);
    return n;
  };
  for (const w of words) root = insert(root, w, 0);
  return count;
}
`,
      tests: [
        { args: [["cat", "cup", "at", "as", "he", "us", "i"]], expected: 13 },
        { args: [["she", "sells", "sea", "shells", "by", "the", "shore"]], expected: 19 },
      ],
    },
  ],
  visualizer: "ternary-search-tree",
  practice: [
    {
      id: "tst-link",
      kind: "mcq",
      prompt:
        "Searching a TST, the current letter is ‘m’ and the node holds ‘k’. What happens next?",
      options: [
        "Follow the > link, staying on the letter ‘m’",
        "Follow the = link and move to the next letter",
        "Follow the < link, staying on ‘m’",
        "The search fails",
      ],
      answer: 0,
      explanation:
        "m > k, so the alternative letters larger than k are tried; the position in the word does not change.",
      distractors: {
        1: "The = link is taken only when the letters are equal.",
        2: "< is for letters smaller than the node's.",
        3: "It fails only if the > link is missing.",
      },
      hints: ["Which links keep the same letter position?"],
      objective: "Navigation",
    },
    {
      id: "tst-nodes",
      kind: "numeric",
      prompt:
        "How many nodes does a TST have after inserting “to”, “tea” and “ten”, in that order?",
      answer: 5,
      explanation:
        "t, o (= of t), then e (< of o), a (= of e), n (> of a): five nodes; the t is shared by all three words.",
      hints: ["Walk each word and count only the nodes you have to create."],
      objective: "Insertion",
    },
  ],
  exam: {
    definition:
      "A ternary search tree is a trie whose nodes each hold one character and three links: to smaller characters, to the next character (equal), and to larger characters.",
    steps: [
      "Compare the current character with the node's.",
      "Less or greater: follow < or > with the same character.",
      "Equal: advance to the next character and follow =; at the last character, check the end mark.",
      "Insert creates missing nodes along the way.",
    ],
    timeComplexity:
      "$O(L + \\log n)$ comparisons with balanced subtrees; O(L · σ) in the worst case.",
    spaceComplexity: "One node per stored character at most; three links each.",
    correctness:
      "At each character position the < and > links form a BST on characters and = links spell prefixes, so every word has a unique path.",
    applications: [
      "Autocomplete and spell checking",
      "Symbol tables keyed by strings",
      "Near-neighbour string search",
    ],
    limitations: ["Shape depends on insertion order", "More comparisons than an array-based trie"],
    faq: [
      {
        q: "Why not just use a trie?",
        a: "A trie node needs a slot for every letter of the alphabet; a TST node needs three links, so it uses much less memory for large alphabets such as Unicode.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Node structure with three links (1).",
          "Search procedure (2).",
          "Insertion example (2).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and comparison with tries and BSTs (2).",
          "Search and insert with a worked example (5).",
          "Complexity and effect of insertion order (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. L. Bentley, R. Sedgewick, “Fast algorithms for sorting and searching strings,” Proceedings of the 8th ACM-SIAM Symposium on Discrete Algorithms (SODA), 1997.",
      supports: "Ternary search trees and their relation to multikey quicksort.",
    },
    {
      citation:
        "R. Sedgewick, Algorithms in C, Parts 1–4, 3rd ed., Addison-Wesley, 1998, Chapter 15.",
      supports: "Ternary search tries and their operations.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
