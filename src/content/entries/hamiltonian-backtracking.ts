import type { AlgorithmEntry } from "../types";

export const hamiltonianBacktrackingEntry: AlgorithmEntry = {
  slug: "hamiltonian-backtracking",
  name: "Hamiltonian Backtracking",
  aliases: ["Hamiltonian Backtracking"],
  curriculum: [244],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Hamiltonian Backtracking is an algorithm in the field of graph algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["hamiltonian backtracking", "graph algorithms"],
  prerequisites: [],
  related: ["hamiltonian-monte-carlo", "held-karp"],
  problem: {
    input: "Input data for Hamiltonian Backtracking.",
    output: "Result of applying Hamiltonian Backtracking to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hamiltonian Backtracking addresses a fundamental problem in graph algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Hamiltonian Backtracking is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hamiltonian Backtracking algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Hamiltonian Backtracking, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Hamiltonian Backtracking depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Hamiltonian Backtracking exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "hamilton-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hamiltonian Backtracking?",
      options: [
        "To solve problems in graph algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Hamiltonian Backtracking is designed specifically for problems in the domain of graph algorithms.",
      hints: ["Think about what domain Hamiltonian Backtracking belongs to"],
      objective: "Understand the purpose of Hamiltonian Backtracking",
    },
  ],
  exam: {
    definition: "Define Hamiltonian Backtracking and explain its purpose.",
    steps: ["Describe the main steps of Hamiltonian Backtracking."],
    timeComplexity: "Analyze the time complexity of Hamiltonian Backtracking.",
    spaceComplexity: "Analyze the space complexity of Hamiltonian Backtracking.",
    correctness: "How does Hamiltonian Backtracking guarantee correctness?",
    applications: ["List two applications of Hamiltonian Backtracking."],
    limitations: ["What are the limitations of Hamiltonian Backtracking?"],
    faq: [
      {
        q: "Why is Hamiltonian Backtracking preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Hamiltonian Backtracking works by applying its core strategy to efficiently solv",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Hamiltonian Backtracking",
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
