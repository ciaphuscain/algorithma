import type { AlgorithmEntry } from "../types";

export const treeTraversalsEntry: AlgorithmEntry = {
  slug: "tree-traversals",
  name: "Binary Tree Traversals",
  aliases: ["Preorder, inorder, postorder, level order", "Tree walks"],
  curriculum: [151],
  domain: "trees",
  subcategory: "Binary trees & BSTs",
  difficulty: "beginner",
  summary:
    "Four systematic ways to visit every node of a binary tree: three depth-first orders that differ only in when the node is visited, and breadth-first level order.",
  tags: ["tree", "binary tree", "traversal", "recursion", "queue", "dfs", "bfs"],
  prerequisites: ["Recursion", "Binary trees"],
  related: ["bst", "dfs", "bfs"],
  problem: {
    input: "A binary tree.",
    output: "Its nodes listed in preorder, inorder, postorder and level order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Every depth-first traversal walks around the tree the same way — down the left side, back up, down the right. They differ only in *when* you write a node down: before its subtrees (pre), between them (in), or after both (post). Level order instead reads the tree like a page, row by row.",
      },
    ],
    mechanics: [
      {
        kind: "table",
        head: ["Order", "Rule", "Tree 1(2(4, 5), 3(·, 6))"],
        rows: [
          ["Preorder", "node, left, right", "1 2 4 5 3 6"],
          ["Inorder", "left, node, right", "4 2 5 1 3 6"],
          ["Postorder", "left, right, node", "4 5 2 6 3 1"],
          ["Level order", "row by row, left to right", "1 2 3 4 5 6"],
        ],
      },
      {
        kind: "p",
        text: "The visualizer shows the recursion's call stack for the three depth-first orders and the queue for level order, filling one output array per traversal.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Recursive versions are three lines each; iterative versions replace recursion by an explicit stack (and a queue for level order).",
          "**Preorder** copies or serialises a tree; **postorder** deletes it or evaluates expression trees (children before the operator); **inorder** lists a BST in sorted order.",
          "Deep, unbalanced trees can overflow the call stack: use the iterative forms.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each traversal visits every node exactly once and follows each edge twice (down and up), so it runs in $\\Theta(n)$ time. The depth-first versions use $O(h)$ stack space for height $h$; level order uses $O(w)$ queue space for maximum width $w$, which can be about $n/2$ in a complete tree.",
      },
      {
        kind: "p",
        text: "**Reconstruction.** With distinct keys, preorder plus inorder (or postorder plus inorder) determines the tree uniquely: the first preorder key is the root, and its position in the inorder sequence splits the left and right subtrees. Preorder plus postorder alone does not: a single child could be on either side.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Morris traversal** does inorder in $O(1)$ extra space by temporarily threading right pointers back to ancestors.",
          "**Euler tour** records a node each time the walk passes it; it underlies lowest-common-ancestor and subtree-query techniques.",
          "Level order is BFS on a tree; the three depth-first orders are DFS with different visit times.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n)", average: "\\Theta(n)", worst: "\\Theta(n)" },
    space: "O(h) \\text{ or } O(w)",
    worstClass: "n",
    note: "$h$ = height (depth-first), $w$ = maximum width (level order).",
  },
  properties: [
    { label: "Visits each node", value: "Exactly once" },
    { label: "Inorder of a BST", value: "Sorted" },
  ],
  implementations: [
    {
      language: "python",
      entry: "traversals",
      code: `from collections import deque


def traversals(level):
    """Build a tree from a level-order list (None = missing) and return
    (preorder, inorder, postorder, levelorder)."""
    nodes = {}
    root = 0
    nodes[0] = [level[0], None, None]
    queue, i, next_id = deque([0]), 1, 1
    while queue and i < len(level):
        parent = queue.popleft()
        for side in (1, 2):
            if i < len(level) and level[i] is not None:
                nodes[next_id] = [level[i], None, None]
                nodes[parent][side] = next_id
                queue.append(next_id)
                next_id += 1
            i += 1
    pre, ino, post = [], [], []

    def walk(v):
        if v is None:
            return
        key, left, right = nodes[v]
        pre.append(key)
        walk(left)
        ino.append(key)
        walk(right)
        post.append(key)

    walk(root)
    lvl, q = [], deque([root])
    while q:
        v = q.popleft()
        lvl.append(nodes[v][0])
        q.extend(c for c in nodes[v][1:] if c is not None)
    return [pre, ino, post, lvl]
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, null, 6]],
          expected: [
            [1, 2, 4, 5, 3, 6],
            [4, 2, 5, 1, 3, 6],
            [4, 5, 2, 6, 3, 1],
            [1, 2, 3, 4, 5, 6],
          ],
        },
        { args: [[7]], expected: [[7], [7], [7], [7]] },
      ],
    },
    {
      language: "javascript",
      entry: "inorderIterative",
      code: `// Inorder with an explicit stack. Nodes: { key, left, right }.
function inorderIterative(root) {
  const out = [];
  const stack = [];
  let v = root;
  while (v !== null || stack.length > 0) {
    while (v !== null) {
      stack.push(v);
      v = v.left;
    }
    v = stack.pop();
    out.push(v.key);
    v = v.right;
  }
  return out;
}
`,
      tests: [
        {
          args: [
            {
              key: 1,
              left: { key: 2, left: null, right: null },
              right: { key: 3, left: null, right: null },
            },
          ],
          expected: [2, 1, 3],
        },
      ],
    },
  ],
  visualizer: "tree-traversals",
  practice: [
    {
      id: "trav-post",
      kind: "mcq",
      prompt: "For the tree 1(2(4, 5), 3(·, 6)), what is the postorder traversal?",
      options: ["4 5 2 6 3 1", "1 2 4 5 3 6", "4 2 5 1 3 6", "4 5 6 2 3 1"],
      answer: 0,
      explanation: "Left subtree (4 5 2), right subtree (6 3), then the root 1.",
      distractors: {
        1: "That is preorder.",
        2: "That is inorder.",
        3: "Postorder finishes the whole left subtree, including 2, before starting the right.",
      },
      hints: ["Children before parent, left before right."],
      objective: "Compute a traversal",
    },
    {
      id: "trav-rebuild",
      kind: "mcq",
      prompt: "Which pair of traversals always determines a binary tree with distinct keys?",
      options: [
        "Preorder and inorder",
        "Preorder and postorder",
        "Postorder and level order",
        "Any single traversal",
      ],
      answer: 0,
      explanation:
        "Preorder gives the root; inorder tells which keys are left and right of it. Recursing rebuilds the tree.",
      distractors: {
        1: "A node with one child could have it on the left or right.",
        2: "Without inorder, left/right placement can be ambiguous.",
        3: "Many trees share any one traversal.",
      },
      hints: ["Which traversal separates left from right?"],
      objective: "Reason about reconstruction",
    },
  ],
  exam: {
    definition:
      "A tree traversal visits every node exactly once in a fixed order: preorder (node, left, right), inorder (left, node, right), postorder (left, right, node) or level order (breadth-first).",
    steps: [
      "preorder(v): visit v; preorder(left); preorder(right).",
      "inorder(v): inorder(left); visit v; inorder(right).",
      "postorder(v): postorder(left); postorder(right); visit v.",
      "levelorder: enqueue root; repeatedly dequeue, visit, enqueue children.",
    ],
    timeComplexity: "$\\Theta(n)$ for each traversal.",
    spaceComplexity: "$O(h)$ recursion stack for depth-first; $O(w)$ queue for level order.",
    correctness:
      "Each node is visited once because each recursive call handles exactly its own subtree.",
    applications: [
      "Expression trees (prefix, infix, postfix notation)",
      "Copying and deleting trees",
      "Sorted output of BSTs",
      "Serialisation",
    ],
    limitations: ["Recursion depth on degenerate trees"],
    faq: [{ q: "Which traversal gives sorted output from a BST?", a: "Inorder." }],
    answers: [
      { marks: 2, outline: ["Define the three depth-first orders.", "Each is $\\Theta(n)$."] },
      {
        marks: 5,
        outline: [
          "Definitions (2).",
          "Recursive algorithms (1).",
          "All traversals of a 6–7 node example (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 1: Fundamental Algorithms, 3rd ed., Addison-Wesley, 1997, §2.3.1.",
      supports: "Traversing binary trees; the three orders and stack-based traversal.",
    },
    {
      citation:
        "J. M. Morris, “Traversing binary trees simply and cheaply,” Information Processing Letters, 9(5), 1979.",
      supports: "Constant-space inorder traversal.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
