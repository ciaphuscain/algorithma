import type { AlgorithmEntry } from "../types";

export const iterativeDeepeningAEntry: AlgorithmEntry = {
  slug: "iterative-deepening-a",
  name: "Iterative Deepening A*",
  aliases: ["IDA*"],
  curriculum: [451],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary:
    "Combines the memory efficiency of depth-first search with the optimality of A* by performing repeated depth-limited searches with increasing f-cost thresholds.",
  tags: ["search", "heuristic", "optimal", "memory efficient"],
  prerequisites: ["A*", "DFS"],
  related: ["a-star", "dfs", "dijkstra"],
  problem: {
    input:
      "A weighted graph or state space with a start node, goal test, and admissible heuristic.",
    output: "An optimal path from start to goal, or failure if none exists.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A* is optimal but can use too much memory storing the open set. IDA* trades time for memory: it runs depth-first searches, each limited by an f-cost threshold, incrementing the threshold to the smallest f-cost that exceeded the previous limit.",
      },
      {
        kind: "p",
        text: "Like iterative deepening DFS, earlier iterations are wasted work, but the exponential growth of the search tree means the last iteration dominates, so the overhead is modest.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set threshold $t = h(\\text{start})$.",
          "Run a depth-first search. At each node, compute $f = g + h$. If $f > t$, prune and return $f$ as a candidate for the next threshold.",
          "If the goal is found, return the path.",
          "Otherwise, set $t$ to the minimum $f$ returned by pruned nodes and repeat.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** On a 3×3 sliding puzzle with Manhattan distance heuristic: initial h=4, so threshold starts at 4. DFS explores nodes with f≤4, finds minimum exceeded f=6, repeats with threshold 6, and so on until solved.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The heuristic must be admissible (never overestimates) for optimality.",
          "Use a recursive DFS with the threshold passed down.",
          "Track the path on the call stack — no open/closed lists needed.",
          "For consistency, a monotone heuristic avoids revisiting states along the current path.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With an admissible heuristic, IDA* finds an optimal solution. Time complexity is $O(b^d)$ where $b$ is the branching factor and $d$ is the optimal solution depth — same as A* in the worst case but with $O(d)$ memory instead of $O(b^d)$.",
      },
      {
        kind: "p",
        text: "The number of iterations equals the number of distinct f-values up to the optimal cost. With integer costs this is bounded, but with real-valued costs it can degenerate.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For real-valued costs, use a small epsilon increase to avoid too many iterations.",
          "SMA* and RBFS are alternatives that use bounded memory more efficiently.",
          "IDA* is the standard solver for the 15-puzzle and Rubik's cube due to its low memory use.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(b^d)",
      average: "O(b^d)",
      worst: "O(b^d)",
    },
    space: "O(d)",
    worstClass: "2^n",
    note: "b = branching factor, d = solution depth. Memory is linear in d.",
  },
  properties: [
    {
      label: "Optimal",
      value: "Yes, with admissible heuristic",
    },
    {
      label: "Memory",
      value: "$O(d)$ — linear in solution depth",
    },
    {
      label: "Complete",
      value: "Yes, for finite branching factor",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "ida_star_grid",
      code: `def ida_star_grid(grid, start, goal):
    """IDA* on a grid. grid[r][c]=1 is blocked. Returns shortest path length or -1."""
    import math
    rows, cols = len(grid), len(grid[0])
    def h(pos):
        return abs(pos[0]-goal[0]) + abs(pos[1]-goal[1])
    threshold = h(tuple(start))
    path = [tuple(start)]
    path_set = {tuple(start)}
    def search(g, t):
        node = path[-1]
        f = g + h(node)
        if f > t:
            return f
        if node == tuple(goal):
            return -1
        min_t = math.inf
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = node[0]+dr, node[1]+dc
            nbr = (nr, nc)
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and nbr not in path_set:
                path.append(nbr)
                path_set.add(nbr)
                r = search(g + 1, t)
                if r == -1:
                    return -1
                if r < min_t:
                    min_t = r
                path.pop()
                path_set.discard(nbr)
        return min_t
    while True:
        r = search(0, threshold)
        if r == -1:
            return len(path) - 1
        if r == math.inf:
            return -1
        threshold = r
`,
      tests: [
        {
          args: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            [0, 0],
            [2, 2],
          ],
          expected: 4,
        },
        {
          args: [
            [
              [0, 1, 0],
              [0, 1, 0],
              [0, 0, 0],
            ],
            [0, 0],
            [0, 2],
          ],
          expected: 6,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ida-memory",
      kind: "mcq",
      prompt: "What is IDA*'s main advantage over A*?",
      options: [
        "Uses O(d) memory instead of O(b^d)",
        "Always faster",
        "No heuristic needed",
        "Works on infinite graphs",
      ],
      answer: 0,
      explanation: "IDA* uses depth-first search so memory is linear in the solution depth.",
      hints: ["Think about what A* stores."],
      objective: "Understand IDA* memory advantage",
    },
  ],
  exam: {
    definition:
      "IDA* performs iterative depth-first searches with increasing f-cost thresholds, combining A*'s optimality with DFS's memory efficiency.",
    steps: [
      "Set threshold to h(start).",
      "DFS pruning at f > threshold.",
      "Update threshold to min pruned f.",
      "Repeat until goal found.",
    ],
    timeComplexity: "$O(b^d)$",
    spaceComplexity: "$O(d)$",
    correctness:
      "Admissible heuristic ensures no optimal path is skipped; threshold increases guarantee completeness.",
    applications: ["15-puzzle", "Rubik's cube", "Any large state space with good heuristics"],
    limitations: ["Repeated work across iterations", "Degenerates with many distinct f-values"],
    faq: [
      {
        q: "Why not just use A*?",
        a: "A* can exhaust memory on large problems; IDA* uses only O(d) space.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Describe threshold-based DFS and optimality condition (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "R. E. Korf, 'Depth-first iterative-deepening: An optimal admissible tree search,' Artificial Intelligence, 27(1), 1985.",
      supports: "Introduced IDA*.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
