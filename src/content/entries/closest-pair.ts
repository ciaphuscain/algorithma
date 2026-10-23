import type { AlgorithmEntry } from "../types";

const CLASSIC = [
  [28, 8],
  [5, 30],
  [19, 20],
  [35, 15],
  [2, 3],
  [24, 35],
  [12, 40],
  [21, 21],
  [8, 12],
  [39, 40],
  [15, 5],
  [31, 28],
];

export const closestPairEntry: AlgorithmEntry = {
  slug: "closest-pair",
  name: "Closest Pair of Points (Divide and Conquer)",
  aliases: ["Closest pair problem", "Nearest pair of points"],
  curriculum: [410],
  domain: "geometry",
  subcategory: "Closest pair",
  difficulty: "intermediate",
  summary:
    "Finds the two nearest of n points in O(n log n): split at the median x, solve each half, then check a narrow strip around the split, where each point needs comparing with at most 7 neighbours in y order.",
  tags: ["closest pair", "divide and conquer", "geometry", "strip", "plane sweep"],
  prerequisites: ["Merge Sort"],
  related: ["merge-sort", "graham-scan", "kd-tree"],
  problem: {
    input: "n ≥ 2 points in the plane with whole-number coordinates (repeats allowed).",
    output:
      "Two of the points at the smallest distance, and that distance (squared, to stay exact).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Comparing every pair takes n(n − 1)/2 distance computations. Divide and conquer: draw a vertical line with half the points on each side and find the closest pair within each half. Call the better distance d. The only pairs not yet checked cross the line, and a crossing pair closer than d must have both points within d of the line.",
      },
      {
        kind: "p",
        text: "That strip can still hold many points, but it is thin: in y order, each point only needs comparing with the few that follow it within d vertically. A packing argument shows there are at most 7 of them.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Sort the points by x once.",
          "Closest(P): with 3 or fewer points, compare every pair.",
          "Otherwise split at the middle point (x = x_m), solve both halves, and let d be the better answer.",
          "Collect the points with |x − x_m| < d, in y order. Merging the halves' y orders, as merge sort does, avoids sorting again.",
          "For each strip point s, compare it with the following points t while t.y − s.y < d, and update d.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): twelve points, numbered by their position in the input. Distances are squared.",
      },
      {
        kind: "table",
        head: [
          "Subproblem (points)",
          "Split at",
          "Best within the halves",
          "Strip size",
          "Best after the strip",
        ],
        rows: [
          ["4, 1, 8", "base case: 3 pairs", "", "", "117 (4 and 8)"],
          ["6, 10, 2", "base case: 3 pairs", "", "", "241 (10 and 2)"],
          ["left half: 4, 1, 8, 6, 10, 2", "x = 12", "117", "6", "98 (10 and 8)"],
          ["7, 5, 0", "base case: 3 pairs", "", "", "205 (7 and 5)"],
          ["11, 3, 9", "base case: 3 pairs", "", "", "185 (11 and 3)"],
          ["right half: 7, 5, 0, 11, 3, 9", "x = 31", "185", "6", "98 (0 and 3)"],
          ["all twelve", "x = 21", "98", "6", "5 (2 and 7)"],
        ],
      },
      {
        kind: "p",
        text: "The answer is points 2 (19, 20) and 7 (21, 21), √5 ≈ 2.24 apart, on opposite sides of the top-level split. The run makes 23 distance computations, against 66 for checking every pair.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Compare squared distances: they are exact integers, and the order is the same.",
          "Keep the y order by merging, not by sorting the strip at every level; sorting there gives O(n log² n).",
          "Points with the same x can end up on either side of the split. The algorithm stays correct; just split by position in the x order, not by x value.",
          "Repeated points give distance 0; the strip then becomes empty, since nothing is strictly closer than 0.",
          "The JavaScript sample uses a plane sweep instead: visit points by x and keep the recent ones (within √best to the left) in a list sorted by y; only those within √best vertically need checking. With a balanced tree for the list it is O(n log n); the array used here makes inserts O(n) in the worst case.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**At most 7 comparisons per strip point.** Take a strip point s. Any t it is compared with lies in the rectangle $[x_m - d, x_m + d] \\times [s_y, s_y + d)$. The rectangle's points from the left half lie in its left d × d square (they all have x ≤ x_m) and are pairwise at least d apart. Cut that square into four d/2 × d/2 squares: each has diameter $d/\\sqrt{2} < d$, so it holds at most one of them. The same goes for the right half's points in the right square. So the rectangle holds at most 8 points, s included, and s has at most 7 successors to check. The property tests check this bound on random inputs, including inputs with many repeated and collinear points.",
      },
      { kind: "math", tex: "T(n) = 2\\,T(n/2) + O(n) \\implies T(n) = O(n \\log n)" },
      {
        kind: "p",
        text: "**Lower bound.** Deciding whether n numbers are all distinct takes Ω(n log n) comparisons in the algebraic decision-tree model, and placing the numbers on a line turns it into a closest-pair question (distance 0 or not). So O(n log n) is optimal in that model.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Randomized algorithms using a grid of cells and hashing run in expected O(n) time; they step outside the comparison model, which is how they beat the lower bound.",
          "The same divide-and-conquer pattern solves closest pair in higher fixed dimensions in O(n log n).",
          "All nearest neighbours (each point's nearest) also take O(n log n), for example via the Delaunay triangulation, whose edges include every point's nearest neighbour.",
          "For repeated queries (nearest point to a new location), build a k-d tree or a Voronoi diagram instead.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n)",
    worstClass: "n log n",
    note: "O(n log² n) if the strip is re-sorted by y at every level instead of merged.",
  },
  properties: [
    { label: "Paradigm", value: "Divide and conquer, with a linear-time combine step" },
    { label: "Strip work", value: "At most 7 comparisons per strip point" },
    { label: "Exactness", value: "Squared distances keep integer inputs exact" },
  ],
  implementations: [
    {
      language: "python",
      entry: "closest_pair",
      code: `def closest_pair(points):
    # Smallest squared distance between two of the points (divide and conquer).
    def d2(a, b):
        return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

    def solve(px):                         # px sorted by x; returns (best, points by y)
        if len(px) <= 3:
            best = min((d2(a, b) for i, a in enumerate(px) for b in px[i + 1:]),
                       default=float("inf"))
            return best, sorted(px, key=lambda p: p[1])
        mid = len(px) // 2
        xm = px[mid][0]
        dl, left = solve(px[:mid])
        dr, right = solve(px[mid:])
        best = min(dl, dr)
        by_y, i, j = [], 0, 0              # merge the halves by y
        while i < len(left) or j < len(right):
            if j == len(right) or (i < len(left) and left[i][1] <= right[j][1]):
                by_y.append(left[i]); i += 1
            else:
                by_y.append(right[j]); j += 1
        strip = [p for p in by_y if (p[0] - xm) ** 2 < best]
        for i, a in enumerate(strip):
            for b in strip[i + 1:]:
                if (b[1] - a[1]) ** 2 >= best:
                    break
                best = min(best, d2(a, b))
        return best, by_y

    return solve(sorted(map(tuple, points)))[0]
`,
      tests: [
        { args: [CLASSIC], expected: 5 },
        {
          args: [
            [
              [0, 10],
              [7, 10],
              [11, 10],
              [20, 10],
              [24, 10],
              [26, 10],
              [33, 10],
              [40, 10],
            ],
          ],
          expected: 4,
        },
      ],
    },
    {
      language: "javascript",
      entry: "closestPairSweep",
      code: `// Plane sweep: visit points by x, keeping the ones less than √best to the left in a
// list sorted by y; only those within √best vertically can be closer.
function closestPairSweep(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const active = []; // indices into pts, sorted by y
  const lowerBound = (y) => {
    let lo = 0, hi = active.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (pts[active[m]][1] < y) lo = m + 1;
      else hi = m;
    }
    return lo;
  };
  let best = Infinity;
  let left = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    while (left < i && (x - pts[left][0]) ** 2 >= best) {
      let k = lowerBound(pts[left][1]);
      while (active[k] !== left) k++;
      active.splice(k, 1);
      left++;
    }
    const reach = Math.ceil(Math.sqrt(best)); // a safe, slightly wide bound
    for (let k = lowerBound(y - reach); k < active.length; k++) {
      const [px, py] = pts[active[k]];
      if (py > y + reach) break;
      best = Math.min(best, (x - px) ** 2 + (y - py) ** 2);
    }
    active.splice(lowerBound(y), 0, i);
  }
  return best;
}
`,
      tests: [
        { args: [CLASSIC], expected: 5 },
        {
          args: [
            [
              [4, 4],
              [10, 2],
              [7, 9],
              [10, 2],
              [1, 8],
            ],
          ],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: "closest-pair",
  practice: [
    {
      id: "closest-small",
      kind: "numeric",
      prompt:
        "Points (0, 0), (3, 4) and (10, 10): what is the smallest squared distance between two of them?",
      answer: 25,
      explanation: "(0,0)–(3,4): 9 + 16 = 25; (3,4)–(10,10): 49 + 36 = 85; (0,0)–(10,10): 200.",
      hints: ["Compare all three pairs."],
      objective: "Compute squared distances",
    },
    {
      id: "closest-strip",
      kind: "numeric",
      prompt:
        "In the twelve-point preset, both halves' best squared distance is 98. What squared distance does the top-level strip find?",
      answer: 5,
      explanation: "Points (19, 20) and (21, 21) straddle the split at x = 21: 4 + 1 = 5.",
      hints: ["Look for two points near x = 21 with similar y."],
      objective: "Follow the combine step",
    },
    {
      id: "closest-seven",
      kind: "mcq",
      prompt:
        "Why does each strip point need comparing with only a constant number of later points?",
      options: [
        "Points on the same side are at least d apart, so few fit in the d × 2d box above it",
        "The strip never holds more than 8 points",
        "Points are sorted by x within the strip",
        "Because d halves at every level",
      ],
      answer: 0,
      explanation:
        "A d × d square holds at most 4 points that are pairwise ≥ d apart, so the d × 2d box holds at most 8, the point itself included.",
      distractors: {
        1: "The strip can hold many points; only the box above one point is small.",
        2: "The strip is in y order.",
        3: "d need not shrink at all.",
      },
      hints: ["Cut the box into squares of side d/2."],
      objective: "Understand the packing argument",
    },
  ],
  exam: {
    definition:
      "The divide-and-conquer closest-pair algorithm splits points by the median x, recursively solves both halves, and examines a strip of width 2d around the split in y order to find closer crossing pairs.",
    steps: [
      "Sort by x; split at the median.",
      "Recursively solve both halves; d = the smaller answer.",
      "Strip: points within d of the split, in y order (by merging).",
      "Compare each strip point with following points less than d above it (at most 7).",
    ],
    timeComplexity: "$O(n \\log n)$ from $T(n) = 2T(n/2) + O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Any pair closer than d must cross the split and lie in the strip within d vertically; the packing argument bounds the comparisons.",
    applications: [
      "Collision warnings (air traffic, robotics)",
      "Clustering (single linkage starts from the closest pair)",
      "Duplicate detection in geometric data",
    ],
    limitations: [
      "Answers one pair; repeated nearest-neighbour queries need a spatial index",
      "Constant factors make brute force faster for small n",
    ],
    faq: [
      {
        q: "Why at most 7 and not 5 or 6?",
        a: "7 follows from the simple box argument; tighter analyses give smaller constants, but any constant gives a linear-time combine step.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Split by x, recurse, check the strip.", "O(n log n)."] },
      {
        marks: 5,
        outline: ["Algorithm steps (2).", "Strip lemma (2).", "Recurrence (1)."],
      },
      {
        marks: 10,
        outline: [
          "Brute force and the idea of splitting (1).",
          "Algorithm with merging by y (3).",
          "Packing argument for 7 comparisons (3).",
          "Recurrence and lower bound (2).",
          "Worked example (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. I. Shamos, D. Hoey, “Closest-point problems,” Proc. 16th Annual Symposium on Foundations of Computer Science (FOCS), IEEE, 1975, pp. 151–162.",
      supports: "The O(n log n) divide-and-conquer algorithm and the lower bound.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Section 33.4.",
      supports: "The algorithm with presorting and the 7-point strip bound.",
    },
    {
      citation: "J. Kleinberg, É. Tardos, Algorithm Design, Pearson, 2006, Section 5.4.",
      supports: "An alternative presentation of the strip argument.",
    },
    {
      citation:
        "M. O. Rabin, “Probabilistic algorithms,” in J. F. Traub (ed.), Algorithms and Complexity: New Directions and Recent Results, Academic Press, 1976, pp. 21–39.",
      supports: "The randomized expected-linear-time approach mentioned in the advanced section.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
