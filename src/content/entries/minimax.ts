import type { AlgorithmEntry } from "../types";

export const minimaxEntry: AlgorithmEntry = {
  slug: "minimax",
  name: "Minimax",
  aliases: ["Minimax"],
  curriculum: [452],
  domain: "ai-search",
  subcategory: "Game Search",
  difficulty: "intermediate",
  summary:
    "Explores a game tree to find the optimal move assuming both players play perfectly: the maximizing player picks the highest-value child, the minimizing player picks the lowest.",
  tags: ["minimax", "game tree", "adversarial search", "ai"],
  prerequisites: ["DFS"],
  related: ["alpha-beta-pruning", "expectimax"],
  problem: {
    input:
      "A game tree where leaves have utility values, and a flag indicating which player moves.",
    output: "The minimax value of the root (optimal value under perfect play).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In a two-player zero-sum game, one player maximizes the score and the other minimizes it. Minimax recursively evaluates the game tree: at MAX nodes pick the largest child value, at MIN nodes pick the smallest.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "If the node is a leaf, return its utility value.",
          "If it is a MAX node, return the maximum of the minimax values of its children.",
          "If it is a MIN node, return the minimum of the minimax values of its children.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Implemented as a recursive function with a `maximizing` boolean flag that alternates at each level.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Explores the entire game tree: $O(b^d)$ time where $b$ is the branching factor and $d$ is the depth. Space $O(bd)$ for the recursion stack.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Alpha-beta pruning reduces the search to $O(b^{d/2})$ in the best case.",
          "Transposition tables cache repeated positions.",
          "For stochastic games, expectimax replaces MIN nodes with chance nodes.",
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
    space: "O(b * d)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Optimal",
      value: "Yes, under perfect play",
    },
    {
      label: "Pruning",
      value: "Alpha-beta reduces to O(b^(d/2))",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "minimax",
      code: `def minimax(tree):
    """tree = value (int) for leaf, or [is_max, child1, child2, ...] for internal node."""
    if isinstance(tree, (int, float)):
        return tree
    is_max = tree[0]
    children = tree[1:]
    values = [minimax(c) for c in children]
    return max(values) if is_max else min(values)
`,
      tests: [
        {
          args: [[true, [false, 3, 5], [false, 2, 9]]],
          expected: 3,
        },
        {
          args: [[true, [false, 1, 2], [false, 3, 4]]],
          expected: 3,
        },
        {
          args: [7],
          expected: 7,
        },
      ],
    },
    {
      language: "javascript",
      entry: "minimax",
      code: `function minimax(tree) {
  if (typeof tree === "number") return tree;
  const isMax = tree[0];
  const children = tree.slice(1);
  const values = children.map(c => minimax(c));
  return isMax ? Math.max(...values) : Math.min(...values);
}
`,
      tests: [
        {
          args: [[true, [false, 3, 5], [false, 2, 9]]],
          expected: 3,
        },
        {
          args: [7],
          expected: 7,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "minimax-q1",
      kind: "mcq",
      prompt: "In minimax, what does a MIN node do?",
      options: [
        "Selects the child with the lowest value",
        "Selects the child with the highest value",
        "Averages child values",
        "Randomly selects a child",
      ],
      answer: 0,
      explanation:
        "The minimizing player wants to minimize the maximizer's score, so they pick the lowest-valued child.",
      hints: ["Think about whose turn it is at a MIN node."],
      objective: "MIN node",
    },
  ],
  exam: {
    definition:
      "Minimax finds the optimal move in a two-player zero-sum game by alternating between maximizing and minimizing at each level.",
    steps: [
      "At leaf nodes, return the utility.",
      "At MAX nodes, return max of children.",
      "At MIN nodes, return min of children.",
    ],
    timeComplexity: "$O(b^d)$.",
    spaceComplexity: "$O(bd)$.",
    correctness:
      "Under the assumption of perfect play, minimax returns the best achievable outcome for the maximizing player.",
    applications: ["chess engines", "tic-tac-toe", "game AI"],
    limitations: ["Exponential time without pruning"],
    faq: [
      {
        q: "Why is it called minimax?",
        a: "The maximizer maximizes their minimum guaranteed outcome, while the minimizer minimizes the maximizer's maximum outcome.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define the game tree and utility (1).",
          "Recursive MAX/MIN evaluation (2).",
          "Time complexity analysis (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "S. Russell and P. Norvig, Artificial Intelligence: A Modern Approach, 4th ed., Pearson, 2021.",
      supports: "Chapter 5: Adversarial Search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
