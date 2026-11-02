import type { AlgorithmEntry } from "../types";

export const mergeSortedListsEntry: AlgorithmEntry = {
  slug: "merge-sorted-lists",
  name: "Merge Sorted Linked Lists (Two and k)",
  aliases: ["Merge two sorted lists", "Merge k sorted lists", "k-way merge"],
  curriculum: [105, 106],
  domain: "linear-structures",
  subcategory: "Linked lists",
  difficulty: "intermediate",
  summary:
    "Combines sorted linked lists into one sorted list by repeatedly taking the smallest remaining head and appending it, re-pointing next fields instead of copying nodes; with k lists a priority queue of heads finds the smallest.",
  tags: ["linked list", "merge", "priority queue", "heap", "stable"],
  prerequisites: ["Reverse a Linked List (and in Groups of k)", "Heap Sort"],
  related: ["merge-sort", "heap-sort", "reverse-linked-list"],
  problem: {
    input: "Two or more linked lists, each sorted in non-decreasing order.",
    output: "One sorted linked list containing all their nodes; equal values in list order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The smallest value overall is at the head of one of the lists. Take it, and the new smallest is again some list's head. Repeating this builds the merged list from left to right, never looking further than the heads.",
      },
      {
        kind: "p",
        text: "With two lists, comparing the two heads is enough. With $k$ lists, keep the heads in a priority queue so that the smallest can be found quickly.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start the result with a dummy node D; `tail` points to it.",
          "Put each list's head in a priority queue.",
          "Repeatedly remove the smallest head $x$ (ties: the earlier list), set `tail.next ← x` and `tail ← x`, and put $x$'s successor, if any, into the queue.",
          "When the queue is empty, `D.next` is the merged list.",
        ],
      },
      { kind: "heading", text: "Worked examples" },
      {
        kind: "table",
        head: ["Lists", "Merged", "Comparisons"],
        rows: [
          ["1 2 4 | 1 3 4", "1 1 2 3 4 4", "5"],
          ["1 4 5 | 1 3 4 | 2 6", "1 1 2 3 4 4 5 6", "13"],
        ],
      },
      {
        kind: "p",
        text: "Merging two lists of three makes 5 comparisons: one for each node taken while both lists still have nodes; the last 4 is taken without a comparison. The two 1s come out in list order (the first list's 1 first), which makes the merge *stable*. With three lists this visualizer finds the smallest of up to three heads by scanning them (up to 2 comparisons per node); a binary heap would use $O(\\log k)$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**A dummy head** removes the special case of choosing the first node of the result.",
          "**No copying:** only `next` pointers change, so merging takes $O(1)$ extra space for two lists (plus the queue of $k$ heads for $k$ lists).",
          "**Ties to the earlier list** keep the merge stable, which merge sort on linked lists relies on.",
          "**Divide and conquer** is an alternative for $k$ lists: merge them in pairs, then pairs of results, for $O(N \\log k)$ without a heap.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "**Invariant:** the merged prefix holds the smallest nodes taken so far, in order, and every remaining node is at least as large as the last one taken. Each list is sorted, so the smallest remaining node is some list's head; taking it keeps the invariant.",
      },
      { kind: "heading", text: "Cost" },
      {
        kind: "p",
        text: "Two lists of lengths $n$ and $m$: at most $n + m - 1$ comparisons, $\\Theta(n + m)$ time. $k$ lists with $N$ nodes in all: each node enters and leaves the queue once, so with a binary heap the time is $O(N \\log k)$; with the linear scan used here it is $O(Nk)$. The property tests check the scan's bound of at most $N(k - 1)$ comparisons.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Merge sort for linked lists** splits the list (with slow and fast pointers) and merges the sorted halves: $O(n \\log n)$ time and $O(\\log n)$ stack, with no extra arrays.",
          "**External sorting** merges many sorted runs from disk with exactly this $k$-way merge.",
          "**Tournament trees** (loser trees) reduce the comparisons per output element in $k$-way merging.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(N)", average: "O(N \\log k)", worst: "O(N \\log k)" },
    space: "O(k)",
    worstClass: "n log n",
    note: "With a binary heap of the $k$ heads; $N$ = total nodes. Two lists: $\\Theta(n + m)$ time and $O(1)$ space.",
  },
  properties: [
    { label: "Stable", value: "Yes, with ties going to the earlier list" },
    { label: "Copies nodes", value: "No: next pointers are re-linked" },
  ],
  implementations: [
    {
      language: "python",
      entry: "merge_k",
      code: `import heapq


def merge_k(lists):
    """Merge sorted Python lists the way a k-way linked-list merge would."""
    heap = [(l[0], j, 0) for j, l in enumerate(lists) if l]
    heapq.heapify(heap)
    out = []
    while heap:
        value, j, i = heapq.heappop(heap)
        out.append(value)
        if i + 1 < len(lists[j]):
            heapq.heappush(heap, (lists[j][i + 1], j, i + 1))
    return out
`,
      tests: [
        {
          args: [
            [
              [1, 4, 5],
              [1, 3, 4],
              [2, 6],
            ],
          ],
          expected: [1, 1, 2, 3, 4, 4, 5, 6],
        },
        { args: [[[], [2], [1, 3]]], expected: [1, 2, 3] },
      ],
    },
    {
      language: "javascript",
      entry: "mergeTwo",
      code: `// Merge two sorted linked lists by re-pointing next fields; values in, values out.
function mergeTwo(a, b) {
  const build = (vs) => vs.reduceRight((next, value) => ({ value, next }), null);
  let [x, y] = [build(a), build(b)];
  const dummy = { next: null };
  let tail = dummy;
  while (x && y) {
    // Ties take from a (the earlier list), which keeps the merge stable.
    if (y.value < x.value) {
      tail = tail.next = y;
      y = y.next;
    } else {
      tail = tail.next = x;
      x = x.next;
    }
  }
  tail.next = x || y;
  const out = [];
  for (let n = dummy.next; n; n = n.next) out.push(n.value);
  return out;
}
`,
      tests: [
        {
          args: [
            [1, 2, 4],
            [1, 3, 4],
          ],
          expected: [1, 1, 2, 3, 4, 4],
        },
        { args: [[], [0]], expected: [0] },
      ],
    },
  ],
  visualizer: "merge-sorted-lists",
  practice: [
    {
      id: "merge-comparisons",
      kind: "numeric",
      prompt: "At most how many comparisons does merging sorted lists of lengths 4 and 6 make?",
      answer: 9,
      explanation:
        "Every comparison outputs one node while both lists are non-empty, and the last node never needs one: $4 + 6 - 1 = 9$.",
      hints: ["When does the merge stop comparing?"],
      objective: "Bound the comparisons",
    },
    {
      id: "merge-heap",
      kind: "mcq",
      prompt:
        "Merging k sorted lists with N nodes in total using a binary min-heap of the heads takes…",
      options: ["O(N log k)", "O(N log N)", "O(Nk)", "O(N + k)"],
      answer: 0,
      explanation:
        "Each of the $N$ nodes is pushed and popped once on a heap of at most $k$ elements.",
      distractors: {
        1: "The heap never holds more than $k$ elements, so each operation is $O(\\log k)$.",
        2: "That is the cost of scanning all heads for every node, without a heap.",
        3: "Each node still needs a heap operation.",
      },
      hints: ["How big can the heap get?"],
      objective: "Analyse k-way merging",
    },
    {
      id: "merge-stable",
      kind: "mcq",
      prompt: "Two heads are equal. Which should be taken first so that the merge is stable?",
      options: [
        "The one from the earlier list",
        "Either; it makes no difference",
        "The one from the longer list",
        "The one from the later list",
      ],
      answer: 0,
      explanation:
        "Stability means equal elements keep their original relative order; taking the earlier list's first does that.",
      distractors: {
        1: "For records with equal keys but different data, the order matters.",
        2: "List length is irrelevant to the order of equal elements.",
        3: "That reverses the order of equal elements from different lists.",
      },
      hints: ["What does stable mean for equal values?"],
      objective: "Keep the merge stable",
    },
  ],
  exam: {
    definition:
      "Merging sorted linked lists builds one sorted list by repeatedly appending the smallest current head; for $k$ lists the heads are kept in a min-priority queue.",
    steps: [
      "Create a dummy node; tail ← dummy; insert all heads into a min-heap.",
      "While the heap is non-empty: extract the minimum x; tail.next ← x; tail ← x; insert x.next if present.",
      "Return dummy.next.",
    ],
    timeComplexity: "$\\Theta(n + m)$ for two lists; $O(N \\log k)$ for $k$ lists with a heap.",
    spaceComplexity: "$O(1)$ for two lists; $O(k)$ for the heap.",
    correctness:
      "The smallest remaining element is always some list's head, so appending it keeps the output sorted.",
    applications: [
      "Merge sort on linked lists",
      "External sorting of runs",
      "Merging sorted streams or log files",
    ],
    limitations: ["Needs sorted inputs"],
    faq: [
      {
        q: "Why not concatenate and sort?",
        a: "That costs $O(N \\log N)$ and ignores the existing order; merging is $O(N \\log k)$.",
      },
      {
        q: "Is extra memory needed?",
        a: "No new nodes: only the heap of heads (or nothing, for two lists).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Repeatedly append the smallest head.",
          "$O(n + m)$ for two lists, $O(N \\log k)$ for $k$ with a heap.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Two-list merge with a dummy node (2).",
          "Trace (1).",
          "k-way merge with a heap and its cost (2).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Two-list merge and invariant — 3.",
          "Trace of a 3-list merge with the heap contents — 3.",
          "Complexity, both methods — 2.",
          "Stability and applications — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §2.3.1 and Exercise 6.5-9.",
      supports:
        "The merge procedure, and merging $k$ sorted lists in $O(n \\lg k)$ with a min-heap.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.4 and §5.4.1.",
      supports: "Merging, list merge sort, and multiway merging with tournament (loser) trees.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
