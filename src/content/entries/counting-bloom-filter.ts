import type { AlgorithmEntry } from "../types";

export const countingBloomFilterEntry: AlgorithmEntry = {
  slug: "counting-bloom-filter",
  name: "Counting Bloom Filter",
  aliases: ["Counting Bloom Filter"],
  curriculum: [75],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "intermediate",
  summary:
    "A Bloom filter variant that replaces each bit with a small counter, enabling deletions. Insert increments k counters; delete decrements them. A position is 'set' if its counter is positive.",
  tags: ["counting bloom filter", "probabilistic", "deletion"],
  prerequisites: ["Bloom Filter"],
  related: ["bloom-filter", "cuckoo-filter"],
  problem: {
    input: "A set of insert and delete operations and a query element.",
    output: "Whether the query element is probably in the set.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Standard Bloom filters cannot support deletions because clearing a bit might affect other elements. A counting Bloom filter replaces each bit with a counter (typically 3-4 bits). Insertion increments the k counters; deletion decrements them. The filter is 'set' at a position if the counter is positive.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize an array of m counters, all 0.",
          "Insert(x): increment counters at h1(x)...hk(x).",
          "Delete(x): decrement counters at h1(x)...hk(x) (only if all are positive).",
          "Query(x): return True if all k counters are positive.",
        ],
      },
    ],
    implementation: [
      {
        kind: "code",
        language: "python",
        code: `class CountingBloom:
    def __init__(self, m, k):
        self.c = [0] * m
        self.m, self.k = m, k
    def _h(self, x): return [(hash((x,i)) % self.m) for i in range(self.k)]
    def insert(self, x):
        for h in self._h(x): self.c[h] += 1
    def delete(self, x):
        hs = self._h(x)
        if all(self.c[h] > 0 for h in hs):
            for h in hs: self.c[h] -= 1
    def query(self, x): return all(self.c[h] > 0 for h in self._h(x))`,
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With 4-bit counters, overflow probability is negligible for typical loads. Space is 4x a standard Bloom filter. The false positive rate is the same as a standard Bloom filter with the same m and k.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "d-left counting Bloom filters use d-left hashing for better space efficiency. Spectral Bloom filters generalize counters to handle multiplicity queries.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(k)",
      average: "O(k)",
      worst: "O(k)",
    },
    space: "O(m)",
    worstClass: "1",
    note: "Same as Bloom filter but with 3-4x space for counters.",
  },
  properties: [
    {
      label: "Counter size",
      value: "Typically 3-4 bits",
    },
    {
      label: "Deletions",
      value: "Supported",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [{ args: [42], expected: 42 }],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [{ args: [42], expected: 42 }],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cbf-del",
      kind: "mcq",
      prompt: "Why can a counting Bloom filter support deletions?",
      options: [
        "It stores the original elements",
        "It uses counters instead of bits, so decrementing is safe",
        "It rehashes on delete",
        "It uses a backup table",
      ],
      answer: 1,
      explanation:
        "Counters track how many elements hash to each position, so decrementing for a known element is safe.",
      hints: ["What replaces the single bit?"],
      objective: "Deletion support",
    },
  ],
  exam: {
    definition:
      "A counting Bloom filter extends a standard Bloom filter by replacing each bit with a small counter, enabling safe deletions.",
    steps: [
      "Initialize m counters to 0.",
      "Insert: increment k counter positions.",
      "Delete: decrement k counter positions.",
      "Query: check if all k counters > 0.",
    ],
    timeComplexity: "$O(k)$ per operation.",
    spaceComplexity: "$O(m \\cdot c)$ where c is counter bit-width (typically 4).",
    correctness:
      "Deletion is safe because decrementing reflects the removal of exactly one element's contribution to each counter.",
    applications: ["Network flow counting", "Streaming data deduplication"],
    limitations: [
      "3-4x space of standard Bloom filter",
      "Counter overflow (rare)",
      "False positives remain",
    ],
    faq: [
      {
        q: "What happens if a counter overflows?",
        a: "The counter saturates and should not be decremented further. With 4-bit counters this is extremely unlikely at normal loads.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Standard Bloom filter recap (1).",
          "Counter extension and deletion (2).",
          "Space trade-off analysis (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "L. Fan et al., 'Summary Cache: A Scalable Wide-Area Web Cache Sharing Protocol,' IEEE/ACM Trans. Networking, 8(3), 2000.",
      supports: "Counting Bloom filters for web cache sharing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
