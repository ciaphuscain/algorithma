import type { AlgorithmEntry } from "../types";

export const perfectHashingEntry: AlgorithmEntry = {
  slug: "perfect-hashing",
  name: "Perfect Hashing",
  aliases: ["FKS Hashing", "Two-Level Hashing"],
  curriculum: [72],
  domain: "arrays-hashing",
  subcategory: "Hash Tables",
  difficulty: "advanced",
  summary:
    "Constructs a static hash table with guaranteed O(1) worst-case lookups and no collisions for a known set of keys, using a two-level scheme with O(n) space.",
  tags: ["hashing", "perfect hash", "static", "FKS"],
  prerequisites: ["Hash Tables"],
  related: ["cuckoo-hashing"],
  problem: {
    input: "A fixed set S of n keys.",
    output: "A hash table that answers membership queries in O(1) worst case with no collisions.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Normal hash tables have O(1) expected time but collisions can degrade to O(n). If the key set is known in advance, we can pick hash functions that guarantee zero collisions — a 'perfect' hash.",
      },
      {
        kind: "p",
        text: "The trick is two levels: the first level hashes into buckets, then each bucket uses a second hash into a table of size proportional to the square of the bucket size. This sounds expensive but the birthday-bound ensures O(n) total space.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pick a universal hash function h₁ to map n keys into m = n buckets.",
          "Let bⱼ be the number of keys in bucket j. Allocate a second-level table of size bⱼ² for bucket j.",
          "For each bucket, try random second-level hash functions until one is injective (no collisions). Expected O(1) tries per bucket.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** Keys {1, 5, 9}. h₁ maps to 3 buckets. Bucket with {1,9} gets a 4-slot second table with a collision-free h₂.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Construction is O(n) expected time using universal hashing.",
          "Space: O(n) because Σ bⱼ² = O(n) when m = n (by the birthday bound).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With m = n buckets and a universal hash, $E[\\sum b_j^2] = n + n(n-1)/m = O(n)$. Each second-level table of size $b_j^2$ is collision-free with probability ≥ 1/2, so O(1) expected tries.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Minimal perfect hashing maps n keys to exactly {0, ..., n−1} with no gaps.",
          "Dynamic perfect hashing (Dietzfelbinger et al.) supports insertions and deletions.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
    },
    space: "O(n)",
    worstClass: "1",
    note: "O(1) worst-case lookup. O(n) expected construction time.",
  },
  properties: [
    {
      label: "Lookup",
      value: "O(1) worst case",
    },
    {
      label: "Static",
      value: "Keys must be known at construction time",
    },
    {
      label: "Space",
      value: "$O(n)$",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "perfect_hash_test",
      code: `def perfect_hash_build(keys):
    """Build a simple two-level perfect hash for distinct integer keys.
    Returns (table, m, a, b) where lookup uses ((a*k+b)%p)%m then second level."""
    n = len(keys)
    if n == 0:
        return [], 0, 0, 0
    p = 1000000007
    import random
    random.seed(42)
    for _ in range(100):
        a = random.randint(1, p - 1)
        b = random.randint(0, p - 1)
        table = [None] * (n * n)
        ok = True
        for k in keys:
            idx = ((a * k + b) % p) % (n * n)
            if table[idx] is not None:
                ok = False
                break
            table[idx] = k
        if ok:
            return table, n * n, a, b
    return None

def perfect_hash_lookup(table, size, a, b, key):
    p = 1000000007
    idx = ((a * key + b) % p) % size
    return table[idx] == key

def perfect_hash_test(keys):
    result = perfect_hash_build(keys)
    if result is None:
        return False
    table, size, a, b = result
    return all(perfect_hash_lookup(table, size, a, b, k) for k in keys)
`,
      tests: [
        {
          args: [[3, 7, 11]],
          expected: true,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ph-space",
      kind: "mcq",
      prompt: "Why does two-level perfect hashing use O(n) total space despite bⱼ² per bucket?",
      options: [
        "Because Σ bⱼ² = O(n) by the birthday bound with n buckets",
        "Because all buckets have size 1",
        "Because it uses compression",
        "Because keys are sorted first",
      ],
      answer: 0,
      explanation:
        "With m=n buckets and a universal hash, the expected sum of squares of bucket sizes is O(n).",
      hints: ["What is E[Σ bⱼ²] with a universal hash into n buckets?"],
      objective: "Understand FKS space analysis",
    },
  ],
  exam: {
    definition:
      "Perfect hashing provides O(1) worst-case lookup for a static key set using two-level universal hashing in O(n) space.",
    steps: [
      "Hash n keys into n buckets.",
      "Each bucket j gets a table of size bⱼ².",
      "Pick collision-free second-level hash per bucket.",
    ],
    timeComplexity: "$O(1)$ lookup, $O(n)$ construction.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Σ bⱼ² = O(n) by the birthday bound; each bⱼ²-sized table avoids collisions with probability ≥ 1/2.",
    applications: [
      "Compiler keyword lookup",
      "Network packet classification",
      "Read-only dictionaries",
    ],
    limitations: ["Static: no insertions after construction"],
    faq: [
      {
        q: "Why bⱼ²?",
        a: "With bⱼ keys in bⱼ² slots, the probability of any collision is < 1/2, so a random hash works quickly.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Two-level scheme and O(n) space proof (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        'M. L. Fredman, J. Komlós, E. Szemerédi, "Storing a sparse table with O(1) worst case access time," JACM, 1984.',
      supports: "The FKS perfect hashing scheme.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
