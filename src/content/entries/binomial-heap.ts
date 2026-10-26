import type { AlgorithmEntry } from "../types";

export const binomialHeapEntry: AlgorithmEntry = {
  slug: "binomial-heap",
  name: "Binomial Heap",
  aliases: ["Binomial queue"],
  curriculum: [127],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "advanced",
  summary:
    "A priority queue made of heap-ordered binomial trees, at most one of each size 2^k — so its shape spells n in binary. Merging two heaps is binary addition: trees of equal size link like carries. Insert, extract-min, decrease-key and union all take O(log n).",
  tags: ["heap", "priority queue", "mergeable heap", "binomial tree", "binary counter"],
  prerequisites: ["Binary heaps", "Binary numbers"],
  related: ["fibonacci-heap", "pairing-heap", "binary-heap", "leftist-heap"],
  problem: {
    input:
      "A sequence of insert, extract (remove the minimum), peek and decrease-key operations on distinct keys.",
    output: "What each operation returns, with union available in O(log n).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A binomial tree of order k is two order-(k − 1) trees linked root to root, so it has exactly $2^k$ nodes. A heap of n keys keeps one tree for every 1 bit of n: 13 = 1101₂ means trees of 8, 4 and 1 nodes. Adding a key is like adding 1 to a binary counter — two trees of the same order combine into one of the next order, carrying upward, with the smaller root on top to keep heap order.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Link** two trees of order k: the root with the larger key becomes the first child of the other; the result has order k + 1.",
          "**Union:** merge the two root lists by order, then scan: whenever two adjacent trees have the same order (and the next does not), link them.",
          "**Insert:** union with a one-node heap. **Extract-min:** find the smallest root, remove it, and union its children (orders 0, 1, …, k − 1) back in.",
          "**Decrease-key:** lower the key and swap it upwards with its parent while it is smaller (each tree has height at most log₂ n).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 8, 3, 12, 5, 9, 1, 7, 4.",
      },
      {
        kind: "table",
        head: ["after inserting", "n in binary", "trees (orders)", "links in this insert"],
        rows: [
          ["8", "1", "8 (0)", "0"],
          ["3", "10", "3(8) (1)", "1"],
          ["12", "11", "12 (0), 3(8) (1)", "0"],
          ["5", "100", "3(5(12) 8) (2)", "2"],
          ["9, 1", "110", "1(9) (1), 3(…) (2)", "1"],
          ["7", "111", "7 (0), 1(9) (1), 3(5(12) 8) (2)", "0"],
          ["4", "1000", "1(3(5(12) 8) 4(7) 9) (3)", "3"],
        ],
      },
      {
        kind: "p",
        text: "Seven links for eight inserts — exactly the carries of counting from 0 to 8 in binary. In the second preset, extract-min removes 1 and its three subtrees (orders 2, 1, 0) simply rejoin the root list; extracting 3 next causes two links. In the third, decreasing 12 to 2 swaps it up past 5 and 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Keep each node's children as a linked list (newest first) and a degree count; the root list stays sorted by order.",
          "Keep a pointer to the minimum root to make peek O(1); it must be updated after extract and decrease.",
          "Decrease-key swaps keys with the parent; with handles to nodes, swap the stored items (and their handles) instead of moving nodes.",
          "Insert is O(1) amortised (like incrementing a binary counter), although a single insert can cause log n links.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Shape.** An order-k binomial tree has $2^k$ nodes, height k, and $\\binom{k}{d}$ nodes at depth d (hence the name); its root's children are trees of orders k − 1, …, 0. A heap of n keys has at most $\\lfloor \\log_2 n \\rfloor + 1$ trees, one per 1 bit of n, so union, extract-min and decrease-key all take $O(\\log n)$.",
      },
      {
        kind: "p",
        text: "**Amortised insert.** Inserting is incrementing a binary counter: the number of links equals the number of trailing 1 bits, which averages less than 1 over any sequence of inserts. The tests check that every tree is binomial, that root orders strictly increase and match the 1 bits of n, heap order, and the whole forest against an independent implementation of the same rules.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Vuillemin introduced binomial queues in 1978; Brown analysed them the same year.",
          "Fibonacci heaps relax binomial heaps by linking lazily and cutting on decrease-key, improving decrease-key to O(1) amortised.",
          "Brodal queues achieve the best worst-case bounds of all (O(1) insert, meld, decrease-key; O(log n) extract) but are complex.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Union, extract-min and decrease-key O(log n); insert O(1) amortised, O(log n) worst case.",
  },
  properties: [
    { label: "Trees", value: "One binomial tree per 1 bit of n" },
    { label: "Order-k tree", value: "$2^k$ nodes, height k" },
    { label: "Union", value: "Binary addition with carries" },
  ],
  implementations: [
    {
      language: "python",
      entry: "orders_after",
      code: `def link(a, b):
    """Trees as [key, children]; the larger root goes under the smaller."""
    if b[0] < a[0]:
        a, b = b, a
    a[1].insert(0, b)
    return a

def insert(roots, key):
    """roots[k] is the order-k tree or None: add like a binary counter."""
    carry, k = [key, []], 0
    while k < len(roots) and roots[k] is not None:
        carry = link(roots[k], carry)
        roots[k] = None
        k += 1
    if k == len(roots):
        roots.append(None)
    roots[k] = carry

def orders_after(keys):
    roots = []
    for key in keys:
        insert(roots, key)
    return [k for k, t in enumerate(roots) if t is not None]
`,
      tests: [
        { args: [[8, 3, 12, 5, 9, 1, 7]], expected: [0, 1, 2] },
        { args: [[8, 3, 12, 5, 9, 1, 7, 4]], expected: [3] },
        { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]], expected: [0, 2, 3] },
      ],
    },
    {
      language: "javascript",
      entry: "nodesAtDepth",
      code: `// Nodes at depth d in a binomial tree of order k: the binomial coefficient C(k, d).
function nodesAtDepth(k, d) {
  let c = 1;
  for (let i = 0; i < d; i++) c = (c * (k - i)) / (i + 1);
  return c;
}
`,
      tests: [
        { args: [3, 1], expected: 3 },
        { args: [4, 2], expected: 6 },
        { args: [5, 0], expected: 1 },
      ],
    },
  ],
  visualizer: "binomial-heap",
  practice: [
    {
      id: "binomial-trees",
      kind: "numeric",
      prompt: "A binomial heap holds 21 keys. How many trees does it have?",
      answer: 3,
      explanation: "21 = 10101₂ has three 1 bits: trees of orders 4, 2 and 0 (16 + 4 + 1).",
      hints: ["Write 21 in binary."],
      objective: "Shape and binary",
    },
    {
      id: "binomial-links",
      kind: "numeric",
      prompt: "A binomial heap holds 7 keys. How many links does inserting one more key cause?",
      answer: 3,
      explanation:
        "7 = 111₂; adding 1 carries three times: orders 0, 1 and 2 link up into one tree of order 3.",
      hints: ["Count the trailing 1 bits."],
      objective: "Insert as increment",
    },
  ],
  exam: {
    definition:
      "A binomial heap is a collection of heap-ordered binomial trees with distinct orders; an order-k tree has 2^k nodes and is formed by linking two order-(k − 1) trees.",
    steps: [
      "Link: larger root becomes a child of the smaller.",
      "Union: merge root lists by order; link equal orders (like carries).",
      "Insert: union with one node. Extract-min: remove the min root; union its children.",
      "Decrease-key: swap upwards while smaller than the parent.",
    ],
    timeComplexity: "$O(\\log n)$ for union, extract-min, decrease-key; insert $O(1)$ amortised.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Linking preserves heap order; distinct orders make the forest mirror n in binary, bounding trees and heights by $\\log_2 n$.",
    applications: [
      "Mergeable priority queues",
      "Teaching amortised analysis",
      "Basis for Fibonacci heaps",
    ],
    limitations: [
      "Decrease-key is O(log n), unlike Fibonacci heaps",
      "Pointer-heavy compared with array heaps",
    ],
    faq: [
      {
        q: "Why is it called binomial?",
        a: "An order-k tree has $\\binom{k}{d}$ nodes at depth d.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Forest of binomial trees, one per bit of n.", "Union like binary addition."],
      },
      {
        marks: 15,
        outline: [
          "Binomial tree definition and properties (4).",
          "Union with an example (5).",
          "Insert and extract-min via union (3).",
          "Complexity, including amortised insert (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Vuillemin, “A data structure for manipulating priority queues,” Communications of the ACM, 21(4), 1978.",
      supports: "Binomial queues.",
    },
    {
      citation:
        "M. R. Brown, “Implementation and analysis of binomial queue algorithms,” SIAM Journal on Computing, 7(3), 1978.",
      supports: "Analysis of binomial queue operations.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 2nd ed., MIT Press, 2001, Chapter 19.",
      supports: "Binomial heap union, extract-min and decrease-key as implemented here.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
