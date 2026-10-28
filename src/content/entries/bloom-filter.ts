import type { AlgorithmEntry } from "../types";

export const bloomFilterEntry: AlgorithmEntry = {
  slug: "bloom-filter",
  name: "Bloom Filter",
  aliases: ["Bloom Filter"],
  curriculum: [74],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "intermediate",
  summary:
    "A space-efficient probabilistic set using k hash functions and a bit array of m bits. Reports 'definitely not in set' or 'probably in set.' False positives possible; false negatives impossible.",
  tags: ["bloom filter", "probabilistic", "hashing", "set membership"],
  prerequisites: ["Hash Tables"],
  related: ["counting-bloom-filter", "cuckoo-filter"],
  problem: {
    input: "A set of elements to insert and a query element.",
    output: "Whether the query element is probably in the set.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A Bloom filter is a bit array of m bits, all initially 0. To insert an element, hash it with k independent hash functions and set those k bit positions to 1. To query, check all k positions: if any is 0, the element is definitely absent; if all are 1, it is probably present (false positive).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize a bit array of m bits, all 0.",
          "Insert(x): compute h1(x), h2(x), ..., hk(x); set those positions to 1.",
          "Query(x): compute the same k positions; if all are 1, report 'probably yes'; if any is 0, report 'definitely no'.",
        ],
      },
    ],
    implementation: [
      {
        kind: "code",
        language: "python",
        code: `class BloomFilter:
    def __init__(self, m, k):
        self.bits = [False] * m
        self.m, self.k = m, k
    def _hashes(self, x):
        return [(hash((x, i)) % self.m) for i in range(self.k)]
    def insert(self, x):
        for h in self._hashes(x): self.bits[h] = True
    def query(self, x):
        return all(self.bits[h] for h in self._hashes(x))`,
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The false positive rate is approximately $(1 - e^{-kn/m})^k$ after n insertions. The optimal number of hash functions is $k = (m/n) \\ln 2$. Space per element is about $-\\ln p / (\\ln 2)^2$ bits for false positive rate p.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Counting Bloom filters replace each bit with a counter, enabling deletions. Cuckoo filters offer better space efficiency and support deletion. Bloom filters are used in databases (Cassandra, LevelDB), web caches, and network routers.",
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
    note: "k hash computations per operation; k is typically small and constant.",
  },
  properties: [
    {
      label: "False positive rate",
      value: "≈ (1 − e^(−kn/m))^k",
    },
    {
      label: "Deletions",
      value: "Not supported (use counting variant)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bloom_fp_rate",
      code: `import math
def bloom_fp_rate(m, k, n):
    return (1 - math.exp(-k * n / m)) ** k
`,
      tests: [
        {
          args: [100, 7, 10],
          expected: 0.008193722065862417,
        },
      ],
    },
    {
      language: "javascript",
      entry: "bloomFpRate",
      code: `function bloomFpRate(m, k, n) {
  return Math.pow(1 - Math.exp(-k * n / m), k);
}
`,
      tests: [
        {
          args: [100, 7, 10],
          expected: 0.008193722065862417,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bloom-fp",
      kind: "mcq",
      prompt: "A Bloom filter reports that element x is in the set. What can you conclude?",
      options: [
        "x is definitely in the set",
        "x is probably in the set (false positive possible)",
        "x was inserted exactly once",
        "The filter is full",
      ],
      answer: 1,
      explanation: "Bloom filters can have false positives but never false negatives.",
      hints: ["What kind of errors does a Bloom filter make?"],
      objective: "False positives",
    },
  ],
  exam: {
    definition:
      "A Bloom filter is a space-efficient probabilistic data structure that tests set membership using k hash functions and a bit array of m bits.",
    steps: [
      "Initialize m-bit array to 0.",
      "Insert: hash element k times, set those bits.",
      "Query: hash element k times, check all bits.",
    ],
    timeComplexity: "$O(k)$ per operation, where k is the number of hash functions.",
    spaceComplexity: "$O(m)$ bits.",
    correctness:
      "No false negatives: if an element was inserted, all k bit positions are 1. False positives occur when bits set by other elements coincidentally match.",
    applications: [
      "Database key lookups (avoid disk reads)",
      "Network packet filtering",
      "Web cache sharing",
    ],
    limitations: [
      "No deletion support",
      "False positives increase with load",
      "Requires good hash functions",
    ],
    faq: [
      {
        q: "Can a Bloom filter have false negatives?",
        a: "No. If an element was inserted, all its k bit positions are set to 1 and will remain so.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define the data structure and its bit array (1).",
          "Describe insert and query operations (2).",
          "Derive the false positive probability formula (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "B. Bloom, 'Space/Time Trade-offs in Hash Coding with Allowable Errors,' Communications of the ACM, 13(7), 1970.",
      supports: "Original Bloom filter paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
