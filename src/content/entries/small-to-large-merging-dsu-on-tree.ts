import type { AlgorithmEntry } from "../types";

export const smallToLargeMergingDsuOnTreeEntry: AlgorithmEntry = {
  slug: "small-to-large-merging-dsu-on-tree",
  name: "Small-to-Large Merging (DSU on Tree)",
  aliases: ["DSU on Tree", "Heavy-light merging", "Small-to-large trick"],
  curriculum: [534],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Small-to-large merging answers subtree queries efficiently by always merging the smaller set into the larger one, ensuring each element is moved O(log n) times.",
  tags: ["tree", "dsu", "merging", "subtree queries"],
  prerequisites: ["Trees", "Union-Find"],
  related: ["centroid-decomposition"],
  problem: {
    input:
      "A rooted tree where each node has a color/value, and queries about subtree statistics (e.g., number of distinct colors).",
    output: "Answers to all subtree queries.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To answer 'how many distinct colors in the subtree of v?', we need to merge children's color sets. Naively merging can be O(n^2). The small-to-large trick always merges the smaller set into the larger one, so each element moves at most O(log n) times (each move at least doubles its set size).",
      },
      {
        kind: "p",
        text: "This is the same principle behind union-find's union-by-size: if you always attach the smaller tree under the larger one, the height is O(log n).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Process the tree with DFS from the root.",
          "At each node v, recursively solve all children.",
          "Find the child with the largest set (the 'heavy' child).",
          "Inherit the heavy child's set and merge all other children's sets into it.",
          "Add v's own color and record the answer for v.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: Tree with root 1 (color A), children 2 (color B) and 3 (color A). Node 2 has child 4 (color C). Sets: node 4 = {C}, node 2 = {B,C}, node 3 = {A}. At node 1: heavy child is 2 (size 2). Inherit {B,C}, merge {A} from 3, add A. Result: {A,B,C}, answer for node 1 is 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a hash set or counter per subtree. Keep track of which child has the largest set.",
          "Swap rather than copy: after finding the heavy child, just add other elements to its set.",
          "Also applicable to maintaining histograms, frequency counts, or any mergeable data structure.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each element is moved from a set of size s to a set of size ≥ s, so after the move its set has size ≥ 2s. An element can be moved at most log₂ n times before its set has all n elements. Total work across all merges: O(n log n).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "DSU on tree (Euler tour + paint/unpaint) achieves the same complexity with a different implementation.",
          "The technique generalises to maintaining sorted sets, priority queues, or any structure where merging is proportional to the smaller set's size.",
          "Centroid decomposition is an alternative for subtree/path queries with different trade-offs.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "Each element merges O(log n) times.",
  },
  properties: [
    {
      label: "Merge rule",
      value: "Always merge smaller into larger",
    },
    {
      label: "Moves per element",
      value: "O(log n)",
    },
    {
      label: "Applicable to",
      value: "Subtree aggregate queries on trees",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "distinct_colors_in_subtrees",
      code: `def distinct_colors_in_subtrees(n, edges, colors):
    """Count distinct colors in each subtree. Nodes 0..n-1, rooted at 0.
    edges: list of [parent, child]. colors: list of color per node.
    Returns list of distinct color counts per node."""
    children = [[] for _ in range(n)]
    for p, c in edges:
        children[p].append(c)
    ans = [0] * n
    def dfs(v):
        s = set()
        s.add(colors[v])
        for c in children[v]:
            cs = dfs(c)
            if len(cs) > len(s):
                s, cs = cs, s
            s.update(cs)
        ans[v] = len(s)
        return s
    dfs(0)
    return ans
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [0, 2],
              [1, 3],
            ],
            [0, 1, 0, 2],
          ],
          expected: [3, 2, 1, 1],
        },
        {
          args: [
            3,
            [
              [0, 1],
              [0, 2],
            ],
            [0, 0, 0],
          ],
          expected: [1, 1, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "stl-moves",
      kind: "mcq",
      prompt: "In small-to-large merging, how many times can a single element be moved?",
      options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
      answer: 0,
      explanation:
        "Each move at least doubles the set size containing the element, so at most log₂ n moves.",
      hints: ["What happens to the set size after each merge?"],
      objective: "Understand the logarithmic bound",
    },
  ],
  exam: {
    definition:
      "Small-to-large merging answers subtree queries in O(n log n) by always merging the smaller child's set into the larger one.",
    steps: [
      "DFS the tree.",
      "At each node, find the child with the largest set.",
      "Merge smaller sets into it.",
      "Record answers.",
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctness: "Each element moves O(log n) times since each move doubles its set size.",
    applications: ["Distinct subtree counts", "Subtree frequency queries", "Tree color problems"],
    limitations: [
      "Offline only (all queries answered in one pass)",
      "Requires O(n) extra space for sets",
    ],
    faq: [
      {
        q: "How does this differ from centroid decomposition?",
        a: "Small-to-large merging handles subtree queries; centroid decomposition handles path queries more naturally.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Merge rule and amortized bound (1).", "Algorithm steps (1)."],
      },
    ],
  },
  references: [
    {
      citation: "Competitive Programming 3, S. Halim and F. Halim, 2013.",
      supports: "Covers the small-to-large merging technique.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
