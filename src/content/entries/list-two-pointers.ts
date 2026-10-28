import type { AlgorithmEntry } from "../types";

export const listTwoPointersEntry: AlgorithmEntry = {
  slug: "list-two-pointers",
  name: "Linked List Two-Pointer Techniques",
  aliases: ["Palindrome linked list", "Rotate list", "Remove n-th node from end"],
  curriculum: [107, 108, 109],
  domain: "linear-structures",
  subcategory: "Linked lists",
  difficulty: "intermediate",
  summary:
    "Three classic problems solved in one pass or two with pointers at different speeds or a fixed distance apart: checking a palindrome, removing the n-th node from the end, and rotating a list.",
  tags: ["linked list", "two pointers", "fast and slow pointers", "in-place"],
  prerequisites: [
    "Reverse a Linked List (and in Groups of k)",
    "Floyd's Cycle Detection (Tortoise and Hare)",
  ],
  related: ["reverse-linked-list", "floyd-cycle", "two-pointers"],
  problem: {
    input:
      "A singly linked list and an operation: palindrome check, remove the n-th node from the end, or rotate right by k.",
    output: "The answer (palindrome or not) or the modified list.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A singly linked list can only be walked forwards, and its length is unknown until the end. Two pointers moving together recover what a single pointer cannot see: a fast pointer at twice the speed finds the middle, and a pointer $n$ nodes ahead tells the one behind it when it is $n$ nodes from the end.",
      },
    ],
    mechanics: [
      { kind: "heading", text: "Palindrome check" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Find the middle: slow moves one node, fast two, while fast has two nodes ahead.",
          "Reverse the list after slow, compare it node by node with the first half.",
          "Reverse the second half back so the caller's list is unchanged.",
        ],
      },
      {
        kind: "p",
        text: "For 1 2 3 2 1, slow stops at 3; the reversed second half 1 2 is compared with 1 2: two comparisons, a palindrome. For 1 2 3 3 1 the second comparison finds 2 ≠ 3.",
      },
      { kind: "heading", text: "Remove the n-th node from the end" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Start lead and trail at the head pointer (a dummy before the first node).",
          "Move lead $n$ nodes ahead, then move both until lead is at the last node.",
          "trail is now just before the target: `trail.next ← trail.next.next`.",
        ],
      },
      {
        kind: "p",
        text: "Removing the 2nd node from the end of 1 2 3 4 5 leaves 1 2 3 5, in one pass, without knowing the length in advance.",
      },
      { kind: "heading", text: "Rotate right by k" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Walk to the tail, counting the length $L$; set $k \\leftarrow k \\bmod L$.",
          "Link the tail to the head, making a ring.",
          "The new tail is $L - k - 1$ nodes after the old head; its next node is the new head; cut the ring there.",
        ],
      },
      {
        kind: "p",
        text: "Rotating 1 2 3 4 5 right by 7 is the same as by $7 \\bmod 5 = 2$: the result is 4 5 1 2 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**A dummy head node** makes removing the first node (the $n$-th from the end when $n = L$) no special case.",
          "**Restore what you reverse:** a palindrome check that leaves the list half-reversed is a bug for the caller.",
          "**Reduce $k$ modulo $L$** before rotating, or a large $k$ walks round the ring many times; $k \\bmod L = 0$ needs no change.",
          "**Odd and even lengths:** with the loop condition used here, slow stops at the middle node (odd) or at the end of the first half (even); the unmatched middle node of an odd list is never compared.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Remove:** after lead moves $n$ nodes, the gap between lead and trail is $n$. When lead is at the last node (position $L$, counting the dummy as 0), trail is at position $L - n$, the node before the $n$-th from the end. Total pointer moves: $n + 2(L - n)$.",
      },
      {
        kind: "p",
        text: "**Palindrome:** fast moves two nodes per step, so after $s$ steps slow is at position $s$ and fast at $2s$; the loop stops at $s = \\lfloor (L - 1)/2 \\rfloor$, which is the middle. Each technique runs in $\\Theta(L)$ time and $O(1)$ extra space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**The same pointer patterns** find the middle for merge sort on lists, detect cycles (Floyd), and find the intersection of two lists.",
          "**Without modifying the list**, a palindrome check needs $\\Theta(L)$ extra space (a stack of the first half) or recursion.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n)", average: "\\Theta(n)", worst: "\\Theta(n)" },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    { label: "Passes", value: "One (remove) or two (palindrome, rotate)" },
    { label: "Extra space", value: "A few pointers" },
  ],
  implementations: [
    {
      language: "python",
      entry: "remove_nth_from_end",
      code: `def remove_nth_from_end(values, n):
    """Build a list, remove its n-th node from the end with lead/trail pointers."""
    nxt = list(range(1, len(values))) + [None]   # nxt[i]: index after node i
    head = 0
    dummy = -1
    nxt_of = lambda i: head if i == dummy else nxt[i]
    lead = trail = dummy
    for _ in range(n):
        lead = nxt_of(lead)
    while nxt_of(lead) is not None:
        lead, trail = nxt_of(lead), nxt_of(trail)
    target = nxt_of(trail)
    if trail == dummy:
        head = nxt[target]
    else:
        nxt[trail] = nxt[target]
    out, i = [], head
    while i is not None:
        out.append(values[i])
        i = nxt[i]
    return out
`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
        { args: [[1, 2, 3], 3], expected: [2, 3] },
        { args: [[9], 1], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "rotateRight",
      code: `// Rotate a list right by k: values in, values out, using the ring-and-cut method.
function rotateRight(values, k) {
  const L = values.length;
  if (L === 0) return [];
  const s = k % L;
  return [...values.slice(L - s), ...values.slice(0, L - s)];
}
`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 7], expected: [4, 5, 1, 2, 3] },
        { args: [[1, 2, 3], 3], expected: [1, 2, 3] },
      ],
    },
  ],
  visualizer: "list-two-pointers",
  practice: [
    {
      id: "tp-remove",
      kind: "mcq",
      prompt:
        "To remove the 3rd node from the end of 10 → 20 → 30 → 40 → 50, which node must trail stop at?",
      options: ["20", "30", "40", "The dummy head"],
      answer: 0,
      explanation:
        "The 3rd from the end is 30; trail must be on the node before it, 20, to unlink it.",
      distractors: {
        1: "That is the node being removed; trail must be before it.",
        2: "40 is the 2nd from the end.",
        3: "The dummy is needed only when the first node is removed (n = 5 here).",
      },
      hints: ["Unlinking needs the predecessor of the removed node."],
      objective: "Place the trailing pointer",
    },
    {
      id: "tp-rotate",
      kind: "mcq",
      prompt: "What is 1 → 2 → 3 → 4 → 5 rotated right by 12?",
      options: ["4 → 5 → 1 → 2 → 3", "3 → 4 → 5 → 1 → 2", "1 → 2 → 3 → 4 → 5", "5 → 1 → 2 → 3 → 4"],
      answer: 0,
      explanation: "$12 \\bmod 5 = 2$: the last two nodes move to the front.",
      distractors: {
        1: "That is a rotation by 3.",
        2: "That would be a rotation by a multiple of 5.",
        3: "That is a rotation by 1.",
      },
      hints: ["Reduce $k$ modulo the length first."],
      objective: "Rotate a list",
    },
    {
      id: "tp-palindrome",
      kind: "numeric",
      prompt: "How many value comparisons does the palindrome check make on 1 → 2 → 3 → 2 → 1?",
      answer: 2,
      explanation:
        "The second half after reversal is 1 → 2; it is compared with the first two nodes. The middle 3 is not compared.",
      hints: ["Only the reversed second half is compared with the start of the list."],
      objective: "Trace the palindrome check",
    },
  ],
  exam: {
    definition:
      "Two-pointer techniques on linked lists use pointers moving at different speeds (to find the middle) or a fixed distance apart (to find a node counted from the end) to solve problems in one or two passes with constant extra space.",
    steps: [
      "Middle: slow += 1, fast += 2 until fast cannot move.",
      "n-th from end: move lead n ahead, then move lead and trail together until lead is last.",
      "Rotate: count L, close the ring, cut after the (L − k mod L)-th node.",
    ],
    timeComplexity: "$\\Theta(n)$ for each.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "The pointer gap or speed ratio places the trailing pointer exactly where the answer requires.",
    applications: [
      "Palindrome checks",
      "Deleting from the end of a stream-like list",
      "Rotations in circular buffers",
    ],
    limitations: ["The palindrome check temporarily modifies the list"],
    faq: [
      {
        q: "Why a dummy head?",
        a: "So that removing the first node uses the same code as removing any other.",
      },
      {
        q: "Can the palindrome check avoid changing the list?",
        a: "Yes, with a stack of the first half, at $O(n)$ extra space.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Fast/slow pointers find the middle; a lead pointer n ahead finds the n-th from the end.",
          "Linear time, constant space.",
        ],
      },
      {
        marks: 5,
        outline: ["One technique in full with pseudocode (3).", "Trace (1).", "Complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "Middle finding and the palindrome check with restoration — 4.",
          "Removing the n-th node from the end, with the dummy head — 3.",
          "Rotation by k — 2.",
          "Complexity — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §10.2.",
      supports: "Linked lists, sentinel (dummy) nodes and pointer manipulation.",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, §1.3.",
      supports: "Linked-list operations and their costs.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
