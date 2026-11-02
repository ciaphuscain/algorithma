import type { AlgorithmEntry } from "../types";

export const pairingHeapEntry: AlgorithmEntry = {
  slug: "pairing-heap",
  name: "Pairing Heap",
  aliases: ["Self-adjusting multiway heap"],
  curriculum: [129],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "intermediate",
  summary:
    "A single heap-ordered tree with any number of children per node, built from one primitive — meld: the larger root becomes the first child of the smaller. Insert and decrease-key are melds; extract-min melds the root's children back together in two passes. Very simple, and among the fastest heaps in practice.",
  tags: ["heap", "priority queue", "mergeable heap", "self-adjusting", "amortized analysis"],
  prerequisites: ["Binary heaps", "Trees"],
  related: ["fibonacci-heap", "binomial-heap", "skew-heap"],
  problem: {
    input:
      "A sequence of insert, extract (remove the minimum), peek and decrease-key operations on distinct keys.",
    output: "What each operation returns; extract-min costs O(log n) amortised.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Keep the minimum at the root and do as little as possible otherwise. Inserting a key or merging two heaps is one comparison: the loser's tree is hung under the winner's root. That makes the root accumulate many children, so the real work happens when the root is removed: its children must be combined into one tree again. Melding them one after another would build a long chain; the trick is to meld them in pairs first and then combine the pairs — which keeps the tree bushy enough for later operations.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**meld(a, b):** the root with the larger key becomes the first (leftmost) child of the other.",
          "**insert x:** meld the heap with the one-node heap x.",
          "**extract-min:** remove the root. Pass 1: meld its children in pairs, left to right. Pass 2: meld the resulting heaps from right to left into one.",
          "**decrease-key:** lower the key; unless it is the root, cut its subtree off and meld it with the root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 5, 8, 3, 9, 7, 6, 4, 2, then extract-min twice.",
      },
      {
        kind: "table",
        head: ["step", "what happens", "heap afterwards"],
        rows: [
          [
            "8 inserts",
            "each is one meld; 3 collects 9, 7, 6, 4 as children; then 2 wins",
            "2(3(4 6 7 9 5(8)))",
          ],
          ["extract → 2", "the only child, 3, becomes the heap", "3(4 6 7 9 5(8))"],
          [
            "extract → 3",
            "five subtrees: pass 1 melds (4, 6) and (7, 9), 5(8) is left alone",
            "4(6), 7(9), 5(8)",
          ],
          [
            "",
            "pass 2, right to left: meld 7(9) with 5(8), then 4(6) with the result",
            "4(5(7(9) 8) 6)",
          ],
        ],
      },
      {
        kind: "p",
        text: "Eleven melds in all, one comparison each. In the second preset, decreasing 9 to 1 cuts its subtree loose and melds it with the root, so 1 becomes the new root at once.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store each node with a first-child pointer and a next-sibling pointer (plus a previous pointer for decrease-key); no ranks or degrees are needed.",
          "The two-pass combination is essential: melding the children left to right in one pass can cost Θ(n) per extract on some sequences.",
          "Experimental studies (for example by Stasko and Vitter, and by Larkin, Sen and Tarjan) found pairing heaps among the fastest heaps for workloads with decrease-key, such as Dijkstra's algorithm.",
          "Several libraries ship pairing heaps, for example Boost.Heap's `pairing_heap`.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Known bounds.** Insert, meld and peek are O(1). Extract-min is $O(\\log n)$ amortised (Fredman, Sedgewick, Sleator and Tarjan, 1986). Decrease-key was conjectured O(1) amortised like Fibonacci heaps, but Fredman (1999) proved a lower bound of $\\Omega(\\log \\log n)$ for it; Pettie (2005) showed $O(2^{2\\sqrt{\\log \\log n}})$ amortised. Pairing heaps are therefore slightly weaker than Fibonacci heaps in theory while usually faster in practice.",
      },
      {
        kind: "p",
        text: "**Correctness.** Every meld puts the smaller root on top, so heap order always holds and the root is the minimum. After extract-min, the two passes leave exactly one tree. The tests compare every run with an independent implementation, check heap order and that one tree remains, and replay random sequences of inserts, extracts and decrease-keys.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Variants differ in how the children are combined after extract-min (multipass, auxiliary twopass); the two-pass rule shown here is the standard one.",
          "Rank-pairing heaps add ranks to pairing heaps and recover Fibonacci-heap bounds while staying simple.",
          "Like splay trees and skew heaps, pairing heaps are self-adjusting: no balance information is stored.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n) amortised", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Insert, meld, peek O(1); extract-min O(log n) amortised; decrease-key o(log n) amortised but not O(1).",
  },
  properties: [
    { label: "Primitive", value: "meld: larger root becomes the first child of the smaller" },
    { label: "Extract-min", value: "Two passes: pair left to right, combine right to left" },
    { label: "Per-node data", value: "No ranks or degrees" },
  ],
  implementations: [
    {
      language: "python",
      entry: "drain",
      code: `def meld(a, b):
    """Heaps as [key, children] or None."""
    if a is None: return b
    if b is None: return a
    if b[0] < a[0]:
        a, b = b, a
    a[1].insert(0, b)
    return a

def two_pass(children):
    pairs = [meld(children[i], children[i + 1] if i + 1 < len(children) else None)
             for i in range(0, len(children), 2)]
    h = None
    for p in reversed(pairs):
        h = meld(p, h)
    return h

def drain(keys):
    h = None
    for k in keys:
        h = meld(h, [k, []])
    out = []
    while h:
        out.append(h[0])
        h = two_pass(h[1])
    return out
`,
      tests: [
        { args: [[5, 8, 3, 9, 7, 6, 4, 2]], expected: [2, 3, 4, 5, 6, 7, 8, 9] },
        { args: [[1]], expected: [1] },
      ],
    },
    {
      language: "javascript",
      entry: "afterTwoExtracts",
      code: `// Root key and number of root children after inserting keys and extracting twice.
function afterTwoExtracts(keys) {
  const meld = (a, b) => {
    if (!a) return b;
    if (!b) return a;
    if (b.key < a.key) [a, b] = [b, a];
    a.kids.unshift(b);
    return a;
  };
  const twoPass = (kids) => {
    const pairs = [];
    for (let i = 0; i < kids.length; i += 2) pairs.push(meld(kids[i], kids[i + 1] ?? null));
    let h = null;
    for (let i = pairs.length - 1; i >= 0; i--) h = meld(pairs[i], h);
    return h;
  };
  let h = null;
  for (const key of keys) h = meld(h, { key, kids: [] });
  for (let i = 0; i < 2 && h; i++) h = twoPass(h.kids);
  return h ? [h.key, h.kids.length] : null;
}
`,
      tests: [{ args: [[5, 8, 3, 9, 7, 6, 4, 2]], expected: [4, 2] }],
    },
  ],
  visualizer: "pairing-heap",
  practice: [
    {
      id: "pairing-meld",
      kind: "mcq",
      prompt: "Melding a heap rooted at 4 with a heap rooted at 9 gives…",
      options: [
        "4 at the root, with 9's tree as its first child",
        "9 at the root, with 4's tree as its first child",
        "4 at the root, with 9's tree as its last child",
        "A new root holding both",
      ],
      answer: 0,
      explanation: "The smaller root wins, and the loser becomes its first (leftmost) child.",
      distractors: {
        1: "That breaks heap order.",
        2: "Children are added at the front in the standard formulation.",
        3: "Pairing heaps never create placeholder roots.",
      },
      hints: ["Which root must stay on top in a min-heap?"],
      objective: "Meld",
    },
    {
      id: "pairing-passes",
      kind: "numeric",
      prompt:
        "After removing a root with 7 children, how many melds does the two-pass combination make?",
      answer: 6,
      explanation:
        "Pass 1 melds 3 pairs (the 7th child is left alone), giving 4 heaps; pass 2 melds them with 3 more melds: 6 in all — always one fewer than the number of children.",
      hints: ["Each meld reduces the number of heaps by one."],
      objective: "Two-pass combination",
    },
  ],
  exam: {
    definition:
      "A pairing heap is a heap-ordered multiway tree manipulated only by meld (the larger root becomes the first child of the smaller); extract-min recombines the root's children in two passes.",
    steps: [
      "Insert: meld with a single node.",
      "Extract-min: remove the root; pair children left to right; meld results right to left.",
      "Decrease-key: cut the subtree and meld with the root.",
    ],
    timeComplexity:
      "O(1) insert/meld/peek; O(log n) amortised extract-min; decrease-key between Ω(log log n) and $O(2^{2\\sqrt{\\log\\log n}})$ amortised.",
    spaceComplexity: "$O(n)$.",
    correctness: "Every meld keeps heap order; the two passes always leave exactly one tree.",
    applications: [
      "Dijkstra and Prim in practice",
      "Event-driven simulation",
      "Library priority queues",
    ],
    limitations: [
      "Weaker theoretical decrease-key bound than Fibonacci heaps",
      "Single extract can be O(n)",
    ],
    faq: [
      {
        q: "Why two passes rather than one?",
        a: "Melding children one by one can build a long chain; pairing first keeps the tree shallow enough for the amortised O(log n) bound.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Single tree; meld as the primitive.", "Two-pass extract-min."] },
      {
        marks: 10,
        outline: [
          "Meld, insert, decrease-key (3).",
          "Two-pass extract-min with an example (4).",
          "Complexity results (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. L. Fredman, R. Sedgewick, D. D. Sleator, R. E. Tarjan, “The pairing heap: a new form of self-adjusting heap,” Algorithmica, 1(1), 1986.",
      supports: "Pairing heaps and the O(log n) amortised extract-min.",
    },
    {
      citation:
        "M. L. Fredman, “On the efficiency of pairing heaps and related data structures,” Journal of the ACM, 46(4), 1999.",
      supports: "The Ω(log log n) lower bound for decrease-key.",
    },
    {
      citation:
        "S. Pettie, “Towards a final analysis of pairing heaps,” Proceedings of the 46th IEEE Symposium on Foundations of Computer Science (FOCS), 2005.",
      supports: "Improved amortised bounds for decrease-key.",
    },
    {
      citation:
        "D. H. Larkin, S. Sen, R. E. Tarjan, “A back-to-basics empirical study of priority queues,” Proceedings of the 16th Workshop on Algorithm Engineering and Experiments (ALENEX), 2014.",
      supports: "Practical performance of pairing heaps.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
