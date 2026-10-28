import type { AlgorithmEntry } from "../types";

export const hashChainingEntry: AlgorithmEntry = {
  slug: "hash-chaining",
  name: "Hash Table (Separate Chaining)",
  aliases: ["Separate chaining", "Chained hash table", "Hash map"],
  curriculum: [67],
  domain: "arrays-hashing",
  subcategory: "Hash tables",
  difficulty: "beginner",
  summary:
    "Stores each key in the bucket chosen by its hash, with all colliding keys kept in a list per bucket; with a good hash and a bounded load factor, insert, find and delete take constant expected time.",
  tags: ["hashing", "hash table", "dictionary", "set", "collisions", "load factor"],
  prerequisites: ["Arrays and indexing", "Linked lists"],
  related: ["open-addressing", "robin-hood-hashing", "cuckoo-hashing"],
  problem: {
    input:
      "A sequence of insert, find and delete operations on integer keys, and a table of $m$ buckets.",
    output:
      "Each operation's answer (inserted, already present, found, missing, deleted) and the final buckets.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A hash table turns a key into an array index, so it can jump straight to where the key belongs instead of searching. The function that does this, $h(k)$, will sometimes send two different keys to the same index: a **collision**.",
      },
      {
        kind: "p",
        text: "Separate chaining handles collisions in the simplest way: each array cell, a **bucket**, holds a list of every key that hashed there. To find a key, compute its bucket and look through that one short list.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute the bucket $b = h(k)$. This visualizer uses $h(k) = k \\bmod m$.",
          "**Find:** walk the list in bucket $b$, comparing each key with $k$.",
          "**Insert:** find first; if $k$ is absent, append it to bucket $b$.",
          "**Delete:** find $k$ and remove it from the list.",
        ],
      },
      { kind: "heading", text: "Worked example: m = 7" },
      {
        kind: "p",
        text: "Insert 50, 700, 76, 85, 92, 73, 101. Their buckets are $50 \\bmod 7 = 1$, $700 \\bmod 7 = 0$, 6, 1, 1, 3 and 3:",
      },
      {
        kind: "table",
        head: ["Bucket", "0", "1", "2", "3", "4", "5", "6"],
        rows: [["Chain", "700", "50, 85, 92", "", "73, 101", "", "", "76"]],
      },
      {
        kind: "p",
        text: "Seven keys in seven buckets: the load factor is $\\alpha = n/m = 1$, yet three buckets are empty and bucket 1 holds three keys. Finding 92 compares it with 50, 85 and then 92: three probes. Finding 15 (bucket 1) compares with all three keys and reports it missing. After deleting 85, finding 92 takes two probes. The whole run makes 14 probes.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Resize to keep $\\alpha$ bounded.** When $n/m$ passes a threshold (often 1), allocate about twice as many buckets and re-insert every key. Each key moves $O(1)$ times on average over many insertions, so the amortised cost stays constant.",
          "**Use a real hash function.** `k mod m` is fine for teaching, but keys with a common pattern (all multiples of $m$, say) all land in one bucket. Libraries mix the bits of the key, and many randomise the function per process so that an attacker cannot choose colliding keys.",
          "**Chains need not be linked lists.** Small arrays are faster in practice; Java's `HashMap` turns long chains into balanced trees, which caps a bad bucket at $O(\\log n)$.",
          "**Equality and hashing must agree:** equal keys must have equal hashes, or a find will look in the wrong bucket.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Expected cost under simple uniform hashing" },
      {
        kind: "p",
        text: "Assume each key is equally likely to hash to any of the $m$ buckets, independently of the others. Then the expected length of a chain is $\\alpha = n/m$, and:",
      },
      {
        kind: "list",
        items: [
          "an unsuccessful search examines a whole chain: $\\Theta(1 + \\alpha)$ expected time;",
          "a successful search examines, on average, the keys inserted into its chain before it, plus itself: also $\\Theta(1 + \\alpha)$.",
        ],
      },
      {
        kind: "p",
        text: "So if $m$ grows with $n$ (keeping $\\alpha = O(1)$), every operation takes $O(1)$ expected time. The worst case is still $\\Theta(n)$: the visualizer's second preset puts every key in one bucket.",
      },
      {
        kind: "p",
        text: "**Universal hashing** removes the need to assume random keys: choosing $h$ at random from a universal family makes the expected cost $O(1 + \\alpha)$ for *every* fixed set of keys, because any two distinct keys collide with probability at most $1/m$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Open addressing** stores keys in the array itself, saving the list pointers at the price of probing; see the open addressing, Robin Hood and cuckoo hashing entries.",
          "**Perfect hashing** (FKS) builds a two-level table with no collisions at all for a fixed set of keys, giving $O(1)$ worst-case lookups.",
          "**Hash flooding.** Web servers have been attacked by sending many keys that collide under a known hash function, turning each request into quadratic work; randomised hash functions such as SipHash are the standard defence.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1 + \\alpha)", worst: "O(n)" },
    space: "\\Theta(n + m)",
    worstClass: "n",
    note: "$\\alpha = n/m$ is the load factor; the average assumes simple uniform hashing.",
  },
  properties: [
    { label: "Load factor", value: "May exceed 1" },
    { label: "Deletion", value: "Simple: remove from the list" },
    { label: "Order", value: "None: keys are not kept sorted" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run_ops",
      code: `def run_ops(m, ops):
    """ops: list of (op, key) with op in '+', '?', '-'. Returns results and buckets."""
    buckets = [[] for _ in range(m)]
    results = []
    for op, k in ops:
        chain = buckets[k % m]
        if op == '+':
            if k in chain:
                results.append('present')
            else:
                chain.append(k)
                results.append('inserted')
        elif op == '?':
            results.append('found' if k in chain else 'missing')
        else:
            if k in chain:
                chain.remove(k)
                results.append('deleted')
            else:
                results.append('missing')
    return [results, buckets]
`,
      tests: [
        {
          args: [
            7,
            [
              ["+", 50],
              ["+", 85],
              ["+", 92],
              ["?", 92],
              ["-", 85],
              ["?", 85],
            ],
          ],
          expected: [
            ["inserted", "inserted", "inserted", "found", "deleted", "missing"],
            [[], [50, 92], [], [], [], [], []],
          ],
        },
        {
          args: [
            4,
            [
              ["+", 9],
              ["+", 9],
              ["?", 13],
            ],
          ],
          expected: [
            ["inserted", "present", "missing"],
            [[], [9], [], []],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "runOps",
      code: `function runOps(m, ops) {
  const buckets = Array.from({ length: m }, () => []);
  const results = [];
  for (const [op, k] of ops) {
    const chain = buckets[k % m];
    const at = chain.indexOf(k);
    if (op === "+") {
      if (at >= 0) results.push("present");
      else {
        chain.push(k);
        results.push("inserted");
      }
    } else if (op === "?") {
      results.push(at >= 0 ? "found" : "missing");
    } else if (at >= 0) {
      chain.splice(at, 1);
      results.push("deleted");
    } else {
      results.push("missing");
    }
  }
  return [results, buckets];
}
`,
      tests: [
        {
          args: [
            5,
            [
              ["+", 3],
              ["+", 8],
              ["+", 13],
              ["?", 8],
              ["?", 18],
            ],
          ],
          expected: [
            ["inserted", "inserted", "inserted", "found", "missing"],
            [[], [], [], [3, 8, 13], []],
          ],
        },
        {
          args: [
            3,
            [
              ["-", 1],
              ["+", 1],
              ["-", 1],
            ],
          ],
          expected: [
            ["missing", "inserted", "deleted"],
            [[], [], []],
          ],
        },
      ],
    },
  ],
  visualizer: "hash-chaining",
  practice: [
    {
      id: "chaining-bucket",
      kind: "numeric",
      prompt: "With $h(k) = k \\bmod 7$, which bucket does the key 101 go to?",
      answer: 3,
      explanation: "$101 = 14 \\cdot 7 + 3$.",
      hints: ["Divide by 7 and keep the remainder."],
      objective: "Compute a bucket",
    },
    {
      id: "chaining-probes",
      kind: "numeric",
      prompt:
        "In the worked example, bucket 1 holds 50, 85, 92 in that order. How many keys does an unsuccessful search for 15 compare?",
      answer: 3,
      explanation:
        "15 hashes to bucket 1; a search that fails must compare every key in that chain.",
      hints: ["An unsuccessful search cannot stop early in an unsorted chain."],
      objective: "Count probes",
    },
    {
      id: "chaining-alpha",
      kind: "mcq",
      prompt:
        "A chained table has 1,000 buckets and 3,000 keys, hashed uniformly. About how many keys does an unsuccessful search compare, on average?",
      options: ["3", "1", "1,000", "$\\log_2 3000 \\approx 12$"],
      answer: 0,
      explanation:
        "The load factor is $\\alpha = 3000/1000 = 3$, and an unsuccessful search walks one whole chain, of expected length $\\alpha$.",
      distractors: {
        1: "That would be the case with $\\alpha = 1$.",
        2: "Only one bucket is searched, not all of them.",
        3: "Chains are not searched by halving; they are short lists walked in full.",
      },
      hints: ["What is the expected length of one chain?"],
      objective: "Use the load factor",
    },
  ],
  exam: {
    definition:
      "A hash table with separate chaining stores each key in the list (chain) of bucket $h(k)$ of an array of $m$ buckets; colliding keys share a chain.",
    steps: [
      "Insert $k$: compute $h(k)$; if $k$ is not in the chain, add it.",
      "Find $k$: search the chain of $h(k)$.",
      "Delete $k$: remove $k$ from the chain of $h(k)$.",
      "Resize (e.g. double $m$ and rehash) when $\\alpha = n/m$ grows too large.",
    ],
    timeComplexity:
      "$\\Theta(1 + \\alpha)$ expected per operation under simple uniform hashing; $\\Theta(n)$ in the worst case.",
    spaceComplexity: "$\\Theta(n + m)$.",
    correctness:
      "A key is only ever stored in bucket $h(k)$, and every operation on $k$ looks only there, so a find succeeds exactly when $k$ was inserted and not deleted.",
    applications: [
      "Dictionaries and sets in programming languages",
      "Symbol tables in compilers, caches, database hash joins",
      "Counting frequencies, de-duplication",
    ],
    limitations: [
      "No ordering: range queries and sorted iteration need another structure",
      "Bad hash functions or adversarial keys give $\\Theta(n)$ chains",
      "Extra memory for list pointers",
    ],
    faq: [
      {
        q: "Can the load factor exceed 1?",
        a: "Yes, with chaining. Each bucket simply holds more keys; performance degrades gradually as $1 + \\alpha$.",
      },
      {
        q: "Why is $k \\bmod m$ risky?",
        a: "Keys that share a pattern with $m$ (e.g. all even keys with even $m$) crowd into few buckets. A prime $m$ helps; a randomised hash is better.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Array of buckets; colliding keys kept in a list per bucket.",
          "$O(1 + \\alpha)$ expected time per operation.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition of hashing, collisions and chaining (1).",
          "Insert, find, delete (2).",
          "Example with a small $m$ showing a collision (1).",
          "Load factor and expected complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Hash functions and collisions — 1.",
          "Chaining operations with pseudocode — 2.",
          "Full worked example: table after each insertion, a search and a deletion — 3.",
          "Analysis under simple uniform hashing, worst case — 2.",
          "Resizing, choice of hash function, comparison with open addressing — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §11.2–11.3.",
      supports:
        "Chaining, simple uniform hashing and the $\\Theta(1 + \\alpha)$ analysis, hash functions and universal hashing.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §6.4.",
      supports: "Hashing, collision resolution by chaining, and its analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
