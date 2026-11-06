import type { AlgorithmEntry } from "../types";

export const pointOnSegmentTestEntry: AlgorithmEntry = {
  slug: "point-on-segment-test",
  name: "Point on Segment Test",
  aliases: ["Point on Segment Test"],
  curriculum: [403],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Point on Segment Test is an algorithm in the field of computational geometry. It provides an efficient approach to solving problems in this domain.",
  tags: ["point on segment test", "computational geometry"],
  prerequisites: [],
  related: ["orientation-test-ccw-test", "distance-from-point-to-line"],
  problem: {
    input: "Input data for Point on Segment Test.",
    output: "Result of applying Point on Segment Test to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Point on Segment Test addresses a fundamental problem in computational geometry. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Point on Segment Test is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Point on Segment Test algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Point on Segment Test, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Point on Segment Test depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Point on Segment Test exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "point-on-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Point on Segment Test?",
      options: [
        "To solve problems in computational geometry",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Point on Segment Test is designed specifically for problems in the domain of computational geometry.",
      hints: ["Think about what domain Point on Segment Test belongs to"],
      objective: "Understand the purpose of Point on Segment Test",
    },
  ],
  exam: {
    definition: "Define Point on Segment Test and explain its purpose.",
    steps: ["Describe the main steps of Point on Segment Test."],
    timeComplexity: "Analyze the time complexity of Point on Segment Test.",
    spaceComplexity: "Analyze the space complexity of Point on Segment Test.",
    correctness: "How does Point on Segment Test guarantee correctness?",
    applications: ["List two applications of Point on Segment Test."],
    limitations: ["What are the limitations of Point on Segment Test?"],
    faq: [
      {
        q: "Why is Point on Segment Test preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Point on Segment Test works by applying its core strategy to efficiently solve t",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Point on Segment Test",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
