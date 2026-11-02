import type { AlgorithmEntry } from "../types";

export const prefixXorEntry: AlgorithmEntry = {
  slug: "prefix-xor",
  name: "Prefix XOR",
  aliases: ["XOR prefix", "Range XOR queries", "Cumulative XOR"],
  curriculum: [91],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "beginner",
  summary:
    "Prefix sums with XOR in place of addition: X[i] is the XOR of the first i elements, and the XOR of any range A[l..r] is X[r + 1] ⊕ X[l], because the shared prefix cancels itself (x ⊕ x = 0).",
  tags: ["xor", "prefix", "range query", "bitwise"],
  prerequisites: ["Prefix Sums"],
  related: ["prefix-sums", "difference-array", "sparse-table"],
  problem: {
    input: "An array of non-negative integers and queries “what is A[l] ⊕ … ⊕ A[r]?”.",
    output: "The XOR for each query.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "XOR works like a light switch: flipping a bit twice puts it back. If X[r + 1] is everything up to r flipped together, and X[l] is everything before l, then XOR-ing the two flips the common part twice — it vanishes — and only A[l..r] remains. Unlike subtraction for prefix sums, no inverse operation is needed: XOR is its own inverse.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: ["X[0] = 0 and X[i + 1] = X[i] ⊕ A[i].", "The XOR of A[l..r] is X[r + 1] ⊕ X[l]."],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A = [5, 3, 12, 9, 6, 7, 1, 14] gives X = [0, 5, 6, 10, 3, 5, 2, 3, 13]. The XOR of A[1..4] is X[5] ⊕ X[1] = 5 ⊕ 5 = 0 (indeed 3 ⊕ 12 ⊕ 9 ⊕ 6 = 0), of the whole array X[8] ⊕ X[0] = 13, and of A[2..3] X[4] ⊕ X[2] = 3 ⊕ 6 = 5.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Two equal prefix values X[l] = X[r + 1] mean the range A[l..r] XORs to 0; counting equal prefix values with a hash map counts such subarrays in O(n).",
          "More generally, the number of subarrays with XOR k is the number of pairs l < r + 1 with X[l] = X[r + 1] ⊕ k.",
          "Prefix XOR over a trie of the binary values finds the subarray with the largest XOR in O(n · bits).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Why it works.** XOR is associative and commutative, 0 is its identity, and every value is its own inverse. So X[r + 1] ⊕ X[l] = (A[0] ⊕ … ⊕ A[l − 1]) ⊕ (A[0] ⊕ … ⊕ A[r]) = A[l] ⊕ … ⊕ A[r]. The same construction works for any group operation (addition, XOR, multiplication modulo a prime away from 0) — but not for min or max, which have no inverse; those need a sparse table. **Cost:** O(n) to build, O(1) per query. The tests compare with XOR-ing each range directly.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "XOR is addition in the vector space GF(2)^b, so prefix XORs are prefix sums there; linear-basis techniques build on this view.",
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
    note: "n elements, q queries.",
  },
  properties: [
    {
      label: "Query",
      value: "O(1)",
    },
    {
      label: "Needs an inverse",
      value: "XOR is its own",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "range_xors",
      code: `def range_xors(a, queries):
    x = [0]
    for v in a:
        x.append(x[-1] ^ v)
    return [x[r + 1] ^ x[l] for l, r in queries]
`,
      tests: [
        {
          args: [
            [5, 3, 12, 9, 6, 7, 1, 14],
            [
              [1, 4],
              [0, 7],
              [2, 3],
            ],
          ],
          expected: [0, 13, 5],
        },
      ],
    },
    {
      language: "javascript",
      entry: "countZeroXor",
      code: `// Number of non-empty subarrays whose XOR is 0: pairs of equal prefix XORs.
function countZeroXor(a) {
  const seen = new Map([[0, 1]]);
  let x = 0, count = 0;
  for (const v of a) {
    x ^= v;
    count += seen.get(x) ?? 0;
    seen.set(x, (seen.get(x) ?? 0) + 1);
  }
  return count;
}
`,
      tests: [
        {
          args: [[7, 7, 9, 4, 9, 4]],
          expected: 3,
        },
        {
          args: [[1, 2, 4]],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: "prefix-xor",
  practice: [
    {
      id: "px-q",
      kind: "numeric",
      prompt: "X = [0, 6, 5, 1, 9]. What is the XOR of A[1..3]?",
      answer: 15,
      explanation: "X[4] ⊕ X[1] = 9 ⊕ 6 = 15.",
      hints: ["Use X[r + 1] ⊕ X[l]."],
      objective: "Query",
    },
    {
      id: "px-minmax",
      kind: "mcq",
      prompt: "Why does the prefix trick not work for range minimum?",
      options: [
        "min has no inverse operation",
        "min is not associative",
        "min is too slow",
        "It does work",
      ],
      answer: 0,
      explanation: "You cannot ‘remove’ the prefix's contribution from a minimum.",
      distractors: {
        "1": "min is associative; that is why sparse tables work.",
        "2": "Speed is not the issue.",
        "3": "It does not.",
      },
      hints: ["What does subtracting a prefix rely on?"],
      objective: "Limits",
    },
  ],
  exam: {
    definition:
      "A prefix XOR array stores X[i] = A[0] ⊕ … ⊕ A[i − 1] so that range XORs are X[r + 1] ⊕ X[l].",
    steps: ["Build X.", "Answer each query with one XOR."],
    timeComplexity: "$O(n + q)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The common prefix appears twice and cancels, since x ⊕ x = 0.",
    applications: ["Range XOR queries", "Counting subarrays with a given XOR"],
    limitations: ["Static arrays (a Fenwick tree handles updates)"],
    faq: [
      {
        q: "Does it need non-negative numbers?",
        a: "It works on any fixed-width bit patterns; the visualizer uses 0–255.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Query formula (1).",
          "Cancellation argument (2).",
          "An application (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Prefix-sum arrays, which prefix XOR generalises.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
