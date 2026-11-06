import type { AlgorithmEntry } from "../types";

export const expectimaxEntry: AlgorithmEntry = {
  slug: "expectimax",
  name: "Expectimax",
  aliases: ["Expectimax"],
  curriculum: [454],
  domain: "ai-search",
  subcategory: "Game Search",
  difficulty: "intermediate",
  summary:
    "Extends minimax to games with chance elements by replacing MIN nodes with chance nodes that compute expected values over random outcomes.",
  tags: ["expectimax", "game tree", "chance", "stochastic", "ai"],
  prerequisites: ["Minimax"],
  related: ["minimax", "alpha-beta-pruning"],
  problem: {
    input:
      "A game tree with MAX nodes, chance nodes (with probabilities), and leaf utility values.",
    output: "The expected minimax value of the root.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In games like backgammon, dice rolls introduce randomness. Expectimax handles this: MAX nodes pick the best child, but chance nodes compute the weighted average over random outcomes.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "At leaf nodes, return the utility.",
          "At MAX nodes, return the maximum child value.",
          "At chance nodes, return the weighted average: Σ(probability × child value).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Chance nodes store (probability, child) pairs. The expected value is the sum of probability × expectimax(child).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(b^d)$ time — same as minimax but alpha-beta pruning cannot be applied to chance nodes directly (expected values don't support pruning without bounds).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Star1 and Star2 pruning provide limited pruning for expectimax when utility values are bounded.",
          "Monte Carlo Tree Search (MCTS) is a sampling alternative for large stochastic trees.",
          "Expectiminimax includes both opponent and chance nodes.",
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
      label: "Handles chance",
      value: "Yes, via expected values",
    },
    {
      label: "Pruning",
      value: "Limited (no standard alpha-beta)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "expectimax",
      code: `def expectimax(tree):
    """tree = value (leaf), ["max", c1, c2, ...] or ["chance", [p1,c1], [p2,c2], ...]."""
    if isinstance(tree, (int, float)):
        return tree
    kind = tree[0]
    if kind == "max":
        return max(expectimax(c) for c in tree[1:])
    else:
        return sum(p * expectimax(c) for p, c in tree[1:])
`,
      tests: [
        {
          args: [["max", ["chance", [0.5, 10], [0.5, 0]], ["chance", [0.5, 3], [0.5, 7]]]],
          expected: 5.0,
        },
        {
          args: [["max", 3, 7]],
          expected: 7,
        },
        {
          args: [5],
          expected: 5,
        },
      ],
    },
    {
      language: "javascript",
      entry: "expectimax",
      code: `function expectimax(tree) {
  if (typeof tree === "number") return tree;
  const kind = tree[0];
  if (kind === "max") {
    return Math.max(...tree.slice(1).map(c => expectimax(c)));
  } else {
    return tree.slice(1).reduce((s, [p, c]) => s + p * expectimax(c), 0);
  }
}
`,
      tests: [
        {
          args: [["max", ["chance", [0.5, 10], [0.5, 0]], ["chance", [0.5, 3], [0.5, 7]]]],
          expected: 5.0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "expectimax-q1",
      kind: "mcq",
      prompt: "What does a chance node compute?",
      options: [
        "The weighted average of child values using probabilities",
        "The maximum child value",
        "The minimum child value",
        "A random child value",
      ],
      answer: 0,
      explanation:
        "Chance nodes compute the expected value: sum of each child's value weighted by its probability.",
      hints: ["Think about what expected value means mathematically."],
      objective: "Chance nodes",
    },
  ],
  exam: {
    definition:
      "Expectimax extends minimax for stochastic games by replacing MIN nodes with chance nodes that compute expected values.",
    steps: [
      "Leaf: return utility.",
      "MAX: return max child.",
      "Chance: return Σ(probability × child value).",
    ],
    timeComplexity: "$O(b^d)$.",
    spaceComplexity: "$O(bd)$.",
    correctness: "Maximizes expected utility under the given probability model.",
    applications: ["backgammon", "Pac-Man AI", "games with dice/cards"],
    limitations: ["Cannot use alpha-beta pruning directly", "Requires accurate probability model"],
    faq: [
      {
        q: "Why can't we use alpha-beta with chance nodes?",
        a: "Expected values can be between any child values, so we can't prune based on bounds without knowing utility bounds.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define MAX and chance nodes (1).",
          "Expected value computation (2).",
          "Comparison with minimax (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "S. Russell and P. Norvig, Artificial Intelligence: A Modern Approach, 4th ed., Pearson, 2021.",
      supports: "Section 5.5: Stochastic Games.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
