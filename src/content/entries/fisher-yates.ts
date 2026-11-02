import type { AlgorithmEntry } from "../types";

export const fisherYatesEntry: AlgorithmEntry = {
  slug: "fisher-yates",
  name: "Fisher-Yates Shuffle",
  aliases: ["Fisher–Yates shuffle", "Knuth shuffle", "Durstenfeld shuffle", "Random permutation"],
  curriculum: [59],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "beginner",
  summary:
    "Shuffle an array uniformly at random in place: for i from n − 1 down to 1, swap A[i] with a uniformly random A[j], 0 ≤ j ≤ i. Each of the n! orders is equally likely — unlike the tempting ‘swap with any position’ version, which is biased.",
  tags: ["randomized", "shuffle", "permutation", "in-place", "uniform"],
  prerequisites: ["Arrays"],
  related: ["reservoir-sampling", "bogo-sort", "quickselect"],
  problem: {
    input: "An array of n values and a source of random numbers (here a seed).",
    output: "A uniformly random permutation of the array.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Draw cards from a hat one at a time and lay them in a row: the first card drawn is equally likely to be any card, the second equally likely to be any remaining card, and so on. Fisher–Yates does exactly this in place: the last position gets a random card from the whole array, the one before it a random card from what is left, and so on.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For i = n − 1 down to 1: pick j uniformly from 0..i.",
          "Swap A[i] and A[j]. A[i] is now final; the prefix A[0..i − 1] holds the cards still ‘in the hat’.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [1, 2, 3, 4, 5, 6] with seed 7 becomes [5, 2, 3, 4, 6, 1]. Three of the five draws pick j = i, which leaves that card where it is — a perfectly valid outcome.",
      },
      {
        kind: "table",
        head: ["Version", "Draw for position i", "Outcomes", "Uniform?"],
        rows: [
          ["Fisher–Yates", "j in 0..i", "n! (each order once)", "Yes"],
          ["Naive", "j in 0..n − 1", "nⁿ", "No: nⁿ is not divisible by n! for n ≥ 3"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The visualizer draws its random numbers from a seeded generator (mulberry32), so a run can be replayed exactly; change the seed for different draws. It is not a cryptographic generator.",
          "Off-by-one errors are the classic bug: drawing j from 0..i − 1 gives Sattolo's algorithm, which produces only the (n − 1)! orders that form a single cycle.",
          "A uniform integer in 0..i needs care: taking a random 32-bit number modulo i + 1 is slightly biased; rejection sampling removes the bias.",
          "Shuffling a deck of 52 cards needs log₂ 52! ≈ 226 bits of randomness, more than the state of many small generators.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Uniformity.** The draws (j_{n−1}, …, j_1) range over n · (n − 1) ⋯ 2 = n! equally likely sequences, and different sequences give different orders (A[n − 1] is determined by j_{n−1}, and so on inward), so each of the n! orders has probability exactly 1/n!. The naive version has nⁿ equally likely sequences; since n! does not divide nⁿ for n ≥ 3, some orders must be more likely than others. **Cost:** n − 1 draws and at most n − 1 swaps. The JavaScript sample below enumerates every draw sequence for small n and confirms both facts; the tests also replay the seeded draws independently and measure the frequencies of all 6 orders of 3 values over 6,000 seeds.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Fisher and Yates (1938) described the pencil-and-paper method; Durstenfeld (1964) gave the in-place O(n) computer version, popularised by Knuth as Algorithm P.",
          "The ‘inside-out’ variant builds a shuffled copy while reading the input once, so it also works when n is unknown in advance.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
    note: "Assuming O(1) per random draw.",
  },
  properties: [
    {
      label: "Outcome",
      value: "Each of n! orders with probability 1/n!",
    },
    {
      label: "Random draws",
      value: "n − 1",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "fisher_yates",
      code: `import random

def fisher_yates(a, seed):
    rng = random.Random(seed)
    a = list(a)
    for i in range(len(a) - 1, 0, -1):
        j = rng.randint(0, i)          # inclusive of i
        a[i], a[j] = a[j], a[i]
    return a
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, 6], 7],
          expected: [5, 1, 6, 4, 2, 3],
        },
        {
          args: [[9], 1],
          expected: [9],
        },
      ],
    },
    {
      language: "javascript",
      entry: "shuffleOutcomes",
      code: `// Run the shuffle on every possible sequence of draws and count each resulting order.
// Returns [number of distinct orders, fewest times one occurs, most times one occurs].
function shuffleOutcomes(n, naive) {
  const counts = new Map();
  const go = (a, i) => {
    if (i < (naive ? 0 : 1)) {
      const key = a.join(",");
      counts.set(key, (counts.get(key) ?? 0) + 1);
      return;
    }
    for (let j = 0; j <= (naive ? n - 1 : i); j++) {
      const b = [...a];
      [b[i], b[j]] = [b[j], b[i]];
      go(b, i - 1);
    }
  };
  go(Array.from({ length: n }, (_, k) => k), n - 1);
  const c = [...counts.values()];
  return [counts.size, Math.min(...c), Math.max(...c)];
}
`,
      tests: [
        {
          args: [3, false],
          expected: [6, 1, 1],
        },
        {
          args: [4, false],
          expected: [24, 1, 1],
        },
        {
          args: [3, true],
          expected: [6, 4, 5],
        },
      ],
    },
  ],
  visualizer: "fisher-yates",
  practice: [
    {
      id: "fy-naive",
      kind: "mcq",
      prompt: "Swapping each A[i] with a random A[j] for j anywhere in 0..n − 1 gives …",
      options: ["A biased shuffle", "A uniform shuffle", "Always the identity", "A sorted array"],
      answer: 0,
      explanation:
        "There are nⁿ equally likely draw sequences, which cannot split evenly over n! orders for n ≥ 3.",
      distractors: {
        "1": "That needs j drawn from 0..i.",
        "2": "It does move elements.",
        "3": "Nothing sorts it.",
      },
      hints: ["Count the possible draw sequences for n = 3."],
      objective: "Bias",
    },
    {
      id: "fy-orders",
      kind: "numeric",
      prompt: "How many draw sequences does Fisher–Yates have for n = 5?",
      answer: 120,
      explanation: "5 · 4 · 3 · 2 = 120 = 5!, one per order.",
      hints: ["How many choices are there for each i?"],
      objective: "Uniformity",
    },
  ],
  exam: {
    definition:
      "The Fisher–Yates shuffle produces a uniformly random permutation by repeatedly swapping the last unfixed element with a uniformly random unfixed one.",
    steps: ["For i from n − 1 down to 1.", "Pick j in 0..i.", "Swap A[i], A[j]."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "The n! draw sequences map one-to-one onto the n! orders.",
    applications: [
      "Card games",
      "Random sampling",
      "Randomised algorithms (e.g. shuffling before quicksort)",
    ],
    limitations: ["Only as good as the random source"],
    faq: [
      {
        q: "Is sorting by random keys equivalent?",
        a: "With distinct random keys, yes, but it costs O(n log n) and ties break the uniformity.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm (2).", "Uniformity argument (2).", "Naive version's bias (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "R. A. Fisher, F. Yates, Statistical Tables for Biological, Agricultural and Medical Research, Oliver & Boyd, 1938.",
      supports: "The original pencil-and-paper method.",
    },
    {
      citation:
        "R. Durstenfeld, “Algorithm 235: Random permutation,” Communications of the ACM, 7(7), 1964, p. 420.",
      supports: "The in-place computer version.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 2: Seminumerical Algorithms, 3rd ed., Addison-Wesley, 1997, Section 3.4.2.",
      supports: "Algorithm P and its analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
