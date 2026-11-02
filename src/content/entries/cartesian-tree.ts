import type { AlgorithmEntry } from "../types";

export const cartesianTreeEntry: AlgorithmEntry = {
  slug: "cartesian-tree",
  name: "Cartesian Tree",
  aliases: ["Treap (implicit)"],
  curriculum: [97],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "advanced",
  summary:
    "A binary tree derived from an array where each node holds an element, the tree is a min-heap by value and an in-order traversal recovers the original array order, built in O(n) using a stack.",
  tags: ["tree", "stack", "range minimum", "heap"],
  prerequisites: ["Binary Trees", "Stacks"],
  related: ["segment-tree", "sparse-table"],
  problem: {
    input: "An array of n comparable elements.",
    output:
      "A binary tree that is a min-heap by value and whose in-order traversal gives the array in its original order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A Cartesian tree encodes the structure of range minimum queries: the root is the minimum of the whole array, its left subtree is the Cartesian tree of elements to its left, and its right subtree of elements to its right. This recursive structure mirrors how RMQ splits.",
      },
      {
        kind: "p",
        text: "Building it in O(n) uses a stack: process elements left to right, popping stack elements that are larger than the current one (they become the left child), then push the current element.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize an empty stack.",
          "For each element a[i] from left to right:",
          "Pop all stack elements with value > a[i]; the last popped becomes a[i]'s left child.",
          "If the stack is non-empty, a[i] becomes the right child of the stack's top.",
          "Push a[i] onto the stack.",
          "The bottom of the stack is the root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: [3, 2, 6, 1, 9]. Stack trace:",
      },
      {
        kind: "table",
        head: ["Element", "Stack (bottom→top)", "Action"],
        rows: [
          ["3", "[3]", "Push 3"],
          ["2", "[2]", "Pop 3 (becomes left child of 2), push 2"],
          ["6", "[2, 6]", "Push 6 (right child of 2)"],
          ["1", "[1]", "Pop 6, pop 2 (2 becomes left child of 1), push 1"],
          ["9", "[1, 9]", "Push 9 (right child of 1)"],
        ],
      },
      {
        kind: "p",
        text: "Result: root=1, left subtree has root 2 with left child 3 and right child 6, right subtree has root 9.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each element is pushed and popped at most once → O(n) total.",
          "Store parent/left/right pointers or indices.",
          "The Cartesian tree is unique for a given array (assuming distinct elements).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Build time**: O(n) — each element enters and leaves the stack at most once.",
      },
      {
        kind: "p",
        text: "The Cartesian tree of an array is isomorphic to the tree of recursive RMQ splits, establishing a connection to the Sparse Table and Fischer–Heun RMQ structures.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Cartesian tree number (structure ignoring values) determines the RMQ answer for all queries, enabling O(n) / O(1) RMQ via block decomposition.",
          "Treaps are Cartesian trees where priorities are random, giving expected O(log n) depth.",
          "Cartesian tree sorting uses the tree to sort adaptively in O(n log n) worst case but faster on nearly-sorted inputs.",
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
    note: "Linear-time construction using a monotone stack.",
  },
  properties: [
    {
      label: "Heap property",
      value: "Min-heap by value",
    },
    {
      label: "In-order",
      value: "Recovers original array",
    },
    {
      label: "Unique",
      value: "Yes (for distinct elements)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "build_cartesian_tree",
      code: `def build_cartesian_tree(arr):
    """Build Cartesian tree, return root index. parent[i], left[i], right[i] are indices or -1."""
    n = len(arr)
    if n == 0:
        return -1
    parent = [-1] * n
    left = [-1] * n
    right = [-1] * n
    stack = []
    for i in range(n):
        last_popped = -1
        while stack and arr[stack[-1]] > arr[i]:
            last_popped = stack.pop()
        if last_popped != -1:
            left[i] = last_popped
            parent[last_popped] = i
        if stack:
            right[stack[-1]] = i
            parent[i] = stack[-1]
        stack.append(i)
    root = stack[0]
    return root
`,
      tests: [
        {
          args: [[3, 2, 6, 1, 9]],
          expected: 3,
        },
        {
          args: [[1, 2, 3]],
          expected: 0,
        },
        {
          args: [[5]],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ct-root",
      kind: "mcq",
      prompt: "What is the root of the Cartesian tree for [5, 3, 8, 1, 4]?",
      options: ["5 (index 0)", "3 (index 1)", "1 (index 3)", "4 (index 4)"],
      answer: 2,
      explanation: "The root is the minimum element, which is 1 at index 3.",
      hints: ["What property does the root satisfy in a min-heap?"],
      objective: "Identify Cartesian tree root",
    },
  ],
  exam: {
    definition:
      "A Cartesian tree is a binary tree built from an array satisfying min-heap order and in-order traversal order, constructible in O(n) with a stack.",
    steps: [
      "Process elements left to right",
      "Pop larger elements from stack (become left child)",
      "Current element becomes right child of stack top",
      "Push current element",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctness:
      "Each element is pushed and popped at most once. The heap and in-order properties follow from the construction: popped elements are larger and to the left.",
    applications: ["Range minimum query structures", "Treap basis", "Adaptive sorting"],
    limitations: ["Static structure (no efficient updates)"],
    faq: [
      {
        q: "Why is it unique?",
        a: "The root must be the minimum (heap), and left/right subtrees are determined by position relative to the minimum.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Stack-based O(n) construction with heap + in-order properties (2)"],
      },
    ],
  },
  references: [
    {
      citation: "J. Vuillemin, 'A Unifying Look at Data Structures,' CACM, 23(4):229-239, 1980.",
      supports: "Introduced Cartesian trees.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
