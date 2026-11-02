import type { AlgorithmEntry } from "../types";

export const reservoirSamplingEntry: AlgorithmEntry = {
  slug: "reservoir-sampling",
  name: "Reservoir Sampling",
  aliases: ["Algorithm R", "Random sampling from a stream", "Vitter's reservoir"],
  curriculum: [58],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "intermediate",
  summary:
    "Choose k items uniformly at random from a stream whose length is not known in advance, in one pass with O(k) memory: keep the first k, then let item i replace a random reservoir slot with probability k/(i + 1).",
  tags: ["randomized", "sampling", "streaming", "one pass", "uniform"],
  prerequisites: ["Fisher-Yates Shuffle"],
  related: ["fisher-yates", "boyer-moore-majority"],
  problem: {
    input: "A stream of items (here an array read once), a sample size k and a seed.",
    output: "k items, every k-subset being equally likely.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "You are handed raffle tickets one at a time and do not know how many will come; you may hold only k. Hold the first k. When the i-th ticket (counting from 1) arrives, keep it with probability k/i, dropping a random held ticket to make room. Late tickets get small chances, but early tickets face more chances of being dropped, and the two effects balance exactly.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Copy the first k items into the reservoir R.",
          "For item i = k, k + 1, … (0-based): draw j uniformly from 0..i.",
          "If j < k, item i replaces R[j]; otherwise skip it.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): the stream 11, 22, …, 99, 9 with k = 3 and seed 7. Two later items get in: 44 replaces 11, and then 55 replaces 44. The final sample is [55, 22, 33], from stream positions 4, 1 and 2.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The visualizer draws its random numbers from a seeded generator (mulberry32), so a run can be replayed exactly; change the seed for different draws. It is not a cryptographic generator.",
          "Algorithm R draws one random number per item. Vitter's Algorithm Z instead computes how many items to skip, which needs only O(k (1 + log(n/k))) random numbers on average.",
          "Weighted versions (Efraimidis and Spirakis) keep the k items with the largest u^(1/w) for random u.",
          "To sample k items when n is known, a partial Fisher–Yates shuffle of the first k positions also works.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Uniformity, by induction.** Claim: after processing items 0..i, each of them is in the reservoir with probability k/(i + 1). It holds for i = k − 1. Item i + 1 enters with probability k/(i + 2). An item already in the reservoir stays unless item i + 1 enters and picks its slot: probability 1 − (k/(i + 2)) · (1/k) = (i + 1)/(i + 2). So it remains with probability k/(i + 1) · (i + 1)/(i + 2) = k/(i + 2). (The stronger statement, that every k-subset is equally likely, follows by the same induction.) The JavaScript sample enumerates every draw sequence for small cases and counts how often each item ends in the sample: equally often. The tests replay the seeded draws independently and check that, over 4,000 seeds, each of 6 items is kept close to k/n of the time.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Vitter (1985) analysed Algorithm R, credits it to Alan Waterman, and introduced faster skip-based variants.",
          "Reservoir sampling is used in databases (sampling query results), in network monitoring, and for mini-batches from data streams.",
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
    space: "O(k)",
    worstClass: "n",
    note: "One random draw per item after the first k.",
  },
  properties: [
    {
      label: "Passes",
      value: "One; n need not be known",
    },
    {
      label: "Memory",
      value: "k items",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "reservoir",
      code: `import random

def reservoir(stream, k, seed):
    rng = random.Random(seed)
    sample = []
    for i, x in enumerate(stream):
        if i < k:
            sample.append(x)
        else:
            j = rng.randint(0, i)
            if j < k:
                sample[j] = x
    return sample
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, 7],
          expected: [8, 9, 4],
        },
        {
          args: [[5, 8, 13], 3, 1],
          expected: [5, 8, 13],
        },
      ],
    },
    {
      language: "javascript",
      entry: "inclusionCounts",
      code: `// Over every possible sequence of draws, how often does each item end up in the sample?
function inclusionCounts(n, k) {
  const counts = new Array(n).fill(0);
  const go = (r, i) => {
    if (i === n) { for (const x of r) counts[x]++; return; }
    for (let j = 0; j <= i; j++) {
      const s = [...r];
      if (j < k) s[j] = i;
      go(s, i + 1);
    }
  };
  go(Array.from({ length: k }, (_, x) => x), k);
  return counts;
}
`,
      tests: [
        {
          args: [4, 2],
          expected: [6, 6, 6, 6],
        },
        {
          args: [5, 1],
          expected: [24, 24, 24, 24, 24],
        },
      ],
    },
  ],
  visualizer: "reservoir-sampling",
  practice: [
    {
      id: "rs-prob",
      kind: "mcq",
      prompt:
        "With k = 2, with what probability does the 10th item (i = 9, 0-based) enter the reservoir?",
      options: ["2/10", "1/10", "2/9", "1/2"],
      answer: 0,
      explanation: "It enters when j < k for j uniform in 0..9: probability k/(i + 1) = 2/10.",
      distractors: {
        "1": "That would be right for k = 1.",
        "2": "Off by one: j ranges over i + 1 values.",
        "3": "Late items must get smaller chances.",
      },
      hints: ["How many values can j take?"],
      objective: "Mechanics",
    },
    {
      id: "rs-final",
      kind: "mcq",
      prompt: "After the whole stream of n items, each item is in the sample with probability …",
      options: ["k/n", "1/n", "k/(i + 1) for item i", "1/k"],
      answer: 0,
      explanation: "By induction, every item ends with the same probability k/n.",
      distractors: {
        "1": "That is for k = 1.",
        "2": "That is its chance of entering, before later items can evict it.",
        "3": "That is not a probability over items.",
      },
      hints: ["Late items enter rarely; early ones are evicted more."],
      objective: "Uniformity",
    },
  ],
  exam: {
    definition:
      "Reservoir sampling selects k items uniformly at random from a stream of unknown length in one pass.",
    steps: [
      "Keep the first k.",
      "Item i replaces a random slot with probability k/(i + 1).",
      "Return the reservoir.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(k)$.",
    correctness:
      "By induction, after i + 1 items each has probability k/(i + 1) of being in the reservoir.",
    applications: ["Sampling logs and streams", "Database sampling", "Online machine learning"],
    limitations: ["One random draw per item (Algorithm R)"],
    faq: [
      {
        q: "Why not collect everything and shuffle?",
        a: "That needs memory for the whole stream; the reservoir needs only k items.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: ["Algorithm (3).", "Inductive proof (5).", "Complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. S. Vitter, “Random sampling with a reservoir,” ACM Transactions on Mathematical Software, 11(1), 1985, pp. 37–57.",
      supports: "Algorithm R, its analysis and faster variants.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 2: Seminumerical Algorithms, 3rd ed., Addison-Wesley, 1997, Section 3.4.2.",
      supports: "Reservoir sampling (Algorithm R).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
