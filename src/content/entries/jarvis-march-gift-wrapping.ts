import type { AlgorithmEntry } from "../types";

export const jarvisMarchGiftWrappingEntry: AlgorithmEntry = {
  slug: "jarvis-march-gift-wrapping",
  name: "Jarvis March (Gift Wrapping)",
  aliases: ["Gift Wrapping", "Jarvis March"],
  curriculum: [407],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Computes the convex hull of a point set by starting from the leftmost point and repeatedly choosing the most counter-clockwise next point, wrapping around until returning to the start.",
  tags: ["convex hull", "geometry", "gift wrapping"],
  prerequisites: ["Cross Product"],
  related: ["graham-scan", "andrew-s-monotone-chain"],
  problem: {
    input: "A set of n 2D points.",
    output: "The vertices of the convex hull in counter-clockwise order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine wrapping a taut string around a set of nails on a board. Start from the leftmost nail and sweep the string counter-clockwise. Each time it catches on the next nail, that nail is on the convex hull.",
      },
      {
        kind: "p",
        text: "The algorithm mimics this: from the current hull vertex, it scans all points to find which one makes the smallest counter-clockwise angle — that point is next on the hull.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start from the leftmost point (smallest x-coordinate).",
          "From the current point, find the point q such that the triple (current, q, r) is counter-clockwise for all other points r. This is the most counter-clockwise point.",
          "Add q to the hull and set it as current.",
          "Repeat until we return to the starting point.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Points: (0,0), (1,1), (2,0), (1,-1), (1,0). Leftmost is (0,0). From (0,0), most CCW is (1,1). From (1,1), most CCW is (2,0). From (2,0), most CCW is (1,-1). From (1,-1), most CCW is (0,0). Hull: [(0,0), (1,1), (2,0), (1,-1)].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use the cross product to compare angles: cross(O,A,B) > 0 means A is more counter-clockwise than B from O.",
          "Handle collinear points by choosing the farthest one.",
          "Time per hull vertex is O(n), total O(nh) where h is the number of hull vertices.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each step scans all n points to find the next hull vertex, taking $O(n)$. There are $h$ hull vertices, so total time is $O(nh)$. In the worst case $h = n$ (all points on hull), giving $O(n^2)$.",
      },
      {
        kind: "p",
        text: "Space is $O(h)$ for storing the hull. This is output-sensitive: faster than $O(n \\log n)$ algorithms when $h$ is small.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Chan's algorithm combines Jarvis march with Graham scan to achieve $O(n \\log h)$ time.",
          "Jarvis march extends naturally to 3D convex hulls (gift wrapping faces).",
          "For $h = O(\\log n)$, Jarvis march is faster than Graham scan.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n h)",
      worst: "O(n^2)",
    },
    space: "O(h)",
    worstClass: "n^2",
    note: "h = number of convex hull vertices, worst case h = n.",
  },
  properties: [
    {
      label: "Output-sensitive",
      value: "Yes, O(nh)",
    },
    {
      label: "In-place",
      value: "No, stores hull separately",
    },
    {
      label: "Handles collinear",
      value: "With distance tie-breaking",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "jarvis_march",
      code: `def jarvis_march(points):
    """Return convex hull vertices in CCW order. Points are (x, y) tuples."""
    n = len(points)
    if n < 3:
        return list(points)
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    start = min(range(n), key=lambda i: (points[i][0], points[i][1]))
    hull = []
    current = start
    while True:
        hull.append(points[current])
        candidate = 0
        for i in range(1, n):
            if candidate == current:
                candidate = i
                continue
            c = cross(points[current], points[candidate], points[i])
            if c < 0 or (c == 0 and
                ((points[i][0]-points[current][0])**2 + (points[i][1]-points[current][1])**2) >
                ((points[candidate][0]-points[current][0])**2 + (points[candidate][1]-points[current][1])**2)):
                candidate = i
        current = candidate
        if current == start:
            break
    return hull
`,
      tests: [
        {
          args: [
            [
              [0, 0],
              [1, 1],
              [2, 0],
              [1, -1],
              [1, 0],
            ],
          ],
          expected: [
            [0, 0],
            [1, -1],
            [2, 0],
            [1, 1],
          ],
        },
        {
          args: [
            [
              [0, 0],
              [1, 0],
              [0, 1],
            ],
          ],
          expected: [
            [0, 0],
            [1, 0],
            [0, 1],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "jarvis-complexity",
      kind: "mcq",
      prompt: "When is Jarvis march faster than Graham scan?",
      options: [
        "When the number of hull vertices h is small",
        "Always",
        "When points are sorted",
        "When n is small",
      ],
      answer: 0,
      explanation: "Jarvis march is O(nh) vs Graham's O(n log n), so it wins when h << log n.",
      hints: ["Compare O(nh) with O(n log n)."],
      objective: "Understand output-sensitive complexity",
    },
  ],
  exam: {
    definition:
      "Jarvis march computes the convex hull by repeatedly selecting the most counter-clockwise point from the current hull vertex.",
    steps: [
      "Start from leftmost point.",
      "Scan all points to find most CCW.",
      "Add to hull, repeat until start.",
    ],
    timeComplexity: "$O(nh)$, worst $O(n^2)$",
    spaceComplexity: "$O(h)$",
    correctness:
      "Each step correctly identifies the next hull edge by checking all points; the process terminates when it returns to the start.",
    applications: ["Convex hull computation", "Collision detection", "3D hull (face wrapping)"],
    limitations: ["$O(n^2)$ worst case when all points on hull"],
    faq: [
      {
        q: "What makes it output-sensitive?",
        a: "Runtime depends on h (hull size), not just n.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Algorithm description and CCW test (1). Complexity analysis (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "R. A. Jarvis, 'On the identification of the convex hull of a finite set of points in the plane,' Information Processing Letters, 2(1), 1973.",
      supports: "Original gift wrapping algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
