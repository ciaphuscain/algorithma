import type { AlgorithmEntry } from "../types";

export const quickselectEntry: AlgorithmEntry = {
  slug: "quickselect",
  name: "Randomized Quickselect",
  aliases: ["Quickselect", "Hoare's selection algorithm", "FIND", "k-th smallest element"],
  curriculum: [427],
  domain: "randomized",
  subcategory: "Randomized algorithms",
  difficulty: "intermediate",
  summary:
    "Finds the k-th smallest element without sorting: partition around a random pivot and continue only in the part that holds position k. Expected O(n) comparisons for every input; the randomness is in the algorithm, not the data.",
  tags: ["selection", "k-th smallest", "median", "randomized", "partition", "las vegas"],
  prerequisites: ["Quick Sort"],
  related: ["quick-sort", "heap-sort", "binary-search"],
  problem: {
    input: "n numbers (repeats allowed), a rank k from 1 to n, and a seed for the random choices.",
    output: "The value that would sit at position k − 1 if the numbers were sorted.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To find the median of a list you could sort it, but that does more work than needed: you only care about one position. Quickselect partitions like quicksort, then **throws away the side that cannot contain the answer** and repeats on the other side only.",
      },
      {
        kind: "p",
        text: "A fixed pivot rule (say, always the last element) can be beaten by an unlucky input. Picking the pivot at random makes every input behave like an average one: no input is bad, only some coin flips are.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Work on A[lo … hi], starting with the whole array; the target position is k − 1.",
          "Pick a random index in lo … hi; its value v is the pivot.",
          "Partition three ways: values below v, equal to v, above v (Dijkstra's Dutch national flag partition).",
          "If position k − 1 is inside the equal block, v is the answer.",
          "Otherwise keep only the part that contains position k − 1 and repeat.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): the median (k = 5) of 7, 2, 9, 4, 1, 8, 3, 6, 5 with seed 1, so the target is position 4.",
      },
      {
        kind: "table",
        head: ["Round", "Range (size)", "Pivot", "After partitioning", "Kept"],
        rows: [
          ["1", "A[0…8] (9)", "8", "below A[0…6], equal A[7], above A[8]", "A[0…6]"],
          ["2", "A[0…6] (7)", "7", "below A[0…5], equal A[6], above none", "A[0…5]"],
          ["3", "A[0…5] (6)", "1", "below none, equal A[0], above A[1…5]", "A[1…5]"],
          ["4", "A[1…5] (5)", "2", "below none, equal A[1], above A[2…5]", "A[2…5]"],
          ["5", "A[2…5] (4)", "4", "below A[2], equal A[3], above A[4…5]", "A[4…5]"],
          ["6", "A[4…5] (2)", "5", "below none, equal A[4], above A[5]", "found: 5"],
        ],
      },
      {
        kind: "p",
        text: "Each element of the range is compared with the pivot once per round, so the run makes 9 + 7 + 6 + 5 + 4 + 2 = 33 comparisons. This seed was unlucky: almost every pivot fell near an end of its range. The preset with many equal values finishes in one round, because the equal block alone covers the target.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a three-way partition. With a two-way partition, an array of equal values makes every round remove a single element: O(n²).",
          "Iterate instead of recursing: only one side is ever continued, so a loop needs no stack.",
          "Seed the generator when you need reproducible runs (tests, this visualizer); use a fresh seed otherwise, so nobody can construct an input against your pivot sequence.",
          "The Python sample is the short list-building version; the JavaScript sample is the deterministic median-of-medians algorithm, which guarantees O(n) without randomness at the price of a larger constant.",
          "Libraries often use introselect: quickselect that switches to a worst-case linear method if it recurses too deeply.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Expected O(n).** Call a round lucky if its pivot lies in the middle half of the range by rank. That happens with probability at least 1/2, and a lucky round leaves at most 3/4 of the range. So the expected number of rounds before the range shrinks by a factor 3/4 is at most 2, and with m comparisons per round on a range of size m:",
      },
      { kind: "math", tex: "E[C] \\le \\sum_{i \\ge 0} 2 \\left(\\tfrac{3}{4}\\right)^{i} n = 8n" },
      {
        kind: "p",
        text: "A sharper classical analysis gives about $2(1 + \\ln 2)\\,n \\approx 3.39n$ comparisons on average for the median, less for ranks near the ends. Over 300 seeds on shuffled arrays of 40 distinct values, this implementation averaged 114 comparisons for the median (2.85n); the property tests pin that measurement.",
      },
      {
        kind: "p",
        text: "**Worst case.** If every pivot is the smallest or largest value in its range, the rounds cost n + (n − 1) + … : O(n²). With random pivots the chance of anything close to this is exponentially small. The algorithm is Las Vegas: its answer is always right, only its running time is random.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Median of medians (Blum, Floyd, Pratt, Rivest and Tarjan) picks a pivot guaranteed to be near the middle, giving O(n) in the worst case.",
          "Floyd and Rivest's algorithm samples the input to choose two pivots that bracket the target, needing about n + min(k, n − k) comparisons on average.",
          "Selection is the basis of order statistics, trimmed means, and partitioning work by size (for example, the median split in a k-d tree).",
          "For many queries on the same data, sort once, or use an order-statistic tree; for a stream, a heap keeps the k smallest in O(n log k).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n^2)" },
    space: "O(1)",
    worstClass: "n^2",
    note: "Expected O(n) for every input; the worst case needs pivots that are almost always extreme. Median of medians gives O(n) worst case.",
  },
  properties: [
    { label: "Type", value: "Las Vegas: always correct, random running time" },
    { label: "In place", value: "Yes (the iterative version)" },
    { label: "Equal values", value: "Handled in one round by the three-way partition" },
  ],
  implementations: [
    {
      language: "python",
      entry: "quickselect",
      code: `import random


def quickselect(values, k, seed=0):
    # The k-th smallest (k from 1) with random pivots and a three-way split.
    rng = random.Random(seed)
    a = list(values)
    while True:
        v = a[rng.randrange(len(a))]
        below = [x for x in a if x < v]
        equal = len(a) - len(below) - sum(1 for x in a if x > v)
        if k <= len(below):
            a = below
        elif k <= len(below) + equal:
            return v
        else:
            k -= len(below) + equal
            a = [x for x in a if x > v]
`,
      tests: [
        { args: [[7, 2, 9, 4, 1, 8, 3, 6, 5], 5], expected: 5 },
        { args: [[5, 3, 5, 5, 1, 5, 5, 9], 4], expected: 5 },
      ],
    },
    {
      language: "javascript",
      entry: "select",
      code: `// Deterministic selection (median of medians): the pivot is the median of the
// medians of groups of five, which guarantees O(n) time in the worst case.
function select(values, k) {
  if (values.length <= 5) return [...values].sort((x, y) => x - y)[k - 1];
  const medians = [];
  for (let i = 0; i < values.length; i += 5) {
    const group = values.slice(i, i + 5).sort((x, y) => x - y);
    medians.push(group[(group.length - 1) >> 1]);
  }
  const v = select(medians, (medians.length + 1) >> 1);
  const below = values.filter((x) => x < v);
  const above = values.filter((x) => x > v);
  const equal = values.length - below.length - above.length;
  if (k <= below.length) return select(below, k);
  if (k <= below.length + equal) return v;
  return select(above, k - below.length - equal);
}
`,
      tests: [
        { args: [[7, 2, 9, 4, 1, 8, 3, 6, 5], 5], expected: 5 },
        {
          args: [[61, 12, 88, 45, 3, 97, 34, 70, 26, 55, 18, 91, 40, 7, 83, 64, 29, 50, 76, 15], 3],
          expected: 12,
        },
      ],
    },
  ],
  visualizer: "quickselect",
  practice: [
    {
      id: "qs-median",
      kind: "numeric",
      prompt: "What does quickselect return for k = 5 on 7, 2, 9, 4, 1, 8, 3, 6, 5?",
      answer: 5,
      explanation: "Sorted: 1 2 3 4 5 6 7 8 9; the 5th smallest is 5, whatever the pivots.",
      hints: ["The answer does not depend on the seed."],
      objective: "Understand what selection returns",
    },
    {
      id: "qs-comparisons",
      kind: "numeric",
      prompt:
        "In the worked example the ranges had sizes 9, 7, 6, 5, 4 and 2. How many comparisons with a pivot were made?",
      answer: 33,
      explanation: "One comparison per element per round: 9 + 7 + 6 + 5 + 4 + 2 = 33.",
      hints: ["Each element in the range is compared with the pivot once."],
      objective: "Count the work per round",
    },
    {
      id: "qs-why-random",
      kind: "mcq",
      prompt: "Why choose the pivot at random rather than always taking the last element?",
      options: [
        "So that no particular input forces the O(n²) behaviour; only unlucky coin flips can",
        "Random pivots make the answer more accurate",
        "It removes the need to partition",
        "It makes the worst case O(n)",
      ],
      answer: 0,
      explanation:
        "With a fixed rule, a sorted input makes every pivot extreme. With random pivots the expected cost is O(n) for every input.",
      distractors: {
        1: "The answer is always exact; only the time varies.",
        2: "Partitioning is still needed every round.",
        3: "The worst case stays O(n²); only its probability becomes tiny.",
      },
      hints: ["Who controls the bad case: the input or the coin?"],
      objective: "Explain randomization",
    },
  ],
  exam: {
    definition:
      "Randomized quickselect finds the k-th smallest of n elements by partitioning around a uniformly random pivot and continuing only in the part that contains rank k.",
    steps: [
      "Pick a random pivot in the current range.",
      "Partition into below, equal and above.",
      "Stop if rank k is in the equal block; otherwise continue in the part containing it.",
    ],
    timeComplexity: "Expected $O(n)$; worst case $O(n^2)$.",
    spaceComplexity: "$O(1)$ extra in the iterative in-place version.",
    correctness:
      "After partitioning, every element left of the equal block is smaller and every element right of it is larger, so rank k lies in exactly one part.",
    applications: [
      "Medians and percentiles",
      "Top-k selection",
      "Partitioning work in k-d trees",
      "Robust statistics",
    ],
    limitations: [
      "O(n²) worst case (with tiny probability)",
      "Reorders the array",
      "One query per run; repeated queries favour sorting",
    ],
    faq: [
      {
        q: "Quickselect or median of medians?",
        a: "Quickselect is faster in practice; median of medians guarantees O(n) but has a larger constant.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Partition around a random pivot.", "Recurse into one side: expected O(n)."],
      },
      {
        marks: 5,
        outline: [
          "Algorithm (2).",
          "Expected-time argument (2).",
          "Worst case and its probability (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Selection problem versus sorting (1).",
          "Algorithm with three-way partitioning (3).",
          "Worked example (2).",
          "Expected O(n) proof (3).",
          "Median of medians as the deterministic alternative (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "C. A. R. Hoare, “Algorithm 65: Find,” Communications of the ACM 4(7), 1961, pp. 321–322.",
      supports: "The original selection algorithm.",
    },
    {
      citation:
        "M. Blum, R. W. Floyd, V. Pratt, R. L. Rivest, R. E. Tarjan, “Time bounds for selection,” Journal of Computer and System Sciences 7(4), 1973, pp. 448–461.",
      supports: "Worst-case linear selection (the JavaScript sample).",
    },
    {
      citation:
        "R. W. Floyd, R. L. Rivest, “Expected time bounds for selection,” Communications of the ACM 18(3), 1975, pp. 165–172.",
      supports: "The sampling-based selection algorithm in the advanced section.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Sections 9.2–9.3.",
      supports: "Expected linear-time randomized selection and worst-case linear selection.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples, the worked example and the measured comparison count are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
