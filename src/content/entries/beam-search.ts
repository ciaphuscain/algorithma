import type { AlgorithmEntry } from "../types";

export const beamSearchEntry: AlgorithmEntry = {
  slug: "beam-search",
  name: "Beam Search",
  aliases: ["Beam Search"],
  curriculum: [450],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary:
    "A heuristic search algorithm that explores a graph by expanding only the best k nodes at each level, where k is the beam width. Trades completeness for efficiency.",
  tags: ["search", "heuristic", "beam width", "AI"],
  prerequisites: ["Breadth-First Search"],
  related: [],
  problem: {
    input: "Input for Beam Search.",
    output: "Output of Beam Search.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Beam search is a pruned version of breadth-first search. Instead of exploring all nodes at each level, it keeps only the top k most promising ones, where k is the beam width. This drastically reduces memory and time but sacrifices completeness.",
      },
      {
        kind: "p",
        text: "Think of it like a flashlight beam: at each step you shine light on the k best options and ignore the rest. With beam width 1 it degenerates to greedy search; with infinite width it becomes BFS.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with the initial state in the beam.",
          "Expand all states in the beam to get candidates.",
          "Score each candidate with the evaluation function.",
          "Keep only the top k candidates as the new beam.",
          "Repeat until reaching max depth or no new candidates.",
        ],
      },
      {
        kind: "table",
        head: ["Beam width", "Behavior", "Memory"],
        rows: [
          ["1", "Greedy search", "O(b)"],
          ["k", "Beam search", "O(k*b)"],
          ["infinity", "BFS", "O(b^d)"],
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The core loop expands all beam states, sorts candidates by score, and truncates to beam width. The score function is problem-specific: for sequence generation it might be log-probability, for optimization it is the objective value.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "In NLP, beam search over token sequences commonly uses beam width 4-10. Larger beams find better sequences but slow decoding linearly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With beam width k, branching factor b, and depth d, beam search expands at most k*b nodes per level and d levels, giving O(k*b*d) time. Space is O(k*d) to store the beam at each level. Unlike A* or BFS, beam search offers no optimality or completeness guarantees.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Stochastic beam search samples candidates proportionally to scores rather than taking the top k, introducing diversity. Beam stack search adds backtracking to recover completeness at the cost of more memory.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(k * b * d)",
      average: "O(k * b * d)",
      worst: "O(k * b * d)",
    },
    space: "O(k * d)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Category",
      value: "Optimization",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "beam_search",
      code: `def beam_search(start, target, beam_width, max_depth):
    """Beam search over integers toward a target.
    Returns closest value found."""
    beam = [start]
    best = start
    for _ in range(max_depth):
        candidates = []
        for s in beam:
            candidates.extend([s + 1, s + 2])
        if not candidates:
            break
        candidates.sort(key=lambda x: abs(x - target))
        beam = candidates[:beam_width]
        for c in beam:
            if abs(c - target) < abs(best - target):
                best = c
    return best
`,
      tests: [
        {
          args: [0, 10, 3, 5],
          expected: 10,
        },
      ],
    },
    {
      language: "javascript",
      entry: "beamSearch",
      code: `function beamSearch(start, target, beamWidth, maxDepth) {
  let beam = [start], best = start;
  for (let d = 0; d < maxDepth; d++) {
    let candidates = [];
    for (const s of beam) candidates.push(s + 1, s + 2);
    if (!candidates.length) break;
    candidates.sort((a, b) => Math.abs(a - target) - Math.abs(b - target));
    beam = candidates.slice(0, beamWidth);
    for (const c of beam) if (Math.abs(c - target) < Math.abs(best - target)) best = c;
  }
  return best;
}`,
      tests: [
        {
          args: [0, 10, 3, 5],
          expected: 10,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bs-q1",
      kind: "mcq",
      prompt: "With beam width 1, beam search becomes:",
      options: ["Greedy search", "BFS", "DFS", "A*"],
      answer: 0,
      explanation:
        "Beam width 1 means only the single best candidate is kept at each level, which is greedy search.",
      hints: ["What happens when you keep only the top 1?"],
      objective: "Understand beam width",
    },
  ],
  exam: {
    definition: "Define Beam Search and explain its purpose.",
    steps: ["Describe the main steps of Beam Search."],
    timeComplexity: "Analyze the time complexity of Beam Search.",
    spaceComplexity: "Analyze the space complexity of Beam Search.",
    correctness: "How does Beam Search guarantee correctness?",
    applications: ["List two applications of Beam Search."],
    limitations: ["What are the limitations of Beam Search?"],
    faq: [
      {
        q: "Why is Beam Search preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Beam Search works by applying its core strategy to efficiently solve the target ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "Russell & Norvig, Artificial Intelligence: A Modern Approach, Ch. 4",
      supports: "Beam search as local search variant",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
