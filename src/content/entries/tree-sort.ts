import type { AlgorithmEntry } from "../types";

export const treeSortEntry: AlgorithmEntry = {
  slug: "tree-sort",
  name: "Tree Sort",
  aliases: ["BST sort"],
  curriculum: [46],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "beginner",
  summary:
    "Insert every value into a binary search tree, then read it back with an in-order traversal. O(n log n) on random input, but O(n²) on sorted input, where the tree becomes a path — unless the tree is balanced.",
  tags: ["sorting", "binary search tree", "in-order traversal", "stable"],
  prerequisites: ["BST insert", "Tree traversals"],
  related: ["bst", "tree-traversals", "avl-tree", "quick-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A binary search tree keeps everything smaller on the left and larger on the right, so reading it left to right gives sorted order. Sorting is then just “build the tree, read the tree”.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Insert each value: compare down from the root, going left if smaller and right otherwise (equal values go right, which keeps the sort stable).",
          "Traverse in order: left subtree, node, right subtree, writing each value to the output.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [50, 30, 70, 20, 40, 60, 80, 35, 65, 30] builds a tree of height 4 with 20 comparisons; the second 30 goes right of the first. Sorted input [1, …, 8] instead builds a path and needs 28 comparisons — n(n − 1)/2.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "With a self-balancing tree (AVL, red-black) the worst case becomes O(n log n).",
          "Tree sort with random insertion order makes exactly the same comparisons as quicksort with the same pivots (in a different order).",
          "It needs O(n) extra nodes, unlike in-place sorts.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Inserting into a tree of height h costs O(h). For a random insertion order the expected depth is O(log n) — about 2 ln n comparisons per insertion, the same as quicksort's average — giving O(n log n). Sorted input gives height n and n(n − 1)/2 comparisons. The traversal is O(n). The tests check the output and the quadratic count on sorted input.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "CLRS Exercise 12.3-3 asks for tree sort's best and worst cases.",
          "Using a balanced tree gives an O(n log n) online sort that can output the current order at any time.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Stable",
      value: "Yes (equal keys go right)",
    },
    {
      label: "Worst case",
      value: "Sorted input: a path",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "tree_sort",
      code: `def tree_sort(a):
    root = None                       # nodes: [key, left, right]
    for x in a:
        if root is None:
            root = [x, None, None]; continue
        node = root
        while True:
            side = 1 if x < node[0] else 2
            if node[side] is None:
                node[side] = [x, None, None]; break
            node = node[side]
    out = []
    def walk(n):
        if n:
            walk(n[1]); out.append(n[0]); walk(n[2])
    walk(root)
    return out
`,
      tests: [
        {
          args: [[50, 30, 70, 20, 40, 60, 80, 35, 65, 30]],
          expected: [20, 30, 30, 35, 40, 50, 60, 65, 70, 80],
        },
      ],
    },
    {
      language: "javascript",
      entry: "pathComparisons",
      code: `// Comparisons when inserting n keys in sorted order: every insert walks the whole path.
function pathComparisons(n) {
  return (n * (n - 1)) / 2;
}
`,
      tests: [
        {
          args: [8],
          expected: 28,
        },
      ],
    },
  ],
  visualizer: "tree-sort",
  practice: [
    {
      id: "tree-worst",
      kind: "mcq",
      prompt: "Which input makes (unbalanced) tree sort quadratic?",
      options: [
        "Already sorted input",
        "Random input",
        "Input with all distinct values",
        "An even number of values",
      ],
      answer: 0,
      explanation: "Each new key goes to the right of the previous one: the tree is a path.",
      distractors: {
        "1": "Random input gives logarithmic expected depth.",
        "2": "Distinctness does not matter.",
        "3": "Parity does not matter.",
      },
      hints: ["What shape does the tree take?"],
      objective: "Worst case",
    },
    {
      id: "tree-trav",
      kind: "mcq",
      prompt: "Which traversal reads a BST in sorted order?",
      options: ["In-order", "Pre-order", "Post-order", "Level-order"],
      answer: 0,
      explanation: "Left subtree, node, right subtree visits keys in increasing order.",
      distractors: {
        "1": "Pre-order visits the root first.",
        "2": "Post-order visits the root last.",
        "3": "Level-order goes by depth.",
      },
      hints: ["Left, node, right."],
      objective: "Traversal",
    },
  ],
  exam: {
    definition:
      "Tree sort inserts all values into a binary search tree and outputs an in-order traversal.",
    steps: ["Insert each value.", "In-order traversal."],
    timeComplexity: "O(n log n) average; O(n²) worst (unbalanced).",
    spaceComplexity: "$O(n)$.",
    correctness: "BST order makes the in-order traversal sorted.",
    applications: ["Online sorting with balanced trees", "Teaching BSTs"],
    limitations: ["Extra space", "Quadratic worst case unless balanced"],
    faq: [
      {
        q: "How is it related to quicksort?",
        a: "The root acts as the first pivot, each subtree root as a sub-pivot: the same comparisons in a different order.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Build and traverse (2).", "Complexity cases (2).", "Balancing (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Chapter 12 and Exercise 12.3-3.",
      supports: "Binary search trees and tree sort's cases.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
