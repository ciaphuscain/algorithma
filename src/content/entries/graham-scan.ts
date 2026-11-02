import type { AlgorithmEntry } from "../types";

export const grahamScanEntry: AlgorithmEntry = {
  slug: "graham-scan",
  name: "Graham Scan (Convex Hull)",
  aliases: ["Graham's scan", "Convex hull", "Planar convex hull"],
  curriculum: [406],
  domain: "geometry",
  subcategory: "Convex hull",
  difficulty: "intermediate",
  summary:
    "Finds the convex hull of points in the plane: sort them by angle around the lowest point, then sweep with a stack, popping every point that would make a right turn. O(n log n), dominated by the sort.",
  tags: ["convex hull", "geometry", "cross product", "stack", "orientation", "sorting"],
  prerequisites: ["Merge Sort", "Monotonic Stack"],
  related: ["closest-pair", "kd-tree", "convex-hull-trick", "monotonic-stack"],
  problem: {
    input: "n points in the plane with whole-number coordinates.",
    output:
      "The corners of the smallest convex polygon containing them, counter-clockwise from the lowest point. Points on an edge are not corners.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hammer nails into a board at the points and stretch a rubber band around them all. When it snaps tight, it touches only some nails: those are the **convex hull**. Walking around the band counter-clockwise, you only ever turn left.",
      },
      {
        kind: "p",
        text: "Graham's idea: start at the lowest point, which must be on the hull, and visit the others in order of angle, like a lighthouse beam sweeping round. Keep the corners found so far on a stack. If the newest point makes the path turn right, the corner before it was a dent, so throw it away, and keep throwing until the path turns left again.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pick p₀: the lowest point, the leftmost of those if several. It is a corner.",
          "Sort the other points by the angle of p₀ → p, measured from the rightward direction. Points at the same angle go nearer first.",
          "Push p₀. For each point p in order: while the stack has two or more points and next-to-top → top → p is not a left turn, pop. Then push p.",
          "The stack now holds the corners, counter-clockwise.",
        ],
      },
      {
        kind: "p",
        text: "**The turn test** needs no angles: the sign of the cross product $(a - o) \\times (b - o)$ says whether o → a → b turns left (positive), right (negative) or goes straight (zero). With whole-number coordinates it is exact.",
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): points 0 … 10, with p₀ = point 0 at (0, 0). By angle: 2 (4, 0), 1 (8, 0), 7 (6, 3), 3 (10, 5), 9 (8, 6), 10 (2, 2), 6 (4, 4), 4 (6, 9), 8 (3, 6), 5 (1, 7). Points 7 and 3 share an angle, as do 10 and 6, so the nearer comes first.",
      },
      {
        kind: "table",
        head: ["Point", "Turn tests (cross product)", "Popped", "Stack afterwards"],
        rows: [
          ["2 (4, 0)", "none: only p₀ on the stack", "", "0, 2"],
          ["1 (8, 0)", "0 → 2 → 1: 0, straight", "2", "0, 1"],
          ["7 (6, 3)", "0 → 1 → 7: +24", "", "0, 1, 7"],
          ["3 (10, 5)", "1 → 7 → 3: −16; 0 → 1 → 3: +40", "7", "0, 1, 3"],
          ["9 (8, 6)", "1 → 3 → 9: +12", "", "0, 1, 3, 9"],
          ["10 (2, 2)", "3 → 9 → 10: +14", "", "0, 1, 3, 9, 10"],
          ["6 (4, 4)", "9 → 10 → 6: −4; 3 → 9 → 6: +8", "10", "0, 1, 3, 9, 6"],
          ["4 (6, 9)", "9 → 6 → 4: −16; 3 → 9 → 4: −4; 1 → 3 → 4: +28", "6, 9", "0, 1, 3, 4"],
          ["8 (3, 6)", "3 → 4 → 8: +24", "", "0, 1, 3, 4, 8"],
          ["5 (1, 7)", "4 → 8 → 5: −9; 3 → 4 → 5: +28", "8", "0, 1, 3, 4, 5"],
        ],
      },
      {
        kind: "p",
        text: "The hull is 0, 1, 3, 4, 5: five corners after 14 turn tests and 6 pops. Point 2 lies on the bottom edge, so the straight-line test removed it. Point 9 was a corner of the hull of the points seen so far, until point 4 showed it was a dent.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Never compute angles with atan2 for the sort: compare two points by the sign of their cross product around p₀. Every other point lies above p₀ or to its right, so this comparison is consistent.",
          "Use exact integer arithmetic. With floating point, nearly collinear points can flip the sign of a turn test and produce a hull that is not convex.",
          "Decide what to do with collinear points on edges. Popping on 'not a left turn' (≤ 0) drops them; to keep them, pop only on right turns and order the last ray's points farthest first.",
          "Remove repeated points first, or make sure the comparison treats them consistently.",
          "Andrew's monotone chain (the JavaScript sample) sorts by x instead of by angle and builds the lower and upper hulls with the same left-turn test. It avoids the angular comparison altogether.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "math",
        tex: "\\operatorname{cross}(o, a, b) = (a_x - o_x)(b_y - o_y) - (a_y - o_y)(b_x - o_x)",
      },
      {
        kind: "p",
        text: "This is twice the signed area of triangle o, a, b: positive when o → a → b is counter-clockwise.",
      },
      {
        kind: "p",
        text: "**Invariant.** After processing the points before p in angular order, the stack holds the convex hull of p₀ and those points, counter-clockwise. p has the largest angle so far, so it lies outside that hull or on its boundary, and it is a corner of the new hull. Corners at the top of the stack that make a non-left turn towards p are now inside the new hull or on its edge; the first corner that makes a left turn, and everything below it, stays. That is exactly what the pops do.",
      },
      {
        kind: "p",
        text: "**Cost.** Each point is pushed once and popped at most once, and every turn test either pops a point or ends the loop for the current point. So the scan makes at most 2n turn tests; the property tests check this bound. The sort costs O(n log n), and in general nothing faster is possible: for distinct numbers x₁ … x_n, every point (x_i, x_i²) is a corner of their hull, and reading the hull counter-clockwise from its leftmost corner lists the numbers in sorted order. So wherever sorting needs Ω(n log n) time, so does the hull.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Output-sensitive algorithms depend on the number of corners h. Jarvis march (gift wrapping) takes O(nh); Chan's algorithm combines it with Graham scan to reach O(n log h).",
          "If the points arrive already sorted by x, Andrew's monotone chain runs in O(n). Polygons whose vertices are given in order (simple polygons) also have linear-time hull algorithms.",
          "In three dimensions the hull is a polyhedron. Divide and conquer builds it in O(n log n) time, and randomized incremental construction in O(n log n) expected time.",
          "Hulls appear in collision detection, the farthest pair of points (rotating calipers on the hull), and as the dual of the lower envelope of lines in the convex hull trick.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n)",
    worstClass: "n log n",
    note: "The sort dominates; the stack scan itself is O(n).",
  },
  properties: [
    { label: "Primitive", value: "Orientation (cross-product sign), exact on integers" },
    {
      label: "Scan cost",
      value: "At most 2n turn tests: each point is pushed once and popped at most once",
    },
    {
      label: "Collinear points",
      value: "Dropped from edges here; can be kept with a small change",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "graham_scan",
      code: `from functools import cmp_to_key


def graham_scan(points):
    # Corners of the convex hull, counter-clockwise from the lowest (then leftmost) point.
    pts = sorted({(x, y) for x, y in points}, key=lambda p: (p[1], p[0]))
    p0 = pts[0]

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    def by_angle(a, b):
        c = cross(p0, a, b)
        if c != 0:
            return -c                      # a first if b is to its left
        da = (a[0] - p0[0]) ** 2 + (a[1] - p0[1]) ** 2
        db = (b[0] - p0[0]) ** 2 + (b[1] - p0[1]) ** 2
        return da - db                     # same angle: nearer first

    stack = [p0]
    for p in sorted(pts[1:], key=cmp_to_key(by_angle)):
        while len(stack) >= 2 and cross(stack[-2], stack[-1], p) <= 0:
            stack.pop()
        stack.append(p)
    return [list(p) for p in stack]
`,
      tests: [
        {
          args: [
            [
              [0, 0],
              [8, 0],
              [4, 0],
              [10, 5],
              [6, 9],
              [1, 7],
              [4, 4],
              [6, 3],
              [3, 6],
              [8, 6],
              [2, 2],
            ],
          ],
          expected: [
            [0, 0],
            [8, 0],
            [10, 5],
            [6, 9],
            [1, 7],
          ],
        },
        {
          args: [
            [
              [0, 0],
              [3, 0],
              [6, 0],
              [0, 3],
              [3, 3],
              [6, 3],
              [0, 6],
              [3, 6],
              [6, 6],
            ],
          ],
          expected: [
            [0, 0],
            [6, 0],
            [6, 6],
            [0, 6],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "convexHull",
      code: `// Andrew's monotone chain: sort by x, then build the lower and upper hulls with
// the same left-turn test. Corners counter-clockwise from the leftmost point.
function convexHull(points) {
  const key = (p) => p.join(",");
  const pts = [...new Map(points.map((p) => [key(p), p])).values()].sort(
    (a, b) => a[0] - b[0] || a[1] - b[1],
  );
  if (pts.length <= 2) return pts;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => {
    const h = [];
    for (const p of list) {
      while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    h.pop(); // the last point starts the other half
    return h;
  };
  return [...half(pts), ...half([...pts].reverse())];
}
`,
      tests: [
        {
          args: [
            [
              [5, 0],
              [9, 2],
              [10, 6],
              [8, 9],
              [4, 10],
              [1, 8],
              [0, 4],
              [2, 1],
            ],
          ],
          expected: [
            [0, 4],
            [2, 1],
            [5, 0],
            [9, 2],
            [10, 6],
            [8, 9],
            [4, 10],
            [1, 8],
          ],
        },
        {
          args: [
            [
              [0, 0],
              [8, 0],
              [4, 0],
              [10, 5],
              [6, 9],
              [1, 7],
              [4, 4],
              [6, 3],
              [3, 6],
              [8, 6],
              [2, 2],
            ],
          ],
          expected: [
            [0, 0],
            [8, 0],
            [10, 5],
            [6, 9],
            [1, 7],
          ],
        },
      ],
    },
  ],
  visualizer: "graham-scan",
  practice: [
    {
      id: "graham-grid",
      kind: "numeric",
      prompt: "How many corners does the convex hull of a 3 × 3 grid of points have?",
      answer: 4,
      explanation:
        "The four corner points. The other edge points are on the hull's boundary but are not corners; the centre is inside.",
      hints: ["Corners are where the boundary changes direction."],
      objective: "Recognise hull corners",
    },
    {
      id: "graham-cross",
      kind: "numeric",
      prompt: "What is the cross product for o = (0, 0), a = (4, 0), b = (2, 3)?",
      answer: 12,
      explanation: "(4 − 0)(3 − 0) − (0 − 0)(2 − 0) = 12: positive, so o → a → b turns left.",
      hints: ["(a_x − o_x)(b_y − o_y) − (a_y − o_y)(b_x − o_x)"],
      objective: "Compute the orientation test",
    },
    {
      id: "graham-straight",
      kind: "mcq",
      prompt: "Why does the scan also pop the top of the stack when the turn is a straight line?",
      options: [
        "The middle point lies on an edge between the other two, so it is not a corner",
        "Straight lines make the sort unstable",
        "To keep the stack below n/2 points",
        "Because the cross product cannot be zero for distinct points",
      ],
      answer: 0,
      explanation:
        "A point between two others on a line is on the boundary but is not a corner. Popping it keeps only true corners.",
      distractors: {
        1: "The sort is unaffected by what the scan pops.",
        2: "The stack can hold every point (all of them may be corners).",
        3: "Three distinct collinear points have cross product 0.",
      },
      hints: ["Think of the 3 × 3 grid's middle edge points."],
      objective: "Handle collinear points",
    },
  ],
  exam: {
    definition:
      "Graham scan computes the convex hull of n planar points by sorting them by polar angle around the lowest point and sweeping with a stack that discards points creating non-left turns.",
    steps: [
      "Choose the lowest point p₀.",
      "Sort the rest by angle around p₀ (nearer first on ties).",
      "For each point, pop while the last two stack points and it do not turn left; push it.",
      "The stack is the hull, counter-clockwise.",
    ],
    timeComplexity: "$O(n \\log n)$ for the sort; the scan is $O(n)$ amortised.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Invariant: the stack is the convex hull of the points processed so far; a non-left turn proves the middle point is inside or on the hull of the larger set.",
    applications: [
      "Collision detection and bounding shapes",
      "Farthest pair of points (rotating calipers)",
      "Image processing (shape outlines)",
      "Preprocessing for geometric queries",
    ],
    limitations: [
      "Needs exact arithmetic to be robust",
      "Not output-sensitive: O(n log n) even when the hull is tiny",
      "Two dimensions only",
    ],
    faq: [
      {
        q: "Graham scan or Andrew's monotone chain?",
        a: "Same complexity. The monotone chain sorts by coordinates instead of angles, which is simpler to get right.",
      },
      {
        q: "Why must the start point be extreme?",
        a: "It must be a hull corner, and every other point must lie within a half-plane of it so the angular order is well defined.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Sort by angle around the lowest point.", "Stack scan popping non-left turns."],
      },
      {
        marks: 5,
        outline: ["Orientation test (1).", "Algorithm steps (2).", "O(n log n) analysis (2)."],
      },
      {
        marks: 10,
        outline: [
          "Problem and orientation test (2).",
          "Algorithm with collinear handling (3).",
          "Worked example (2).",
          "Invariant proof and amortised analysis (2).",
          "Lower bound via sorting (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. L. Graham, “An efficient algorithm for determining the convex hull of a finite planar set,” Information Processing Letters 1(4), 1972, pp. 132–133.",
      supports: "The original scan.",
    },
    {
      citation:
        "A. M. Andrew, “Another efficient algorithm for convex hulls in two dimensions,” Information Processing Letters 9(5), 1979, pp. 216–219.",
      supports: "The monotone chain variant in the JavaScript sample.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Section 33.3.",
      supports: "Graham's scan, its correctness proof and Jarvis's march.",
    },
    {
      citation:
        "T. M. Chan, “Optimal output-sensitive convex hull algorithms in two and three dimensions,” Discrete & Computational Geometry 16, 1996, pp. 361–368.",
      supports: "The O(n log h) algorithm mentioned in the advanced section.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
