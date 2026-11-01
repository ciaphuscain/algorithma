import type { AlgorithmEntry } from "../types";

export const cuckooFilterEntry: AlgorithmEntry = {
  slug: "cuckoo-filter",
  name: "Cuckoo Filter",
  aliases: [],
  curriculum: [77],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "advanced",
  summary:
    "A space-efficient probabilistic data structure supporting insert, delete, and membership queries by storing fingerprints in a cuckoo hash table, achieving better space efficiency than counting Bloom filters.",
  tags: ["probabilistic", "cuckoo hashing", "fingerprint", "membership"],
  prerequisites: ["Cuckoo Hashing", "Bloom Filter"],
  related: ["bloom-filter", "counting-bloom-filter", "cuckoo-hashing"],
  problem: {
    input: "A dynamic set with insert, delete, and membership-query operations.",
    output: "Membership answers with configurable false positive rate and deletion support.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A cuckoo filter stores short fingerprints of elements in a cuckoo hash table with two possible bucket locations. To check membership, compute the fingerprint and look in both candidate buckets. Deletion removes the fingerprint from whichever bucket holds it.",
      },
      {
        kind: "p",
        text: "The key insight is partial-key cuckoo hashing: the second bucket location is computed as h1 XOR hash(fingerprint), so you can determine both locations from just a fingerprint and one location — no need to store the original item.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute fingerprint f = fingerprint(x) and bucket indices i1 = hash(x), i2 = i1 XOR hash(f).",
          "If bucket[i1] or bucket[i2] has space, store f there.",
          "Otherwise, pick one bucket, evict an existing fingerprint, and relocate it to its alternate bucket. Repeat up to a max number of kicks.",
          "Lookup: check if f is in bucket[i1] or bucket[i2].",
          "Delete: remove one copy of f from bucket[i1] or bucket[i2].",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each bucket typically holds 4 fingerprints (bucket size b=4) for good space efficiency.",
          "Fingerprint size controls false positive rate: f bits gives roughly 1/2^f rate.",
          "Maximum kicks is typically 500; if exceeded, the table is considered full (> ~95% load).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**False positive rate**: approximately 2b/2^f where b is the bucket size and f is fingerprint bits.",
      },
      {
        kind: "p",
        text: "**Space**: about (f/alpha) bits per element where alpha is the load factor (~0.95 for b=4). For f=12, b=4: ~12.6 bits/element, beating a Bloom filter at the same FP rate.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Cuckoo filters outperform Bloom filters in space when FP rate < 3%.",
          "Semi-sorted buckets save 1 bit per element by encoding fingerprint order within a bucket.",
          "The XOR trick for alternate buckets limits the table to power-of-two sizes.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(max_kicks)",
    },
    space: "O(n)",
    worstClass: "1",
    note: "Amortized O(1) insert; lookup and delete are always O(1).",
  },
  properties: [
    {
      label: "Deletion",
      value: "Supported",
    },
    {
      label: "Space efficiency",
      value: "Better than counting Bloom filter",
    },
    {
      label: "Max load factor",
      value: "~95% with bucket size 4",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "CuckooFilter",
      code: `class CuckooFilter:
    def __init__(self, capacity, fp_size=8):
        self.cap = capacity
        self.fp_size = fp_size
        self.buckets = [[] for _ in range(capacity)]
        self.max_kicks = 500
        self.bucket_size = 4

    def _fp(self, item):
        h = hash(item) & ((1 << self.fp_size) - 1)
        return h if h != 0 else 1  # fingerprint must be nonzero

    def _i1(self, item):
        return hash(item) % self.cap

    def _i2(self, i1, fp):
        return (i1 ^ hash(fp)) % self.cap

    def insert(self, item):
        fp = self._fp(item)
        i1 = self._i1(item)
        i2 = self._i2(i1, fp)
        if len(self.buckets[i1]) < self.bucket_size:
            self.buckets[i1].append(fp)
            return True
        if len(self.buckets[i2]) < self.bucket_size:
            self.buckets[i2].append(fp)
            return True
        import random
        i = random.choice([i1, i2])
        for _ in range(self.max_kicks):
            j = random.randrange(len(self.buckets[i]))
            fp, self.buckets[i][j] = self.buckets[i][j], fp
            i = self._i2(i, fp)
            if len(self.buckets[i]) < self.bucket_size:
                self.buckets[i].append(fp)
                return True
        return False

    def lookup(self, item):
        fp = self._fp(item)
        i1 = self._i1(item)
        i2 = self._i2(i1, fp)
        return fp in self.buckets[i1] or fp in self.buckets[i2]

    def delete(self, item):
        fp = self._fp(item)
        i1 = self._i1(item)
        i2 = self._i2(i1, fp)
        if fp in self.buckets[i1]:
            self.buckets[i1].remove(fp)
            return True
        if fp in self.buckets[i2]:
            self.buckets[i2].remove(fp)
            return True
        return False

def cf_test(ops):
    cf = CuckooFilter(100)
    results = []
    for op, item in ops:
        if op == "insert":
            cf.insert(item)
        elif op == "delete":
            cf.delete(item)
        else:
            results.append(cf.lookup(item))
    return results
`,
      tests: [
        {
          args: [
            [
              ["insert", "a"],
              ["insert", "b"],
              ["lookup", "a"],
              ["lookup", "b"],
              ["lookup", "c"],
              ["delete", "a"],
              ["lookup", "a"],
            ],
          ],
          expected: [true, true, false, false],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cf-vs-bloom",
      kind: "mcq",
      prompt: "What advantage does a cuckoo filter have over a standard Bloom filter?",
      options: [
        "No false positives",
        "Supports deletion with better space",
        "Faster lookups",
        "No hash functions needed",
      ],
      answer: 1,
      explanation:
        "Cuckoo filters support deletion and are more space-efficient than counting Bloom filters for low FP rates.",
      hints: ["Think about what operation Bloom filters cannot do."],
      objective: "Compare cuckoo filter to Bloom filter",
    },
  ],
  exam: {
    definition:
      "A cuckoo filter stores fingerprints in a cuckoo hash table, supporting insert, delete, and lookup with configurable false positive rate.",
    steps: [
      "Compute fingerprint and two bucket indices",
      "Store fingerprint in available bucket",
      "On collision, evict and relocate",
      "Lookup checks both buckets",
    ],
    timeComplexity: "O(1) amortized",
    spaceComplexity: "O(n * f) bits for n elements with f-bit fingerprints",
    correctness:
      "Partial-key cuckoo hashing ensures both bucket locations are recoverable from fingerprint and one index, enabling relocation.",
    applications: ["Network deduplication", "Kernel packet filtering", "Cache sharing"],
    limitations: ["Table can fill up (insert fails)", "Cannot store duplicate items easily"],
    faq: [
      {
        q: "Why XOR for alternate bucket?",
        a: "XOR is its own inverse: i1 = i2 XOR hash(fp), enabling relocation using only the stored fingerprint.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Fingerprint storage in cuckoo table with deletion support (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "B. Fan, D. G. Andersen, M. Kaminsky, M. D. Mitzenmacher, 'Cuckoo Filter: Practically Better Than Bloom,' ACM CoNEXT 2014.",
      supports: "Original cuckoo filter paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
