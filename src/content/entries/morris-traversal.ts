import type { AlgorithmEntry } from "../types";

export const morrisTraversalEntry: AlgorithmEntry = {
  slug: "morris-traversal",
  name: "Morris Traversal",
  aliases: ["Morris in-order traversal", "Threaded traversal", "Stackless in-order traversal"],
  curriculum: [152],
  domain: "trees",
  subcategory: "Binary trees & BSTs",
  difficulty: "intermediate",
  summary:
    "Visits a binary tree in order using O(1) extra memory — no stack, no recursion. It temporarily threads each node's in-order predecessor back to the node, follows the thread to return after the left subtree, and removes it, leaving the tree unchanged.",
  tags: ["tree traversal", "in-order", "threaded binary tree", "constant space"],
  prerequisites: ["Binary trees", "Tree traversals"],
  related: ["tree-traversals", "bst", "avl-tree"],
  problem: {
    input: "A binary tree of n nodes.",
    output:
      "Its nodes in in-order (left, node, right), using only a constant number of extra pointers.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A recursive in-order traversal remembers, on the call stack, where to return after finishing a left subtree. Morris's idea is to store that return address *in the tree itself*. The last node visited in a left subtree — the in-order predecessor — always has an empty right pointer. Point it back at the node before descending; when the walk arrives through that pointer, the node knows its left side is done. Then put the pointer back to empty.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "cur ← root. While cur is not empty:",
          "If cur has no left child: visit cur, then go right (along a real edge or a thread).",
          "Otherwise find pre, the rightmost node of cur's left subtree (stop if pre's right pointer already points at cur).",
          "If pre's right pointer is empty: make it a thread to cur, and go left.",
          "If it already points at cur: the left subtree is done — remove the thread, visit cur, go right.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): the tree with root 1, children 2 and 3, 2's children 4 and 5, and 3's right child 6.",
      },
      {
        kind: "table",
        head: ["cur", "action", "visited so far"],
        rows: [
          ["1", "predecessor 5: thread 5 → 1; go left", ""],
          ["2", "predecessor 4: thread 4 → 2; go left", ""],
          ["4", "no left child: visit; follow the thread to 2", "4"],
          ["2", "found the thread from 4: remove it; visit; go right", "4 2"],
          ["5", "no left child: visit; follow the thread to 1", "4 2 5"],
          ["1", "found the thread from 5: remove it; visit; go right", "4 2 5 1"],
          ["3", "no left child: visit; go right", "4 2 5 1 3"],
          ["6", "no left child: visit; go right (empty): done", "4 2 5 1 3 6"],
        ],
      },
      {
        kind: "p",
        text: "Two threads were made and removed — one for each node with a left child — and cur and pre moved 14 times in all for 6 nodes.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The traversal modifies the tree while it runs: it is not safe if another thread reads the tree concurrently, and stopping early (for example on an exception) leaves threads behind.",
          "**Preorder** works the same way: visit cur when creating the thread instead of when removing it.",
          "Postorder needs an extra trick (reversing right spines), so it is rarely done this way.",
          "Useful where memory is tight or recursion depth is a risk — for instance, checking whether a very deep tree is a valid BST, or finding its k-th smallest key, in $O(1)$ space.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Running time.** Each node with a left child gets exactly one thread, made on the first arrival and removed on the second. The search for the predecessor walks down the right spine of the left subtree, once to make the thread and once to remove it; different nodes' spines share no edges, so all these walks together take fewer than $2n$ steps. With at most $2n$ moves of cur, the total is under $4n$: $O(n)$ time, $O(1)$ extra space. The tests check that the thread count equals the number of nodes with a left child and that moves stay below $4n$.",
      },
      {
        kind: "p",
        text: "**Correctness.** When cur is reached for the first time, its predecessor's right pointer is empty (it is the last node of the left subtree in in-order); the second time, the walk has just finished that subtree and arrived through the thread. So each node is visited exactly once, after its left subtree and before its right subtree — in-order. Every thread is removed on the second arrival, so the tree ends as it began; the tests compare the output with the recursive traversal on random trees.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Joseph M. Morris published the method in 1979. It builds on **threaded binary trees** (Perlis and Thornton, 1960), where empty pointers permanently store in-order links.",
          "Knuth discusses threaded trees and traversal without a stack in The Art of Computer Programming, Volume 1.",
          "Pointer-reversal (Deutsch–Schorr–Waite) marking in garbage collectors uses a related trick: temporarily reusing pointers to avoid an explicit stack.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(1)",
    worstClass: "n",
    note: "Extra space beyond the tree is constant; the tree is modified temporarily.",
  },
  properties: [
    { label: "Extra memory", value: "Two pointers (cur and pre)" },
    { label: "Threads", value: "One per node with a left child, all removed" },
    { label: "Pointer moves", value: "Fewer than $4n$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "morris_inorder",
      code: `def morris_inorder(levels):
    """levels: level-order list with None for missing children."""
    nodes = [None if v is None else {"v": v, "l": None, "r": None} for v in levels]
    queue, k = [nodes[0]], 0
    for n in nodes[1:]:                      # build the tree
        parent = queue[k // 2]
        if n is not None:
            parent["l" if k % 2 == 0 else "r"] = n
            queue.append(n)
        k += 1
    out, cur = [], nodes[0]
    while cur:
        if cur["l"] is None:
            out.append(cur["v"])
            cur = cur["r"]
        else:
            pre = cur["l"]
            while pre["r"] is not None and pre["r"] is not cur:
                pre = pre["r"]
            if pre["r"] is None:
                pre["r"] = cur                # make the thread
                cur = cur["l"]
            else:
                pre["r"] = None               # remove it
                out.append(cur["v"])
                cur = cur["r"]
    return out
`,
      tests: [
        { args: [[1, 2, 3, 4, 5, null, 6]], expected: [4, 2, 5, 1, 3, 6] },
        { args: [[5, 4, null, 3, null, 2]], expected: [2, 3, 4, 5] },
      ],
    },
    {
      language: "javascript",
      entry: "kthSmallest",
      code: `// k-th smallest key of a BST (given as nested {v, l, r}) in O(1) extra space.
function kthSmallest(root, k) {
  let cur = root;
  let answer = null;
  while (cur) {
    if (!cur.l) {
      if (--k === 0 && answer === null) answer = cur.v;
      cur = cur.r;
    } else {
      let pre = cur.l;
      while (pre.r && pre.r !== cur) pre = pre.r;
      if (!pre.r) {
        pre.r = cur;
        cur = cur.l;
      } else {
        pre.r = null;
        if (--k === 0 && answer === null) answer = cur.v;
        cur = cur.r;
      }
    }
  }
  return answer; // the walk finishes so that every thread is removed
}
`,
      tests: [
        {
          args: [
            {
              v: 8,
              l: { v: 4, l: { v: 2, l: null, r: null }, r: { v: 6, l: null, r: null } },
              r: { v: 12, l: null, r: null },
            },
            3,
          ],
          expected: 6,
        },
        { args: [{ v: 1, l: null, r: { v: 2, l: null, r: null } }, 2], expected: 2 },
      ],
    },
  ],
  visualizer: "morris-traversal",
  practice: [
    {
      id: "morris-threads",
      kind: "numeric",
      prompt:
        "How many threads does Morris traversal create for a tree in which 5 of the 9 nodes have a left child?",
      answer: 5,
      explanation:
        "Exactly one thread per node with a left child: it is made on the first arrival and removed on the second.",
      hints: ["Which nodes need a way back?"],
      objective: "Threads",
    },
    {
      id: "morris-predecessor",
      kind: "mcq",
      prompt: "Why is the predecessor's right pointer always free to hold a thread?",
      options: [
        "The predecessor is the rightmost node of the left subtree, so it has no right child",
        "Morris traversal only works on trees with empty right pointers",
        "The right child is moved to the left first",
        "Threads are stored in a separate array",
      ],
      answer: 0,
      explanation:
        "The in-order predecessor of a node with a left child is the rightmost node of that left subtree, which by definition has no right child.",
      distractors: {
        1: "It works on any binary tree.",
        2: "No child is moved; only an empty pointer is borrowed.",
        3: "That would need $O(n)$ extra memory.",
      },
      hints: ["What is the in-order predecessor of a node with a left child?"],
      objective: "Why the threads fit",
    },
  ],
  exam: {
    definition:
      "Morris traversal is an in-order traversal of a binary tree in O(1) extra space that temporarily links each node's in-order predecessor back to it.",
    steps: [
      "No left child: visit, go right.",
      "Else find the predecessor; if its right is empty, thread it to cur and go left.",
      "If it already points to cur, remove the thread, visit, go right.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$ extra.",
    correctness:
      "A thread exists exactly while a node's left subtree is being traversed, so each node is visited once, in in-order, and the tree is restored.",
    applications: [
      "BST validation and k-th smallest in constant space",
      "Very deep trees where recursion would overflow",
    ],
    limitations: ["Temporarily modifies the tree (not thread-safe)", "Postorder is awkward"],
    faq: [
      {
        q: "Is the tree really unchanged afterwards?",
        a: "Yes, if the traversal runs to completion: every thread is removed when the walk returns through it. Stopping early leaves threads in place.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["In-order with temporary predecessor threads.", "$O(n)$ time, $O(1)$ space."],
      },
      {
        marks: 5,
        outline: ["Algorithm (2).", "Trace on a small tree (2).", "Complexity argument (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. M. Morris, “Traversing binary trees simply and cheaply,” Information Processing Letters, 9(5), 1979.",
      supports: "The stackless traversal with temporary threads.",
    },
    {
      citation:
        "A. J. Perlis, C. Thornton, “Symbol manipulation by threaded lists,” Communications of the ACM, 3(4), 1960.",
      supports: "Threaded binary trees.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 1: Fundamental Algorithms, 3rd ed., Addison-Wesley, 1997, Section 2.3.1.",
      supports: "Threaded trees and traversal.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
