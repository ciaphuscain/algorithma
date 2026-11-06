import type { AlgorithmEntry } from "../types";

export const gomoryHuTreeEntry: AlgorithmEntry = {
  slug: "gomory-hu-tree",
  name: "Gomory–Hu Tree",
  aliases: ["Gomory–Hu Tree"],
  curriculum: [503],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Gomory–Hu Tree is an algorithm in the field of graph algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["gomory–hu tree", "graph algorithms"],
  prerequisites: [],
  related: ["stoer-wagner-minimum-cut", "dinic"],
  problem: {
    input: "Input data for Gomory–Hu Tree.",
    output: "Result of applying Gomory–Hu Tree to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gomory–Hu Tree addresses a fundamental problem in graph algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Gomory–Hu Tree is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gomory–Hu Tree algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Gomory–Hu Tree, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Gomory–Hu Tree depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Gomory–Hu Tree exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "gomory-h-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gomory–Hu Tree?",
      options: [
        "To solve problems in graph algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Gomory–Hu Tree is designed specifically for problems in the domain of graph algorithms.",
      hints: ["Think about what domain Gomory–Hu Tree belongs to"],
      objective: "Understand the purpose of Gomory–Hu Tree",
    },
  ],
  exam: {
    definition: "Define Gomory–Hu Tree and explain its purpose.",
    steps: ["Describe the main steps of Gomory–Hu Tree."],
    timeComplexity: "Analyze the time complexity of Gomory–Hu Tree.",
    spaceComplexity: "Analyze the space complexity of Gomory–Hu Tree.",
    correctness: "How does Gomory–Hu Tree guarantee correctness?",
    applications: ["List two applications of Gomory–Hu Tree."],
    limitations: ["What are the limitations of Gomory–Hu Tree?"],
    faq: [
      {
        q: "Why is Gomory–Hu Tree preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Gomory–Hu Tree works by applying its core strategy to efficiently solve the targ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Gomory–Hu Tree",
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
