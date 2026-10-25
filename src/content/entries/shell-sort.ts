import type { AlgorithmEntry } from "../types";

export const shellSortEntry: AlgorithmEntry = {
  slug: "shell-sort",
  name: "Shell Sort",
  aliases: ["Shellsort", "Diminishing increment sort"],
  curriculum: [23],
  domain: "searching-sorting",
  subcategory: "Insertion-based sorting",
  difficulty: "intermediate",
  summary:
    "Insertion sort on elements far apart first, then on closer ones, ending with gap 1: distant elements move in long jumps, so the final pass has little left to do.",
  tags: ["sorting", "comparison sort", "in-place", "unstable", "gap sequence"],
  prerequisites: ["Insertion Sort"],
  related: ["insertion-sort", "merge-sort", "quick-sort"],
  problem: {
    input: "An array $A$ of $n$ comparable elements.",
    output: "The same elements rearranged so that $A[0] \\le A[1] \\le \\dots \\le A[n-1]$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Insertion sort is slow on a shuffled array because an element can only move one place per step: a small value near the end has to walk past everything in front of it. Shell sort lets elements jump.",
      },
      {
        kind: "p",
        text: "Pick a gap $h$ and insertion-sort each chain of elements $h$ apart: $A[0], A[h], A[2h], \\dots$, then $A[1], A[h+1], \\dots$, and so on. A small value can now travel $h$ places per move. Repeat with smaller and smaller gaps. The last gap is 1, which is ordinary insertion sort, but by then the array is nearly sorted, and insertion sort is fast on nearly sorted input.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose gaps. This visualizer uses Knuth's sequence $1, 4, 13, 40, \\dots$ ($h \\leftarrow 3h+1$), starting from the largest gap below $\\lfloor n/3 \\rfloor$, or 1.",
          "For each gap $h$, largest first: for $i = h, \\dots, n-1$, hold $A[i]$ as the key and shift larger elements of its chain ($A[i-h], A[i-2h], \\dots$) up by $h$ until the key fits.",
          "After the pass, the array is $h$-sorted: every chain of elements $h$ apart is in order.",
          "The final pass, $h = 1$, leaves the array sorted.",
        ],
      },
      { kind: "heading", text: "Worked example: 14 elements" },
      {
        kind: "p",
        text: "For $[62, 83, 18, 53, 7, 17, 95, 86, 47, 69, 25, 28, 30, 4]$, $n = 14$ and $\\lfloor 14/3 \\rfloor = 4$, so the gaps are 4 and 1.",
      },
      {
        kind: "table",
        head: ["Pass", "Shifts", "Comparisons", "Array afterwards"],
        rows: [
          ["h = 4", "12", "18", "[7, 4, 18, 28, 30, 17, 25, 53, 47, 69, 95, 86, 62, 83]"],
          ["h = 1", "13", "25", "[4, 7, 17, 18, 25, 28, 30, 47, 53, 62, 69, 83, 86, 95]"],
        ],
      },
      {
        kind: "p",
        text: "After the gap-4 pass the array is far from sorted, but every element is close to its place: 4 moved from the last position to the second. In total Shell sort makes 25 shifts and 43 comparisons. Insertion sort on the same input makes 55 shifts, one per inversion. On the reversed array of 40 elements (gaps 13, 4, 1) Shell sort makes 132 shifts against insertion sort's 780.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**It is insertion sort with `1` replaced by `h`.** Keep the key aside and shift, exactly as in insertion sort; check `j >= h` before reading `A[j - h]`.",
          "**The gap sequence matters more than anything else.** Shell's original $n/2, n/4, \\dots, 1$ is quadratic in the worst case (when $n$ is a power of 2, odd and even positions are never compared until the last pass). Knuth's $3h+1$ and Ciura's empirically tuned $1, 4, 10, 23, 57, 132, 301, 701$ are common choices.",
          "**Not stable.** In `[2, 3, 2′, 3, 1, 4]` (gaps 4 and 1) the gap-4 pass exchanges the first 2 with the 1, jumping it over 2′, and the result is `[1, 2′, 2, 3, 3, 4]`. Use merge sort or insertion sort when the order of equal keys matters.",
          "**In place, no recursion:** $O(1)$ extra space and a short loop, which makes it attractive where memory and code size are tight.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "The last pass is insertion sort with gap 1, which sorts any array. Earlier passes only rearrange elements, so correctness needs nothing more. The earlier passes are there for speed.",
      },
      { kind: "heading", text: "Why earlier passes help" },
      {
        kind: "p",
        text: "Each shift moves a larger element up $h$ places past a smaller key. That removes the inversion between them, and for every element $v$ in between it removes either two inversions (if $v$ lies between the two values) or none: so each shift removes at least one inversion. Hence Shell sort never makes more shifts than insertion sort, which makes exactly $\\operatorname{inv}(A)$. A long jump can remove up to $2h - 1$ at once.",
      },
      {
        kind: "p",
        text: "A second fact keeps the work done: **an $h$-sorted array stays $h$-sorted after it is $k$-sorted** (Knuth, Theorem K in §5.2.1). So later passes never undo earlier ones, and when the gaps are 1, 4, 13, …, each pass starts from an array that is already sorted at several larger scales.",
      },
      { kind: "heading", text: "Running time" },
      {
        kind: "p",
        text: "The cost depends on the gap sequence, and for most sequences no exact average-case formula is known. Known worst cases include:",
      },
      {
        kind: "list",
        items: [
          "Shell's $n/2^k$: $\\Theta(n^2)$.",
          "Knuth's $3h+1$ (and Hibbard's $2^k - 1$): $O(n^{3/2})$.",
          "Pratt's $2^p 3^q$: $\\Theta(n \\log^2 n)$, at the price of many passes.",
        ],
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**No gap sequence reaches $O(n \\log n)$ in the worst case.** Plaxton, Poonen and Suel proved a lower bound of $\\Omega(n (\\log n / \\log \\log n)^2)$ for every sequence. Whether some sequence is $O(n \\log n)$ on average is open.",
          "**Comb sort** applies the same idea to bubble sort: compare elements a shrinking gap apart.",
          "**In practice** introsort, merge sort and Timsort are faster on large arrays; Shell sort's appeal is its short code and $O(1)$ space.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "\\Theta(n \\log n)",
      average: "\\text{depends on the gaps}",
      worst: "O(n^{3/2})",
    },
    space: "\\Theta(1)",
    worstClass: "other",
    note: "With Knuth's $3h+1$ gaps. Best case: sorted input still costs one comparison per element per pass, and there are $\\Theta(\\log n)$ passes.",
  },
  properties: [
    { label: "Stable", value: "No" },
    { label: "In place", value: "Yes" },
    { label: "Adaptive", value: "Partly: sorted input costs one comparison per element per pass" },
    { label: "Shifts", value: "At most the number of inversions" },
  ],
  implementations: [
    {
      language: "python",
      entry: "shell_sort",
      code: `def shell_sort(a):
    """Sort list a in place with Knuth's gaps 1, 4, 13, ... and return it."""
    n = len(a)
    h = 1
    while h < n // 3:
        h = 3 * h + 1
    while h >= 1:
        for i in range(h, n):
            key = a[i]
            j = i
            while j >= h and a[j - h] > key:
                a[j] = a[j - h]
                j -= h
            a[j] = key
        h //= 3
    return a
`,
      tests: [
        {
          args: [[62, 83, 18, 53, 7, 17, 95, 86, 47, 69, 25, 28, 30, 4]],
          expected: [4, 7, 17, 18, 25, 28, 30, 47, 53, 62, 69, 83, 86, 95],
        },
        { args: [[]], expected: [] },
        { args: [[3, 1, 3, 2, 1, 2]], expected: [1, 1, 2, 2, 3, 3] },
      ],
    },
    {
      language: "javascript",
      entry: "shellSort",
      code: `function shellSort(a) {
  const n = a.length;
  let h = 1;
  while (h < Math.floor(n / 3)) h = 3 * h + 1;
  for (; h >= 1; h = Math.floor(h / 3)) {
    for (let i = h; i < n; i++) {
      const key = a[i];
      let j = i;
      while (j >= h && a[j - h] > key) {
        a[j] = a[j - h];
        j -= h;
      }
      a[j] = key;
    }
  }
  return a;
}
`,
      tests: [
        { args: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
        { args: [[1]], expected: [1] },
        { args: [[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]], expected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      ],
    },
  ],
  visualizer: "shell-sort",
  practice: [
    {
      id: "shell-gaps",
      kind: "mcq",
      prompt:
        "With Knuth's rule (start at 1, apply $h \\leftarrow 3h+1$ while $h < \\lfloor n/3 \\rfloor$), which gaps does Shell sort use for $n = 100$?",
      options: ["40, 13, 4, 1", "121, 40, 13, 4, 1", "13, 4, 1", "50, 25, 12, 6, 3, 1"],
      answer: 0,
      explanation:
        "$\\lfloor 100/3 \\rfloor = 33$. From 1: 4 < 33, so 13; 13 < 33, so 40; 40 is not below 33, so stop. The passes use 40, 13, 4, 1.",
      distractors: {
        1: "121 is never reached: the loop stops as soon as $h$ is at least 33.",
        2: "The loop continues past 13, because 13 is still below 33.",
        3: "Those are Shell's original halving gaps, not Knuth's.",
      },
      hints: ["Compute $\\lfloor n/3 \\rfloor$ first, then grow $h$ from 1."],
      objective: "Compute a gap sequence",
    },
    {
      id: "shell-shifts",
      kind: "numeric",
      prompt:
        "Insertion sort makes 55 shifts on [62, 83, 18, 53, 7, 17, 95, 86, 47, 69, 25, 28, 30, 4]. How many shifts does Shell sort with gaps 4 and 1 make? (Use the visualizer's classic preset.)",
      answer: 25,
      explanation:
        "12 shifts in the gap-4 pass and 13 in the gap-1 pass: 25. Long jumps remove several inversions per shift, so fewer shifts are needed than the 55 inversions.",
      hints: [
        "Step through the classic preset; the operation counts panel shows shifts.",
        "Each pass ends with a note about the array being sorted at that gap.",
      ],
      objective: "Compare Shell sort with insertion sort",
    },
    {
      id: "shell-stable",
      kind: "mcq",
      prompt: "Why is Shell sort not stable, although insertion sort is?",
      options: [
        "Passes with a gap above 1 move elements past others they are never compared with",
        "It compares with ≥ instead of >",
        "It uses recursion",
        "The final pass is not insertion sort",
      ],
      answer: 0,
      explanation:
        "An element can jump $h$ places over equal elements in other chains without ever being compared with them, so their original order is lost.",
      distractors: {
        1: "It uses the same strict comparison as insertion sort.",
        2: "Shell sort is a loop, not a recursion.",
        3: "The final pass is exactly insertion sort; the order of equal keys was already disturbed earlier.",
      },
      hints: ["Which elements does a jump of $h$ places skip over?"],
      objective: "Explain stability",
    },
  ],
  exam: {
    definition:
      "Shell sort is an in-place comparison sort that performs insertion sort on elements a gap $h$ apart, for a decreasing sequence of gaps ending in 1.",
    steps: [
      "Choose a gap sequence ending in 1, e.g. Knuth's $1, 4, 13, 40, \\dots$.",
      "For each gap $h$ from largest to smallest: for $i = h$ to $n-1$, insert $A[i]$ into its chain $A[i-h], A[i-2h], \\dots$ by shifting larger elements up by $h$.",
      "After the pass with $h = 1$ the array is sorted.",
    ],
    timeComplexity:
      "Depends on the gaps: $\\Theta(n^2)$ worst case for Shell's $n/2^k$, $O(n^{3/2})$ for Knuth's $3h+1$, $\\Theta(n \\log^2 n)$ for Pratt's $2^p3^q$.",
    spaceComplexity: "$\\Theta(1)$ extra space.",
    correctness:
      "The final pass is insertion sort, which sorts any array; earlier passes only permute elements. An $h$-sorted array stays $h$-sorted after a $k$-sorting pass, so passes do not undo each other.",
    applications: [
      "Small to medium arrays where code size and memory matter (embedded systems)",
      "A simple in-place sort with much better behaviour than insertion sort on shuffled data",
    ],
    limitations: [
      "Not stable",
      "No gap sequence gives $O(n \\log n)$ worst case",
      "Slower than quicksort or merge sort on large arrays",
    ],
    faq: [
      {
        q: "Why not just use insertion sort?",
        a: "Insertion sort moves an element one place per shift, so shuffled data costs $\\Theta(n^2)$ shifts. Large gaps move elements far in one shift.",
      },
      {
        q: "Does the gap sequence have to end in 1?",
        a: "Yes: only the gap-1 pass guarantees a sorted result.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Insertion sort on elements $h$ apart, for decreasing gaps ending in 1.",
          "In place, not stable, running time depends on the gaps.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and the role of the gaps (1).",
          "Pseudocode of the gapped insertion pass (2).",
          "A short trace with two gaps (1).",
          "Complexity for at least one named gap sequence (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Motivation: insertion sort's one-place moves — 1.",
          "Algorithm and pseudocode — 2.",
          "Full trace showing the array after each pass — 3.",
          "Why it is correct; why passes do not undo each other — 2.",
          "Gap sequences and their complexities; stability — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. L. Shell, “A high-speed sorting procedure”, Communications of the ACM 2(7), 1959, pp. 30–32.",
      supports: "The original algorithm with halving gaps.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.1.",
      supports:
        "Shellsort, the $3h+1$ increments, the theorem that $h$-sortedness is preserved, and the analysis of gap sequences including Pratt's.",
    },
    {
      citation:
        "M. Ciura, “Best increments for the average case of Shellsort”, Proc. 13th International Symposium on Fundamentals of Computation Theory (FCT 2001), LNCS 2138, Springer, 2001.",
      supports: "The empirically tuned gap sequence 1, 4, 10, 23, 57, 132, 301, 701.",
    },
    {
      citation:
        "C. G. Plaxton, B. Poonen, T. Suel, “Improved lower bounds for Shellsort”, Proc. 33rd IEEE Symposium on Foundations of Computer Science (FOCS), 1992.",
      supports: "The worst-case lower bound that holds for every increment sequence.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
