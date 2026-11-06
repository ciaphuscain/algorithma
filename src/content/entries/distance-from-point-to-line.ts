import type { AlgorithmEntry } from "../types";

export const distanceFromPointToLineEntry: AlgorithmEntry = {
  slug: "distance-from-point-to-line",
  name: "Distance from Point to Line",
  aliases: ["Point-line distance", "Perpendicular distance"],
  curriculum: [405],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Computes the shortest (perpendicular) distance from a point to a line in 2D using the cross-product formula |ax + by + c| / √(a² + b²) or the area-based method.",
  tags: ["geometry", "distance", "line", "cross product"],
  prerequisites: ["Distance Between Two Points"],
  related: ["distance-between-two-points", "convex-polygon-intersection"],
  problem: {
    input: "A point P and a line defined by two points A, B (or equation ax + by + c = 0).",
    output: "The perpendicular distance from P to the line.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The shortest distance from a point to a line is always the perpendicular distance. Imagine dropping a perpendicular from the point to the line — its length is the answer.",
      },
      {
        kind: "p",
        text: "Using vectors, the area of the triangle formed by P, A, B equals ½|AB × AP|. Since area also equals ½ × base × height, the height (distance) is |AB × AP| / |AB|.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Given line through A=(x₁,y₁), B=(x₂,y₂) and point P=(px,py).",
          "Compute the cross product: cross = (x₂−x₁)(py−y₁) − (y₂−y₁)(px−x₁).",
          "Compute |AB| = √((x₂−x₁)² + (y₂−y₁)²).",
          "Distance = |cross| / |AB|.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example:** A=(0,0), B=(4,0), P=(2,3). cross = 4×3 − 0×2 = 12. |AB| = 4. Distance = 12/4 = 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "For a line ax + by + c = 0: distance = |ax₀ + by₀ + c| / √(a² + b²).",
          "For a line segment (not infinite line), check if the perpendicular foot lies within the segment; otherwise use endpoint distance.",
          "Avoid division by zero when A = B (degenerate line).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The cross-product formula gives the signed area of the parallelogram formed by AB and AP. Dividing by |AB| gives the height, which is the perpendicular distance.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(1) for a single point-line computation.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "In 3D, point-to-line distance uses |AB × AP| / |AB| where × is the 3D cross product.",
          "Point-to-plane distance in 3D: |n · (P − A)| / |n| where n is the plane normal.",
          "These primitives are building blocks for convex hull, Voronoi diagrams, and collision detection.",
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
    note: "Constant-time geometric computation.",
  },
  properties: [
    {
      label: "Method",
      value: "Cross product / area formula",
    },
    {
      label: "Dimensions",
      value: "2D (extendable to 3D)",
    },
    {
      label: "Result",
      value: "Non-negative perpendicular distance",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "point_line_distance",
      code: `def point_line_distance(ax, ay, bx, by, px, py):
    """Perpendicular distance from point (px,py) to line through (ax,ay)-(bx,by)."""
    dx, dy = bx - ax, by - ay
    cross = abs(dx * (py - ay) - dy * (px - ax))
    length = (dx * dx + dy * dy) ** 0.5
    return cross / length if length > 0 else ((px - ax)**2 + (py - ay)**2)**0.5
`,
      tests: [
        {
          args: [0, 0, 4, 0, 2, 3],
          expected: 3.0,
        },
        {
          args: [0, 0, 0, 5, 3, 0],
          expected: 3.0,
        },
        {
          args: [0, 0, 1, 1, 1, 0],
          expected: 0.7071067811865475,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pt-line-formula",
      kind: "mcq",
      prompt: "Which formula gives the distance from point (x₀,y₀) to line ax+by+c=0?",
      options: [
        "|ax₀+by₀+c| / √(a²+b²)",
        "|ax₀+by₀+c| / (a+b)",
        "√(a²x₀² + b²y₀²)",
        "(ax₀+by₀+c)²",
      ],
      answer: 0,
      explanation:
        "The standard point-to-line distance formula divides the absolute value of the line equation evaluated at the point by the norm of the normal vector.",
      hints: ["The denominator normalizes the line's normal vector."],
      objective: "Know the point-to-line distance formula",
    },
  ],
  exam: {
    definition: "Point-to-line distance uses the cross-product formula: |AB × AP| / |AB|.",
    steps: [
      "Compute cross product of direction AB and vector AP.",
      "Divide absolute value by length of AB.",
    ],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctness:
      "The cross product gives the parallelogram area; dividing by base gives the height.",
    applications: ["Computational geometry primitives", "Collision detection"],
    limitations: ["Assumes infinite line; segment case needs endpoint check"],
    faq: [
      {
        q: "How to handle line segments?",
        a: "Project P onto AB; if the foot is outside the segment, use the closer endpoint.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Cross-product formula.", "Derive from area = base × height."],
      },
    ],
  },
  references: [
    {
      citation:
        "M. de Berg et al., Computational Geometry: Algorithms and Applications, 3rd ed., Springer, 2008.",
      supports: "Point-line distance and geometric primitives.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
