import type { AlgorithmEntry } from "../types";

export const reverseLinkedListEntry: AlgorithmEntry = {
  slug: "reverse-linked-list",
  name: "Reverse a Linked List (and in Groups of k)",
  aliases: ["Linked list reversal", "Reverse nodes in k-group"],
  curriculum: [101, 102],
  domain: "linear-structures",
  subcategory: "Linked lists",
  difficulty: "beginner",
  summary:
    "Reverses a singly linked list in place by turning each node's next pointer to point at the node before it; the same loop, run on blocks of k nodes, reverses the list in groups.",
  tags: ["linked list", "pointers", "in-place", "three pointers"],
  prerequisites: ["Linked lists"],
  related: ["floyd-cycle", "list-two-pointers", "merge-sorted-lists"],
  problem: {
    input: "A singly linked list of $n$ nodes and a group size $k$ ($k = n$ for the whole list).",
    output: "The same nodes, re-linked so that each full group of $k$ appears in reverse order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each node only knows the node after it. To reverse the list you walk along it and turn every arrow around. The difficulty is not to lose the rest of the list: before turning a node's arrow backwards, remember where it pointed.",
      },
      {
        kind: "p",
        text: "Three variables are enough: `prev` (the part already reversed), `curr` (the node being turned) and `next` (the rest of the list, saved before it is cut off).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set `prev` to the node after the group (null for the whole list) and `curr` to the group's first node.",
          "Repeat $k$ times: `next ← curr.next`; `curr.next ← prev`; `prev ← curr`; `curr ← next`.",
          "Point the node before the group (or the head pointer) at `prev`, the group's old last node. The group's old first node is now its last; the next group starts after it.",
          "Stop when fewer than $k$ nodes remain; they keep their order.",
        ],
      },
      { kind: "heading", text: "Worked examples" },
      {
        kind: "table",
        head: ["List", "k", "Result", "Pointer assignments"],
        rows: [
          ["1 → 2 → 3 → 4 → 5", "5 (whole list)", "5 → 4 → 3 → 2 → 1", "6"],
          ["1 → 2 → 3 → 4 → 5", "2", "2 → 1 → 4 → 3 → 5", "6"],
          ["10 → 20 → … → 80 (8 nodes)", "3", "30 → 20 → 10 → 60 → 50 → 40 → 70 → 80", "8"],
        ],
      },
      {
        kind: "p",
        text: "Each full group costs $k + 1$ pointer assignments: one per node, plus re-pointing the link into the group. Two groups of 3 cost 8; the last two nodes, 70 and 80, are fewer than $k$ and stay as they were.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Save `next` before overwriting `curr.next`.** Writing the pointer first loses the rest of the list, the classic bug.",
          "**A dummy (sentinel) head node** makes the first group no different from the others: the link into every group is some node's `next` field.",
          "**Check that $k$ nodes remain** before reversing a group, if a short final group must keep its order.",
          "**Recursion** gives a short version (`reverse(rest)`, then attach the current node at the end), but uses $O(n)$ stack: iteration is preferred for long lists.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Loop invariant" },
      {
        kind: "p",
        text: "Before each iteration of the inner loop, the nodes from the group's start up to `prev` are reversed and end at the node after the group, and `curr` is the first node not yet turned, still linked to the rest of the original group. Each iteration moves one node from the unreversed to the reversed part. After $k$ iterations the whole group is reversed and `prev` is its new first node.",
      },
      { kind: "heading", text: "Cost" },
      {
        kind: "p",
        text: "Every node is visited a constant number of times: once while checking that the group is complete and once while reversing it. So the time is $\\Theta(n)$ and the extra space $\\Theta(1)$. Exactly $\\lfloor n/k \\rfloor (k + 1)$ pointer assignments are made; the property tests check this formula on random lists.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Doubly linked lists** reverse by swapping each node's `next` and `prev` fields.",
          "**Reversal as a building block:** checking a palindrome, adding numbers stored most-significant-digit first, and reordering a list (first, last, second, second-last, …) all reverse part of a list.",
          "**Persistent lists** (as in functional languages) cannot be reversed in place; reversal builds a new list in $\\Theta(n)$.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n)", average: "\\Theta(n)", worst: "\\Theta(n)" },
    space: "\\Theta(1)",
    worstClass: "n",
  },
  properties: [
    { label: "In place", value: "Yes: only next pointers change" },
    { label: "Pointer assignments", value: "$\\lfloor n/k \\rfloor (k + 1)$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "reverse_values",
      code: `class Node:
    def __init__(self, value, next=None):
        self.value, self.next = value, next


def reverse(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev


def reverse_values(values):
    """Build a list, reverse it in place, return its values."""
    head = None
    for v in reversed(values):
        head = Node(v, head)
    out, node = [], reverse(head)
    while node:
        out.append(node.value)
        node = node.next
    return out
`,
      tests: [
        { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { args: [[7]], expected: [7] },
        { args: [[]], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "reverseInGroups",
      code: `// Reverse in groups of k; values in, values out (a list of {value, next} nodes inside).
function reverseInGroups(values, k) {
  const dummy = { next: null };
  let tail = dummy;
  for (const value of values) tail = tail.next = { value, next: null };
  let before = dummy;
  for (;;) {
    let probe = before.next;
    let count = 0;
    while (probe && count < k) {
      probe = probe.next;
      count++;
    }
    if (count < k) break;
    const first = before.next;
    let prev = probe;
    let curr = first;
    for (let i = 0; i < k; i++) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    before.next = prev;
    before = first;
  }
  const out = [];
  for (let n = dummy.next; n; n = n.next) out.push(n.value);
  return out;
}
`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 2], expected: [2, 1, 4, 3, 5] },
        { args: [[10, 20, 30, 40, 50, 60, 70, 80], 3], expected: [30, 20, 10, 60, 50, 40, 70, 80] },
        { args: [[1, 2, 3], 3], expected: [3, 2, 1] },
      ],
    },
  ],
  visualizer: "reverse-linked-list",
  practice: [
    {
      id: "rev-order",
      kind: "mcq",
      prompt: "In the reversal loop, which line must come first?",
      options: ["next ← curr.next", "curr.next ← prev", "prev ← curr", "curr ← next"],
      answer: 0,
      explanation:
        "Saving `curr.next` first is what keeps the rest of the list reachable once `curr.next` is overwritten.",
      distractors: {
        1: "Overwriting `curr.next` first loses the only reference to the rest of the list.",
        2: "Moving `prev` first is harmless only if `curr.next` was already saved.",
        3: "`next` has not been computed yet.",
      },
      hints: ["What would be lost if `curr.next` changed before anything else?"],
      objective: "Order the pointer updates",
    },
    {
      id: "rev-groups",
      kind: "mcq",
      prompt: "What does reversing 1 → 2 → 3 → 4 → 5 → 6 → 7 in groups of 3 give?",
      options: [
        "3 → 2 → 1 → 6 → 5 → 4 → 7",
        "7 → 6 → 5 → 4 → 3 → 2 → 1",
        "3 → 2 → 1 → 6 → 5 → 4",
        "1 → 2 → 3 → 6 → 5 → 4 → 7",
      ],
      answer: 0,
      explanation:
        "Two full groups are reversed; the single node 7 is fewer than $k$ and stays at the end.",
      distractors: {
        1: "That reverses the whole list.",
        2: "No node is dropped: 7 stays.",
        3: "The first group is reversed too.",
      },
      hints: ["Split into 1 2 3 | 4 5 6 | 7."],
      objective: "Reverse in groups",
    },
    {
      id: "rev-count",
      kind: "numeric",
      prompt: "How many pointer assignments does reversing a 9-node list in groups of 4 make?",
      answer: 10,
      explanation: "$\\lfloor 9/4 \\rfloor = 2$ full groups, each costing $k + 1 = 5$ assignments.",
      hints: ["Each full group costs one assignment per node plus one for the link into it."],
      objective: "Count the work",
    },
  ],
  exam: {
    definition:
      "Linked-list reversal re-links the nodes of a singly linked list in reverse order by making each node's next pointer point to its predecessor; reversal in groups applies this to consecutive blocks of $k$ nodes.",
    steps: [
      "prev ← null (or the node after the group); curr ← head of the group.",
      "Repeat: next ← curr.next; curr.next ← prev; prev ← curr; curr ← next.",
      "Attach prev (the new first node) to the node before the group.",
    ],
    timeComplexity: "$\\Theta(n)$.",
    spaceComplexity: "$\\Theta(1)$ iteratively; $\\Theta(n)$ stack recursively.",
    correctness:
      "Invariant: the processed prefix is reversed and attached to prev, and curr points to the unprocessed rest, so no node is lost.",
    applications: [
      "Palindrome checks and reordering lists",
      "Undo stacks and reversing the order of processing",
    ],
    limitations: ["Only for mutable lists; persistent lists need a copy"],
    faq: [
      {
        q: "Why three pointers?",
        a: "prev holds the reversed part, curr the node being turned, next the rest of the list.",
      },
      {
        q: "What about a doubly linked list?",
        a: "Swap each node's next and prev fields and return the old tail.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Turn each next pointer to the previous node, saving the old next first.",
          "$\\Theta(n)$ time, $\\Theta(1)$ space.",
        ],
      },
      {
        marks: 5,
        outline: ["Pointer-update loop (2).", "Trace on a short list (2).", "Complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "Problem and pointer representation — 1.",
          "Iterative algorithm with the three pointers — 3.",
          "Trace showing every pointer change — 3.",
          "Invariant and complexity — 2.",
          "Group reversal or recursive variant — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §10.2 (and Exercise 10.2-7).",
      supports:
        "Linked lists, sentinels, and in-place reversal of a singly linked list in $\\Theta(n)$ time.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
