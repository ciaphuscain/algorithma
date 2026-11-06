import type { AlgorithmEntry } from "../types";

export const alphaBetaPruningEntry: AlgorithmEntry = {
  slug: "alpha-beta-pruning",
  name: "Alpha-Beta Pruning",
  aliases: ["Alpha-Beta Pruning", "Alpha–Beta Pruning"],
  curriculum: [453],
  domain: "ai-search",
  subcategory: "Game Search",
  difficulty: "intermediate",
  summary:
    "Optimizes minimax by pruning branches that cannot affect the final decision, reducing the effective branching factor from b to √b in the best case.",
  tags: ["alpha-beta", "minimax", "pruning", "game tree", "ai"],
  prerequisites: ["Minimax"],
  related: ["minimax", "expectimax"],
  problem: {
    input: "A game tree with leaf utilities, and alpha-beta bounds.",
    output: "The minimax value, computed with pruning to avoid unnecessary exploration.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Alpha-beta pruning skips subtrees that cannot change the outcome. Alpha is the best guaranteed score for MAX so far; beta is the best for MIN. If a node's value goes outside the [alpha, beta] window, the remaining children can be pruned.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "At a MAX node, if a child's value ≥ beta, prune remaining children (beta cutoff).",
          "At a MIN node, if a child's value ≤ alpha, prune remaining children (alpha cutoff).",
          "Alpha is raised at MAX nodes; beta is lowered at MIN nodes.",
          "The window [alpha, beta] narrows as the search progresses.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Pass alpha and beta as parameters. Update alpha at MAX nodes, beta at MIN nodes. Prune when alpha ≥ beta.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Best case (moves ordered best-first): $O(b^{d/2})$, effectively doubling the searchable depth. Worst case (worst order): same as minimax $O(b^d)$. Average with random ordering: $O(b^{3d/4})$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Move ordering (e.g., iterative deepening, killer heuristic) is crucial for efficiency.",
          "NegaScout and MTD(f) are refinements of alpha-beta.",
          "Transposition tables prevent re-evaluating the same position.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(b^(d/2))",
      average: "O(b^(3d/4))",
      worst: "O(b^d)",
    },
    space: "O(b * d)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Optimal",
      value: "Same result as minimax",
    },
    {
      label: "Best-case speedup",
      value: "√b effective branching factor",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "alpha_beta",
      code: `def alpha_beta(tree, alpha=float('-inf'), beta=float('inf')):
    """tree = value (leaf) or [is_max, child1, child2, ...]."""
    if isinstance(tree, (int, float)):
        return tree
    is_max = tree[0]
    children = tree[1:]
    if is_max:
        value = float('-inf')
        for c in children:
            value = max(value, alpha_beta(c, alpha, beta))
            alpha = max(alpha, value)
            if alpha >= beta:
                break
        return value
    else:
        value = float('inf')
        for c in children:
            value = min(value, alpha_beta(c, alpha, beta))
            beta = min(beta, value)
            if alpha >= beta:
                break
        return value
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
          args: [42],
          expected: 42,
        },
      ],
    },
    {
      language: "javascript",
      entry: "alphaBeta",
      code: `function alphaBeta(tree, alpha = -Infinity, beta = Infinity) {
  if (typeof tree === "number") return tree;
  const isMax = tree[0];
  const children = tree.slice(1);
  if (isMax) {
    let value = -Infinity;
    for (const c of children) {
      value = Math.max(value, alphaBeta(c, alpha, beta));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const c of children) {
      value = Math.min(value, alphaBeta(c, alpha, beta));
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}
`,
      tests: [
        {
          args: [[true, [false, 3, 5], [false, 2, 9]]],
          expected: 3,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "alpha-beta-q1",
      kind: "mcq",
      prompt: "When does a beta cutoff occur?",
      options: [
        "At a MAX node when a child's value ≥ beta",
        "At a MIN node when a child's value ≤ alpha",
        "When alpha equals beta",
        "At leaf nodes",
      ],
      answer: 0,
      explanation:
        "At a MAX node, if we find a value ≥ beta, the MIN parent will never choose this branch (it already has a better option), so we prune.",
      hints: ["Think about which player benefits from each cutoff."],
      objective: "Beta cutoff",
    },
  ],
  exam: {
    definition:
      "Alpha-beta pruning optimizes minimax by maintaining a window [alpha, beta] and pruning branches that fall outside it.",
    steps: [
      "Pass alpha (MAX's guaranteed minimum) and beta (MIN's guaranteed maximum).",
      "At MAX nodes, prune when value ≥ beta.",
      "At MIN nodes, prune when value ≤ alpha.",
    ],
    timeComplexity: "$O(b^{d/2})$ best case, $O(b^d)$ worst case.",
    spaceComplexity: "$O(bd)$.",
    correctness:
      "Pruned branches cannot affect the root value because the opponent would never allow reaching them.",
    applications: ["chess engines", "Go AI", "game playing"],
    limitations: ["Performance depends heavily on move ordering"],
    faq: [
      {
        q: "Does pruning change the result?",
        a: "No, alpha-beta returns the exact same value as minimax.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define alpha and beta bounds (1).",
          "Describe pruning conditions (2).",
          "Best-case time analysis (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "S. Russell and P. Norvig, Artificial Intelligence: A Modern Approach, 4th ed., Pearson, 2021.",
      supports: "Section 5.3: Alpha-Beta Pruning.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
