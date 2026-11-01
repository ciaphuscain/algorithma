import type { AlgorithmEntry } from "../types";

export const countingBloomFilterEntry: AlgorithmEntry = {
  slug: "counting-bloom-filter",
  name: "Counting Bloom Filter",
  aliases: ["CBF"],
  curriculum: [75],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "intermediate",
  summary:
    "Extends a Bloom filter by replacing single bits with small counters, enabling deletions while preserving the probabilistic membership guarantee.",
  tags: ["probabilistic", "bloom filter", "hashing", "deletion"],
  prerequisites: ["Bloom Filter", "Hash Tables"],
  related: ["bloom-filter", "cuckoo-filter"],
  problem: {
    input: "A dynamic set with insert, delete, and membership-query operations.",
    output:
      "Membership answers with no false negatives; false positive rate bounded by design parameters.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A standard Bloom filter cannot delete elements because clearing a bit might affect other elements that hash to the same position. A counting Bloom filter replaces each bit with a small counter (typically 4 bits). Insert increments k counters; delete decrements them; query checks all k counters are non-zero.",
      },
      {
        kind: "p",
        text: "The trade-off is space: a 4-bit counter CBF uses 4x the space of a standard Bloom filter, but supports deletions without rebuilding.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Allocate an array of m counters, each 4 bits, all zero.",
          "Insert(x): for each hash function h_i, increment counter[h_i(x)].",
          "Delete(x): for each hash function h_i, decrement counter[h_i(x)].",
          "Query(x): return True if all counter[h_i(x)] > 0.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: m=8, k=2. h1(a)=1, h2(a)=5, h1(b)=3, h2(b)=5.",
      },
      {
        kind: "table",
        head: ["Operation", "Counters [0..7]"],
        rows: [
          ["init", "[0,0,0,0,0,0,0,0]"],
          ["insert(a)", "[0,1,0,0,0,1,0,0]"],
          ["insert(b)", "[0,1,0,1,0,2,0,0]"],
          ["delete(a)", "[0,0,0,1,0,1,0,0]"],
          ["query(a)?", "counter[1]=0 → False (correct)"],
          ["query(b)?", "counter[3]=1,counter[5]=1 → True"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "4 bits per counter suffices in practice; overflow probability is negligible for reasonable load.",
          "If a counter would overflow, leave it at max (saturating arithmetic) — this can cause false negatives on delete.",
          "Variable-length counters save space when most counters are small.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The false positive rate is the same as a standard Bloom filter with the same m and k: approximately (1 - e^(-kn/m))^k.",
      },
      {
        kind: "p",
        text: "The probability that any counter exceeds c is bounded by (e * kn/m / c)^c by a Chernoff-like argument. For c=16 (4 bits) and typical loads, this is negligible.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Spectral Bloom filters extend CBFs to estimate frequencies, not just membership.",
          "d-left counting Bloom filters use d-left hashing for better space efficiency.",
          "In distributed systems, CBFs enable set reconciliation by exchanging and merging counter arrays.",
        ],
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
    note: "k hash functions per operation; m counters total.",
  },
  properties: [
    {
      label: "False positives",
      value: "Possible",
    },
    {
      label: "False negatives",
      value: "No (unless counter overflow)",
    },
    {
      label: "Deletion",
      value: "Supported",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "CountingBloomFilter",
      code: `class CountingBloomFilter:
    def __init__(self, size, num_hashes):
        self.m = size
        self.k = num_hashes
        self.counters = [0] * size

    def _hashes(self, item):
        return [hash((i, item)) % self.m for i in range(self.k)]

    def insert(self, item):
        for h in self._hashes(item):
            self.counters[h] += 1

    def delete(self, item):
        for h in self._hashes(item):
            if self.counters[h] > 0:
                self.counters[h] -= 1

    def query(self, item):
        return all(self.counters[h] > 0 for h in self._hashes(item))

def cbf_test(ops):
    """ops: list of [op, item]. Returns list of query results."""
    cbf = CountingBloomFilter(1000, 5)
    results = []
    for op, item in ops:
        if op == "insert":
            cbf.insert(item)
        elif op == "delete":
            cbf.delete(item)
        else:
            results.append(cbf.query(item))
    return results
`,
      tests: [
        {
          args: [
            [
              ["insert", "a"],
              ["insert", "b"],
              ["query", "a"],
              ["query", "b"],
              ["delete", "a"],
              ["query", "a"],
              ["query", "b"],
            ],
          ],
          expected: [true, true, false, true],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cbf-advantage",
      kind: "mcq",
      prompt: "What is the main advantage of a counting Bloom filter over a standard Bloom filter?",
      options: [
        "Lower false positive rate",
        "Supports deletion",
        "Uses less space",
        "Faster queries",
      ],
      answer: 1,
      explanation: "The counters allow decrementing on delete, which single bits cannot do.",
      hints: ["What can you do with a counter that you can't with a bit?"],
      objective: "Understand CBF motivation",
    },
  ],
  exam: {
    definition:
      "A counting Bloom filter replaces each bit in a Bloom filter with a small counter, supporting deletions by decrementing counters.",
    steps: [
      "Allocate m counters",
      "Insert: increment k counters",
      "Delete: decrement k counters",
      "Query: check all k counters > 0",
    ],
    timeComplexity: "O(k) per operation",
    spaceComplexity: "O(m * c) bits where c is counter width",
    correctness:
      "Same false positive analysis as Bloom filter. Counter overflow probability is negligible for 4-bit counters under normal load.",
    applications: [
      "Network duplicate detection with churn",
      "Distributed caching",
      "Set reconciliation",
    ],
    limitations: [
      "4x space of standard Bloom filter",
      "Counter overflow can cause false negatives",
    ],
    faq: [
      {
        q: "Why not just rebuild the Bloom filter?",
        a: "Rebuilding requires storing all elements. CBF supports deletion without storing the set.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Counter-based extension of Bloom filter enabling deletion (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "L. Fan, P. Cao, J. Almeida, A. Z. Broder, 'Summary Cache: A Scalable Wide-Area Web Cache Sharing Protocol,' IEEE/ACM Trans. Networking, 8(3):281-293, 2000.",
      supports: "Introduced counting Bloom filters.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
