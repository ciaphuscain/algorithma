import type { AlgorithmEntry } from "../types";

export const persistentDsuRollbackDsuEntry: AlgorithmEntry = {
  slug: "persistent-dsu-rollback-dsu",
  name: "Persistent DSU / Rollback DSU",
  aliases: ["Rollback Union-Find", "Undoable Union-Find"],
  curriculum: [535],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Extends union-find (disjoint set union) to support undoing the last union operation by maintaining a stack of changes, enabling backtracking in divide-and-conquer algorithms.",
  tags: ["union-find", "DSU", "rollback", "persistent", "offline"],
  prerequisites: ["Union-Find"],
  related: ["union-find"],
  problem: {
    input: "A sequence of union and rollback operations on a disjoint set.",
    output: "Connectivity answers interleaved with the operations, supporting undo.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Standard union-find with path compression is nearly O(1) per operation but irreversible — you can't undo a union. Rollback DSU sacrifices path compression (using union by rank only) and records each union on a stack so it can be undone.",
      },
      {
        kind: "p",
        text: "This enables divide-and-conquer on edges: add edges for the left half, recurse, rollback, add edges for the right half, recurse.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Use union by rank (or size) without path compression — this keeps the tree structure reversible.",
          "On each union(u, v), push the old parent and rank values onto a stack.",
          "To rollback, pop the stack and restore the saved parent/rank values.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** union(0,1) saves [parent[1]=1, rank[0]=0]. Rollback restores parent[1]=1, rank[0]=0.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Without path compression, find is O(log n) instead of O(α(n)).",
          "Commonly used in offline dynamic connectivity and parallel binary search.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Union by rank gives O(log n) find. Each union/rollback is O(1) stack push/pop plus O(log n) for the find. Space: O(n + m) for n elements and m unions.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Fully persistent DSU allows querying any historical version, not just rollback.",
          "Link-cut trees provide a fully dynamic alternative with O(log n) amortised operations.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    space: "O(n + m)",
    worstClass: "log n",
    note: "O(log n) per find (no path compression). O(1) union/rollback amortised stack cost.",
  },
  properties: [
    {
      label: "Find",
      value: "$O(\\log n)$ (no path compression)",
    },
    {
      label: "Rollback",
      value: "$O(1)$ per undo step",
    },
    {
      label: "Use case",
      value: "Divide-and-conquer on edges",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "test_rollback_dsu",
      code: `class RollbackDSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.history = []

    def find(self, x):
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            self.history.append(None)
            return False
        if self.rank[a] < self.rank[b]:
            a, b = b, a
        self.history.append((b, self.parent[b], a, self.rank[a]))
        self.parent[b] = a
        if self.rank[a] == self.rank[b]:
            self.rank[a] += 1
        return True

    def rollback(self):
        entry = self.history.pop()
        if entry is None:
            return
        b, old_parent_b, a, old_rank_a = entry
        self.parent[b] = old_parent_b
        self.rank[a] = old_rank_a

def test_rollback_dsu():
    dsu = RollbackDSU(4)
    dsu.union(0, 1)
    dsu.union(2, 3)
    dsu.union(0, 2)
    connected = dsu.find(0) == dsu.find(3)
    dsu.rollback()
    disconnected = dsu.find(0) != dsu.find(3)
    return [connected, disconnected]
`,
      tests: [
        {
          args: [],
          expected: [true, true],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "rdsu-nopc",
      kind: "mcq",
      prompt: "Why doesn't rollback DSU use path compression?",
      options: [
        "Path compression is irreversible — it changes parent pointers that can't be easily undone",
        "Path compression is slower",
        "Path compression uses more memory",
        "Path compression doesn't work with ranks",
      ],
      answer: 0,
      explanation:
        "Path compression flattens paths, destroying the original tree structure needed for rollback.",
      hints: ["What does path compression do to parent pointers?"],
      objective: "Understand why path compression is incompatible with rollback",
    },
  ],
  exam: {
    definition:
      "Rollback DSU uses union by rank without path compression and a stack of changes to support undoing union operations.",
    steps: [
      "Union by rank only.",
      "On union, push old parent/rank to stack.",
      "Rollback: pop and restore.",
    ],
    timeComplexity: "$O(\\log n)$ per find.",
    spaceComplexity: "$O(n + m)$.",
    correctness:
      "Union by rank maintains O(log n) height; each union/rollback touches O(1) entries on the history stack.",
    applications: [
      "Divide-and-conquer on edges",
      "Offline dynamic connectivity",
      "Parallel binary search",
    ],
    limitations: ["O(log n) find instead of O(α(n))"],
    faq: [
      {
        q: "When is rollback DSU preferred?",
        a: "When you need to undo unions in reverse order, as in divide-and-conquer algorithms that process edge intervals.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["No path compression rationale and rollback mechanism (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009, Ch. 21.",
      supports: "Union-find with union by rank.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
