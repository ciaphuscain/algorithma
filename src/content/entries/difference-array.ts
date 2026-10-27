import type { AlgorithmEntry } from "../types";

export const differenceArrayEntry: AlgorithmEntry = {
  slug: "difference-array",
  name: "Difference Array",
  aliases: ["Difference array technique", "Range update array", "Imos method"],
  curriculum: [52],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "beginner",
  summary:
    "Store the differences D[i] = A[i] − A[i − 1] instead of the values. Adding d to a whole range A[l..r] then changes just two entries, D[l] and D[r + 1]; one prefix sum over D rebuilds the array. The mirror image of prefix sums: O(1) range updates, O(n) to read the result.",
  tags: ["difference array", "range update", "prefix sum", "offline"],
  prerequisites: ["Prefix Sums"],
  related: ["prefix-sums", "fenwick-tree", "segment-tree"],
  problem: {
    input: "An array A of n numbers and a batch of updates “add d to A[l..r]”.",
    output: "The array after all updates.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine a road where you record only where the speed limit changes, not the limit at every metre. To raise the limit by 10 between two towns, you edit two signs — one at the start of the stretch (+10) and one just after its end (−10) — however long the stretch is. Driving along and adding up the changes recovers the limit everywhere. A difference array records the changes between neighbouring elements in the same way.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build D: D[0] = A[0], D[i] = A[i] − A[i − 1], and a spare D[n] = 0.",
          "For each update (l, r, d): D[l] += d and D[r + 1] −= d.",
          "Rebuild: A[i] = D[0] + D[1] + … + D[i], a running sum.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A = [3, 1, 4, 1, 5, 9, 2, 6], so D = [3, −2, 3, −3, 4, 4, −7, 4, 0]. The updates 1..4 +5, 3..7 −2 and 0..2 +10 make six writes to D in total. The running sum then gives [13, 16, 19, 4, 8, 7, 0, 4]. The second preset starts from zeros and adds 1 over three ranges, so the result counts how many ranges cover each position: [1, 2, 3, 2, 1, 1].",
      },
      {
        kind: "table",
        head: ["Operation", "Plain array", "Difference array"],
        rows: [
          ["Add d to A[l..r]", "O(r − l + 1)", "O(1)"],
          ["Read A[i]", "O(1)", "O(i) (or O(n) to rebuild all)"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The spare slot D[n] means r + 1 is always a valid index, so no bounds check is needed.",
          "It suits batches: many updates first, then one rebuild. When reads and updates interleave, a Fenwick tree over D gives O(log n) for both.",
          "The two-dimensional version adds d at (r1, c1) and (r2+1, c2+1) and subtracts it at the two other corners; a 2-D prefix sum rebuilds.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Why it works.** The rebuild computes A'[i] = Σ_{j ≤ i} D'[j]. An update adds d to D[l] and −d to D[r + 1], so it adds d to every prefix sum with l ≤ i ≤ r and d − d = 0 to those with i > r. **Cost:** O(n) to build, O(1) per update, O(n) to rebuild: O(n + q) for q updates instead of O(n · q). Differencing and prefix summing are inverse operations, like differentiation and integration. The tests compare the result with applying every update element by element.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Applying the idea twice (a difference array of a difference array) supports adding arithmetic progressions to ranges.",
          "In Japanese competitive programming the 2-D version is known as the imos method.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n + q)",
      average: "O(n + q)",
      worst: "O(n + q)",
    },
    space: "O(n)",
    worstClass: "n",
    note: "n elements, q range updates; O(1) per update.",
  },
  properties: [
    {
      label: "Update",
      value: "O(1) per range",
    },
    {
      label: "Read",
      value: "After an O(n) rebuild",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "apply_updates",
      code: `def apply_updates(a, updates):
    n = len(a)
    d = [a[0]] + [a[i] - a[i - 1] for i in range(1, n)] + [0]
    for l, r, delta in updates:
        d[l] += delta
        d[r + 1] -= delta
    out, running = [], 0
    for i in range(n):
        running += d[i]
        out.append(running)
    return out
`,
      tests: [
        {
          args: [
            [3, 1, 4, 1, 5, 9, 2, 6],
            [
              [1, 4, 5],
              [3, 7, -2],
              [0, 2, 10],
            ],
          ],
          expected: [13, 16, 19, 4, 8, 7, 0, 4],
        },
        {
          args: [
            [0, 0, 0, 0, 0, 0],
            [
              [0, 3, 1],
              [2, 5, 1],
              [1, 2, 1],
            ],
          ],
          expected: [1, 2, 3, 2, 1, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "coverage",
      code: `// How many of the closed intervals [l, r] cover each point 0..n-1?
function coverage(n, intervals) {
  const d = new Array(n + 1).fill(0);
  for (const [l, r] of intervals) {
    d[l] += 1;
    d[r + 1] -= 1;
  }
  const out = [];
  let running = 0;
  for (let i = 0; i < n; i++) out.push((running += d[i]));
  return out;
}
`,
      tests: [
        {
          args: [
            6,
            [
              [0, 3],
              [2, 5],
              [1, 2],
            ],
          ],
          expected: [1, 2, 3, 2, 1, 1],
        },
        {
          args: [3, []],
          expected: [0, 0, 0],
        },
      ],
    },
  ],
  visualizer: "difference-array",
  practice: [
    {
      id: "diff-writes",
      kind: "numeric",
      prompt:
        "An array has 1,000 elements. How many entries of the difference array change when you add 7 to A[100..899]?",
      answer: 2,
      explanation: "D[100] rises by 7 and D[900] falls by 7.",
      hints: ["Where does the range start, and where does it stop?"],
      objective: "Range update",
    },
    {
      id: "diff-when",
      kind: "mcq",
      prompt: "When is a plain difference array the wrong tool?",
      options: [
        "When reads and updates interleave",
        "When there are many updates",
        "When values are negative",
        "When ranges overlap",
      ],
      answer: 0,
      explanation:
        "Each read needs a prefix sum over D; with interleaved reads, use a Fenwick tree over D.",
      distractors: {
        "1": "That is when it shines.",
        "2": "Negative values are fine.",
        "3": "Overlapping ranges simply add.",
      },
      hints: ["What does reading one value cost?"],
      objective: "Trade-offs",
    },
  ],
  exam: {
    definition:
      "A difference array stores D[i] = A[i] − A[i − 1], so that adding a constant to a range changes only its two endpoints' differences.",
    steps: [
      "Build D from A.",
      "For each update, adjust D[l] and D[r + 1].",
      "Prefix-sum D to recover A.",
    ],
    timeComplexity: "$O(n + q)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "A prefix sum of D up to i picks up +d exactly when l ≤ i, and −d exactly when i ≥ r + 1.",
    applications: [
      "Batch range increments",
      "Counting interval coverage",
      "Sweep-line event counting",
    ],
    limitations: ["Reads need a rebuild or a prefix sum"],
    faq: [
      {
        q: "How does it relate to prefix sums?",
        a: "They are inverses: the prefix sum of the difference array is the original array.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Definition of D (1).",
          "Update rule with D[r + 1] (2).",
          "Rebuild by prefix sums (1).",
          "Complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Difference arrays for range updates and their relation to prefix sums.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
