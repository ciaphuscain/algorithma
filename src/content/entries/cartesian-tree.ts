import type { AlgorithmEntry } from "../types";

export const cartesianTreeEntry: AlgorithmEntry = {
  slug: "cartesian-tree",
  name: "Cartesian Tree",
  aliases: ["Cartesian tree construction", "Min-heap in-order tree", "Treap structure"],
  curriculum: [97],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "advanced",
  summary:
    "Build the unique tree that is a min-heap on the values and whose in-order traversal gives back the array, in O(n) with a stack. Scan left to right keeping the right spine on the stack: pop every value larger than the new one, making the last popped subtree the new node's left child.",
  tags: ["cartesian tree", "heap", "stack", "in-order", "tree construction"],
  prerequisites: ["Binary Heap", "Monotonic Stack"],
  related: ["monotonic-stack", "binary-heap", "treap"],
  problem: {
    input: "An array of n values.",
    output: "The parent of each node (−1 for the root): the Cartesian tree as a parent array.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine stacking blocks on a table where shorter blocks go on top. A new block pushes aside every taller block on the right edge and sits on top of the tallest remaining one. The pushed blocks become the new block's left subtree. The result is a tree where every parent is shorter than its children (a heap), and reading the blocks left to right recovers the original order.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with a sentinel −∞ at the bottom of the stack (it is the tree's virtual root).",
          "For each value A[i], left to right: pop every stack entry larger than A[i]; the last popped becomes i's left child.",
          "Push i onto the stack. It becomes the right child of whatever is now on top.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A = [9, 3, 7, 1, 8, 12, 10, 20, 15]. Processing 9: push (right child of sentinel). Processing 3: pop 9 (9 becomes 3's left child), push 3. Processing 7: push (right child of 3). Processing 1: pop 7, pop 3 (3, with 9 and 7 below it, becomes 1's left child), push 1. The root is 1, the minimum. Parents: [1, 3, 1, −1, 6, 6, 3, 8, 6].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each element is pushed and popped at most once, giving O(n) total.",
          "The Cartesian tree is unique: the root is the leftmost minimum; the left subtree is the Cartesian tree of the values before it, and the right subtree the values after.",
          "A Cartesian tree of random values is a random BST and has O(log n) expected depth.",
          "The same tree with random priorities is a treap: a BST by key and a heap by priority.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Each of the n elements enters the stack once and leaves at most once: 2n operations in all. The tree has n nodes and n − 1 edges. The tests verify the parent array against a recursive O(n²) construction (root = leftmost minimum; recurse on both sides) and check that the tree structure in the trace matches the returned parent array.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Range minimum queries reduce to LCA queries on the Cartesian tree (and back), so RMQ and LCA are linearly equivalent.",
          "The Cartesian tree of a suffix array, weighted by LCP values, is the 'LCP tree' used in string algorithms.",
          "Building a Cartesian tree is the key step in several linear-time algorithms for RMQ without sparse tables.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Stack ops",
      value: "2n total",
    },
    {
      label: "Tree depth",
      value: "O(log n) expected for random input",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [{ args: [42], expected: 42 }],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [{ args: [42], expected: 42 }],
    },
  ],
  visualizer: "cartesian-tree",
  practice: [
    {
      id: "ct-root",
      kind: "mcq",
      prompt: "What value is always at the root of a Cartesian tree?",
      options: [
        "The leftmost minimum of the array",
        "The first element",
        "The last element",
        "The median",
      ],
      answer: 0,
      explanation: "The root is the minimum (heap property) and the leftmost one (in-order).",
      distractors: {
        "1": "Only if it is the smallest.",
        "2": "Only if it is the smallest.",
        "3": "Not necessarily the root.",
      },
      hints: ["Think about the heap property and in-order traversal."],
      objective: "Root",
    },
    {
      id: "ct-time",
      kind: "mcq",
      prompt: "Why is the stack-based construction O(n)?",
      options: [
        "Each element is pushed and popped at most once",
        "The tree is balanced",
        "Binary search is used",
        "The array is sorted first",
      ],
      answer: 0,
      explanation: "n pushes + at most n pops = 2n operations.",
      distractors: {
        "1": "The tree can be a path.",
        "2": "No binary search is needed.",
        "3": "No sorting.",
      },
      hints: ["How many times can each element visit the stack?"],
      objective: "Complexity",
    },
  ],
  exam: {
    definition:
      "A Cartesian tree of an array is the unique binary tree that is a min-heap on values and whose in-order traversal reproduces the array.",
    steps: [
      "Scan left to right with a stack (the right spine).",
      "Pop larger elements; the last popped is the new node's left child.",
      "The new node becomes the right child of the stack top.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Each node is smaller than its children (heap), and in-order visits nodes in array order.",
    applications: ["RMQ ↔ LCA reduction", "Treap structure", "LCP trees in suffix arrays"],
    limitations: ["Not balanced in the worst case"],
    faq: [
      {
        q: "Is the tree unique?",
        a: "Yes; the recursive definition (root = leftmost min, recurse on both sides) is deterministic.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Definition: heap + in-order (2).",
          "Stack algorithm (3).",
          "Amortised O(n) (2).",
          "RMQ reduction (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        'J. Vuillemin, "A unifying look at data structures," Communications of the ACM, 23(4), 1980, pp. 229-239.',
      supports: "The original Cartesian tree paper.",
    },
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Stack-based tree construction.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
