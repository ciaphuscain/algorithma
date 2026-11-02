import type { AlgorithmEntry } from "../types";

export const blockSortEntry: AlgorithmEntry = {
  slug: "block-sort",
  name: "Block Sort",
  aliases: ["Block merge sort", "In-place stable merge sort", "SymMerge sort"],
  curriculum: [43],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "advanced",
  summary:
    "Stable sorting in place by merging with block rotations instead of a buffer. This visualizer shows the rotation-based SymMerge (O(n log² n)); full block sorts such as WikiSort split runs into √n-sized blocks and use internal buffers to reach O(n log n) with O(1) extra memory.",
  tags: ["sorting", "merge sort", "in-place", "stable", "rotation"],
  prerequisites: ["Merge sort", "Binary search"],
  related: ["merge-sort", "bottom-up-merge-sort", "tim-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Merge sort is stable but needs an O(n) buffer; heapsort and quicksort are in place but unstable. Block sorts get both stability and O(1) memory. Their key move is the block rotation: swapping two adjacent blocks of different lengths in place, which can be done with three reversals. If the left block's upper half belongs after the right block's lower part, rotate them past each other and both sides become smaller merging problems.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Bottom-up: merge neighbouring sorted blocks of width 1, 2, 4, … in place.",
          "merge(lo, mid, hi): cut the longer block at its middle and binary-search the matching cut in the other (lower bound or upper bound, to keep equal keys in order).",
          "Rotate the two middle pieces past each other with three reversals.",
          "Recurse on the left pair and the right pair.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): two sorted blocks [2, 5, 7, 11, 13] and [1, 3, 6, 8, 12], merged without a buffer. The whole sort makes 5 rotations and 29 comparisons; no element is ever stored outside the array.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "A rotation by three reversals costs about one swap per element.",
          "Real block sorts (Kim and Kutzner's ratio-based merging, WikiSort, GrailSort) extract √n distinct values as an internal buffer and move whole blocks with it, which is what makes them O(n log n); that machinery is not shown here.",
          "The cut points use binary search with ≤ on one side and < on the other so that equal keys never cross — the sort is stable.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** SymMerge merges blocks of sizes m ≤ n with O(m log(n/m + 1)) comparisons — asymptotically optimal — and O((m + n) log m) element moves (Kim and Kutzner, 2004). With ⌈log₂ n⌉ merge levels, the sort is O(n log² n) in moves and uses O(log n) stack. The tests check the output on random arrays with duplicates.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Dudzinski and Dydek (1981) gave the recursive rotation-based merge.",
          "Huang and Langston (1988) showed practical O(n) in-place merging; Kim and Kutzner (2008) made it stable with ratio-based block merging.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log² n)",
      worst: "O(n log² n)",
    },
    space: "O(log n) stack",
    worstClass: "other",
    note: "For the rotation-based merge shown; full block sorts reach O(n log n).",
  },
  properties: [
    {
      label: "Stable",
      value: "Yes",
    },
    {
      label: "Buffer",
      value: "None",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "rotate",
      code: `def rotate(a, lo, mid, hi):
    """Swap blocks a[lo:mid] and a[mid:hi] in place with three reversals."""
    a[lo:mid] = a[lo:mid][::-1]
    a[mid:hi] = a[mid:hi][::-1]
    a[lo:hi] = a[lo:hi][::-1]
    return a
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, 6, 7], 0, 3, 7],
          expected: [4, 5, 6, 7, 1, 2, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "blockSort",
      code: `function blockSort(input) {
  const a = [...input];
  const rev = (lo, hi) => { for (hi--; lo < hi; lo++, hi--) [a[lo], a[hi]] = [a[hi], a[lo]]; };
  const rotate = (lo, mid, hi) => { rev(lo, mid); rev(mid, hi); rev(lo, hi); };
  const bound = (lo, hi, v, upper) => {
    while (lo < hi) { const m = (lo + hi) >> 1; if (upper ? a[m] <= v : a[m] < v) lo = m + 1; else hi = m; }
    return lo;
  };
  const merge = (lo, mid, hi) => {
    if (lo >= mid || mid >= hi) return;
    if (hi - lo === 2) { if (a[lo] > a[mid]) [a[lo], a[mid]] = [a[mid], a[lo]]; return; }
    let c1, c2;
    if (mid - lo >= hi - mid) { c1 = lo + ((mid - lo) >> 1); c2 = bound(mid, hi, a[c1], false); }
    else { c2 = mid + ((hi - mid) >> 1); c1 = bound(lo, mid, a[c2], true); }
    rotate(c1, mid, c2);
    const m2 = c1 + (c2 - mid);
    merge(lo, c1, m2);
    merge(m2, c2, hi);
  };
  for (let w = 1; w < a.length; w *= 2)
    for (let lo = 0; lo + w < a.length; lo += 2 * w) merge(lo, lo + w, Math.min(lo + 2 * w, a.length));
  return a;
}
`,
      tests: [
        {
          args: [[2, 5, 7, 11, 13, 1, 3, 6, 8, 12]],
          expected: [1, 2, 3, 5, 6, 7, 8, 11, 12, 13],
        },
        {
          args: [[3, 1, 3, 2]],
          expected: [1, 2, 3, 3],
        },
      ],
    },
  ],
  visualizer: "block-sort",
  practice: [
    {
      id: "block-rot",
      kind: "mcq",
      prompt: "How can two adjacent blocks of different lengths be swapped in place?",
      options: [
        "Reverse each block, then reverse the whole",
        "Swap them element by element",
        "Copy one into a buffer",
        "Sort them together",
      ],
      answer: 0,
      explanation: "Three reversals rotate the blocks: (AᴿBᴿ)ᴿ = BA.",
      distractors: {
        "1": "That only works for equal lengths.",
        "2": "That is not in place.",
        "3": "That changes their contents' order.",
      },
      hints: ["What does reversing twice do?"],
      objective: "Rotation",
    },
    {
      id: "block-why",
      kind: "mcq",
      prompt: "What do block sorts achieve that merge sort and heapsort do not, together?",
      options: [
        "Stability with O(1) extra memory",
        "O(n) time",
        "Fewer comparisons than n log n",
        "Parallelism",
      ],
      answer: 0,
      explanation: "Merge sort is stable but needs a buffer; heapsort is in place but unstable.",
      distractors: {
        "1": "Comparison sorts need Ω(n log n).",
        "2": "They cannot beat the lower bound.",
        "3": "That is not their aim.",
      },
      hints: ["Compare the trade-offs of merge sort and heapsort."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Block sort is a stable in-place merge sort that merges by block rotations (and, in full versions, an internal buffer of √n distinct values).",
    steps: [
      "Merge widths 1, 2, 4, … in place.",
      "Find cuts by binary search.",
      "Rotate and recurse.",
    ],
    timeComplexity: "O(n log² n) for rotation-based merging; O(n log n) for full block sorts.",
    spaceComplexity: "O(1) data; O(log n) stack here.",
    correctness:
      "After rotating, everything left of the new middle is ≤ everything right of it, preserving the order of equals.",
    applications: ["Stable sorting with tight memory"],
    limitations: ["Complex", "Slower than buffered merge sort"],
    faq: [
      {
        q: "Is this WikiSort?",
        a: "No. WikiSort and GrailSort add √n-sized blocks and an internal buffer; this lesson shows their core primitive, rotation-based merging.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Goal: stable and in place (2).",
          "Rotation by reversals (2).",
          "SymMerge (4).",
          "Complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "P.-S. Kim, A. Kutzner, “Stable minimum storage merging by symmetric comparisons,” Proceedings of ESA 2004, LNCS 3221.",
      supports: "SymMerge and its comparison and move bounds.",
    },
    {
      citation:
        "P.-S. Kim, A. Kutzner, “Ratio based stable in-place merging,” Proceedings of TAMC 2008, LNCS 4978.",
      supports: "Linear-time stable in-place block merging.",
    },
    {
      citation:
        "K. Dudzinski, A. Dydek, “On a stable minimum storage merging algorithm,” Information Processing Letters, 12(1), 1981.",
      supports: "Recursive rotation-based merging.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
