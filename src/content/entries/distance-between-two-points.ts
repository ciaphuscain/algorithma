import type { AlgorithmEntry } from "../types";

export const distanceBetweenTwoPointsEntry: AlgorithmEntry = {
  slug: "distance-between-two-points",
  name: "Distance Between Two Points",
  aliases: ["Euclidean distance", "L2 distance"],
  curriculum: [404],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Computes the Euclidean distance between two points in d-dimensional space as the square root of the sum of squared coordinate differences.",
  tags: ["geometry", "distance", "Euclidean", "metric"],
  prerequisites: [],
  related: ["distance-from-point-to-line"],
  problem: {
    input: "Two points p and q in d-dimensional space.",
    output: "The Euclidean distance ||p − q||₂.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The Euclidean distance is the straight-line distance between two points, generalizing the Pythagorean theorem to any number of dimensions. In 2D: √((x₂−x₁)² + (y₂−y₁)²).",
      },
      {
        kind: "p",
        text: "It is the most common distance metric and satisfies the triangle inequality, symmetry, and non-negativity (a proper metric).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute the difference in each coordinate: Δᵢ = pᵢ − qᵢ.",
          "Square each difference: Δᵢ².",
          "Sum all squared differences.",
          "Take the square root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example:** p=(1,2,3), q=(4,6,3). Differences: (3,4,0). Squares: (9,16,0). Sum: 25. Distance: √25 = 5.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "For comparisons only, skip the square root and compare squared distances.",
          "Use math.hypot in Python for numerical stability in 2D/3D.",
          "Manhattan (L1) and Chebyshev (L∞) distances are useful alternatives.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "d(p, q) = √(Σ(pᵢ − qᵢ)²) for i = 1..d. This is the L2 norm of the difference vector.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(d) time and O(1) space for d-dimensional points.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For approximate nearest-neighbor search, locality-sensitive hashing uses random projections of Euclidean distance.",
          "Squared Euclidean distance avoids the expensive square root and preserves ordering for nearest-neighbor queries.",
          "In high dimensions, distances concentrate: all pairwise distances become nearly equal (curse of dimensionality).",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(d)",
      average: "O(d)",
      worst: "O(d)",
    },
    space: "O(1)",
    worstClass: "n",
    note: "d = number of dimensions.",
  },
  properties: [
    {
      label: "Metric",
      value: "Yes (satisfies triangle inequality)",
    },
    {
      label: "Dimensions",
      value: "Works in any d",
    },
    {
      label: "Numerics",
      value: "Use squared distance when possible",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "euclidean_distance",
      code: `def euclidean_distance(p, q):
    """Euclidean distance between two points (lists of coordinates)."""
    return sum((a - b) ** 2 for a, b in zip(p, q)) ** 0.5
`,
      tests: [
        {
          args: [
            [0, 0],
            [3, 4],
          ],
          expected: 5.0,
        },
        {
          args: [
            [1, 2, 3],
            [4, 6, 3],
          ],
          expected: 5.0,
        },
        {
          args: [[0], [0]],
          expected: 0.0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "euclid-dist-skip-sqrt",
      kind: "mcq",
      prompt:
        "When comparing which of two points is closer to a query, what optimization can be applied?",
      options: [
        "Compare squared distances instead",
        "Use Manhattan distance",
        "Round coordinates",
        "Use absolute differences",
      ],
      answer: 0,
      explanation: "Squared distance preserves the ordering and avoids the expensive square root.",
      hints: ["The square root is monotonic."],
      objective: "Know when to skip the square root",
    },
  ],
  exam: {
    definition: "Euclidean distance is √(Σ(pᵢ − qᵢ)²), the straight-line distance in d dimensions.",
    steps: ["Compute coordinate differences.", "Square and sum.", "Take square root."],
    timeComplexity: "O(d)",
    spaceComplexity: "O(1)",
    correctness: "Follows from the Pythagorean theorem generalized to d dimensions.",
    applications: ["Nearest-neighbor search", "Clustering", "Collision detection"],
    limitations: ["Expensive square root for comparisons", "Curse of dimensionality in high-d"],
    faq: [
      {
        q: "Why use squared distance?",
        a: "It preserves ordering for comparisons and avoids the costly square root.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Formula derivation from Pythagorean theorem.", "O(d) complexity."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009.",
      supports: "Computational geometry basics.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
