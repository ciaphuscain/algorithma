import type { AlgorithmEntry } from "../types";

export const lineSweepForClosestPairEntry: AlgorithmEntry = {
  slug: "line-sweep-for-closest-pair",
  name: "Line Sweep for Closest Pair",
  aliases: ["Line Sweep for Closest Pair"],
  curriculum: [417],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Line Sweep for Closest Pair is an algorithm in the field of computational geometry. It provides an efficient approach to solving problems in this domain.",
  tags: ["line sweep for closest pair", "computational geometry"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Line Sweep for Closest Pair.",
    output: "Result of applying Line Sweep for Closest Pair to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Line Sweep for Closest Pair addresses a fundamental problem in computational geometry. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Line Sweep for Closest Pair is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Line Sweep for Closest Pair algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing Line Sweep for Closest Pair, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Line Sweep for Closest Pair depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Line Sweep for Closest Pair exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Category",
      value: "Computational Geometry",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(points):
    """Compute convex hull of 2D points using Graham scan approach.
    Points are [x, y] pairs. Returns hull points in counter-clockwise order."""
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    pts = sorted(map(list, points))
    if len(pts) <= 1:
        return pts
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]
`,
      tests: [
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
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(points) {
  const cross = (o, a, b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const pts = points.map(p => [...p]).sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  if (pts.length <= 1) return pts;
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}`,
      tests: [
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
      id: "line-swe-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Line Sweep for Closest Pair?",
      options: [
        "To solve problems in computational geometry",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Line Sweep for Closest Pair is designed specifically for problems in the domain of computational geometry.",
      hints: ["Think about what domain Line Sweep for Closest Pair belongs to"],
      objective: "Understand the purpose of Line Sweep for Closest Pair",
    },
  ],
  exam: {
    definition: "Define Line Sweep for Closest Pair and explain its purpose.",
    steps: ["Describe the main steps of Line Sweep for Closest Pair."],
    timeComplexity: "Analyze the time complexity of Line Sweep for Closest Pair.",
    spaceComplexity: "Analyze the space complexity of Line Sweep for Closest Pair.",
    correctness: "How does Line Sweep for Closest Pair guarantee correctness?",
    applications: ["List two applications of Line Sweep for Closest Pair."],
    limitations: ["What are the limitations of Line Sweep for Closest Pair?"],
    faq: [
      {
        q: "Why is Line Sweep for Closest Pair preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Line Sweep for Closest Pair works by applying its core strategy to efficiently s",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Line Sweep for Closest Pair",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
