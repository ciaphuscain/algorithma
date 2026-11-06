import type { AlgorithmEntry } from "../types";

export const iddfsEntry: AlgorithmEntry = {
  slug: "iddfs",
  name: "Iterative Deepening DFS",
  aliases: ["Iterative Deepening DFS", "IDDFS"],
  curriculum: [206],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "intermediate",
  summary:
    "Combines DFS's O(V) space with BFS's shortest-path optimality by running depth-limited DFS with increasing depth limits until the target is found.",
  tags: ["IDDFS", "DFS", "BFS", "graph traversal", "graph"],
  prerequisites: ["DFS", "BFS"],
  related: ["dfs", "bfs", "iterative-dfs"],
  problem: {
    input: "A graph with n vertices, edges, a source s and a target t.",
    output: "The shortest distance from s to t, or -1 if unreachable.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "BFS finds shortest paths but uses O(V) memory for the queue. DFS uses O(depth) memory but doesn't find shortest paths. IDDFS runs DFS with depth limit 0, then 1, then 2, ... until the target is found. The re-exploration overhead is minimal because most nodes are at the deepest level.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For depth_limit = 0, 1, 2, ...:",
          "  Run a depth-limited DFS from s: explore vertices up to depth_limit deep.",
          "  If t is found, return depth_limit.",
          "  If any vertex at depth_limit has unexplored children, increase depth_limit.",
          "If no depth limit finds t and no frontier remains, return -1.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The depth-limited DFS function returns whether t was found and whether any path was cut off by the limit (to know whether to continue deepening).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With branching factor $b$ and solution depth $d$, IDDFS explores $(d+1) + d \\cdot b + (d-1) \\cdot b^2 + \\ldots + b^d$ nodes. The last level dominates: the overhead factor is $b/(b-1)$, e.g. only 2x for $b = 2$. Space is $O(bd)$, same as DFS.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "IDDFS is the default uninformed search in AI when the solution depth is unknown.",
          "IDA* extends this with a heuristic cost threshold instead of depth.",
          "For graphs (vs trees), mark visited within each depth-limited DFS to avoid revisiting, but clear between iterations.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(b^d)",
      worst: "O(b^d)",
    },
    space: "O(b * d)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Optimal",
      value: "Yes (for unweighted graphs)",
    },
    {
      label: "Space",
      value: "O(bd), same as DFS",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "iddfs",
      code: `def iddfs(n, edges, s, t):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    def dls(u, target, limit, visited):
        if u == target:
            return True, False
        if limit <= 0:
            return False, True
        any_remaining = False
        visited.add(u)
        for v in adj[u]:
            if v not in visited:
                found, remaining = dls(v, target, limit - 1, visited)
                if found:
                    return True, False
                if remaining:
                    any_remaining = True
        visited.discard(u)
        return False, any_remaining
    for depth in range(n):
        found, remaining = dls(s, t, depth, set())
        if found:
            return depth
        if not remaining:
            break
    return -1
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 4],
            ],
            0,
            4,
          ],
          expected: 4,
        },
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
            ],
            0,
            2,
          ],
          expected: 2,
        },
        {
          args: [3, [[0, 1]], 0, 2],
          expected: -1,
        },
        {
          args: [1, [], 0, 0],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "iddfs",
      code: `function iddfs(n, edges, s, t) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  function dls(u, target, limit, visited) {
    if (u === target) return [true, false];
    if (limit <= 0) return [false, true];
    let anyRemaining = false;
    visited.add(u);
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        const [found, remaining] = dls(v, target, limit - 1, visited);
        if (found) return [true, false];
        if (remaining) anyRemaining = true;
      }
    }
    visited.delete(u);
    return [false, anyRemaining];
  }
  for (let depth = 0; depth < n; depth++) {
    const [found, remaining] = dls(s, t, depth, new Set());
    if (found) return depth;
    if (!remaining) break;
  }
  return -1;
}
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 4],
            ],
            0,
            4,
          ],
          expected: 4,
        },
        {
          args: [1, [], 0, 0],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "iddfs-q1",
      kind: "mcq",
      prompt: "What advantage does IDDFS have over BFS?",
      options: [
        "O(bd) space instead of O(b^d)",
        "Faster in all cases",
        "Finds shorter paths",
        "Works on weighted graphs",
      ],
      answer: 0,
      explanation:
        "IDDFS uses DFS's linear space while still finding shortest paths, unlike BFS which stores the entire frontier.",
      hints: ["Compare memory usage of BFS vs DFS."],
      objective: "Space advantage",
    },
  ],
  exam: {
    definition:
      "IDDFS runs depth-limited DFS with increasing limits, combining DFS's space efficiency with BFS's shortest-path guarantee.",
    steps: [
      "For limit 0, 1, 2, ...: run depth-limited DFS.",
      "If target found at limit d, return d.",
      "If no vertices remain beyond the limit, target is unreachable.",
    ],
    timeComplexity: "$O(b^d)$ where b is branching factor and d is solution depth.",
    spaceComplexity: "$O(bd)$.",
    correctness:
      "The first depth at which the target is found equals the shortest path length, since shallower depths were tried first.",
    applications: ["AI game search", "puzzle solving", "memory-constrained search"],
    limitations: [
      "Overhead from revisiting nodes (factor b/(b-1))",
      "Not useful when all solutions are at similar depths",
    ],
    faq: [
      {
        q: "Isn't re-exploring wasteful?",
        a: "The overhead is at most b/(b-1) — e.g. only 2x for b=2 — because the last level dominates.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe depth-limited DFS loop (2).",
          "Analyze time and space (2).",
          "Compare with BFS (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. E. Korf, 'Depth-First Iterative-Deepening: An Optimal Admissible Tree Search', Artificial Intelligence, 1985.",
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
