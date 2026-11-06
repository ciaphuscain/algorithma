import type { AlgorithmEntry } from "../types";

export const treeMatchingDpEntry: AlgorithmEntry = {
  slug: "tree-matching-dp",
  name: "Tree Matching (DP)",
  aliases: ["Maximum Matching on Tree"],
  curriculum: [295],
  domain: "dynamic-programming",
  subcategory: "Tree DP",
  difficulty: "intermediate",
  summary:
    "Find a maximum matching (set of non-adjacent edges) in a tree. dp[v][0] = unmatched, dp[v][1] = matched to some child.",
  tags: ["tree DP", "matching", "dynamic programming"],
  prerequisites: ["maximum-independent-set-on-tree"],
  related: ["maximum-independent-set-on-tree"],
  problem: {
    input: "A tree as adjacency list.",
    output: "Size of maximum matching.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "At each node, decide whether to match it with one of its children. If matched, that child can't be matched elsewhere.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[v][0] = v unmatched = sum of max(dp[c][0], dp[c][1]) for children c.",
          "dp[v][1] = v matched to some child = max over c of (dp[c][0] + 1 + sum of max(dp[c'][0], dp[c'][1]) for c'≠c).",
          "Answer = max(dp[root][0], dp[root][1]).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Simplify: dp[v][1] = dp[v][0] + max over c of (1 + dp[c][0] - max(dp[c][0], dp[c][1])).",
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
        text: "On general graphs, maximum matching requires Edmonds' blossom algorithm in O(V^3).",
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
      entry: "treeMatching",
      code: `def treeMatching(adj):
    n = len(adj)
    if n <= 1:
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
            s = 0
            best_gain = -1
            for nb in adj[node]:
                if nb != parent[node]:
                    s += max(dp0[nb], dp1[nb])
                    gain = 1 + dp0[nb] - max(dp0[nb], dp1[nb])
                    if gain > best_gain:
                        best_gain = gain
            dp0[node] = s
            dp1[node] = s + max(0, best_gain) if best_gain >= 0 else s
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
          expected: 2,
        },
        {
          args: [[[1], [0]]],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "treeMatching",
      code: `function treeMatching(adj) {
  const n = adj.length;
  if (n <= 1) return 0;
  const dp0 = new Array(n).fill(0), dp1 = new Array(n).fill(0);
  const visited = new Array(n).fill(false), parent = new Array(n).fill(-1);
  const stack = [[0, false]];
  visited[0] = true;
  while (stack.length) {
    const [node, processed] = stack.pop();
    if (processed) {
      let s = 0, bestGain = -1;
      for (const nb of adj[node]) {
        if (nb !== parent[node]) {
          s += Math.max(dp0[nb], dp1[nb]);
          const gain = 1 + dp0[nb] - Math.max(dp0[nb], dp1[nb]);
          if (gain > bestGain) bestGain = gain;
        }
      }
      dp0[node] = s;
      dp1[node] = bestGain >= 0 ? s + bestGain : s;
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
          expected: 2,
        },
        {
          args: [[[1], [0]]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "tm-q1",
      kind: "mcq",
      prompt: "Path 0-1-2-3. Max matching?",
      options: ["2", "1", "3", "0"],
      answer: 0,
      explanation: "Match edges (0,1) and (2,3): 2 edges.",
      hints: ["Non-adjacent edges."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Maximum set of non-adjacent edges in a tree.",
    steps: ["dp[v][0] = v unmatched.", "dp[v][1] = v matched to best child.", "Post-order DFS."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Match/unmatch decomposition covers all matchings.",
    applications: ["pairing problems", "network design"],
    limitations: ["trees only"],
    faq: [
      {
        q: "Why gain-based formulation?",
        a: "Avoids recomputing sums for each candidate child.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["DP states (2).", "Gain optimization (1).", "Complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Tree matching.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
