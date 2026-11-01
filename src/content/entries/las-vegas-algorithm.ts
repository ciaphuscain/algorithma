import type { AlgorithmEntry } from "../types";

export const lasVegasAlgorithmEntry: AlgorithmEntry = {
  slug: "las-vegas-algorithm",
  name: "Las Vegas Algorithm",
  aliases: [
    "Las Vegas randomized algorithm",
  ],
  curriculum: [
    431,
  ],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary: "A class of randomized algorithms that always produce correct results but whose running time varies randomly, with expected polynomial time — in contrast to Monte Carlo algorithms which may give wrong answers.",
  tags: [
    "randomized",
    "Las Vegas",
    "always correct",
    "expected time",
  ],
  prerequisites: [
    "Randomized Algorithms",
  ],
  related: [
    "monte-carlo-algorithm",
    "karger-s-minimum-cut-algorithm",
  ],
  problem: {
    input: "A problem instance and a source of random bits.",
    output: "A guaranteed correct solution (with random running time).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Las Vegas algorithms always give the right answer — the randomness only affects how long they take. Contrast with Monte Carlo algorithms, which always run in bounded time but may give wrong answers.",
      },
      {
        kind: "p",
        text: "Example: randomized quicksort always sorts correctly, but the number of comparisons depends on the random pivot choices. Expected time is O(n log n), worst case O(n²), but the worst case is astronomically unlikely.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Use randomness to make decisions during the algorithm (e.g., choose a random pivot).",
          "The algorithm always verifies its output or is structured so correctness is guaranteed.",
          "If the random choices were unlucky, the algorithm may take longer but still produces the correct answer.",
          "Expected running time is typically polynomial.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Randomized quicksort on [3, 1, 4, 1, 5]: random pivot 4 → partitions into [3,1,1] and [5]. Recurse on each. Always produces [1,1,3,4,5]. Expected O(n log n) comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Randomized quicksort: always correct sort, expected O(n log n).",
          "Randomized selection (quickselect): always correct, expected O(n).",
          "Can convert Monte Carlo to Las Vegas by repeating and verifying (if verification is cheap).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "For a Las Vegas algorithm with expected time T(n): by Markov's inequality, Pr[time > k·T(n)] ≤ 1/k. Running it for 2T(n) and restarting gives exponentially decreasing failure probability.",
      },
      {
        kind: "p",
        text: "Any Las Vegas algorithm can be converted to Monte Carlo by imposing a time limit and outputting 'don't know' if it exceeds it. The converse requires a way to verify answers.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "ZPP (Zero-error Probabilistic Polynomial time) is the complexity class of problems solvable by Las Vegas algorithms in expected polynomial time.",
          "ZPP = RP ∩ co-RP.",
          "Derandomization: can Las Vegas algorithms be made deterministic? Open problem in complexity theory.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "expected polynomial",
      worst: "unbounded (but unlikely)",
    },
    space: "O(n)",
    worstClass: "other",
    note: "Expected time is polynomial; worst case may be worse but with exponentially small probability.",
  },
  properties: [
    {
      label: "Correctness",
      value: "Always correct",
    },
    {
      label: "Time",
      value: "Random, expected polynomial",
    },
    {
      label: "Complexity class",
      value: "ZPP",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "las_vegas_search",
      code: `import random

def las_vegas_search(arr, target, seed=42):
    """Las Vegas search: randomly probe array positions to find target.
    Always correct (returns index or -1). Expected O(n) for uniformly random arrays."""
    random.seed(seed)
    n = len(arr)
    visited = set()
    while len(visited) < n:
        i = random.randint(0, n - 1)
        if arr[i] == target:
            return i
        visited.add(i)
    return -1
`,
      tests: [
        {
          args: [
            [
              3,
              1,
              4,
              1,
              5,
              9,
            ],
            5,
            42,
          ],
          expected: 4,
        },
        {
          args: [
            [
              1,
              2,
              3,
            ],
            7,
            42,
          ],
          expected: -1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lv-vs-mc",
      kind: "mcq",
      prompt: "How do Las Vegas algorithms differ from Monte Carlo algorithms?",
      options: [
        "Las Vegas always gives correct results; Monte Carlo may err",
        "Las Vegas is faster",
        "Monte Carlo always gives correct results",
        "They are the same",
      ],
      answer: 0,
      explanation: "Las Vegas = always correct, random time. Monte Carlo = bounded time, possibly wrong.",
      hints: [
        "Which one sacrifices correctness vs running time?",
      ],
      objective: "Distinguish Las Vegas and Monte Carlo",
    },
  ],
  exam: {
    definition: "Las Vegas algorithms always produce correct results with randomized running time (expected polynomial), unlike Monte Carlo which may err.",
    steps: [
      "Use randomness for decisions.",
      "Guarantee correctness regardless of random choices.",
      "Expected running time is polynomial.",
    ],
    timeComplexity: "Expected polynomial",
    spaceComplexity: "Varies",
    correctness: "Correctness is structural (verified or guaranteed by construction); only running time is random.",
    applications: [
      "Randomized quicksort",
      "Randomized selection",
      "Random sampling algorithms",
    ],
    limitations: [
      "Worst case may be slow (though exponentially unlikely)",
      "Cannot guarantee a time bound",
    ],
    faq: [
      {
        q: "Can a Monte Carlo algorithm be converted to Las Vegas?",
        a: "Yes, if the answer can be efficiently verified: repeat until verification passes.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Define Las Vegas vs Monte Carlo (1). Example algorithm (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "L. Babai, 'Monte-Carlo algorithms in graph isomorphism testing,' Université de Montréal Technical Report, 1979.",
      supports: "Formalized the Monte Carlo / Las Vegas distinction.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
