import type { AlgorithmEntry } from "../types";

export const maximumIndependentSetOnTreeEntry: AlgorithmEntry = {
  slug: "maximum-independent-set-on-tree",
  name: "Maximum Independent Set on a Tree",
  aliases: ["Tree MIS", "Maximum Weight Independent Set Tree"],
  curriculum: [294],
  domain: "dynamic-programming",
  subcategory: "Tree DP",
  difficulty: "intermediate",
  summary:
    "Find a largest set of non-adjacent vertices in a tree. dp[v][0] = sum of max(dp[c][0], dp[c][1]); dp[v][1] = 1 + sum(dp[c][0]).",
  tags: ["tree DP", "independent set", "dynamic programming"],
  prerequisites: ["house-robber"],
  related: ["house-robber", "tree-matching-dp"],
  problem: {
    input: "A tree as adjacency list.",
    output: "Size of the maximum independent set.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Like House Robber on a tree: if we include a node, we can't include its children. DP on include/exclude per node.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Root the tree at any node.",
          "dp[v][0] (exclude v) = sum over children c of max(dp[c][0], dp[c][1]).",
          "dp[v][1] (include v) = 1 + sum over children c of dp[c][0].",
          "Answer = max(dp[root][0], dp[root][1]).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Post-order DFS. O(n) time and space.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n)$, space $O(n)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "MIS is NP-hard on general graphs but polynomial on trees due to the DP decomposition.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "maxIndependentSet",
      code: `def maxIndependentSet(adj):
    n = len(adj)
    if n == 0:
        return 0
    dp0 = [0] * n
    dp1 = [0] * n
    visited = [False] * n
    parent = [-1] * n
    stack = [(0, False)]
    visited[0] = True
    while stack:
        node, processed = stack.pop()
        if processed:
            exc = 0
            inc = 1
            for nb in adj[node]:
                if nb != parent[node]:
                    exc += max(dp0[nb], dp1[nb])
                    inc += dp0[nb]
            dp0[node] = exc
            dp1[node] = inc
        else:
            stack.append((node, True))
            for nb in adj[node]:
                if not visited[nb]:
                    visited[nb] = True
                    parent[nb] = node
                    stack.append((nb, False))
    return max(dp0[0], dp1[0])`,
      tests: [
        {
          args: [[[1, 2], [0, 3, 4], [0], [1], [1]]],
          expected: 3,
        },
        {
          args: [[[1], [0, 2], [1]]],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxIndependentSet",
      code: `function maxIndependentSet(adj) {
  const n = adj.length;
  if (n === 0) return 0;
  const dp0 = new Array(n).fill(0), dp1 = new Array(n).fill(0);
  const visited = new Array(n).fill(false), parent = new Array(n).fill(-1);
  const stack = [[0, false]];
  visited[0] = true;
  while (stack.length) {
    const [node, processed] = stack.pop();
    if (processed) {
      let exc = 0, inc = 1;
      for (const nb of adj[node]) {
        if (nb !== parent[node]) {
          exc += Math.max(dp0[nb], dp1[nb]);
          inc += dp0[nb];
        }
      }
      dp0[node] = exc;
      dp1[node] = inc;
    } else {
      stack.push([node, true]);
      for (const nb of adj[node]) {
        if (!visited[nb]) {
          visited[nb] = true;
          parent[nb] = node;
          stack.push([nb, false]);
        }
      }
    }
  }
  return Math.max(dp0[0], dp1[0]);
}`,
      tests: [
        {
          args: [[[1, 2], [0, 3, 4], [0], [1], [1]]],
          expected: 3,
        },
        {
          args: [[[1], [0, 2], [1]]],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "mis-q1",
      kind: "mcq",
      prompt: "Path graph 0-1-2-3. MIS size?",
      options: ["2", "3", "1", "4"],
      answer: 0,
      explanation: "Pick nodes 0 and 2, or 1 and 3: size 2.",
      hints: ["No adjacent nodes."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Largest set of non-adjacent vertices in a tree.",
    steps: ["Root tree.", "dp[v][0] = exclude, dp[v][1] = include.", "Post-order DFS."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Include/exclude decomposition covers all independent sets.",
    applications: ["network security", "scheduling"],
    limitations: ["trees only for polynomial time"],
    faq: [
      {
        q: "Why is this easy on trees but NP-hard on general graphs?",
        a: "Trees have no cycles, enabling clean DP decomposition.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Include/exclude DP (2).", "Recurrence (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Tree DP.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
