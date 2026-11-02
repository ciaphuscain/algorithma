import type { AlgorithmEntry } from "../types";

export const bitonicSortEntry: AlgorithmEntry = {
  slug: "bitonic-sort",
  name: "Bitonic Sort",
  aliases: ["Bitonic Sort"],
  curriculum: [459],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "A parallel comparison-based sorting algorithm that builds a bitonic sequence and then sorts it using a network of comparators. Well-suited for GPU and hardware implementations.",
  tags: ["sorting", "parallel", "sorting network", "bitonic merge"],
  prerequisites: ["Merge Sort"],
  related: [],
  problem: {
    input: "Input for Bitonic Sort.",
    output: "Output of Bitonic Sort.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A bitonic sequence first increases then decreases (or can be circularly shifted to have that property). Bitonic sort works in two phases: first build a bitonic sequence from the input, then merge it into sorted order.",
      },
      {
        kind: "p",
        text: "The beauty is that each compare-and-swap is independent of others at the same stage, making the algorithm naturally parallel. On a GPU, all comparisons at one stage run simultaneously.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Divide the array into pairs and sort each pair to form 2-element bitonic sequences.",
          "Merge adjacent bitonic sequences into larger ones: one ascending, the next descending.",
          "Repeat, doubling the size each time until the entire array is one sorted sequence.",
        ],
      },
      {
        kind: "p",
        text: "The compare-and-swap network is determined entirely by the array size and is data-independent, which is why it maps well to hardware.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation uses three nested loops: the outer loop doubles the block size k, the middle loop halves the comparison distance j, and the inner loop performs XOR-based index pairing for comparisons. The direction alternates based on the bit (i & k).",
      },
      {
        kind: "callout",
        tone: "note",
        text: "The input size must be a power of 2. For other sizes, pad with infinity values.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The network has O(log^2 n) stages, each with n/2 comparisons, giving O(n log^2 n) total comparisons. On n processors the parallel time is O(log^2 n). The 0-1 principle guarantees that if the network sorts all 0-1 sequences, it sorts all sequences.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Bitonic sort is widely used in GPU computing (CUDA) because its data-independent comparison pattern maps perfectly to SIMD execution. Batcher's odd-even mergesort is a related network sort.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log^2 n)",
      average: "O(n log^2 n)",
      worst: "O(n log^2 n)",
    },
    space: "O(n log^2 n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Category",
      value: "Parallel Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bitonic_sort",
      code: `def bitonic_sort(arr):
    """Sort array using bitonic sort. Array length must be a power of 2."""
    a = list(arr)
    n = len(a)
    k = 2
    while k <= n:
        j = k // 2
        while j > 0:
            for i in range(n):
                l = i ^ j
                if l > i:
                    if (i & k) == 0:
                        if a[i] > a[l]:
                            a[i], a[l] = a[l], a[i]
                    else:
                        if a[i] < a[l]:
                            a[i], a[l] = a[l], a[i]
            j //= 2
        k *= 2
    return a
`,
      tests: [
        {
          args: [[3, 1, 4, 2]],
          expected: [1, 2, 3, 4],
        },
        {
          args: [[8, 6, 7, 5, 3, 1, 4, 2]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          args: [[1, 2, 3, 4]],
          expected: [1, 2, 3, 4],
        },
      ],
    },
    {
      language: "javascript",
      entry: "bitonicSort",
      code: `function bitonicSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let k = 2; k <= n; k *= 2) {
    for (let j = k >> 1; j > 0; j >>= 1) {
      for (let i = 0; i < n; i++) {
        const l = i ^ j;
        if (l > i) {
          if ((i & k) === 0 ? a[i] > a[l] : a[i] < a[l]) {
            [a[i], a[l]] = [a[l], a[i]];
          }
        }
      }
    }
  }
  return a;
}`,
      tests: [
        {
          args: [[3, 1, 4, 2]],
          expected: [1, 2, 3, 4],
        },
        {
          args: [[8, 6, 7, 5, 3, 1, 4, 2]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bit-q1",
      kind: "mcq",
      prompt: "What is the parallel time complexity of bitonic sort on n processors?",
      options: ["O(log^2 n)", "O(n log n)", "O(n)", "O(log n)"],
      answer: 0,
      explanation: "With n processors, each of the O(log^2 n) stages takes O(1) parallel time.",
      hints: ["Each stage can be done in parallel"],
      objective: "Understand parallel complexity",
    },
  ],
  exam: {
    definition: "Define Bitonic Sort and explain its purpose.",
    steps: ["Describe the main steps of Bitonic Sort."],
    timeComplexity: "Analyze the time complexity of Bitonic Sort.",
    spaceComplexity: "Analyze the space complexity of Bitonic Sort.",
    correctness: "How does Bitonic Sort guarantee correctness?",
    applications: ["List two applications of Bitonic Sort."],
    limitations: ["What are the limitations of Bitonic Sort?"],
    faq: [
      {
        q: "Why is Bitonic Sort preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Bitonic Sort works by applying its core strategy to efficiently solve the target",
        ],
      },
    ],
  },
  references: [
    {
      citation: "Batcher, Sorting Networks and their Applications, 1968",
      supports: "Original bitonic sorting network",
    },
    {
      citation: "Cormen et al., Introduction to Algorithms, Ch. 27",
      supports: "Sorting networks",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
