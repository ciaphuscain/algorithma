import type { AlgorithmEntry } from "../types";

export const countMinSketchEntry: AlgorithmEntry = {
  slug: "count-min-sketch",
  name: "Count-Min Sketch",
  aliases: ["CM Sketch"],
  curriculum: [78],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "intermediate",
  summary:
    "A probabilistic data structure that estimates the frequency of elements in a stream using multiple hash functions and a 2D array of counters, with guaranteed one-sided error (never underestimates).",
  tags: ["streaming", "probabilistic", "frequency estimation", "hashing"],
  prerequisites: ["Hash Tables"],
  related: ["bloom-filter", "counting-bloom-filter"],
  problem: {
    input: "A stream of elements and point queries asking for the frequency of a given element.",
    output:
      "An estimate of each element's frequency that is at most the true count plus epsilon * N with probability at least 1 - delta.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine keeping d independent frequency tables, each with w buckets. When you see an element, you increment one bucket in each table (chosen by that table's hash function). To query, you take the minimum across all d tables — collisions can only add, never subtract, so the minimum is the tightest upper bound.",
      },
      {
        kind: "p",
        text: "By choosing w = ceil(e/epsilon) and d = ceil(ln(1/delta)), you get frequency estimates within epsilon*N of the true count with probability at least 1-delta, using only O((1/epsilon) * ln(1/delta)) space regardless of the number of distinct elements.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Allocate a d x w matrix of counters, all zero.",
          "For each element x in the stream: for each row i, increment counter[i][h_i(x) mod w].",
          "To query frequency of x: return min over all rows i of counter[i][h_i(x) mod w].",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: w=4, d=2, stream = [a, b, a, c, a]. Suppose h1(a)=0, h1(b)=1, h1(c)=0, h2(a)=2, h2(b)=2, h2(c)=3.",
      },
      {
        kind: "table",
        head: ["After", "Row 1", "Row 2"],
        rows: [
          ["a", "[1,0,0,0]", "[0,0,1,0]"],
          ["b", "[1,1,0,0]", "[0,0,2,0]"],
          ["a", "[2,1,0,0]", "[0,0,3,0]"],
          ["c", "[3,1,0,0]", "[0,0,3,1]"],
          ["a", "[4,1,0,0]", "[0,0,4,1]"],
        ],
      },
      {
        kind: "p",
        text: "Query a: min(row1[0], row2[2]) = min(4, 4) = 4. True count is 3, but c collides with a in row 1, inflating it. Here both rows give 4 because b also collides with a in row 2. The estimate is 4 >= 3 (never underestimates).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use pairwise-independent hash functions: h_i(x) = (a_i * x + b_i) mod p mod w.",
          "For deletion support, allow negative counters (Count-Min with conservative updates).",
          "Conservative update: only increment counters that equal the current minimum.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Error guarantee**: P(estimate(x) - true(x) > epsilon * N) < delta, where N is the total stream length.",
      },
      {
        kind: "p",
        text: "**Space**: O((1/epsilon) * ln(1/delta)) counters, each O(log N) bits. Total: O((1/epsilon) * ln(1/delta) * log N) bits.",
      },
      {
        kind: "p",
        text: "**Time**: O(d) = O(ln(1/delta)) per update and query.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Count-Min can estimate inner products of two frequency vectors, useful for join-size estimation in databases.",
          "The Count-Sketch variant uses +1/-1 random signs and takes the median, giving unbiased estimates.",
          "Heavy hitter detection: elements whose CM estimate exceeds epsilon*N are reported as heavy hitters.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(d)",
      average: "O(d)",
      worst: "O(d)",
    },
    space: "O(w * d)",
    worstClass: "1",
    note: "d and w are constants chosen from error parameters epsilon and delta.",
  },
  properties: [
    {
      label: "Error type",
      value: "One-sided (never underestimates)",
    },
    {
      label: "Space",
      value: "O((1/epsilon) ln(1/delta))",
    },
    {
      label: "Supports deletion",
      value: "With modifications",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "cms_test",
      code: `import hashlib

class CountMinSketch:
    def __init__(self, width, depth):
        self.w = width
        self.d = depth
        self.table = [[0] * width for _ in range(depth)]

    def _hashes(self, key):
        for i in range(self.d):
            h = hash((i, key)) % self.w
            yield i, h

    def add(self, key, count=1):
        for i, h in self._hashes(key):
            self.table[i][h] += count

    def query(self, key):
        return min(self.table[i][h] for i, h in self._hashes(key))

def cms_test(ops):
    """ops: list of ("add", key) or ("query", key) tuples. Returns list of query results."""
    cms = CountMinSketch(100, 5)
    results = []
    for op, key in ops:
        if op == "add":
            cms.add(key)
        else:
            results.append(cms.query(key))
    return results
`,
      tests: [
        {
          args: [
            [
              ["add", "a"],
              ["add", "a"],
              ["add", "a"],
              ["add", "b"],
              ["query", "a"],
              ["query", "b"],
              ["query", "c"],
            ],
          ],
          expected: [3, 1, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cms-error",
      kind: "mcq",
      prompt: "A Count-Min Sketch can:",
      options: [
        "Underestimate frequencies",
        "Overestimate frequencies",
        "Both over- and underestimate",
        "Give exact counts",
      ],
      answer: 1,
      explanation:
        "Collisions only add to counters, so the minimum across rows is always >= the true count.",
      hints: ["Think about what hash collisions do to counters."],
      objective: "Understand CMS error properties",
    },
  ],
  exam: {
    definition:
      "Count-Min Sketch estimates stream element frequencies using d hash functions mapping to a d x w counter matrix. The estimate is the minimum counter across all rows.",
    steps: [
      "Allocate d x w counter matrix",
      "Update: increment d counters (one per row)",
      "Query: return minimum of d counters",
    ],
    timeComplexity: "O(d) per operation",
    spaceComplexity: "O(w * d)",
    correctness:
      "By Markov's inequality on each row and union bound across rows, P(error > epsilon*N) < delta when w=ceil(e/epsilon), d=ceil(ln(1/delta)).",
    applications: [
      "Stream frequency estimation",
      "Heavy hitter detection",
      "Database join-size estimation",
    ],
    limitations: ["Cannot delete without modifications", "Only upper-bounds frequencies"],
    faq: [
      {
        q: "Why take the minimum?",
        a: "Each row independently overestimates. The minimum is the tightest upper bound.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Structure and query rule (2)"],
      },
      {
        marks: 5,
        outline: ["Data structure and operations (2)", "Error analysis (2)", "Applications (1)"],
      },
    ],
  },
  references: [
    {
      citation:
        "G. Cormode and S. Muthukrishnan, 'An improved data stream summary: the count-min sketch and its applications,' J. Algorithms, 55(1):58-75, 2005.",
      supports: "Original Count-Min Sketch paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
