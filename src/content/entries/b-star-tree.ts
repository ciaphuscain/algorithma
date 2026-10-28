import type { AlgorithmEntry } from "../types";

export const bStarTreeEntry: AlgorithmEntry = {
  slug: "b-star-tree",
  name: "B* Tree",
  aliases: ["B*-tree", "B-star tree"],
  curriculum: [164],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "advanced",
  summary:
    "A B-tree variant that delays splitting: a full node first passes a key to a neighbour with room, and only two full neighbours split — into three nodes. Nodes stay at least about two-thirds full instead of half full, so the tree has fewer nodes and is shallower.",
  tags: ["balanced tree", "multiway tree", "database index", "node utilisation", "redistribution"],
  prerequisites: ["B-trees"],
  related: ["b-tree", "b-plus-tree"],
  problem: {
    input: "The most keys per node M and a sequence of insert and search operations.",
    output:
      "The result of each operation, with every non-root node holding at least ⌈(2M − 2)/3⌉ keys.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A B-tree split leaves two half-empty nodes, so on average a B-tree's nodes are only about 69% full after random inserts — wasted disk space and extra height. Before splitting, a B* tree looks next door: if a neighbouring node has room, one key moves across (through the parent, to keep the order) and nothing splits. When the neighbour is full as well, the two full nodes share their keys among three new ones, each about two-thirds full.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Insert the key into its leaf, as in a B-tree.",
          "If a non-root node now holds M + 1 keys and an adjacent sibling holds fewer than M: rotate — the node's end key goes up to the parent and the parent's separator comes down into the sibling (with a child pointer, for internal nodes).",
          "Otherwise split the node and a full neighbour: their 2M + 1 keys plus the separator between them (2M + 2 keys) become three nodes holding 2M keys, with two separators in the parent. The parent may now overflow in turn.",
          "The root has no neighbours, so it may grow to 2⌊2M/3⌋ keys; it then splits in two halves, each already two-thirds full, under a new root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): M = 3 (a non-root node holds 2 or 3 keys; the root up to 4), inserting 10, 20, …, 80.",
      },
      {
        kind: "table",
        head: ["insert", "what happens", "tree afterwards"],
        rows: [
          ["10–40", "the root fills up to 4 keys", "[10 20 30 40]"],
          ["50", "root over 4 keys: split in two", "[30] ( [10 20] [40 50] )"],
          ["60", "—", "[30] ( [10 20] [40 50 60] )"],
          [
            "70",
            "[40 50 60 70] overflows; the left neighbour has room: 30 goes down to it, 40 goes up",
            "[40] ( [10 20 30] [50 60 70] )",
          ],
          [
            "80",
            "[50 60 70 80] overflows; its neighbour is full too: 2 + 2 nodes → 3",
            "[30 60] ( [10 20] [40 50] [70 80] )",
          ],
        ],
      },
      {
        kind: "p",
        text: "One shift and two splits; after the two-to-three split every node holds 2 keys — two-thirds of M. In the second preset, a later overflow at the left end also splits two full nodes into three; with M = 5 (third preset), four shifts happen for only three splits.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Deletion mirrors insertion: a node falling below two-thirds full first borrows from a neighbour; if both are at the minimum, three nodes merge into two. It is not implemented in this visualizer.",
          "Checking a sibling costs an extra node read, a price worth paying on disk only when space (or height) matters more than insert speed.",
          "Some file systems and databases use the redistribution idea without the full B* rules — for example, trying a sibling before splitting, or splitting nodes unevenly when keys arrive in order.",
          "The B+ and B* refinements are independent and can be combined: records in linked leaves, and redistribution before splitting.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Fill factor.** A two-to-three split turns two full nodes (2M keys plus the overflow and the separator) into three nodes with ⌊2M/3⌋, ⌊(2M+1)/3⌋ and ⌊(2M+2)/3⌋ keys — each at least about two-thirds of M. Shifts only move keys between nodes that both stay within bounds, so with inserts only, every non-root node always holds at least ⌈(2M − 2)/3⌉ keys (Knuth's ⌈(2m − 1)/3⌉ children for m = M + 1).",
      },
      {
        kind: "p",
        text: "**Height.** With nodes at least two-thirds full, the branching factor is at least about $\\tfrac{2}{3}m$ instead of $\\tfrac{1}{2}m$, so the height is at most about $\\log_{2m/3} n$ — a few percent shallower than a B-tree's for large $m$, and the same $O(\\log n)$. The tests check the fill rule on every non-root node, the root's larger limit, and compare every tree with an independent implementation of the same rules.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth described B* trees in The Art of Computer Programming, Volume 3 (1973), following Bayer and McCreight's B-trees.",
          "Generalising, a B-tree can split k full nodes into k + 1 before splitting, raising the minimum fill towards $k/(k+1)$ at the price of more neighbour reads.",
          "Under random insertions, a B-tree's expected node utilisation is $\\ln 2 \\approx 69\\%$ (Yao, 1978); redistribution raises it.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(log n)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Per insert or search; an overflow may read one extra sibling.",
  },
  properties: [
    { label: "Non-root fill", value: "At least about two-thirds full" },
    {
      label: "On overflow",
      value: "Shift a key to a neighbour; else split two full nodes into three",
    },
    { label: "Root", value: "Up to $2\\lfloor 2M/3 \\rfloor$ keys before it splits in two" },
  ],
  implementations: [
    {
      language: "python",
      entry: "split_two_into_three",
      code: `def split_two_into_three(a, sep, b, M):
    """Two full neighbours (one overflowing) and their separator -> three nodes, two separators."""
    keys = a + [sep] + b                      # 2M + 2 keys
    n1, n2 = (2 * M) // 3, (2 * M + 1) // 3   # sizes of the first two nodes
    first = keys[:n1]
    s1 = keys[n1]
    second = keys[n1 + 1:n1 + 1 + n2]
    s2 = keys[n1 + 1 + n2]
    third = keys[n1 + 2 + n2:]
    return [first, s1, second, s2, third]
`,
      tests: [
        {
          args: [[10, 20, 30], 40, [50, 60, 70, 80], 3],
          expected: [[10, 20], 30, [40, 50], 60, [70, 80]],
        },
        {
          args: [[1, 2, 3, 4, 5], 6, [7, 8, 9, 10, 11, 12], 5],
          expected: [[1, 2, 3], 4, [5, 6, 7], 8, [9, 10, 11, 12]],
        },
      ],
    },
    {
      language: "javascript",
      entry: "limits",
      code: `// Fill limits of a B* tree with at most M keys per node.
function limits(M) {
  return {
    minKeys: Math.ceil((2 * M - 2) / 3), // non-root nodes
    rootMax: 2 * Math.floor((2 * M) / 3),
  };
}
`,
      tests: [
        { args: [3], expected: { minKeys: 2, rootMax: 4 } },
        { args: [5], expected: { minKeys: 3, rootMax: 6 } },
      ],
    },
  ],
  visualizer: "b-star-tree",
  practice: [
    {
      id: "bstar-shift",
      kind: "mcq",
      prompt: "A non-root B* node overflows and its left neighbour has room. What happens?",
      options: [
        "Its first key moves up to the parent and the parent's separator moves down into the neighbour",
        "It splits in two, as in a B-tree",
        "Its first key moves straight into the neighbour",
        "The neighbour and the node merge",
      ],
      answer: 0,
      explanation:
        "Keys move through the parent so that the separator still divides the two nodes' key ranges.",
      distractors: {
        1: "Splitting is the last resort in a B* tree.",
        2: "That would put a key on the wrong side of the parent's separator.",
        3: "Merging is for underfull nodes, not overflowing ones.",
      },
      hints: ["What must stay true of the separator between the two nodes?"],
      objective: "Redistribution",
    },
    {
      id: "bstar-min",
      kind: "numeric",
      prompt:
        "With at most M = 8 keys per node, what is the fewest keys a non-root B* node may hold?",
      answer: 5,
      explanation:
        "$\\lceil (2 \\cdot 8 - 2)/3 \\rceil = \\lceil 14/3 \\rceil = 5$, against 3 or 4 in a B-tree.",
      hints: ["$\\lceil (2M - 2)/3 \\rceil$."],
      objective: "Fill rule",
    },
  ],
  exam: {
    definition:
      "A B* tree is a B-tree variant in which an overflowing node first redistributes keys to a neighbour, and two full neighbours split into three, keeping non-root nodes at least about two-thirds full.",
    steps: [
      "Insert into the leaf.",
      "Overflow: shift a key through the parent to a neighbour with room.",
      "Else split the node and a full neighbour into three; propagate upward.",
      "The root may hold up to 2⌊2M/3⌋ keys and splits in two.",
    ],
    timeComplexity: "$O(\\log n)$ per operation.",
    spaceComplexity: "$O(n)$, with nodes about two-thirds full or more.",
    correctness:
      "Redistribution and two-to-three splits preserve sorted order and keep every node within its bounds; leaves stay at one depth.",
    applications: [
      "Space-efficient disk indexes",
      "Database storage engines that favour fuller pages",
    ],
    limitations: [
      "Extra sibling reads on overflow",
      "More complex deletion",
      "Variants differ in details between sources",
    ],
    faq: [
      {
        q: "Why may the root hold more keys than other nodes?",
        a: "It has no neighbours to share with, and its split must produce two nodes that already satisfy the two-thirds rule.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Redistribute before splitting.",
          "Two full nodes split into three; nodes ≥ 2/3 full.",
        ],
      },
      {
        marks: 10,
        outline: [
          "Rules (3).",
          "Worked insertion sequence (4).",
          "Fill factor and comparison with B-trees (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 6.2.4.",
      supports: "B* trees and their fill rules.",
    },
    {
      citation: "D. Comer, “The ubiquitous B-tree,” ACM Computing Surveys, 11(2), 1979.",
      supports: "The B* variant among other B-tree refinements.",
    },
    {
      citation: "A. C.-C. Yao, “On random 2–3 trees,” Acta Informatica, 9(2), 1978.",
      supports: "Expected node utilisation of about ln 2 under random insertions.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
