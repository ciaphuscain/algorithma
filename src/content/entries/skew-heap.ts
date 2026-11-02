import type { AlgorithmEntry } from "../types";

export const skewHeapEntry: AlgorithmEntry = {
  slug: "skew-heap",
  name: "Skew Heap",
  aliases: ["Self-adjusting heap"],
  curriculum: [131],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "intermediate",
  summary:
    "A leftist heap without the bookkeeping: merge along the right spines exactly as a leftist heap does, but swap the children of every node on the path, unconditionally. No ranks are stored, a single merge can take O(n), yet any sequence of operations costs O(log n) amortised each.",
  tags: ["heap", "priority queue", "mergeable heap", "self-adjusting", "amortized analysis"],
  prerequisites: ["Leftist heaps", "Amortised analysis"],
  related: ["leftist-heap", "binary-heap", "splay-tree"],
  problem: {
    input: "A sequence of insert x, extract (remove the minimum) and peek operations.",
    output: "What each operation returns, with O(log n) amortised time per operation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A leftist heap stores ranks only to decide whether to swap a node's children after a merge. Sleator and Tarjan asked: what if we always swap? The merge path is the right spine, so swapping every node on it moves that freshly lengthened path to the left, out of the way of the next merge. Like a splay tree, the structure may become badly shaped for a moment, but each expensive merge flattens the long path it walked, so expensive merges cannot repeat.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**merge(a, b):** if either is empty, return the other. Make a the heap with the smaller root. Merge a's right subtree with b into a's right slot, then **swap a's two children**.",
          "**insert x:** merge with a one-node heap. **extract:** remove the root and merge its two subtrees. **peek:** the root.",
          "In the visualizer, the merge walks down the right spines (swapping the smaller root into the spine), then swaps the children of every node on the path on the way back up.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, the same operations as the leftist heap lesson): insert 5, 9, 2, 7, 1, 8, 3, then extract twice and peek.",
      },
      {
        kind: "table",
        head: [
          "operation",
          "merge path (children swapped at each)",
          "heap afterwards (left, right)",
        ],
        rows: [
          ["insert 5, 9", "5", "5(9, ·)"],
          ["insert 2", "2 (2 < 5 becomes the top)", "2(5(9, ·), ·)"],
          ["insert 7", "2", "2(7, 5(9, ·))"],
          ["insert 1", "1", "1(2(7, 5(9)), ·)"],
          ["insert 8", "1", "1(8, 2(7, 5(9)))"],
          ["insert 3", "1, 2, 3 (3 < 5 enters 2's spine)", "1(2(3(5(9), ·), 7), 8)"],
          ["extract → 1", "2, 7 (8 hangs below 7)", "2(7(8, ·), 3(5(9), ·))"],
          ["extract → 2", "3 (7 hangs below 3)", "3(7(8), 5(9))"],
        ],
      },
      {
        kind: "p",
        text: "Peek returns 3. The merges visited 11 nodes in all — the same as the leftist heap on this input — but the final shapes differ: the skew heap's root 3 has both 7(8) and 5(9) as children, while the leftist heap ends as 3(5(9, 7), 8).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The recursive merge is four lines; with no ranks, nodes are just a key and two pointers.",
          "Deep recursion is possible on bad inputs (a single merge can walk O(n) nodes), so production code uses the iterative top-down version.",
          "Skew heaps are a good default when a simple mergeable priority queue is needed and occasional slow operations are acceptable.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Amortised analysis.** Call a node *heavy* if its right subtree has more than half of its descendants, otherwise *light*; let the potential $\\Phi$ be the number of heavy nodes. A right spine contains at most $\\log_2 n$ light nodes (each light step halves the size). On a merge path, every heavy node becomes light after its children are swapped (paying for itself by lowering $\\Phi$), and only the light nodes — $O(\\log n)$ of them — can turn heavy. So a merge costs $O(\\log n)$ amortised; a sequence of $m$ operations costs $O(m \\log n)$.",
      },
      {
        kind: "p",
        text: "**Worst case.** A single merge may still walk $\\Theta(n)$ nodes (inserting an increasing sequence builds a long right spine before an extract walks it). The tests compare every run with an independent recursive implementation and check heap order and that draining returns the keys sorted.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Sleator and Tarjan introduced skew heaps in 1986 alongside the splay tree, as examples of self-adjusting structures.",
          "Tighter analyses give amortised costs of about $\\log_\\varphi n$ comparisons per merge.",
          "Pairing heaps, another self-adjusting heap in this curriculum, extend the idea to decrease-key.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n) amortised", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "A single merge can cost O(n); any m operations cost O(m log n).",
  },
  properties: [
    { label: "Per-node data", value: "Key and two pointers only" },
    { label: "Merge", value: "Swap children of every node on the merge path" },
    { label: "Cost", value: "$O(\\log n)$ amortised per operation" },
  ],
  implementations: [
    {
      language: "python",
      entry: "drain",
      code: `def merge(a, b):
    """Heaps as [key, left, right] lists or None."""
    if a is None: return b
    if b is None: return a
    if b[0] < a[0]:
        a, b = b, a
    a[1], a[2] = merge(a[2], b), a[1]     # merge on the right, then swap sides
    return a

def drain(keys):
    h = None
    for k in keys:
        h = merge(h, [k, None, None])
    out = []
    while h:
        out.append(h[0])
        h = merge(h[1], h[2])
    return out
`,
      tests: [
        { args: [[5, 9, 2, 7, 1, 8, 3]], expected: [1, 2, 3, 5, 7, 8, 9] },
        { args: [[3, 3, 0]], expected: [0, 3, 3] },
      ],
    },
    {
      language: "javascript",
      entry: "rootAfter",
      code: `// Root key after inserting keys into a skew heap and extracting k times.
function rootAfter(keys, k) {
  const merge = (a, b) => {
    if (!a) return b;
    if (!b) return a;
    if (b.key < a.key) [a, b] = [b, a];
    [a.left, a.right] = [merge(a.right, b), a.left];
    return a;
  };
  let h = null;
  for (const key of keys) h = merge(h, { key, left: null, right: null });
  for (let i = 0; i < k && h; i++) h = merge(h.left, h.right);
  return h ? h.key : null;
}
`,
      tests: [
        { args: [[5, 9, 2, 7, 1, 8, 3], 2], expected: 3 },
        { args: [[4], 1], expected: null },
      ],
    },
  ],
  visualizer: "skew-heap",
  practice: [
    {
      id: "skew-swap",
      kind: "mcq",
      prompt: "How does a skew heap decide whether to swap a node's children after a merge?",
      options: [
        "It always swaps the children of every node on the merge path",
        "It compares the ranks of the two children",
        "It swaps only when the right child is larger",
        "It never swaps; it rotates instead",
      ],
      answer: 0,
      explanation:
        "Skew heaps store no ranks; the unconditional swap is what makes the amortised analysis work.",
      distractors: {
        1: "That is the leftist heap's rule.",
        2: "Heap order is kept by the merge itself, not by swaps.",
        3: "Heaps swap children; rotations belong to search trees.",
      },
      hints: ["What extra data does a skew heap store per node?"],
      objective: "Skew merge",
    },
    {
      id: "skew-root",
      kind: "numeric",
      prompt:
        "Insert 5, 9, 2, 7, 1, 8, 3 into a skew heap, then extract twice. What is the root now?",
      answer: 3,
      explanation: "The two extracts remove 1 and 2; the minimum, 3, is at the root.",
      hints: ["The root of a heap is always its minimum."],
      objective: "Heap order",
    },
  ],
  exam: {
    definition:
      "A skew heap is a self-adjusting heap-ordered binary tree that merges along right spines and swaps the children of every node on the merge path.",
    steps: [
      "merge(a, b): smaller root on top; merge its right subtree with the other heap; swap its children.",
      "insert = merge with one node; extract = merge the root's subtrees.",
    ],
    timeComplexity: "$O(\\log n)$ amortised per operation; $O(n)$ worst case for one.",
    spaceComplexity: "$O(n)$, no balance data.",
    correctness:
      "Heap order holds because the smaller root is always on top; the heavy/light potential bounds the amortised cost.",
    applications: ["Simple mergeable priority queues", "Teaching amortised analysis"],
    limitations: ["Occasional O(n) operations", "Recursion depth can be large"],
    faq: [
      {
        q: "Skew heap or leftist heap?",
        a: "Leftist heaps guarantee O(log n) per operation; skew heaps are simpler and usually as fast in practice, but only amortised.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Merge on the right, always swap.", "O(log n) amortised."] },
      {
        marks: 10,
        outline: [
          "Merge algorithm (3).",
          "Worked example (3).",
          "Heavy/light potential argument (4).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. D. Sleator, R. E. Tarjan, “Self-adjusting heaps,” SIAM Journal on Computing, 15(1), 1986.",
      supports: "Skew heaps and their amortised analysis.",
    },
    {
      citation:
        "M. A. Weiss, Data Structures and Algorithm Analysis in C++, 4th ed., Pearson, 2014, Chapter 6.",
      supports: "Skew heaps alongside leftist and binomial queues.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
