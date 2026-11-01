import type { AlgorithmEntry } from "../types";

export const smallestEnclosingCircleWelzlSAlgorithmEntry: AlgorithmEntry = {
  slug: "smallest-enclosing-circle-welzl-s-algorithm",
  name: "Smallest Enclosing Circle (Welzl's Algorithm)",
  aliases: ["Welzl's Algorithm", "Minimum Enclosing Circle", "MEC"],
  curriculum: [424],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Welzl's algorithm finds the smallest circle enclosing a set of points in expected O(n) time using a randomized incremental approach.",
  tags: ["computational geometry", "enclosing circle", "randomized", "incremental"],
  prerequisites: ["Geometry Basics"],
  related: [],
  problem: {
    input: "A set of 2D points.",
    output: "The center and radius of the smallest circle containing all points.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The smallest enclosing circle is defined by at most 3 points on its boundary. Welzl's algorithm processes points one at a time: if a point is already inside the current circle, skip it; otherwise, the new circle must pass through this point, and we recursively find the smallest circle through it and the remaining points.",
      },
      {
        kind: "p",
        text: "Randomizing the order of points ensures that the expensive case (point outside current circle) happens rarely, giving expected O(n) time despite worst-case O(n^3) with adversarial input.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Shuffle the points randomly.",
          "Start with an empty boundary set R.",
          "Process points one by one. If point p is inside the current MEC, continue.",
          "If p is outside, recursively find MEC({p1,...,p_{i-1}}, R ∪ {p}).",
          "Base case: |R| = 3 or no points left → compute circle from R (0, 1, 2, or 3 points).",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The circle through 0 points is degenerate; through 1 point has radius 0; through 2 is the diameter circle; through 3 is the circumscribed circle.",
          "Use iterative version to avoid stack overflow for large inputs.",
          "Numerical stability: use exact or robust arithmetic for the circumcircle computation.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Expected time: O(n). Each point has probability ≤ 3/i of being on the boundary of the MEC of the first i points, so the expected number of recursive calls is O(n). Worst case is O(n^3) without randomization.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Generalises to smallest enclosing ball in higher dimensions (Welzl's algorithm works in d dimensions with O(n) expected time for fixed d).",
          "Applications in facility location, collision detection, and bounding volume hierarchies.",
          "The result is unique and can be computed exactly with rational arithmetic.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n^3)",
    },
    space: "O(n)",
    worstClass: "n",
    note: "Expected O(n) with random shuffling; O(n^3) worst case without.",
  },
  properties: [
    {
      label: "Boundary points",
      value: "At most 3",
    },
    {
      label: "Expected time",
      value: "O(n)",
    },
    {
      label: "Deterministic",
      value: "No (randomized)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "smallest_enclosing_circle",
      code: `def smallest_enclosing_circle(points):
    """Find smallest enclosing circle. Returns (cx, cy, r) rounded to 6 decimals."""
    import random, math
    random.seed(42)
    pts = list(points)
    random.shuffle(pts)
    def dist(a, b): return math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)
    def circle_from_1(p): return (p[0], p[1], 0)
    def circle_from_2(a, b):
        return ((a[0]+b[0])/2, (a[1]+b[1])/2, dist(a, b)/2)
    def circle_from_3(a, b, c):
        ax,ay=a; bx,by=b; cx,cy=c
        d = 2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by))
        if abs(d) < 1e-10: return circle_from_2(a, b) if dist(a,b)>dist(b,c) else circle_from_2(b,c)
        ux = ((ax*ax+ay*ay)*(by-cy)+(bx*bx+by*by)*(cy-ay)+(cx*cx+cy*cy)*(ay-by))/d
        uy = ((ax*ax+ay*ay)*(cx-bx)+(bx*bx+by*by)*(ax-cx)+(cx*cx+cy*cy)*(bx-ax))/d
        return (ux, uy, dist((ux,uy), a))
    def in_circle(c, p): return dist((c[0],c[1]), p) <= c[2] + 1e-10
    def welzl(P, R):
        if len(P)==0 or len(R)==3:
            if len(R)==0: return (0,0,0)
            if len(R)==1: return circle_from_1(R[0])
            if len(R)==2: return circle_from_2(R[0],R[1])
            return circle_from_3(R[0],R[1],R[2])
        p = P[0]
        c = welzl(P[1:], R)
        if in_circle(c, p): return c
        return welzl(P[1:], R + [p])
    c = welzl(pts, [])
    return [round(c[0],6), round(c[1],6), round(c[2],6)]
`,
      tests: [
        {
          args: [
            [
              [0, 0],
              [1, 0],
              [0, 1],
              [1, 1],
            ],
          ],
          expected: [0.5, 0.5, 0.707107],
        },
        {
          args: [
            [
              [0, 0],
              [2, 0],
              [1, 0],
            ],
          ],
          expected: [1.0, 0.0, 1.0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "welzl-boundary",
      kind: "mcq",
      prompt: "At most how many points define the smallest enclosing circle?",
      options: ["3", "2", "n", "4"],
      answer: 0,
      explanation:
        "The smallest enclosing circle passes through at most 3 points on its boundary (in 2D).",
      hints: ["Think about how a circle is uniquely determined."],
      objective: "Know the boundary bound",
    },
  ],
  exam: {
    definition:
      "Welzl's algorithm finds the smallest enclosing circle of n points in expected O(n) time via randomized incremental construction.",
    steps: [
      "Shuffle points.",
      "Process each: if inside, skip; if outside, recurse with it on boundary.",
      "Base case: circle from ≤3 boundary points.",
    ],
    timeComplexity: "Expected O(n)",
    spaceComplexity: "O(n)",
    correctness: "Each point has O(1/i) probability of triggering recursion; sums to O(n).",
    applications: ["Collision detection", "Facility location", "Bounding volumes"],
    limitations: ["Worst case O(n^3) without randomization", "Numerical precision issues"],
    faq: [
      {
        q: "Does it generalize to 3D?",
        a: "Yes, smallest enclosing ball uses the same approach with at most 4 boundary points.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Incremental algorithm (1).", "Expected time analysis (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "E. Welzl, 'Smallest enclosing disks (balls and ellipsoids),' New Results and New Trends in Computer Science, LNCS 555, 1991.",
      supports: "The original algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
