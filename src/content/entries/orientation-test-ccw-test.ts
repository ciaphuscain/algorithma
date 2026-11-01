import type { AlgorithmEntry } from "../types";

export const orientationTestCcwTestEntry: AlgorithmEntry = {
  slug: "orientation-test-ccw-test",
  name: "Orientation Test (CCW Test)",
  aliases: ["CCW Test", "Cross Product Orientation", "Turn Direction"],
  curriculum: [401],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Determines whether three points make a left turn (counter-clockwise), right turn (clockwise), or are collinear, using the sign of the cross product of the two edge vectors.",
  tags: ["geometry", "cross product", "orientation", "collinear", "convex hull"],
  prerequisites: ["Vectors"],
  related: ["andrew-s-monotone-chain", "graham-scan"],
  problem: {
    input: "Three 2D points P, Q, R.",
    output: "1 if the turn P→Q→R is counter-clockwise, −1 if clockwise, 0 if collinear.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine walking from P to Q to R. If you turn left, the points are in counter-clockwise order; if you turn right, clockwise. The cross product of the vectors PQ and QR captures this: its sign tells the turn direction, and zero means the points lie on a single line.",
      },
      {
        kind: "p",
        text: "This tiny test is a building block for nearly every computational geometry algorithm — convex hulls, polygon containment, segment intersection, and more.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute vectors $\\vec{PQ} = (Q_x - P_x, Q_y - P_y)$ and $\\vec{PR} = (R_x - P_x, R_y - P_y)$.",
          "Compute the 2D cross product: $\\text{cross} = (Q_x - P_x)(R_y - P_y) - (Q_y - P_y)(R_x - P_x)$.",
          "If cross > 0 → CCW (left turn). If cross < 0 → CW (right turn). If cross = 0 → collinear.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** P = (0,0), Q = (1,0), R = (1,1). cross = (1)(1) − (0)(1) = 1 > 0 → CCW.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use integer coordinates or exact arithmetic to avoid floating-point issues with collinear checks.",
          "The sign convention depends on the coordinate system; in screen coordinates (y down), CCW and CW swap.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The cross product $(Q-P) \\times (R-P)$ equals the signed area of the parallelogram formed by the two vectors, and half of it is the signed area of triangle PQR. The test is $O(1)$ time and space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used as the predicate in Graham scan and Andrew's monotone chain convex hull algorithms.",
          "Robust implementations use exact predicates (Shewchuk's orient2d) to handle near-collinear cases.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
    },
    space: "O(1)",
    worstClass: "1",
    note: "A single arithmetic expression.",
  },
  properties: [
    {
      label: "Time",
      value: "$O(1)$",
    },
    {
      label: "Exact for integers",
      value: "Yes, if using integer arithmetic",
    },
    {
      label: "Foundation",
      value: "Building block for convex hull, polygon tests",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "orientation",
      code: `def orientation(px, py, qx, qy, rx, ry):
    """Return 1 for CCW, -1 for CW, 0 for collinear."""
    cross = (qx - px) * (ry - py) - (qy - py) * (rx - px)
    if cross > 0:
        return 1
    elif cross < 0:
        return -1
    return 0
`,
      tests: [
        {
          args: [0, 0, 1, 0, 1, 1],
          expected: 1,
        },
        {
          args: [0, 0, 1, 0, 1, -1],
          expected: -1,
        },
        {
          args: [0, 0, 1, 1, 2, 2],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "orient-sign",
      kind: "mcq",
      prompt: "What does a positive cross product of PQ × PR indicate?",
      options: ["Counter-clockwise turn", "Clockwise turn", "Collinear", "Undefined"],
      answer: 0,
      explanation:
        "A positive cross product means the turn from P to Q to R goes counter-clockwise (left turn).",
      hints: ["Think about the sign of the signed area of triangle PQR."],
      objective: "Understand the orientation test",
    },
  ],
  exam: {
    definition:
      "The orientation test uses the sign of the 2D cross product to classify the turn direction of three points as CCW, CW, or collinear.",
    steps: ["Compute cross = (Qx−Px)(Ry−Py) − (Qy−Py)(Rx−Px).", "Return sign(cross)."],
    timeComplexity: "$O(1)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "The cross product equals twice the signed area of triangle PQR; its sign is the orientation.",
    applications: ["Convex hull algorithms", "Segment intersection", "Polygon containment"],
    limitations: ["Floating-point imprecision for near-collinear points"],
    faq: [
      {
        q: "Why integers?",
        a: "Integer cross products are exact, avoiding rounding errors that flip the sign for near-collinear points.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Cross product formula and sign interpretation (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "F. P. Preparata, M. I. Shamos, Computational Geometry: An Introduction, Springer, 1985.",
      supports: "Foundation of orientation-based geometric predicates.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
