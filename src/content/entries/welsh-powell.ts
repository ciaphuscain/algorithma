import type { AlgorithmEntry } from "../types";

export const welshPowellEntry: AlgorithmEntry = {
  slug: "welsh-powell",
  name: "Welsh-Powell",
  aliases: ["Welsh-Powell"],
  curriculum: [240],
  domain: "graphs",
  subcategory: "Graph Coloring",
  difficulty: "intermediate",
  summary:
    "A greedy graph coloring algorithm that processes vertices in decreasing order of degree, assigning the smallest available color to each.",
  tags: ["graph coloring", "greedy", "chromatic number", "graph"],
  prerequisites: ["DFS"],
  related: ["dsatur"],
  problem: {
    input: "An undirected graph.",
    output: "A valid vertex coloring using few colors.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "High-degree vertices are hardest to color (most constraints), so color them first. Processing in decreasing degree order with the smallest available color often produces good colorings.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Sort vertices by degree (descending).",
          "For each vertex, assign the smallest color not used by any neighbour.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Store neighbour colors in a set. Iterate colors 0, 1, 2, ... until an unused one is found.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Greedy coloring uses at most $\\Delta + 1$ colors where $\\Delta$ is the maximum degree. Welsh-Powell's ordering often does better in practice. Time: $O(V^2)$ or $O(V + E)$ with adjacency lists.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "DSATUR is a more sophisticated greedy approach using saturation degree.",
          "Optimal coloring is NP-hard in general.",
          "For planar graphs, 4 colors always suffice (Four Color Theorem).",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V^2)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Approach",
      value: "Greedy by decreasing degree",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "welsh_powell",
      code: `def welsh_powell(n, edges):
    adj = [set() for _ in range(n)]
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    order = sorted(range(n), key=lambda v: len(adj[v]), reverse=True)
    color = [-1] * n
    for v in order:
        used = {color[u] for u in adj[v] if color[u] != -1}
        c = 0
        while c in used:
            c += 1
        color[v] = c
    return color
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 0],
            ],
          ],
          expected: [0, 1, 0, 1],
        },
        {
          args: [3, []],
          expected: [0, 0, 0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "welshPowell",
      code: `function welshPowell(n, edges) {
  const adj = Array.from({length: n}, () => new Set());
  for (const [u, v] of edges) { adj[u].add(v); adj[v].add(u); }
  const order = Array.from({length: n}, (_, i) => i).sort((a, b) => adj[b].size - adj[a].size);
  const color = new Array(n).fill(-1);
  for (const v of order) {
    const used = new Set();
    for (const u of adj[v]) if (color[u] !== -1) used.add(color[u]);
    let c = 0;
    while (used.has(c)) c++;
    color[v] = c;
  }
  return color;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 0],
            ],
          ],
          expected: [0, 1, 0, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "welsh-powell-q1",
      kind: "mcq",
      prompt: "Why does Welsh-Powell sort by decreasing degree?",
      options: [
        "High-degree vertices have more constraints and should be colored first",
        "It minimizes the number of edges",
        "Lower-degree vertices don't need colors",
        "It speeds up the sort",
      ],
      answer: 0,
      explanation:
        "High-degree vertices interact with more neighbours, so coloring them first reduces the chance of needing extra colors.",
      hints: ["Think about which vertices are hardest to color."],
      objective: "Vertex ordering",
    },
  ],
  exam: {
    definition: "Welsh-Powell is a greedy coloring that processes vertices by decreasing degree.",
    steps: ["Sort by degree.", "Assign smallest unused color."],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "Greedy assignment ensures no two adjacent vertices share a color.",
    applications: ["register allocation", "scheduling", "map coloring"],
    limitations: ["Not optimal in general"],
    faq: [
      {
        q: "Does it always find the minimum number of colors?",
        a: "No, optimal coloring is NP-hard. Welsh-Powell uses at most Δ+1 colors.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe greedy coloring (2).",
          "Degree ordering rationale (1).",
          "Analyze bound (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. J. A. Welsh and M. B. Powell, 'An Upper Bound for the Chromatic Number of a Graph and its Application to Timetabling Problems', The Computer Journal, 1967.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
