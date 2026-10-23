import type { AlgorithmEntry } from "../types";

const SIX = [
  [2, 3],
  [5, 4],
  [9, 6],
  [4, 7],
  [8, 1],
  [7, 2],
];

export const kdTreeEntry: AlgorithmEntry = {
  slug: "kd-tree",
  name: "k-d Tree (Nearest-Neighbour Search)",
  aliases: ["KD tree", "KD-Tree Search", "k-dimensional tree", "2-d tree"],
  curriculum: [177, 418],
  domain: "trees",
  subcategory: "Spatial trees",
  difficulty: "advanced",
  summary:
    "A binary tree that splits space at median points, alternating between x and y. A nearest-neighbour query searches the query's own side first and crosses a split only when the circle around the query through the best point so far reaches over it.",
  tags: ["kd tree", "nearest neighbour", "spatial index", "range search", "geometry", "pruning"],
  prerequisites: ["Binary Search Tree"],
  related: ["bst", "closest-pair", "graham-scan"],
  problem: {
    input: "n points in the plane, then a query point q.",
    output:
      "A point nearest to q (squared distance, to stay exact), found without measuring every point.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A binary search tree finds a number by halving the range at each step. A k-d tree does the same in the plane: the root's point splits the plane with a vertical line, its children split their halves with horizontal lines, and so on, alternating. Each node owns a rectangular cell.",
      },
      {
        kind: "p",
        text: "To find the point nearest to q, walk down to q's own cell, which probably holds a close point. On the way back up, look across each split line only if it is closer to q than the best point found so far; otherwise everything on the far side is too far away and is skipped.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build: sort the points by the current axis (x at even depths, y at odd), make the median the node, and build its children from the points before and after it.",
          "Search(node): measure node's point and keep it if it is the best so far.",
          "Let diff = q[axis] − node[axis]. Search the child on q's side first.",
          "Then search the other child only if diff² < best distance²: only then can the circle around q cross the split line.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): six points named A–F, query q = (9, 2).",
      },
      {
        kind: "table",
        head: ["Node", "Point", "Splits by", "Children (lower side, upper side)"],
        rows: [
          ["F (root)", "(7, 2)", "x = 7", "B, C"],
          ["B", "(5, 4)", "y = 4", "A, D"],
          ["C", "(9, 6)", "y = 6", "E, none"],
          ["A, D, E", "(2, 3), (4, 7), (8, 1)", "x", "none"],
        ],
      },
      {
        kind: "table",
        head: ["Visit", "Distance² to q", "Best so far", "Next"],
        rows: [
          ["F (7, 2)", "4", "F, 4", "q.x − 7 = 2 ≥ 0: search C's side first"],
          ["C (9, 6)", "16", "F, 4", "q.y − 6 = −4 < 0: search E's side first"],
          ["E (8, 1)", "2", "E, 2", "no children; C has no upper child"],
          ["back at F", "", "E, 2", "B's side is 2 away and 2² = 4 ≥ 2: skip A, B and D"],
        ],
      },
      {
        kind: "p",
        text: "The nearest point is E (8, 1), after measuring 3 of the 6 points. On the fifteen-point preset the search measures 5 of 15.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Compare squared distances, and prune with diff² < best²: both stay exact on integers.",
          "Sorting at every level costs O(n log² n) to build; a linear-time median selection (or presorting by each axis) gives O(n log n).",
          "Points equal to the split value may sit on either side. The pruning test stays correct because every point beyond the line is at least |diff| from q.",
          "For k nearest neighbours, keep a max-heap of the best k and prune against the k-th distance.",
          "The JavaScript sample answers a different query with the same tree: counting the points in a rectangle, skipping every subtree whose side the rectangle does not reach.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height.** The median leaves at most ⌊n/2⌋ points for each child, so the tree has ⌊log₂ n⌋ + 1 levels; the conformance suite checks this for every run.",
      },
      {
        kind: "p",
        text: "**Pruning is safe.** Every point p′ beyond the split line satisfies $\\lVert q - p' \\rVert \\ge |q_{axis} - p'_{axis}| \\ge |diff|$. If $diff^2 \\ge best^2$, no point there is strictly nearer, so skipping the subtree loses nothing.",
      },
      {
        kind: "p",
        text: "**Running time.** For well-spread random points the expected number of points measured grows like log n. Nothing guarantees it, though: with 12 points spaced around a circle centred on q, the search measures all 12, and the tests check that case. For counting points in a rectangle, a 2-d tree visits O(√n + k) nodes when k points are reported.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "In k dimensions the axes cycle through all k coordinates. As k grows, the circle (now a ball) crosses almost every split, pruning fails, and the search approaches a full scan. High-dimensional data uses approximate methods instead.",
          "Variants: split at the widest spread instead of cycling axes; keep points only in leaves (buckets); ball trees and R-trees use other cell shapes.",
          "Uses: nearest-neighbour classification, colour quantisation, collision queries, photon mapping in rendering.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(\\log n)", average: "O(\\log n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Per nearest-neighbour query; the average is for well-spread points. Building takes O(n log n) with linear-time medians (O(n log² n) by sorting at each level).",
  },
  properties: [
    { label: "Height", value: "⌊log₂ n⌋ + 1 with median splits" },
    { label: "Prune rule", value: "Skip the far side when (q[axis] − split)² ≥ best distance²" },
    { label: "Range search", value: "O(√n + k) in two dimensions" },
  ],
  implementations: [
    {
      language: "python",
      entry: "nearest",
      code: `def nearest(points, q):
    # Build a 2-d tree by median splits, then find the point nearest to q.
    def build(pts, depth):
        if not pts:
            return None
        axis = depth % 2
        pts = sorted(pts, key=lambda p: p[axis])
        m = len(pts) // 2
        return (pts[m], axis, build(pts[:m], depth + 1), build(pts[m + 1:], depth + 1))

    best = [float("inf"), None]

    def search(node):
        if node is None:
            return
        p, axis, left, right = node
        d2 = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2
        if d2 < best[0]:
            best[0], best[1] = d2, p
        diff = q[axis] - p[axis]
        near, far = (left, right) if diff < 0 else (right, left)
        search(near)
        if diff * diff < best[0]:          # the circle around q crosses the split
            search(far)

    search(build([tuple(p) for p in points], 0))
    return list(best[1])
`,
      tests: [
        { args: [SIX, [9, 2]], expected: [8, 1] },
        {
          args: [
            [
              [0, 0],
              [4, 2],
              [2, 5],
              [6, 6],
              [1, 3],
            ],
            [12, 1],
          ],
          expected: [6, 6],
        },
      ],
    },
    {
      language: "javascript",
      entry: "rangeCount",
      code: `// Count the points inside the box [x1, x2] × [y1, y2] with a 2-d tree, skipping
// every subtree whose side of a split line the box does not reach.
function rangeCount(points, box) {
  const [x1, y1, x2, y2] = box;
  const build = (pts, depth) => {
    if (pts.length === 0) return null;
    const axis = depth % 2;
    const sorted = [...pts].sort((a, b) => a[axis] - b[axis]);
    const m = sorted.length >> 1;
    return {
      p: sorted[m],
      axis,
      left: build(sorted.slice(0, m), depth + 1),
      right: build(sorted.slice(m + 1), depth + 1),
    };
  };
  const lo = [x1, y1];
  const hi = [x2, y2];
  const count = (node) => {
    if (!node) return 0;
    const { p, axis, left, right } = node;
    let c = p[0] >= x1 && p[0] <= x2 && p[1] >= y1 && p[1] <= y2 ? 1 : 0;
    if (lo[axis] <= p[axis]) c += count(left); // the box reaches the low side
    if (hi[axis] >= p[axis]) c += count(right);
    return c;
  };
  return count(build(points, 0));
}
`,
      tests: [
        { args: [SIX, [3, 1, 8, 5]], expected: 3 },
        { args: [SIX, [0, 0, 10, 10]], expected: 6 },
      ],
    },
  ],
  visualizer: "kd-tree",
  practice: [
    {
      id: "kd-height",
      kind: "numeric",
      prompt: "How many levels does a 2-d tree built by median splits on 15 points have?",
      answer: 4,
      explanation:
        "15 → 7 + 7 → 3 + 3 → 1 + 1: levels of 1, 2, 4 and 8 nodes, that is ⌊log₂ 15⌋ + 1 = 4.",
      hints: ["Each child gets at most half of the remaining points."],
      objective: "Relate height to n",
    },
    {
      id: "kd-skip",
      kind: "mcq",
      prompt:
        "During a nearest-neighbour search, when may the subtree on the far side of a split be skipped?",
      options: [
        "When (q[axis] − split)² is at least the best squared distance so far",
        "Whenever q lies on the near side",
        "When the far subtree has fewer points than the near one",
        "Only at the leaves",
      ],
      answer: 0,
      explanation:
        "Every point beyond the line is at least |q[axis] − split| from q, so it cannot beat the best when that gap is at least the best distance.",
      distractors: {
        1: "A nearer point can lie just across the line.",
        2: "Subtree size says nothing about distance.",
        3: "Pruning works at every level.",
      },
      hints: ["How close can a point beyond the line be?"],
      objective: "Apply the pruning rule",
    },
    {
      id: "kd-visited",
      kind: "numeric",
      prompt: "In the six-point example with q = (9, 2), how many points does the search measure?",
      answer: 3,
      explanation: "F, C and E. B's subtree is skipped because 2² = 4 ≥ 2.",
      hints: ["Follow the visit table."],
      objective: "Trace a query",
    },
  ],
  exam: {
    definition:
      "A k-d tree is a binary space-partitioning tree whose node at depth d splits on coordinate d mod k at a median point; it supports nearest-neighbour and range queries with pruning.",
    steps: [
      "Build: median split by alternating axes, recursively.",
      "Query: descend to q's cell, updating the best.",
      "Backtrack: visit a far subtree only if the split is closer than the best.",
    ],
    timeComplexity:
      "Build $O(n \\log n)$; query $O(\\log n)$ on average for well-spread points, $O(n)$ worst case; range search $O(\\sqrt{n} + k)$ in 2-d.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Points beyond a split are at least |q[axis] − split| from q, so pruned subtrees cannot contain a strictly nearer point.",
    applications: [
      "Nearest-neighbour search and classification",
      "Range queries in databases and GIS",
      "Computer graphics (photon mapping, ray tracing)",
      "Point-cloud processing",
    ],
    limitations: [
      "Degrades in high dimensions",
      "Insertions and deletions unbalance it",
      "No worst-case guarantee for nearest-neighbour queries",
    ],
    faq: [
      {
        q: "Why alternate axes?",
        a: "So cells shrink in every direction; splitting only by x would make long thin cells that a query circle crosses often.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Median splits by alternating axes.", "Nearest-neighbour search with pruning."],
      },
      {
        marks: 5,
        outline: ["Construction (2).", "Query with the pruning rule (2).", "Complexities (1)."],
      },
      {
        marks: 10,
        outline: [
          "Definition and cells (2).",
          "Construction and height (2).",
          "Nearest-neighbour search and pruning proof (3).",
          "Worked example (2).",
          "Range search and limitations (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. L. Bentley, “Multidimensional binary search trees used for associative searching,” Communications of the ACM 18(9), 1975, pp. 509–517.",
      supports: "The k-d tree.",
    },
    {
      citation:
        "J. H. Friedman, J. L. Bentley, R. A. Finkel, “An algorithm for finding best matches in logarithmic expected time,” ACM Transactions on Mathematical Software 3(3), 1977, pp. 209–226.",
      supports: "Nearest-neighbour search with pruning and its expected logarithmic time.",
    },
    {
      citation:
        "M. de Berg, O. Cheong, M. van Kreveld, M. Overmars, Computational Geometry: Algorithms and Applications, 3rd ed., Springer, 2008, Chapter 5.",
      supports: "Construction and the O(√n + k) range-search bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
