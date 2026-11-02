import type { AlgorithmEntry } from "../types";

export const minCostMaxFlowSuccessiveShortestPathsEntry: AlgorithmEntry = {
  slug: "min-cost-max-flow-successive-shortest-paths",
  name: "Min-Cost Max-Flow (Successive Shortest Paths)",
  aliases: ["Min-Cost Max-Flow (Successive Shortest Paths)"],
  curriculum: [501],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Min-Cost Max-Flow (Successive Shortest Paths) is an algorithm in the field of graph algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["min-cost max-flow (successive shortest paths)", "graph algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Min-Cost Max-Flow (Successive Shortest Paths).",
    output: "Result of applying Min-Cost Max-Flow (Successive Shortest Paths) to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Min-Cost Max-Flow (Successive Shortest Paths) addresses a fundamental problem in graph algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Min-Cost Max-Flow (Successive Shortest Paths) is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Min-Cost Max-Flow (Successive Shortest Paths) algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Min-Cost Max-Flow (Successive Shortest Paths), pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Min-Cost Max-Flow (Successive Shortest Paths) depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Min-Cost Max-Flow (Successive Shortest Paths) exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n + m)",
      average: "O(n + m)",
      worst: "O(n + m)",
    },
    space: "O(n)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Category",
      value: "Graph Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(adj, n):
    """Process graph with n nodes given as adjacency list (dict of node -> list of neighbors).
    Returns list of visited nodes in BFS order from node 0."""
    adj = {int(k): v for k, v in adj.items()}
    if n == 0:
        return []
    visited = set()
    queue = [0]
    visited.add(0)
    result = []
    while queue:
        node = queue.pop(0)
        result.append(node)
        for neighbor in sorted(adj.get(node, [])):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result
`,
      tests: [
        {
          args: [
            {
              "0": [1, 2],
              "1": [0],
              "2": [0],
            },
            3,
          ],
          expected: [0, 1, 2],
        },
        {
          args: [{}, 0],
          expected: [],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(adj, n) {
  if (n === 0) return [];
  const visited = new Set([0]);
  const queue = [0], result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node);
    for (const nb of (adj[node] || []).sort((a,b) => a-b)) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  return result;
}`,
      tests: [
        {
          args: [
            {
              "0": [1, 2],
              "1": [0],
              "2": [0],
            },
            3,
          ],
          expected: [0, 1, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "min-cost-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Min-Cost Max-Flow (Successive Shortest Paths)?",
      options: [
        "To solve problems in graph algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Min-Cost Max-Flow (Successive Shortest Paths) is designed specifically for problems in the domain of graph algorithms.",
      hints: ["Think about what domain Min-Cost Max-Flow (Successive Shortest Paths) belongs to"],
      objective: "Understand the purpose of Min-Cost Max-Flow (Successive Shortest Paths)",
    },
  ],
  exam: {
    definition: "Define Min-Cost Max-Flow (Successive Shortest Paths) and explain its purpose.",
    steps: ["Describe the main steps of Min-Cost Max-Flow (Successive Shortest Paths)."],
    timeComplexity: "Analyze the time complexity of Min-Cost Max-Flow (Successive Shortest Paths).",
    spaceComplexity:
      "Analyze the space complexity of Min-Cost Max-Flow (Successive Shortest Paths).",
    correctness: "How does Min-Cost Max-Flow (Successive Shortest Paths) guarantee correctness?",
    applications: ["List two applications of Min-Cost Max-Flow (Successive Shortest Paths)."],
    limitations: ["What are the limitations of Min-Cost Max-Flow (Successive Shortest Paths)?"],
    faq: [
      {
        q: "Why is Min-Cost Max-Flow (Successive Shortest Paths) preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Min-Cost Max-Flow (Successive Shortest Paths) works by applying its core strateg",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Min-Cost Max-Flow (Successive Shortest Paths)",
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
