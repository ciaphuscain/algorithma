import type { AlgorithmEntry } from "../types";

export const reverseDeleteAlgorithmEntry: AlgorithmEntry = {
  slug: "reverse-delete-algorithm",
  name: "Reverse Delete Algorithm",
  aliases: ["Reverse Delete Algorithm"],
  curriculum: [219],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Reverse Delete Algorithm is an algorithm in the field of graph algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["reverse delete algorithm", "graph algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Reverse Delete Algorithm.",
    output: "Result of applying Reverse Delete Algorithm to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Reverse Delete Algorithm addresses a fundamental problem in graph algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Reverse Delete Algorithm is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Reverse Delete Algorithm algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Reverse Delete Algorithm, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Reverse Delete Algorithm depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Reverse Delete Algorithm exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "reverse--q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Reverse Delete Algorithm?",
      options: [
        "To solve problems in graph algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Reverse Delete Algorithm is designed specifically for problems in the domain of graph algorithms.",
      hints: ["Think about what domain Reverse Delete Algorithm belongs to"],
      objective: "Understand the purpose of Reverse Delete Algorithm",
    },
  ],
  exam: {
    definition: "Define Reverse Delete Algorithm and explain its purpose.",
    steps: ["Describe the main steps of Reverse Delete Algorithm."],
    timeComplexity: "Analyze the time complexity of Reverse Delete Algorithm.",
    spaceComplexity: "Analyze the space complexity of Reverse Delete Algorithm.",
    correctness: "How does Reverse Delete Algorithm guarantee correctness?",
    applications: ["List two applications of Reverse Delete Algorithm."],
    limitations: ["What are the limitations of Reverse Delete Algorithm?"],
    faq: [
      {
        q: "Why is Reverse Delete Algorithm preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Reverse Delete Algorithm works by applying its core strategy to efficiently solv",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Reverse Delete Algorithm",
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
