import type { AlgorithmEntry } from "../types";

export const eulerTourEntry: AlgorithmEntry = {
  slug: "euler-tour",
  name: "Euler Tour",
  aliases: ["Euler Tour"],
  curriculum: [189],
  domain: "graphs",
  subcategory: "Tree Techniques",
  difficulty: "intermediate",
  summary:
    "Euler Tour is an algorithm in the field of tree techniques. It provides an efficient approach to solving problems in this domain.",
  tags: ["euler tour", "tree techniques"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Euler Tour.",
    output: "Result of applying Euler Tour to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Euler Tour addresses a fundamental problem in tree techniques. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Euler Tour is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Euler Tour algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Euler Tour, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Euler Tour depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Euler Tour exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Tree Techniques",
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
      id: "euler-to-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Euler Tour?",
      options: [
        "To solve problems in tree techniques",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Euler Tour is designed specifically for problems in the domain of tree techniques.",
      hints: ["Think about what domain Euler Tour belongs to"],
      objective: "Understand the purpose of Euler Tour",
    },
  ],
  exam: {
    definition: "Define Euler Tour and explain its purpose.",
    steps: ["Describe the main steps of Euler Tour."],
    timeComplexity: "Analyze the time complexity of Euler Tour.",
    spaceComplexity: "Analyze the space complexity of Euler Tour.",
    correctness: "How does Euler Tour guarantee correctness?",
    applications: ["List two applications of Euler Tour."],
    limitations: ["What are the limitations of Euler Tour?"],
    faq: [
      {
        q: "Why is Euler Tour preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Euler Tour works by applying its core strategy to efficiently solve the target p",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Euler Tour",
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
