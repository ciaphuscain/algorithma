import type { AlgorithmEntry } from "../types";

export const strandSortEntry: AlgorithmEntry = {
  slug: "strand-sort",
  name: "Strand Sort",
  aliases: ["Strand sorting"],
  curriculum: [45],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "beginner",
  summary:
    "Repeatedly pull an increasing ‘strand’ out of the input — the first remaining value, then every later value at least as large as the strand's end — and merge it into the output. Nearly sorted input gives a few long strands and is fast; reversed input gives n strands and O(n²).",
  tags: ["sorting", "merge", "adaptive", "lists"],
  prerequisites: ["Merging sorted lists"],
  related: ["merge-sorted-lists", "natural-merge-sort", "patience-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Pull a thread through a tangle: start at the first item and gather every later item that keeps the thread increasing. That thread is sorted. Merge it into the result, and pull the next thread from what is left.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Strand = the first remaining value.",
          "Scan the remaining values; move each one that is ≥ the strand's last value onto the strand.",
          "Merge the strand into the output; repeat while input remains.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [3, 1, 5, 4, 2, 6, 9, 7, 8] gives three strands: 3, 5, 6, 9; then 1, 4, 7, 8; then 2. Three merges complete the sort. Sorted input is a single strand; reversed input of 8 values gives 8 strands of one value each.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "It suits linked lists, where removing an element from the middle is O(1).",
          "Stable if equal values are taken into the strand in order and merges prefer the existing output on ties — this version prefers the output.",
          "The number of strands is at least the length of a longest strictly decreasing subsequence.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** With s strands, there are s scans of the remaining input, O(sn), plus s merges into an output of growing size, O(sn): O(n) when the input is sorted (s = 1) and O(n²) when it is reversed (s = n). The tests check the output and that sorted input makes one strand.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Patience sorting deals values onto piles instead of pulling strands; both relate to monotone subsequences.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Strands",
      value: "Increasing subsequences pulled greedily",
    },
    {
      label: "Best case",
      value: "One strand (sorted input)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "strand_sort",
      code: `from heapq import merge

def strand_sort(a):
    rest, out = list(a), []
    while rest:
        strand, keep = [rest[0]], []
        for x in rest[1:]:
            (strand if x >= strand[-1] else keep).append(x)
        out = list(merge(out, strand))
        rest = keep
    return out
`,
      tests: [
        {
          args: [[3, 1, 5, 4, 2, 6, 9, 7, 8]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
      ],
    },
    {
      language: "javascript",
      entry: "strands",
      code: `// The strands pulled out, in order.
function strands(a) {
  let rest = [...a];
  const out = [];
  while (rest.length) {
    const s = [rest[0]], keep = [];
    for (const x of rest.slice(1)) (x >= s[s.length - 1] ? s : keep).push(x);
    out.push(s);
    rest = keep;
  }
  return out;
}
`,
      tests: [
        {
          args: [[3, 1, 5, 4, 2, 6, 9, 7, 8]],
          expected: [[3, 5, 6, 9], [1, 4, 7, 8], [2]],
        },
      ],
    },
  ],
  visualizer: "strand-sort",
  practice: [
    {
      id: "strand-first",
      kind: "mcq",
      prompt: "What is the first strand pulled from [4, 2, 6, 5, 8, 1]?",
      options: ["4, 6, 8", "4, 2, 1", "2, 5, 8", "4, 5, 8"],
      answer: 0,
      explanation: "Start with 4; take each later value ≥ the strand's end: 6, then 8.",
      distractors: {
        "1": "A strand increases.",
        "2": "It starts with the first remaining value, 4.",
        "3": "After 4 comes 6, which is taken before 5 is seen.",
      },
      hints: ["Scan left to right, keeping the strand increasing."],
      objective: "Strands",
    },
    {
      id: "strand-rev",
      kind: "numeric",
      prompt: "How many strands does reversed input of 12 distinct values produce?",
      answer: 12,
      explanation: "Each strand can take only one value.",
      hints: ["Can any later value join?"],
      objective: "Worst case",
    },
  ],
  exam: {
    definition:
      "Strand sort repeatedly extracts a greedy increasing subsequence from the input and merges it into the output.",
    steps: ["Pull a strand.", "Merge into output.", "Repeat."],
    timeComplexity: "O(n) best; O(n²) worst.",
    spaceComplexity: "$O(n)$.",
    correctness: "Each strand is sorted; merging sorted lists preserves sortedness.",
    applications: ["Linked lists with few disorder"],
    limitations: ["Quadratic in general"],
    faq: [
      {
        q: "Why is it fast on nearly sorted data?",
        a: "Most values join the first strand, so there are few strands and few merges.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Strand extraction (2).", "Merging (2).", "Cost (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "P. E. Black (ed.), “strand sort,” Dictionary of Algorithms and Data Structures, U.S. National Institute of Standards and Technology.",
      supports: "Definition of strand sort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
