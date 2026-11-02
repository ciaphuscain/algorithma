import type { AlgorithmEntry } from "../types";

export const softHeapEntry: AlgorithmEntry = {
  slug: "soft-heap",
  name: "Soft Heap",
  aliases: ["Chazelle's Soft Heap"],
  curriculum: [132],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "advanced",
  summary:
    "A soft heap is a priority queue that deliberately corrupts a small fraction of keys (making them larger) in exchange for O(1) amortized time for all operations except delete.",
  tags: ["heap", "amortized", "approximate", "priority queue"],
  prerequisites: ["Binary Heap"],
  related: [],
  problem: {
    input: "Insert, delete-min, and meld operations on a priority queue.",
    output:
      "Approximate minimum (some keys may be corrupted to larger values), with O(1) amortized insert and meld.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Normal heaps need Ω(log n) time per operation due to comparison-based lower bounds. The soft heap cheats: it's allowed to increase (corrupt) up to ε fraction of the keys. In return, insert, meld, and find-min all take O(1) amortized time. Only delete-min costs O(log(1/ε)).",
      },
      {
        kind: "p",
        text: "This trade-off is useful when small errors are acceptable. The primary application is in optimal minimum spanning tree algorithms, where the soft heap is used to approximately partition edges.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "The heap is a collection of binomial-tree-like structures with ranks.",
          "Each node stores a list of items. When two trees of the same rank combine, items percolate and some keys get corrupted (replaced with a larger key).",
          "The corruption rate is controlled by a parameter r = ⌈log(1/ε)⌉.",
          "Delete-min returns the item with the smallest (possibly corrupted) key.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Nodes with rank > r can hold multiple items (this is where corruption happens).",
          "Melding combines trees of equal rank, similar to binomial heaps.",
          "At most εn items out of n are corrupted at any time.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With corruption rate ε, insert and meld are O(1) amortized, and delete-min is O(log(1/ε)) amortized. The total number of corrupted items never exceeds εn. This breaks the Ω(n log n) sorting lower bound because the output is approximate.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Chazelle (2000) used the soft heap to build a deterministic O(mα(m,n)) minimum spanning tree algorithm.",
          "Kaplan and Zwick (2009) gave a simpler soft heap implementation.",
          "The soft heap is one of the few data structures that trades exactness for speed in a provable way.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(log(1/ε))",
    },
    space: "O(n)",
    worstClass: "other",
    note: "Insert, meld, find-min: O(1) amortized. Delete-min: O(log(1/ε)) amortized.",
  },
  properties: [
    {
      label: "Corruption",
      value: "Up to ε fraction of keys increased",
    },
    {
      label: "Insert/meld",
      value: "O(1) amortized",
    },
    {
      label: "Delete-min",
      value: "O(log(1/ε)) amortized",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "soft_heap_demo",
      code: `def soft_heap_demo(values, epsilon):
    """Demonstrate soft heap concept: extract approximate mins.
    Returns sorted-ish output (some values may be out of order due to corruption)."""
    import heapq, random
    random.seed(42)
    heap = list(values)
    # Simulate corruption: randomly increase epsilon fraction of values
    n = len(heap)
    corrupt_count = int(n * epsilon)
    indices = random.sample(range(n), min(corrupt_count, n))
    for i in indices:
        heap[i] += random.randint(1, 10)
    heapq.heapify(heap)
    result = []
    while heap:
        result.append(heapq.heappop(heap))
    return result
`,
      tests: [
        {
          args: [[5, 3, 8, 1, 4], 0.0],
          expected: [1, 3, 4, 5, 8],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "soft-heap-tradeoff",
      kind: "mcq",
      prompt: "What does a soft heap sacrifice for O(1) insert?",
      options: [
        "Exactness: a fraction of keys are corrupted",
        "Space: it uses O(n^2) memory",
        "Determinism: it uses randomization",
        "Generality: it only works for integers",
      ],
      answer: 0,
      explanation:
        "The soft heap corrupts up to ε fraction of keys (increases them), breaking the comparison lower bound.",
      hints: ["Why can't a normal comparison-based heap do O(1) insert?"],
      objective: "Understand the soft heap trade-off",
    },
  ],
  exam: {
    definition:
      "A soft heap trades exact keys for speed: O(1) amortized insert/meld by corrupting at most εn keys.",
    steps: [
      "Binomial-tree-like structure.",
      "Items percolate during rank combination, causing corruption.",
      "Delete-min returns smallest corrupted key.",
    ],
    timeComplexity: "O(1) insert/meld, O(log(1/ε)) delete-min",
    spaceComplexity: "O(n)",
    correctness:
      "At most εn items corrupted at any time; amortized analysis via potential function.",
    applications: ["Optimal MST algorithm", "Approximate selection"],
    limitations: ["Keys can be inaccurate", "Complex to implement"],
    faq: [
      {
        q: "Why not just use a Fibonacci heap?",
        a: "Fibonacci heaps have O(1) insert but O(log n) delete-min; soft heaps trade exactness for O(log(1/ε)) delete-min, which can be O(1) for fixed ε.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Corruption mechanism (1).", "Amortized complexities (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "B. Chazelle, 'The Soft Heap: An Approximate Priority Queue with Optimal Error Rate,' JACM, 47(6), 2000.",
      supports: "The original soft heap paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
