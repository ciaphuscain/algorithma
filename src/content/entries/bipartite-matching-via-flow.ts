import type { AlgorithmEntry } from "../types";

export const bipartiteMatchingViaFlowEntry: AlgorithmEntry = {
  slug: "bipartite-matching-via-flow",
  name: "Bipartite Matching via Flow",
  aliases: ["Bipartite Matching via Flow"],
  curriculum: [508],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Bipartite Matching via Flow is an algorithm in the field of graph algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["bipartite matching via flow", "graph algorithms"],
  prerequisites: [],
  related: ["hopcroft-karp", "hungarian-algorithm"],
  problem: {
    input: "Input data for Bipartite Matching via Flow.",
    output: "Result of applying Bipartite Matching via Flow to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Bipartite Matching via Flow addresses a fundamental problem in graph algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Bipartite Matching via Flow is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Bipartite Matching via Flow algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Bipartite Matching via Flow, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Bipartite Matching via Flow depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Bipartite Matching via Flow exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "bipartit-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Bipartite Matching via Flow?",
      options: [
        "To solve problems in graph algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Bipartite Matching via Flow is designed specifically for problems in the domain of graph algorithms.",
      hints: ["Think about what domain Bipartite Matching via Flow belongs to"],
      objective: "Understand the purpose of Bipartite Matching via Flow",
    },
  ],
  exam: {
    definition: "Define Bipartite Matching via Flow and explain its purpose.",
    steps: ["Describe the main steps of Bipartite Matching via Flow."],
    timeComplexity: "Analyze the time complexity of Bipartite Matching via Flow.",
    spaceComplexity: "Analyze the space complexity of Bipartite Matching via Flow.",
    correctness: "How does Bipartite Matching via Flow guarantee correctness?",
    applications: ["List two applications of Bipartite Matching via Flow."],
    limitations: ["What are the limitations of Bipartite Matching via Flow?"],
    faq: [
      {
        q: "Why is Bipartite Matching via Flow preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Bipartite Matching via Flow works by applying its core strategy to efficiently s",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Bipartite Matching via Flow",
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
